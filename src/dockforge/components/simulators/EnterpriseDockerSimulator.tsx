import React, { useState, useEffect } from 'react';
import { useDocker } from '../../context/DockerContext';
import { PhysicalRockerSwitch } from '../../../components/simulation/PhysicalRockerSwitch';
import { CoolingTurbineFan } from '../../../components/simulation/CoolingTurbineFan';
import { LuminousBulb } from '../../../components/simulation/LuminousBulb';
import { LiveTrafficStream } from '../../../components/simulation/LiveTrafficStream';
import {
  Zap,
  Database,
  Activity,
  Radio,
} from 'lucide-react';
import '../../../components/simulation/simulation.css';

interface CauseEffectLog {
  id: string;
  timestamp: string;
  cause: string;
  effect: string;
  type: 'power' | 'traffic' | 'stress' | 'fault' | 'port';
}

export const EnterpriseDockerSimulator: React.FC = () => {
  const { containers, executeCommand } = useDocker();

  // Local simulation states
  const [trafficActive, setTrafficActive] = useState<boolean>(true);
  const [stressActive, setStressActive] = useState<boolean>(false);
  const [faultActive, setFaultActive] = useState<boolean>(false);
  const [portForwardActive, setPortForwardActive] = useState<boolean>(true);

  // Individual container power switches
  const [apiPower, setApiPower] = useState<boolean>(true);
  const [dbPower, setDbPower] = useState<boolean>(true);
  const [redisPower, setRedisPower] = useState<boolean>(true);

  // Metrics counters
  const [reqCount, setReqCount] = useState<number>(1420);
  const [errorCount, setErrorCount] = useState<number>(0);

  // Cause-and-Effect Live Logs
  const [logs, setLogs] = useState<CauseEffectLog[]>([
    {
      id: 'init-1',
      timestamp: '12:00:01',
      cause: 'Container switch turned ON',
      effect: 'Host port 3000 bound to bridge network. Turbine cooling fan spun up to 1,840 RPM.',
      type: 'power',
    },
    {
      id: 'init-2',
      timestamp: '12:00:03',
      cause: 'Live Ingress Traffic activated',
      effect: 'Laser packet streams flowing through Docker bridge br0. HTTP 200 responses returning.',
      type: 'traffic',
    },
  ]);

  const addLog = (cause: string, effect: string, type: CauseEffectLog['type']) => {
    const time = new Date().toLocaleTimeString();
    setLogs((prev) => [
      { id: Math.random().toString(), timestamp: time, cause, effect, type },
      ...prev.slice(0, 7),
    ]);
  };

  // Sync with context containers if available
  useEffect(() => {
    const hasRunningApi = containers.some(c => c.name.includes('api') && c.status === 'running');
    if (containers.length > 0 && !hasRunningApi && apiPower) {
      // Keep in reasonable sync
    }
  }, [containers, apiPower]);

  // Request counter ticker
  useEffect(() => {
    const interval = setInterval(() => {
      if (trafficActive && apiPower && !faultActive) {
        setReqCount((prev) => prev + (stressActive ? 85 : 18));
      } else if (trafficActive && (!apiPower || faultActive)) {
        setErrorCount((prev) => prev + (stressActive ? 42 : 12));
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [trafficActive, apiPower, faultActive, stressActive]);

  // Handle Container Power Toggles
  const handleToggleApi = (on: boolean) => {
    setApiPower(on);
    if (on) {
      executeCommand('docker run -d --name acme-api -p 3000:3000 acme-api:latest');
      addLog(
        'acme-api Power Switch FLIPPED ON',
        'cgroups created, PID 1 spawned, turbine fan accelerating to 1,840 RPM, status bulb glowing Emerald.',
        'power'
      );
    } else {
      executeCommand('docker stop acme-api');
      addLog(
        'acme-api Power Switch CUT OFF',
        'SIGTERM sent, turbine fan spinning down to 0 RPM, status bulb turned dark, traffic halted.',
        'power'
      );
    }
  };

  const handleToggleDb = (on: boolean) => {
    setDbPower(on);
    if (on) {
      executeCommand('docker run -d --name postgres-db -v pgdata:/var/lib/postgresql/data postgres:16');
      addLog(
        'postgres-db Power Switch FLIPPED ON',
        'Database engine initialized, storage volume pgdata mounted, cooling fan engaged.',
        'power'
      );
    } else {
      executeCommand('docker stop postgres-db');
      addLog(
        'postgres-db Power Switch CUT OFF',
        'Postgres safely unmounted pgdata, fans stopped, storage write pipeline halted.',
        'power'
      );
    }
  };

  const handleToggleRedis = (on: boolean) => {
    setRedisPower(on);
    if (on) {
      executeCommand('docker run -d --name redis-cache -p 6379:6379 redis:7-alpine');
      addLog(
        'redis-cache Power Switch FLIPPED ON',
        'In-memory store allocated, fan spinning at 2,400 RPM, purple cache bulb active.',
        'power'
      );
    } else {
      executeCommand('docker stop redis-cache');
      addLog(
        'redis-cache Power Switch CUT OFF',
        'Redis cache flushed from RAM, fan stopped.',
        'power'
      );
    }
  };

  // Master Switch Action
  const handleMasterToggle = (on: boolean) => {
    handleToggleApi(on);
    handleToggleDb(on);
    handleToggleRedis(on);
    addLog(
      on ? 'MASTER POWER SWITCH ON' : 'MASTER POWER CUT',
      on ? 'All 3 container blades powered simultaneously. Fans spinning, bulbs illuminated!' : 'All containers stopped simultaneously.',
      'power'
    );
  };

  const allOn = apiPower && dbPower && redisPower;

  // Stress test toggle
  const handleToggleStress = (on: boolean) => {
    setStressActive(on);
    if (on) {
      addLog(
        '⚡ Cyber Monday Traffic Surge ACTIVATED',
        'Ingress rate jumped to 6,800 req/s! Fans revved to 3,850 RPM Turbo. CPU load gauge pulsed to 94%.',
        'stress'
      );
    } else {
      addLog(
        'Cyber Monday Surge DEACTIVATED',
        'Traffic normalized to cruising rate. Fans slowed back to 1,840 RPM cruising speed.',
        'stress'
      );
    }
  };

  // Fault toggle
  const handleToggleFault = (on: boolean) => {
    setFaultActive(on);
    if (on) {
      addLog(
        '💥 Chaos / OOM Fault Injected!',
        'Memory limit exceeded! Linux kernel OOM-killed acme-api. Bulb flashing RED, fan dead, 502 Bad Gateway!',
        'fault'
      );
    } else {
      addLog(
        'Fault Cleared & Restarted',
        'Container process restarted by Docker daemon. Green bulb restored, fan spinning again.',
        'fault'
      );
    }
  };

  // Port Forwarding toggle
  const handleTogglePort = (on: boolean) => {
    setPortForwardActive(on);
    addLog(
      on ? 'Port Mapping 3000:3000 CONNECTED' : 'Port Mapping 3000:3000 DISCONNECTED',
      on ? 'Host iptables NAT rule created. Glowing neon circuit closed.' : 'Host port isolated. External traffic cannot enter.',
      'port'
    );
  };

  const isApiRunning = apiPower && !faultActive;
  const isTrafficFlowing = trafficActive && portForwardActive && isApiRunning;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: '100%',
        background: '#040813',
        color: '#f8fafc',
        boxSizing: 'border-box',
        overflowY: 'auto',
        padding: '1rem 1.25rem',
        gap: '1rem',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      {/* === TOP BANNER & METAPHOR HEADER === */}
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
              background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 16px rgba(14, 165, 233, 0.4)',
            }}
          >
            <Radio size={20} color="#fff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h2 style={{ fontSize: '1.05rem', fontWeight: 900, margin: 0, color: '#fff', letterSpacing: '-0.02em' }}>
                Enterprise Production Rig &bull; Real Hardware Simulation
              </h2>
              <span
                style={{
                  fontSize: '0.65rem',
                  fontWeight: 800,
                  padding: '0.15rem 0.5rem',
                  borderRadius: '999px',
                  background: isTrafficFlowing ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                  color: isTrafficFlowing ? '#4ade80' : '#f87171',
                  border: `1px solid ${isTrafficFlowing ? '#22c55e' : '#ef4444'}`,
                }}
              >
                {isTrafficFlowing ? 'LIVE TRAFFIC RUNNING' : 'SYSTEM DEGRADED / OFFLINE'}
              </span>
            </div>
            <p style={{ fontSize: '0.72rem', color: '#94a3b8', margin: '0.2rem 0 0 0' }}>
              Direct Cause-and-Effect: Flip switches to simultaneously spin cooling turbine fans, light status bulbs, stream traffic lasers, and trigger enterprise events!
            </p>
          </div>
        </div>

        {/* Real-time Telemetry Readout */}
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
            <div style={{ fontSize: '0.62rem', color: '#94a3b8', fontWeight: 600 }}>HTTP 200 OK</div>
            <div style={{ fontSize: '0.85rem', fontWeight: 900, color: '#4ade80', fontFamily: 'var(--font-mono)' }}>
              {reqCount.toLocaleString()} reqs
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
            <div style={{ fontSize: '0.62rem', color: '#94a3b8', fontWeight: 600 }}>5xx ERRORS</div>
            <div style={{ fontSize: '0.85rem', fontWeight: 900, color: errorCount > 0 ? '#f87171' : '#64748b', fontFamily: 'var(--font-mono)' }}>
              {errorCount.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* === MASTER CONTROL SWITCHBOARD === */}
      <div
        style={{
          background: 'linear-gradient(180deg, #0f172a 0%, #090e1a 100%)',
          border: '1px solid rgba(56, 189, 248, 0.25)',
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
          {/* Master Power Switch */}
          <PhysicalRockerSwitch
            id="master-power-switch"
            label="Master Rack Power"
            sublabel={allOn ? 'All 3 Blades ON' : 'Partial / Standby'}
            checked={allOn}
            onChange={handleMasterToggle}
            color="cyan"
            size="md"
          />

          <div style={{ width: '1px', height: '32px', background: 'rgba(255,255,255,0.1)' }} />

          {/* Ingress Traffic Switch */}
          <PhysicalRockerSwitch
            id="traffic-generator-switch"
            label="Ingress Traffic"
            sublabel={trafficActive ? 'Laser stream ON' : 'Paused'}
            checked={trafficActive}
            onChange={(checked) => {
              setTrafficActive(checked);
              addLog(
                checked ? 'Ingress Traffic Switch TURNED ON' : 'Ingress Traffic Switch TURNED OFF',
                checked ? 'Client synthetic traffic generator started.' : 'External requests paused.',
                'traffic'
              );
            }}
            color="emerald"
            size="md"
          />

          <div style={{ width: '1px', height: '32px', background: 'rgba(255,255,255,0.1)' }} />

          {/* Cyber Monday Stress Switch */}
          <PhysicalRockerSwitch
            id="stress-test-switch"
            label="Load Surge (Black Friday)"
            sublabel={stressActive ? '3,850 RPM Turbo Fan' : 'Normal Load'}
            checked={stressActive}
            onChange={handleToggleStress}
            color="amber"
            size="md"
          />

          <div style={{ width: '1px', height: '32px', background: 'rgba(255,255,255,0.1)' }} />

          {/* Chaos / Fault Switch */}
          <PhysicalRockerSwitch
            id="chaos-fault-switch"
            label="Simulate OOM Fault"
            sublabel={faultActive ? '💥 Kernel OOM Killed' : 'Healthy State'}
            checked={faultActive}
            onChange={handleToggleFault}
            color="crimson"
            size="md"
          />

          <div style={{ width: '1px', height: '32px', background: 'rgba(255,255,255,0.1)' }} />

          {/* Port Forwarding Switch */}
          <PhysicalRockerSwitch
            id="port-mapping-switch"
            label="Port Map 3000:3000"
            sublabel={portForwardActive ? 'Bridge NAT Active' : 'Disconnected'}
            checked={portForwardActive}
            onChange={handleTogglePort}
            color="purple"
            size="md"
          />
        </div>
      </div>

      {/* === SERVER CHASSIS: THE 3 ENTERPRISE CONTAINER BLADES === */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>

        {/* CONTAINER 1: ACME REST API */}
        <div
          className="server-chassis-blade"
          style={{
            borderRadius: '12px',
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.85rem',
            border: `1.5px solid ${isApiRunning ? 'rgba(56, 189, 248, 0.4)' : 'rgba(239, 68, 68, 0.3)'}`,
            position: 'relative',
          }}
        >
          {/* Blade Top: Identity + Status Bulb */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <LuminousBulb
                state={faultActive ? 'red' : apiPower ? 'green' : 'off'}
                size={22}
                label="acme-api:latest"
                sublabel={faultActive ? 'CRASHED (OOM)' : apiPower ? 'RUNNING (PID 1)' : 'STOPPED'}
              />
            </div>
            <PhysicalRockerSwitch
              checked={apiPower}
              onChange={handleToggleApi}
              color="emerald"
              size="sm"
            />
          </div>

          {/* Interactive Hardware: Turbine Fan + Port Route + Live Monitor */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'rgba(0, 0, 0, 0.4)',
              borderRadius: '10px',
              padding: '0.75rem',
              border: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            {/* Turbine Fan */}
            <CoolingTurbineFan
              status={faultActive ? 'fault' : stressActive && apiPower ? 'turbo' : apiPower ? 'running' : 'stopped'}
              size={56}
              label="EXHAUST FAN"
              showRpm={true}
            />

            {/* Middle: CPU Gauge */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3rem' }}>
              <div style={{ fontSize: '0.65rem', color: '#94a3b8', fontWeight: 700 }}>CPU LOAD</div>
              <div
                style={{
                  width: '80px',
                  height: '8px',
                  borderRadius: '999px',
                  background: '#1e293b',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: !apiPower ? '0%' : faultActive ? '100%' : stressActive ? '94%' : '28%',
                    background: faultActive ? '#ef4444' : stressActive ? '#f59e0b' : '#22c55e',
                    transition: 'width 0.4s ease, background 0.4s ease',
                  }}
                />
              </div>
              <span
                style={{
                  fontSize: '0.7rem',
                  fontWeight: 800,
                  fontFamily: 'var(--font-mono)',
                  color: faultActive ? '#ef4444' : stressActive ? '#f59e0b' : '#22c55e',
                }}
              >
                {!apiPower ? '0%' : faultActive ? '100% (SPIKE)' : stressActive ? '94.2%' : '28.4%'}
              </span>
            </div>

            {/* Right: Port Binding */}
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.62rem', color: '#94a3b8', fontWeight: 600 }}>PORT ROUTE</div>
              <div
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  fontFamily: 'var(--font-mono)',
                  color: portForwardActive && apiPower ? '#38bdf8' : '#64748b',
                  background: 'rgba(56, 189, 248, 0.1)',
                  padding: '0.15rem 0.4rem',
                  borderRadius: '4px',
                  marginTop: '0.2rem',
                }}
              >
                :3000 &rarr; :3000
              </div>
            </div>
          </div>

          {/* Live Ingress Laser Packet Pipeline */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.66rem', color: '#94a3b8', marginBottom: '2px' }}>
              <span>INCOMING CLIENT REQUESTS</span>
              <span style={{ color: isTrafficFlowing ? '#38bdf8' : '#ef4444' }}>
                {isTrafficFlowing ? '200 OK • 3ms latency' : '502 BAD GATEWAY'}
              </span>
            </div>
            <LiveTrafficStream
              active={trafficActive}
              collision={!isApiRunning}
              speed={stressActive ? 'fast' : 'normal'}
              color="cyan"
              height={26}
              label={isTrafficFlowing ? 'GET /api/v1/orders' : '💥 CONNECTION REFUSED'}
            />
          </div>

          {/* Live Web Application Display Monitor Screen */}
          <div
            style={{
              background: '#020617',
              borderRadius: '8px',
              border: `1px solid ${isApiRunning ? 'rgba(56,189,248,0.3)' : 'rgba(239,68,68,0.2)'}`,
              padding: '0.65rem 0.85rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: isApiRunning ? '#22c55e' : '#ef4444',
                  boxShadow: isApiRunning ? '0 0 6px #22c55e' : '0 0 6px #ef4444',
                }}
              />
              <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#f8fafc' }}>
                {isApiRunning ? 'HTTP 200: Acme SaaS API Server' : '502: Connection Refused'}
              </span>
            </div>
            <span style={{ fontSize: '0.66rem', fontFamily: 'var(--font-mono)', color: '#94a3b8' }}>
              {isApiRunning ? 'READY' : 'OFFLINE'}
            </span>
          </div>
        </div>

        {/* CONTAINER 2: POSTGRESQL DATABASE */}
        <div
          className="server-chassis-blade"
          style={{
            borderRadius: '12px',
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.85rem',
            border: `1.5px solid ${dbPower ? 'rgba(74, 222, 128, 0.4)' : 'rgba(255, 255, 255, 0.1)'}`,
          }}
        >
          {/* Blade Top: Identity + Status Bulb */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <LuminousBulb
                state={dbPower ? 'green' : 'off'}
                size={22}
                label="postgres:16-alpine"
                sublabel={dbPower ? 'ACID WAL ENGINE ACTIVE' : 'STOPPED'}
              />
            </div>
            <PhysicalRockerSwitch
              checked={dbPower}
              onChange={handleToggleDb}
              color="emerald"
              size="sm"
            />
          </div>

          {/* Hardware: Turbine Fan + Disk Write Bus */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'rgba(0, 0, 0, 0.4)',
              borderRadius: '10px',
              padding: '0.75rem',
              border: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            <CoolingTurbineFan
              status={stressActive && dbPower ? 'turbo' : dbPower ? 'running' : 'stopped'}
              size={56}
              label="COOLING FAN"
              showRpm={true}
            />

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3rem' }}>
              <div style={{ fontSize: '0.65rem', color: '#94a3b8', fontWeight: 700 }}>WRITE IOPS</div>
              <div style={{ fontSize: '0.92rem', fontWeight: 900, color: dbPower ? '#4ade80' : '#64748b', fontFamily: 'var(--font-mono)' }}>
                {dbPower ? (stressActive ? '4,120 IOPS' : '820 IOPS') : '0 IOPS'}
              </div>
              <span style={{ fontSize: '0.62rem', color: '#94a3b8' }}>WAL Buffer Flush</span>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.62rem', color: '#94a3b8', fontWeight: 600 }}>STORAGE MOUNT</div>
              <div
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  fontFamily: 'var(--font-mono)',
                  color: dbPower ? '#4ade80' : '#64748b',
                  background: 'rgba(74, 222, 128, 0.1)',
                  padding: '0.15rem 0.4rem',
                  borderRadius: '4px',
                  marginTop: '0.2rem',
                }}
              >
                pgdata &rarr; /var/lib
              </div>
            </div>
          </div>

          {/* Storage Persistence Pipeline Stream */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.66rem', color: '#94a3b8', marginBottom: '2px' }}>
              <span>PERSISTENT SSD BUS PIPELINE</span>
              <span style={{ color: dbPower ? '#4ade80' : '#64748b' }}>
                {dbPower ? 'SYNCHRONOUS WRITE' : 'STANDBY'}
              </span>
            </div>
            <LiveTrafficStream
              active={dbPower && trafficActive}
              speed={stressActive ? 'fast' : 'normal'}
              color="emerald"
              height={26}
              label={dbPower ? 'WRITE block #49281' : 'IO BUS IDLE'}
            />
          </div>

          <div
            style={{
              background: '#020617',
              borderRadius: '8px',
              border: '1px solid rgba(74, 222, 128, 0.2)',
              padding: '0.65rem 0.85rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Database size={14} color={dbPower ? '#4ade80' : '#64748b'} />
              <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#f8fafc' }}>
                {dbPower ? 'Volume pgdata: Persistent' : 'Volume unmounted'}
              </span>
            </div>
            <span style={{ fontSize: '0.66rem', fontFamily: 'var(--font-mono)', color: '#94a3b8' }}>
              {dbPower ? 'ONLINE' : 'STOPPED'}
            </span>
          </div>
        </div>

        {/* CONTAINER 3: REDIS IN-MEMORY CACHE */}
        <div
          className="server-chassis-blade"
          style={{
            borderRadius: '12px',
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.85rem',
            border: `1.5px solid ${redisPower ? 'rgba(192, 132, 252, 0.4)' : 'rgba(255, 255, 255, 0.1)'}`,
          }}
        >
          {/* Blade Top: Identity + Status Bulb */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <LuminousBulb
                state={redisPower ? 'purple' : 'off'}
                size={22}
                label="redis:7-alpine"
                sublabel={redisPower ? 'IN-MEMORY RAM CACHE' : 'STOPPED'}
              />
            </div>
            <PhysicalRockerSwitch
              checked={redisPower}
              onChange={handleToggleRedis}
              color="purple"
              size="sm"
            />
          </div>

          {/* Hardware: Turbine Fan + Hit Rate */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'rgba(0, 0, 0, 0.4)',
              borderRadius: '10px',
              padding: '0.75rem',
              border: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            <CoolingTurbineFan
              status={stressActive && redisPower ? 'turbo' : redisPower ? 'running' : 'stopped'}
              size={56}
              label="COOLING FAN"
              showRpm={true}
            />

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3rem' }}>
              <div style={{ fontSize: '0.65rem', color: '#94a3b8', fontWeight: 700 }}>CACHE HIT RATE</div>
              <div style={{ fontSize: '0.92rem', fontWeight: 900, color: redisPower ? '#c084fc' : '#64748b', fontFamily: 'var(--font-mono)' }}>
                {redisPower ? '98.6%' : '0%'}
              </div>
              <span style={{ fontSize: '0.62rem', color: '#94a3b8' }}>0.4ms Response</span>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.62rem', color: '#94a3b8', fontWeight: 600 }}>MEMORY ALLOC</div>
              <div
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  fontFamily: 'var(--font-mono)',
                  color: redisPower ? '#c084fc' : '#64748b',
                  background: 'rgba(192, 132, 252, 0.1)',
                  padding: '0.15rem 0.4rem',
                  borderRadius: '4px',
                  marginTop: '0.2rem',
                }}
              >
                128MB / 512MB
              </div>
            </div>
          </div>

          {/* Cache Pipeline Stream */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.66rem', color: '#94a3b8', marginBottom: '2px' }}>
              <span>CACHE BUS PIPELINE</span>
              <span style={{ color: redisPower ? '#c084fc' : '#64748b' }}>
                {redisPower ? 'GET /session:token' : 'STANDBY'}
              </span>
            </div>
            <LiveTrafficStream
              active={redisPower && trafficActive}
              speed={stressActive ? 'fast' : 'normal'}
              color="purple"
              height={26}
              label={redisPower ? 'CACHE HIT (0.4ms)' : 'CACHE OFFLINE'}
            />
          </div>

          <div
            style={{
              background: '#020617',
              borderRadius: '8px',
              border: '1px solid rgba(192, 132, 252, 0.2)',
              padding: '0.65rem 0.85rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Zap size={14} color={redisPower ? '#c084fc' : '#64748b'} />
              <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#f8fafc' }}>
                {redisPower ? 'Port 6379: In-Memory Key/Value' : 'Port 6379 Closed'}
              </span>
            </div>
            <span style={{ fontSize: '0.66rem', fontFamily: 'var(--font-mono)', color: '#94a3b8' }}>
              {redisPower ? 'ONLINE' : 'STOPPED'}
            </span>
          </div>
        </div>

      </div>

      {/* === CAUSE & EFFECT LIVE NARRATIVE TELEMETRY LOG === */}
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
              CAUSE-AND-EFFECT TELEMETRY TICKER (REAL WORKING ENVIRONMENT EXPLANATION)
            </span>
          </div>
          <span style={{ fontSize: '0.65rem', color: '#64748b' }}>Auto-synced with Docker daemon</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', maxHeight: '140px', overflowY: 'auto' }}>
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
                  log.type === 'fault'
                    ? '#ef4444'
                    : log.type === 'stress'
                    ? '#f59e0b'
                    : log.type === 'traffic'
                    ? '#38bdf8'
                    : '#4ade80'
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
