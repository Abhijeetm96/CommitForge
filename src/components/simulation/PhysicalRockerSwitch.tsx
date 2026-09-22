import React from 'react';
import './simulation.css';

export interface PhysicalRockerSwitchProps {
  id?: string;
  label?: string;
  sublabel?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  color?: 'cyan' | 'emerald' | 'amber' | 'crimson' | 'purple';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}

export const PhysicalRockerSwitch: React.FC<PhysicalRockerSwitchProps> = ({
  id,
  label,
  sublabel,
  checked,
  onChange,
  color = 'cyan',
  size = 'md',
  disabled = false,
}) => {
  const colorMap = {
    cyan: { led: '#38bdf8', glow: 'rgba(56, 189, 248, 0.6)', activeBg: '#0284c7' },
    emerald: { led: '#4ade80', glow: 'rgba(74, 222, 128, 0.6)', activeBg: '#16a34a' },
    amber: { led: '#facc15', glow: 'rgba(250, 204, 21, 0.6)', activeBg: '#d97706' },
    crimson: { led: '#f87171', glow: 'rgba(248, 113, 113, 0.6)', activeBg: '#dc2626' },
    purple: { led: '#c084fc', glow: 'rgba(192, 132, 252, 0.6)', activeBg: '#9333ea' },
  }[color];

  const dimensions = {
    sm: { width: 44, height: 22, paddle: 16, offset: 22 },
    md: { width: 54, height: 28, paddle: 22, offset: 26 },
    lg: { width: 66, height: 34, paddle: 26, offset: 32 },
  }[size];

  const handleToggle = () => {
    if (disabled) return;
    onChange(!checked);
  };

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.65rem',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.45 : 1,
        userSelect: 'none',
      }}
      onClick={handleToggle}
      role="switch"
      aria-checked={checked}
      id={id}
    >
      {/* 3D Rocker Housing */}
      <div
        className="rocker-switch-housing"
        style={{
          position: 'relative',
          width: `${dimensions.width}px`,
          height: `${dimensions.height}px`,
          borderRadius: `${dimensions.height}px`,
          background: checked
            ? `linear-gradient(180deg, #1e293b 0%, #0f172a 100%)`
            : `linear-gradient(180deg, #111827 0%, #030712 100%)`,
          border: `1.5px solid ${checked ? colorMap.led : 'rgba(255, 255, 255, 0.15)'}`,
          boxShadow: checked
            ? `0 0 12px ${colorMap.glow}, inset 0 2px 5px rgba(0,0,0,0.8)`
            : `inset 0 2px 4px rgba(0,0,0,0.9)`,
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          flexShrink: 0,
        }}
      >
        {/* Paddle Button */}
        <div
          className="rocker-switch-paddle"
          style={{
            position: 'absolute',
            top: '2px',
            left: '2px',
            width: `${dimensions.paddle}px`,
            height: `${dimensions.paddle}px`,
            borderRadius: '50%',
            background: checked
              ? `radial-gradient(circle at 35% 35%, #ffffff 0%, ${colorMap.led} 50%, ${colorMap.activeBg} 100%)`
              : `linear-gradient(180deg, #475569 0%, #1e293b 100%)`,
            transform: checked ? `translateX(${dimensions.offset}px)` : 'translateX(0)',
            boxShadow: checked
              ? `0 2px 8px ${colorMap.glow}, 0 1px 2px rgba(0,0,0,0.5)`
              : '0 2px 4px rgba(0,0,0,0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Micro LED Center Indicator */}
          <div
            style={{
              width: `${Math.max(4, dimensions.paddle / 4)}px`,
              height: `${Math.max(4, dimensions.paddle / 4)}px`,
              borderRadius: '50%',
              background: checked ? '#ffffff' : '#334155',
              boxShadow: checked ? `0 0 6px #ffffff` : 'none',
            }}
          />
        </div>

        {/* Binary State Text (I / O) subtle imprint */}
        <span
          style={{
            position: 'absolute',
            left: '7px',
            top: '50%',
            transform: 'translateY(-50%)',
            fontSize: `${dimensions.height * 0.35}px`,
            fontWeight: 800,
            color: checked ? colorMap.led : 'transparent',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            pointerEvents: 'none',
            opacity: checked ? 0.9 : 0,
            transition: 'opacity 0.15s ease',
          }}
        >
          ON
        </span>
        <span
          style={{
            position: 'absolute',
            right: '7px',
            top: '50%',
            transform: 'translateY(-50%)',
            fontSize: `${dimensions.height * 0.35}px`,
            fontWeight: 800,
            color: '#64748b',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            pointerEvents: 'none',
            opacity: checked ? 0 : 0.8,
            transition: 'opacity 0.15s ease',
          }}
        >
          OFF
        </span>
      </div>

      {/* Label and Sublabel */}
      {(label || sublabel) && (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {label && (
            <span
              style={{
                fontSize: size === 'sm' ? '0.74rem' : size === 'lg' ? '0.88rem' : '0.8rem',
                fontWeight: 700,
                color: checked ? '#f8fafc' : '#94a3b8',
                letterSpacing: '-0.01em',
                lineHeight: 1.2,
                transition: 'color 0.15s ease',
              }}
            >
              {label}
            </span>
          )}
          {sublabel && (
            <span
              style={{
                fontSize: '0.66rem',
                color: checked ? colorMap.led : '#64748b',
                fontWeight: 500,
                marginTop: '1px',
                transition: 'color 0.15s ease',
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
