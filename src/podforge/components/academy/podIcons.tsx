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
  LucideIcon,
} from 'lucide-react';

/**
 * Returns a unique, topic-specific Lucide icon for every one of the 56 Kubernetes concepts.
 */
export function getConceptIcon(conceptId: string): LucideIcon {
  switch (conceptId) {
    // -------------------------------------------------------------------------
    // Chapter 01: Container Fundamentals & OCI Runtimes
    // -------------------------------------------------------------------------
    case 'c-containers-vs-vms':
      return Container;
    case 'c-oci-image-layers':
      return Layers;
    case 'c-container-runtimes-cri':
      return Cpu;
    case 'c-why-orchestration':
      return Server;

    // -------------------------------------------------------------------------
    // Chapter 02: Kubernetes Control Plane & Node Architecture
    // -------------------------------------------------------------------------
    case 'c-control-plane-anatomy':
      return ServerCog;
    case 'c-worker-node-anatomy':
      return HardDrive;
    case 'c-reconciliation-loops':
      return RefreshCw;
    case 'c-mastering-kubectl':
      return Terminal;

    // -------------------------------------------------------------------------
    // Chapter 03: Pods — The Atomic Unit of Kubernetes
    // -------------------------------------------------------------------------
    case 'c-pod-anatomy-lifecycle':
      return Box;
    case 'c-multi-container-patterns':
      return Boxes;
    case 'c-ephemeral-containers-debug':
      return Bug;
    case 'c-pdb-graceful-shutdown':
      return ShieldAlert;

    // -------------------------------------------------------------------------
    // Chapter 04: Workloads & Stateless Controllers
    // -------------------------------------------------------------------------
    case 'c-replicasets-selectors':
      return Copy;
    case 'c-deployments-rolling-updates':
      return Repeat;
    case 'c-daemonsets-node-agents':
      return Radio;
    case 'c-jobs-and-cronjobs':
      return Clock;

    // -------------------------------------------------------------------------
    // Chapter 05: Stateful Workloads & Persistent Storage
    // -------------------------------------------------------------------------
    case 'c-volumes-emptydir-hostpath':
      return Folder;
    case 'c-pv-pvc-lifecycle':
      return HardDrive;
    case 'c-storageclasses-csi':
      return Database;
    case 'c-statefulsets-ordered-scaling':
      return ListOrdered;

    // -------------------------------------------------------------------------
    // Chapter 06: Configuration, Secrets & 12-Factor Apps
    // -------------------------------------------------------------------------
    case 'c-configmaps-env-files':
      return FileText;
    case 'c-secrets-security-vault':
      return Key;
    case 'c-downward-api':
      return Code2;

    // -------------------------------------------------------------------------
    // Chapter 07: Services, Networking & Ingress Routing
    // -------------------------------------------------------------------------
    case 'c-k8s-networking-model':
      return Network;
    case 'c-service-types-deepdive':
      return Share2;
    case 'c-coredns-discovery':
      return Globe;
    case 'c-ingress-controllers-tls':
      return DoorOpen;
    case 'c-gateway-api-modern':
      return GitFork;

    // -------------------------------------------------------------------------
    // Chapter 08: Scheduling, Placement & Resource Management
    // -------------------------------------------------------------------------
    case 'c-requests-limits-qos':
      return SlidersHorizontal;
    case 'c-node-affinity-anti-affinity':
      return Magnet;
    case 'c-taints-and-tolerations':
      return ShieldX;
    case 'c-pod-anti-affinity-topology':
      return Compass;
    case 'c-priorityclasses-preemption':
      return ArrowUpCircle;

    // -------------------------------------------------------------------------
    // Chapter 09: Autoscaling & Cluster Elasticity
    // -------------------------------------------------------------------------
    case 'c-hpa-v2-metrics':
      return TrendingUp;
    case 'c-vpa-right-sizing':
      return Maximize2;
    case 'c-karpenter-cluster-autoscaler':
      return Zap;

    // -------------------------------------------------------------------------
    // Chapter 10: Security, Authentication & RBAC
    // -------------------------------------------------------------------------
    case 'c-auth-serviceaccounts':
      return UserCheck;
    case 'c-rbac-roles-bindings':
      return KeyRound;
    case 'c-security-contexts-hardening':
      return Lock;
    case 'c-pod-security-standards-pss':
      return FileCheck;

    // -------------------------------------------------------------------------
    // Chapter 11: Network Security & Microsegmentation
    // -------------------------------------------------------------------------
    case 'c-network-policies-microsegmentation':
      return Shield;
    case 'c-service-mesh-istio-cilium':
      return Workflow;

    // -------------------------------------------------------------------------
    // Chapter 12: Observability, Health Checks & Monitoring
    // -------------------------------------------------------------------------
    case 'c-health-probes-readiness-liveness':
      return HeartPulse;
    case 'c-cluster-logging-fluentd':
      return ScrollText;
    case 'c-prometheus-metrics-server':
      return BarChart3;

    // -------------------------------------------------------------------------
    // Chapter 13: Helm & Kubernetes Package Management
    // -------------------------------------------------------------------------
    case 'c-helm-charts-anatomy':
      return Anchor;
    case 'c-helm-templating-pipelines':
      return FileCode;
    case 'c-helm-lifecycle-releases':
      return RotateCcw;

    // -------------------------------------------------------------------------
    // Chapter 14: GitOps & Progressive Delivery
    // -------------------------------------------------------------------------
    case 'c-gitops-principles-argocd':
      return GitPullRequest;
    case 'c-progressive-delivery-canary':
      return Shuffle;

    // -------------------------------------------------------------------------
    // Chapter 15: Custom Resources & The Operator Pattern
    // -------------------------------------------------------------------------
    case 'c-crd-custom-resources':
      return FileJson;
    case 'c-operator-pattern-controllers':
      return Bot;

    // -------------------------------------------------------------------------
    // Chapter 16: Cluster Administration, Upgrades & Disaster Recovery
    // -------------------------------------------------------------------------
    case 'c-node-maintenance-cordon-drain':
      return Wrench;
    case 'c-etcd-backup-restore':
      return Database;
    case 'c-kubeadm-cluster-upgrades':
      return UploadCloud;
    case 'c-cluster-troubleshooting-triage':
      return Stethoscope;

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
      return Container;
    case 2:
      return ServerCog;
    case 3:
      return Box;
    case 4:
      return Layers;
    case 5:
      return HardDrive;
    case 6:
      return Key;
    case 7:
      return Network;
    case 8:
      return Sliders;
    case 9:
      return TrendingUp;
    case 10:
      return ShieldCheck;
    case 11:
      return Shield;
    case 12:
      return Activity;
    case 13:
      return Anchor;
    case 14:
      return GitPullRequest;
    case 15:
      return Bot;
    case 16:
      return Wrench;
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
  const IconComponent = getConceptIcon(conceptId);
  return <IconComponent size={size} color={color} className={className} />;
};
