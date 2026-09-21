import React, { useState } from 'react';
import { Play, CheckCircle2, XCircle, AlertTriangle, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { UniversalDockerConcept } from '../../data/unifiedDockerData';

interface PipelineSimulatorProps {
  concept: UniversalDockerConcept;
  simState: 'created' | 'running' | 'paused' | 'stopped' | 'removed';
  setSimState: (s: 'created' | 'running' | 'paused' | 'stopped' | 'removed') => void;
  showToast: (msg: string) => void;
}

export const PipelineSimulator: React.FC<PipelineSimulatorProps> = ({
  concept,
  showToast,
}) => {
  const [pipelineStep, setPipelineStep] = useState<number>(0); // 0 = idle, 1 = git, 2 = build, 3 = scan, 4 = test, 5 = push
  const [failScenario, setFailScenario] = useState<'none' | 'cve' | 'test'>('none');

  const runPipeline = () => {
    setPipelineStep(1);
    showToast('🚀 Pipeline Step 1: Git Push triggered build...');
    setTimeout(() => {
      setPipelineStep(2);
      showToast('🔨 Pipeline Step 2: Docker Build assembled image layers');
      setTimeout(() => {
        setPipelineStep(3);
        if (failScenario === 'cve') {
          showToast('❌ Pipeline HALTED at Step 3: Trivy found 2 CRITICAL CVEs!');
          return;
        }
        showToast('🛡️ Pipeline Step 3: Security Scan PASSED (0 Critical CVEs)');
        setTimeout(() => {
          setPipelineStep(4);
          if (failScenario === 'test') {
            showToast('❌ Pipeline HALTED at Step 4: 1 Unit Test failed!');
            return;
          }
          showToast('✅ Pipeline Step 4: Automated Container Unit Tests PASSED');
          setTimeout(() => {
            setPipelineStep(5);
            showToast('🎉 Pipeline Complete! Image pushed to Registry & Deployed!');
          }, 800);
        }, 800);
      }, 800);
    }, 800);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* HEADER & CONTROLS */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(0,0,0,0.3)', padding: '0.85rem 1rem', borderRadius: '10px', border: '1px solid var(--docker-border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
          <Zap size={18} color="var(--docker-blue)" />
          <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#fff' }}>
            Engine D: CI/CD Build, Security Scan & Test Pipeline
          </span>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <select
            value={failScenario}
            onChange={(e) => setFailScenario(e.target.value as any)}
            style={{ background: '#090d16', color: '#cbd5e1', border: '1px solid var(--docker-border)', padding: '0.35rem 0.65rem', borderRadius: '6px', fontSize: '0.76rem' }}
          >
            <option value="none">Normal Flow (All Pass)</option>
            <option value="cve">Inject Security CVE Failure</option>
            <option value="test">Inject Unit Test Failure</option>
          </select>

          <button
            onClick={runPipeline}
            style={{
              padding: '0.35rem 0.85rem',
              borderRadius: '6px',
              background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
              color: '#fff',
              border: 'none',
              fontSize: '0.76rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
            }}
          >
            <Play size={13} fill="#fff" />
            Trigger Pipeline Run
          </button>
        </div>
      </div>

      {/* PIPELINE VISUAL FLOW STEPS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.65rem' }}>
        {/* Step 1: Git Push */}
        <div style={{ background: pipelineStep >= 1 ? 'rgba(14, 165, 233, 0.15)' : 'rgba(255,255,255,0.03)', border: pipelineStep >= 1 ? '1px solid #0ea5e9' : '1px solid var(--docker-border)', padding: '0.85rem 0.5rem', borderRadius: '8px', textAlign: 'center' }}>
          <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>1. Trigger</div>
          <div style={{ fontWeight: 800, fontSize: '0.78rem', color: '#fff', margin: '0.2rem 0' }}>Git Push</div>
          {pipelineStep >= 1 && <CheckCircle2 size={14} color="#0ea5e9" style={{ margin: '0 auto' }} />}
        </div>

        {/* Step 2: Build */}
        <div style={{ background: pipelineStep >= 2 ? 'rgba(14, 165, 233, 0.15)' : 'rgba(255,255,255,0.03)', border: pipelineStep >= 2 ? '1px solid #0ea5e9' : '1px solid var(--docker-border)', padding: '0.85rem 0.5rem', borderRadius: '8px', textAlign: 'center' }}>
          <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>2. Build</div>
          <div style={{ fontWeight: 800, fontSize: '0.78rem', color: '#fff', margin: '0.2rem 0' }}>docker build</div>
          {pipelineStep >= 2 && <CheckCircle2 size={14} color="#0ea5e9" style={{ margin: '0 auto' }} />}
        </div>

        {/* Step 3: Security Scan */}
        <div style={{ background: pipelineStep === 3 && failScenario === 'cve' ? 'rgba(239, 68, 68, 0.2)' : pipelineStep >= 3 ? 'rgba(14, 165, 233, 0.15)' : 'rgba(255,255,255,0.03)', border: pipelineStep === 3 && failScenario === 'cve' ? '1px solid #ef4444' : pipelineStep >= 3 ? '1px solid #0ea5e9' : '1px solid var(--docker-border)', padding: '0.85rem 0.5rem', borderRadius: '8px', textAlign: 'center' }}>
          <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>3. Security</div>
          <div style={{ fontWeight: 800, fontSize: '0.78rem', color: '#fff', margin: '0.2rem 0' }}>Trivy Scan</div>
          {pipelineStep === 3 && failScenario === 'cve' ? <XCircle size={14} color="#ef4444" style={{ margin: '0 auto' }} /> : pipelineStep >= 3 ? <CheckCircle2 size={14} color="#0ea5e9" style={{ margin: '0 auto' }} /> : null}
        </div>

        {/* Step 4: Unit Tests */}
        <div style={{ background: pipelineStep === 4 && failScenario === 'test' ? 'rgba(239, 68, 68, 0.2)' : pipelineStep >= 4 ? 'rgba(14, 165, 233, 0.15)' : 'rgba(255,255,255,0.03)', border: pipelineStep === 4 && failScenario === 'test' ? '1px solid #ef4444' : pipelineStep >= 4 ? '1px solid #0ea5e9' : '1px solid var(--docker-border)', padding: '0.85rem 0.5rem', borderRadius: '8px', textAlign: 'center' }}>
          <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>4. Test</div>
          <div style={{ fontWeight: 800, fontSize: '0.78rem', color: '#fff', margin: '0.2rem 0' }}>Container Test</div>
          {pipelineStep === 4 && failScenario === 'test' ? <XCircle size={14} color="#ef4444" style={{ margin: '0 auto' }} /> : pipelineStep >= 4 ? <CheckCircle2 size={14} color="#0ea5e9" style={{ margin: '0 auto' }} /> : null}
        </div>

        {/* Step 5: Deploy */}
        <div style={{ background: pipelineStep >= 5 ? 'rgba(34, 197, 94, 0.2)' : 'rgba(255,255,255,0.03)', border: pipelineStep >= 5 ? '1px solid #22c55e' : '1px solid var(--docker-border)', padding: '0.85rem 0.5rem', borderRadius: '8px', textAlign: 'center' }}>
          <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>5. Deploy</div>
          <div style={{ fontWeight: 800, fontSize: '0.78rem', color: '#fff', margin: '0.2rem 0' }}>Push &amp; Deploy</div>
          {pipelineStep >= 5 && <CheckCircle2 size={14} color="#4ade80" style={{ margin: '0 auto' }} />}
        </div>
      </div>
    </div>
  );
};
