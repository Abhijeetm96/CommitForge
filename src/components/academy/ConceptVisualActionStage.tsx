import React, { useState, useEffect, useRef } from 'react';
import { UniversalConcept } from '../../data/unifiedAcademyData';
import {
  ArrowRight,
  CheckCircle2,
  Info,
  FileCode,
  GitCommit,
  Layers,
  FolderOpen,
  Archive,
  Play,
  Pause,
  RotateCcw,
} from 'lucide-react';

interface Props {
  concept: UniversalConcept;
  onOpenVisualize?: () => void;
}

export const ConceptVisualActionStage: React.FC<Props> = ({ concept, onOpenVisualize }) => {
  const [activeStep, setActiveStep] = useState<'before' | 'running' | 'after'>('before');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const timerRef = useRef<any>(null);

  // Auto-play simulation loop
  useEffect(() => {
    if (!isPlaying) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setActiveStep((prev) => {
        if (prev === 'before') return 'running';
        if (prev === 'running') return 'after';
        setIsPlaying(false);
        return 'after';
      });
    }, 2200);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying]);

  const handlePlay = () => {
    if (activeStep === 'after') {
      setActiveStep('before');
    }
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setActiveStep('before');
  };

  const currentStage = concept.actionStage[activeStep];

  return (
    <div
      style={{
        background: '#090e1a',
        borderRadius: '12px',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        overflow: 'hidden',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
      }}
    >
      {/* Header with Step Toggles & Auto-Play */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.75rem 1.25rem',
          background: 'rgba(255, 255, 255, 0.03)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
          flexWrap: 'wrap',
          gap: '0.75rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => {
              setIsPlaying(false);
              setActiveStep('before');
            }}
            style={{
              padding: '0.35rem 0.85rem',
              borderRadius: '6px',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              border: activeStep === 'before' ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.1)',
              background: activeStep === 'before' ? 'rgba(56, 189, 248, 0.2)' : 'rgba(255, 255, 255, 0.03)',
              color: activeStep === 'before' ? '#38bdf8' : '#94a3b8',
              transition: 'all 0.15s ease',
            }}
          >
            1. {concept.actionStage.before.label}
          </button>
          <button
            onClick={() => {
              setIsPlaying(false);
              setActiveStep('running');
            }}
            style={{
              padding: '0.35rem 0.85rem',
              borderRadius: '6px',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              border: activeStep === 'running' ? '1px solid #f59e0b' : '1px solid rgba(255, 255, 255, 0.1)',
              background: activeStep === 'running' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(255, 255, 255, 0.03)',
              color: activeStep === 'running' ? '#f59e0b' : '#94a3b8',
              transition: 'all 0.15s ease',
            }}
          >
            2. {concept.actionStage.running.label}
          </button>
          <button
            onClick={() => {
              setIsPlaying(false);
              setActiveStep('after');
            }}
            style={{
              padding: '0.35rem 0.85rem',
              borderRadius: '6px',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              border: activeStep === 'after' ? '1px solid #22c55e' : '1px solid rgba(255, 255, 255, 0.1)',
              background: activeStep === 'after' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(255, 255, 255, 0.03)',
              color: activeStep === 'after' ? '#22c55e' : '#94a3b8',
              transition: 'all 0.15s ease',
            }}
          >
            3. {concept.actionStage.after.label}
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {isPlaying ? (
            <button
              onClick={handlePause}
              style={{
                background: 'rgba(245, 158, 11, 0.2)',
                border: '1px solid rgba(245, 158, 11, 0.4)',
                color: '#f59e0b',
                padding: '0.3rem 0.7rem',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.76rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
              }}
            >
              <Pause size={13} />
              <span>Pause</span>
            </button>
          ) : (
            <button
              onClick={handlePlay}
              style={{
                background: 'rgba(34, 197, 94, 0.15)',
                border: '1px solid rgba(34, 197, 94, 0.35)',
                color: '#22c55e',
                padding: '0.3rem 0.75rem',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.76rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
              }}
            >
              <Play size={13} />
              <span>Simulate</span>
            </button>
          )}

          <button
            onClick={handleReset}
            style={{
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#94a3b8',
              padding: '0.3rem 0.5rem',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.75rem',
              display: 'flex',
              alignItems: 'center',
            }}
            title="Reset step to Before"
          >
            <RotateCcw size={13} />
          </button>

          {onOpenVisualize && (
            <button
              onClick={onOpenVisualize}
              style={{
                background: 'rgba(56, 189, 248, 0.12)',
                border: '1px solid rgba(56, 189, 248, 0.25)',
                color: '#38bdf8',
                padding: '0.3rem 0.65rem',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.75rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
              }}
            >
              <span>Full Visualizer Suite</span>
              <ArrowRight size={13} />
            </button>
          )}
        </div>
      </div>

      {/* Progress line */}
      <div style={{ height: '2px', width: '100%', background: 'rgba(255, 255, 255, 0.05)' }}>
        <div
          style={{
            height: '100%',
            background: activeStep === 'before' ? '#38bdf8' : activeStep === 'running' ? '#f59e0b' : '#22c55e',
            width: activeStep === 'before' ? '33.3%' : activeStep === 'running' ? '66.6%' : '100%',
            transition: 'all 0.3s ease',
          }}
        />
      </div>

      {/* Main Visual Flow Stage */}
      <div
        style={{
          padding: '1rem',
          background: '#070b14',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.5rem',
          overflowX: 'auto',
        }}
      >
        {/* Box 1: Working Directory */}
        <div
          style={{
            flex: '1 1 0',
            minWidth: '135px',
            background: 'rgba(15, 23, 42, 0.85)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '10px',
            padding: '0.85rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.55rem',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.78rem',
              fontWeight: 700,
              color: '#94a3b8',
              whiteSpace: 'nowrap',
            }}
          >
            <FolderOpen size={14} color="#f59e0b" />
            Working Directory
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            {currentStage.workingDirectory.length === 0 ? (
              <div style={{ fontSize: '0.74rem', color: '#64748b', fontStyle: 'italic' }}>
                Clean working directory
              </div>
            ) : (
              currentStage.workingDirectory.map((file, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    fontSize: '0.74rem',
                    fontFamily: 'ui-monospace, monospace',
                    background: 'rgba(255, 255, 255, 0.03)',
                    padding: '0.3rem 0.45rem',
                    borderRadius: '6px',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    minWidth: 0,
                  }}
                >
                  <FileCode size={12} color={file.status === 'modified' ? '#f59e0b' : '#38bdf8'} style={{ flexShrink: 0 }} />
                  <span style={{ color: '#f8fafc', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {file.name}
                  </span>
                  <span
                    style={{
                      marginLeft: 'auto',
                      fontSize: '0.66rem',
                      color: file.status === 'modified' ? '#f59e0b' : file.status === 'staged' ? '#38bdf8' : '#22c55e',
                      flexShrink: 0,
                    }}
                  >
                    ({file.status})
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Arrow 1 */}
        <div style={{ color: '#475569', display: 'flex', alignItems: 'center', flexShrink: 0 }}>
          <ArrowRight size={16} />
        </div>

        {/* Box 2: Staging Area */}
        <div
          style={{
            flex: '1 1 0',
            minWidth: '135px',
            background: 'rgba(15, 23, 42, 0.85)',
            border: activeStep === 'after' && currentStage.stagingArea.length === 0
              ? '1px dashed rgba(255, 255, 255, 0.15)'
              : '1px solid rgba(56, 189, 248, 0.25)',
            borderRadius: '10px',
            padding: '0.85rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.55rem',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.78rem',
              fontWeight: 700,
              color: '#38bdf8',
              whiteSpace: 'nowrap',
            }}
          >
            <Archive size={14} color="#38bdf8" />
            Staging Area
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            {currentStage.stagingArea.length === 0 ? (
              <div
                style={{
                  fontSize: '0.74rem',
                  color: '#64748b',
                  fontStyle: 'italic',
                  padding: '0.4rem 0',
                  textAlign: 'center',
                }}
              >
                (empty)
              </div>
            ) : (
              currentStage.stagingArea.map((file, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    fontSize: '0.74rem',
                    fontFamily: 'ui-monospace, monospace',
                    background: 'rgba(56, 189, 248, 0.08)',
                    padding: '0.3rem 0.45rem',
                    borderRadius: '6px',
                    border: '1px solid rgba(56, 189, 248, 0.2)',
                    minWidth: 0,
                  }}
                >
                  <FileCode size={12} color="#38bdf8" style={{ flexShrink: 0 }} />
                  <span style={{ color: '#f8fafc', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {file.name}
                  </span>
                  <span style={{ marginLeft: 'auto', fontSize: '0.66rem', color: '#38bdf8', flexShrink: 0 }}>
                    (staged)
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Arrow 2 */}
        <div style={{ color: '#475569', display: 'flex', alignItems: 'center', flexShrink: 0 }}>
          <ArrowRight size={16} />
        </div>

        {/* Action Pill */}
        <div
          style={{
            background: activeStep === 'running'
              ? 'linear-gradient(135deg, #f05033 0%, #ea580c 100%)'
              : 'rgba(255, 255, 255, 0.08)',
            border: activeStep === 'running'
              ? '1px solid #f05033'
              : '1px solid rgba(255, 255, 255, 0.15)',
            color: '#f8fafc',
            padding: '0.45rem 0.8rem',
            borderRadius: '999px',
            fontSize: '0.76rem',
            fontFamily: 'ui-monospace, monospace',
            fontWeight: 700,
            whiteSpace: 'nowrap',
            flexShrink: 0,
            boxShadow: activeStep === 'running' ? '0 0 15px rgba(240, 80, 51, 0.4)' : 'none',
          }}
        >
          {concept.command}
        </div>

        {/* Arrow 3 */}
        <div style={{ color: '#475569', display: 'flex', alignItems: 'center', flexShrink: 0 }}>
          <ArrowRight size={16} />
        </div>

        {/* Box 3: Repository History */}
        <div
          style={{
            flex: '1.2 1 0',
            minWidth: '160px',
            background: 'rgba(15, 23, 42, 0.85)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '10px',
            padding: '0.85rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.55rem',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.78rem',
              fontWeight: 700,
              color: '#94a3b8',
              whiteSpace: 'nowrap',
            }}
          >
            <Layers size={14} color="#22c55e" />
            Repository History
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            {currentStage.historyCommits.map((cmt, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  fontSize: '0.74rem',
                  background: cmt.isNew ? 'rgba(34, 197, 94, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                  border: cmt.isNew ? '1px solid rgba(34, 197, 94, 0.3)' : '1px solid rgba(255, 255, 255, 0.05)',
                  padding: '0.3rem 0.5rem',
                  borderRadius: '6px',
                  minWidth: 0,
                }}
              >
                <span
                  style={{
                    width: '7px',
                    height: '7px',
                    borderRadius: '50%',
                    background: cmt.isNew ? '#22c55e' : '#64748b',
                    boxShadow: cmt.isNew ? '0 0 8px #22c55e' : 'none',
                    flexShrink: 0,
                  }}
                />
                <span style={{ fontFamily: 'ui-monospace, monospace', fontWeight: 700, color: cmt.isNew ? '#22c55e' : '#cbd5e1', flexShrink: 0 }}>
                  {cmt.hash}
                </span>
                <span style={{ color: '#94a3b8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', minWidth: 0 }}>
                  {cmt.message}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Explanatory description note */}
      <div
        style={{
          padding: '0.75rem 1rem',
          background: 'rgba(255, 255, 255, 0.02)',
          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
          fontSize: '0.82rem',
          color: '#cbd5e1',
          lineHeight: 1.45,
        }}
      >
        {currentStage.description}
      </div>

      {/* Dual Summary Cards: What Changed vs What did NOT Change */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '0.75rem',
          padding: '1rem',
          background: '#070b14',
          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
        }}
      >
        {/* Green Check: What Changed? */}
        <div
          style={{
            background: 'rgba(34, 197, 94, 0.06)',
            border: '1px solid rgba(34, 197, 94, 0.2)',
            borderRadius: '10px',
            padding: '0.85rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.4rem',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              fontSize: '0.8rem',
              fontWeight: 800,
              color: '#22c55e',
            }}
          >
            <CheckCircle2 size={15} />
            What changed?
          </div>
          <ul
            style={{
              margin: 0,
              paddingLeft: '1.1rem',
              fontSize: '0.76rem',
              color: '#e2e8f0',
              lineHeight: 1.5,
            }}
          >
            {currentStage.whatChanged.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>

        {/* Blue Info: What did NOT Change? */}
        <div
          style={{
            background: 'rgba(56, 189, 248, 0.06)',
            border: '1px solid rgba(56, 189, 248, 0.2)',
            borderRadius: '10px',
            padding: '0.85rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.4rem',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              fontSize: '0.8rem',
              fontWeight: 800,
              color: '#38bdf8',
            }}
          >
            <Info size={15} />
            What did NOT change?
          </div>
          <ul
            style={{
              margin: 0,
              paddingLeft: '1.1rem',
              fontSize: '0.76rem',
              color: '#e2e8f0',
              lineHeight: 1.5,
            }}
          >
            {currentStage.whatDidNotChange.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
