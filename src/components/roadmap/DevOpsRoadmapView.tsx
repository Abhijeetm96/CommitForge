import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { useProgress } from '../../progress';
import {
  GitBranch,
  Container,
  Boxes,
  Cloud,
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
  Trophy,
  TrendingUp,
  X,
  ListOrdered,
  Check,
  Code2,
  Settings,
  Monitor,
  FlaskConical,
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
  calloutText: string;
  // Coordinates on the 1100x2000 Scenic Highway Canvas
  roadX: number;
  roadY: number;
  headingAngle: number;
  rampD: string;
  cardX: number;
  cardY: number;
  cardWidth: number;
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
    calloutText: 'Build your foundation with Git, branching, collaboration and more.',
    roadX: 660,
    roadY: 160,
    headingAngle: 0,
    rampD: '',
    cardX: 720,
    cardY: 104,
    cardWidth: 360,
    side: 'right',
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
    icon: Code2,
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
    calloutText: 'Automate your workflows with CI/CD, testing and deployment pipelines.',
    roadX: 440,
    roadY: 380,
    headingAngle: 0,
    rampD: '',
    cardX: 20,
    cardY: 324,
    cardWidth: 360,
    side: 'left',
  },
  {
    id: 'stage-docker',
    number: 3,
    exitCode: 'EXIT 03',
    mileMarker: 'MILE 40',
    title: 'DockForge',
    subtitle: 'Containerization & Docker',
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
    calloutText: 'Package, ship and run applications using Docker.',
    roadX: 660,
    roadY: 600,
    headingAngle: 0,
    rampD: '',
    cardX: 720,
    cardY: 544,
    cardWidth: 360,
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
    color: '#06b6d4',
    glowColor: 'rgba(6, 182, 212, 0.45)',
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
    calloutText: 'Orchestrate containers at scale with Kubernetes.',
    roadX: 440,
    roadY: 820,
    headingAngle: 0,
    rampD: '',
    cardX: 20,
    cardY: 764,
    cardWidth: 360,
    side: 'left',
  },
  {
    id: 'stage-ansible',
    number: 5,
    exitCode: 'EXIT 05',
    mileMarker: 'MILE 70',
    title: 'Terraform & Ansible',
    subtitle: 'Infrastructure as Code & Configuration',
    category: 'cloud-native',
    status: 'coming-soon',
    platformName: 'Terraform & Ansible Suite',
    techStack: 'Terraform • HCL • Ansible • State Locking • AWS Provider',
    duration: 'Target Q4 2026',
    color: '#f59e0b',
    glowColor: 'rgba(245, 158, 11, 0.45)',
    icon: Settings,
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
    projectsCount: 3,
    defaultProgress: 0,
    curatorNote: 'Automate and manage infrastructure with code.',
    calloutText: 'Automate and manage infrastructure with Terraform and Ansible.',
    roadX: 660,
    roadY: 1040,
    headingAngle: 0,
    rampD: '',
    cardX: 720,
    cardY: 984,
    cardWidth: 360,
    side: 'right',
  },
  {
    id: 'stage-observability',
    number: 6,
    exitCode: 'EXIT 06',
    mileMarker: 'MILE 85',
    title: 'Observability',
    subtitle: 'Monitoring, Logging & SRE Practices',
    category: 'sre',
    status: 'coming-soon',
    platformName: 'Prometheus & Grafana Suite',
    techStack: 'Prometheus • PromQL • Grafana • OpenTelemetry • Loki',
    duration: 'Target Q1 2027',
    color: '#ec4899',
    glowColor: 'rgba(236, 72, 153, 0.45)',
    icon: Monitor,
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
    calloutText: 'Gain visibility with Prometheus, Grafana and SRE best practices.',
    roadX: 440,
    roadY: 1260,
    headingAngle: 0,
    rampD: '',
    cardX: 20,
    cardY: 1204,
    cardWidth: 360,
    side: 'left',
  },
  {
    id: 'stage-security',
    number: 7,
    exitCode: 'EXIT 07',
    mileMarker: 'MILE 95',
    title: 'DevSecOps',
    subtitle: 'Security, Secrets Management & Zero-Trust',
    category: 'sre',
    status: 'coming-soon',
    platformName: 'HashiCorp Vault & Trivy',
    techStack: 'HashiCorp Vault • Trivy • Cosign • SBOM • OPA',
    duration: 'Target Q2 2027',
    color: '#10b981',
    glowColor: 'rgba(168, 185, 129, 0.45)',
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
    calloutText: 'Build secure systems with DevSecOps practices.',
    roadX: 660,
    roadY: 1480,
    headingAngle: 0,
    rampD: '',
    cardX: 720,
    cardY: 1424,
    cardWidth: 360,
    side: 'right',
  },
  {
    id: 'stage-linux',
    number: 8,
    exitCode: 'EXIT 08',
    mileMarker: 'MILE 100',
    title: 'Cloud Platforms',
    subtitle: 'AWS, Azure & GCP',
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
    calloutText: 'Deploy real applications on cloud platforms.',
    roadX: 440,
    roadY: 1700,
    headingAngle: 0,
    rampD: '',
    cardX: 20,
    cardY: 1644,
    cardWidth: 360,
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
    calloutText: 'Dive beneath user space into the Linux kernel and eBPF.',
    roadX: 550,
    roadY: 1900,
    headingAngle: 0,
    rampD: '',
    cardX: 710,
    cardY: 1850,
    cardWidth: 370,
    side: 'right',
  },
];

export const DevOpsRoadmapView: React.FC = () => {
  const { setMode, setActiveLessonConcept } = useApp();
  const [viewMode, setViewMode] = useState<'highway' | 'syllabus'>('highway');
  const [activeCategory, _setActiveCategory] = useState<RoadmapTrack>('all');
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
    const live = liveStageProgress[stageId];
    if (live && live.completedCount > 0) {
      return live.pct;
    }
    if (userCustomCompleted[stageId]) {
      return 100;
    }
    return defaultPct;
  };

  const isStageComplete = (stageId: string) => {
    const live = liveStageProgress[stageId];
    if (live && live.completedCount > 0) {
      return live.pct === 100;
    }
    return Boolean(userCustomCompleted[stageId]);
  };

  // Auto-tour driving animation
  const [isAutoTouring, _setIsAutoTouring] = useState<boolean>(false);

  useEffect(() => {
    if (!isAutoTouring) return;
    const interval = setInterval(() => {
      setActiveMilestoneNum((prev) => (prev >= 8 ? 1 : prev + 1));
    }, 3200);
    return () => clearInterval(interval);
  }, [isAutoTouring]);

  const liveStagesCompleted = ROADMAP_STAGES.slice(0, 8).filter((s) => isStageComplete(s.id)).length;
  const completedCount = Math.max(1, liveStagesCompleted);
  const totalCompletedLessons = Math.max(
    3,
    commitStats.completedLessons + dockerStats.completedLessons + kubeStats.completedLessons
  );
  const calculatedPct = Math.round(
    ROADMAP_STAGES.slice(0, 8).reduce((acc, s) => acc + getStagePct(s.id, s.defaultProgress), 0) / 8
  );
  const journeyProgressPct = Math.max(15, calculatedPct);

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
        {/* HERO BANNER: FROM ZERO TO DEVOPS ENGINEER (MATCHING DESIGN)     */}
        {/* ================================================================ */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1.5rem',
            padding: '1rem 0 0 0',
          }}
        >
          <div style={{ flex: '1 1 600px', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <span
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 900,
                  letterSpacing: '0.08em',
                  color: '#38bdf8',
                  textTransform: 'uppercase',
                }}
              >
                YOUR JOURNEY TO A MODERN DEVOPS CAREER
              </span>
            </div>

            <h1
              style={{
                fontSize: 'clamp(2rem, 3.2vw, 2.75rem)',
                fontWeight: 900,
                letterSpacing: '-0.025em',
                margin: 0,
                color: '#ffffff',
                lineHeight: 1.15,
              }}
            >
              The{' '}
              <span
                style={{
                  background: 'linear-gradient(135deg, #38bdf8 0%, #818cf8 55%, #c084fc 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                DevOps &amp; Cloud
              </span>{' '}
              Engineering Roadmap
            </h1>

            <p style={{ fontSize: '0.92rem', color: '#94a3b8', lineHeight: 1.55, margin: 0, maxWidth: '660px' }}>
              Follow a structured, hands-on path from fundamentals to production-ready skills. Each milestone unlocks real tools, interactive labs, and industry projects.
            </p>

            {/* 4 FEATURE PILLS MATCHING REFERENCE SCREENSHOT */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginTop: '0.6rem', flexWrap: 'wrap' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.55rem',
                  padding: '0.42rem 0.85rem',
                  borderRadius: '10px',
                  background: 'rgba(15, 23, 42, 0.75)',
                  border: '1px solid rgba(56, 189, 248, 0.28)',
                }}
              >
                <div style={{ color: '#38bdf8', display: 'flex', alignItems: 'center' }}>
                  <BookOpen size={16} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.76rem', fontWeight: 800, color: '#ffffff' }}>Learn by Doing</span>
                  <span style={{ fontSize: '0.66rem', color: '#94a3b8' }}>Interactive simulators</span>
                </div>
              </div>

              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.55rem',
                  padding: '0.42rem 0.85rem',
                  borderRadius: '10px',
                  background: 'rgba(15, 23, 42, 0.75)',
                  border: '1px solid rgba(168, 85, 247, 0.28)',
                }}
              >
                <div style={{ color: '#c084fc', display: 'flex', alignItems: 'center' }}>
                  <Boxes size={16} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.76rem', fontWeight: 800, color: '#ffffff' }}>Real-world Projects</span>
                  <span style={{ fontSize: '0.66rem', color: '#94a3b8' }}>Build practical skills</span>
                </div>
              </div>

              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.55rem',
                  padding: '0.42rem 0.85rem',
                  borderRadius: '10px',
                  background: 'rgba(15, 23, 42, 0.75)',
                  border: '1px solid rgba(52, 211, 153, 0.28)',
                }}
              >
                <div style={{ color: '#34d399', display: 'flex', alignItems: 'center' }}>
                  <TrendingUp size={16} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.76rem', fontWeight: 800, color: '#ffffff' }}>Track Progress</span>
                  <span style={{ fontSize: '0.66rem', color: '#94a3b8' }}>See your growth</span>
                </div>
              </div>

              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.55rem',
                  padding: '0.42rem 0.85rem',
                  borderRadius: '10px',
                  background: 'rgba(15, 23, 42, 0.75)',
                  border: '1px solid rgba(250, 204, 21, 0.28)',
                }}
              >
                <div style={{ color: '#facc15', display: 'flex', alignItems: 'center' }}>
                  <Award size={16} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.76rem', fontWeight: 800, color: '#ffffff' }}>Career Ready</span>
                  <span style={{ fontSize: '0.66rem', color: '#94a3b8' }}>Gain in-demand skills</span>
                </div>
              </div>
            </div>
          </div>

          {/* Top-Right Badge: From Zero to DevOps Engineer */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '0.9rem 1.35rem',
                borderRadius: '14px',
                background: 'linear-gradient(145deg, rgba(20, 29, 50, 0.6) 0%, rgba(11, 17, 32, 0.85) 100%)',
                border: '1px solid rgba(56, 189, 248, 0.25)',
                boxShadow: '0 8px 24px -5px rgba(0, 0, 0, 0.45)',
              }}
            >
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  background: 'rgba(56, 189, 248, 0.12)',
                  border: '1px solid rgba(56, 189, 248, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#38bdf8',
                  boxShadow: '0 0 16px rgba(56, 189, 248, 0.3)',
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

            {/* Subtle Syllabus Toggle Switcher */}
            <button
              onClick={() => setViewMode(viewMode === 'highway' ? 'syllabus' : 'highway')}
              style={{
                background: 'none',
                border: 'none',
                color: '#64748b',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.2rem 0.5rem',
                transition: 'color 0.15s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#38bdf8')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#64748b')}
              title="Toggle Syllabus View"
            >
              <ListOrdered size={13} />
              <span>{viewMode === 'highway' ? 'Switch to Deep Syllabus' : 'Switch to Scenic Highway'}</span>
            </button>
          </div>
        </div>

        {/* ================================================================ */}
        {/* VIEW MODE 1: SERPENTINE HIGHWAY ROADMAP (PIXEL-PERFECT TO MOCKUP)*/}
        {/* ================================================================ */}
        {viewMode === 'highway' && (
          <div style={{ position: 'relative', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {/* The Serpentine Road Canvas Container */}
            <div
              style={{
                position: 'relative',
                width: '100%',
                maxWidth: '1100px',
                height: '2020px',
                margin: '1.5rem auto 3rem auto',
              }}
            >
              {/* SVG LAYER: ASPHALT S-CURVE, WHITE DASH DIVIDERS, INDICATOR LINES, FINISH LINE */}
              <svg
                viewBox="0 0 1100 2000"
                preserveAspectRatio="xMidYMin meet"
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  pointerEvents: 'none',
                  zIndex: 2,
                }}
              >
                <defs>
                  {/* Subtle road surface glow filter */}
                  <filter id="roadGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="0" stdDeviation="8" floodColor="rgba(56, 189, 248, 0.25)" />
                  </filter>
                </defs>

                {/* Vertical start connector from START badge into road top */}
                <line x1="550" y1="20" x2="550" y2="40" stroke="#14b8a6" strokeWidth="2.5" strokeLinecap="round" />

                {/* 1. Outer Road Ambient Glow */}
                <path
                  d="M 550,40 C 550,100 660,100 660,160 C 660,270 440,270 440,380 C 440,490 660,490 660,600 C 660,710 440,710 440,820 C 440,930 660,930 660,1040 C 660,1150 440,1150 440,1260 C 440,1370 660,1370 660,1480 C 660,1590 440,1590 440,1700 C 440,1780 550,1780 550,1850"
                  fill="none"
                  stroke="rgba(56, 189, 248, 0.16)"
                  strokeWidth="76"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* 2. Outer Curb Border (Slate 800) */}
                <path
                  d="M 550,40 C 550,100 660,100 660,160 C 660,270 440,270 440,380 C 440,490 660,490 660,600 C 660,710 440,710 440,820 C 440,930 660,930 660,1040 C 660,1150 440,1150 440,1260 C 440,1370 660,1370 660,1480 C 660,1590 440,1590 440,1700 C 440,1780 550,1780 550,1850"
                  fill="none"
                  stroke="#222f3e"
                  strokeWidth="68"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* 3. White Road Edge Shoulder Lines */}
                <path
                  d="M 550,40 C 550,100 660,100 660,160 C 660,270 440,270 440,380 C 440,490 660,490 660,600 C 660,710 440,710 440,820 C 440,930 660,930 660,1040 C 660,1150 440,1150 440,1260 C 440,1370 660,1370 660,1480 C 660,1590 440,1590 440,1700 C 440,1780 550,1780 550,1850"
                  fill="none"
                  stroke="#475569"
                  strokeWidth="60"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* 4. Deep Dark Charcoal Asphalt Surface */}
                <path
                  d="M 550,40 C 550,100 660,100 660,160 C 660,270 440,270 440,380 C 440,490 660,490 660,600 C 660,710 440,710 440,820 C 440,930 660,930 660,1040 C 660,1150 440,1150 440,1260 C 440,1370 660,1370 660,1480 C 660,1590 440,1590 440,1700 C 440,1780 550,1780 550,1850"
                  fill="none"
                  stroke="#101726"
                  strokeWidth="54"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* 5. Center White Dashed Lane Divider with Subtle Flow Animation */}
                <path
                  d="M 550,40 C 550,100 660,100 660,160 C 660,270 440,270 440,380 C 440,490 660,490 660,600 C 660,710 440,710 440,820 C 440,930 660,930 660,1040 C 660,1150 440,1150 440,1260 C 440,1370 660,1370 660,1480 C 660,1590 440,1590 440,1700 C 440,1780 550,1780 550,1850"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="2.5"
                  strokeDasharray="10 14"
                  strokeLinecap="round"
                  opacity="0.85"
                >
                  <animate attributeName="stroke-dashoffset" values="0;-48" dur="2.5s" repeatCount="indefinite" />
                </path>

                {/* 6. Callout Connecting Lines with Colored Indicator Pins */}
                {ROADMAP_STAGES.slice(0, 8).map((stage) => {
                  const isOdd = stage.number % 2 === 1;
                  const lineX1 = isOdd ? 440 : stage.roadX;
                  const lineX2 = isOdd ? stage.roadX : 640;
                  const pinX = isOdd ? 440 : 640;

                  return (
                    <g key={`connector-${stage.id}`}>
                      <line
                        x1={lineX1}
                        y1={stage.roadY}
                        x2={lineX2}
                        y2={stage.roadY}
                        stroke={stage.color}
                        strokeWidth="1.5"
                        strokeDasharray="4 4"
                        strokeOpacity="0.85"
                      />
                      <circle cx={pinX} cy={stage.roadY} r="3.5" fill={stage.color} />
                    </g>
                  );
                })}

                {/* 7. Checkered Finish Line at road end (Y = 1842 to 1858) */}
                <g transform="translate(520, 1842)">
                  <rect x="0" y="0" width="10" height="8" fill="#ffffff" />
                  <rect x="10" y="0" width="10" height="8" fill="#000000" />
                  <rect x="20" y="0" width="10" height="8" fill="#ffffff" />
                  <rect x="30" y="0" width="10" height="8" fill="#000000" />
                  <rect x="40" y="0" width="10" height="8" fill="#ffffff" />
                  <rect x="50" y="0" width="10" height="8" fill="#000000" />
                  <rect x="0" y="8" width="10" height="8" fill="#000000" />
                  <rect x="10" y="8" width="10" height="8" fill="#ffffff" />
                  <rect x="20" y="8" width="10" height="8" fill="#000000" />
                  <rect x="30" y="8" width="10" height="8" fill="#ffffff" />
                  <rect x="40" y="8" width="10" height="8" fill="#000000" />
                  <rect x="50" y="8" width="10" height="8" fill="#ffffff" />
                  <rect x="0" y="0" width="60" height="16" fill="none" stroke="#ffffff" strokeWidth="1" />
                </g>
              </svg>

              {/* TOP START BADGE */}
              <div
                style={{
                  position: 'absolute',
                  left: '550px',
                  top: '12px',
                  transform: 'translate(-50%, -50%)',
                  zIndex: 10,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.3rem 0.95rem',
                  borderRadius: '9999px',
                  background: 'rgba(13, 148, 136, 0.2)',
                  border: '1.5px solid #14b8a6',
                  color: '#2dd4bf',
                  fontSize: '0.78rem',
                  fontWeight: 900,
                  letterSpacing: '0.08em',
                  boxShadow: '0 0 18px rgba(20, 184, 166, 0.45)',
                }}
              >
                START
              </div>

              {/* THE 8 STAGES: MILESTONE NODES, CARDS, AND CALLOUT SPEECH BUBBLES */}
              {ROADMAP_STAGES.slice(0, 8).map((stage) => {
                const Icon = stage.icon;
                const isOdd = stage.number % 2 === 1;
                const currentProgress = getStagePct(stage.id, stage.defaultProgress);

                return (
                  <React.Fragment key={stage.id}>
                    {/* 1. Circular Road Milestone Node */}
                    <div
                      onClick={() => handleStageAction(stage)}
                      title={`Stage ${stage.number}: ${stage.title}`}
                      style={{
                        position: 'absolute',
                        left: `${stage.roadX}px`,
                        top: `${stage.roadY}px`,
                        transform: 'translate(-50%, -50%)',
                        width: '42px',
                        height: '42px',
                        borderRadius: '50%',
                        background: `linear-gradient(135deg, ${stage.color} 0%, #1e1b4b 100%)`,
                        border: '3px solid #ffffff',
                        boxShadow: `0 0 22px ${stage.color}, 0 4px 12px rgba(0, 0, 0, 0.8)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#ffffff',
                        fontSize: '1.05rem',
                        fontWeight: 900,
                        zIndex: 8,
                        cursor: 'pointer',
                        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1.12)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1)';
                      }}
                    >
                      {stage.number}
                    </div>

                    {/* 2. Stage Course Card */}
                    <div
                      onClick={() => handleStageAction(stage)}
                      style={{
                        position: 'absolute',
                        left: isOdd ? '720px' : '20px',
                        top: `${stage.roadY - 56}px`,
                        width: '360px',
                        background: 'rgba(11, 17, 32, 0.88)',
                        border: '1px solid rgba(56, 189, 248, 0.18)',
                        borderRadius: '14px',
                        padding: '1rem 1.15rem',
                        boxShadow: '0 8px 24px -4px rgba(0, 0, 0, 0.65)',
                        backdropFilter: 'blur(10px)',
                        cursor: 'pointer',
                        zIndex: 6,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.9rem',
                        boxSizing: 'border-box',
                        transition: 'all 0.2s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = stage.color;
                        e.currentTarget.style.boxShadow = `0 10px 30px -4px ${stage.glowColor}`;
                        e.currentTarget.style.transform = 'translateY(-2px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.18)';
                        e.currentTarget.style.boxShadow = '0 8px 24px -4px rgba(0, 0, 0, 0.65)';
                        e.currentTarget.style.transform = 'none';
                      }}
                    >
                      {/* Left Icon Badge */}
                      <div
                        style={{
                          width: '44px',
                          height: '44px',
                          borderRadius: '10px',
                          background: `linear-gradient(135deg, ${stage.color} 0%, rgba(15, 23, 42, 0.95) 100%)`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#ffffff',
                          flexShrink: 0,
                          boxShadow: `0 4px 12px ${stage.glowColor}`,
                        }}
                      >
                        <Icon size={22} />
                      </div>

                      {/* Center Info */}
                      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                        {/* Title & Stage Pill */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
                          <h3 style={{ fontSize: '1rem', fontWeight: 900, color: '#ffffff', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {stage.title}
                          </h3>
                          <span
                            style={{
                              fontSize: '0.7rem',
                              fontWeight: 700,
                              color: stage.color,
                              background: `${stage.color}15`,
                              border: `1px solid ${stage.color}45`,
                              borderRadius: '9999px',
                              padding: '0.12rem 0.5rem',
                              whiteSpace: 'nowrap',
                              flexShrink: 0,
                            }}
                          >
                            Stage {stage.number}
                          </span>
                        </div>

                        {/* Subtitle */}
                        <div style={{ fontSize: '0.75rem', color: '#94a3b8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {stage.subtitle}
                        </div>

                        {/* Progress Bar with Cyan Glow & Percentage */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginTop: '0.35rem' }}>
                          <div
                            style={{
                              flex: 1,
                              height: '5px',
                              borderRadius: '9999px',
                              background: 'rgba(255, 255, 255, 0.1)',
                              overflow: 'hidden',
                            }}
                          >
                            <div
                              style={{
                                width: `${currentProgress}%`,
                                height: '100%',
                                background: 'linear-gradient(90deg, #38bdf8 0%, #2563eb 100%)',
                                boxShadow: currentProgress > 0 ? '0 0 8px rgba(56, 189, 248, 0.7)' : 'none',
                                borderRadius: '9999px',
                                transition: 'width 0.4s ease',
                              }}
                            />
                          </div>
                          <span style={{ fontSize: '0.78rem', fontWeight: 800, color: currentProgress > 0 ? '#38bdf8' : '#94a3b8', minWidth: '32px', textAlign: 'right' }}>
                            {currentProgress}%
                          </span>
                        </div>

                        {/* Stats Row */}
                        <div style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'flex', gap: '0.4rem', marginTop: '0.15rem' }}>
                          <span>{stage.lessonsCount} lessons</span>
                          <span>|</span>
                          <span>{stage.labsCount} labs</span>
                          <span>|</span>
                          <span>{stage.projectsCount} projects</span>
                        </div>
                      </div>

                      {/* Right Chevron */}
                      <ChevronRight size={18} color="#64748b" style={{ flexShrink: 0 }} />
                    </div>

                    {/* 3. Annotation Callout Speech Bubble (Opposite side) */}
                    <div
                      style={{
                        position: 'absolute',
                        left: isOdd ? '190px' : '640px',
                        top: `${stage.roadY - 30}px`,
                        width: '240px',
                        background: 'rgba(15, 23, 42, 0.88)',
                        border: '1px solid rgba(56, 189, 248, 0.22)',
                        borderRadius: '10px',
                        padding: '0.65rem 0.95rem',
                        boxShadow: '0 6px 20px rgba(0, 0, 0, 0.55)',
                        backdropFilter: 'blur(8px)',
                        fontSize: '0.76rem',
                        color: '#cbd5e1',
                        lineHeight: 1.42,
                        zIndex: 5,
                        boxSizing: 'border-box',
                      }}
                    >
                      {stage.calloutText}
                    </div>
                  </React.Fragment>
                );
              })}

              {/* BOTTOM DEVOPS ENGINEER TROPHY BADGE */}
              <div
                style={{
                  position: 'absolute',
                  left: '550px',
                  top: '1905px',
                  transform: 'translate(-50%, -50%)',
                  zIndex: 10,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.55rem 1.6rem',
                  borderRadius: '9999px',
                  background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                  border: '1.5px solid #a855f7',
                  color: '#ffffff',
                  fontSize: '0.85rem',
                  fontWeight: 900,
                  letterSpacing: '0.06em',
                  boxShadow: '0 0 25px rgba(168, 85, 247, 0.55), 0 6px 18px rgba(0, 0, 0, 0.75)',
                  cursor: 'pointer',
                }}
                onClick={() => setShowSummitModal(true)}
              >
                <span>🏆</span>
                <span>DEVOPS ENGINEER</span>
              </div>

              {/* FLOATING HUD CARD: "YOUR JOURNEY" (BOTTOM RIGHT OF ROAD) */}
              <div
                style={{
                  position: 'absolute',
                  top: '1740px',
                  left: '720px',
                  width: '360px',
                  background: 'rgba(10, 16, 30, 0.94)',
                  border: '1px solid rgba(56, 189, 248, 0.25)',
                  borderRadius: '14px',
                  padding: '0.95rem 1.15rem',
                  boxShadow: '0 12px 36px rgba(0, 0, 0, 0.75), 0 0 20px rgba(56, 189, 248, 0.12)',
                  backdropFilter: 'blur(12px)',
                  zIndex: 10,
                  boxSizing: 'border-box',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.92rem', fontWeight: 800, color: '#ffffff' }}>Your Journey</span>
                  <span style={{ fontSize: '0.84rem', fontWeight: 800, color: '#38bdf8' }}>
                    {journeyProgressPct}% Complete
                  </span>
                </div>

                <div
                  style={{
                    width: '100%',
                    height: '6px',
                    borderRadius: '9999px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    margin: '0.65rem 0 0.95rem 0',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      width: `${journeyProgressPct}%`,
                      height: '100%',
                      background: 'linear-gradient(90deg, #38bdf8 0%, #2563eb 100%)',
                      boxShadow: '0 0 10px rgba(56, 189, 248, 0.6)',
                      borderRadius: '9999px',
                      transition: 'width 0.4s ease',
                    }}
                  />
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: '0.35rem',
                    textAlign: 'center',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.2rem', color: '#38bdf8' }}>
                      <BookOpen size={16} />
                    </div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#ffffff' }}>{completedCount} / 8</div>
                    <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>Stages</div>
                  </div>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.2rem', color: '#38bdf8' }}>
                      <ListOrdered size={16} />
                    </div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#ffffff' }}>
                      {totalCompletedLessons} / 100
                    </div>
                    <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>Lessons</div>
                  </div>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.2rem', color: '#c084fc' }}>
                      <FlaskConical size={16} />
                    </div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#ffffff' }}>0 / 40</div>
                    <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>Labs</div>
                  </div>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.2rem', color: '#38bdf8' }}>
                      <Boxes size={16} />
                    </div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#ffffff' }}>0 / 15</div>
                    <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>Projects</div>
                  </div>
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
