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
  GripVertical,
  Info,
  X,
} from 'lucide-react';

export interface PhysicalGitStageProps {
  workingFiles: { name: string; status: 'modified' | 'untracked' | 'staged'; isSelected?: boolean; diff?: string }[];
  stagingFiles: string[];
  localCommits: { hash: string; message: string; branch?: string; isHead?: boolean; files?: string[] }[];
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
  onTransferCommit?: () => void;
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
  onTransferCommit,
}) => {
  const [isHoveringDrop, setIsHoveringDrop] = useState(false);
  const [isCameraFlashing, setIsCameraFlashing] = useState(false);
  const [inspectedObject, setInspectedObject] = useState<{ title: string; subtitle: string; details: string[] } | null>(null);

  const hasRemote = remoteCommits.length > 0 || highlightZone === 'remote' || highlightZone === 'highway';

  // Drag & drop handlers for file -> staging
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

  // Drag & drop handler for commit -> remote
  const handleRemoteDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const data = e.dataTransfer.getData('text/plain');
    if (data === 'C3' && onTransferCommit) {
      onTransferCommit();
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
        padding: '0.5rem 1rem',
        position: 'relative',
        userSelect: 'none',
      }}
    >
      {/* Shutter flash animation */}
      {isCameraFlashing && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(255, 255, 255, 0.9)',
            zIndex: 60,
            borderRadius: '16px',
            animation: 'flash 0.45s ease-out forwards',
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Subtle Object Inspector Tooltip */}
      {inspectedObject && (
        <div
          style={{
            position: 'absolute',
            top: '12px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: '#0f172a',
            border: '1px solid rgba(56, 189, 248, 0.4)',
            borderRadius: '12px',
            padding: '0.85rem 1.25rem',
            boxShadow: '0 12px 32px rgba(0, 0, 0, 0.7)',
            zIndex: 50,
            minWidth: '260px',
            maxWidth: '380px',
            animation: 'fadeIn 0.15s ease-out',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#38bdf8' }}>
              {inspectedObject.title}
            </div>
            <button
              onClick={() => setInspectedObject(null)}
              style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: 0 }}
              aria-label="Close inspection"
            >
              <X size={14} />
            </button>
          </div>
          <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginBottom: '0.5rem' }}>
            {inspectedObject.subtitle}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#cbd5e1', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            {inspectedObject.details.map((d, i) => (
              <div key={i}>• {d}</div>
            ))}
          </div>
        </div>
      )}

      {/* Main Simulation Board */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: hasRemote ? '1.15fr 1fr' : '1fr',
          gap: '1.25rem',
          alignItems: 'stretch',
        }}
      >
        {/* ============================================================ */}
        {/* ZONE A: YOUR COMPUTER (Working Tree, Staging, Camera, History) */}
        {/* ============================================================ */}
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.7)',
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
          {/* Header */}
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

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Click objects to inspect</span>
            </div>
          </div>

          {/* Interactive World Grid: Working Desk vs Staging Area vs Commit Camera */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
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
                padding: '0.85rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: '160px',
                transition: 'all 0.2s ease',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>
                  Your Desk (Working Tree)
                </span>
                <span style={{ fontSize: '0.8rem' }}>📄</span>
              </div>

              <div style={{ margin: '0.5rem 0', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {workingFiles.length === 0 ? (
                  <div style={{ fontSize: '0.82rem', color: '#64748b', fontStyle: 'italic', textAlign: 'center', padding: '1.5rem 0' }}>
                    Working directory clean.
                  </div>
                ) : (
                  workingFiles.map(file => (
                    <div
                      key={file.name}
                      draggable={file.status === 'modified'}
                      onDragStart={e => {
                        e.dataTransfer.setData('text/plain', file.name);
                        e.dataTransfer.effectAllowed = 'move';
                      }}
                      onClick={() => onFileClick && onFileClick(file.name)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.65rem 0.8rem',
                        borderRadius: '8px',
                        background: file.status === 'staged'
                          ? 'rgba(34, 197, 94, 0.1)'
                          : 'rgba(249, 115, 22, 0.12)',
                        border: file.status === 'staged'
                          ? '1px solid rgba(34, 197, 94, 0.3)'
                          : '1.5px solid rgba(249, 115, 22, 0.45)',
                        cursor: file.status === 'modified' ? 'grab' : 'default',
                        boxShadow: file.status === 'modified' ? '0 4px 12px rgba(249, 115, 22, 0.15)' : 'none',
                        transition: 'all 0.15s ease',
                      }}
                      title={file.status === 'modified' ? 'Drag this file into the Staging Box' : 'File is currently staged'}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {file.status === 'modified' && (
                          <GripVertical size={14} color="#f97316" style={{ cursor: 'grab' }} />
                        )}
                        <FileCode size={16} color={file.status === 'staged' ? '#22c55e' : '#f97316'} />
                        <div>
                          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f8fafc' }}>{file.name}</div>
                          {file.diff && (
                            <div style={{ fontSize: '0.65rem', color: '#86efac', fontFamily: 'monospace' }}>
                              {file.diff}
                            </div>
                          )}
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <span
                          style={{
                            fontSize: '0.65rem',
                            fontWeight: 800,
                            padding: '0.15rem 0.4rem',
                            borderRadius: '4px',
                            textTransform: 'uppercase',
                            background: file.status === 'staged' ? '#22c55e' : '#f97316',
                            color: '#0f172a',
                          }}
                        >
                          {file.status}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Accessible subtle keyboard link (not a giant dominant button) */}
              {workingFiles.some(f => f.status === 'modified') && onStageFile && (
                <div style={{ textAlign: 'center', marginTop: '4px' }}>
                  <button
                    onClick={() => onStageFile('index.html')}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#64748b',
                      fontSize: '0.7rem',
                      textDecoration: 'underline',
                      cursor: 'pointer',
                    }}
                  >
                    (or click to move to staging)
                  </button>
                </div>
              )}
            </div>

            {/* 2. Staging Box & Snapshot Camera Object */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              style={{
                background: isHoveringDrop
                  ? 'rgba(34, 197, 94, 0.22)'
                  : highlightZone === 'staging'
                  ? 'rgba(34, 197, 94, 0.08)'
                  : 'rgba(255, 255, 255, 0.03)',
                border: isHoveringDrop
                  ? '2px dashed #22c55e'
                  : highlightZone === 'staging'
                  ? '1.5px solid #22c55e'
                  : '1px dashed rgba(255, 255, 255, 0.15)',
                borderRadius: '12px',
                padding: '0.85rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: '160px',
                transition: 'all 0.2s ease',
                position: 'relative',
              }}
            >
              {/* Snapshot Camera Physical Apparatus positioned above Staging */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                  paddingBottom: '0.5rem',
                  marginBottom: '0.5rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Package size={16} color={stagingFiles.length > 0 ? '#22c55e' : '#64748b'} />
                  <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>
                    Staging Box
                  </span>
                </div>

                {/* Camera Trigger Object */}
                <div
                  onClick={handleCameraClick}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    background:
                      stagingFiles.length > 0
                        ? 'linear-gradient(135deg, #f05033 0%, #ea580c 100%)'
                        : 'rgba(255, 255, 255, 0.05)',
                    border: stagingFiles.length > 0 ? '1px solid #f05033' : '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    padding: '0.3rem 0.65rem',
                    cursor: stagingFiles.length > 0 ? 'pointer' : 'not-allowed',
                    opacity: stagingFiles.length > 0 ? 1 : 0.45,
                    boxShadow: stagingFiles.length > 0 ? '0 0 14px rgba(240, 80, 51, 0.4)' : 'none',
                    transition: 'all 0.2s ease',
                  }}
                  title={stagingFiles.length > 0 ? 'Click camera to capture snapshot commit' : 'Stage changes first'}
                >
                  <Camera size={14} color="#ffffff" />
                  <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#ffffff' }}>
                    📸 Snapshot
                  </span>
                </div>
              </div>

              {/* Inside Staging Content */}
              <div style={{ margin: '0.35rem 0', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                {stagingFiles.length === 0 ? (
                  <div
                    style={{
                      textAlign: 'center',
                      padding: '0.75rem 0.5rem',
                      color: '#64748b',
                      fontSize: '0.8rem',
                    }}
                  >
                    <div>Box is empty</div>
                    <div style={{ fontSize: '0.7rem', color: '#475569', marginTop: '2px' }}>
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
                        padding: '0.55rem 0.75rem',
                        borderRadius: '8px',
                        background: 'rgba(34, 197, 94, 0.15)',
                        border: '1px solid rgba(34, 197, 94, 0.4)',
                        boxShadow: '0 2px 8px rgba(34, 197, 94, 0.2)',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <CheckCircle2 size={15} color="#22c55e" />
                        <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#f8fafc' }}>{staged}</span>
                      </div>
                      <span
                        style={{
                          fontSize: '0.62rem',
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

              <div style={{ fontSize: '0.7rem', color: '#64748b', textAlign: 'center' }}>
                {stagingFiles.length > 0 ? 'Ready to photograph into snapshot' : 'Nothing selected yet'}
              </div>
            </div>
          </div>

          {/* 3. Local History Stack (Commits & Branch Pointer) */}
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
                marginBottom: '0.5rem',
              }}
            >
              <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>
                Local History Stack
              </span>
              <div
                onClick={() =>
                  setInspectedObject({
                    title: 'Branch: main',
                    subtitle: 'Movable Pointer Label',
                    details: [
                      'A branch is not a copy of files; it is just a lightweight label.',
                      'It automatically moves forward when you create a new commit.',
                    ],
                  })
                }
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  cursor: 'pointer',
                  padding: '0.15rem 0.45rem',
                  borderRadius: '6px',
                  background: 'rgba(56, 189, 248, 0.1)',
                }}
              >
                <GitBranch size={13} color="#38bdf8" />
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#38bdf8' }}>
                  main
                </span>
                <Info size={11} color="#64748b" />
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', overflowX: 'auto', padding: '4px 0' }}>
              {localCommits.map((c, index) => {
                const isTransferable = c.hash === 'C3' && hasRemote && !isInSync;

                return (
                  <div
                    key={c.hash}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                    }}
                  >
                    <div
                      draggable={isTransferable}
                      onDragStart={e => {
                        e.dataTransfer.setData('text/plain', c.hash);
                      }}
                      onClick={() =>
                        setInspectedObject({
                          title: `Commit ${c.hash}`,
                          subtitle: c.message,
                          details: [
                            `Permanent snapshot milestone.`,
                            c.branch ? `Branch '${c.branch}' currently points here.` : 'Historic commit milestone.',
                            c.files ? `Included files: ${c.files.join(', ')}` : 'Captured files included.',
                          ],
                        })
                      }
                      style={{
                        background: c.isHead ? 'rgba(56, 189, 248, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                        border: c.isHead ? '1.5px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '8px',
                        padding: '0.45rem 0.75rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        cursor: isTransferable ? 'grab' : 'pointer',
                        boxShadow: c.isHead ? '0 0 12px rgba(56, 189, 248, 0.25)' : 'none',
                        transition: 'all 0.15s ease',
                      }}
                      title={isTransferable ? 'Drag commit C3 across to GitHub' : 'Click to inspect commit'}
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
                );
              })}
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* ZONE B: GITHUB REMOTE (Cloud & Push Sync) */}
        {/* ============================================================ */}
        {hasRemote && (
          <div
            onDragOver={e => e.preventDefault()}
            onDrop={handleRemoteDrop}
            style={{
              background: 'rgba(15, 23, 42, 0.7)',
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
            {/* Header */}
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
                  GitHub (Remote Repository)
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
                  GitHub missing C3
                </div>
              )}
            </div>

            {/* Network Transfer Line between Local and Remote */}
            <div
              style={{
                background: 'rgba(0, 0, 0, 0.4)',
                border: '1px solid rgba(168, 85, 247, 0.25)',
                borderRadius: '12px',
                padding: '0.85rem',
                margin: '0.5rem 0',
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
                <span>Connection Line</span>
                <span style={{ color: '#a855f7' }}>git push</span>
              </div>

              {/* Highway bar */}
              <div
                style={{
                  height: '8px',
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
                    marginTop: '0.5rem',
                    fontSize: '0.78rem',
                    color: '#e2e8f0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                  }}
                >
                  <Sparkles size={13} color="#a855f7" />
                  <span>{packetTransfer.stepDescription}</span>
                </div>
              )}
            </div>

            {/* Remote Commits Stack on GitHub */}
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
                  marginBottom: '0.5rem',
                }}
              >
                <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>
                  GitHub Commits
                </span>
                <div
                  onClick={() =>
                    setInspectedObject({
                      title: 'GitHub main branch',
                      subtitle: 'Remote branch reference',
                      details: [
                        'GitHub maintains its own copy of the main branch.',
                        'Pushing sends your new commit C3 to advance GitHub to match your computer.',
                      ],
                    })
                  }
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    cursor: 'pointer',
                    padding: '0.15rem 0.45rem',
                    borderRadius: '6px',
                    background: 'rgba(168, 85, 247, 0.1)',
                  }}
                >
                  <Cloud size={13} color="#a855f7" />
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#c084fc' }}>
                    main
                  </span>
                  <Info size={11} color="#64748b" />
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
                      onClick={() =>
                        setInspectedObject({
                          title: `GitHub Commit ${c.hash}`,
                          subtitle: c.message,
                          details: [
                            'Available to all teammates who have access to this GitHub repository.',
                          ],
                        })
                      }
                      style={{
                        background: c.branch ? 'rgba(168, 85, 247, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                        border: c.branch ? '1.5px solid #a855f7' : '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '8px',
                        padding: '0.45rem 0.75rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        cursor: 'pointer',
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
