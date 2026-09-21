import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Footer } from '../layout/Footer';
import {
  Flame,
  Boxes,
  ArrowRight,
  Terminal,
  GitBranch,
  ShieldAlert,
  Zap,
  CheckCircle2,
  Sparkles,
  Server,
  Layers,
  Cpu,
  Code2,
  BookOpen,
  Container,
  Cloud,
  GitPullRequest,
  Activity,
  ShieldCheck,
  Clock,
  Bell,
  Check,
} from 'lucide-react';

interface UpcomingTool {
  id: string;
  name: string;
  domain: string;
  techStack: string;
  quarter: string;
  color: string;
  bgGlow: string;
  icon: React.ElementType;
  description: string;
  coreConcepts: string[];
}

const UPCOMING_TOOLS: UpcomingTool[] = [
  {
    id: 'helm',
    name: 'Helm & Kustomize',
    domain: 'Package Management & Templates',
    techStack: 'Helm v3 & Kustomize Engine',
    quarter: 'Q4 2026',
    color: '#0ea5e9',
    bgGlow: 'rgba(14, 165, 233, 0.15)',
    icon: Container,
    description: 'Master Cloud-Native package management. Template Kubernetes manifests with Helm charts, values overrides, and Kustomize overlays.',
    coreConcepts: ['Helm Chart Templates & Values', 'Kustomize Overlays & Patches', 'Chart Repository Distribution', 'Release Rollbacks & History', 'Subcharts & Dependencies'],
  },
  {
    id: 'ansible',
    name: 'Ansible',
    domain: 'Configuration Management & Playbooks',
    techStack: 'Ansible & OpenTofu',
    quarter: 'Q4 2026',
    color: '#ef4444',
    bgGlow: 'rgba(239, 68, 68, 0.15)',
    icon: Cpu,
    description: 'Automate infrastructure provisioning, server fleet drift prevention, SSH configuration playbooks, and enterprise role hierarchies.',
    coreConcepts: ['YAML Playbooks & Tasks', 'Inventory & Dynamic Groups', 'Idempotency & Handlers', 'Ansible Vault Secret Management', 'Molecule Automated Testing'],
  },
  {
    id: 'terraform',
    name: 'Terraform',
    domain: 'Infrastructure as Code (IaC)',
    techStack: 'Terraform & OpenTofu',
    quarter: 'Q1 2027',
    color: '#a855f7',
    bgGlow: 'rgba(168, 85, 247, 0.15)',
    icon: Cloud,
    description: 'Declare, provision, and audit multi-cloud infrastructure with Terraform and OpenTofu. Master state drift forensics and modular blueprints.',
    coreConcepts: ['Remote State & Lock Strategies', 'Multi-Cloud Architecture', 'State Drift Forensics', 'Reusable Enterprise Modules', 'Policy-as-Code (OPA/Sentinel)'],
  },
  {
    id: 'observability',
    name: 'Prometheus & Grafana',
    domain: 'Observability & SRE Forensics',
    techStack: 'Prometheus & Grafana',
    quarter: 'Q1 2027',
    color: '#10b981',
    bgGlow: 'rgba(16, 185, 129, 0.15)',
    icon: Activity,
    description: 'Instrument full-stack telemetry and triage 3 AM production outages with Prometheus, Grafana, OpenTelemetry tracing, and Loki logs.',
    coreConcepts: ['PromQL Metrics & Alert Rules', 'Distributed Tracing with OTel', 'Loki Log Aggregation', 'SLI/SLO Error Budget Burn', 'Production Pager Incident Triage'],
  },
  {
    id: 'security',
    name: 'HashiCorp Vault & Security',
    domain: 'DevSecOps & Zero-Trust Cloud',
    techStack: 'Vault & Trivy Security',
    quarter: 'Q2 2027',
    color: '#f43f5e',
    bgGlow: 'rgba(244, 63, 94, 0.15)',
    icon: ShieldCheck,
    description: 'Hardening modern cloud infrastructure. Orchestrate HashiCorp Vault secrets, automated container CVE scanning, and supply-chain attestations.',
    coreConcepts: ['Vault Dynamic Secret Leasing', 'Container CVE Scanning (Trivy)', 'Cloud IAM Least-Privilege', 'SBOMs & Cosign Signatures', 'Kubernetes Network Policies'],
  },
  {
    id: 'linux',
    name: 'Linux Kernel & Systems',
    domain: 'Kernel & Systems Engineering',
    techStack: 'Linux Kernel & eBPF',
    quarter: 'Q2 2027',
    color: '#06b6d4',
    bgGlow: 'rgba(6, 182, 212, 0.15)',
    icon: Terminal,
    description: 'The systems foundations behind the cloud. Dive deep into Linux namespaces, cgroups v2, eBPF kernel instrumentation, and TCP/IP sockets.',
    coreConcepts: ['Namespaces & cgroups v2', 'eBPF Kernel Probing', 'Systemd Unit Management', 'TCP/IP Socket Forensics', 'Memory Paging & Swap Tuning'],
  },
];

export const ForgeSuiteHomeView: React.FC = () => {
  const { setMode, setActiveLessonConcept } = useApp();
  const [notifiedTools, setNotifiedTools] = useState<Record<string, boolean>>({});

  const handleNotifyToggle = (toolId: string) => {
    setNotifiedTools((prev) => ({
      ...prev,
      [toolId]: !prev[toolId],
    }));
  };

  return (
    <div
      style={{
        flex: 1,
        minHeight: '100%',
        background: 'radial-gradient(ellipse at top, #0f172a 0%, #030712 100%)',
        color: '#f8fafc',
        padding: '2.5rem 1.5rem 4rem',
        overflowY: 'auto',
        boxSizing: 'border-box',
      }}
    >
      <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
        {/* Top Suite Hero */}
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.35rem 0.9rem',
              borderRadius: '999px',
              background: 'rgba(56, 189, 248, 0.08)',
              border: '1px solid rgba(56, 189, 248, 0.25)',
              color: '#38bdf8',
              fontSize: '0.78rem',
              fontWeight: 700,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              marginBottom: '1.25rem',
              backdropFilter: 'blur(8px)',
            }}
          >
            <Sparkles size={14} className="text-sky-400" />
            Forge Suite &bull; Interactive Engineering Academies
          </div>

          <h1
            style={{
              fontSize: 'clamp(2.2rem, 5vw, 3.4rem)',
              fontWeight: 900,
              letterSpacing: '-0.035em',
              lineHeight: 1.15,
              margin: '0 0 1rem',
              background: 'linear-gradient(135deg, #ffffff 30%, #94a3b8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Master the Modern Cloud Stack.
          </h1>

          <p
            style={{
              fontSize: '1.1rem',
              color: '#94a3b8',
              maxWidth: '680px',
              margin: '0 auto 2rem',
              lineHeight: 1.6,
            }}
          >
            High-fidelity, in-browser developer simulators. Real command engines, visual DAGs, live cluster topologies, and SRE incident triage. Zero slides. Zero fluff.
          </p>

          {/* Quick Suite Stats Bar */}
          <div
            style={{
              display: 'inline-flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1.75rem',
              padding: '0.85rem 1.75rem',
              borderRadius: '16px',
              background: 'rgba(15, 23, 42, 0.65)',
              border: '1px solid rgba(148, 163, 184, 0.15)',
              backdropFilter: 'blur(12px)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e' }} />
              <span style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>
                <strong style={{ color: '#fff' }}>48</strong> Live Curriculum Modules
              </span>
            </div>
            <div style={{ width: '1px', height: '18px', background: 'rgba(148, 163, 184, 0.2)' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Zap size={15} color="#eab308" />
              <span style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>
                <strong style={{ color: '#fff' }}>171+</strong> Interactive Concepts
              </span>
            </div>
            <div style={{ width: '1px', height: '18px', background: 'rgba(148, 163, 184, 0.2)' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Cpu size={15} color="#38bdf8" />
              <span style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>
                <strong style={{ color: '#fff' }}>3</strong> Live Execution Engines
              </span>
            </div>
            <div style={{ width: '1px', height: '18px', background: 'rgba(148, 163, 184, 0.2)' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Clock size={15} color="#a855f7" />
              <span style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>
                <strong style={{ color: '#fff' }}>6</strong> Academies Coming Soon
              </span>
            </div>
          </div>
        </div>

        {/* SECTION 1: TRIPLE LIVE FLAGSHIP PLATFORMS */}
        <div id="academies" style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e' }} />
          <span style={{ fontSize: '0.82rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#94a3b8' }}>
            Live Available Academies
          </span>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
            gap: '2rem',
            marginBottom: '4.5rem',
          }}
        >
          {/* CARD 1: COMMITFORGE */}
          <div
            style={{
              background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.6) 0%, rgba(15, 23, 42, 0.8) 100%)',
              border: '1px solid rgba(240, 80, 51, 0.25)',
              borderRadius: '24px',
              padding: '2.25rem',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
              boxShadow: '0 20px 40px -15px rgba(240, 80, 51, 0.08)',
              transition: 'all 0.2s ease',
            }}
          >
            {/* Corner Glow Accent */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: '180px',
                height: '180px',
                background: 'radial-gradient(circle, rgba(240, 80, 51, 0.15) 0%, transparent 70%)',
                pointerEvents: 'none',
              }}
            />

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #f05033 0%, #ea580c 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    boxShadow: '0 4px 14px rgba(240, 80, 51, 0.45)',
                  }}
                >
                  <Flame size={24} />
                </div>
                <div>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, color: '#fff', letterSpacing: '-0.02em' }}>
                    CommitForge
                  </h2>
                  <div style={{ fontSize: '0.78rem', color: '#fb923c', fontWeight: 600, letterSpacing: '0.02em' }}>
                    Git &amp; Version Control Academy
                  </div>
                </div>
              </div>

              {/* Status Badge */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.25rem 0.65rem',
                  borderRadius: '999px',
                  background: 'rgba(34, 197, 94, 0.12)',
                  border: '1px solid rgba(34, 197, 94, 0.3)',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  color: '#4ade80',
                }}
              >
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e' }} />
                Active In-App
              </div>
            </div>

            <p style={{ fontSize: '0.95rem', color: '#94a3b8', lineHeight: 1.6, margin: '0 0 1.5rem', minHeight: '46px' }}>
              Deconstruct Git from the inside out. Master DAG graphs, object internals, three-way merge resolution, rebase forensics, and complete GitHub Actions CI/CD pipelines.
            </p>

            {/* Feature Checklist */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.84rem', color: '#cbd5e1' }}>
                <GitBranch size={16} color="#f05033" />
                <span><strong>18 Topics</strong> &bull; 75 Concepts</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.84rem', color: '#cbd5e1' }}>
                <Terminal size={16} color="#f05033" />
                <span>Real In-Browser Git Engine</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.84rem', color: '#cbd5e1' }}>
                <ShieldAlert size={16} color="#f05033" />
                <span>Disaster Recovery Labs</span>
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.84rem',
                  color: '#f3e8ff',
                  background: 'rgba(139, 92, 246, 0.14)',
                  border: '1px solid rgba(139, 92, 246, 0.38)',
                  borderRadius: '8px',
                  padding: '0.2rem 0.55rem',
                }}
              >
                <Zap size={15} color="#a855f7" />
                <span style={{ fontWeight: 600 }}>GitHub Actions CI/CD</span>
                <span
                  style={{
                    fontSize: '0.6rem',
                    fontWeight: 800,
                    padding: '0.1rem 0.35rem',
                    borderRadius: '4px',
                    background: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
                    color: '#fff',
                    marginLeft: 'auto',
                    letterSpacing: '0.04em',
                  }}
                >
                  TRACK
                </span>
              </div>
            </div>

            {/* Actions */}
            <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <button
                onClick={() => {
                  setActiveLessonConcept(null);
                  setMode('learn');
                }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.65rem',
                  padding: '0.9rem 1.5rem',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #f05033 0%, #ea580c 100%)',
                  color: '#fff',
                  border: 'none',
                  fontSize: '0.95rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  boxShadow: '0 4px 16px rgba(240, 80, 51, 0.4)',
                  transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(240, 80, 51, 0.55)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(240, 80, 51, 0.4)';
                }}
              >
                <span>Enter Git Academy</span>
                <ArrowRight size={18} />
              </button>

              {/* Sub Route Pills */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.45rem' }}>
                <button
                  onClick={() => setMode('practice')}
                  style={{
                    padding: '0.5rem 0.4rem',
                    borderRadius: '8px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: '#cbd5e1',
                    fontSize: '0.76rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.3rem',
                  }}
                >
                  <BookOpen size={13} />
                  Practice
                </button>
                <button
                  onClick={() => setMode('labs')}
                  style={{
                    padding: '0.5rem 0.4rem',
                    borderRadius: '8px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: '#cbd5e1',
                    fontSize: '0.76rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.3rem',
                  }}
                >
                  <ShieldAlert size={13} />
                  Labs
                </button>
                <button
                  onClick={() => setMode('ide')}
                  style={{
                    padding: '0.5rem 0.4rem',
                    borderRadius: '8px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: '#cbd5e1',
                    fontSize: '0.76rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.3rem',
                  }}
                >
                  <Terminal size={13} />
                  IDE
                </button>
                <button
                  onClick={() => {
                    setActiveLessonConcept('c-actions-workflow');
                    setMode('learn');
                  }}
                  title="Jump to GitHub Actions & CI/CD Pipeline Section"
                  style={{
                    padding: '0.5rem 0.4rem',
                    borderRadius: '8px',
                    background: 'rgba(139, 92, 246, 0.18)',
                    border: '1px solid rgba(139, 92, 246, 0.4)',
                    color: '#e9d5ff',
                    fontSize: '0.76rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.3rem',
                    boxShadow: '0 0 10px rgba(139, 92, 246, 0.2)',
                  }}
                >
                  <Zap size={13} color="#a855f7" />
                  CI/CD
                </button>
              </div>
            </div>
          </div>

          {/* CARD 2: PODFORGE */}
          <div
            style={{
              background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.6) 0%, rgba(15, 23, 42, 0.8) 100%)',
              border: '1px solid rgba(56, 189, 248, 0.25)',
              borderRadius: '24px',
              padding: '2.25rem',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
              boxShadow: '0 20px 40px -15px rgba(56, 189, 248, 0.08)',
              transition: 'all 0.2s ease',
            }}
          >
            {/* Corner Glow Accent */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: '180px',
                height: '180px',
                background: 'radial-gradient(circle, rgba(56, 189, 248, 0.15) 0%, transparent 70%)',
                pointerEvents: 'none',
              }}
            />

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    boxShadow: '0 4px 14px rgba(56, 189, 248, 0.45)',
                  }}
                >
                  <Boxes size={24} />
                </div>
                <div>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, color: '#fff', letterSpacing: '-0.02em' }}>
                    PodForge
                  </h2>
                  <div style={{ fontSize: '0.78rem', color: '#38bdf8', fontWeight: 600, letterSpacing: '0.02em' }}>
                    Kubernetes &amp; Cloud-Native Academy
                  </div>
                </div>
              </div>

              {/* Status Badge */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.25rem 0.65rem',
                  borderRadius: '999px',
                  background: 'rgba(56, 189, 248, 0.12)',
                  border: '1px solid rgba(56, 189, 248, 0.3)',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  color: '#38bdf8',
                }}
              >
                <div
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: '#38bdf8',
                  }}
                />
                Active In-App
              </div>
            </div>

            <p style={{ fontSize: '0.95rem', color: '#94a3b8', lineHeight: 1.6, margin: '0 0 1.5rem', minHeight: '46px' }}>
              Deploy, break, and orchestrate containers. Live multi-node topology mesh, self-healing deployment controller, virtual kubectl engine, and SRE triage clinics.
            </p>

            {/* Feature Checklist */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.84rem', color: '#cbd5e1' }}>
                <Layers size={16} color="#38bdf8" />
                <span><strong>16 Modules</strong> &bull; 56 Concepts</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.84rem', color: '#cbd5e1' }}>
                <Terminal size={16} color="#38bdf8" />
                <span>Virtual Kubectl Control Plane</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.84rem', color: '#cbd5e1' }}>
                <ShieldAlert size={16} color="#38bdf8" />
                <span>CrashLoop &amp; OOMKilled Triage</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.84rem', color: '#cbd5e1' }}>
                <Server size={16} color="#38bdf8" />
                <span>Cluster IDE &amp; Topology Mesh</span>
              </div>
            </div>

            {/* Actions */}
            <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <button
                onClick={() => setMode('podforge')}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.65rem',
                  padding: '0.9rem 1.5rem',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)',
                  color: '#fff',
                  border: 'none',
                  fontSize: '0.95rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  boxShadow: '0 4px 16px rgba(56, 189, 248, 0.4)',
                  transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(56, 189, 248, 0.55)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(56, 189, 248, 0.4)';
                }}
              >
                <span>Enter Kubernetes Academy</span>
                <ArrowRight size={18} />
              </button>

              {/* Sub Route Pills */}
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <button
                  onClick={() => setMode('podforge')}
                  style={{
                    flex: 1,
                    padding: '0.5rem 0.65rem',
                    borderRadius: '8px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: '#cbd5e1',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.35rem',
                  }}
                >
                  <Layers size={13} />
                  Pod Academy
                </button>
                <button
                  onClick={() => setMode('podforge')}
                  style={{
                    flex: 1,
                    padding: '0.5rem 0.65rem',
                    borderRadius: '8px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: '#cbd5e1',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.35rem',
                  }}
                >
                  <ShieldAlert size={13} />
                  Triage Labs
                </button>
                <button
                  onClick={() => setMode('podforge')}
                  style={{
                    flex: 1,
                    padding: '0.5rem 0.65rem',
                    borderRadius: '8px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: '#cbd5e1',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.35rem',
                  }}
                >
                  <Server size={13} />
                  Cluster IDE
                </button>
              </div>
            </div>
          </div>

          {/* CARD 3: DOCKFORGE */}
          <div
            style={{
              background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.6) 0%, rgba(15, 23, 42, 0.8) 100%)',
              border: '1px solid rgba(14, 165, 233, 0.3)',
              borderRadius: '24px',
              padding: '2.25rem',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
              boxShadow: '0 20px 40px -15px rgba(14, 165, 233, 0.12)',
              transition: 'all 0.2s ease',
            }}
          >
            {/* Corner Glow Accent */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: '180px',
                height: '180px',
                background: 'radial-gradient(circle, rgba(14, 165, 233, 0.2) 0%, transparent 70%)',
                pointerEvents: 'none',
              }}
            />

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    boxShadow: '0 4px 14px rgba(14, 165, 233, 0.45)',
                  }}
                >
                  <Container size={24} />
                </div>
                <div>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, color: '#fff', letterSpacing: '-0.02em' }}>
                    DockForge
                  </h2>
                  <div style={{ fontSize: '0.78rem', color: '#38bdf8', fontWeight: 600, letterSpacing: '0.02em' }}>
                    Docker &amp; Container Engine Academy
                  </div>
                </div>
              </div>

              {/* Status Badge */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.25rem 0.65rem',
                  borderRadius: '999px',
                  background: 'rgba(34, 197, 94, 0.12)',
                  border: '1px solid rgba(34, 197, 94, 0.3)',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  color: '#4ade80',
                }}
              >
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e' }} />
                Active In-App
              </div>
            </div>

            <p style={{ fontSize: '0.95rem', color: '#94a3b8', lineHeight: 1.6, margin: '0 0 1.5rem', minHeight: '46px' }}>
              Master containerization from the ground up. 14 topics covering Linux namespaces, cgroups, OverlayFS, volume mounts, multi-stage builds, and Docker Compose orchestration.
            </p>

            {/* Feature Checklist */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.84rem', color: '#cbd5e1' }}>
                <Layers size={16} color="#0ea5e9" />
                <span><strong>14 Topics</strong> &bull; Roadmap Syllabus</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.84rem', color: '#cbd5e1' }}>
                <Terminal size={16} color="#0ea5e9" />
                <span>Virtual Docker Engine CLI</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.84rem', color: '#cbd5e1' }}>
                <ShieldAlert size={16} color="#0ea5e9" />
                <span>SRE Incident Triage Labs</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.84rem', color: '#cbd5e1' }}>
                <Code2 size={16} color="#0ea5e9" />
                <span>Dockerfile &amp; Compose IDE</span>
              </div>
            </div>

            {/* Actions */}
            <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <button
                onClick={() => setMode('dockforge')}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.65rem',
                  padding: '0.9rem 1.5rem',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
                  color: '#fff',
                  border: 'none',
                  fontSize: '0.95rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  boxShadow: '0 4px 16px rgba(14, 165, 233, 0.4)',
                  transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                }}
              >
                <span>Enter Docker Academy</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* SECTION 2: THE DEVOPS & CLOUD COMPUTING ECOSYSTEM ROADMAP (COMING SOON) */}
        <div id="devops-stack" data-section="roadmap-section" style={{ marginBottom: '4rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                <Clock size={16} color="#a855f7" />
                <span style={{ fontSize: '0.82rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#c084fc' }}>
                  Ecosystem Roadmap &bull; Coming Soon
                </span>
              </div>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 900, letterSpacing: '-0.025em', margin: 0, color: '#fff' }}>
                Cloud Computing &amp; DevOps Academies
              </h2>
              <p style={{ fontSize: '0.92rem', color: '#94a3b8', margin: '0.35rem 0 0', maxWidth: '640px' }}>
                Expanding our hands-on simulator standard across every pillar of cloud engineering and infrastructure automation.
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <button
                onClick={() => setMode('roadmap')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.55rem 1.15rem',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, rgba(234, 179, 8, 0.2) 0%, rgba(168, 85, 247, 0.2) 100%)',
                  border: '1px solid rgba(234, 179, 8, 0.45)',
                  color: '#fef08a',
                  fontSize: '0.84rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  boxShadow: '0 4px 16px rgba(234, 179, 8, 0.15)',
                  transition: 'all 0.15s ease',
                }}
              >
                <Sparkles size={15} color="#facc15" />
                <span>Open Full Interactive Roadmap &rarr;</span>
              </button>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 0.85rem',
                  borderRadius: '8px',
                  background: 'rgba(168, 85, 247, 0.1)',
                  border: '1px solid rgba(168, 85, 247, 0.25)',
                  fontSize: '0.78rem',
                  color: '#e9d5ff',
                  fontWeight: 600,
                }}
              >
                <Sparkles size={14} color="#c084fc" />
                <span>Vote for upcoming engines</span>
              </div>
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {UPCOMING_TOOLS.map((tool) => {
              const Icon = tool.icon;
              const isNotified = notifiedTools[tool.id];

              return (
                <div
                  key={tool.id}
                  style={{
                    background: 'linear-gradient(145deg, rgba(20, 27, 45, 0.6) 0%, rgba(10, 15, 26, 0.8) 100%)',
                    border: `1px solid rgba(148, 163, 184, 0.15)`,
                    borderRadius: '20px',
                    padding: '1.75rem',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = tool.color;
                    e.currentTarget.style.boxShadow = `0 12px 30px -10px ${tool.bgGlow}`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(148, 163, 184, 0.15)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  {/* Subtle Background Glow */}
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      width: '130px',
                      height: '130px',
                      background: `radial-gradient(circle, ${tool.bgGlow} 0%, transparent 70%)`,
                      pointerEvents: 'none',
                    }}
                  />

                  {/* Header Row */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <div
                        style={{
                          width: '38px',
                          height: '38px',
                          borderRadius: '10px',
                          background: `linear-gradient(135deg, ${tool.color} 0%, rgba(15, 23, 42, 0.9) 100%)`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#fff',
                          boxShadow: `0 4px 12px ${tool.bgGlow}`,
                        }}
                      >
                        <Icon size={20} />
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>
                            {tool.name}
                          </span>
                          <span
                            style={{
                              fontSize: '0.64rem',
                              fontWeight: 700,
                              color: tool.color,
                              background: 'rgba(255, 255, 255, 0.05)',
                              border: `1px solid ${tool.color}40`,
                              borderRadius: '4px',
                              padding: '0.12rem 0.45rem',
                              letterSpacing: '0.01em',
                            }}
                          >
                            {tool.techStack}
                          </span>
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600, marginTop: '0.15rem' }}>
                          {tool.domain}
                        </div>
                      </div>
                    </div>

                    {/* Coming Soon Pill */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        padding: '0.25rem 0.6rem',
                        borderRadius: '999px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.12)',
                        fontSize: '0.68rem',
                        fontWeight: 700,
                        color: '#cbd5e1',
                        letterSpacing: '0.04em',
                      }}
                    >
                      <Clock size={11} color={tool.color} />
                      <span>{tool.quarter}</span>
                    </div>
                  </div>

                  {/* Description */}
                  <p style={{ fontSize: '0.86rem', color: '#94a3b8', lineHeight: 1.55, margin: '0 0 1.25rem', minHeight: '40px' }}>
                    {tool.description}
                  </p>

                  {/* Concept Pills */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.5rem' }}>
                    {tool.coreConcepts.map((concept, idx) => (
                      <span
                        key={idx}
                        style={{
                          fontSize: '0.72rem',
                          padding: '0.2rem 0.5rem',
                          borderRadius: '6px',
                          background: 'rgba(255, 255, 255, 0.04)',
                          border: '1px solid rgba(255, 255, 255, 0.08)',
                          color: '#cbd5e1',
                        }}
                      >
                        {concept}
                      </span>
                    ))}
                  </div>

                  {/* Bottom Notification / Priority Action */}
                  <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '1rem', borderTop: '1px solid rgba(148, 163, 184, 0.1)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.74rem', color: '#64748b' }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#a855f7' }} />
                      <span>In Active Curriculum Design</span>
                    </div>

                    <button
                      onClick={() => handleNotifyToggle(tool.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        padding: '0.35rem 0.75rem',
                        borderRadius: '8px',
                        background: isNotified ? 'rgba(34, 197, 94, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                        border: isNotified ? '1px solid rgba(34, 197, 94, 0.35)' : '1px solid rgba(255, 255, 255, 0.1)',
                        color: isNotified ? '#4ade80' : '#cbd5e1',
                        fontSize: '0.74rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                      title="Vote for priority release of this academy"
                    >
                      {isNotified ? (
                        <>
                          <Check size={13} />
                          <span>Priority Voted!</span>
                        </>
                      ) : (
                        <>
                          <Bell size={13} />
                          <span>Vote Priority</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* SECTION 3: PHILOSOPHY & ARCHITECTURE SYNERGY BANNER */}
        <div
          id="why-suite"
          style={{
            background: 'rgba(15, 23, 42, 0.5)',
            border: '1px solid rgba(148, 163, 184, 0.15)',
            borderRadius: '20px',
            padding: '2rem 2.5rem',
            backdropFilter: 'blur(10px)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1rem' }}>
            <Zap size={20} color="#eab308" />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, color: '#fff' }}>
              The Forge Pedagogical Standard
            </h3>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1.5rem',
              marginTop: '1.25rem',
            }}
          >
            <div>
              <div style={{ fontWeight: 700, color: '#e2e8f0', fontSize: '0.92rem', marginBottom: '0.35rem' }}>
                1. Sandboxed In-Browser Runtimes
              </div>
              <p style={{ fontSize: '0.84rem', color: '#94a3b8', lineHeight: 1.5, margin: 0 }}>
                Every command executes against real data structures — DAGs, trees, and controller loops — without requiring local container daemons or cloud accounts.
              </p>
            </div>

            <div>
              <div style={{ fontWeight: 700, color: '#e2e8f0', fontSize: '0.92rem', marginBottom: '0.35rem' }}>
                2. Disaster-Recovery First
              </div>
              <p style={{ fontSize: '0.84rem', color: '#94a3b8', lineHeight: 1.5, margin: 0 }}>
                Anyone can follow happy paths. We intentionally drop you into corrupted indexes, detached heads, CrashLoopBackOffs, and OOMKilled pods so you learn how to fix real outages.
              </p>
            </div>

            <div>
              <div style={{ fontWeight: 700, color: '#e2e8f0', fontSize: '0.92rem', marginBottom: '0.35rem' }}>
                3. Unified Visual Mental Models
              </div>
              <p style={{ fontSize: '0.84rem', color: '#94a3b8', lineHeight: 1.5, margin: 0 }}>
                Every action immediately mirrors into real-time visual stages — DAG commit graphs, working tree stages, node cluster topologies, and pod network routes.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};
