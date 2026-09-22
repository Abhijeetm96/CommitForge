import React from 'react';
import { useDocker } from '../../context/DockerContext';
import { CircleDot, Package, HardDrive, Box, Layers } from 'lucide-react';

export const IdeStatusBar: React.FC = () => {
  const { containers, images, volumes } = useDocker();

  const containerCount = containers?.length || 0;
  const imageCount = images?.length || 0;
  const volumeCount = volumes?.length || 0;

  // Simulate disk usage: 300MB per image on average
  const diskUsageGB = ((imageCount * 300) / 1024).toFixed(1);

  const separatorStyle: React.CSSProperties = {
    margin: '0 8px',
    color: 'rgba(255,255,255,0.1)'
  };

  return (
    <div style={{
      height: '28px',
      backgroundColor: '#0a0f1a',
      borderTop: '1px solid rgba(255,255,255,0.08)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 12px',
      fontSize: '0.7rem',
      color: '#94a3b8',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
    }}>
      
      {/* Left side */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <CircleDot size={12} style={{ color: '#4ade80' }} />
        <span>Docker Engine v26.0.0</span>
      </div>

      {/* Center */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Box size={12} />
          <span>{containerCount} containers</span>
        </div>
        <span style={separatorStyle}>•</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Layers size={12} />
          <span>{imageCount} images</span>
        </div>
        <span style={separatorStyle}>•</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <HardDrive size={12} />
          <span>{volumeCount} volumes</span>
        </div>
      </div>

      {/* Right side */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Package size={12} />
          <span>{diskUsageGB} GB</span>
        </div>
        <span style={separatorStyle}>|</span>
        <span style={{ color: '#e2e8f0' }}>acme-saas-platform</span>
      </div>
      
    </div>
  );
};
