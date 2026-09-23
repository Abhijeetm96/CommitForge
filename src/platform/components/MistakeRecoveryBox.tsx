// src/platform/components/MistakeRecoveryBox.tsx
import React, { useState } from 'react';
import { MistakeRecovery } from '../lesson-runtime/types';

interface MistakeRecoveryBoxProps {
  mistake: MistakeRecovery;
  onApplyRecoveryCommand?: (cmd: string) => void;
}

export const MistakeRecoveryBox: React.FC<MistakeRecoveryBoxProps> = ({
  mistake,
  onApplyRecoveryCommand,
}) => {
  const [hasTriggeredMistake, setHasTriggeredMistake] = useState<boolean>(false);
  const [hasRecovered, setHasRecovered] = useState<boolean>(false);

  return (
    <div className="rounded-xl border border-slate-700/60 bg-slate-900/90 shadow-xl overflow-hidden backdrop-blur-md">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800 bg-slate-950/60">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
          <span className="text-xs font-semibold uppercase tracking-wider text-rose-300">
            Controlled Mistake Lab & Recovery
          </span>
        </div>
        <span className="text-xs text-slate-400">
          Safe sandbox: break it on purpose, understand why, then recover
        </span>
      </div>

      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-5 border-b border-slate-800/80">
          <div>
            <h4 className="text-base font-bold text-white mb-1">{mistake.mistakeTitle}</h4>
            <p className="text-xs text-slate-400">
              Run this common error to observe how the engine behaves and why it fails.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {!hasTriggeredMistake ? (
              <button
                onClick={() => {
                  setHasTriggeredMistake(true);
                  setHasRecovered(false);
                }}
                className="px-4 py-2 rounded-lg bg-rose-600/20 hover:bg-rose-600/30 text-rose-200 border border-rose-500/40 text-xs font-semibold flex items-center gap-2 transition-all"
              >
                <span>Trigger Mistake</span>
                <span className="font-mono text-[11px] bg-rose-950/80 px-1.5 py-0.5 rounded border border-rose-800">
                  {mistake.mistakeCommand}
                </span>
              </button>
            ) : (
              <button
                onClick={() => {
                  setHasTriggeredMistake(false);
                  setHasRecovered(false);
                }}
                className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white text-xs border border-slate-700 transition-all"
              >
                Reset Mistake Lab
              </button>
            )}
          </div>
        </div>

        {/* Mistake Simulation Panel */}
        {hasTriggeredMistake && (
          <div className="space-y-4 animate-fadeIn">
            {/* What Happened */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-rose-950/20 border border-rose-900/30">
                <div className="text-xs font-semibold uppercase tracking-wider text-rose-400 mb-1 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  What the Engine Interpreted
                </div>
                <p className="text-xs text-slate-200 leading-relaxed">{mistake.whatHappened}</p>
              </div>

              <div className="p-4 rounded-lg bg-emerald-950/20 border border-emerald-900/30">
                <div className="text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-1 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  Crucial: What Was NOT Lost
                </div>
                <p className="text-xs text-slate-200 leading-relaxed">{mistake.whatWasNotLost}</p>
              </div>
            </div>

            {/* Recovery Action */}
            <div className="p-5 rounded-lg bg-slate-950 border border-cyan-500/30">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                  <span className="text-xs font-bold uppercase tracking-wider text-cyan-300">
                    The Recovery Command
                  </span>
                </div>
                <button
                  onClick={() => {
                    setHasRecovered(true);
                    if (onApplyRecoveryCommand) {
                      onApplyRecoveryCommand(mistake.recoveryCommand);
                    }
                  }}
                  className="px-3.5 py-1.5 rounded-md bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-200 border border-cyan-400/40 text-xs font-semibold flex items-center gap-1.5 transition-all"
                >
                  <span>Execute Recovery</span>
                  <span className="text-cyan-400">➜</span>
                </button>
              </div>

              <div className="bg-slate-900 p-3 rounded font-mono text-xs text-cyan-300 border border-slate-800 mb-3 select-all">
                $ {mistake.recoveryCommand}
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {mistake.recoveryExplanation}
              </p>

              {hasRecovered && (
                <div className="mt-4 p-3 rounded bg-emerald-900/30 border border-emerald-500/40 text-xs text-emerald-200 flex items-center gap-2">
                  <span className="text-base">✓</span>
                  <span>
                    State successfully restored! You just diagnosed and recovered from a real-world error.
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {!hasTriggeredMistake && (
          <div className="text-center py-6 text-slate-400 text-xs bg-slate-950/40 rounded-lg border border-dashed border-slate-800">
            Click <strong className="text-rose-300">"Trigger Mistake"</strong> above to purposefully inject this failure and learn the recovery path.
          </div>
        )}
      </div>
    </div>
  );
};
