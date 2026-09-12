import React from 'react';

interface ForgeAvatarProps {
  size?: number;
  mood?: 'happy' | 'thinking' | 'excited' | 'waving';
}

export const ForgeAvatar: React.FC<ForgeAvatarProps> = ({ size = 64, mood = 'happy' }) => {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: 'radial-gradient(circle at 35% 30%, #38bdf8 0%, #1d4ed8 70%, #0f172a 100%)',
        padding: size * 0.08,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 16px rgba(56, 189, 248, 0.35)',
        position: 'relative',
        flexShrink: 0,
      }}
      title="Forge - Your Git Mentor"
    >
      <svg
        viewBox="0 0 100 100"
        width="100%"
        height="100%"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Cute Ear Pads / Headphones */}
        <rect x="8" y="38" width="10" height="24" rx="5" fill="#38bdf8" />
        <rect x="82" y="38" width="10" height="24" rx="5" fill="#38bdf8" />
        <path d="M13 40 C13 18, 87 18, 87 40" stroke="#38bdf8" strokeWidth="4" strokeLinecap="round" />

        {/* Small Antenna */}
        <circle cx="50" cy="14" r="4" fill="#38bdf8" />
        <line x1="50" y1="18" x2="50" y2="26" stroke="#38bdf8" strokeWidth="3" />

        {/* Head Outer */}
        <rect x="18" y="26" width="64" height="52" rx="20" fill="#e0f2fe" stroke="#38bdf8" strokeWidth="3" />

        {/* Visor Screen */}
        <rect x="24" y="34" width="52" height="36" rx="14" fill="#0c1322" />

        {/* Eyes (Glowing Cyan) */}
        {mood === 'happy' || mood === 'waving' ? (
          <>
            <ellipse cx="40" cy="48" rx="5" ry="6.5" fill="#38bdf8" />
            <circle cx="41.5" cy="46" r="2" fill="#ffffff" />
            <ellipse cx="60" cy="48" rx="5" ry="6.5" fill="#38bdf8" />
            <circle cx="61.5" cy="46" r="2" fill="#ffffff" />
          </>
        ) : (
          <>
            <ellipse cx="40" cy="48" rx="5" ry="4" fill="#38bdf8" />
            <ellipse cx="60" cy="48" rx="5" ry="6.5" fill="#38bdf8" />
          </>
        )}

        {/* Friendly Glow Smile */}
        <path
          d="M42 59 Q50 65 58 59"
          stroke="#38bdf8"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />

        {/* Cute Cheek Blush */}
        <circle cx="31" cy="54" r="3" fill="rgba(56, 189, 248, 0.4)" />
        <circle cx="69" cy="54" r="3" fill="rgba(56, 189, 248, 0.4)" />
      </svg>
    </div>
  );
};
