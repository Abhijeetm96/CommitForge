// src/progress/components/ProgressSettingsModal.tsx
import React, { useState, useRef } from 'react';
import {
  X,
  Download,
  Upload,
  RotateCcw,
  AlertTriangle,
  CheckCircle2,
  FileText,
  ShieldCheck,
  Flame,
  Container,
  Boxes,
} from 'lucide-react';
import { useProgress } from '../useProgress';
import { useFocusTrap } from '../../platform/hooks/useFocusTrap';

export const ProgressSettingsModal: React.FC = () => {
  const {
    showSettingsModal,
    closeSettings,
    progress,
    manager,
    resetProgress,
    exportProgress,
    importProgress,
  } = useProgress();

  const modalContainerRef = useFocusTrap<HTMLDivElement>(showSettingsModal);
  const [confirmReset, setConfirmReset] = useState<boolean>(false);
  const [resetInput, setResetInput] = useState<string>('');
  const [importStatus, setImportStatus] = useState<{
    type: 'idle' | 'success' | 'error';
    message?: string;
  }>({ type: 'idle' });

  const fileInputRef = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showSettingsModal) {
        closeSettings();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showSettingsModal, closeSettings]);

  if (!showSettingsModal) return null;

  // Stats summary for the modal
  const commitStats = manager.getCourseStats('commitforge');
  const dockerStats = manager.getCourseStats('dockforge');
  const kubeStats = manager.getCourseStats('podforge');

  const handleDownloadExport = () => {
    try {
      const dataStr = exportProgress();
      const date = new Date().toISOString().split('T')[0];
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `forgesuite-progress-${date}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err: any) {
      alert(`Export failed: ${err?.message || 'Unknown error'}`);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const content = event.target?.result as string;
      if (!content) return;

      const result = await importProgress(content);
      if (result.success) {
        setImportStatus({
          type: 'success',
          message: 'Progress imported and verified successfully! All academies have been updated.',
        });
      } else {
        setImportStatus({
          type: 'error',
          message: result.error || 'Failed to import progress file.',
        });
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleExecuteReset = async () => {
    await resetProgress();
    setConfirmReset(false);
    setResetInput('');
    setImportStatus({
      type: 'success',
      message: 'All local learning progress has been completely reset.',
    });
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
        background: 'rgba(2, 6, 23, 0.85)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) closeSettings();
      }}
    >
      <div
        ref={modalContainerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Learner Progress Settings"
        style={{
          width: '100%',
          maxWidth: '640px',
          background: 'linear-gradient(160deg, #0f172a 0%, #090d16 100%)',
          border: '1px solid rgba(56, 189, 248, 0.25)',
          borderRadius: '20px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 35px -5px rgba(56, 189, 248, 0.15)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          color: '#f8fafc',
          maxHeight: '90vh',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '1.25rem 1.75rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(15, 23, 42, 0.5)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'rgba(56, 189, 248, 0.15)',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#38bdf8',
              }}
            >
              <ShieldCheck size={20} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700, letterSpacing: '-0.01em' }}>
                Learner Progress & Local State
              </h3>
              <p style={{ margin: 0, fontSize: '0.78rem', color: '#94a3b8' }}>
                Local-first persistence • Zero cloud fees • 100% private to your browser
              </p>
            </div>
          </div>
          <button
            onClick={closeSettings}
            title="Close settings modal"
            aria-label="Close settings modal"
            style={{
              background: 'transparent',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              padding: '0.35rem',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content Body */}
        <div style={{ padding: '1.5rem 1.75rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Status Message */}
          {importStatus.type !== 'idle' && (
            <div
              style={{
                padding: '0.75rem 1rem',
                borderRadius: '10px',
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem',
                background:
                  importStatus.type === 'success' ? 'rgba(34, 197, 94, 0.12)' : 'rgba(239, 68, 68, 0.12)',
                border:
                  importStatus.type === 'success' ? '1px solid rgba(34, 197, 94, 0.3)' : '1px solid rgba(239, 68, 68, 0.3)',
                color: importStatus.type === 'success' ? '#4ade80' : '#f87171',
              }}
            >
              {importStatus.type === 'success' ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
              <span>{importStatus.message}</span>
            </div>
          )}

          {/* Current Academy Breakdown Matrix */}
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Academy Progression Snapshot
            </span>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '0.85rem',
                marginTop: '0.6rem',
              }}
            >
              {/* CommitForge */}
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(240, 80, 51, 0.2)',
                  borderRadius: '12px',
                  padding: '0.85rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                  <Flame size={16} color="#f05033" />
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#f8fafc' }}>CommitForge</span>
                </div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f05033' }}>
                  {commitStats.percentage}%
                </div>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                  {commitStats.completedLessons} / {commitStats.totalLessons} Concepts
                </div>
              </div>

              {/* DockForge */}
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(14, 165, 233, 0.2)',
                  borderRadius: '12px',
                  padding: '0.85rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                  <Container size={16} color="#0ea5e9" />
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#f8fafc' }}>DockForge</span>
                </div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0ea5e9' }}>
                  {dockerStats.percentage}%
                </div>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                  {dockerStats.completedLessons} / {dockerStats.totalLessons} Concepts
                </div>
              </div>

              {/* PodForge */}
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(50, 108, 229, 0.2)',
                  borderRadius: '12px',
                  padding: '0.85rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                  <Boxes size={16} color="#326ce5" />
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#f8fafc' }}>PodForge</span>
                </div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#326ce5' }}>
                  {kubeStats.percentage}%
                </div>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                  {kubeStats.completedLessons} / {kubeStats.totalLessons} Concepts
                </div>
              </div>
            </div>
          </div>

          {/* Export / Import Data Box */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '14px',
              padding: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
            }}
          >
            <div>
              <h4 style={{ margin: 0, fontSize: '0.92rem', fontWeight: 700 }}>Export & Import Progress</h4>
              <p style={{ margin: '0.2rem 0 0', fontSize: '0.78rem', color: '#94a3b8' }}>
                Transfer your local learning state between browsers or backup before clearing site cookies.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <button
                onClick={handleDownloadExport}
                style={{
                  flex: '1 1 auto',
                  background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.15) 0%, rgba(14, 165, 233, 0.25) 100%)',
                  border: '1px solid rgba(56, 189, 248, 0.35)',
                  color: '#38bdf8',
                  padding: '0.65rem 1rem',
                  borderRadius: '10px',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.2s',
                }}
              >
                <Download size={16} />
                Download JSON Backup
              </button>

              <button
                onClick={() => fileInputRef.current?.click()}
                style={{
                  flex: '1 1 auto',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  color: '#e2e8f0',
                  padding: '0.65rem 1rem',
                  borderRadius: '10px',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.2s',
                }}
              >
                <Upload size={16} />
                Restore from JSON
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json,application/json"
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
            </div>
          </div>

          {/* Reset Progress Section */}
          <div
            style={{
              background: 'rgba(239, 68, 68, 0.03)',
              border: '1px solid rgba(239, 68, 68, 0.15)',
              borderRadius: '14px',
              padding: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h4 style={{ margin: 0, fontSize: '0.92rem', fontWeight: 700, color: '#f87171' }}>
                  Reset Learning Progress
                </h4>
                <p style={{ margin: '0.2rem 0 0', fontSize: '0.78rem', color: '#94a3b8' }}>
                  Clear all concept completions, simulator achievements, and challenge records.
                </p>
              </div>

              {!confirmReset && (
                <button
                  onClick={() => setConfirmReset(true)}
                  style={{
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    color: '#f87171',
                    padding: '0.5rem 0.85rem',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                  }}
                >
                  <RotateCcw size={14} />
                  Reset State
                </button>
              )}
            </div>

            {/* Confirmation Box */}
            {confirmReset && (
              <div
                style={{
                  marginTop: '0.5rem',
                  padding: '1rem',
                  background: 'rgba(15, 23, 42, 0.8)',
                  border: '1px solid rgba(239, 68, 68, 0.35)',
                  borderRadius: '10px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
                  <AlertTriangle size={18} color="#f87171" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span style={{ fontSize: '0.8rem', color: '#e2e8f0', lineHeight: 1.4 }}>
                    <strong>Warning:</strong> You will lose all your local learning progress across CommitForge,
                    DockForge, and PodForge. This action cannot be undone unless you have a downloaded backup.
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '0.65rem', justifyContent: 'flex-end', marginTop: '0.25rem' }}>
                  <button
                    onClick={() => setConfirmReset(false)}
                    style={{
                      background: 'transparent',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      color: '#94a3b8',
                      padding: '0.45rem 0.85rem',
                      borderRadius: '8px',
                      fontSize: '0.78rem',
                      cursor: 'pointer',
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleExecuteReset}
                    style={{
                      background: '#ef4444',
                      border: 'none',
                      color: '#fff',
                      padding: '0.45rem 0.95rem',
                      borderRadius: '8px',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    Yes, Reset Everything
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '1rem 1.75rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(15, 23, 42, 0.6)',
            fontSize: '0.75rem',
            color: '#64748b',
          }}
        >
          <span>Storage Key: <code>forgesuite:progress:v1</code></span>
          <button
            onClick={closeSettings}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: '#e2e8f0',
              padding: '0.4rem 1rem',
              borderRadius: '8px',
              fontSize: '0.8rem',
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
