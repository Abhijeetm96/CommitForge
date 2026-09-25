import React from 'react';
import {
  Container,
  Layers,
  Cpu,
  Server,
  HardDrive,
  RotateCcw,
  Terminal,
  Box,
  Boxes,
  Bug,
  ShieldAlert,
  Copy,
  Clock,
  Folder,
  Database,
  FileText,
  Key,
  Code2,
  Network,
  Share2,
  Globe,
  Route,
  GitFork,
  Sliders,
  Tag,
  ArrowUpCircle,
  TrendingUp,
  Maximize2,
  Zap,
  UserCheck,
  ShieldCheck,
  Lock,
  FileCheck,
  Shield,
  Workflow,
  HeartPulse,
  BarChart3,
  Anchor,
  FileCode,
  GitPullRequest,
  Shuffle,
  Bot,
  Wrench,
  AlertTriangle,
  Activity,
  ServerCog,
  RefreshCw,
  Repeat,
  Radio,
  ListOrdered,
  DoorOpen,
  SlidersHorizontal,
  Magnet,
  ShieldX,
  Compass,
  KeyRound,
  FileJson,
  UploadCloud,
  Stethoscope,
  ScrollText,
  CheckCircle2,
  HelpCircle,
  BookOpen,
  LucideIcon,
} from 'lucide-react';

/**
 * Returns a unique, topic-specific Lucide icon for every one of the 71 curated Kubernetes concepts.
 */
export function getConceptIcon(conceptId: string): LucideIcon {
  switch (conceptId) {
    // -------------------------------------------------------------------------
    // Chapter 01: Introduction to Kubernetes
    // -------------------------------------------------------------------------
    case 'c-k8s-overview':
      return Globe;
    case 'c-k8s-why-use':
      return Zap;
    case 'c-k8s-key-concepts':
      return BookOpen;
    case 'c-k8s-alternatives':
      return GitFork;

    // -------------------------------------------------------------------------
    // Chapter 02: Containers
    // -------------------------------------------------------------------------
    case 'c-containers-what-are':
      return Container;
    case 'c-containers-vs-vms':
      return Layers;
    case 'c-container-images':
      return FileCode;
    case 'c-container-registries':
      return UploadCloud;
    case 'c-why-k8s-uses-containers':
      return Cpu;

    // -------------------------------------------------------------------------
    // Chapter 03: Setting Up Kubernetes
    // -------------------------------------------------------------------------
    case 'c-choosing-k8s-environment':
      return Compass;
    case 'c-managed-k8s-providers':
      return Server;
    case 'c-installing-local-cluster':
      return Terminal;
    case 'c-your-first-cluster':
      return Boxes;

    // -------------------------------------------------------------------------
    // Chapter 04: Running Applications
    // -------------------------------------------------------------------------
    case 'c-pods-running-apps':
      return Box;
    case 'c-replicasets-desired-state':
      return Copy;
    case 'c-deployments-workloads':
      return Layers;
    case 'c-statefulsets-persistent-apps':
      return Database;
    case 'c-jobs-batch-processing':
      return CheckCircle2;

    // -------------------------------------------------------------------------
    // Chapter 05: Services & Networking
    // -------------------------------------------------------------------------
    case 'c-why-networking-needed':
      return Network;
    case 'c-k8s-services-clusterip':
      return Share2;
    case 'c-external-access-ingress':
      return Globe;
    case 'c-load-balancing-endpoints':
      return Route;
    case 'c-pod-to-pod-networking':
      return Radio;

    // -------------------------------------------------------------------------
    // Chapter 06: Configuration Management
    // -------------------------------------------------------------------------
    case 'c-configuration-in-k8s':
      return Sliders;
    case 'c-configmaps-configuration':
      return FileText;
    case 'c-secrets-configuration':
      return Key;

    // -------------------------------------------------------------------------
    // Chapter 07: Resource Management
    // -------------------------------------------------------------------------
    case 'c-cpu-and-memory':
      return Cpu;
    case 'c-resource-requests':
      return ArrowUpCircle;
    case 'c-resource-limits':
      return ShieldAlert;
    case 'c-namespace-quotas':
      return SlidersHorizontal;
    case 'c-monitoring-resource-usage':
      return BarChart3;

    // -------------------------------------------------------------------------
    // Chapter 08: Security
    // -------------------------------------------------------------------------
    case 'c-k8s-security-fundamentals':
      return Shield;
    case 'c-rbac-authorization':
      return UserCheck;
    case 'c-network-security-policies':
      return ShieldCheck;
    case 'c-container-security-hardening':
      return Lock;
    case 'c-pod-security-standards':
      return FileCheck;

    // -------------------------------------------------------------------------
    // Chapter 09: Monitoring & Logging
    // -------------------------------------------------------------------------
    case 'c-monitoring-logs':
      return ScrollText;
    case 'c-monitoring-metrics':
      return BarChart3;
    case 'c-monitoring-traces':
      return Workflow;
    case 'c-monitoring-resource-health':
      return HeartPulse;
    case 'c-observability-engines':
      return Activity;

    // -------------------------------------------------------------------------
    // Chapter 10: Autoscaling
    // -------------------------------------------------------------------------
    case 'c-why-autoscaling':
      return Zap;
    case 'c-horizontal-pod-autoscaler':
      return TrendingUp;
    case 'c-vertical-pod-autoscaler':
      return Maximize2;
    case 'c-cluster-autoscaling':
      return Server;

    // -------------------------------------------------------------------------
    // Chapter 11: Scheduling
    // -------------------------------------------------------------------------
    case 'c-k8s-scheduler-basics':
      return Clock;
    case 'c-taints-and-tolerations':
      return Magnet;
    case 'c-topology-spread-constraints':
      return Shuffle;
    case 'c-pod-priorities-preemption':
      return AlertTriangle;
    case 'c-pod-evictions-graceful':
      return DoorOpen;

    // -------------------------------------------------------------------------
    // Chapter 12: Storage & Volumes
    // -------------------------------------------------------------------------
    case 'c-k8s-storage-fundamentals':
      return HardDrive;
    case 'c-k8s-volumes-emptydir-hostpath':
      return Folder;
    case 'c-persistent-storage-pv-pvc':
      return Database;
    case 'c-csi-drivers-storage':
      return Cpu;
    case 'c-stateful-applications-storage':
      return Database;

    // -------------------------------------------------------------------------
    // Chapter 13: Deployment Patterns
    // -------------------------------------------------------------------------
    case 'c-cicd-integration':
      return Workflow;
    case 'c-gitops-workflow':
      return GitPullRequest;
    case 'c-helm-charts-packaging':
      return Anchor;
    case 'c-canary-deployments':
      return Activity;
    case 'c-blue-green-deployments':
      return Shuffle;
    case 'c-rolling-updates-strategy':
      return Repeat;
    case 'c-rollbacks-recovery':
      return RotateCcw;

    // -------------------------------------------------------------------------
    // Chapter 14: Advanced Kubernetes
    // -------------------------------------------------------------------------
    case 'c-k8s-controllers-custom':
      return RefreshCw;
    case 'c-custom-scheduling':
      return Clock;
    case 'c-custom-resources-crds':
      return FileJson;
    case 'c-k8s-extensions-apis':
      return Code2;

    // -------------------------------------------------------------------------
    // Chapter 15: Cluster Operations
    // -------------------------------------------------------------------------
    case 'c-should-you-manage-cluster':
      return HelpCircle;
    case 'c-control-plane-management':
      return ServerCog;
    case 'c-worker-nodes-lifecycle':
      return HardDrive;
    case 'c-multicluster-management':
      return Globe;
    case 'c-cluster-operations-admin':
      return Wrench;

    default:
      return Box;
  }
}

/**
 * Returns a distinct chapter category icon based on chapter number.
 */
export function getChapterIcon(chapterNumber: number): LucideIcon {
  switch (chapterNumber) {
    case 1:
      return Compass;
    case 2:
      return Container;
    case 3:
      return Terminal;
    case 4:
      return Boxes;
    case 5:
      return Network;
    case 6:
      return Sliders;
    case 7:
      return Cpu;
    case 8:
      return ShieldCheck;
    case 9:
      return Activity;
    case 10:
      return TrendingUp;
    case 11:
      return Clock;
    case 12:
      return HardDrive;
    case 13:
      return GitPullRequest;
    case 14:
      return Bot;
    case 15:
      return ServerCog;
    default:
      return Box;
  }
}

interface ConceptIconBadgeProps {
  conceptId: string;
  size?: number;
  color?: string;
  className?: string;
}

export const ConceptIconBadge: React.FC<ConceptIconBadgeProps> = ({
  conceptId,
  size = 18,
  color,
  className,
}) => {
  return React.createElement(getConceptIcon(conceptId), { size, color, className });
};
