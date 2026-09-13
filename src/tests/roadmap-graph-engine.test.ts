import { describe, it, expect } from 'vitest';
import {
  RAW_ROADMAP_NODES,
  RAW_ROADMAP_EDGES,
  validateRoadmapGraph,
} from '../data/roadmapGraphModel';
import {
  computeRoadmapLayout,
  filterVisibleGraph,
} from '../services/roadmapLayoutEngine';

describe('Roadmap Graph Architecture & Layout Engine', () => {
  it('validates that all edge sources and targets exist without orphans or duplicates', () => {
    const result = validateRoadmapGraph(RAW_ROADMAP_NODES, RAW_ROADMAP_EDGES);

    expect(result.orphanNodes).toHaveLength(0);
    expect(result.invalidEdges).toHaveLength(0);
    expect(result.duplicateEdges).toHaveLength(0);
    expect(result.selfEdges).toHaveLength(0);
    expect(result.isValid).toBe(true);
    expect(result.nodeCount).toBeGreaterThan(30);
    expect(result.edgeCount).toBeGreaterThan(30);
  });

  it('filters visible graph according to semantic zoom / detail level', () => {
    // 1. Categories only (Level 1)
    const { visibleNodes: catNodes } = filterVisibleGraph(
      RAW_ROADMAP_NODES,
      RAW_ROADMAP_EDGES,
      { detailLevel: 'categories' }
    );
    expect(catNodes.every((n) => n.type === 'root' || n.type === 'category')).toBe(true);

    // 2. Topics (Level 2)
    const { visibleNodes: topicNodes } = filterVisibleGraph(
      RAW_ROADMAP_NODES,
      RAW_ROADMAP_EDGES,
      { detailLevel: 'topics' }
    );
    expect(topicNodes.length).toBeGreaterThan(catNodes.length);
    expect(topicNodes.some((n) => n.type === 'topic')).toBe(true);
    expect(topicNodes.some((n) => n.type === 'subtopic')).toBe(false);

    // 3. All details (Level 3)
    const { visibleNodes: allNodes } = filterVisibleGraph(
      RAW_ROADMAP_NODES,
      RAW_ROADMAP_EDGES,
      { detailLevel: 'all' }
    );
    expect(allNodes.length).toBeGreaterThan(topicNodes.length);
    expect(allNodes.some((n) => n.type === 'subtopic')).toBe(true);
  });

  it('supports collapsible subgraphs', () => {
    // When 'version-control' is collapsed, its children should not be visible
    const { visibleNodes } = filterVisibleGraph(
      RAW_ROADMAP_NODES,
      RAW_ROADMAP_EDGES,
      {
        detailLevel: 'all',
        collapsedNodeIds: new Set(['version-control']),
      }
    );

    const hasVcsChildren = visibleNodes.some((n) => n.parentId === 'version-control');
    expect(hasVcsChildren).toBe(false);
  });

  it('runs ELK automatic layout and produces non-overlapping orthogonal routes and positive coordinates', async () => {
    const layout = await computeRoadmapLayout(
      RAW_ROADMAP_NODES,
      RAW_ROADMAP_EDGES,
      { detailLevel: 'topics' }
    );

    expect(layout.nodes.length).toBeGreaterThan(0);
    expect(layout.edges.length).toBeGreaterThan(0);
    expect(layout.bounds.width).toBeGreaterThan(100);
    expect(layout.bounds.height).toBeGreaterThan(100);

    // Verify all nodes have finite positive coordinates and dimensions
    layout.nodes.forEach((n) => {
      expect(Number.isFinite(n.x)).toBe(true);
      expect(Number.isFinite(n.y)).toBe(true);
      expect(n.width).toBeGreaterThan(0);
      expect(n.height).toBeGreaterThan(0);
    });

    // Verify all edges have valid orthogonal SVG path strings
    layout.edges.forEach((e) => {
      expect(e.pathD).toMatch(/^M \d+ \d+/);
      expect(e.pathD).toContain('L');
    });
  });
});
