import type { KubeConcept } from './types';

export interface VisualizerCapabilities {
  requiresVisualizer: boolean;
  supportsTopology: boolean;
  supportsFlowDiagram: boolean;
  supportsChaosSimulator: boolean;
  allowsPodCrash: boolean;
  allowsHpaSpike: boolean;
  allowsNodeDrain: boolean;
  allowsRollingUpdate: boolean;
  allowsScale: boolean;
  allowsApply: boolean;
}

/**
 * Concepts that are purely theoretical, comparisons, or local installation guides
 * do NOT require an interactive simulator or visualizer tab.
 */
const EXCLUDED_CONCEPT_IDS = new Set<string>([
  // Chapter 1: Foundations & Comparisons
  'c-k8s-overview',
  'c-k8s-declarative-vs-imperative',
  'c-k8s-managed-vs-self-managed',
  'c-k8s-why-use',
  'c-k8s-terminology',
  'c-k8s-alternatives',

  // Chapter 2: Introductory Container Theory
  'c-containers-what-are',
  'c-containers-vs-vms',
  'c-containers-images-registries',
  'c-containers-images',
  'c-containers-registries',
  'c-containers-networking-storage',
  'c-containers-why-k8s',

  // Chapter 3: Local Installation & Setup Walkthroughs
  'c-setup-minikube',
  'c-setup-kind',
  'c-setup-cloud',
  'c-setup-kubectl',
  'c-setup-first-cluster',
  'c-setup-env-choice',
  'c-setup-managed-providers',
  'c-setup-local-cluster',

  // Purely conceptual/introductory in later chapters
  'c-cpu-and-memory',
  'c-sec-fundamentals',
  'c-cluster-ops-should-manage',
]);

/**
 * Checks if a concept requires an interactive simulator or visualizer tab.
 */
export function conceptRequiresVisualizer(concept: KubeConcept): boolean {
  if (!concept || !concept.id) return false;

  // 1. Explicitly check if excluded
  if (EXCLUDED_CONCEPT_IDS.has(concept.id)) {
    return false;
  }

  const chapterNum = parseInt(concept.number.split('.')[0], 10);

  // Chapter 1 & 2 & 3 are introductory foundations unless specific runtime mechanics
  if (chapterNum === 1 || chapterNum === 2 || chapterNum === 3) {
    // Only 1.3 (Control Plane) and 2.4 (Container Runtime CRI) have architectural flows
    if (concept.id === 'c-k8s-control-plane' || concept.id === 'c-containers-runtime') {
      return true;
    }
    return false;
  }

  // Workloads, Networking, Config, Storage, Security, Observability, Autoscaling, Scheduling
  // All have real declarative objects or active cluster runtime behaviors
  return true;
}

/**
 * Returns granular interactive capabilities for the visualizer tab of a given concept.
 */
export function getVisualizerCapabilities(concept: KubeConcept): VisualizerCapabilities {
  if (!concept || !concept.id) {
    return {
      requiresVisualizer: false,
      supportsTopology: false,
      supportsFlowDiagram: false,
      supportsChaosSimulator: false,
      allowsPodCrash: false,
      allowsHpaSpike: false,
      allowsNodeDrain: false,
      allowsRollingUpdate: false,
      allowsScale: false,
      allowsApply: false,
    };
  }

  const requires = conceptRequiresVisualizer(concept);
  if (!requires) {
    return {
      requiresVisualizer: false,
      supportsTopology: false,
      supportsFlowDiagram: false,
      supportsChaosSimulator: false,
      allowsPodCrash: false,
      allowsHpaSpike: false,
      allowsNodeDrain: false,
      allowsRollingUpdate: false,
      allowsScale: false,
      allowsApply: false,
    };
  }

  const cid = concept.id.toLowerCase();
  const ctitle = concept.title.toLowerCase();
  const yaml = concept.yamlSnippet || '';

  // 1. Pod Crash & Self-Healing: strictly for Pods, ReplicaSets, Health Probes, and Evictions
  const allowsPodCrash =
    cid.includes('c-pod') ||
    cid.includes('c-replicasets') ||
    cid.includes('c-health-probes') ||
    ctitle.includes('pod') ||
    ctitle.includes('replicaset') ||
    ctitle.includes('health probe') ||
    ctitle.includes('self-healing');

  // 2. HPA Traffic Surge: strictly for Autoscaling concepts
  const allowsHpaSpike =
    cid.includes('c-hpa') ||
    cid.includes('c-autoscale') ||
    cid.includes('c-autoscaling') ||
    ctitle.includes('horizontal pod autoscaler') ||
    ctitle.includes('autoscaling') ||
    ctitle.includes('cluster autoscaling');

  // 3. Node Drain & Eviction: strictly for Worker Nodes, Scheduling, Taints, Evictions
  const allowsNodeDrain =
    cid.includes('c-node-maintenance') ||
    cid.includes('c-node-drain') ||
    cid.includes('c-pod-evictions') ||
    cid.includes('c-taints') ||
    cid.includes('c-worker-nodes') ||
    ctitle.includes('taints') ||
    ctitle.includes('eviction') ||
    ctitle.includes('drain') ||
    ctitle.includes('worker nodes');

  // 4. Rolling Update: strictly for Deployments, Rolling Updates, Rollbacks, Canary, Blue-Green
  const allowsRollingUpdate =
    cid.includes('c-deployments') ||
    cid.includes('c-rolling-updates') ||
    cid.includes('c-rollbacks') ||
    cid.includes('c-canary') ||
    cid.includes('c-blue-green') ||
    ctitle.includes('deployment') ||
    ctitle.includes('rolling update') ||
    ctitle.includes('canary') ||
    ctitle.includes('blue-green');

  const supportsChaosSimulator =
    allowsPodCrash || allowsHpaSpike || allowsNodeDrain || allowsRollingUpdate;

  // Scale trigger is only shown if the resource is scalable
  const allowsScale =
    /replicas:\s*\d+/.test(yaml) ||
    ctitle.includes('deployment') ||
    ctitle.includes('replicaset') ||
    ctitle.includes('statefulset');

  // Apply manifest: only shown if there is a real, deployable K8s manifest
  const allowsApply =
    yaml.includes('apiVersion:') &&
    yaml.includes('kind:') &&
    !yaml.includes('Not Recommended') &&
    yaml.trim().length > 30;

  // Topology canvas is relevant to workloads, networking, and cluster infrastructure
  const supportsTopology =
    allowsScale ||
    allowsPodCrash ||
    allowsNodeDrain ||
    cid.includes('c-net') ||
    cid.includes('c-service') ||
    cid.includes('c-ingress') ||
    cid.includes('c-deploy') ||
    cid.includes('c-pod');

  return {
    requiresVisualizer: true,
    supportsTopology,
    supportsFlowDiagram: true,
    supportsChaosSimulator,
    allowsPodCrash,
    allowsHpaSpike,
    allowsNodeDrain,
    allowsRollingUpdate,
    allowsScale,
    allowsApply,
  };
}
