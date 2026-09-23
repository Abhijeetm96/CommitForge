import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { useProgress } from '../../progress';
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
  Play,
  Pause,
  Trophy,
  Target,
  TrendingUp,
  X,
  Map,
  ListOrdered,
  Check,
  Flag,
  Navigation,
} from 'lucide-react';

export type RoadmapTrack = 'all' | 'developer' | 'cloud-native' | 'sre';

export interface RoadmapStage {
  id: string;
  number: number;
  exitCode: string;
  mileMarker: string;
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
  lessonsCount: number;
  labsCount: number;
  projectsCount: number;
  defaultProgress: number;
  curatorNote: string;
  // Precise coordinates on the 1440x920 Scenic Highway Canvas
  roadX: number; // Highway milestone waypoint center
  roadY: number; // Highway milestone waypoint center
  headingAngle: number; // Tangent angle of the road at this point in degrees
  rampD: string; // Paved asphalt exit ramp path splitting off toward course card
  cardX: number; // Card top-left X
  cardY: number; // Card top-left Y
  cardWidth: number; // Card width
  side: 'left' | 'right';
}

const ROADMAP_STAGES: RoadmapStage[] = [
  {
    id: 'stage-git',
    number: 1,
    exitCode: 'EXIT 01',
    mileMarker: 'MILE 10',
    title: 'CommitForge',
    subtitle: 'Version Control & Git Fundamentals',
    category: 'developer',
    status: 'live',
    liveAction: 'learn',
    platformName: 'CommitForge Academy',
    techStack: 'Git 2.45+ • DAG Graph • Virtual Objects Engine',
    duration: '18 Topics • 75 Concepts',
    color: '#f43f5e',
    glowColor: 'rgba(244, 63, 94, 0.45)',
    icon: GitBranch,
    certifications: ['GitHub Foundations', 'Professional Git Practitioner'],
    description:
      'The bedrock of software and infrastructure engineering. Master Git internal object models: SHA-1/256 hashing, index mechanics, three-way merge resolution, interactive rebasing, and reflog disaster recovery.',
    keyMilestones: [
      'Plumbing vs Porcelain: Blob, Tree, Commit & Tag Objects',
      'Branching Strategies: Trunk-Based Development vs GitFlow',
      'Advanced 3-Way Merge Resolution & Conflict Forensics',
      'Interactive Rebase: Squashing, Rewording, Dropping Commits',
      'Disaster Recovery: git reflog and detached HEAD forensics',
    ],
    careerRelevance: 'Mandatory foundation for 100% of modern software and infrastructure roles.',
    lessonsCount: 12,
    labsCount: 6,
    projectsCount: 2,
    defaultProgress: 75,
    curatorNote: 'Start here to master version control & Git object DAG internals.',
    roadX: 300,
    roadY: 740,
    headingAngle: -35,
    rampD: 'M 270,750 C 255,715 245,670 240,630',
    cardX: 40,
    cardY: 575,
    cardWidth: 245,
    side: 'left',
  },
  {
    id: 'stage-cicd',
    number: 2,
    exitCode: 'EXIT 02',
    mileMarker: 'MILE 25',
    title: 'GitHub Actions',
    subtitle: 'CI/CD Pipelines & Automation',
    category: 'developer',
    status: 'live',
    liveAction: 'cicd',
    platformName: 'GitHub Actions & CI/CD Suite',
    techStack: 'GitHub Actions • YAML • OIDC • Container Registries',
    duration: '8 Deep Concepts • Active In-App',
    color: '#a855f7',
    glowColor: 'rgba(168, 85, 247, 0.45)',
    icon: Zap,
    certifications: ['GitHub Actions Certification', 'DevOps Foundation'],
    description:
      'Automate the path from code commit to production. Master GitHub Actions triggers, matrix builds across operating systems, dependency caching optimizations, passwordless OIDC cloud IAM, and automated registry pushes.',
    keyMilestones: [
      'Workflow YAML Syntax, Triggers & Lifecycle Hooks',
      'Multi-OS & Multi-Runtime Matrix Builds (Linux, macOS, Windows)',
      'Dependency Caching Strategies with lockfile hash keys',
      'Zero-Trust Cloud Deployments via OIDC Tokens',
      'Reusable Enterprise Workflows and Composite Actions',
    ],
    careerRelevance: 'Core competence for DevOps Engineers and Release Managers.',
    lessonsCount: 10,
    labsCount: 5,
    projectsCount: 2,
    defaultProgress: 40,
    curatorNote: 'Automate testing, build matrixes & multi-cloud deployments.',
    roadX: 320,
    roadY: 530,
    headingAngle: 25,
    rampD: 'M 315,560 C 290,520 270,470 260,430',
    cardX: 40,
    cardY: 385,
    cardWidth: 245,
    side: 'left',
  },
  {
    id: 'stage-docker',
    number: 3,
    exitCode: 'EXIT 03',
    mileMarker: 'MILE 40',
    title: 'DockForge',
    subtitle: 'Containerization & Docker Engine',
    category: 'developer',
    status: 'live',
    liveAction: 'dockforge',
    platformName: 'DockForge Academy',
    techStack: 'Virtual Docker Engine • 14 Topics • Multi-Stage IDE',
    duration: '14 Topics • 44 Concepts • Active In-App',
    color: '#0ea5e9',
    glowColor: 'rgba(14, 165, 233, 0.45)',
    icon: Container,
    certifications: ['Docker Certified Associate (DCA)', 'OCI Specialist'],
    description:
      'Package applications into portable, isolated containers. Optimize Dockerfile layer caching with BuildKit, build ultra-secure distroless images, configure bridge networks, and orchestrate services with Compose.',
    keyMilestones: [
      'Linux Kernel Isolation: Namespaces, cgroups, and OverlayFS',
      'Multi-Stage Dockerfiles: Separating Build Tools from Runtime',
      'BuildKit Layer Caching & Secret Mounting without Leaks',
      'Distroless Packaging for Minimal Attack Surface',
      'Multi-Container Topologies with Docker Compose & Bridge Networks',
    ],
    careerRelevance: 'Universal requirement across modern cloud, backend, and platform roles.',
    lessonsCount: 14,
    labsCount: 8,
    projectsCount: 3,
    defaultProgress: 20,
    curatorNote: 'Package, ship and run applications using Docker.',
    roadX: 510,
    roadY: 630,
    headingAngle: 12,
    rampD: 'M 480,625 C 455,650 440,680 430,710',
    cardX: 380,
    cardY: 710,
    cardWidth: 265,
    side: 'right',
  },
  {
    id: 'stage-k8s',
    number: 4,
    exitCode: 'EXIT 04',
    mileMarker: 'MILE 55',
    title: 'PodForge',
    subtitle: 'Kubernetes & Cloud-Native Systems',
    category: 'cloud-native',
    status: 'live',
    liveAction: 'podforge',
    platformName: 'PodForge Academy',
    techStack: 'Kubernetes 1.30+ • 16 Topics • Self-Healing Clusters',
    duration: '16 Topics • 71 Concepts • Active In-App',
    color: '#326ce5',
    glowColor: 'rgba(50, 108, 229, 0.45)',
    icon: Boxes,
    certifications: ['Certified Kubernetes Administrator (CKA)', 'CKAD'],
    description:
      'Deploy and orchestrate distributed container systems at enterprise scale. Master Pod lifecycle forensics, ReplicaSet reconciliation loops, Ingress routing, RollingUpdates with zero downtime, and RBAC security.',
    keyMilestones: [
      'Kubernetes Control Plane Internals: API Server, etcd, Scheduler & Kubelet',
      'Declarative Workloads: Deployments, StatefulSets & DaemonSets',
      'Cluster Networking: Services (ClusterIP/NodePort), Ingress & CoreDNS',
      'Storage Architecture: PersistentVolumes, PVCs and CSI Drivers',
      'Disaster Forensics: CrashLoopBackOff, OOMKilled & Node Eviction triage',
    ],
    careerRelevance: 'The #1 most requested container orchestration skill in the tech industry.',
    lessonsCount: 16,
    labsCount: 5,
    projectsCount: 3,
    defaultProgress: 0,
    curatorNote: 'Orchestrate containers at scale with Kubernetes.',
    roadX: 840,
    roadY: 640,
    headingAngle: -145,
    rampD: 'M 805,655 C 850,670 890,665 925,635',
    cardX: 920,
    cardY: 590,
    cardWidth: 265,
    side: 'right',
  },
  {
    id: 'stage-ansible',
    number: 5,
    exitCode: 'EXIT 05',
    mileMarker: 'MILE 70',
    title: 'Terraform & Ansible',
    subtitle: 'Infrastructure as Code & Config',
    category: 'cloud-native',
    status: 'coming-soon',
    platformName: 'Terraform & Ansible Suite',
    techStack: 'Terraform • HCL • Ansible • State Locking • AWS Provider',
    duration: 'Target Q4 2026',
    color: '#f59e0b',
    glowColor: 'rgba(245, 158, 11, 0.45)',
    icon: Cpu,
    certifications: ['HashiCorp Certified: Terraform Associate'],
    description:
      'Declarative multi-cloud provisioning and configuration management. Master Terraform state locking with S3 and DynamoDB, modular architecture, drift detection, and agentless fleet configuration with Ansible.',
    keyMilestones: [
      'Terraform Core Workflow: init, plan, apply & state manipulation',
      'Remote State Backend Locking with S3 Buckets & DynamoDB tables',
      'Reusable Production Modules with Semantic Versioning',
      'Ansible Dynamic Inventory & Idempotent Playbook Orchestration',
      'Infrastructure Testing with Terratest & Automated Policy Enforcement',
    ],
    careerRelevance: 'Essential for Cloud Infrastructure Engineers and Platform Engineers.',
    lessonsCount: 14,
    labsCount: 7,
    projectsCount: 2,
    defaultProgress: 0,
    curatorNote: 'Automate and manage infrastructure with code.',
    roadX: 720,
    roadY: 510,
    headingAngle: -20,
    rampD: 'M 755,530 C 700,525 665,505 645,475',
    cardX: 420,
    cardY: 450,
    cardWidth: 265,
    side: 'left',
  },
  {
    id: 'stage-observability',
    number: 6,
    exitCode: 'EXIT 06',
    mileMarker: 'MILE 85',
    title: 'Observability & SRE',
    subtitle: 'Prometheus, Grafana & SRE Practices',
    category: 'sre',
    status: 'coming-soon',
    platformName: 'Prometheus & Grafana Suite',
    techStack: 'Prometheus • PromQL • Grafana • OpenTelemetry • Loki',
    duration: 'Target Q1 2027',
    color: '#e11d48',
    glowColor: 'rgba(225, 29, 72, 0.45)',
    icon: Activity,
    certifications: ['Prometheus Certified Associate (PCA)'],
    description:
      'Turn black-box systems into crystal-clear telemetry. Master Prometheus metric types, PromQL alerting rules, distributed tracing with OpenTelemetry SDKs, and error budget calculation for Google SRE SLIs/SLOs.',
    keyMilestones: [
      'The 4 Golden Signals: Latency, Traffic, Errors, and Saturation',
      'PromQL Mastery: rate, irate, histogram_quantile & Alerts',
      'Distributed Tracing with OpenTelemetry: Trace IDs & Spans',
      'Log Aggregation with Grafana Loki and LogQL Correlation',
      'Defining SLIs, SLOs, and Error Budgets for Service Reliability',
    ],
    careerRelevance: 'Core competence for Site Reliability Engineers (SRE) and Ops Leads.',
    lessonsCount: 12,
    labsCount: 6,
    projectsCount: 2,
    defaultProgress: 0,
    curatorNote: 'Gain full visibility and telemetry into your systems.',
    roadX: 900,
    roadY: 440,
    headingAngle: -150,
    rampD: 'M 870,450 C 915,455 945,445 965,425',
    cardX: 960,
    cardY: 400,
    cardWidth: 265,
    side: 'right',
  },
  {
    id: 'stage-security',
    number: 7,
    exitCode: 'EXIT 07',
    mileMarker: 'MILE 95',
    title: 'DevSecOps',
    subtitle: 'Security, Secrets & Zero-Trust',
    category: 'sre',
    status: 'coming-soon',
    platformName: 'HashiCorp Vault & Trivy',
    techStack: 'HashiCorp Vault • Trivy • Cosign • SBOM • OPA',
    duration: 'Target Q2 2027',
    color: '#10b981',
    glowColor: 'rgba(16, 185, 129, 0.45)',
    icon: ShieldCheck,
    certifications: ['HashiCorp Vault Associate', 'Certified DevSecOps Professional'],
    description:
      'Shift security left into code and runtime. Lease ephemeral dynamic secrets with HashiCorp Vault, scan container images for CVE vulnerabilities with Trivy, sign artifacts with Cosign, and audit IAM least privilege.',
    keyMilestones: [
      'HashiCorp Vault Dynamic Secret Leases & Auto-Rotation',
      'Static & Dynamic Code Security: SAST, DAST, and Dependency Audits',
      'Container Image CVE Vulnerability Auditing with Trivy in CI',
      'Software Supply Chain Security: SBOM & Cosign Signatures',
      'Zero-Trust Network Policies & Microsegmentation in Kubernetes',
    ],
    careerRelevance: 'Crucial for DevSecOps Specialists and Security Architects.',
    lessonsCount: 10,
    labsCount: 5,
    projectsCount: 2,
    defaultProgress: 0,
    curatorNote: 'Build secure systems with DevSecOps & Zero-Trust.',
    roadX: 760,
    roadY: 330,
    headingAngle: -18,
    rampD: 'M 795,355 C 740,340 700,315 680,285',
    cardX: 450,
    cardY: 260,
    cardWidth: 265,
    side: 'left',
  },
  {
    id: 'stage-linux',
    number: 8,
    exitCode: 'EXIT 08',
    mileMarker: 'MILE 100',
    title: 'Cloud Platforms',
    subtitle: 'AWS, Azure & GCP Systems',
    category: 'cloud-native',
    status: 'coming-soon',
    platformName: 'Multi-Cloud Architecture',
    techStack: 'AWS EKS • GCP GKE • Azure AKS • Cloud Networking • IAM',
    duration: 'Target Q3 2027',
    color: '#8b5cf6',
    glowColor: 'rgba(139, 92, 246, 0.45)',
    icon: Cloud,
    certifications: ['AWS Solutions Architect', 'GCP Cloud DevOps Engineer'],
    description:
      'Architect resilient, cost-effective, multi-region cloud infrastructures. Master cloud networking (VPCs, Transit Gateways), IAM least privilege roles, managed Kubernetes services (EKS, GKE, AKS), and disaster-recovery replication.',
    keyMilestones: [
      'Enterprise Cloud Networking: VPCs, Subnets, Gateways & Peering',
      'Cloud IAM: Role-Based Access Control & Ephemeral Tokens',
      'Managed Kubernetes Production Clusters: EKS, GKE, AKS',
      'Multi-Region Disaster Recovery and DNS Failover',
      'FinOps: Cloud Cost Optimization and Spot Node Pooling',
    ],
    careerRelevance: 'Capstone competency for Cloud Solutions Architects and Principal Engineers.',
    lessonsCount: 12,
    labsCount: 6,
    projectsCount: 4,
    defaultProgress: 0,
    curatorNote: 'Deploy multi-region cloud infrastructures on AWS & GCP.',
    roadX: 1010,
    roadY: 250,
    headingAngle: -28,
    rampD: 'M 975,265 C 925,250 885,225 860,195',
    cardX: 720,
    cardY: 140,
    cardWidth: 260,
    side: 'left',
  },
  {
    id: 'stage-ebpf',
    number: 9,
    exitCode: 'BONUS EXIT',
    mileMarker: 'KERNEL PASS',
    title: 'Linux Kernel & Systems',
    subtitle: 'Kernel primitives, memory, eBPF & systemd',
    category: 'developer',
    status: 'coming-soon',
    platformName: 'Linux Kernel & Systems',
    techStack: 'Linux Kernel 6+ • eBPF • systemd • cgroups v2',
    duration: 'Target Q4 2027',
    color: '#06b6d4',
    glowColor: 'rgba(6, 182, 212, 0.25)',
    icon: Terminal,
    certifications: ['Red Hat RHCSA', 'Linux Foundation LFCS'],
    description:
      'The foundational layer powering every cloud provider and container engine. Dive beneath user space into Linux namespaces, cgroups v2 memory limits, eBPF kernel instrumentation, systemd lifecycle, and TCP socket tuning.',
    keyMilestones: [
      'Kernel Primitives: Namespaces (PID, Net) & cgroups v2 Limits',
      'eBPF: Kernel Tracing, Security & Observability',
      'systemd Service Management & Process Supervision',
      'TCP/IP Network Stack Forensics & Socket Buffers',
      'Memory Paging, Virtual Memory Subsystems & OOM-Killer Forensics',
    ],
    careerRelevance: 'Core differentiator for Elite Systems Engineers and Cloud Architects.',
    lessonsCount: 10,
    labsCount: 5,
    projectsCount: 2,
    defaultProgress: 0,
    curatorNote: 'Master kernel primitives, namespaces & eBPF.',
    roadX: 1100,
    roadY: 200,
    headingAngle: -25,
    rampD: 'M 1090,210 C 1100,260 1100,350 1100,470',
    cardX: 1060,
    cardY: 480,
    cardWidth: 260,
    side: 'right',
  },
];

export const DevOpsRoadmapView: React.FC = () => {
  const { setMode, setActiveLessonConcept } = useApp();
  const [viewMode, setViewMode] = useState<'highway' | 'syllabus'>('highway');
  const [activeCategory, setActiveCategory] = useState<RoadmapTrack>('all');
  const [votedStages, setVotedStages] = useState<Record<string, boolean>>({});
  const [selectedStage, setSelectedStage] = useState<RoadmapStage | null>(null);
  const [showOverviewModal, setShowOverviewModal] = useState<boolean>(false);
  const [showSummitModal, setShowSummitModal] = useState<boolean>(false);

  // Active highway milestone state
  const [activeMilestoneNum, setActiveMilestoneNum] = useState<number>(1);
  const [userCustomCompleted, setUserCustomCompleted] = useState<Record<string, boolean>>({});

  const { manager } = useProgress();
  const commitStats = manager.getCourseStats('commitforge');
  const dockerStats = manager.getCourseStats('dockforge');
  const kubeStats = manager.getCourseStats('podforge');

  const liveStageProgress: Record<
    string,
    { pct: number; completedCount: number; totalCount: number; nextLesson?: string; nextTitle?: string }
  > = {
    'stage-git': {
      pct: commitStats.percentage,
      completedCount: commitStats.completedLessons,
      totalCount: commitStats.totalLessons,
      nextLesson: commitStats.nextLessonId,
      nextTitle: commitStats.nextLessonTitle,
    },
    'stage-cicd': {
      pct: commitStats.completedLessons > 10 ? 50 : 0,
      completedCount: commitStats.completedLessons > 10 ? 1 : 0,
      totalCount: 8,
      nextLesson: 'c-actions-workflow',
      nextTitle: 'GitHub Actions Workflows',
    },
    'stage-docker': {
      pct: dockerStats.percentage,
      completedCount: dockerStats.completedLessons,
      totalCount: dockerStats.totalLessons,
      nextLesson: dockerStats.nextLessonId,
      nextTitle: dockerStats.nextLessonTitle,
    },
    'stage-k8s': {
      pct: kubeStats.percentage,
      completedCount: kubeStats.completedLessons,
      totalCount: kubeStats.totalLessons,
      nextLesson: kubeStats.nextLessonId,
      nextTitle: kubeStats.nextLessonTitle,
    },
  };

  const getStagePct = (stageId: string, defaultPct: number = 0) => {
    if (liveStageProgress[stageId]) {
      return liveStageProgress[stageId].pct;
    }
    return userCustomCompleted[stageId] ? 100 : defaultPct;
  };

  const isStageComplete = (stageId: string) => {
    if (liveStageProgress[stageId]) {
      return liveStageProgress[stageId].pct === 100;
    }
    return Boolean(userCustomCompleted[stageId]);
  };

  // Auto-tour driving animation
  const [isAutoTouring, setIsAutoTouring] = useState<boolean>(false);

  useEffect(() => {
    if (!isAutoTouring) return;
    const interval = setInterval(() => {
      setActiveMilestoneNum((prev) => (prev >= 8 ? 1 : prev + 1));
    }, 3200);
    return () => clearInterval(interval);
  }, [isAutoTouring]);

  const completedCount = ROADMAP_STAGES.slice(0, 8).filter((s) => isStageComplete(s.id)).length;
  const journeyProgressPct = Math.round(
    ROADMAP_STAGES.slice(0, 8).reduce((acc, s) => acc + getStagePct(s.id, 0), 0) / 8
  );

  const filteredStages = ROADMAP_STAGES.filter((stage) => {
    if (activeCategory === 'all') return true;
    return stage.category === activeCategory;
  });

  const currentActiveStage = ROADMAP_STAGES.find((s) => s.number === activeMilestoneNum) || ROADMAP_STAGES[0];

  const handleStageAction = (stage: RoadmapStage) => {
    if (stage.status === 'live') {
      const live = liveStageProgress[stage.id];
      if (stage.liveAction === 'learn') {
        if (live?.nextLesson) {
          setActiveLessonConcept(live.nextLesson);
        } else {
          setActiveLessonConcept(null);
        }
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

  const toggleStageCompleted = (stageId: string) => {
    setUserCustomCompleted((prev) => ({
      ...prev,
      [stageId]: !prev[stageId],
    }));
  };

  // Highway Bezier Path (1440 x 920 coordinate system):
  // Start: (180, 780) -> M1: (300, 740) -> M2: (320, 530) -> M3: (510, 630 Bridge)
  // -> M4: (840, 640) -> M5: (720, 510) -> M6: (900, 440) -> M7: (760, 330)
  // -> M8: (1010, 250) -> Summit Point N: (1180, 170)
  const highwayPathD =
    'M 180,780 C 220,770 260,760 300,740 C 340,710 330,590 320,530 C 310,470 410,570 510,630 C 610,690 750,700 840,640 C 920,580 820,550 720,510 C 640,470 820,470 900,440 C 960,410 840,370 760,330 C 700,290 920,280 1010,250 C 1070,220 1130,190 1180,170';

  return (
    <div
      style={{
        flex: '1 1 0%',
        minHeight: 0,
        height: '100%',
        maxHeight: '100%',
        width: '100%',
        overflowY: 'auto',
        overflowX: 'hidden',
        background: 'radial-gradient(ellipse at 50% 0%, rgba(15, 23, 42, 0.8) 0%, var(--bg-app) 85%)',
        padding: '1.25rem 2rem 5rem 2rem',
        boxSizing: 'border-box',
      }}
    >
      <div style={{ width: '100%', maxWidth: '1480px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* ================================================================ */}
        {/* TOP BAR: BREADCRUMBS & VIEW MODE TABS                            */}
        {/* ================================================================ */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', width: '100%' }}>
          <nav
            aria-label="Breadcrumb"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              flexWrap: 'wrap',
              padding: '0.35rem 0.75rem',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(15, 23, 42, 0.65)',
              border: '1px solid rgba(148, 163, 184, 0.12)',
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
                borderRadius: 'var(--radius-xs)',
                color: 'var(--text-secondary)',
                fontSize: 'var(--text-xs)',
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
                e.currentTarget.style.color = 'var(--text-secondary)';
                e.currentTarget.style.background = 'transparent';
              }}
            >
              <Flame size={14} color="#f05033" />
              <span>Forge Suite</span>
            </button>

            <ChevronRight size={12} color="#64748b" />

            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.15rem 0.5rem',
                borderRadius: 'var(--radius-xs)',
                background: 'rgba(56, 189, 248, 0.15)',
                border: '1px solid rgba(56, 189, 248, 0.35)',
                color: '#38bdf8',
                fontSize: 'var(--text-xs)',
                fontWeight: 700,
              }}
            >
              <Compass size={13} color="#38bdf8" />
              <span>DevOps Highway: Milestone 1 to Goal N</span>
            </span>
          </nav>

          {/* View Mode Switcher */}
          <div
            role="tablist"
            aria-label="Roadmap View Modes"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '0.25rem',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(15, 23, 42, 0.85)',
              border: '1px solid rgba(148, 163, 184, 0.2)',
              gap: '0.35rem',
            }}
          >
            <button
              role="tab"
              aria-selected={viewMode === 'highway'}
              onClick={() => setViewMode('highway')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.4rem 0.95rem',
                borderRadius: 'var(--radius-sm)',
                background: viewMode === 'highway' ? 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)' : 'transparent',
                color: viewMode === 'highway' ? '#ffffff' : 'var(--text-secondary)',
                border: 'none',
                fontSize: 'var(--text-xs)',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: viewMode === 'highway' ? '0 2px 8px rgba(37, 99, 235, 0.4)' : 'none',
                transition: 'all 0.15s ease',
              }}
            >
              <Map size={14} />
              <span>Scenic Highway Map</span>
            </button>
            <button
              role="tab"
              aria-selected={viewMode === 'syllabus'}
              onClick={() => setViewMode('syllabus')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.4rem 0.95rem',
                borderRadius: 'var(--radius-sm)',
                background: viewMode === 'syllabus' ? 'rgba(56, 189, 248, 0.2)' : 'transparent',
                color: viewMode === 'syllabus' ? '#38bdf8' : 'var(--text-secondary)',
                border: viewMode === 'syllabus' ? '1px solid rgba(56, 189, 248, 0.4)' : '1px solid transparent',
                fontSize: 'var(--text-xs)',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              <ListOrdered size={14} />
              <span>Deep Stage Syllabus</span>
            </button>
          </div>
        </div>

        {/* ================================================================ */}
        {/* HERO BANNER: FROM ZERO TO DEVOPS ENGINEER (MATCHING DESIGN)     */}
        {/* ================================================================ */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1.5rem',
            padding: '1.25rem 2rem',
            background: 'linear-gradient(180deg, rgba(16, 24, 40, 0.85) 0%, rgba(8, 12, 22, 0.95) 100%)',
            border: '1px solid rgba(148, 163, 184, 0.16)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: '0 10px 25px -10px rgba(0, 0, 0, 0.5)',
          }}
        >
          <div style={{ flex: '1 1 540px', display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <span
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 900,
                  letterSpacing: '0.08em',
                  color: '#38bdf8',
                  background: 'rgba(56, 189, 248, 0.12)',
                  padding: '0.2rem 0.6rem',
                  borderRadius: '4px',
                  border: '1px solid rgba(56, 189, 248, 0.3)',
                }}
              >
                YOUR JOURNEY TO A MODERN DEVOPS CAREER
              </span>
              <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Point 1 to Goal N</span>
            </div>

            <h1
              style={{
                fontSize: 'clamp(1.75rem, 2.5vw, 2.35rem)',
                fontWeight: 900,
                letterSpacing: '-0.025em',
                margin: 0,
                color: '#ffffff',
                lineHeight: 1.2,
              }}
            >
              The{' '}
              <span
                style={{
                  background: 'linear-gradient(135deg, #38bdf8 0%, #818cf8 60%, #c084fc 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                DevOps &amp; Cloud
              </span>{' '}
              Engineering Roadmap
            </h1>

            <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
              Follow a structured, hands-on path from fundamentals to production-ready skills. Each course is a milestone unlocking real tools, interactive labs, and industry projects.
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.4rem', flexWrap: 'wrap' }}>
              <button
                onClick={() => {
                  setActiveMilestoneNum(1);
                  setIsAutoTouring(true);
                }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.6rem 1.25rem',
                  borderRadius: 'var(--radius-sm)',
                  background: 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)',
                  color: '#ffffff',
                  border: 'none',
                  fontSize: '0.88rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(37, 99, 235, 0.4)',
                }}
              >
                <Play size={14} fill="#fff" />
                <span>Start Your Journey</span>
                <ArrowRight size={14} />
              </button>

              <button
                onClick={() => setShowOverviewModal(true)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.6rem 1.15rem',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(148, 163, 184, 0.25)',
                  color: '#f8fafc',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                <Compass size={14} color="#38bdf8" />
                <span>Watch Overview</span>
              </button>

              <button
                onClick={() => setIsAutoTouring((prev) => !prev)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.6rem 1.15rem',
                  borderRadius: 'var(--radius-sm)',
                  background: isAutoTouring ? 'rgba(34, 197, 94, 0.15)' : 'transparent',
                  border: isAutoTouring ? '1px solid #22c55e' : '1px solid rgba(148, 163, 184, 0.2)',
                  color: isAutoTouring ? '#4ade80' : 'var(--text-secondary)',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                {isAutoTouring ? <Pause size={14} /> : <Sparkles size={14} color="#facc15" />}
                <span>{isAutoTouring ? 'Touring...' : 'Auto-Drive'}</span>
              </button>
            </div>
          </div>

          {/* Top-Right Badge: From Zero to DevOps Engineer */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              padding: '0.9rem 1.35rem',
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(145deg, rgba(30, 41, 69, 0.6) 0%, rgba(15, 23, 42, 0.9) 100%)',
              border: '1px solid rgba(56, 189, 248, 0.25)',
              boxShadow: '0 8px 20px -5px rgba(0, 0, 0, 0.4)',
            }}
          >
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                background: 'rgba(56, 189, 248, 0.15)',
                border: '1px solid rgba(56, 189, 248, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#38bdf8',
                boxShadow: '0 0 16px rgba(56, 189, 248, 0.25)',
                flexShrink: 0,
              }}
            >
              <Compass size={22} />
            </div>
            <div>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600 }}>From Zero</div>
              <div style={{ fontSize: '1rem', fontWeight: 900, color: '#ffffff', letterSpacing: '-0.01em' }}>
                to DevOps Engineer
              </div>
              <div style={{ fontSize: '0.75rem', color: '#38bdf8', marginTop: '0.15rem' }}>
                A clear path. Real skills. A brighter future.
              </div>
            </div>
          </div>
        </div>

        {/* ================================================================ */}
        {/* VIEW MODE 1: SCENIC HIGHWAY ROADMAP (AUTHENTIC REAL ROAD)       */}
        {/* ================================================================ */}
        {viewMode === 'highway' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', width: '100%' }}>
            {/* The Scenic Mountain Highway Canvas Container */}
            <div
              style={{
                position: 'relative',
                width: '100%',
                height: '920px',
                borderRadius: 'var(--radius-lg)',
                background: 'radial-gradient(ellipse at 50% 20%, #0d172c 0%, #060912 100%)',
                border: '1px solid rgba(148, 163, 184, 0.2)',
                boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.85)',
                overflow: 'hidden',
                boxSizing: 'border-box',
              }}
            >
              {/* SVG 1: SCENIC 3D LANDSCAPE, RIVER, VIADUCT BRIDGE, ASPHALT ROAD */}
              <svg
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  pointerEvents: 'none',
                }}
                viewBox="0 0 1440 920"
                preserveAspectRatio="xMidYMid meet"
              >
                <defs>
                  {/* Authentic Coal-Tar Bitumen Texture Pattern with Embedded Aggregate Grit */}
                  <pattern id="coalTarAggregate" width="40" height="40" patternUnits="userSpaceOnUse">
                    {/* Deep matte coal-tar bitumen base */}
                    <rect width="40" height="40" fill="#16181c" />
                    {/* Embedded mineral aggregate gravel stone flecks */}
                    <circle cx="5" cy="7" r="1.1" fill="#2d323a" />
                    <circle cx="13" cy="21" r="1.4" fill="#3b424d" />
                    <circle cx="31" cy="11" r="1.0" fill="#485260" />
                    <circle cx="39" cy="27" r="1.5" fill="#292e36" />
                    <circle cx="17" cy="37" r="1.2" fill="#363d47" />
                    <circle cx="27" cy="39" r="1.6" fill="#23272e" />
                    <circle cx="23" cy="17" r="0.9" fill="#4b5463" />
                    <circle cx="4" cy="31" r="1.3" fill="#303640" />
                    <circle cx="37" cy="5" r="1.1" fill="#343a44" />
                    <circle cx="9" cy="3" r="0.8" fill="#464e5b" />
                    <circle cx="43" cy="41" r="1.2" fill="#2b3038" />
                    <circle cx="15" cy="13" r="1.0" fill="#383f49" />
                    <circle cx="33" cy="33" r="1.4" fill="#2d323b" />
                    <circle cx="45" cy="17" r="0.9" fill="#3f4753" />
                    {/* Subtle hot-poured bitumen crack sealant strip */}
                    <path d="M 0,22 Q 10,24 20,21 T 40,23" fill="none" stroke="#0a0b0d" strokeWidth="1.2" opacity="0.75" />
                  </pattern>

                  {/* Coal-Tar Surface Mineral Grit Noise Filter */}
                  <filter id="tarGritFilter" x="0%" y="0%" width="100%" height="100%">
                    <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="4" result="noise" />
                    <feColorMatrix
                      type="matrix"
                      values="
                        0 0 0 0 0.08
                        0 0 0 0 0.09
                        0 0 0 0 0.11
                        0 0 0 0 0.45 0"
                      in="noise"
                      result="grit"
                    />
                    <feBlend mode="multiply" in="SourceGraphic" in2="grit" result="texturedTar" />
                  </filter>

                  {/* Concrete Curb Gradient */}
                  <linearGradient id="concreteCurbGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#64748b" />
                    <stop offset="50%" stopColor="#475569" />
                    <stop offset="100%" stopColor="#334155" />
                  </linearGradient>

                  {/* Crushed Stone Gravel Shoulder / Verge Gradient */}
                  <linearGradient id="gravelShoulderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#363028" />
                    <stop offset="50%" stopColor="#2c2720" />
                    <stop offset="100%" stopColor="#3b342b" />
                  </linearGradient>

                  {/* River Water Gradient with Shimmer */}
                  <linearGradient id="riverGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#0284c7" stopOpacity="0.45" />
                    <stop offset="50%" stopColor="#0369a1" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="#075985" stopOpacity="0.75" />
                  </linearGradient>

                  {/* Mountain Ridge Gradient */}
                  <linearGradient id="mountainRidge" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#334155" />
                    <stop offset="50%" stopColor="#1e293b" />
                    <stop offset="100%" stopColor="#0f172a" />
                  </linearGradient>

                  <linearGradient id="peakSnow" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#f8fafc" />
                    <stop offset="100%" stopColor="#94a3b8" />
                  </linearGradient>

                  {/* Headlights Cone Gradient */}
                  <radialGradient id="headlightGlow" cx="0%" cy="50%" r="100%">
                    <stop offset="0%" stopColor="#fef08a" stopOpacity="0.85" />
                    <stop offset="35%" stopColor="#facc15" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#facc15" stopOpacity="0" />
                  </radialGradient>

                  {/* Streetlamp Warm Light Pool */}
                  <radialGradient id="streetlampLight" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#fef08a" stopOpacity="0.4" />
                    <stop offset="60%" stopColor="#fde047" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="#eab308" stopOpacity="0" />
                  </radialGradient>

                  {/* Deep 3D Roadbed Shadow Filter */}
                  <filter id="roadDropShadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="3" dy="10" stdDeviation="6" floodColor="#000000" floodOpacity="0.85" />
                  </filter>
                </defs>

                {/* Subtle Topo Grid Background Lines */}
                <path
                  d="M 0,200 Q 400,180 800,240 T 1440,180 M 0,400 Q 500,420 900,360 T 1440,420 M 0,650 Q 450,600 950,680 T 1440,620"
                  fill="none"
                  stroke="rgba(148, 163, 184, 0.04)"
                  strokeWidth="1.5"
                />

                {/* TOP-RIGHT SCENIC MOUNTAINS (SUMMIT PEAK) */}
                <polygon points="1050,300 1180,80 1340,320" fill="url(#mountainRidge)" opacity="0.6" />
                <polygon points="1180,80 1150,140 1180,125 1210,140" fill="url(#peakSnow)" opacity="0.85" />

                <polygon points="1160,320 1260,110 1420,330" fill="url(#mountainRidge)" opacity="0.75" />
                <polygon points="1260,110 1235,160 1260,145 1285,160" fill="url(#peakSnow)" opacity="0.9" />

                <polygon points="960,340 1080,160 1220,340" fill="url(#mountainRidge)" opacity="0.5" />
                <polygon points="1080,160 1060,205 1080,195 1100,205" fill="url(#peakSnow)" opacity="0.8" />

                {/* SCENIC BLUE RIVER (FLOWS BEHIND MILESTONE 3) */}
                <path
                  d="M 520,380 C 500,460 460,540 480,620 C 500,700 480,780 430,920 L 580,920 C 620,800 630,710 610,630 C 590,550 630,460 620,380 Z"
                  fill="url(#riverGrad)"
                />
                <path
                  d="M 500,480 C 480,560 510,650 510,750 M 540,500 C 530,600 560,700 540,820"
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.25)"
                  strokeWidth="2"
                  strokeDasharray="12 18"
                />

                {/* MULTI-ARCH WEATHERED STONE VIADUCT BRIDGE (OVER RIVER AT MILESTONE 3) */}
                <g id="viaduct-bridge">
                  {/* Bridge Shadow */}
                  <rect x="460" y="618" width="105" height="50" rx="4" fill="rgba(0,0,0,0.55)" filter="url(#roadDropShadow)" />
                  {/* Masonry Abutments */}
                  <rect x="460" y="605" width="105" height="48" rx="4" fill="#2d333d" stroke="#475569" strokeWidth="2" />
                  {/* Stone Masonry Pier Arches (3 cutouts) */}
                  <path
                    d="M 462,652 L 472,652 A 10,12 0 0,0 492,652 L 500,652 A 10,12 0 0,0 520,652 L 528,652 A 10,12 0 0,0 548,652 L 562,652"
                    fill="none"
                    stroke="#0b1120"
                    strokeWidth="10"
                    strokeLinecap="round"
                  />
                  {/* Top and Bottom Bridge Stone Parapets */}
                  <line x1="460" y1="605" x2="565" y2="605" stroke="#788698" strokeWidth="4" />
                  <line x1="460" y1="653" x2="565" y2="653" stroke="#788698" strokeWidth="4" />
                  {/* Vertical Stone Railing Posts */}
                  {[470, 485, 500, 515, 530, 545, 560].map((px) => (
                    <line key={px} x1={px} y1="605" x2={px} y2="653" stroke="rgba(148, 163, 184, 0.4)" strokeWidth="1.5" />
                  ))}
                  {/* Water foam and ripples around bridge piers */}
                  <ellipse cx="482" cy="656" rx="14" ry="4" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
                  <ellipse cx="510" cy="656" rx="14" ry="4" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
                  <ellipse cx="538" cy="656" rx="14" ry="4" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
                </g>

                {/* SCENIC VECTOR PINE TREES SCATTERED ALONG HIGHWAY */}
                {[
                  { x: 140, y: 730, s: 0.8 },
                  { x: 190, y: 710, s: 0.9 },
                  { x: 230, y: 640, s: 0.75 },
                  { x: 280, y: 660, s: 0.85 },
                  { x: 370, y: 580, s: 0.8 },
                  { x: 420, y: 550, s: 0.9 },
                  { x: 440, y: 620, s: 0.75 },
                  { x: 670, y: 660, s: 0.95 },
                  { x: 740, y: 670, s: 0.8 },
                  { x: 790, y: 590, s: 0.85 },
                  { x: 860, y: 540, s: 0.75 },
                  { x: 670, y: 440, s: 0.8 },
                  { x: 740, y: 420, s: 0.85 },
                  { x: 820, y: 390, s: 0.9 },
                  { x: 890, y: 340, s: 0.85 },
                  { x: 960, y: 310, s: 0.95 },
                  { x: 1040, y: 190, s: 0.8 },
                  { x: 1110, y: 140, s: 0.85 },
                  { x: 1140, y: 220, s: 0.75 },
                  { x: 1220, y: 260, s: 0.85 },
                ].map((tree, tIdx) => (
                  <g key={tIdx} transform={`translate(${tree.x}, ${tree.y}) scale(${tree.s})`}>
                    <polygon points="0,-22 -9,-6 9,-6" fill="#065f46" />
                    <polygon points="0,-14 -11,4 11,4" fill="#047857" />
                    <polygon points="0,-4 -13,14 13,14" fill="#064e3b" />
                    <rect x="-2" y="14" width="4" height="6" fill="#78350f" />
                  </g>
                ))}

                {/* ========================================================== */}
                {/* 3D ELEVATED TAR ROADBED: GRAVEL, CONCRETE, AGGREGATE TAR   */}
                {/* ========================================================== */}

                {/* 0. Deep 3D Ground Shadow Beneath Roadbed */}
                <path
                  d={highwayPathD}
                  fill="none"
                  stroke="rgba(0, 0, 0, 0.85)"
                  strokeWidth="58"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  filter="url(#roadDropShadow)"
                />

                {/* 1. Roadbed Earth & Crushed Stone Gravel Shoulder / Verge */}
                <path
                  d={highwayPathD}
                  fill="none"
                  stroke="url(#gravelShoulderGrad)"
                  strokeWidth="54"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* 2. Solid Precast Concrete Kerb / Curb Bevels */}
                <path
                  d={highwayPathD}
                  fill="none"
                  stroke="url(#concreteCurbGrad)"
                  strokeWidth="48"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* 3. Solid White Painted Road Edge Fog Lines */}
                <path
                  d={highwayPathD}
                  fill="none"
                  stroke="#e2e8f0"
                  strokeWidth="44"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* 4. TRUE COAL-TAR BITUMEN ROAD SURFACE (AGGREGATE GRAIN) */}
                <path
                  d={highwayPathD}
                  fill="none"
                  stroke="url(#coalTarAggregate)"
                  strokeWidth="40"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  filter="url(#tarGritFilter)"
                />

                {/* 5. Dark Pressed Rubber Wheel Ruts / Tire Wear Tracks */}
                <path
                  d={highwayPathD}
                  fill="none"
                  stroke="rgba(8, 9, 12, 0.65)"
                  strokeWidth="28"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d={highwayPathD}
                  fill="none"
                  stroke="url(#coalTarAggregate)"
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* 6. Reflective Road Cat's Eye Studs Along Shoulders */}
                <path
                  d={highwayPathD}
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.8)"
                  strokeWidth="42"
                  strokeDasharray="2 38"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* 7. Center Dashed Yellow Highway Lane Divider with Active Traffic Flow */}
                <path
                  d={highwayPathD}
                  fill="none"
                  stroke="#facc15"
                  strokeWidth="2.5"
                  strokeDasharray="9 11"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <animate attributeName="stroke-dashoffset" values="0;-100" dur="3s" repeatCount="indefinite" />
                </path>

                {/* 8. Hot-Poured Bitumen Crack Seal Lines on Sharp Bends */}
                <path
                  d="M 310,720 Q 320,680 325,650 M 330,560 Q 325,520 340,490 M 820,660 Q 845,640 855,610 M 740,515 Q 730,480 750,460"
                  fill="none"
                  stroke="#08090b"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  opacity="0.8"
                />

                {/* ========================================================== */}
                {/* REAL PAVED COAL-TAR OFF-RAMPS (EXIT SLIP ROADS TO COURSES) */}
                {/* ========================================================== */}
                {ROADMAP_STAGES.slice(0, 8).map((stage) => (
                  <g key={`ramp-${stage.id}`} id={`ramp-${stage.id}`}>
                    {/* Ramp 3D Shadow */}
                    <path
                      d={stage.rampD}
                      fill="none"
                      stroke="rgba(0,0,0,0.65)"
                      strokeWidth="26"
                      strokeLinecap="round"
                      filter="url(#roadDropShadow)"
                    />
                    {/* Ramp Gravel Verge & Concrete Curbs */}
                    <path d={stage.rampD} fill="none" stroke="url(#gravelShoulderGrad)" strokeWidth="26" strokeLinecap="round" />
                    <path d={stage.rampD} fill="none" stroke="url(#concreteCurbGrad)" strokeWidth="22" strokeLinecap="round" />
                    {/* Ramp White Painted Shoulder Line */}
                    <path d={stage.rampD} fill="none" stroke="#e2e8f0" strokeWidth="20" strokeLinecap="round" />
                    {/* Ramp Coal-Tar Bitumen Surface */}
                    <path
                      d={stage.rampD}
                      fill="none"
                      stroke="url(#coalTarAggregate)"
                      strokeWidth="16"
                      strokeLinecap="round"
                      filter="url(#tarGritFilter)"
                    />
                    {/* Ramp Center Deceleration Dash */}
                    <path
                      d={stage.rampD}
                      fill="none"
                      stroke="#facc15"
                      strokeWidth="1.5"
                      strokeDasharray="4 6"
                      strokeLinecap="round"
                    />
                    {/* Painted Exit Stencil on the Ramp */}
                    <g transform={`translate(${stage.roadX + (stage.side === 'left' ? -25 : 25)}, ${stage.roadY}) scale(0.65)`}>
                      <text x="0" y="0" fill="rgba(255,255,255,0.75)" fontSize="10" fontWeight="900" textAnchor="middle">
                        EXIT ↗
                      </text>
                    </g>
                  </g>
                ))}

                {/* ========================================================== */}
                {/* W-BEAM METAL GUARDRAILS ALONG SHARP MOUNTAIN CURVES        */}
                {/* ========================================================== */}
                <g id="mountain-guardrails">
                  {/* Guardrail Curve 1 & 2 (Outer bend) */}
                  <path
                    d="M 335,760 C 375,700 370,570 355,500"
                    fill="none"
                    stroke="#94a3b8"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                  {[750, 715, 680, 645, 610, 575, 540, 510].map((py, idx) => (
                    <line key={idx} x1="358" y1={py} x2="368" y2={py} stroke="#64748b" strokeWidth="2" />
                  ))}

                  {/* Guardrail Curve 4 (Outer bend) */}
                  <path
                    d="M 800,685 Q 890,675 870,590"
                    fill="none"
                    stroke="#94a3b8"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                  {[680, 650, 620, 595].map((py, idx) => (
                    <line key={idx} x1="865" y1={py} x2="875" y2={py} stroke="#64748b" strokeWidth="2" />
                  ))}

                  {/* Guardrail Curve 6 (Outer bend) */}
                  <path
                    d="M 870,480 Q 945,465 930,400"
                    fill="none"
                    stroke="#94a3b8"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                  {[475, 450, 425, 405].map((py, idx) => (
                    <line key={idx} x1="925" y1={py} x2="935" y2={py} stroke="#64748b" strokeWidth="2" />
                  ))}

                  {/* Guardrail Curve 7 (Outer bend) */}
                  <path
                    d="M 730,360 Q 720,295 780,275"
                    fill="none"
                    stroke="#94a3b8"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                  {[355, 330, 305, 280].map((py, idx) => (
                    <line key={idx} x1="720" y1={py} x2="710" y2={py} stroke="#64748b" strokeWidth="2" />
                  ))}
                </g>

                {/* ========================================================== */}
                {/* YELLOW CHEVRON CURVE WARNING SIGNS (>>>) ON MOUNTAIN BENDS */}
                {/* ========================================================== */}
                <g id="curve-chevron-signs">
                  {[
                    { x: 370, y: 640, r: -15 },
                    { x: 890, y: 655, r: -75 },
                    { x: 950, y: 440, r: -70 },
                    { x: 708, y: 315, r: 45 },
                  ].map((chev, cIdx) => (
                    <g key={cIdx} transform={`translate(${chev.x}, ${chev.y}) rotate(${chev.r}) scale(0.75)`}>
                      <rect x="-8" y="-8" width="16" height="16" fill="#facc15" stroke="#000" strokeWidth="1.5" rx="1" />
                      <path d="M -4,-4 L 2,0 L -4,4" fill="none" stroke="#000" strokeWidth="2.5" strokeLinecap="round" />
                    </g>
                  ))}
                </g>

                {/* ========================================================== */}
                {/* HIGHWAY STREETLIGHT POLES & LUMINOUS ROAD LIGHT POOLS      */}
                {/* ========================================================== */}
                <g id="highway-streetlights">
                  {[
                    { x: 235, y: 775, lx: 250, ly: 760 },
                    { x: 375, y: 550, lx: 350, ly: 540 },
                    { x: 630, y: 675, lx: 650, ly: 660 },
                    { x: 895, y: 570, lx: 875, ly: 580 },
                    { x: 670, y: 475, lx: 690, ly: 485 },
                    { x: 945, y: 385, lx: 925, ly: 395 },
                    { x: 730, y: 265, lx: 750, ly: 280 },
                    { x: 1060, y: 210, lx: 1040, ly: 225 },
                  ].map((lamp, lIdx) => (
                    <g key={lIdx}>
                      {/* Warm Light Pool on the Asphalt */}
                      <circle cx={lamp.lx} cy={lamp.ly} r="32" fill="url(#streetlampLight)" />
                      {/* Curved Steel Lamp Post */}
                      <path
                        d={`M ${lamp.x},${lamp.y} L ${lamp.x},${lamp.y - 28} Q ${lamp.x},${lamp.y - 40} ${lamp.lx},${lamp.ly - 20}`}
                        fill="none"
                        stroke="#64748b"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      />
                      {/* Luminaire Fixture Head */}
                      <circle cx={lamp.lx} cy={lamp.ly - 20} r="3.5" fill="#fef08a" stroke="#475569" strokeWidth="1" />
                    </g>
                  ))}
                </g>

                {/* ========================================================== */}
                {/* PAINTED ASPHALT DECALS: SPEED LIMIT 65 & ROAD ARROWS       */}
                {/* ========================================================== */}
                <g id="road-painted-decals">
                  {/* Speed Limit Stencil on Asphalt */}
                  <g transform="translate(210, 765) rotate(-22) scale(0.7)">
                    <rect x="-14" y="-7" width="28" height="14" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" />
                    <text x="0" y="4" fill="rgba(255,255,255,0.85)" fontSize="9" fontWeight="900" textAnchor="middle">
                      65
                    </text>
                  </g>

                  {/* Directional Highway Arrows Painted on Lanes */}
                  {[
                    { x: 245, y: 752, r: -25 },
                    { x: 440, y: 595, r: 25 },
                    { x: 770, y: 665, r: -15 },
                    { x: 825, y: 480, r: -140 },
                    { x: 830, y: 355, r: -25 },
                  ].map((arr, aIdx) => (
                    <g key={aIdx} transform={`translate(${arr.x}, ${arr.y}) rotate(${arr.r}) scale(0.6)`}>
                      <path d="M 0,-12 L -6,-2 L -2,-2 L -2,10 L 2,10 L 2,-2 L 6,-2 Z" fill="rgba(255,255,255,0.65)" />
                    </g>
                  ))}
                </g>

                {/* ========================================================== */}
                {/* OVERHEAD STEEL TRUSS INTERSTATE GANTRY AT START (MILE 0)   */}
                {/* ========================================================== */}
                <g id="start-interstate-gantry" transform="translate(170, 780) rotate(-22)">
                  {/* Left Steel Column */}
                  <rect x="-24" y="-36" width="4" height="72" fill="#475569" stroke="#1e293b" strokeWidth="1" />
                  {/* Right Steel Column */}
                  <rect x="20" y="-36" width="4" height="72" fill="#475569" stroke="#1e293b" strokeWidth="1" />
                  {/* Overhead Horizontal Truss Beam with Cross Lattice */}
                  <rect x="-24" y="-36" width="48" height="10" fill="#334155" stroke="#1e293b" strokeWidth="1" />
                  <line x1="-24" y1="-31" x2="24" y2="-31" stroke="#94a3b8" strokeWidth="1" />
                  {/* Green Highway Sign Mounted to Truss */}
                  <rect x="-20" y="-32" width="40" height="18" rx="2" fill="#15803d" stroke="#ffffff" strokeWidth="1.2" />
                  <text x="0" y="-23" fill="#bbf7d0" fontSize="4.5" fontWeight="900" textAnchor="middle">
                    NORTH 01 • DEVOPS
                  </text>
                  <text x="0" y="-17" fill="#ffffff" fontSize="4.5" fontWeight="800" textAnchor="middle">
                    START: POINT 1
                  </text>
                </g>

                {/* SUMMIT FINISH LINE (POINT N): CHECKERED BANNER & OVERHEAD ARCH */}
                <g transform="translate(1180, 165) rotate(25)">
                  <rect x="-10" y="-18" width="20" height="36" fill="#f59e0b" stroke="#ffffff" strokeWidth="2" />
                  <line x1="-10" y1="-9" x2="10" y2="-9" stroke="#000000" strokeWidth="2" strokeDasharray="5 5" />
                  <line x1="-10" y1="0" x2="10" y2="0" stroke="#000000" strokeWidth="2" strokeDasharray="5 5" />
                  <line x1="-10" y1="9" x2="10" y2="9" stroke="#000000" strokeWidth="2" strokeDasharray="5 5" />
                </g>
              </svg>

              {/* ========================================================== */}
              {/* WOODEN SIGNPOST AT START: "BUILD YOUR FOUNDATION"          */}
              {/* ========================================================== */}
              <div
                style={{
                  position: 'absolute',
                  left: '48px',
                  top: '760px',
                  zIndex: 8,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  pointerEvents: 'auto',
                }}
              >
                <div
                  style={{
                    background: 'linear-gradient(180deg, #78350f 0%, #451a03 100%)',
                    border: '2px solid #b45309',
                    borderRadius: '8px',
                    padding: '0.5rem 0.9rem',
                    boxShadow: '0 8px 20px rgba(0,0,0,0.7)',
                    color: '#fef3c7',
                    fontFamily: 'var(--font-sans)',
                  }}
                >
                  <div style={{ fontSize: '0.9rem', fontWeight: 900, letterSpacing: '0.04em', color: '#fde68a' }}>
                    START
                  </div>
                  <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#fef3c7', whiteSpace: 'nowrap' }}>
                    Build Your Foundation
                  </div>
                </div>
                <div style={{ fontSize: '1.25rem', color: '#f59e0b' }}>➔</div>
              </div>

              {/* ========================================================== */}
              {/* SUMMIT OVERLOOK TERMINUS & 4 CAREER PILLS (AT TOP RIGHT)   */}
              {/* ========================================================== */}
              <div
                style={{
                  position: 'absolute',
                  left: '1060px',
                  top: '60px',
                  zIndex: 8,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.65rem',
                  width: '340px',
                  pointerEvents: 'auto',
                }}
              >
                {/* Summit Goal Beacon Card */}
                <div
                  onClick={() => setShowSummitModal(true)}
                  style={{
                    background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(15, 23, 42, 0.95) 100%)',
                    border: '2px solid #f59e0b',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.85rem 1.15rem',
                    boxShadow: '0 0 30px rgba(245, 158, 11, 0.35), 0 10px 25px rgba(0, 0, 0, 0.8)',
                    cursor: 'pointer',
                    transition: 'transform 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'none';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div
                        style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '6px',
                          background: 'linear-gradient(135deg, #f59e0b, #ea580c)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#fff',
                        }}
                      >
                        <Flag size={16} />
                      </div>
                      <div>
                        <div style={{ fontSize: '0.72rem', fontWeight: 900, color: '#f59e0b', letterSpacing: '0.04em' }}>
                          DEVOPS ENGINEER
                        </div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#ffffff' }}>Your Goal (Point N)</div>
                      </div>
                    </div>
                    <span style={{ fontSize: '0.72rem', color: '#fde68a', fontWeight: 700 }}>Inspect ↗</span>
                  </div>
                </div>

                {/* 4 Career Outcome Badges (Matching Design) */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  {[
                    { label: 'Higher Opportunities', sub: '$165k+ US Avg Benchmark', color: '#38bdf8' },
                    { label: 'Real-world Impact', sub: 'Mission-Critical 99.99% Systems', color: '#34d399' },
                    { label: 'Better Career', sub: 'Staff / Principal Platform Track', color: '#818cf8' },
                    { label: 'Continuous Growth', sub: 'Cloud-Native & Distributed Arch', color: '#c084fc' },
                  ].map((pill, pIdx) => (
                    <div
                      key={pIdx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.35rem 0.75rem',
                        borderRadius: 'var(--radius-sm)',
                        background: 'rgba(15, 23, 42, 0.85)',
                        border: '1px solid rgba(148, 163, 184, 0.16)',
                        backdropFilter: 'blur(6px)',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: pill.color }} />
                        <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#f8fafc' }}>{pill.label}</span>
                      </div>
                      <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{pill.sub}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* ========================================================== */}
              {/* THE 8 HIGHWAY MILESTONE WAYPOINTS DIRECTLY ON ROADBED      */}
              {/* ========================================================== */}
              {ROADMAP_STAGES.slice(0, 8).map((stage) => {
                const isActive = stage.number === activeMilestoneNum;
                const isComplete = isStageComplete(stage.id);

                return (
                  <div
                    key={`pin-${stage.id}`}
                    style={{
                      position: 'absolute',
                      left: `${stage.roadX}px`,
                      top: `${stage.roadY}px`,
                      transform: 'translate(-50%, -50%)',
                      zIndex: 12,
                      cursor: 'pointer',
                    }}
                    onClick={() => {
                      setActiveMilestoneNum(stage.number);
                      setSelectedStage(stage);
                    }}
                    title={`Milestone ${stage.number}: ${stage.title}`}
                  >
                    {/* Glowing radar pulse ring */}
                    {isActive && (
                      <div
                        style={{
                          position: 'absolute',
                          inset: '-12px',
                          borderRadius: '50%',
                          border: `2px solid ${stage.color}`,
                          boxShadow: `0 0 20px ${stage.color}`,
                          animation: 'pulse 1.8s infinite',
                          pointerEvents: 'none',
                        }}
                      />
                    )}

                    {/* Circular waypoint milestone badge */}
                    <div
                      style={{
                        width: isActive ? '46px' : '38px',
                        height: isActive ? '46px' : '38px',
                        borderRadius: '50%',
                        background: isComplete
                          ? 'linear-gradient(135deg, #10b981 0%, #047857 100%)'
                          : `linear-gradient(135deg, ${stage.color} 0%, #0f172a 100%)`,
                        border: `3px solid ${isActive ? '#ffffff' : stage.color}`,
                        color: '#ffffff',
                        fontWeight: 900,
                        fontSize: '0.95rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: isActive
                          ? `0 0 28px ${stage.color}, 0 4px 14px rgba(0,0,0,0.9)`
                          : `0 0 14px ${stage.glowColor}`,
                        transition: 'all 0.2s ease',
                      }}
                    >
                      {isComplete ? <Check size={18} strokeWidth={3} /> : stage.number}
                    </div>

                    {/* Milestone Pin Arrow Tip anchored to the road */}
                    <div
                      style={{
                        width: 0,
                        height: 0,
                        borderLeft: '5px solid transparent',
                        borderRight: '5px solid transparent',
                        borderTop: `6px solid ${isActive ? '#ffffff' : stage.color}`,
                        margin: '0 auto',
                      }}
                    />
                  </div>
                );
              })}

              {/* ========================================================== */}
              {/* REALISTIC SPORTS COUPE / CYBER ROVER WITH ROAD HEADING    */}
              {/* ========================================================== */}
              <div
                style={{
                  position: 'absolute',
                  left: `${currentActiveStage.roadX}px`,
                  top: `${currentActiveStage.roadY}px`,
                  transform: `translate(-50%, -50%) rotate(${currentActiveStage.headingAngle}deg)`,
                  zIndex: 15,
                  pointerEvents: 'none',
                  transition: 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
                }}
              >
                {/* Twin LED Headlight Cones Illuminating Asphalt Ahead */}
                <div
                  style={{
                    position: 'absolute',
                    top: '-65px',
                    left: '-28px',
                    width: '76px',
                    height: '70px',
                    background: 'radial-gradient(ellipse at 50% 100%, rgba(254, 240, 138, 0.85) 0%, rgba(250, 204, 21, 0.3) 45%, transparent 80%)',
                    clipPath: 'polygon(25% 100%, 75% 100%, 100% 0%, 0% 0%)',
                    pointerEvents: 'none',
                  }}
                />

                {/* Detailed Realistic Sports Car Vehicle */}
                <div
                  style={{
                    position: 'relative',
                    width: '20px',
                    height: '38px',
                    borderRadius: '6px',
                    background: 'linear-gradient(180deg, #38bdf8 0%, #1e40af 50%, #0f172a 100%)',
                    border: '1.5px solid #ffffff',
                    boxShadow: '0 4px 14px rgba(0, 0, 0, 0.9), 0 0 16px rgba(56, 189, 248, 0.5)',
                  }}
                >
                  {/* Front Windshield */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '7px',
                      left: '2px',
                      right: '2px',
                      height: '7px',
                      borderRadius: '2px',
                      background: 'linear-gradient(180deg, #0284c7 0%, #0369a1 100%)',
                      border: '1px solid rgba(255, 255, 255, 0.4)',
                    }}
                  />
                  {/* Roof */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '15px',
                      left: '3px',
                      right: '3px',
                      height: '10px',
                      borderRadius: '2px',
                      background: '#0f172a',
                    }}
                  />
                  {/* Rear Window */}
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '5px',
                      left: '2px',
                      right: '2px',
                      height: '5px',
                      borderRadius: '1px',
                      background: '#0284c7',
                      opacity: 0.8,
                    }}
                  />
                  {/* Front White LED Headlights */}
                  <div style={{ position: 'absolute', top: '-1px', left: '1px', width: '4px', height: '2px', borderRadius: '1px', background: '#fef08a', boxShadow: '0 0 6px #facc15' }} />
                  <div style={{ position: 'absolute', top: '-1px', right: '1px', width: '4px', height: '2px', borderRadius: '1px', background: '#fef08a', boxShadow: '0 0 6px #facc15' }} />
                  {/* Rear Red Neon Taillights */}
                  <div style={{ position: 'absolute', bottom: '-1px', left: '1px', width: '4px', height: '2px', borderRadius: '1px', background: '#ef4444', boxShadow: '0 0 6px #ef4444' }} />
                  <div style={{ position: 'absolute', bottom: '-1px', right: '1px', width: '4px', height: '2px', borderRadius: '1px', background: '#ef4444', boxShadow: '0 0 6px #ef4444' }} />
                  {/* 4 Rubber Tires */}
                  <div style={{ position: 'absolute', top: '5px', left: '-3px', width: '2.5px', height: '7px', borderRadius: '1px', background: '#020617' }} />
                  <div style={{ position: 'absolute', top: '5px', right: '-3px', width: '2.5px', height: '7px', borderRadius: '1px', background: '#020617' }} />
                  <div style={{ position: 'absolute', bottom: '6px', left: '-3px', width: '2.5px', height: '7px', borderRadius: '1px', background: '#020617' }} />
                  <div style={{ position: 'absolute', bottom: '6px', right: '-3px', width: '2.5px', height: '7px', borderRadius: '1px', background: '#020617' }} />
                </div>
              </div>

              {/* ========================================================== */}
              {/* THE 8 COURSE MILESTONE CARDS (CLEAN & CLUTTER-FREE)       */}
              {/* ========================================================== */}
              {ROADMAP_STAGES.slice(0, 8).map((stage) => {
                const Icon = stage.icon;
                const isActive = stage.number === activeMilestoneNum;
                const isComplete = isStageComplete(stage.id);
                const currentProgress = getStagePct(stage.id, stage.defaultProgress);
                const liveInfo = liveStageProgress[stage.id];

                return (
                  <div
                    key={`card-${stage.id}`}
                    onClick={() => {
                      setActiveMilestoneNum(stage.number);
                      setSelectedStage(stage);
                    }}
                    style={{
                      position: 'absolute',
                      left: `${stage.cardX}px`,
                      top: `${stage.cardY}px`,
                      width: `${stage.cardWidth}px`,
                      background: isActive
                        ? 'linear-gradient(145deg, rgba(20, 30, 52, 0.96) 0%, rgba(10, 16, 28, 0.98) 100%)'
                        : 'linear-gradient(145deg, rgba(14, 21, 38, 0.88) 0%, rgba(8, 12, 22, 0.92) 100%)',
                      border: isActive ? `2px solid ${stage.color}` : '1px solid rgba(148, 163, 184, 0.2)',
                      borderRadius: 'var(--radius-md)',
                      padding: '0.85rem 1rem',
                      boxShadow: isActive
                        ? `0 10px 25px -5px ${stage.glowColor}`
                        : '0 6px 18px -4px rgba(0, 0, 0, 0.5)',
                      cursor: 'pointer',
                      zIndex: 10,
                      backdropFilter: 'blur(8px)',
                      transition: 'all 0.2s ease',
                      boxSizing: 'border-box',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = stage.color;
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = isActive ? stage.color : 'rgba(148, 163, 184, 0.2)';
                      e.currentTarget.style.transform = 'none';
                    }}
                  >
                    {/* Top Row: Milestone / Stage Pill & Status */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                      <span
                        style={{
                          fontSize: '0.68rem',
                          fontWeight: 800,
                          color: stage.color,
                          background: `${stage.color}15`,
                          padding: '0.12rem 0.45rem',
                          borderRadius: '4px',
                          border: `1px solid ${stage.color}40`,
                        }}
                      >
                        Stage {stage.number}
                      </span>

                      <span
                        style={{
                          fontSize: '0.66rem',
                          fontWeight: 800,
                          padding: '0.1rem 0.4rem',
                          borderRadius: 'var(--radius-xs)',
                          background: isComplete
                            ? 'rgba(34, 197, 94, 0.2)'
                            : currentProgress > 0
                            ? 'rgba(56, 189, 248, 0.2)'
                            : stage.status === 'live'
                            ? 'rgba(148, 163, 184, 0.15)'
                            : 'rgba(168, 85, 247, 0.12)',
                          color: isComplete
                            ? '#4ade80'
                            : currentProgress > 0
                            ? '#38bdf8'
                            : stage.status === 'live'
                            ? '#94a3b8'
                            : '#c084fc',
                        }}
                      >
                        {isComplete
                          ? '✓ COMPLETED'
                          : currentProgress > 0
                          ? '◐ IN PROGRESS'
                          : stage.status === 'live'
                          ? '○ NOT STARTED'
                          : 'UPCOMING'}
                      </span>
                    </div>

                    {/* Course Title with Icon */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                      <div
                        style={{
                          width: '26px',
                          height: '26px',
                          borderRadius: '6px',
                          background: `linear-gradient(135deg, ${stage.color} 0%, #0f172a 100%)`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#fff',
                          boxShadow: `0 2px 6px ${stage.glowColor}`,
                          flexShrink: 0,
                        }}
                      >
                        <Icon size={14} />
                      </div>
                      <h3 style={{ fontSize: '0.95rem', fontWeight: 900, color: '#ffffff', margin: 0, lineHeight: 1.2 }}>
                        {stage.title}
                      </h3>
                    </div>

                    <p style={{ fontSize: '0.74rem', color: '#94a3b8', margin: '0 0 0.5rem 0', lineHeight: 1.35 }}>
                      {stage.subtitle}
                    </p>

                    {/* Progress Bar */}
                    <div style={{ marginBottom: '0.45rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', marginBottom: '0.15rem' }}>
                        <span style={{ color: '#cbd5e1', fontWeight: 600 }}>Mastery</span>
                        <span style={{ color: stage.color, fontWeight: 800 }}>{currentProgress}%</span>
                      </div>
                      <div style={{ width: '100%', height: '4px', borderRadius: '999px', background: 'rgba(255, 255, 255, 0.1)' }}>
                        <div style={{ width: `${currentProgress}%`, height: '100%', background: stage.color, borderRadius: '999px' }} />
                      </div>
                    </div>

                    {/* Lessons Count & Simulator Action */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                      <span>
                        {liveInfo
                          ? `${liveInfo.completedCount} / ${liveInfo.totalCount} concepts`
                          : `${stage.lessonsCount} lessons &bull; ${stage.labsCount} labs`}
                      </span>

                      {stage.status === 'live' ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStageAction(stage);
                          }}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                            background: 'transparent',
                            border: 'none',
                            color: stage.color,
                            fontWeight: 800,
                            cursor: 'pointer',
                            fontSize: '0.72rem',
                            padding: 0,
                          }}
                        >
                          <span>{currentProgress > 0 && currentProgress < 100 ? 'Continue' : isComplete ? 'Review' : 'Launch'}</span>
                          <ArrowRight size={11} />
                        </button>
                      ) : (
                        <span style={{ color: '#a855f7', fontWeight: 600 }}>{stage.duration}</span>
                      )}
                    </div>

                    {/* Curator Note with Annotation Arrow */}
                    <div
                      style={{
                        marginTop: '0.5rem',
                        paddingTop: '0.4rem',
                        borderTop: '1px solid rgba(148, 163, 184, 0.1)',
                        fontSize: '0.68rem',
                        color: '#cbd5e1',
                        fontStyle: 'italic',
                        lineHeight: 1.3,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                      }}
                    >
                      <span style={{ color: stage.color, fontSize: '0.8rem', fontStyle: 'normal' }}>↳</span>
                      <span>{stage.curatorNote}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ================================================================ */}
            {/* BOTTOM JOURNEY PROGRESS DOCK (MATCHING DESIGN)                   */}
            {/* ================================================================ */}
            <div
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1.25rem',
                padding: '1.15rem 1.75rem',
                borderRadius: 'var(--radius-lg)',
                background: 'linear-gradient(180deg, rgba(20, 27, 45, 0.9) 0%, rgba(10, 15, 28, 0.96) 100%)',
                border: '1px solid rgba(148, 163, 184, 0.16)',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)',
                boxSizing: 'border-box',
              }}
            >
              {/* Stat 1: 8 Stages */}
              <div
                onClick={() => setViewMode('syllabus')}
                style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}
                title="Click to view full syllabus"
              >
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: 'rgba(234, 179, 8, 0.15)',
                    border: '1px solid rgba(234, 179, 8, 0.35)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#facc15',
                  }}
                >
                  <Trophy size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#ffffff' }}>8 Stages</div>
                  <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>Structured learning</div>
                </div>
              </div>

              {/* Stat 2: 100+ Labs */}
              <div
                onClick={() => {
                  setActiveLessonConcept(null);
                  setMode('learn');
                }}
                style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}
                title="Click to explore interactive labs"
              >
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: 'rgba(56, 189, 248, 0.15)',
                    border: '1px solid rgba(56, 189, 248, 0.35)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#38bdf8',
                  }}
                >
                  <Target size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#ffffff' }}>100+</div>
                  <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>Hands-on labs</div>
                </div>
              </div>

              {/* Stat 3: Real Projects */}
              <div
                onClick={() => {
                  handleStageAction(ROADMAP_STAGES[2]); // DockForge
                }}
                style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}
                title="Click to explore industry projects in DockForge"
              >
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: 'rgba(16, 185, 129, 0.15)',
                    border: '1px solid rgba(16, 185, 129, 0.35)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#34d399',
                  }}
                >
                  <Briefcase size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#ffffff' }}>Real Projects</div>
                  <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>Build practical skills</div>
                </div>
              </div>

              {/* Stat 4: Track Progress */}
              <div
                onClick={() => {
                  toggleStageCompleted(currentActiveStage.id);
                }}
                style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}
                title="Click to toggle completion on active milestone"
              >
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: 'rgba(168, 85, 247, 0.15)',
                    border: '1px solid rgba(168, 85, 247, 0.35)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#c084fc',
                  }}
                >
                  <TrendingUp size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#ffffff' }}>Track Progress</div>
                  <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>{completedCount}/8 completed</div>
                </div>
              </div>

              {/* Progress Bar & Continue Learning Button */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem', fontSize: '0.78rem' }}>
                    <span style={{ color: '#cbd5e1', fontWeight: 700 }}>Your Journey</span>
                    <span style={{ color: '#38bdf8', fontWeight: 800 }}>{journeyProgressPct}% Complete</span>
                  </div>
                  <div style={{ width: '130px', height: '6px', borderRadius: '999px', background: 'rgba(255, 255, 255, 0.1)', overflow: 'hidden' }}>
                    <div
                      style={{
                        width: `${journeyProgressPct}%`,
                        height: '100%',
                        background: 'linear-gradient(90deg, #38bdf8, #2563eb)',
                        borderRadius: '999px',
                        transition: 'width 0.3s ease',
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                  <button
                    onClick={() => {
                      handleStageAction(currentActiveStage);
                    }}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.65rem 1.35rem',
                      borderRadius: 'var(--radius-sm)',
                      background: 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)',
                      color: '#ffffff',
                      border: 'none',
                      fontSize: '0.88rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      boxShadow: '0 4px 14px rgba(37, 99, 235, 0.4)',
                    }}
                  >
                    <span>
                      {liveStageProgress[currentActiveStage.id]?.nextTitle
                        ? `Continue: ${liveStageProgress[currentActiveStage.id].nextTitle}`
                        : 'Continue Learning'}
                    </span>
                    <ArrowRight size={15} />
                  </button>
                  <span style={{ fontSize: '0.68rem', color: '#94a3b8', textAlign: 'center' }}>
                    A better career is a few milestones away.
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================ */}
        {/* VIEW MODE 2: DEEP STAGE SYLLABUS                                 */}
        {/* ================================================================ */}
        {viewMode === 'syllabus' && (
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.35rem 0.85rem',
                  borderRadius: 'var(--radius-full)',
                  background: 'rgba(234, 179, 8, 0.12)',
                  border: '1px solid rgba(234, 179, 8, 0.3)',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  color: '#facc15',
                  width: 'fit-content',
                }}
              >
                <Compass size={14} color="#facc15" />
                <span>Interactive DevOps &amp; Cloud-Native Architecture Roadmap</span>
              </div>

              <h2 style={{ fontSize: '1.65rem', fontWeight: 800, color: '#ffffff', margin: '0 0 0.25rem 0', letterSpacing: '-0.02em' }}>
                Complete 9-Stage Curriculum &amp; SRE Breakdown Clinics
              </h2>
              <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', margin: 0, maxWidth: '800px', lineHeight: 1.6 }}>
                Inspect the deep architectural competencies, disaster-recovery labs, and certification readiness for every step along your engineering journey.
              </p>
            </div>

            {/* Stages Cards List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
              {filteredStages.map((stage) => {
                const Icon = stage.icon;
                const isLive = stage.status === 'live';
                const isVoted = votedStages[stage.id];

                return (
                  <div
                    key={stage.id}
                    style={{
                      width: '100%',
                      background: 'linear-gradient(145deg, rgba(20, 27, 45, 0.7) 0%, rgba(10, 15, 26, 0.85) 100%)',
                      border: isLive ? `1px solid ${stage.color}50` : '1px solid rgba(148, 163, 184, 0.16)',
                      borderRadius: 'var(--radius-md)',
                      padding: '1.5rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '1.15rem',
                      position: 'relative',
                      overflow: 'hidden',
                      boxShadow: isLive ? `0 10px 30px -10px ${stage.glowColor}` : '0 8px 20px -8px rgba(0, 0, 0, 0.4)',
                      boxSizing: 'border-box',
                    }}
                  >
                    {/* Header Row */}
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div
                          style={{
                            width: '44px',
                            height: '44px',
                            borderRadius: '12px',
                            background: `linear-gradient(135deg, ${stage.color} 0%, rgba(15, 23, 42, 0.9) 100%)`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#fff',
                            boxShadow: `0 4px 14px ${stage.glowColor}`,
                            flexShrink: 0,
                          }}
                        >
                          <Icon size={20} />
                        </div>

                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap', marginBottom: '0.2rem' }}>
                            <span
                              style={{
                                fontSize: '0.78rem',
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
                            <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#f1f5f9' }}>
                              {stage.platformName}
                            </span>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                              &bull; {stage.techStack}
                            </span>
                          </div>

                          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', margin: 0 }}>
                            {stage.title}
                          </h3>
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
                              borderRadius: 'var(--radius-full)',
                              background: 'rgba(34, 197, 94, 0.12)',
                              border: '1px solid rgba(34, 197, 94, 0.35)',
                              fontSize: '0.78rem',
                              fontWeight: 800,
                              color: '#4ade80',
                            }}
                          >
                            <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 6px #22c55e' }} />
                            <span>LIVE &amp; INTERACTIVE</span>
                          </div>
                        ) : (
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.45rem',
                              padding: '0.35rem 0.85rem',
                              borderRadius: 'var(--radius-full)',
                              background: 'rgba(168, 85, 247, 0.1)',
                              border: '1px solid rgba(168, 85, 247, 0.25)',
                              fontSize: '0.78rem',
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

                    <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                      {stage.description}
                    </p>

                    {/* Competencies */}
                    <div
                      style={{
                        background: 'rgba(15, 23, 42, 0.5)',
                        border: '1px solid rgba(148, 163, 184, 0.1)',
                        borderRadius: 'var(--radius-md)',
                        padding: '1rem 1.25rem',
                      }}
                    >
                      <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#e2e8f0', marginBottom: '0.65rem' }}>
                        Core Architectural Competencies &amp; Skills
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.75rem' }}>
                        {stage.keyMilestones.map((milestone, mIdx) => (
                          <div key={mIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', fontSize: '0.86rem', color: '#cbd5e1', lineHeight: 1.55 }}>
                            <CheckCircle2 size={16} color={isLive ? stage.color : '#64748b'} style={{ marginTop: '2px', flexShrink: 0 }} />
                            <span>{milestone}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Footer Actions */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', borderTop: '1px solid rgba(148, 163, 184, 0.1)', paddingTop: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)' }}>Prepares For:</span>
                        {stage.certifications.map((cert, cIdx) => (
                          <span
                            key={cIdx}
                            style={{
                              fontSize: '0.78rem',
                              fontWeight: 700,
                              padding: '0.25rem 0.65rem',
                              borderRadius: 'var(--radius-full)',
                              background: 'rgba(255, 255, 255, 0.05)',
                              border: '1px solid rgba(255, 255, 255, 0.12)',
                              color: '#e2e8f0',
                            }}
                          >
                            {cert}
                          </span>
                        ))}
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        {isLive ? (
                          <button
                            onClick={() => handleStageAction(stage)}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.5rem',
                              padding: '0.55rem 1.15rem',
                              borderRadius: 'var(--radius-sm)',
                              background: `linear-gradient(135deg, ${stage.color} 0%, rgba(15, 23, 42, 0.9) 100%)`,
                              color: '#ffffff',
                              border: `1px solid ${stage.color}`,
                              fontSize: '0.84rem',
                              fontWeight: 800,
                              cursor: 'pointer',
                              boxShadow: `0 4px 14px ${stage.glowColor}`,
                            }}
                          >
                            <span>Launch Simulator</span>
                            <ArrowRight size={14} />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleStageAction(stage)}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.45rem',
                              padding: '0.55rem 1.15rem',
                              borderRadius: 'var(--radius-sm)',
                              background: isVoted ? 'rgba(34, 197, 94, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                              border: isVoted ? '1px solid #22c55e' : '1px solid rgba(255, 255, 255, 0.15)',
                              color: isVoted ? '#4ade80' : '#cbd5e1',
                              fontSize: '0.82rem',
                              fontWeight: 700,
                              cursor: 'pointer',
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
          </div>
        )}

        {/* ================================================================ */}
        {/* INTERACTIVE STAGE DETAIL MODAL                                   */}
        {/* ================================================================ */}
        {selectedStage && (
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-stage-title"
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(3, 7, 18, 0.82)',
              backdropFilter: 'blur(8px)',
              zIndex: 1000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1.5rem',
            }}
            onClick={() => setSelectedStage(null)}
          >
            <div
              style={{
                width: '100%',
                maxWidth: '640px',
                background: 'linear-gradient(160deg, #131d33 0%, #0a0f1d 100%)',
                border: `1px solid ${selectedStage.color}80`,
                borderRadius: 'var(--radius-lg)',
                padding: '2rem',
                position: 'relative',
                boxShadow: `0 20px 60px -15px ${selectedStage.glowColor}, 0 0 30px rgba(0,0,0,0.8)`,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedStage(null)}
                aria-label="Close stage details"
                style={{
                  position: 'absolute',
                  top: '1.25rem',
                  right: '1.25rem',
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#94a3b8',
                  cursor: 'pointer',
                }}
              >
                <X size={16} />
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: selectedStage.color, fontFamily: 'var(--font-mono)' }}>
                  {selectedStage.exitCode} &bull; {selectedStage.mileMarker}
                </span>
                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>&bull;</span>
                <span style={{ fontSize: '0.84rem', color: '#cbd5e1', fontWeight: 600 }}>{selectedStage.platformName}</span>
              </div>

              <h2 id="modal-stage-title" style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff', margin: '0 0 0.75rem 0' }}>
                {selectedStage.title}
              </h2>

              <p style={{ fontSize: '0.92rem', color: '#94a3b8', lineHeight: 1.6, margin: '0 0 1.25rem 0' }}>
                {selectedStage.description}
              </p>

              {/* Terminal Environment Preview */}
              <div
                style={{
                  background: '#050811',
                  border: '1px solid #1a233a',
                  borderRadius: '8px',
                  padding: '0.85rem 1rem',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.8rem',
                  color: '#e2e8f0',
                  marginBottom: '1.25rem',
                }}
              >
                <div style={{ color: '#64748b', fontSize: '0.7rem', marginBottom: '0.4rem' }}>// Interactive Terminal Preview</div>
                {selectedStage.number === 1 && (
                  <div>
                    <span style={{ color: '#4ade80' }}>developer@forge:~$</span> git commit -m &quot;feat: initial architecture&quot;
                    <div style={{ color: '#94a3b8', marginTop: '0.2rem' }}>[main (root-commit) 4a8f9c2] feat: initial architecture</div>
                  </div>
                )}
                {selectedStage.number === 2 && (
                  <div>
                    <span style={{ color: '#4ade80' }}>runner@actions:~$</span> gh workflow run deploy-matrix.yml --ref main
                    <div style={{ color: '#a855f7', marginTop: '0.2rem' }}>✓ Triggered workflow run 10842 (Matrix compilation)</div>
                  </div>
                )}
                {selectedStage.number === 3 && (
                  <div>
                    <span style={{ color: '#4ade80' }}>docker@dockforge:~$</span> docker buildx build -t app:v1 .
                    <div style={{ color: '#38bdf8', marginTop: '0.2rem' }}>[+] Building 1.2s (14/14) FINISHED distroless export</div>
                  </div>
                )}
                {selectedStage.number === 4 && (
                  <div>
                    <span style={{ color: '#4ade80' }}>sre@podforge:~$</span> kubectl get pods -n production
                    <div style={{ color: '#60a5fa', marginTop: '0.2rem' }}>web-service-7f9b8c-x9k2   1/1   Running   0   42m</div>
                  </div>
                )}
                {selectedStage.number >= 5 && (
                  <div>
                    <span style={{ color: '#4ade80' }}>cloud@infra:~$</span> {selectedStage.techStack.split('•')[0]} status
                    <div style={{ color: '#f59e0b', marginTop: '0.2rem' }}>Interactive lab environment initialized</div>
                  </div>
                )}
              </div>

              {/* Modal Actions */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
                <button
                  onClick={() => toggleStageCompleted(selectedStage.id)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    padding: '0.55rem 0.95rem',
                    borderRadius: 'var(--radius-sm)',
                    background: isStageComplete(selectedStage.id) ? 'rgba(34, 197, 94, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                    border: isStageComplete(selectedStage.id) ? '1px solid #22c55e' : '1px solid rgba(148, 163, 184, 0.3)',
                    color: isStageComplete(selectedStage.id) ? '#4ade80' : '#cbd5e1',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  <Check size={14} />
                  <span>{isStageComplete(selectedStage.id) ? 'Marked Completed' : 'Mark as Completed'}</span>
                </button>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <button
                    onClick={() => setSelectedStage(null)}
                    style={{
                      padding: '0.6rem 1.15rem',
                      borderRadius: 'var(--radius-sm)',
                      background: 'transparent',
                      border: '1px solid rgba(148, 163, 184, 0.3)',
                      color: '#cbd5e1',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      handleStageAction(selectedStage);
                      setSelectedStage(null);
                    }}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.65rem 1.4rem',
                      borderRadius: 'var(--radius-sm)',
                      background: `linear-gradient(135deg, ${selectedStage.color} 0%, #1e293b 100%)`,
                      border: `1px solid ${selectedStage.color}`,
                      color: '#ffffff',
                      fontSize: '0.88rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      boxShadow: `0 4px 16px ${selectedStage.glowColor}`,
                    }}
                  >
                    <span>{selectedStage.status === 'live' ? 'Launch Simulator' : 'Vote for Priority Access'}</span>
                    <ArrowRight size={15} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================ */}
        {/* SUMMIT GOAL CAREER RADAR MODAL                                   */}
        {/* ================================================================ */}
        {showSummitModal && (
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="summit-modal-title"
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(3, 7, 18, 0.85)',
              backdropFilter: 'blur(8px)',
              zIndex: 1000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1.5rem',
            }}
            onClick={() => setShowSummitModal(false)}
          >
            <div
              style={{
                width: '100%',
                maxWidth: '620px',
                background: 'linear-gradient(160deg, #131d33 0%, #0a0f1d 100%)',
                border: '2px solid #f59e0b',
                borderRadius: 'var(--radius-lg)',
                padding: '2rem',
                position: 'relative',
                boxShadow: '0 25px 60px -15px rgba(245, 158, 11, 0.4)',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowSummitModal(false)}
                aria-label="Close summit career modal"
                style={{
                  position: 'absolute',
                  top: '1.25rem',
                  right: '1.25rem',
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#94a3b8',
                  cursor: 'pointer',
                }}
              >
                <X size={16} />
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', color: '#f59e0b', marginBottom: '0.4rem', fontWeight: 800 }}>
                <Trophy size={20} />
                <span>HIGHWAY TERMINAL &bull; POINT N</span>
              </div>

              <h2 id="summit-modal-title" style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff', margin: '0 0 0.75rem 0' }}>
                DevOps &amp; Cloud Platform Engineer
              </h2>

              <p style={{ fontSize: '0.92rem', color: '#94a3b8', lineHeight: 1.6, margin: '0 0 1.25rem 0' }}>
                Reaching the highway terminal means mastering the complete continuum: Git version control, CI/CD automation, container runtimes, Kubernetes clusters, Infrastructure as Code, and production SRE observability.
              </p>

              {/* Skills Radar Breakdown */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <div style={{ background: 'rgba(255, 255, 255, 0.04)', borderRadius: '8px', padding: '0.85rem' }}>
                  <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Average US Compensation</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#38bdf8', marginTop: '0.2rem' }}>$165,000 / yr</div>
                </div>
                <div style={{ background: 'rgba(255, 255, 255, 0.04)', borderRadius: '8px', padding: '0.85rem' }}>
                  <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Target Certifications</div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#4ade80', marginTop: '0.2rem' }}>CKA • DCA • AWS SAA</div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button
                  onClick={() => {
                    setShowSummitModal(false);
                    setActiveLessonConcept(null);
                    setMode('learn');
                  }}
                  style={{
                    padding: '0.65rem 1.4rem',
                    borderRadius: 'var(--radius-sm)',
                    background: 'linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)',
                    border: 'none',
                    color: '#ffffff',
                    fontSize: '0.88rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                  }}
                >
                  Start at Milestone 01 (CommitForge)
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================ */}
        {/* OVERVIEW VIDEO / ARCHITECTURE MODAL                              */}
        {/* ================================================================ */}
        {showOverviewModal && (
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="overview-modal-title"
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(3, 7, 18, 0.85)',
              backdropFilter: 'blur(8px)',
              zIndex: 1000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1.5rem',
            }}
            onClick={() => setShowOverviewModal(false)}
          >
            <div
              style={{
                width: '100%',
                maxWidth: '650px',
                background: 'linear-gradient(160deg, #131d33 0%, #0a0f1d 100%)',
                border: '1px solid rgba(56, 189, 248, 0.4)',
                borderRadius: 'var(--radius-lg)',
                padding: '2rem',
                position: 'relative',
                boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.8)',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowOverviewModal(false)}
                aria-label="Close overview"
                style={{
                  position: 'absolute',
                  top: '1.25rem',
                  right: '1.25rem',
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#94a3b8',
                  cursor: 'pointer',
                }}
              >
                <X size={16} />
              </button>

              <h2 id="overview-modal-title" style={{ fontSize: '1.45rem', fontWeight: 800, color: '#ffffff', margin: '0 0 0.75rem 0' }}>
                DevOps Highway Architecture &amp; Pedagogy
              </h2>
              <p style={{ fontSize: '0.92rem', color: '#94a3b8', lineHeight: 1.6, margin: '0 0 1.25rem 0' }}>
                The Forge Suite highway bridges low-level system internals with high-level multi-cloud orchestration. Starting from in-browser Git forensics and GitHub Actions CI/CD automation, you advance into Docker container engines, Kubernetes self-healing topologies, Terraform Infrastructure as Code, Prometheus telemetry, and zero-trust security.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.85rem', marginBottom: '1.5rem' }}>
                <div style={{ background: 'rgba(255, 255, 255, 0.04)', borderRadius: '10px', padding: '0.85rem' }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#38bdf8' }}>100% In-Browser Simulation</div>
                  <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '0.2rem' }}>Zero cloud accounts, credit cards, or local daemons required.</div>
                </div>
                <div style={{ background: 'rgba(255, 255, 255, 0.04)', borderRadius: '10px', padding: '0.85rem' }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#4ade80' }}>Disaster-Recovery First</div>
                  <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '0.2rem' }}>CrashLoopBackOffs, OOMKilled pods, corrupted indexes &amp; merge wars.</div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  onClick={() => setShowOverviewModal(false)}
                  style={{
                    padding: '0.65rem 1.4rem',
                    borderRadius: 'var(--radius-sm)',
                    background: 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)',
                    border: 'none',
                    color: '#ffffff',
                    fontSize: '0.88rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                  }}
                >
                  Drive Highway
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
