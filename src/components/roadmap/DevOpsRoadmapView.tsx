import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  GitBranch,
  Zap,
  Container,
  Boxes,
  Cpu,
  Cloud,
  Activity,
  ShieldCheck,
  Terminal,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  ChevronRight,
  Compass,
  Award,
  BookOpen,
  Briefcase,
  Layers,
  Flame,
  Filter,
  ExternalLink,
} from 'lucide-react';

export type RoadmapTrack = 'all' | 'developer' | 'cloud-native' | 'sre';

export interface RoadmapStage {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  category: 'developer' | 'cloud-native' | 'sre';
  status: 'live' | 'coming-soon';
  liveAction?: 'learn' | 'podforge' | 'cicd' | 'dockforge';
  platformName: string;
  techStack: string;
  duration: string;
  color: string;
  glowColor: string;
  icon: React.ComponentType<{ size?: number; color?: string }>;
  certifications: string[];
  description: string;
  keyMilestones: string[];
  careerRelevance: string;
}

const ROADMAP_STAGES: RoadmapStage[] = [
  {
    id: 'stage-git',
    number: 1,
    title: 'Version Control & Branching Forensics',
    subtitle: 'Master Git internal DAGs, merge conflict resolution, and disaster recovery',
    category: 'developer',
    status: 'live',
    liveAction: 'learn',
    platformName: 'CommitForge',
    techStack: 'Git 2.45+ • DAG Graph • Virtual Objects Engine',
    duration: '18 Topics • 75 Concepts',
    color: '#f05033',
    glowColor: 'rgba(240, 80, 51, 0.25)',
    icon: GitBranch,
    certifications: ['GitHub Foundations', 'Professional Git Practitioner'],
    description:
      'The bedrock of all software engineering and infrastructure management. Deconstruct Git from the inside out: SHA-1/256 hashing, index staging mechanics, three-way merge resolution, interactive rebasing forensics, and reflog disaster recovery.',
    keyMilestones: [
      'Git Plumbing vs Porcelain: Blob, Tree, Commit & Tag Objects',
      'Branching Strategies: Trunk-Based Development vs GitFlow',
      'Advanced 3-Way Merge Resolution & Conflict Forensics',
      'Interactive Rebase Forensics: Squashing, Rewording, Dropping Commits',
      'Disaster Recovery Labs: git reflog, detached HEAD, and cherry-pick forensics',
    ],
    careerRelevance: 'Mandatory foundation for 100% of modern software and infrastructure engineering roles.',
  },
  {
    id: 'stage-cicd',
    number: 2,
    title: 'CI/CD Pipelines & Automation Engineering',
    subtitle: 'Automate build, test, multi-platform matrix compilation, and secure cloud deployment',
    category: 'developer',
    status: 'live',
    liveAction: 'cicd',
    platformName: 'GitHub Actions & CI/CD Suite',
    techStack: 'GitHub Actions • YAML • OIDC • Container Registries',
    duration: '8 Deep Concepts • Active In-App',
    color: '#8b5cf6',
    glowColor: 'rgba(139, 92, 246, 0.3)',
    icon: Zap,
    certifications: ['GitHub Actions Certification', 'DevOps Foundation'],
    description:
      'Turn code into production-ready software without human intervention. Master GitHub Actions triggers, matrix builds across operating systems, dependency caching optimizations, cloud IAM with passwordless OIDC, and automated GHCR registry deployments.',
    keyMilestones: [
      'Workflow YAML Syntax, Triggers (push, pull_request, schedule, workflow_dispatch)',
      'Multi-OS & Multi-Runtime Matrix Builds (Linux, macOS, Windows)',
      'Dependency Caching Strategies (actions/cache with lockfile hash keys)',
      'Zero-Trust Cloud Deployments via OIDC Tokens (AWS, GCP, Azure)',
      'Reusable Enterprise Workflows (workflow_call & Composite Actions)',
    ],
    careerRelevance: 'Core competence for DevOps Engineers, CI/CD Engineers, and Release Managers.',
  },
  {
    id: 'stage-docker',
    number: 3,
    title: 'Containerization & Build Engineering',
    subtitle: 'Package immutable runtime artifacts with multi-stage builds and minimal images',
    category: 'developer',
    status: 'live',
    liveAction: 'dockforge',
    platformName: 'DockForge',
    techStack: 'Virtual Docker Engine • 14 Topics • Multi-Stage IDE',
    duration: '14 Topics • 44 Concepts • Active In-App',
    color: '#0ea5e9',
    glowColor: 'rgba(14, 165, 233, 0.3)',
    icon: Container,
    certifications: ['Docker Certified Associate (DCA)', 'OCI Specialist'],
    description:
      'Package applications into portable, reproducible, isolated containers. Optimize Dockerfile layer caching with BuildKit, build ultra-secure distroless images, configure bridge networks, and orchestrate multi-tier services with Docker Compose.',
    keyMilestones: [
      'Linux Kernel Isolation: Namespaces, cgroups, and OverlayFS Union Filesystems',
      'Multi-Stage Dockerfiles: Separating Build Tools from Production Artifacts',
      'BuildKit Layer Caching & Secret Mounting without Leaking Tokens',
      'Distroless & Minimal Alpine Runtime Packaging for Minimal Attack Surface',
      'Multi-Container Topologies with Docker Compose and Bridge Networking',
    ],
    careerRelevance: 'Universal requirement across modern cloud, backend, and platform roles.',
  },
  {
    id: 'stage-k8s',
    number: 4,
    title: 'Container Orchestration & Cloud-Native Systems',
    subtitle: 'Deploy, scale, auto-heal, and network microservices across multi-node clusters',
    category: 'cloud-native',
    status: 'live',
    liveAction: 'podforge',
    platformName: 'PodForge',
    techStack: 'Kubernetes 1.30+ • Virtual Kubectl Engine • Live Cluster IDE',
    duration: '16 Modules • 56 Concepts',
    color: '#326ce5',
    glowColor: 'rgba(50, 108, 229, 0.3)',
    icon: Boxes,
    certifications: ['CKA (Certified Kubernetes Administrator)', 'CKAD (Application Developer)', 'CKS (Security Specialist)'],
    description:
      'The modern cloud operating system. Master the Kubernetes control plane, worker node architecture, self-healing deployments, zero-downtime rolling upgrades, persistent storage claims, Ingress routing, RBAC governance, and live CrashLoopBackOff SRE triage.',
    keyMilestones: [
      'Control Plane Anatomy: API Server, etcd, Scheduler & Controller Manager',
      'Workload Controllers: ReplicaSets, Deployments, DaemonSets & StatefulSets',
      'Service Networking: ClusterIP, NodePort, LoadBalancer & Ingress / Gateway API',
      'Persistent Storage: PVs, PVCs, StorageClasses and CSI Drivers',
      'SRE Breakdown Clinics: CrashLoopBackOff, OOMKilled, Evicted & ImagePullBackOff Triage',
    ],
    careerRelevance: 'Highest-demand skill for Senior Cloud Engineers, Platform Engineers, and DevOps Leads.',
  },
  {
    id: 'stage-ansible',
    number: 5,
    title: 'Configuration Management & Fleet Automation',
    subtitle: 'Enforce desired server state, drift prevention, and enterprise playbook execution',
    category: 'sre',
    status: 'coming-soon',
    platformName: 'Ansible',
    techStack: 'Ansible • YAML Playbooks • Jinja2 • SSH',
    duration: 'Target Q4 2026',
    color: '#ef4444',
    glowColor: 'rgba(239, 68, 68, 0.25)',
    icon: Cpu,
    certifications: ['Red Hat Certified Specialist in Ansible Automation (EX407)'],
    description:
      'Automate server fleet configuration, patch management, security baselines, and application runtime provisioning at enterprise scale without agent overhead using SSH and idempotent YAML playbooks.',
    keyMilestones: [
      'Agentless Architecture & Dynamic Inventory Management',
      'Idempotent YAML Playbooks, Handlers, and Task Execution',
      'Enterprise Roles & Galaxy Modular Blueprint Distribution',
      'Ansible Vault: Encrypting Passwords, SSH Keys, and API Secrets',
      'Molecule Testing Framework for Automated Playbook Verification',
    ],
    careerRelevance: 'Essential for Systems Engineers, Enterprise Infrastructure Admins, and Cloud Operations.',
  },
  {
    id: 'stage-terraform',
    number: 6,
    title: 'Infrastructure as Code (IaC) & Cloud Architecture',
    subtitle: 'Declare, provision, version, and audit multi-cloud infrastructure deterministically',
    category: 'cloud-native',
    status: 'coming-soon',
    platformName: 'Terraform & OpenTofu',
    techStack: 'Terraform • OpenTofu • HCL • Cloud Providers',
    duration: 'Target Q1 2027',
    color: '#a855f7',
    glowColor: 'rgba(168, 85, 247, 0.25)',
    icon: Cloud,
    certifications: ['HashiCorp Certified: Terraform Associate'],
    description:
      'Codify cloud infrastructure declaratively across AWS, Azure, and GCP. Master remote state storage with distributed locking, state drift detection, modular architecture, and policy-as-code enforcement with Open Policy Agent (OPA).',
    keyMilestones: [
      'Declarative HCL Blueprints: Providers, Resources, Data Sources & Outputs',
      'Remote State Management (S3/GCS) & Distributed Locking (DynamoDB)',
      'State Drift Forensics & Importing Pre-Existing Cloud Resources',
      'Reusable Enterprise Modules & Environment Tiering (Dev, Staging, Prod)',
      'Policy-as-Code Governance with OPA (Open Policy Agent) & Sentinel',
    ],
    careerRelevance: 'Cornerstone discipline for Cloud Architects, DevOps Engineers, and Platform Teams.',
  },
  {
    id: 'stage-observability',
    number: 7,
    title: 'Observability, Distributed Tracing & SRE Forensics',
    subtitle: 'Instrument metrics, logs, traces, and automated alerts to triage production outages',
    category: 'sre',
    status: 'coming-soon',
    platformName: 'Prometheus & Grafana',
    techStack: 'Prometheus • Grafana • OpenTelemetry • Loki',
    duration: 'Target Q1 2027',
    color: '#10b981',
    glowColor: 'rgba(16, 185, 129, 0.25)',
    icon: Activity,
    certifications: ['Prometheus Certified Associate (PCA)', 'Grafana Certified SRE'],
    description:
      'Transform black-box systems into observable architectures. Instrument services with Prometheus metrics, PromQL queries, OpenTelemetry distributed tracing, Loki log streams, and SLI/SLO error budget burn alert policies.',
    keyMilestones: [
      'The Three Pillars: Metrics, Logs, and Distributed Traces (M.E.L.T.)',
      'PromQL Mastery: Rate, Histogram Quantiles, Vector Matching & Alerts',
      'Grafana Dashboard Engineering: Executive vs SRE Operational Views',
      'OpenTelemetry (OTel) Instrumentation across Microservices',
      'Service Level Objectives (SLOs), Error Budgets & Pager Incident Triage',
    ],
    careerRelevance: 'Highest priority for Site Reliability Engineers (SREs), On-Call Engineers, and Operations.',
  },
  {
    id: 'stage-security',
    number: 8,
    title: 'DevSecOps, Secrets Management & Zero-Trust Cloud',
    subtitle: 'Embed automated security scanning, lease ephemeral secrets, and enforce least privilege',
    category: 'sre',
    status: 'coming-soon',
    platformName: 'HashiCorp Vault & Security',
    techStack: 'HashiCorp Vault • Trivy • Cosign • SBOMs',
    duration: 'Target Q2 2027',
    color: '#f43f5e',
    glowColor: 'rgba(244, 63, 94, 0.25)',
    icon: ShieldCheck,
    certifications: ['HashiCorp Certified: Vault Associate', 'Certified DevSecOps Professional (CDP)'],
    description:
      'Shift security left into code and runtime. Lease ephemeral dynamic secrets with HashiCorp Vault, scan container images for CVE vulnerabilities with Trivy, sign software supply-chain artifacts with Cosign, and audit IAM least privilege.',
    keyMilestones: [
      'HashiCorp Vault Dynamic Secret Leases, Auto-Rotation & Secret Engines',
      'Static & Dynamic Code Security: SAST, DAST, and Dependency Scanning',
      'Container Image CVE Vulnerability Auditing with Trivy in CI Pipelines',
      'Software Supply Chain Security: Software Bill of Materials (SBOM) & Cosign Signatures',
      'Zero-Trust Network Policies & Microsegmentation in Kubernetes',
    ],
    careerRelevance: 'Crucial for DevSecOps Specialists, Security Architects, and Enterprise Compliance.',
  },
  {
    id: 'stage-linux',
    number: 9,
    title: 'Linux Kernel & Systems Engineering',
    subtitle: 'Master low-level kernel primitives, memory management, eBPF, and networking stacks',
    category: 'developer',
    status: 'coming-soon',
    platformName: 'Linux Kernel & Systems',
    techStack: 'Linux Kernel 6+ • eBPF • systemd • cgroups v2',
    duration: 'Target Q2 2027',
    color: '#06b6d4',
    glowColor: 'rgba(6, 182, 212, 0.25)',
    icon: Terminal,
    certifications: ['Red Hat Certified System Administrator (RHCSA)', 'Linux Foundation LFCS'],
    description:
      'The foundational layer that powers every cloud provider and container engine. Dive beneath user space into Linux namespaces, cgroups v2 memory limits, eBPF kernel instrumentation, systemd service lifecycle, and TCP socket performance tuning.',
    keyMilestones: [
      'Kernel Primitives: Namespaces (PID, Mount, Net, IPC) & cgroups v2 Resource Accounting',
      'eBPF (Extended Berkeley Packet Filter): Kernel Tracing, Security & Observability',
      'systemd Service Management, Journald Logging & Process Supervision',
      'TCP/IP Network Stack Forensics, Socket Buffers & SYN Flood Hardening',
      'Memory Paging, Virtual Memory Subsystems, and Linux OOM-Killer Forensics',
    ],
    careerRelevance: 'Core differentiator for Elite Systems Engineers, Kernel Developers, and Senior Cloud Architects.',
  },
];

export const DevOpsRoadmapView: React.FC = () => {
  const { setMode, setActiveLessonConcept } = useApp();
  const [activeCategory, setActiveCategory] = useState<RoadmapTrack>('all');
  const [votedStages, setVotedStages] = useState<Record<string, boolean>>({});

  const filteredStages = ROADMAP_STAGES.filter((stage) => {
    if (activeCategory === 'all') return true;
    return stage.category === activeCategory;
  });

  const handleStageAction = (stage: RoadmapStage) => {
    if (stage.status === 'live') {
      if (stage.liveAction === 'learn') {
        setActiveLessonConcept(null);
        setMode('learn');
      } else if (stage.liveAction === 'cicd') {
        setActiveLessonConcept('c-actions-workflow');
        setMode('learn');
      } else if (stage.liveAction === 'podforge') {
        setMode('podforge');
      } else if (stage.liveAction === 'dockforge') {
        setMode('dockforge');
      }
    } else {
      setVotedStages((prev) => ({
        ...prev,
        [stage.id]: !prev[stage.id],
      }));
    }
  };

  return (
    <div
      style={{
        flex: '1 1 0%',
        minHeight: 0,
        height: '100%',
        maxHeight: '100%',
        overflowY: 'auto',
        overflowX: 'hidden',
        background: 'radial-gradient(ellipse at 50% 0%, rgba(30, 41, 69, 0.35) 0%, var(--bg-app) 70%)',
        padding: '2rem 1.5rem 6rem 1.5rem',
        boxSizing: 'border-box',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {/* ================================================================ */}
        {/* INTERACTIVE BREADCRUMB NAVIGATION                                */}
        {/* ================================================================ */}
        <nav
          aria-label="Breadcrumb"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            flexWrap: 'wrap',
            padding: '0.4rem 0.75rem',
            borderRadius: '10px',
            background: 'rgba(15, 23, 42, 0.65)',
            border: '1px solid rgba(148, 163, 184, 0.12)',
            width: 'fit-content',
          }}
        >
          <button
            type="button"
            onClick={() => setMode('home')}
            title="Navigate to Forge Suite Home"
            style={{
              background: 'transparent',
              border: 'none',
              padding: '0.2rem 0.4rem',
              borderRadius: '6px',
              color: '#94a3b8',
              fontSize: '0.78rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#fff';
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#94a3b8';
              e.currentTarget.style.background = 'transparent';
            }}
          >
            <Flame size={13} color="#f05033" />
            <span>Forge Suite</span>
          </button>

          <ChevronRight size={12} color="#475569" />

          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.2rem 0.5rem',
              borderRadius: '6px',
              background: 'rgba(234, 179, 8, 0.15)',
              border: '1px solid rgba(234, 179, 8, 0.35)',
              color: '#facc15',
              fontSize: '0.78rem',
              fontWeight: 700,
            }}
          >
            <Compass size={13} color="#facc15" />
            <span>DevOps Roadmap</span>
          </span>
        </nav>

        {/* ================================================================ */}
        {/* ROADMAP HERO BANNER                                              */}
        {/* ================================================================ */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            gap: '1.25rem',
            padding: '2.5rem 1.5rem 1.5rem',
            background: 'linear-gradient(180deg, rgba(30, 41, 59, 0.4) 0%, rgba(15, 23, 42, 0.2) 100%)',
            border: '1px solid rgba(148, 163, 184, 0.12)',
            borderRadius: '24px',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.5)',
          }}
        >
          {/* Ambient Glow */}
          <div
            style={{
              position: 'absolute',
              top: '-80px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '450px',
              height: '250px',
              background: 'radial-gradient(ellipse, rgba(234, 179, 8, 0.15) 0%, rgba(56, 189, 248, 0.1) 50%, transparent 80%)',
              pointerEvents: 'none',
            }}
          />

          {/* Pill Badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.3rem 0.85rem',
              borderRadius: '999px',
              background: 'rgba(234, 179, 8, 0.12)',
              border: '1px solid rgba(234, 179, 8, 0.3)',
              fontSize: '0.74rem',
              fontWeight: 800,
              color: '#facc15',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
            }}
          >
            <Compass size={14} color="#facc15" />
            <span>Interactive DevOps &amp; Cloud-Native Architecture Roadmap</span>
          </div>

          <h1
            style={{
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: 900,
              letterSpacing: '-0.03em',
              margin: 0,
              color: '#ffffff',
              lineHeight: 1.15,
            }}
          >
            The Complete Roadmap to{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #f05033 0%, #38bdf8 50%, #a855f7 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Modern DevOps &amp; Cloud Engineering
            </span>
          </h1>

          <p
            style={{
              fontSize: '1.02rem',
              color: '#94a3b8',
              maxWidth: '780px',
              lineHeight: 1.65,
              margin: 0,
            }}
          >
            Follow the battle-tested roadmap from foundational Git version control and GitHub Actions automation,
            through deep Kubernetes orchestration, Infrastructure as Code, observability telemetry, and Linux systems.
          </p>

          {/* Quick Metrics Counter Bar */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1.75rem',
              padding: '0.85rem 1.75rem',
              borderRadius: '16px',
              background: 'rgba(15, 23, 42, 0.75)',
              border: '1px solid rgba(148, 163, 184, 0.15)',
              backdropFilter: 'blur(12px)',
              marginTop: '0.5rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e' }} />
              <span style={{ fontSize: '0.84rem', color: '#cbd5e1' }}>
                <strong style={{ color: '#fff' }}>9</strong> Roadmap Milestones
              </span>
            </div>
            <div style={{ width: '1px', height: '18px', background: 'rgba(148, 163, 184, 0.2)' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Zap size={14} color="#eab308" />
              <span style={{ fontSize: '0.84rem', color: '#cbd5e1' }}>
                <strong style={{ color: '#fff' }}>2</strong> Live Flagship Simulators
              </span>
            </div>
            <div style={{ width: '1px', height: '18px', background: 'rgba(148, 163, 184, 0.2)' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Award size={14} color="#38bdf8" />
              <span style={{ fontSize: '0.84rem', color: '#cbd5e1' }}>
                <strong style={{ color: '#fff' }}>6</strong> Industry Certification Paths
              </span>
            </div>
          </div>
        </div>

        {/* ================================================================ */}
        {/* TRACK FILTER TOGGLE TABS                                         */}
        {/* ================================================================ */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            borderBottom: '1px solid var(--border-color)',
            paddingBottom: '1rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginRight: '0.5rem' }}>
              Filter by Track:
            </span>
            {(
              [
                { id: 'all', label: 'Complete Path (9 Stages)' },
                { id: 'developer', label: 'Developer Track (Git & CI/CD)' },
                { id: 'cloud-native', label: 'Cloud-Native (Kubernetes & IaC)' },
                { id: 'sre', label: 'SRE & Production Ops' },
              ] as const
            ).map((tab) => {
              const isActive = activeCategory === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveCategory(tab.id)}
                  style={{
                    padding: '0.45rem 0.95rem',
                    borderRadius: '8px',
                    fontSize: '0.82rem',
                    fontWeight: isActive ? 800 : 600,
                    background: isActive ? 'rgba(56, 189, 248, 0.15)' : 'var(--bg-card)',
                    border: isActive ? '1px solid #38bdf8' : '1px solid var(--border-color)',
                    color: isActive ? '#38bdf8' : 'var(--text-secondary)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              onClick={() => {
                setActiveLessonConcept(null);
                setMode('learn');
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.45rem 0.85rem',
                borderRadius: '8px',
                background: 'rgba(240, 80, 51, 0.12)',
                border: '1px solid rgba(240, 80, 51, 0.35)',
                color: '#f05033',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              <GitBranch size={14} />
              <span>CommitForge</span>
            </button>
            <button
              onClick={() => setMode('dockforge')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.45rem 0.85rem',
                borderRadius: '8px',
                background: 'rgba(14, 165, 233, 0.12)',
                border: '1px solid rgba(14, 165, 233, 0.35)',
                color: '#38bdf8',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              <Container size={14} />
              <span>DockForge</span>
            </button>
            <button
              onClick={() => setMode('podforge')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.45rem 0.85rem',
                borderRadius: '8px',
                background: 'rgba(50, 108, 229, 0.12)',
                border: '1px solid rgba(50, 108, 229, 0.35)',
                color: '#60a5fa',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              <Boxes size={14} />
              <span>PodForge</span>
            </button>
          </div>
        </div>

        {/* ================================================================ */}
        {/* INTERACTIVE ROADMAP STAGES GRID                                  */}
        {/* ================================================================ */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1.75rem',
          }}
        >
          {filteredStages.map((stage) => {
            const Icon = stage.icon;
            const isLive = stage.status === 'live';
            const isVoted = votedStages[stage.id];

            return (
              <div
                key={stage.id}
                style={{
                  background: 'linear-gradient(145deg, rgba(20, 27, 45, 0.7) 0%, rgba(10, 15, 26, 0.85) 100%)',
                  border: isLive ? `1px solid ${stage.color}50` : '1px solid rgba(148, 163, 184, 0.16)',
                  borderRadius: '20px',
                  padding: '1.75rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.25rem',
                  position: 'relative',
                  overflow: 'hidden',
                  boxShadow: isLive ? `0 12px 35px -10px ${stage.glowColor}` : '0 10px 25px -10px rgba(0, 0, 0, 0.4)',
                  transition: 'all 0.2s ease',
                }}
              >
                {/* Accent Top Strip */}
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '3px',
                    background: `linear-gradient(90deg, ${stage.color} 0%, transparent 100%)`,
                  }}
                />

                {/* Header Row: Stage #, Title, Status & Platform */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    {/* Stage Number Badge */}
                    <div
                      style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '14px',
                        background: `linear-gradient(135deg, ${stage.color} 0%, rgba(15, 23, 42, 0.9) 100%)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                        boxShadow: `0 6px 18px ${stage.glowColor}`,
                        flexShrink: 0,
                      }}
                    >
                      <Icon size={24} />
                    </div>

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap', marginBottom: '0.2rem' }}>
                        <span
                          style={{
                            fontSize: '0.74rem',
                            fontWeight: 800,
                            fontFamily: 'var(--font-mono)',
                            color: stage.color,
                            background: 'rgba(255, 255, 255, 0.05)',
                            padding: '0.15rem 0.5rem',
                            borderRadius: '4px',
                            border: `1px solid ${stage.color}40`,
                          }}
                        >
                          STAGE 0{stage.number}
                        </span>
                        <span style={{ fontSize: '0.84rem', fontWeight: 700, color: '#e2e8f0' }}>
                          {stage.platformName}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          &bull; {stage.techStack}
                        </span>
                      </div>

                      <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#fff', margin: 0, letterSpacing: '-0.02em' }}>
                        {stage.title}
                      </h2>
                    </div>
                  </div>

                  {/* Status Indicator */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    {isLive ? (
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.45rem',
                          padding: '0.35rem 0.85rem',
                          borderRadius: '999px',
                          background: 'rgba(34, 197, 94, 0.12)',
                          border: '1px solid rgba(34, 197, 94, 0.35)',
                          fontSize: '0.76rem',
                          fontWeight: 800,
                          color: '#4ade80',
                        }}
                      >
                        <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#22c55e' }} />
                        <span>LIVE &amp; INTERACTIVE</span>
                      </div>
                    ) : (
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.45rem',
                          padding: '0.35rem 0.85rem',
                          borderRadius: '999px',
                          background: 'rgba(168, 85, 247, 0.1)',
                          border: '1px solid rgba(168, 85, 247, 0.25)',
                          fontSize: '0.76rem',
                          fontWeight: 700,
                          color: '#c084fc',
                        }}
                      >
                        <Clock size={13} />
                        <span>{stage.duration}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Description */}
                <p style={{ fontSize: '0.92rem', color: '#94a3b8', lineHeight: 1.6, margin: 0 }}>
                  {stage.description}
                </p>

                {/* Key Milestones List */}
                <div
                  style={{
                    background: 'rgba(15, 23, 42, 0.5)',
                    border: '1px solid rgba(148, 163, 184, 0.1)',
                    borderRadius: '12px',
                    padding: '1rem 1.25rem',
                  }}
                >
                  <div style={{ fontSize: '0.74rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '0.65rem' }}>
                    Core Architectural Competencies &amp; Skills:
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.5rem' }}>
                    {stage.keyMilestones.map((milestone, mIdx) => (
                      <div key={mIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.82rem', color: '#cbd5e1' }}>
                        <CheckCircle2 size={15} color={isLive ? stage.color : '#64748b'} style={{ marginTop: '2px', flexShrink: 0 }} />
                        <span>{milestone}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer Actions & Certification Readiness */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', borderTop: '1px solid rgba(148, 163, 184, 0.1)', paddingTop: '1rem' }}>
                  {/* Target Certifications */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)' }}>Prepares For:</span>
                    {stage.certifications.map((cert, cIdx) => (
                      <span
                        key={cIdx}
                        style={{
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          padding: '0.15rem 0.55rem',
                          borderRadius: '999px',
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          color: '#e2e8f0',
                        }}
                      >
                        {cert}
                      </span>
                    ))}
                  </div>

                  {/* Primary Interactive CTA */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    {isLive ? (
                      <>
                        <button
                          onClick={() => handleStageAction(stage)}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.55rem 1.15rem',
                            borderRadius: '10px',
                            background: `linear-gradient(135deg, ${stage.color} 0%, rgba(15, 23, 42, 0.9) 100%)`,
                            color: '#ffffff',
                            border: `1px solid ${stage.color}`,
                            fontSize: '0.85rem',
                            fontWeight: 800,
                            cursor: 'pointer',
                            boxShadow: `0 4px 14px ${stage.glowColor}`,
                            transition: 'all 0.15s ease',
                          }}
                        >
                          <span>Launch Interactive Simulator</span>
                          <ArrowRight size={15} />
                        </button>

                        {stage.id === 'stage-git' && (
                          <button
                            onClick={() => {
                              setActiveLessonConcept('c-actions-workflow');
                              setMode('learn');
                            }}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.4rem',
                              padding: '0.55rem 0.85rem',
                              borderRadius: '10px',
                              background: 'rgba(139, 92, 246, 0.18)',
                              border: '1px solid rgba(139, 92, 246, 0.45)',
                              color: '#e9d5ff',
                              fontSize: '0.82rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                            }}
                          >
                            <Zap size={14} color="#a855f7" />
                            <span>CI/CD Track</span>
                          </button>
                        )}
                      </>
                    ) : (
                      <button
                        onClick={() => handleStageAction(stage)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.45rem',
                          padding: '0.55rem 1.15rem',
                          borderRadius: '10px',
                          background: isVoted ? 'rgba(34, 197, 94, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                          border: isVoted ? '1px solid #22c55e' : '1px solid rgba(255, 255, 255, 0.15)',
                          color: isVoted ? '#4ade80' : '#cbd5e1',
                          fontSize: '0.82rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        <Sparkles size={14} color={isVoted ? '#4ade80' : '#c084fc'} />
                        <span>{isVoted ? 'Priority Vote Registered!' : 'Vote for Priority Access'}</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ================================================================ */}
        {/* CAREER TRACK ALIGNMENT SUMMARY                                   */}
        {/* ================================================================ */}
        <div
          style={{
            background: 'linear-gradient(145deg, rgba(15, 23, 42, 0.8) 0%, rgba(9, 14, 26, 0.95) 100%)',
            border: '1px solid rgba(148, 163, 184, 0.15)',
            borderRadius: '20px',
            padding: '2rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <Briefcase size={20} color="#38bdf8" />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', margin: 0 }}>
              Career Role Path Alignment
            </h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
            <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ fontWeight: 800, color: '#f05033', fontSize: '0.95rem' }}>Full-Stack / Core Developer</div>
              <div style={{ fontSize: '0.82rem', color: '#94a3b8', lineHeight: 1.5 }}>
                Stages 1, 2, and 3. Master Git version control, GitHub Actions automated testing, and Docker container packaging.
              </div>
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ fontWeight: 800, color: '#38bdf8', fontSize: '0.95rem' }}>Cloud Platform Engineer</div>
              <div style={{ fontSize: '0.82rem', color: '#94a3b8', lineHeight: 1.5 }}>
                Stages 4, 5, and 6. Orchestrate Kubernetes clusters, automate configurations with Ansible, and declare clouds with Terraform.
              </div>
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ fontWeight: 800, color: '#10b981', fontSize: '0.95rem' }}>Site Reliability Engineer (SRE)</div>
              <div style={{ fontSize: '0.82rem', color: '#94a3b8', lineHeight: 1.5 }}>
                Stages 4, 7, 8, and 9. Triage live Kubernetes outages, instrument Prometheus SLI/SLO metrics, and audit Linux kernel limits.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
