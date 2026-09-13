import React, { useState } from 'react';
import {
  FileCode,
  Package,
  Camera,
  CheckCircle2,
  Cloud,
  ArrowRight,
  Sparkles,
  GitBranch,
  Radio,
  Wifi,
  Layers,
} from 'lucide-react';

export interface PhysicalGitStageProps {
  workingFiles: { name: string; status: 'modified' | 'untracked' | 'staged'; isSelected?: boolean }[];
  stagingFiles: string[];
  localCommits: { hash: string; message: string; branch?: string; isHead?: boolean }[];
  remoteCommits?: { hash: string; message: string; branch?: string }[];
  highlightZone?: 'working' | 'staging' | 'camera' | 'repo' | 'remote' | 'highway';
  cameraActive?: boolean;
  packetTransfer?: {
    active: boolean;
    packetLabel: string;
    stepDescription: string;
    progressPercent: number;
  };
  isInSync?: boolean;
  onFileClick?: (fileName: string) => void;
  onStageFile?: (fileName: string) => void;
  onTakeSnapshot?: () => void;
  isDragTarget?: boolean;
}

export const PhysicalGitStage: React.FC<PhysicalGitStageProps> = ({
  workingFiles,
  stagingFiles,
  localCommits,
  remoteCommits = [],
  highlightZone,
  cameraActive = false,
  packetTransfer,
  isInSync = false,
  onFileClick,
  onStageFile,
  onTakeSnapshot,
}) => {
  const [isHoveringDrop, setIsHoveringDrop] = useState(false);
  const [isCameraFlashing, setIsCameraFlashing] = useState(false);

  const hasRemote = remoteCommits.length > 0 || highlightZone === 'remote' || highlightZone === 'highway';

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsHoveringDrop(true);
  };

  const handleDragLeave = () => {
    setIsHoveringDrop(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsHoveringDrop(false);
    const fileName = e.dataTransfer.getData('text/plain');
    if (fileName && onStageFile) {
      onStageFile(fileName);
    }
  };

  const handleCameraClick = () => {
    if ((cameraActive || stagingFiles.length > 0) && onTakeSnapshot) {
      setIsCameraFlashing(true);
      setTimeout(() => setIsCameraFlashing(false), 450);
      onTakeSnapshot();
    }
  };

  return (
    <div
      style={{
        width: '100%',
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0.75rem 1rem',
        position: 'relative',
        userSelect: 'none',
      }}
    >
      {/* Camera Shutter Flash Overlay */}
      {isCameraFlashing && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(255, 255, 255, 0.85)',
            zIndex: 50,
            borderRadius: '16px',
            animation: 'flash 0.45s ease-out forwards',
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Main Simulation Board */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: hasRemote ? '1.1fr 1fr' : '1fr',
          gap: '1.25rem',
          alignItems: 'stretch',
        }}
      >
        {/* ============================================================ */}
        {/* ZONE A: YOUR COMPUTER (Working Tree, Staging, Camera, History) */}
        {/* ============================================================ */}
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.65)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '16px',
            padding: '1.1rem 1.25rem',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.4)',
          }}
        >
          {/* Header Badge */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.1rem' }}>💻</span>
              <span
                style={{
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: '#94a3b8',
                }}
              >
                Your Computer (Local Repository)
              </span>
            </div>
            {stagingFiles.length > 0 && (
              <div
                style={{
                  fontSize: '0.75rem',
                  color: '#4ade80',
                  background: 'rgba(34, 197, 94, 0.1)',
                  padding: '0.2rem 0.6rem',
                  borderRadius: '999px',
                  border: '1px solid rgba(34, 197, 94, 0.3)',
                  fontWeight: 700,
                }}
              >
                Staged: {stagingFiles.length} change
              </div>
            )}
          </div>

          {/* Interactive World Grid: Working Desk vs Staging Area vs Commit Camera */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem',
              alignItems: 'stretch',
            }}
          >
            {/* 1. Working Tree: File on Desk */}
            <div
              style={{
                background: highlightZone === 'working' ? 'rgba(56, 189, 248, 0.08)' : 'rgba(255, 255, 255, 0.03)',
                border:
                  highlightZone === 'working'
                    ? '1.5px solid #38bdf8'
                    : '1px dashed rgba(255, 255, 255, 0.12)',
                borderRadius: '12px',
                padding: '0.9rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: '140px',
                transition: 'all 0.2s ease',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>
                  Desk (Working Tree)
                </span>
                <span style={{ fontSize: '0.85rem' }}>📄</span>
              </div>

              <div style={{ margin: '0.5rem 0' }}>
                {workingFiles.length === 0 ? (
                  <div style={{ fontSize: '0.82rem', color: '#64748b', fontStyle: 'italic', textAlign: 'center', padding: '1rem 0' }}>
                    Working directory clean.
                  </div>
                ) : (
                  workingFiles.map(file => (
                    <div
                      key={file.name}
                      draggable={file.status !== 'staged'}
                      onDragStart={e => e.dataTransfer.setData('text/plain', file.name)}
                      onClick={() => onFileClick && onFileClick(file.name)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.65rem 0.85rem',
                        borderRadius: '8px',
                        background: file.isSelected
                          ? 'rgba(56, 189, 248, 0.18)'
                          : file.status === 'staged'
                          ? 'rgba(34, 197, 94, 0.1)'
                          : 'rgba(249, 115, 22, 0.12)',
                        border: file.isSelected
                          ? '1.5px solid #38bdf8'
                          : file.status === 'staged'
                          ? '1px solid rgba(34, 197, 94, 0.3)'
                          : '1px solid rgba(249, 115, 22, 0.35)',
                        cursor: 'pointer',
                        transform: file.isSelected ? 'translateY(-2px)' : 'none',
                        boxShadow: file.isSelected ? '0 4px 12px rgba(56, 189, 248, 0.3)' : 'none',
                        transition: 'all 0.15s ease',
                      }}
                      title="Click or drag this file into the Staging Box"
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <FileCode size={16} color={file.status === 'staged' ? '#22c55e' : '#f97316'} />
                        <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#f8fafc' }}>{file.name}</span>
                      </div>
                      <span
                        style={{
                          fontSize: '0.68rem',
                          fontWeight: 800,
                          padding: '0.15rem 0.45rem',
                          borderRadius: '4px',
                          textTransform: 'uppercase',
                          background: file.status === 'staged' ? '#22c55e' : '#f97316',
                          color: '#0f172a',
                        }}
                      >
                        {file.status}
                      </span>
                    </div>
                  ))
                )}
              </div>

              {/* Accessible Click Action Alternative */}
              {workingFiles.some(f => f.status === 'modified' && f.isSelected) && onStageFile && (
                <button
                  onClick={() => onStageFile('index.html')}
                  style={{
                    width: '100%',
                    padding: '0.4rem',
                    background: 'rgba(56, 189, 248, 0.15)',
                    border: '1px solid rgba(56, 189, 248, 0.4)',
                    borderRadius: '6px',
                    color: '#38bdf8',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.3rem',
                  }}
                >
                  <span>Move to Staging</span>
                  <ArrowRight size={12} />
                </button>
              )}
            </div>

            {/* 2. Staging Box */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              style={{
                background: isHoveringDrop
                  ? 'rgba(34, 197, 94, 0.2)'
                  : highlightZone === 'staging'
                  ? 'rgba(34, 197, 94, 0.09)'
                  : 'rgba(255, 255, 255, 0.03)',
                border: isHoveringDrop
                  ? '2px dashed #22c55e'
                  : highlightZone === 'staging'
                  ? '1.5px solid #22c55e'
                  : '1px dashed rgba(255, 255, 255, 0.15)',
                borderRadius: '12px',
                padding: '0.9rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: '140px',
                transition: 'all 0.2s ease',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>
                  Staging Box
                </span>
                <span style={{ fontSize: '1rem' }}>📦</span>
              </div>

              <div style={{ margin: '0.5rem 0' }}>
                {stagingFiles.length === 0 ? (
                  <div
                    style={{
                      textAlign: 'center',
                      padding: '1rem 0.5rem',
                      color: '#64748b',
                      fontSize: '0.82rem',
                    }}
                  >
                    <Package size={24} style={{ margin: '0 auto 0.3rem', opacity: 0.5 }} />
                    <div>Box is empty</div>
                    <div style={{ fontSize: '0.72rem', color: '#475569', marginTop: '2px' }}>
                      Drag files here to stage
                    </div>
                  </div>
                ) : (
                  stagingFiles.map(staged => (
                    <div
                      key={staged}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.65rem 0.85rem',
                        borderRadius: '8px',
                        background: 'rgba(34, 197, 94, 0.15)',
                        border: '1px solid rgba(34, 197, 94, 0.4)',
                        boxShadow: '0 2px 8px rgba(34, 197, 94, 0.2)',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <CheckCircle2 size={16} color="#22c55e" />
                        <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#f8fafc' }}>{staged}</span>
                      </div>
                      <span
                        style={{
                          fontSize: '0.68rem',
                          fontWeight: 800,
                          color: '#22c55e',
                          textTransform: 'uppercase',
                        }}
                      >
                        STAGED ✓
                      </span>
                    </div>
                  ))
                )}
              </div>

              <div style={{ fontSize: '0.72rem', color: '#64748b', textAlign: 'center' }}>
                {stagingFiles.length > 0 ? 'Ready to photograph into snapshot' : 'Nothing selected yet'}
              </div>
            </div>

            {/* 3. Commit Camera */}
            <div
              onClick={handleCameraClick}
              style={{
                background:
                  cameraActive || stagingFiles.length > 0
                    ? highlightZone === 'camera'
                      ? 'linear-gradient(135deg, rgba(240, 80, 51, 0.2), rgba(234, 88, 12, 0.25))'
                      : 'rgba(240, 80, 51, 0.1)'
                    : 'rgba(255, 255, 255, 0.02)',
                border:
                  cameraActive || stagingFiles.length > 0
                    ? '1.5px solid #f05033'
                    : '1px dashed rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                padding: '0.9rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                minHeight: '140px',
                cursor: cameraActive || stagingFiles.length > 0 ? 'pointer' : 'not-allowed',
                opacity: cameraActive || stagingFiles.length > 0 ? 1 : 0.5,
                transition: 'all 0.2s ease',
                boxShadow:
                  cameraActive || stagingFiles.length > 0
                    ? '0 4px 20px rgba(240, 80, 51, 0.25)'
                    : 'none',
              }}
              title={
                stagingFiles.length > 0
                  ? 'Click to take snapshot commit'
                  : 'Stage changes first before taking a snapshot'
              }
            >
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '50%',
                  background:
                    cameraActive || stagingFiles.length > 0
                      ? 'linear-gradient(135deg, #f05033 0%, #ea580c 100%)'
                      : 'rgba(255, 255, 255, 0.06)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  marginBottom: '0.5rem',
                  boxShadow:
                    cameraActive || stagingFiles.length > 0
                      ? '0 0 16px rgba(240, 80, 51, 0.5)'
                      : 'none',
                }}
              >
                <Camera size={22} />
              </div>
              <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#f8fafc' }}>
                Snapshot Camera
              </div>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '2px' }}>
                {stagingFiles.length > 0 ? 'Click to seal commit' : 'Needs staged files'}
              </div>
            </div>
          </div>

          {/* 4. Local History Stack & Branch Pointer */}
          <div
            style={{
              background: highlightZone === 'repo' ? 'rgba(56, 189, 248, 0.08)' : 'rgba(0, 0, 0, 0.25)',
              border: highlightZone === 'repo' ? '1.5px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.06)',
              borderRadius: '12px',
              padding: '0.75rem 1rem',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '0.6rem',
              }}
            >
              <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>
                Local History Stack (Commits)
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <GitBranch size={13} color="#38bdf8" />
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#38bdf8' }}>
                  Branch: main
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', overflowX: 'auto', padding: '4px 0' }}>
              {localCommits.map((c, index) => (
                <div
                  key={c.hash}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                >
                  <div
                    style={{
                      background: c.isHead ? 'rgba(56, 189, 248, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                      border: c.isHead ? '1.5px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '8px',
                      padding: '0.45rem 0.75rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      boxShadow: c.isHead ? '0 0 12px rgba(56, 189, 248, 0.25)' : 'none',
                    }}
                  >
                    <div
                      style={{
                        width: '18px',
                        height: '18px',
                        borderRadius: '50%',
                        background: c.isHead ? '#38bdf8' : '#64748b',
                        color: '#0f172a',
                        fontSize: '0.65rem',
                        fontWeight: 900,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      ●
                    </div>
                    <div>
                      <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#f8fafc' }}>
                        {c.hash}
                      </div>
                      <div
                        style={{
                          fontSize: '0.68rem',
                          color: '#94a3b8',
                          maxWidth: '120px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {c.message}
                      </div>
                    </div>

                    {c.branch && (
                      <span
                        style={{
                          fontSize: '0.65rem',
                          fontWeight: 800,
                          background: '#38bdf8',
                          color: '#0f172a',
                          padding: '0.1rem 0.4rem',
                          borderRadius: '4px',
                        }}
                      >
                        {c.branch}
                      </span>
                    )}
                  </div>

                  {index < localCommits.length - 1 && (
                    <ArrowRight size={14} color="#64748b" style={{ flexShrink: 0 }} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* ZONE B: REMOTE CLOUD & FIBER HIGHWAY (Push / Sync) */}
        {/* ============================================================ */}
        {hasRemote && (
          <div
            style={{
              background: 'rgba(15, 23, 42, 0.65)',
              border: highlightZone === 'remote' ? '1.5px solid #a855f7' : '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '16px',
              padding: '1.1rem 1.25rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.4)',
              position: 'relative',
            }}
          >
            {/* Header Badge */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Cloud size={20} color="#a855f7" />
                <span
                  style={{
                    fontSize: '0.82rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    color: '#c084fc',
                  }}
                >
                  Remote Cloud (origin / GitHub)
                </span>
              </div>

              {isInSync ? (
                <div
                  style={{
                    fontSize: '0.75rem',
                    color: '#4ade80',
                    background: 'rgba(34, 197, 94, 0.15)',
                    padding: '0.2rem 0.65rem',
                    borderRadius: '999px',
                    border: '1px solid rgba(34, 197, 94, 0.35)',
                    fontWeight: 800,
                  }}
                >
                  ✓ IN SYNC
                </div>
              ) : (
                <div
                  style={{
                    fontSize: '0.75rem',
                    color: '#fbbf24',
                    background: 'rgba(251, 191, 36, 0.1)',
                    padding: '0.2rem 0.65rem',
                    borderRadius: '999px',
                    border: '1px solid rgba(251, 191, 36, 0.3)',
                    fontWeight: 700,
                  }}
                >
                  Local ahead by 1 commit
                </div>
              )}
            </div>

            {/* Fiber Optic Transfer Highway */}
            <div
              style={{
                background: 'rgba(0, 0, 0, 0.4)',
                border: '1px solid rgba(168, 85, 247, 0.25)',
                borderRadius: '12px',
                padding: '1rem',
                margin: '0.75rem 0',
                position: 'relative',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  color: '#94a3b8',
                  marginBottom: '0.5rem',
                  textTransform: 'uppercase',
                }}
              >
                <span>Network Transfer Line</span>
                <span style={{ color: '#a855f7' }}>git push origin main</span>
              </div>

              {/* Highway progress bar */}
              <div
                style={{
                  height: '10px',
                  background: 'rgba(255, 255, 255, 0.08)',
                  borderRadius: '999px',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: `${packetTransfer?.progressPercent || (isInSync ? 100 : 25)}%`,
                    background: 'linear-gradient(90deg, #38bdf8 0%, #a855f7 100%)',
                    borderRadius: '999px',
                    transition: 'width 0.8s ease-in-out',
                    boxShadow: '0 0 10px #a855f7',
                  }}
                />
              </div>

              {packetTransfer && packetTransfer.active && (
                <div
                  style={{
                    marginTop: '0.6rem',
                    fontSize: '0.8rem',
                    color: '#e2e8f0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                  }}
                >
                  <Sparkles size={14} color="#a855f7" />
                  <span>{packetTransfer.stepDescription}</span>
                </div>
              )}
            </div>

            {/* Remote Commits Stack */}
            <div
              style={{
                background: 'rgba(0, 0, 0, 0.25)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                borderRadius: '12px',
                padding: '0.75rem 1rem',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '0.6rem',
                }}
              >
                <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>
                  Remote History (Commits)
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Cloud size={13} color="#a855f7" />
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#c084fc' }}>
                    main
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', overflowX: 'auto', padding: '4px 0' }}>
                {remoteCommits.map((c, index) => (
                  <div
                    key={c.hash}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                    }}
                  >
                    <div
                      style={{
                        background: c.branch ? 'rgba(168, 85, 247, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                        border: c.branch ? '1.5px solid #a855f7' : '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '8px',
                        padding: '0.45rem 0.75rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        boxShadow: c.branch ? '0 0 12px rgba(168, 85, 247, 0.25)' : 'none',
                      }}
                    >
                      <div
                        style={{
                          width: '18px',
                          height: '18px',
                          borderRadius: '50%',
                          background: c.branch ? '#a855f7' : '#64748b',
                          color: '#0f172a',
                          fontSize: '0.65rem',
                          fontWeight: 900,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        ●
                      </div>
                      <div>
                        <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#f8fafc' }}>
                          {c.hash}
                        </div>
                        <div
                          style={{
                            fontSize: '0.68rem',
                            color: '#94a3b8',
                            maxWidth: '120px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {c.message}
                        </div>
                      </div>

                      {c.branch && (
                        <span
                          style={{
                            fontSize: '0.65rem',
                            fontWeight: 800,
                            background: '#a855f7',
                            color: '#0f172a',
                            padding: '0.1rem 0.4rem',
                            borderRadius: '4px',
                          }}
                        >
                          {c.branch}
                        </span>
                      )}
                    </div>

                    {index < remoteCommits.length - 1 && (
                      <ArrowRight size={14} color="#64748b" style={{ flexShrink: 0 }} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
