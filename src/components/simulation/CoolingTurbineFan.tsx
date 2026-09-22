import React from 'react';
import './simulation.css';

export interface CoolingTurbineFanProps {
  status: 'stopped' | 'running' | 'turbo' | 'fault';
  rpm?: number;
  size?: number; // size in px, default 48
  label?: string;
  showRpm?: boolean;
}

export const CoolingTurbineFan: React.FC<CoolingTurbineFanProps> = ({
  status,
  rpm: customRpm,
  size = 54,
  label,
  showRpm = true,
}) => {
  const isRunning = status === 'running' || status === 'turbo';
  const isTurbo = status === 'turbo';
  const isFault = status === 'fault';

  // Determine animation class
  const animationClass = isFault
    ? 'turbine-fan-stopped'
    : isTurbo
    ? 'turbine-fan-spinning-turbo'
    : isRunning
    ? 'turbine-fan-spinning-fast'
    : 'turbine-fan-stopped';

  // Compute displayed RPM
  const displayRpm = customRpm !== undefined
    ? customRpm
    : isFault
    ? 0
    : isTurbo
    ? 3850
    : isRunning
    ? 1840
    : 0;

  const bladeColor = isFault
    ? '#ef4444'
    : isTurbo
    ? '#f59e0b'
    : isRunning
    ? '#38bdf8'
    : '#475569';

  return (
    <div
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.35rem',
        userSelect: 'none',
      }}
    >
      {/* Fan Housing / Bezel */}
      <div
        style={{
          position: 'relative',
          width: `${size}px`,
          height: `${size}px`,
          borderRadius: '50%',
          background: 'radial-gradient(circle, #0f172a 40%, #030712 100%)',
          border: `2px solid ${isRunning ? (isTurbo ? '#f59e0b' : '#0284c7') : 'rgba(255,255,255,0.1)'}`,
          boxShadow: isRunning
            ? `0 0 16px ${isTurbo ? 'rgba(245, 158, 11, 0.4)' : 'rgba(14, 165, 233, 0.35)'}, inset 0 2px 6px rgba(0,0,0,0.8)`
            : 'inset 0 2px 6px rgba(0,0,0,0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          transition: 'all 0.3s ease',
        }}
      >
        {/* Airflow shimmer when turbo */}
        {isTurbo && (
          <div
            className="exhaust-airflow-shimmer"
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(245, 158, 11, 0.25) 0%, transparent 70%)',
              pointerEvents: 'none',
            }}
          />
        )}

        {/* Rotating Blades SVG */}
        <svg
          viewBox="0 0 100 100"
          className={animationClass}
          style={{
            width: `${size * 0.85}px`,
            height: `${size * 0.85}px`,
            filter: isTurbo ? 'drop-shadow(0 0 4px #f59e0b)' : isRunning ? 'drop-shadow(0 0 3px #38bdf8)' : 'none',
          }}
        >
          {/* Central Motor Hub */}
          <circle cx="50" cy="50" r="14" fill="#1e293b" stroke="#334155" strokeWidth="2" />
          <circle cx="50" cy="50" r="6" fill="#0f172a" />

          {/* 6 Aerofoil Blades evenly distributed around 360 deg */}
          {[0, 60, 120, 180, 240, 300].map((angle, i) => (
            <g key={i} transform={`rotate(${angle} 50 50)`}>
              <path
                d="M 46 36 C 44 22, 54 10, 62 10 C 66 18, 56 30, 52 38 Z"
                fill={bladeColor}
                opacity={isRunning ? 0.9 : 0.65}
              />
              <path
                d="M 48 34 C 47 24, 53 14, 59 13"
                stroke="rgba(255,255,255,0.4)"
                strokeWidth="1.2"
                fill="none"
              />
            </g>
          ))}
        </svg>

        {/* Protective Metal Grill Guard Overlay */}
        <svg
          viewBox="0 0 100 100"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            opacity: 0.65,
          }}
        >
          <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
          <circle cx="50" cy="50" r="28" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1.2" />
          <line x1="10" y1="50" x2="90" y2="50" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
          <line x1="50" y1="10" x2="50" y2="90" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
        </svg>
      </div>

      {/* Label and RPM readout */}
      <div style={{ textAlign: 'center' }}>
        {label && (
          <div style={{ fontSize: '0.66rem', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.02em' }}>
            {label}
          </div>
        )}
        {showRpm && (
          <div
            style={{
              fontSize: '0.62rem',
              fontWeight: 800,
              fontFamily: 'var(--font-mono, monospace)',
              color: isFault ? '#ef4444' : isTurbo ? '#f59e0b' : isRunning ? '#38bdf8' : '#64748b',
              marginTop: '1px',
            }}
          >
            {displayRpm.toLocaleString()} RPM
          </div>
        )}
      </div>
    </div>
  );
};
