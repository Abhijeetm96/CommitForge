import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { PhysicalRockerSwitch } from '../../../components/simulation/PhysicalRockerSwitch';
import { CoolingTurbineFan } from '../../../components/simulation/CoolingTurbineFan';
import { LuminousBulb } from '../../../components/simulation/LuminousBulb';
import { LiveTrafficStream } from '../../../components/simulation/LiveTrafficStream';
import {
  Server,
  Globe,
  Activity,
} from 'lucide-react';
import '../../../components/simulation/simulation.css';

interface SimulatedPod {
  id: string;
  name: string;
  node: 'node-01' | 'node-02';
  version: 'v1' | 'v2';
  status: 'Running' | 'Pending' | 'Terminating' | 'Failed';
  cpu: number;
}

interface KubeLog {
  id: string;
  timestamp: string;
  cause: string;
  effect: string;
  type: 'traffic' | 'chaos' | 'scale' | 'rollout' | 'power';
}

export const EnterpriseKubeSimulator: React.FC = () => {
  const { executeCommand } = useApp();

  // Control deck switches
  const [trafficActive, setTrafficActive] = useState<boolean>(true);
  const [chaosNode1Off, setChaosNode1Off] = useState<boolean>(false);
  const [hpaSurgeActive, setHpaSurgeActive] = useState<boolean>(false);
  const [rolloutV2Active, setRolloutV2Active] = useState<boolean>(false);

  // Worker Node power
  const [node1Power, setNode1Power] = useState<boolean>(true);
  const [node2Power, setNode2Power] = useState<boolean>(true);

  // Active Pods state
  const [pods, setPods] = useState<SimulatedPod[]>([
    { id: 'pod-1', name: 'frontend-web-7d4f9-a1', node: 'node-01', version: 'v1', status: 'Running', cpu: 32 },
    { id: 'pod-2', name: 'frontend-web-7d4f9-b2', node: 'node-01', version: 'v1', status: 'Running', cpu: 28 },
    { id: 'pod-3', name: 'frontend-web-7d4f9-c3', node: 'node-02', version: 'v1', status: 'Running', cpu: 30 },
  ]);

  // Telemetry counters
  const [reqCount, setReqCount] = useState<number>(3820);
  const [controlPlaneFlashing, setControlPlaneFlashing] = useState<boolean>(false);

  // Live Cause-and-Effect Explanation Logs
  const [logs, setLogs] = useState<KubeLog[]>([
    {
      id: 'k-init-1',
      timestamp: '12:00:01',
      cause: 'Cluster Initialized',
      effect: '3 Pods scheduled across Worker Node 1 and Node 2. Cooling fans spinning at 1,950 RPM.',
      type: 'power',
    },
    {
      id: 'k-init-2',
      timestamp: '12:00:04',
      cause: 'Ingress Traffic Active',
      effect: 'Client requests distributed round-robin via Service ClusterIP with zero dropped packets.',
      type: 'traffic',
    },
  ]);

  const addLog = (cause: string, effect: string, type: KubeLog['type']) => {
    const time = new Date().toLocaleTimeString();
    setLogs((prev) => [
      { id: Math.random().toString(), timestamp: time, cause, effect, type },
      ...prev.slice(0, 7),
    ]);
  };

  // Pulse Control Plane light when state changes
  const triggerControlPlanePulse = () => {
    setControlPlaneFlashing(true);
    setTimeout(() => setControlPlaneFlashing(false), 1400);
  };

  // Increment traffic counter
  useEffect(() => {
    const interval = setInterval(() => {
      if (trafficActive) {
        setReqCount((prev) => prev + (hpaSurgeActive ? 140 : 35));
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [trafficActive, hpaSurgeActive]);

  // CHAOS: PULL PLUG ON WORKER NODE 01
  const handleChaosToggle = (turnOff: boolean) => {
    setChaosNode1Off(turnOff);
    setNode1Power(!turnOff);
    triggerControlPlanePulse();

    if (turnOff) {
      executeCommand('kubectl cordon worker-node-01');
      // Node 1 dies -> Pods on Node 1 terminate, reschedule to Node 2
      setPods((prev) => {
        const remaining = prev.filter((p) => p.node === 'node-02');
        const relocated: SimulatedPod[] = [
          { id: 'pod-reloc-1', name: 'frontend-web-7d4f9-d4', node: 'node-02', version: rolloutV2Active ? 'v2' : 'v1', status: 'Running', cpu: 45 },
          { id: 'pod-reloc-2', name: 'frontend-web-7d4f9-e5', node: 'node-02', version: rolloutV2Active ? 'v2' : 'v1', status: 'Running', cpu: 48 },
        ];
        return [...remaining, ...relocated];
      });

      addLog(
        '💥 CHAOS MONKEY: Power Cut to Worker Node 01',
        'Node 1 fan stopped (0 RPM), power bulb died! Control Plane detected heartbeat loss -> Evicted pods and scheduled 2 replacements on Node 02. Traffic rerouted with 0 downtime!',
        'chaos'
      );
    } else {
      executeCommand('kubectl uncordon worker-node-01');
      // Rebalance
      setPods([
        { id: 'pod-1', name: 'frontend-web-7d4f9-a1', node: 'node-01', version: rolloutV2Active ? 'v2' : 'v1', status: 'Running', cpu: 32 },
        { id: 'pod-2', name: 'frontend-web-7d4f9-b2', node: 'node-01', version: rolloutV2Active ? 'v2' : 'v1', status: 'Running', cpu: 28 },
        { id: 'pod-3', name: 'frontend-web-7d4f9-c3', node: 'node-02', version: rolloutV2Active ? 'v2' : 'v1', status: 'Running', cpu: 30 },
      ]);
      addLog(
        'Worker Node 01 Power Restored',
        'Node 1 turbine fan spun back up to 1,950 RPM, status bulb turned green. Workloads rebalanced.',
        'chaos'
      );
    }
  };

  // HPA AUTOSCALE SURGE (3 -> 5 Pods)
  const handleHpaToggle = (surge: boolean) => {
    setHpaSurgeActive(surge);
    triggerControlPlanePulse();

    if (surge) {
      executeCommand('kubectl scale deployment frontend-web --replicas=5');
      setPods((prev) => [
        ...prev,
        { id: 'pod-hpa-1', name: 'frontend-web-7d4f9-h1', node: node1Power ? 'node-01' : 'node-02', version: rolloutV2Active ? 'v2' : 'v1', status: 'Running', cpu: 65 },
        { id: 'pod-hpa-2', name: 'frontend-web-7d4f9-h2', node: 'node-02', version: rolloutV2Active ? 'v2' : 'v1', status: 'Running', cpu: 62 },
      ]);
      addLog(
        '🚀 HPA Autoscaling Surge (40,000 req/s)',
        'CPU exceeded 75% target. Kube-Controller scaled replicas from 3 -> 5! New pod bulbs ignited, fans engaged, load balancer paths divided.',
        'scale'
      );
    } else {
      executeCommand('kubectl scale deployment frontend-web --replicas=3');
      setPods((prev) => prev.slice(0, 3));
      addLog(
        'HPA Traffic Normalized',
        'Load returned to base rate. Cooldown period triggered, excess replicas scaled down.',
        'scale'
      );
    }
  };

  // ROLLING UPDATE (v1 -> v2 Canary)
  const handleRolloutToggle = (v2: boolean) => {
    setRolloutV2Active(v2);
    triggerControlPlanePulse();

    if (v2) {
      executeCommand('kubectl set image deployment/frontend-web nginx=nginx:v2.0-canary');
      setPods((prev) =>
        prev.map((p) => ({
          ...p,
          version: 'v2',
        }))
      );
      addLog(
        '🔄 Rolling Update: v1.0 ➔ v2.0 Canary Released',
        'Zero-downtime rolling update: Pod status bulbs switched to neon purple (v2.0), new container fans engaged, ready probes passed HTTP 200 OK.',
        'rollout'
      );
    } else {
      executeCommand('kubectl rollout undo deployment/frontend-web');
      setPods((prev) =>
        prev.map((p) => ({
          ...p,
          version: 'v1',
        }))
      );
      addLog(
        'Rolled Back to v1.0 Stable',
        'Deployment smoothly restored to stable v1.0 image baseline.',
        'rollout'
      );
    }
  };

  const node1Pods = pods.filter((p) => p.node === 'node-01');
  const node2Pods = pods.filter((p) => p.node === 'node-02');

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: '100%',
        background: '#040711',
        color: '#f8fafc',
        boxSizing: 'border-box',
        overflowY: 'auto',
        padding: '1rem 1.25rem',
        gap: '1rem',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      {/* === HEADER & TELEMETRY === */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          paddingBottom: '0.85rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #326ce5, #1d4ed8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 16px rgba(50, 108, 229, 0.45)',
            }}
          >
            <Server size={20} color="#fff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h2 style={{ fontSize: '1.05rem', fontWeight: 900, margin: 0, color: '#fff', letterSpacing: '-0.02em' }}>
                Enterprise Kubernetes Cluster Rig &bull; Real Working Environment
              </h2>
              <span
                style={{
                  fontSize: '0.65rem',
                  fontWeight: 800,
                  padding: '0.15rem 0.5rem',
                  borderRadius: '999px',
                  background: 'rgba(50, 108, 229, 0.15)',
                  color: '#38bdf8',
                  border: '1px solid #326ce5',
                }}
              >
                PROD-CLUSTER-US-EAST
              </span>
            </div>
            <p style={{ fontSize: '0.72rem', color: '#94a3b8', margin: '0.2rem 0 0 0' }}>
              Direct Cause-and-Effect: Flip switches to simulate user traffic, inject Chaos Monkey node failures, trigger HPA autoscaling, and watch self-healing happen simultaneously!
            </p>
          </div>
        </div>

        {/* Global Cluster HUD Counters */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div
            style={{
              background: 'rgba(15, 23, 42, 0.8)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '8px',
              padding: '0.35rem 0.75rem',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '0.62rem', color: '#94a3b8', fontWeight: 600 }}>DESIRED / READY</div>
            <div style={{ fontSize: '0.85rem', fontWeight: 900, color: '#4ade80', fontFamily: 'var(--font-mono)' }}>
              {pods.length} / {pods.length} PODS
            </div>
          </div>

          <div
            style={{
              background: 'rgba(15, 23, 42, 0.8)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '8px',
              padding: '0.35rem 0.75rem',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '0.62rem', color: '#94a3b8', fontWeight: 600 }}>INGRESS TRAFFIC</div>
            <div style={{ fontSize: '0.85rem', fontWeight: 900, color: '#38bdf8', fontFamily: 'var(--font-mono)' }}>
              {reqCount.toLocaleString()} reqs
            </div>
          </div>
        </div>
      </div>

      {/* === ENTERPRISE KUBERNETES CONTROL SWITCHBOARD === */}
      <div
        style={{
          background: 'linear-gradient(180deg, #0f172a 0%, #090e1a 100%)',
          border: '1px solid rgba(50, 108, 229, 0.35)',
          borderRadius: '12px',
          padding: '0.85rem 1.1rem',
          boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
          {/* Live Ingress Traffic Switch */}
          <PhysicalRockerSwitch
            id="k8s-traffic-switch"
            label="Live User Ingress"
            sublabel={trafficActive ? 'Laser packets streaming' : 'Paused'}
            checked={trafficActive}
            onChange={(checked) => {
              setTrafficActive(checked);
              addLog(
                checked ? 'User Traffic Switch TURNED ON' : 'User Traffic Switch TURNED OFF',
                checked ? 'Global HTTP traffic streaming into Ingress Controller.' : 'Traffic paused.',
                'traffic'
              );
            }}
            color="cyan"
            size="md"
          />

          <div style={{ width: '1px', height: '32px', background: 'rgba(255,255,255,0.1)' }} />

          {/* Chaos Monkey Node Kill Switch */}
          <PhysicalRockerSwitch
            id="chaos-node1-switch"
            label="Chaos: Kill Worker Node 01"
            sublabel={chaosNode1Off ? '💥 Power Cut • Pods Evicted' : 'Node 01 Healthy'}
            checked={chaosNode1Off}
            onChange={handleChaosToggle}
            color="crimson"
            size="md"
          />

          <div style={{ width: '1px', height: '32px', background: 'rgba(255,255,255,0.1)' }} />

          {/* HPA Autoscale Surge Switch */}
          <PhysicalRockerSwitch
            id="hpa-surge-switch"
            label="HPA Surge (3x &rarr; 5x)"
            sublabel={hpaSurgeActive ? '🚀 Auto-Scaled Replicas' : 'Base Replicas (3)'}
            checked={hpaSurgeActive}
            onChange={handleHpaToggle}
            color="amber"
            size="md"
          />

          <div style={{ width: '1px', height: '32px', background: 'rgba(255,255,255,0.1)' }} />

          {/* Rolling Update v1 -> v2 Switch */}
          <PhysicalRockerSwitch
            id="canary-rollout-switch"
            label="Rollout v2.0 Canary"
            sublabel={rolloutV2Active ? '🟣 v2.0 Neon Purple' : 'v1.0 Baseline'}
            checked={rolloutV2Active}
            onChange={handleRolloutToggle}
            color="purple"
            size="md"
          />
        </div>
      </div>

      {/* === TOP ARCHITECTURE PIPELINE: CLOUD INGRESS ➔ SERVICE LOAD BALANCER === */}
      <div
        style={{
          background: '#070b16',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '10px',
          padding: '0.75rem 1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.4rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Globe size={15} color="#38bdf8" />
            <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#fff' }}>
              GLOBAL INGRESS ➔ SERVICE (frontend-svc:80 ClusterIP) ➔ ROUND-ROBIN ROUTING
            </span>
          </div>
          <span style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)', color: '#4ade80' }}>
            HTTP 200 OK • 0 DROPPED PACKETS
          </span>
        </div>

        {/* Dynamic laser streams to the 2 nodes */}
        <LiveTrafficStream
          active={trafficActive}
          speed={hpaSurgeActive ? 'fast' : 'normal'}
          color={rolloutV2Active ? 'purple' : 'cyan'}
          height={28}
          label={trafficActive ? `LIVE HTTP TRAFFIC (${pods.length} Active Endpoints)` : 'TRAFFIC PAUSED'}
        />
      </div>

      {/* === CLUSTER NODES: CONTROL PLANE + WORKER 01 + WORKER 02 === */}
      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr 1fr', gap: '1rem' }}>

        {/* 1. CONTROL PLANE (MASTER NODE) */}
        <div
          className="server-chassis-blade"
          style={{
            borderRadius: '12px',
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
            border: `1.5px solid ${controlPlaneFlashing ? '#38bdf8' : 'rgba(168, 85, 247, 0.4)'}`,
            boxShadow: controlPlaneFlashing ? '0 0 20px rgba(56, 189, 248, 0.5)' : 'none',
            transition: 'all 0.3s ease',
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <LuminousBulb
              state={controlPlaneFlashing ? 'cyan' : 'purple'}
              size={20}
              label="Control Plane"
              sublabel="kube-scheduler &bull; etcd"
            />
          </div>

          <p style={{ fontSize: '0.68rem', color: '#94a3b8', margin: 0, lineHeight: 1.4 }}>
            Continuously runs the <strong>Reconciliation Loop</strong>: compares Desired State vs Actual State. Automatically reschedules pods upon node failure!
          </p>

          <div
            style={{
              background: 'rgba(0,0,0,0.4)',
              borderRadius: '8px',
              padding: '0.6rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.35rem',
              fontSize: '0.68rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#94a3b8' }}>API Server:</span>
              <span style={{ color: '#4ade80', fontWeight: 700 }}>HEALTHY</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#94a3b8' }}>Scheduler:</span>
              <span style={{ color: '#38bdf8', fontWeight: 700 }}>ACTIVE</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#94a3b8' }}>etcd Cluster:</span>
              <span style={{ color: '#c084fc', fontWeight: 700 }}>QUORUM (3/3)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#94a3b8' }}>Node Heartbeats:</span>
              <span style={{ color: node1Power ? '#4ade80' : '#f59e0b', fontWeight: 700 }}>
                {node1Power ? '2/2 LEASES' : '1/2 LEASES (DEGRADED)'}
              </span>
            </div>
          </div>

          {/* Micro Telemetry Indicator */}
          <div style={{ marginTop: 'auto', textAlign: 'center', padding: '0.4rem', background: 'rgba(168,85,247,0.1)', borderRadius: '6px' }}>
            <span style={{ fontSize: '0.65rem', color: '#c084fc', fontWeight: 800 }}>
              DESIRED REPLICAS: {pods.length} &bull; ACTUAL: {pods.length}
            </span>
          </div>
        </div>

        {/* 2. WORKER NODE 01 (HOT NODE) */}
        <div
          className="server-chassis-blade"
          style={{
            borderRadius: '12px',
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.85rem',
            border: `1.5px solid ${node1Power ? 'rgba(50, 108, 229, 0.4)' : 'rgba(239, 68, 68, 0.4)'}`,
            background: node1Power
              ? 'radial-gradient(circle at 50% 0%, #1e293b 0%, #0f172a 70%, #080d1a 100%)'
              : 'radial-gradient(circle at 50% 0%, #200b0e 0%, #0c0406 70%, #040102 100%)',
            transition: 'all 0.4s ease',
          }}
        >
          {/* Node 1 Top Bar: Rocker + Fan + Bulb */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <LuminousBulb
                state={node1Power ? 'green' : 'off'}
                size={22}
                label="worker-node-01"
                sublabel={node1Power ? 'READY (kubelet v1.28)' : '💥 POWER DISCONNECTED'}
              />
            </div>
            {/* Rocker Switch */}
            <PhysicalRockerSwitch
              checked={node1Power}
              onChange={(on) => handleChaosToggle(!on)}
              color="crimson"
              size="sm"
            />
          </div>

          {/* Node 1 Hardware Deck: Big Turbine Fan + Telemetry */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'rgba(0,0,0,0.4)',
              borderRadius: '10px',
              padding: '0.65rem',
              border: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            <CoolingTurbineFan
              status={!node1Power ? 'fault' : hpaSurgeActive ? 'turbo' : 'running'}
              size={52}
              label="NODE 1 FAN"
              showRpm={true}
            />

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.2rem' }}>
              <span style={{ fontSize: '0.62rem', color: '#94a3b8', fontWeight: 600 }}>NODE CPU</span>
              <div style={{ width: '70px', height: '6px', background: '#1e293b', borderRadius: '3px', overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    width: !node1Power ? '0%' : hpaSurgeActive ? '88%' : '38%',
                    background: !node1Power ? '#ef4444' : hpaSurgeActive ? '#f59e0b' : '#38bdf8',
                  }}
                />
              </div>
              <span style={{ fontSize: '0.68rem', fontWeight: 700, color: !node1Power ? '#64748b' : '#38bdf8' }}>
                {!node1Power ? '0%' : hpaSurgeActive ? '88.4%' : '38.2%'}
              </span>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.62rem', color: '#94a3b8', fontWeight: 600 }}>HOSTED PODS</div>
              <div style={{ fontSize: '0.88rem', fontWeight: 900, color: node1Power ? '#38bdf8' : '#ef4444', fontFamily: 'var(--font-mono)' }}>
                {node1Pods.length} Active
              </div>
            </div>
          </div>

          {/* Hosted Pods Slots on Node 1 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
            <span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#94a3b8' }}>POD INSTANCES (POD SLOTS)</span>

            {node1Pods.length === 0 ? (
              <div
                style={{
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px dashed rgba(239, 68, 68, 0.3)',
                  borderRadius: '8px',
                  padding: '1.2rem',
                  textAlign: 'center',
                  color: '#fca5a5',
                  fontSize: '0.74rem',
                }}
              >
                {!node1Power
                  ? '⚡ Node unpowered! All pods evacuated to Worker Node 02.'
                  : 'No pods currently assigned to Node 01.'}
              </div>
            ) : (
              node1Pods.map((pod) => (
                <div
                  key={pod.id}
                  style={{
                    background: '#060a14',
                    border: `1px solid ${pod.version === 'v2' ? 'rgba(168,85,247,0.4)' : 'rgba(56,189,248,0.25)'}`,
                    borderRadius: '8px',
                    padding: '0.55rem 0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <LuminousBulb
                      state={pod.version === 'v2' ? 'purple' : 'green'}
                      size={16}
                      label={pod.name}
                      sublabel={pod.version === 'v2' ? 'v2.0 CANARY' : 'v1.0 STABLE'}
                    />
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <CoolingTurbineFan status={hpaSurgeActive ? 'turbo' : 'running'} size={30} showRpm={false} />
                    <span style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)', color: '#4ade80' }}>
                      200 OK
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* 3. WORKER NODE 02 (SURVIVOR NODE) */}
        <div
          className="server-chassis-blade"
          style={{
            borderRadius: '12px',
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.85rem',
            border: '1.5px solid rgba(50, 108, 229, 0.4)',
          }}
        >
          {/* Node 2 Top Bar: Rocker + Fan + Bulb */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <LuminousBulb
                state="green"
                size={22}
                label="worker-node-02"
                sublabel="READY (kubelet v1.28)"
              />
            </div>
            <PhysicalRockerSwitch
              checked={node2Power}
              onChange={(on) => setNode2Power(on)}
              color="emerald"
              size="sm"
            />
          </div>

          {/* Node 2 Hardware Deck */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'rgba(0,0,0,0.4)',
              borderRadius: '10px',
              padding: '0.65rem',
              border: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            <CoolingTurbineFan
              status={chaosNode1Off || hpaSurgeActive ? 'turbo' : 'running'}
              size={52}
              label="NODE 2 FAN"
              showRpm={true}
            />

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.2rem' }}>
              <span style={{ fontSize: '0.62rem', color: '#94a3b8', fontWeight: 600 }}>NODE CPU</span>
              <div style={{ width: '70px', height: '6px', background: '#1e293b', borderRadius: '3px', overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    width: chaosNode1Off ? '91%' : hpaSurgeActive ? '82%' : '44%',
                    background: chaosNode1Off ? '#f59e0b' : '#38bdf8',
                  }}
                />
              </div>
              <span style={{ fontSize: '0.68rem', fontWeight: 700, color: chaosNode1Off ? '#f59e0b' : '#38bdf8' }}>
                {chaosNode1Off ? '91.2% (HEAVY)' : hpaSurgeActive ? '82.0%' : '44.1%'}
              </span>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.62rem', color: '#94a3b8', fontWeight: 600 }}>HOSTED PODS</div>
              <div style={{ fontSize: '0.88rem', fontWeight: 900, color: '#4ade80', fontFamily: 'var(--font-mono)' }}>
                {node2Pods.length} Active
              </div>
            </div>
          </div>

          {/* Hosted Pods Slots on Node 2 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
            <span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#94a3b8' }}>POD INSTANCES (POD SLOTS)</span>

            {node2Pods.map((pod) => (
              <div
                key={pod.id}
                style={{
                  background: '#060a14',
                  border: `1px solid ${pod.version === 'v2' ? 'rgba(168,85,247,0.4)' : 'rgba(74,222,128,0.25)'}`,
                  borderRadius: '8px',
                  padding: '0.55rem 0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <LuminousBulb
                    state={pod.version === 'v2' ? 'purple' : 'green'}
                    size={16}
                    label={pod.name}
                    sublabel={pod.version === 'v2' ? 'v2.0 CANARY' : 'v1.0 STABLE'}
                  />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <CoolingTurbineFan status={chaosNode1Off || hpaSurgeActive ? 'turbo' : 'running'} size={30} showRpm={false} />
                  <span style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)', color: '#4ade80' }}>
                    200 OK
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* === CAUSE-AND-EFFECT KUBERNETES TELEMETRY LOG === */}
      <div
        style={{
          background: '#070c18',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '10px',
          padding: '0.75rem 1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Activity size={14} color="#38bdf8" />
            <span style={{ fontSize: '0.76rem', fontWeight: 800, color: '#e2e8f0', letterSpacing: '0.04em' }}>
              CAUSE-AND-EFFECT K8S TELEMETRY TICKER (SELF-HEALING &amp; ORCHESTRATION EXPLAINED)
            </span>
          </div>
          <span style={{ fontSize: '0.65rem', color: '#64748b' }}>Kubernetes API Events Synced</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', maxHeight: '130px', overflowY: 'auto' }}>
          {logs.map((log) => (
            <div
              key={log.id}
              style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: '0.65rem',
                fontSize: '0.72rem',
                background: 'rgba(255,255,255,0.02)',
                padding: '0.35rem 0.65rem',
                borderRadius: '6px',
                borderLeft: `3px solid ${
                  log.type === 'chaos'
                    ? '#ef4444'
                    : log.type === 'scale'
                    ? '#f59e0b'
                    : log.type === 'rollout'
                    ? '#c084fc'
                    : '#38bdf8'
                }`,
              }}
            >
              <span style={{ color: '#64748b', fontFamily: 'var(--font-mono)', fontSize: '0.68rem', flexShrink: 0 }}>
                {log.timestamp}
              </span>
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                <strong style={{ color: '#fff' }}>{log.cause} &rarr;</strong>
                <span style={{ color: '#94a3b8' }}>{log.effect}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
