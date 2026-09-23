// src/platform/components/BlockDiagramRenderer.tsx
import React, { useState } from 'react';
import { VisualDiagramSpec, DiagramNode } from '../lesson-runtime/types';

interface BlockDiagramRendererProps {
  diagram: VisualDiagramSpec;
  activeNodeId?: string;
  onNodeClick?: (node: DiagramNode) => void;
}

export const BlockDiagramRenderer: React.FC<BlockDiagramRendererProps> = ({
  diagram,
  activeNodeId,
  onNodeClick,
}) => {
  const [selectedNode, setSelectedNode] = useState<DiagramNode | null>(
    diagram.nodes.find((n) => n.id === activeNodeId) || diagram.nodes[0] || null
  );
  const [mode, setMode] = useState<'simple' | 'technical'>('simple');

  const getNodeColor = (node: DiagramNode, isSelected: boolean) => {
    if (isSelected) {
      return 'border-cyan-400 bg-cyan-950/40 text-cyan-200 shadow-lg shadow-cyan-500/20';
    }
    switch (node.status) {
      case 'active':
        return 'border-emerald-500/60 bg-emerald-950/30 text-emerald-200';
      case 'warning':
        return 'border-amber-500/60 bg-amber-950/30 text-amber-200';
      case 'inactive':
        return 'border-slate-700/60 bg-slate-900/50 text-slate-400';
      default:
        return 'border-slate-700 bg-slate-850 text-slate-200 hover:border-slate-600';
    }
  };

  return (
    <div className="rounded-xl border border-slate-700/60 bg-slate-900/90 shadow-xl overflow-hidden backdrop-blur-md">
      {/* Header with Mode Toggle */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800 bg-slate-950/60">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
            {diagram.title || 'Architectural Mental Model'}
          </span>
        </div>
        <div className="flex items-center gap-1 bg-slate-900 p-0.5 rounded-lg border border-slate-800 text-xs">
          <button
            onClick={() => setMode('simple')}
            className={`px-2.5 py-1 rounded font-medium transition-all ${
              mode === 'simple'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Simple
          </button>
          <button
            onClick={() => setMode('technical')}
            className={`px-2.5 py-1 rounded font-medium transition-all ${
              mode === 'technical'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Technical
          </button>
        </div>
      </div>

      {/* Interactive 2D Flow Canvas */}
      <div className="p-6 md:p-8 flex flex-col items-center justify-center min-h-[220px] bg-gradient-to-b from-slate-950/50 to-slate-900/60">
        <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 max-w-4xl w-full">
          {diagram.nodes.map((node, idx) => {
            const isSelected = selectedNode?.id === node.id;
            const hasNext = idx < diagram.nodes.length - 1;
            const flow = diagram.flow?.find((f) => f.from === node.id);

            return (
              <React.Fragment key={node.id}>
                {/* Node Box */}
                <button
                  onClick={() => {
                    setSelectedNode(node);
                    if (onNodeClick) onNodeClick(node);
                  }}
                  className={`group relative flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-200 min-w-[140px] md:min-w-[170px] text-center cursor-pointer ${getNodeColor(
                    node,
                    isSelected
                  )}`}
                >
                  <div className="text-xs uppercase font-mono tracking-wider font-semibold opacity-70 mb-1">
                    Step 0{idx + 1}
                  </div>
                  <div className="font-bold text-sm md:text-base">{node.label}</div>
                  <div className="text-[11px] opacity-80 mt-1 line-clamp-2 max-w-[160px]">
                    {mode === 'simple' ? node.simpleDef : node.techDef}
                  </div>

                  {isSelected && (
                    <div className="absolute -bottom-2.5 w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                  )}
                </button>

                {/* Flow Arrow */}
                {hasNext && (
                  <div className="flex flex-col items-center justify-center text-slate-500 px-1">
                    <div className="text-[10px] font-mono font-medium text-slate-400 mb-1">
                      {flow?.label || 'transitions'}
                    </div>
                    <div className="flex items-center">
                      <div className="w-6 md:w-10 h-0.5 bg-gradient-to-r from-slate-600 via-indigo-500 to-cyan-400 animate-pulse" />
                      <span className="text-cyan-400 text-sm font-bold -ml-1">▶</span>
                    </div>
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Selected Node Deep Dive Inspector */}
      {selectedNode && (
        <div className="p-5 bg-slate-950/80 border-t border-slate-800">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-mono px-2 py-0.5 bg-indigo-950 text-indigo-300 rounded border border-indigo-800">
              Selected Component
            </span>
            <h4 className="text-sm font-bold text-white">{selectedNode.label}</h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs mt-2">
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
              <div className="text-slate-400 font-semibold uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                Plain English Explanation
              </div>
              <p className="text-slate-200 leading-relaxed">{selectedNode.simpleDef}</p>
            </div>
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
              <div className="text-slate-400 font-semibold uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                Under the Hood (Engine Reality)
              </div>
              <p className="text-slate-300 leading-relaxed">{selectedNode.techDef}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
