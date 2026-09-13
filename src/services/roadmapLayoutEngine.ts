import ELK, { ElkNode, ElkExtendedEdge } from 'elkjs/lib/elk.bundled.js';
import {
  RoadmapNode,
  RoadmapEdge,
  NodeType,
  RAW_ROADMAP_NODES,
  RAW_ROADMAP_EDGES,
  validateRoadmapGraph,
} from '../data/roadmapGraphModel';

export interface PositionedNode {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  data: RoadmapNode;
}

export interface RoutedEdge {
  id: string;
  source: string;
  target: string;
  type: 'prerequisite' | 'contains' | 'related';
  priority?: number;
  pathD: string;
  startPoint: { x: number; y: number };
  endPoint: { x: number; y: number };
}

export interface GraphLayoutResult {
  nodes: PositionedNode[];
  edges: RoutedEdge[];
  bounds: {
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
    width: number;
    height: number;
  };
}

export type DetailLevel = 'categories' | 'topics' | 'all';

export interface LayoutOptions {
  detailLevel?: DetailLevel;
  collapsedNodeIds?: Set<string>;
}

// Consistent standardized dimensions (Section 16)
const NODE_DIMENSIONS: Record<NodeType, { width: number; height: number }> = {
  root: { width: 220, height: 60 },
  category: { width: 200, height: 54 },
  topic: { width: 160, height: 44 },
  subtopic: { width: 140, height: 38 },
};

// Singleton ELK instance
const elk = new ELK();

/**
 * Filter nodes and edges based on detail level and collapsed subgraphs
 */
export function filterVisibleGraph(
  nodes: RoadmapNode[],
  edges: RoadmapEdge[],
  options: LayoutOptions = {}
): { visibleNodes: RoadmapNode[]; visibleEdges: RoadmapEdge[] } {
  const { detailLevel = 'topics', collapsedNodeIds = new Set<string>() } = options;

  // 1. Determine allowed types
  const allowedTypes = new Set<NodeType>(['root', 'category']);
  if (detailLevel === 'topics' || detailLevel === 'all') {
    allowedTypes.add('topic');
  }
  if (detailLevel === 'all') {
    allowedTypes.add('subtopic');
  }

  // 2. Filter nodes based on type and collapsed ancestors
  const nodeMap = new Map(nodes.map((n) => [n.id, n]));
  const isAncestorCollapsed = (node: RoadmapNode): boolean => {
    let curr = node.parentId ? nodeMap.get(node.parentId) : undefined;
    while (curr) {
      if (collapsedNodeIds.has(curr.id)) return true;
      curr = curr.parentId ? nodeMap.get(curr.parentId) : undefined;
    }
    return false;
  };

  const visibleNodes = nodes.filter((n) => {
    // Check type allowance
    if (!allowedTypes.has(n.type)) return false;
    // Check if directly collapsed parent
    if (isAncestorCollapsed(n)) return false;
    return true;
  });

  const visibleNodeIds = new Set(visibleNodes.map((n) => n.id));

  // 3. Filter edges: both source and target must be visible
  const visibleEdges = edges.filter(
    (e) => visibleNodeIds.has(e.source) && visibleNodeIds.has(e.target)
  );

  return { visibleNodes, visibleEdges };
}

/**
 * Executes the ELK automatic layered graph layout algorithm
 */
export async function computeRoadmapLayout(
  allNodes: RoadmapNode[] = RAW_ROADMAP_NODES,
  allEdges: RoadmapEdge[] = RAW_ROADMAP_EDGES,
  options: LayoutOptions = {}
): Promise<GraphLayoutResult> {
  const { visibleNodes, visibleEdges } = filterVisibleGraph(allNodes, allEdges, options);

  // Construct ELK graph definition
  const elkChildren: ElkNode[] = visibleNodes.map((node) => {
    const dims = NODE_DIMENSIONS[node.type] || { width: 160, height: 44 };
    return {
      id: node.id,
      width: dims.width,
      height: dims.height,
      layoutOptions: {
        'elk.portConstraints': 'FIXED_SIDE',
      },
    };
  });

  const elkEdges: ElkExtendedEdge[] = visibleEdges.map((edge) => ({
    id: edge.id,
    sources: [edge.source],
    targets: [edge.target],
    layoutOptions: {
      'elk.layered.priority.direction': String(edge.priority || 1),
    },
  }));

  const elkGraph: ElkNode = {
    id: 'root-canvas',
    layoutOptions: {
      'elk.algorithm': 'layered',
      'elk.direction': 'DOWN',
      'elk.edgeRouting': 'ORTHOGONAL',
      'elk.layered.crossingMinimization.strategy': 'LAYER_SWEEP',
      'elk.layered.nodePlacement.strategy': 'BRANDES_KOEPF',
      'elk.spacing.nodeNode': '48',
      'elk.layered.spacing.nodeNodeBetweenLayers': '64',
      'elk.spacing.edgeNode': '28',
      'elk.spacing.edgeEdge': '20',
      'elk.padding': '[top=50,left=50,bottom=50,right=50]',
    },
    children: elkChildren,
    edges: elkEdges,
  };

  const layoutedGraph = await elk.layout(elkGraph);

  // Map nodes back with calculated positions
  const nodeMap = new Map(visibleNodes.map((n) => [n.id, n]));
  const positionedNodes: PositionedNode[] = [];
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  (layoutedGraph.children || []).forEach((c) => {
    const original = nodeMap.get(c.id);
    if (!original) return;

    const x = Math.round(c.x || 0);
    const y = Math.round(c.y || 0);
    const width = Math.round(c.width || 160);
    const height = Math.round(c.height || 44);

    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    maxX = Math.max(maxX, x + width);
    maxY = Math.max(maxY, y + height);

    positionedNodes.push({
      id: c.id,
      x,
      y,
      width,
      height,
      data: original,
    });
  });

  // Map edges with calculated orthogonal bend points
  const edgeMetaMap = new Map(visibleEdges.map((e) => [e.id, e]));
  const routedEdges: RoutedEdge[] = [];

  (layoutedGraph.edges || []).forEach((e) => {
    const meta = edgeMetaMap.get(e.id);
    if (!meta) return;

    const sections = (e as unknown as { sections?: Array<{
      startPoint: { x: number; y: number };
      endPoint: { x: number; y: number };
      bendPoints?: Array<{ x: number; y: number }>;
    }> }).sections;

    if (!sections || sections.length === 0) return;

    const sec = sections[0];
    let pathD = `M ${Math.round(sec.startPoint.x)} ${Math.round(sec.startPoint.y)}`;

    if (sec.bendPoints) {
      sec.bendPoints.forEach((pt) => {
        pathD += ` L ${Math.round(pt.x)} ${Math.round(pt.y)}`;
      });
    }

    pathD += ` L ${Math.round(sec.endPoint.x)} ${Math.round(sec.endPoint.y)}`;

    routedEdges.push({
      id: e.id,
      source: meta.source,
      target: meta.target,
      type: meta.type,
      priority: meta.priority,
      pathD,
      startPoint: sec.startPoint,
      endPoint: sec.endPoint,
    });
  });

  // Safe fallback if graph is empty
  if (minX === Infinity) {
    minX = 0;
    minY = 0;
    maxX = 800;
    maxY = 600;
  }

  return {
    nodes: positionedNodes,
    edges: routedEdges,
    bounds: {
      minX,
      minY,
      maxX,
      maxY,
      width: Math.max(100, maxX - minX),
      height: Math.max(100, maxY - minY),
    },
  };
}

/**
 * Run and print validation statistics in development mode
 */
export function runGraphValidationLog(): void {
  const result = validateRoadmapGraph(RAW_ROADMAP_NODES, RAW_ROADMAP_EDGES);
  /* eslint-disable no-console */
  console.group('🧭 CommitForge Roadmap Graph Validation');
  console.log(`✓ ${result.nodeCount} nodes`);
  console.log(`✓ ${result.edgeCount} edges`);
  console.log(`✓ ${result.orphanNodes.length} orphan nodes`);
  console.log(`✓ ${result.invalidEdges.length} invalid edges`);
  console.log(`✓ ${result.duplicateEdges.length} duplicate edges`);
  console.log(`✓ ${result.selfEdges.length} self edges`);
  if (!result.isValid) {
    console.warn('Graph validation warnings found:', {
      orphans: result.orphanNodes,
      invalidEdges: result.invalidEdges,
      duplicates: result.duplicateEdges,
      selfEdges: result.selfEdges,
    });
  }
  console.groupEnd();
  /* eslint-enable no-console */
}
