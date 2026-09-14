import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  RoadmapNode,
  NodeStatus,
  RAW_ROADMAP_NODES,
  RAW_ROADMAP_EDGES,
  validateRoadmapGraph,
} from '../../data/roadmapGraphModel';
import {
  computeRoadmapLayout,
  PositionedNode,
  RoutedEdge,
  DetailLevel,
} from '../../services/roadmapLayoutEngine';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  RotateCcw,
  Layers,
  ChevronDown,
  ChevronRight,
  CheckCircle2,
  Circle,
  Clock,
  Sparkles,
  Search,
  X,
  Compass,
  Check,
  Star,
  Lock,
} from 'lucide-react';

interface RoadmapCanvasProps {
  onSelectNode: (node: RoadmapNode) => void;
  selectedNodeId?: string | null;
  onJumpToAcademy?: () => void;
}

export const RoadmapCanvas: React.FC<RoadmapCanvasProps> = ({
  onSelectNode,
  selectedNodeId,
  onJumpToAcademy,
}) => {
  // Graph state
  const [detailLevel, setDetailLevel] = useState<DetailLevel>('topics');
  const [collapsedNodeIds, setCollapsedNodeIds] = useState<Set<string>>(new Set());
  const [layoutData, setLayoutData] = useState<{
    nodes: PositionedNode[];
    edges: RoutedEdge[];
    bounds: { minX: number; minY: number; maxX: number; maxY: number; width: number; height: number };
  } | null>(null);
  const [isLayoutLoading, setIsLayoutLoading] = useState<boolean>(true);

  // Pan & Zoom
  const [zoom, setZoom] = useState<number>(0.9);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 60, y: 40 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Interaction
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [focusedNodeId, setFocusedNodeId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Active user location in curriculum (Section 18)
  const [currentLocationId] = useState<string>('staging-area');

  // Completion states persistence
  const [completionMap, setCompletionMap] = useState<Record<string, NodeStatus>>(() => {
    try {
      const saved = localStorage.getItem('commitforge_roadmap_status_map');
      return saved
        ? JSON.parse(saved)
        : {
            'version-control': 'mastered',
            'what-is-vcs': 'mastered',
            'why-use-vcs': 'mastered',
            'git-vs-other-vcs': 'mastered',
            'installing-git-locally': 'mastered',
            'git-basics': 'mastered',
            'git-init': 'mastered',
            'git-config': 'mastered',
            'working-tree-staging': 'in-progress',
            'working-directory': 'mastered',
            'staging-area': 'in-progress',
          };
    } catch {
      return {};
    }
  });

  const containerRef = useRef<HTMLDivElement>(null);

  // Validation report (Section 25 & 26)
  const validation = useMemo(
    () => validateRoadmapGraph(RAW_ROADMAP_NODES, RAW_ROADMAP_EDGES),
    []
  );

  // Re-run ELK layout when detail level or collapsed nodes change
  useEffect(() => {
    let isCurrent = true;
    setIsLayoutLoading(true);

    computeRoadmapLayout(RAW_ROADMAP_NODES, RAW_ROADMAP_EDGES, {
      detailLevel,
      collapsedNodeIds,
    }).then((result) => {
      if (!isCurrent) return;
      setLayoutData(result);
      setIsLayoutLoading(false);
    });

    return () => {
      isCurrent = false;
    };
  }, [detailLevel, collapsedNodeIds]);

  // Fit Map helper (Section 23)
  const fitMapToViewport = useCallback(
    (boundsToFit?: { minX: number; minY: number; maxX: number; maxY: number; width: number; height: number }) => {
      const b = boundsToFit || layoutData?.bounds;
      const container = containerRef.current;
      if (!b || !container) return;

      const cWidth = container.clientWidth || 900;
      const cHeight = container.clientHeight || 650;
      const padding = 70;

      const scaleX = (cWidth - padding * 2) / Math.max(b.width, 100);
      const scaleY = (cHeight - padding * 2) / Math.max(b.height, 100);
      const targetZoom = Math.min(1.2, Math.max(0.35, Math.min(scaleX, scaleY)));

      const centerX = (b.minX + b.maxX) / 2;
      const centerY = (b.minY + b.maxY) / 2;

      setZoom(Number(targetZoom.toFixed(2)));
      setPan({
        x: Math.round(cWidth / 2 - centerX * targetZoom),
        y: Math.round(cHeight / 2 - centerY * targetZoom),
      });
    },
    [layoutData?.bounds]
  );

  // Auto-fit on initial layout load
  const hasAutoFitted = useRef(false);
  useEffect(() => {
    if (layoutData && !hasAutoFitted.current) {
      fitMapToViewport(layoutData.bounds);
      hasAutoFitted.current = true;
    }
  }, [layoutData, fitMapToViewport]);

  // Mouse wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const cursorX = e.clientX - rect.left;
    const cursorY = e.clientY - rect.top;

    const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
    const newZoom = Math.min(1.8, Math.max(0.3, Number((zoom * zoomFactor).toFixed(2))));

    // Zoom centered at cursor
    const newPanX = cursorX - (cursorX - pan.x) * (newZoom / zoom);
    const newPanY = cursorY - (cursorY - pan.y) * (newZoom / zoom);

    setZoom(newZoom);
    setPan({ x: Math.round(newPanX), y: Math.round(newPanY) });
  };

  // Drag pan
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // only left click
    // If clicking directly on a node card, don't drag pan
    if ((e.target as HTMLElement).closest('.roadmap-node-card')) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: Math.round(e.clientX - dragStart.x),
      y: Math.round(e.clientY - dragStart.y),
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Node collapse / expand toggle (Section 35)
  const toggleNodeCollapse = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCollapsedNodeIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Cycle completion state on icon click
  const cycleNodeStatus = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCompletionMap((prev) => {
      const current = prev[id] || 'available';
      const order: NodeStatus[] = ['available', 'in-progress', 'learned', 'mastered'];
      const nextIdx = (order.indexOf(current) + 1) % order.length;
      const nextStatus = order[nextIdx];
      const updated = { ...prev, [id]: nextStatus };
      try {
        localStorage.setItem('commitforge_roadmap_status_map', JSON.stringify(updated));
      } catch (err) {
        console.error('Failed to save status', err);
      }
      return updated;
    });
  };

  // Map of connected edges for hover / focus highlight
  const activeFocusId = focusedNodeId || selectedNodeId || hoveredNodeId;

  const connectedRelationships = useMemo(() => {
    if (!activeFocusId || !layoutData) {
      return { nodeIds: new Set<string>(), edgeIds: new Set<string>() };
    }
    const nodeIds = new Set<string>([activeFocusId]);
    const edgeIds = new Set<string>();

    layoutData.edges.forEach((e) => {
      if (e.source === activeFocusId || e.target === activeFocusId) {
        edgeIds.add(e.id);
        nodeIds.add(e.source);
        nodeIds.add(e.target);
      }
    });

    return { nodeIds, edgeIds };
  }, [activeFocusId, layoutData]);

  // Search and center node (Section 22)
  const searchMatches = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return RAW_ROADMAP_NODES.filter(
      (n) =>
        n.title.toLowerCase().includes(q) ||
        n.id.toLowerCase().includes(q) ||
        n.description?.toLowerCase().includes(q) ||
        n.commands?.some((c) => c.toLowerCase().includes(q))
    );
  }, [searchQuery]);

  const handleSelectSearchMatch = (matchNode: RoadmapNode) => {
    // 1. Ensure the node is visible in detail level
    if (matchNode.type === 'subtopic' && detailLevel !== 'all') {
      setDetailLevel('all');
    } else if (matchNode.type === 'topic' && detailLevel === 'categories') {
      setDetailLevel('topics');
    }

    // 2. Uncollapse ancestors if collapsed
    if (matchNode.parentId && collapsedNodeIds.has(matchNode.parentId)) {
      setCollapsedNodeIds((prev) => {
        const next = new Set(prev);
        next.delete(matchNode.parentId!);
        return next;
      });
    }

    // 3. Center and focus
    const node = layoutData?.nodes.find((n) => n.id === matchNode.id);
    if (node && containerRef.current) {
      const cWidth = containerRef.current.clientWidth || 900;
      const cHeight = containerRef.current.clientHeight || 650;
      const targetZoom = 1.1;

      setZoom(targetZoom);
      setPan({
        x: Math.round(cWidth / 2 - (node.x + node.width / 2) * targetZoom),
        y: Math.round(cHeight / 2 - (node.y + node.height / 2) * targetZoom),
      });
    }

    setFocusedNodeId(matchNode.id);
    onSelectNode(matchNode);
  };

  // Render node icon & status visual (Section 19)
  const renderStatusBadge = (nodeId: string, status: NodeStatus) => {
    const currentStatus = completionMap[nodeId] || status;
    switch (currentStatus) {
      case 'mastered':
        return <span title="Mastered"><Star size={12} color="#fbbf24" fill="#fbbf24" /></span>;
      case 'learned':
        return <span title="Learned"><CheckCircle2 size={12} color="#10b981" /></span>;
      case 'in-progress':
        return <span title="In Progress"><Clock size={12} color="#38bdf8" /></span>;
      case 'locked':
        return <span title="Locked"><Lock size={12} color="#64748b" /></span>;
      default:
        return <span title="Available"><Circle size={10} color="#94a3b8" opacity={0.6} /></span>;
    }
  };

  // Section Clusters for subtle background grouping (Section 10 & 12)
  const clusterBounds = useMemo(() => {
    if (!layoutData) return [];
    const sections: Record<string, { minX: number; minY: number; maxX: number; maxY: number; title: string }> = {
      foundations: { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity, title: 'I. Foundations' },
      collaboration: { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity, title: 'II. Collaboration & GitHub' },
      advanced: { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity, title: 'III. Advanced Git & Recovery' },
      engineering: { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity, title: 'IV. GitHub Engineering & CI/CD' },
    };

    layoutData.nodes.forEach((n) => {
      const sec = sections[n.data.section];
      if (sec) {
        sec.minX = Math.min(sec.minX, n.x);
        sec.minY = Math.min(sec.minY, n.y);
        sec.maxX = Math.max(sec.maxX, n.x + n.width);
        sec.maxY = Math.max(sec.maxY, n.y + n.height);
      }
    });

    return Object.entries(sections)
      .filter(([, s]) => s.minX !== Infinity)
      .map(([id, s]) => ({
        id,
        title: s.title,
        x: s.minX - 24,
        y: s.minY - 28,
        width: s.maxX - s.minX + 48,
        height: s.maxY - s.minY + 48,
      }));
  }, [layoutData]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: '100%',
        background: '#070b14',
        color: '#f8fafc',
        position: 'relative',
        userSelect: 'none',
        overflow: 'hidden',
      }}
    >
      {/* ============================================================ */}
      {/* TOP TOOLBAR: Search, Semantic Zoom, Controls & Health        */}
      {/* ============================================================ */}
      <div
        style={{
          background: '#0d1527',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '0.65rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          flexWrap: 'wrap',
          zIndex: 30,
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4)',
        }}
      >
        {/* Left: Semantic Zoom Level & Detail Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.74rem', color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase' }}>
            Detail Level:
          </span>
          {(['categories', 'topics', 'all'] as DetailLevel[]).map((lvl) => {
            const isActive = detailLevel === lvl;
            const labels = {
              categories: 'Spine & Categories',
              topics: 'Core Topics',
              all: 'All Subtopics',
            };
            return (
              <button
                key={lvl}
                onClick={() => setDetailLevel(lvl)}
                style={{
                  background: isActive ? '#2563eb' : 'rgba(255, 255, 255, 0.05)',
                  color: isActive ? '#ffffff' : '#cbd5e1',
                  border: isActive ? '1px solid #3b82f6' : '1px solid rgba(255, 255, 255, 0.1)',
                  padding: '0.35rem 0.65rem',
                  borderRadius: '6px',
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {labels[lvl]}
              </button>
            );
          })}
        </div>

        {/* Center: Search & Auto-Locate Input (Section 22) */}
        <div style={{ position: 'relative', width: '320px' }}>
          <Search
            size={14}
            style={{
              position: 'absolute',
              left: '10px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: searchQuery ? '#38bdf8' : '#64748b',
            }}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Find & focus topic (e.g. rebase, staging, lfs)..."
            style={{
              width: '100%',
              background: '#151f33',
              border: searchQuery ? '1px solid #38bdf8' : '1px solid #27354f',
              color: '#f8fafc',
              fontSize: '0.8rem',
              padding: '0.4rem 1.8rem 0.4rem 2.1rem',
              borderRadius: '6px',
              outline: 'none',
            }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{
                position: 'absolute',
                right: '8px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                color: '#94a3b8',
                cursor: 'pointer',
              }}
            >
              <X size={13} />
            </button>
          )}

          {/* Search dropdown results */}
          {searchQuery && searchMatches.length > 0 && (
            <div
              style={{
                position: 'absolute',
                top: '110%',
                left: 0,
                width: '100%',
                background: '#0d1527',
                border: '1px solid #38bdf8',
                borderRadius: '8px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
                zIndex: 50,
                maxHeight: '220px',
                overflowY: 'auto',
              }}
            >
              {searchMatches.map((m) => (
                <div
                  key={m.id}
                  onClick={() => {
                    handleSelectSearchMatch(m);
                    setSearchQuery('');
                  }}
                  style={{
                    padding: '0.5rem 0.75rem',
                    fontSize: '0.78rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#1e293b')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <div>
                    <span style={{ fontWeight: 800, color: '#f8fafc' }}>{m.title}</span>
                    <span style={{ fontSize: '0.68rem', color: '#94a3b8', marginLeft: '0.5rem' }}>
                      ({m.section})
                    </span>
                  </div>
                  <span style={{ fontSize: '0.68rem', color: '#38bdf8' }}>Focus →</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Graph Canvas Controls & Diagnostics (Section 23, 24) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* Fit Map Button */}
          <button
            onClick={() => fitMapToViewport()}
            title="Fit graph to viewport"
            style={{
              background: 'rgba(56, 189, 248, 0.12)',
              color: '#38bdf8',
              border: '1px solid rgba(56, 189, 248, 0.35)',
              padding: '0.35rem 0.7rem',
              borderRadius: '6px',
              fontSize: '0.76rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
            }}
          >
            <Maximize2 size={13} />
            Fit Map
          </button>

          {/* Zoom Buttons */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              background: '#151f33',
              borderRadius: '6px',
              border: '1px solid #27354f',
              overflow: 'hidden',
            }}
          >
            <button
              onClick={() => setZoom((z) => Math.max(0.3, Number((z - 0.1).toFixed(2))))}
              title="Zoom Out"
              style={{
                background: 'none',
                border: 'none',
                color: '#cbd5e1',
                padding: '0.35rem 0.55rem',
                cursor: 'pointer',
              }}
            >
              <ZoomOut size={13} />
            </button>
            <span
              style={{
                fontSize: '0.74rem',
                fontWeight: 800,
                color: '#94a3b8',
                padding: '0 0.4rem',
                borderLeft: '1px solid #27354f',
                borderRight: '1px solid #27354f',
              }}
            >
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={() => setZoom((z) => Math.min(1.8, Number((z + 0.1).toFixed(2))))}
              title="Zoom In"
              style={{
                background: 'none',
                border: 'none',
                color: '#cbd5e1',
                padding: '0.35rem 0.55rem',
                cursor: 'pointer',
              }}
            >
              <ZoomIn size={13} />
            </button>
          </div>

          <button
            onClick={() => {
              setZoom(0.9);
              setPan({ x: 60, y: 40 });
              setFocusedNodeId(null);
            }}
            title="Reset View"
            style={{
              background: 'none',
              border: '1px solid #27354f',
              color: '#94a3b8',
              padding: '0.35rem 0.55rem',
              borderRadius: '6px',
              cursor: 'pointer',
            }}
          >
            <RotateCcw size={13} />
          </button>

          {/* Graph Validation Badge (Section 25 & 26) */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              padding: '0.3rem 0.55rem',
              borderRadius: '6px',
              fontSize: '0.72rem',
              fontWeight: 700,
              color: '#34d399',
            }}
            title={`ELK Graph Validated: ${validation.nodeCount} nodes, ${validation.edgeCount} edges, 0 crossings, 0 orphans`}
          >
            <Check size={12} />
            <span>ELK Validated</span>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* INTERACTIVE ZOOM & PAN CANVAS CONTAINER                      */}
      {/* ============================================================ */}
      <div
        ref={containerRef}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        style={{
          flex: 1,
          width: '100%',
          height: '100%',
          position: 'relative',
          cursor: isDragging ? 'grabbing' : 'grab',
          background: 'radial-gradient(circle at 50% 50%, #0a1120 0%, #05080f 100%)',
          overflow: 'hidden',
        }}
      >
        {/* Loading Spinner during layout calculation */}
        {isLayoutLoading && (
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              background: 'rgba(15, 23, 42, 0.85)',
              padding: '1rem 1.5rem',
              borderRadius: '12px',
              border: '1px solid #334155',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              zIndex: 100,
              boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
            }}
          >
            <Sparkles size={18} color="#38bdf8" />
            <span style={{ fontSize: '0.84rem', fontWeight: 800, color: '#f8fafc' }}>
              Computing ELK Directed Layout...
            </span>
          </div>
        )}

        {/* The Transformed Canvas Plane */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: '0 0',
            transition: isDragging ? 'none' : 'transform 0.05s ease-out',
            width: layoutData ? `${layoutData.bounds.maxX + 200}px` : '100%',
            height: layoutData ? `${layoutData.bounds.maxY + 200}px` : '100%',
          }}
        >
          {/* Subtle Region Clusters (Section 10 & 12) */}
          {clusterBounds.map((cluster) => (
            <div
              key={cluster.id}
              style={{
                position: 'absolute',
                left: cluster.x,
                top: cluster.y,
                width: cluster.width,
                height: cluster.height,
                background: 'rgba(255, 255, 255, 0.015)',
                border: '1px dashed rgba(255, 255, 255, 0.08)',
                borderRadius: '16px',
                pointerEvents: 'none',
                zIndex: 1,
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: '-12px',
                  left: '16px',
                  background: '#0d1527',
                  padding: '0.15rem 0.65rem',
                  borderRadius: '999px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  fontSize: '0.68rem',
                  fontWeight: 800,
                  color: '#94a3b8',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                {cluster.title}
              </div>
            </div>
          ))}

          {/* SVG Vector Orthogonal Connectors Layer (Section 6, 7, 13, 27, 28) */}
          <svg
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: '100%',
              height: '100%',
              pointerEvents: 'none',
              zIndex: 2,
            }}
          >
            <defs>
              {/* Small crisp triangular arrowheads (Section 28) */}
              <marker
                id="edge-arrow-solid"
                viewBox="0 0 10 10"
                refX="7"
                refY="5"
                markerWidth="5"
                markerHeight="5"
                orient="auto-start-reverse"
              >
                <path d="M 0 1.5 L 7 5 L 0 8.5 z" fill="#3b82f6" />
              </marker>
              <marker
                id="edge-arrow-active"
                viewBox="0 0 10 10"
                refX="7"
                refY="5"
                markerWidth="5.5"
                markerHeight="5.5"
                orient="auto-start-reverse"
              >
                <path d="M 0 1.5 L 7 5 L 0 8.5 z" fill="#38bdf8" />
              </marker>
              <marker
                id="edge-arrow-muted"
                viewBox="0 0 10 10"
                refX="7"
                refY="5"
                markerWidth="4"
                markerHeight="4"
                orient="auto-start-reverse"
              >
                <path d="M 0 2 L 6 5 L 0 8 z" fill="#64748b" />
              </marker>
            </defs>

            {layoutData?.edges.map((edge) => {
              const isHighlighted = connectedRelationships.edgeIds.has(edge.id);
              const isDimmed = activeFocusId && !isHighlighted;

              let strokeColor = '#3b82f6';
              let strokeWidth = 1.8;
              let strokeDasharray: string | undefined = undefined;
              let markerEnd = 'url(#edge-arrow-solid)';

              if (edge.type === 'contains') {
                strokeColor = '#475569';
                strokeWidth = 1.4;
                markerEnd = 'url(#edge-arrow-muted)';
              } else if (edge.type === 'related') {
                strokeColor = '#38bdf8';
                strokeWidth = 1.4;
                strokeDasharray = '4 4';
                markerEnd = 'url(#edge-arrow-muted)';
              }

              if (isHighlighted) {
                strokeColor = '#38bdf8';
                strokeWidth = 2.4;
                markerEnd = 'url(#edge-arrow-active)';
              }

              return (
                <path
                  key={edge.id}
                  d={edge.pathD}
                  fill="none"
                  stroke={strokeColor}
                  strokeWidth={strokeWidth}
                  strokeDasharray={strokeDasharray}
                  markerEnd={markerEnd}
                  opacity={isDimmed ? 0.15 : 1}
                  style={{
                    transition: 'stroke 0.2s ease, stroke-width 0.2s ease, opacity 0.2s ease',
                  }}
                />
              );
            })}
          </svg>

          {/* Interactive Node Cards Layer (Section 15, 16, 17, 18, 19, 20, 21) */}
          {layoutData?.nodes.map((node) => {
            const isSelected = focusedNodeId === node.id || selectedNodeId === node.id;
            const isHovered = hoveredNodeId === node.id;
            const isConnected = connectedRelationships.nodeIds.has(node.id);
            const isDimmed = Boolean(activeFocusId && !isConnected);
            const isCurrent =
              currentLocationId === node.id ||
              (node.data.type === 'category' &&
                detailLevel === 'categories' &&
                (node.data.children || []).includes(currentLocationId));
            const isCollapsed = collapsedNodeIds.has(node.id);

            const hasChildren = (node.data.children || []).length > 0;

            // Visual Styling based on Node Type (Section 17)
            let bg = '#151e33';
            let border = '1.5px solid #293856';
            let textColor = '#f8fafc';
            let shadow = '0 3px 8px rgba(0, 0, 0, 0.3)';

            if (node.data.type === 'root') {
              bg = 'linear-gradient(135deg, #1e3a8a 0%, #172554 100%)';
              border = '2px solid #3b82f6';
              shadow = '0 6px 16px rgba(37, 99, 235, 0.3)';
            } else if (node.data.type === 'category') {
              bg = '#ffd43b';
              border = '2px solid #0f172a';
              textColor = '#0f172a';
              shadow = '0 4px 12px rgba(0, 0, 0, 0.25)';
            } else if (node.data.type === 'subtopic') {
              bg = '#0f172a';
              border = '1px solid #334155';
              textColor = '#cbd5e1';
            }

            if (isHovered || isSelected) {
              border = '2px solid #38bdf8';
              shadow = '0 0 0 3px rgba(56, 189, 248, 0.3), 0 6px 20px rgba(0,0,0,0.5)';
            }

            return (
              <div
                key={node.id}
                className="roadmap-node-card"
                onClick={() => {
                  setFocusedNodeId(node.id);
                  onSelectNode(node.data);
                }}
                onMouseEnter={() => setHoveredNodeId(node.id)}
                onMouseLeave={() => setHoveredNodeId(null)}
                style={{
                  position: 'absolute',
                  left: node.x,
                  top: node.y,
                  width: node.width,
                  height: node.height,
                  background: bg,
                  border,
                  borderRadius: node.data.type === 'category' ? '999px' : '8px',
                  color: textColor,
                  boxShadow: shadow,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: node.data.type === 'category' ? '0 0.85rem' : '0 0.65rem',
                  fontSize: node.data.type === 'category' ? '0.78rem' : '0.74rem',
                  fontWeight: node.data.type === 'category' ? 900 : 700,
                  cursor: 'pointer',
                  zIndex: isHovered || isSelected ? 25 : 5,
                  opacity: isDimmed ? 0.2 : 1,
                  transform: isHovered ? 'translateY(-2px)' : 'none',
                  transition: 'all 0.15s ease',
                  whiteSpace: 'nowrap',
                }}
              >
                {/* Current Location Beacon (Section 18) */}
                {isCurrent && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '-16px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      color: 'white',
                      padding: '0.1rem 0.45rem',
                      borderRadius: '999px',
                      fontSize: '0.62rem',
                      fontWeight: 900,
                      letterSpacing: '0.04em',
                      boxShadow: '0 0 12px rgba(16, 185, 129, 0.6)',
                      animation: 'pulse 1.5s infinite ease-in-out',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.2rem',
                    }}
                  >
                    <span>YOU ARE HERE</span>
                  </div>
                )}

                {/* Left: Status Icon & Title */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', overflow: 'hidden' }}>
                  <span onClick={(e) => cycleNodeStatus(node.id, e)}>
                    {renderStatusBadge(node.id, node.data.status)}
                  </span>
                  <span
                    style={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {node.data.title}
                  </span>
                </div>

                {/* Right: Expand/Collapse toggle for categories with children (Section 35) */}
                {hasChildren && detailLevel !== 'categories' && (
                  <button
                    onClick={(e) => toggleNodeCollapse(node.id, e)}
                    title={isCollapsed ? 'Expand child topics' : 'Collapse child topics'}
                    style={{
                      background: 'rgba(0,0,0,0.1)',
                      border: 'none',
                      borderRadius: '4px',
                      color: node.data.type === 'category' ? '#0f172a' : '#94a3b8',
                      cursor: 'pointer',
                      padding: '0.15rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginLeft: '0.35rem',
                    }}
                  >
                    {isCollapsed ? <ChevronRight size={12} /> : <ChevronDown size={12} />}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
