// src/platform/components/SyntaxExplorer.tsx
import React, { useState } from 'react';
import { SyntaxTokenBreakdown, ConceptVariation } from '../lesson-runtime/types';

interface SyntaxExplorerProps {
  command: string;
  tokens: SyntaxTokenBreakdown[];
  variations?: ConceptVariation[];
  onTokenClick?: (token: SyntaxTokenBreakdown) => void;
  onRunVariation?: (syntax: string) => void;
}

export const SyntaxExplorer: React.FC<SyntaxExplorerProps> = ({
  command,
  tokens,
  variations = [],
  onTokenClick,
  onRunVariation,
}) => {
  const [selectedTokenIndex, setSelectedTokenIndex] = useState<number>(0);
  const [showVariations, setShowVariations] = useState<boolean>(true);

  const selectedToken = tokens[selectedTokenIndex] || tokens[0];

  const getRoleBadgeStyle = (role: SyntaxTokenBreakdown['role']) => {
    switch (role) {
      case 'binary':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/40';
      case 'subcommand':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/40';
      case 'flag':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/40';
      case 'argument':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
      case 'target':
        return 'bg-rose-500/20 text-rose-400 border-rose-500/40';
      default:
        return 'bg-slate-500/20 text-slate-300 border-slate-500/40';
    }
  };

  return (
    <div className="rounded-xl border border-slate-700/60 bg-slate-900/90 shadow-xl overflow-hidden backdrop-blur-md">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800 bg-slate-950/60">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-500 animate-pulse" />
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Interactive Syntax Explorer
          </span>
        </div>
        <span className="text-xs text-slate-400">
          Click any token to inspect its role and consequence
        </span>
      </div>

      {/* Interactive Command Pill Bar */}
      <div className="p-6 bg-slate-950/40 border-b border-slate-800/80">
        <div className="text-xs font-mono text-slate-400 mb-2">FULL COMMAND:</div>
        <div className="flex flex-wrap items-center gap-2 font-mono text-base bg-slate-900/80 p-3.5 rounded-lg border border-slate-800">
          {tokens.map((tok, idx) => {
            const isSelected = idx === selectedTokenIndex;
            return (
              <button
                key={`${tok.token}-${idx}`}
                onClick={() => {
                  setSelectedTokenIndex(idx);
                  if (onTokenClick) onTokenClick(tok);
                }}
                className={`relative px-3 py-1.5 rounded-md font-mono font-medium transition-all duration-200 cursor-pointer text-sm md:text-base ${
                  isSelected
                    ? 'bg-cyan-500/20 text-cyan-200 border-2 border-cyan-400 shadow-md shadow-cyan-500/20 scale-105'
                    : 'bg-slate-800/80 text-slate-300 border border-slate-700 hover:bg-slate-750 hover:text-white'
                }`}
                title={`Click to inspect: ${tok.token}`}
              >
                {tok.token}
                <span
                  className={`block text-[10px] uppercase font-sans font-bold tracking-tighter mt-0.5 ${
                    isSelected ? 'text-cyan-300' : 'text-slate-400'
                  }`}
                >
                  {tok.role}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Token Inspector Card */}
      {selectedToken && (
        <div className="p-6 bg-gradient-to-b from-slate-900/90 to-slate-950/90">
          <div className="flex items-center gap-3 mb-4">
            <span className="font-mono text-lg font-bold text-white px-2.5 py-1 bg-slate-800 rounded border border-slate-700">
              {selectedToken.token}
            </span>
            <span
              className={`text-xs px-2.5 py-0.5 rounded-full border font-semibold uppercase ${getRoleBadgeStyle(
                selectedToken.role
              )}`}
            >
              {selectedToken.role}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            {/* Meaning */}
            <div className="p-3.5 rounded-lg bg-slate-850/80 border border-slate-800">
              <div className="text-xs font-semibold uppercase tracking-wider text-cyan-400 mb-1 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                What it does
              </div>
              <p className="text-slate-200 leading-relaxed">{selectedToken.meaning}</p>
            </div>

            {/* Without It */}
            <div className="p-3.5 rounded-lg bg-rose-950/20 border border-rose-900/30">
              <div className="text-xs font-semibold uppercase tracking-wider text-rose-400 mb-1 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
                What happens without it?
              </div>
              <p className="text-rose-200/90 leading-relaxed">{selectedToken.withoutIt}</p>
            </div>

            {/* When to Use */}
            <div className="p-3.5 rounded-lg bg-emerald-950/20 border border-emerald-900/30">
              <div className="text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-1 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                When to use
              </div>
              <p className="text-emerald-200/90 leading-relaxed">{selectedToken.whenToUse}</p>
            </div>

            {/* Alternatives */}
            <div className="p-3.5 rounded-lg bg-slate-850/80 border border-slate-800">
              <div className="text-xs font-semibold uppercase tracking-wider text-amber-400 mb-1 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                Common alternatives
              </div>
              {selectedToken.alternatives && selectedToken.alternatives.length > 0 ? (
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {selectedToken.alternatives.map((alt, i) => (
                    <span
                      key={i}
                      className="font-mono text-xs px-2 py-0.5 bg-slate-800 text-amber-200 rounded border border-amber-500/20"
                    >
                      {alt}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-slate-400 text-xs italic">
                  Standard required positional syntax.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Syntax Variations Section */}
      {variations.length > 0 && (
        <div className="border-t border-slate-800 p-6 bg-slate-950/80">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <span className="w-2 h-2 rounded bg-indigo-500" />
              Real-World Syntax Variations & Why They Exist
            </h4>
            <button
              onClick={() => setShowVariations(!showVariations)}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
            >
              {showVariations ? 'Collapse' : `Show (${variations.length})`}
            </button>
          </div>

          {showVariations && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
              {variations.map((v, i) => (
                <div
                  key={i}
                  className="p-3.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="text-xs font-bold text-slate-200">{v.title}</span>
                      {onRunVariation && (
                        <button
                          onClick={() => onRunVariation(v.syntax)}
                          className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30 border border-indigo-500/30"
                        >
                          Use in Terminal
                        </button>
                      )}
                    </div>
                    <code className="block font-mono text-xs text-cyan-300 bg-slate-950 p-2 rounded border border-slate-800/80 mb-2">
                      {v.syntax}
                    </code>
                    <p className="text-xs text-slate-300 leading-relaxed mb-2">{v.explanation}</p>
                  </div>
                  <div className="text-[11px] text-slate-400 border-t border-slate-800/60 pt-2 flex items-center gap-1.5">
                    <span className="font-semibold text-slate-300">When:</span>
                    <span>{v.whenToUse}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
