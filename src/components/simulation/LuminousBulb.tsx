import React from 'react';
import './simulation.css';

export interface LuminousBulbProps {
  state: 'green' | 'cyan' | 'amber' | 'red' | 'purple' | 'off';
  size?: number; // size in px, default 24
  label?: string;
  sublabel?: string;
  pulse?: boolean;
}

export const LuminousBulb: React.FC<LuminousBulbProps> = ({
  state,
  size = 24,
  label,
  sublabel,
  pulse = true,
}) => {
  const isOff = state === 'off';

  const config = {
    green: {
      color: '#22c55e',
      glowClass: 'bulb-radiant-green',
      filament: '#86efac',
      baseGlow: 'rgba(34, 197, 94, 0.7)',
    },
    cyan: {
      color: '#0ea5e9',
      glowClass: 'bulb-radiant-cyan',
      filament: '#7dd3fc',
      baseGlow: 'rgba(14, 165, 233, 0.7)',
    },
    amber: {
      color: '#f59e0b',
      glowClass: 'bulb-radiant-amber',
      filament: '#fde047',
      baseGlow: 'rgba(245, 158, 11, 0.7)',
    },
    red: {
      color: '#ef4444',
      glowClass: 'bulb-radiant-red',
      filament: '#fca5a5',
      baseGlow: 'rgba(239, 68, 68, 0.7)',
    },
    purple: {
      color: '#a855f7',
      glowClass: 'bulb-radiant-purple',
      filament: '#d8b4fe',
      baseGlow: 'rgba(168, 85, 247, 0.7)',
    },
    off: {
      color: '#334155',
      glowClass: '',
      filament: '#1e293b',
      baseGlow: 'none',
    },
  }[state];

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.5rem',
        userSelect: 'none',
      }}
    >
      {/* Bulb Glass Sphere */}
      <div
        style={{
          position: 'relative',
          width: `${size}px`,
          height: `${size}px`,
          flexShrink: 0,
        }}
      >
        {/* Ambient Light Bloom Behind Bulb */}
        {!isOff && (
          <div
            style={{
              position: 'absolute',
              inset: `-${size * 0.4}px`,
              borderRadius: '50%',
              background: `radial-gradient(circle, ${config.baseGlow} 0%, transparent 70%)`,
              pointerEvents: 'none',
              zIndex: 0,
              opacity: 0.85,
            }}
          />
        )}

        {/* 3D Glass Dome */}
        <div
          className={!isOff && pulse ? config.glowClass : ''}
          style={{
            position: 'relative',
            zIndex: 1,
            width: `${size}px`,
            height: `${size}px`,
            borderRadius: '50%',
            background: isOff
              ? 'radial-gradient(circle at 35% 30%, #475569 0%, #1e293b 60%, #0f172a 100%)'
              : `radial-gradient(circle at 35% 30%, #ffffff 0%, ${config.filament} 35%, ${config.color} 80%, #090d16 100%)`,
            border: `1.5px solid ${isOff ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.4)'}`,
            boxShadow: isOff
              ? 'inset 0 2px 4px rgba(0,0,0,0.8)'
              : `0 0 16px ${config.baseGlow}, inset 0 0 8px rgba(255,255,255,0.8)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.25s ease',
          }}
        >
          {/* Glass Specular Reflection Highlight */}
          <div
            style={{
              position: 'absolute',
              top: `${size * 0.12}px`,
              left: `${size * 0.18}px`,
              width: `${size * 0.35}px`,
              height: `${size * 0.2}px`,
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.75)',
              transform: 'rotate(-25deg)',
              pointerEvents: 'none',
            }}
          />

          {/* Internal Glowing Core/Filament */}
          {!isOff && (
            <div
              style={{
                width: `${size * 0.25}px`,
                height: `${size * 0.25}px`,
                borderRadius: '50%',
                background: '#ffffff',
                boxShadow: '0 0 8px #ffffff',
              }}
            />
          )}
        </div>
      </div>

      {/* Label & Sublabel */}
      {(label || sublabel) && (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {label && (
            <span
              style={{
                fontSize: size <= 18 ? '0.72rem' : '0.78rem',
                fontWeight: 700,
                color: isOff ? '#64748b' : '#f8fafc',
                lineHeight: 1.2,
                transition: 'color 0.2s ease',
              }}
            >
              {label}
            </span>
          )}
          {sublabel && (
            <span
              style={{
                fontSize: '0.66rem',
                fontWeight: 600,
                color: isOff ? '#475569' : config.color,
                transition: 'color 0.2s ease',
              }}
            >
              {sublabel}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
