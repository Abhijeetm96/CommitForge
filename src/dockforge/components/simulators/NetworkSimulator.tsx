import React, { useState } from 'react';
import { Globe, Server, Box, Play, Wifi, WifiOff } from 'lucide-react';
import { UniversalDockerConcept } from '../../data/unifiedDockerData';

interface NetworkSimulatorProps {
  concept: UniversalDockerConcept;
  simState: 'created' | 'running' | 'paused' | 'stopped' | 'removed';
  setSimState: (s: 'created' | 'running' | 'paused' | 'stopped' | 'removed') => void;
  showToast: (msg: string) => void;
}

export const NetworkSimulator: React.FC<NetworkSimulatorProps> = ({
  concept,
  simState,
  setSimState,
  showToast,
}) => {
  const [packetStep, setPacketStep] = useState<number>(0);
  const [networkConnected, setNetworkConnected] = useState<boolean>(true);
  const [dnsLookup, setDnsLookup] = useState<boolean>(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* HEADER & CONTROLS */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(0,0,0,0.3)', padding: '0.85rem 1rem', borderRadius: '10px', border: '1px solid var(--docker-border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
          <Globe size={18} color="var(--docker-blue)" />
          <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#fff' }}>
            Engine C: Bridge Network Packet Router & Port Mapper
          </span>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={() => {
              setNetworkConnected(!networkConnected);
              showToast(networkConnected ? '🔌 Disconnected container from docker0 bridge!' : '⚡ Reconnected container to docker0 bridge!');
            }}
            style={{
              padding: '0.35rem 0.75rem',
              borderRadius: '6px',
              background: networkConnected ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)',
              color: networkConnected ? '#4ade80' : '#f87171',
              border: '1px solid var(--docker-border)',
              fontSize: '0.76rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
            }}
          >
            {networkConnected ? <Wifi size={13} /> : <WifiOff size={13} />}
            {networkConnected ? 'Bridge Connected' : 'Disconnected'}
          </button>

          <button
            onClick={() => {
              if (!networkConnected) {
                showToast('❌ Connection Refused: Container is disconnected from network bridge!');
                return;
              }
              const nextS = (packetStep + 1) % 4;
              setPacketStep(nextS);
              if (nextS === 1) showToast('Packet 1: Dispatched from Host Browser (Port 8080)...');
              if (nextS === 2) showToast('Packet 2: iptables NAT translated port to docker0 gateway 172.17.0.1');
              if (nextS === 3) showToast('Packet 3: Delivered to Container eth0 172.17.0.2:80 -> HTTP 200 OK!');
            }}
            style={{
              padding: '0.35rem 0.85rem',
              borderRadius: '6px',
              background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
              color: '#fff',
              border: 'none',
              fontSize: '0.76rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
            }}
          >
            <Play size={13} fill="#fff" />
            Send HTTP Request Packet
          </button>
        </div>
      </div>

      {/* 3-NODE PACKET ROUTING TOPOLOGY */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', position: 'relative' }}>
        {/* Node 1: Host Browser */}
        <div style={{ background: packetStep === 1 ? 'rgba(14, 165, 233, 0.25)' : 'rgba(255,255,255,0.03)', border: packetStep === 1 ? '1px solid var(--docker-blue)' : '1px solid var(--docker-border)', padding: '1.25rem', borderRadius: '10px', textAlign: 'center' }}>
          <Globe size={28} color="#38bdf8" style={{ margin: '0 auto 0.5rem' }} />
          <div style={{ fontWeight: 800, fontSize: '0.86rem', color: '#fff' }}>Host Client Browser</div>
          <div style={{ fontSize: '0.74rem', color: 'var(--docker-text-muted)', fontFamily: 'JetBrains Mono', marginTop: '0.2rem' }}>http://localhost:8080</div>
        </div>

        {/* Node 2: Docker Bridge & iptables */}
        <div style={{ background: packetStep === 2 ? 'rgba(234, 179, 8, 0.25)' : 'rgba(255,255,255,0.03)', border: packetStep === 2 ? '1px solid #eab308' : '1px solid var(--docker-border)', padding: '1.25rem', borderRadius: '10px', textAlign: 'center' }}>
          <Server size={28} color="#facc15" style={{ margin: '0 auto 0.5rem' }} />
          <div style={{ fontWeight: 800, fontSize: '0.86rem', color: '#fff' }}>docker0 Bridge Gateway</div>
          <div style={{ fontSize: '0.74rem', color: 'var(--docker-text-muted)', fontFamily: 'JetBrains Mono', marginTop: '0.2rem' }}>172.17.0.1 (NAT Rule: 8080:80)</div>
        </div>

        {/* Node 3: Container eth0 */}
        <div style={{ background: !networkConnected ? 'rgba(239, 68, 68, 0.15)' : packetStep === 3 ? 'rgba(34, 197, 94, 0.25)' : 'rgba(255,255,255,0.03)', border: !networkConnected ? '1px dashed #ef4444' : packetStep === 3 ? '1px solid #22c55e' : '1px solid var(--docker-border)', padding: '1.25rem', borderRadius: '10px', textAlign: 'center' }}>
          <Box size={28} color={!networkConnected ? '#ef4444' : '#4ade80'} style={{ margin: '0 auto 0.5rem' }} />
          <div style={{ fontWeight: 800, fontSize: '0.86rem', color: !networkConnected ? '#f87171' : '#fff' }}>Container eth0</div>
          <div style={{ fontSize: '0.74rem', color: 'var(--docker-text-muted)', fontFamily: 'JetBrains Mono', marginTop: '0.2rem' }}>
            {networkConnected ? '172.17.0.2:80 (HTTP 200)' : 'DISCONNECTED'}
          </div>
        </div>
      </div>

      {/* DOCKER DNS RESOLUTION BAR */}
      <div style={{ background: 'rgba(255,255,255,0.02)', padding: '0.85rem 1rem', borderRadius: '8px', border: '1px solid var(--docker-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>
          Embedded Docker DNS (127.0.0.11): <code>ping db</code> &rarr; resolves service name <strong>"db"</strong> to internal IP <strong>172.17.0.3</strong>
        </div>
        <button
          onClick={() => {
            setDnsLookup(true);
            showToast('Docker DNS resolved "db" -> 172.17.0.3');
            setTimeout(() => setDnsLookup(false), 2000);
          }}
          style={{ padding: '0.3rem 0.65rem', borderRadius: '4px', background: 'rgba(14, 165, 233, 0.15)', border: '1px solid var(--docker-border-active)', color: '#38bdf8', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer' }}
        >
          {dnsLookup ? 'Resolving...' : 'Test DNS Lookup'}
        </button>
      </div>
    </div>
  );
};
