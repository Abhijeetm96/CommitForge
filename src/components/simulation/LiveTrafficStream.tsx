import React from 'react';
import './simulation.css';

export interface LiveTrafficStreamProps {
  active: boolean;
  speed?: 'normal' | 'fast';
  color?: 'cyan' | 'emerald' | 'amber' | 'purple' | 'red';
  width?: number | string;
  height?: number;
  label?: string;
  collision?: boolean;
}

export const LiveTrafficStream: React.FC<LiveTrafficStreamProps> = ({
  active,
  speed = 'normal',
  color = 'cyan',
  width = '100%',
  height = 36,
  label,
  collision = false,
}) => {
  const colorMap = {
    cyan: '#38bdf8',
    emerald: '#4ade80',
    amber: '#facc15',
    purple: '#c084fc',
    red: '#f87171',
  };

  const strokeColor = collision ? '#ef4444' : colorMap[color];
  const streamClass = collision
    ? ''
    : speed === 'fast'
    ? 'laser-packet-stream-fast'
    : 'laser-packet-stream';

  return (
    <div
      style={{
        position: 'relative',
        width: typeof width === 'number' ? `${width}px` : width,
        height: `${height}px`,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        overflow: 'visible',
      }}
    >
      <svg
        width="100%"
        height={height}
        viewBox="0 0 400 36"
        preserveAspectRatio="none"
        style={{ overflow: 'visible' }}
      >
        {/* Under-glow blur path */}
        {active && (
          <path
            d="M 0 18 L 400 18"
            stroke={strokeColor}
            strokeWidth="6"
            strokeOpacity="0.25"
            filter="blur(3px)"
            fill="none"
          />
        )}

        {/* Base Wire Track */}
        <path
          d="M 0 18 L 400 18"
          stroke="rgba(255, 255, 255, 0.12)"
          strokeWidth="3"
          strokeDasharray="4 4"
          fill="none"
        />

        {/* Live Animated Laser Stream */}
        {active && !collision && (
          <path
            d="M 0 18 L 400 18"
            stroke={strokeColor}
            strokeWidth="3"
            strokeLinecap="round"
            className={streamClass}
            fill="none"
            filter={`drop-shadow(0 0 5px ${strokeColor})`}
          />
        )}

        {/* Collision / Fault Sparks if collision */}
        {active && collision && (
          <g transform="translate(380, 18)">
            <circle cx="0" cy="0" r="8" fill="rgba(239,68,68,0.4)" filter="blur(2px)" />
            <circle cx="0" cy="0" r="4" fill="#ef4444" />
            <line x1="-6" y1="-6" x2="6" y2="6" stroke="#fca5a5" strokeWidth="2" />
            <line x1="-6" y1="6" x2="6" y2="-6" stroke="#fca5a5" strokeWidth="2" />
          </g>
        )}
      </svg>

      {/* Floating Traffic Badge */}
      {label && (
        <div
          style={{
            position: 'absolute',
            top: '-6px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(15, 23, 42, 0.9)',
            border: `1px solid ${active ? (collision ? '#ef4444' : strokeColor) : 'rgba(255,255,255,0.1)'}`,
            borderRadius: '999px',
            padding: '0.1rem 0.5rem',
            fontSize: '0.62rem',
            fontWeight: 800,
            fontFamily: 'var(--font-mono, monospace)',
            color: active ? (collision ? '#f87171' : strokeColor) : '#64748b',
            whiteSpace: 'nowrap',
            boxShadow: active ? `0 0 10px ${active ? strokeColor + '40' : 'none'}` : 'none',
            zIndex: 2,
          }}
        >
          {label}
        </div>
      )}
    </div>
  );
};
