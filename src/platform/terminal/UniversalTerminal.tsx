// src/platform/terminal/UniversalTerminal.tsx
import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { RuntimeAdapter, TerminalOutputLine, ExecutionResult } from './types';

export interface UniversalTerminalHandle {
  executeCommand: (cmd: string) => Promise<void>;
  clear: () => void;
  focus: () => void;
}

interface UniversalTerminalProps {
  adapter: RuntimeAdapter;
  initialLines?: TerminalOutputLine[];
  onCommandExecuted?: (cmd: string, result: ExecutionResult) => void;
  className?: string;
  title?: string;
  readOnly?: boolean;
}

export const UniversalTerminal = forwardRef<UniversalTerminalHandle, UniversalTerminalProps>(
  ({ adapter, initialLines = [], onCommandExecuted, className = '', title, readOnly = false }, ref) => {
    const [lines, setLines] = useState<TerminalOutputLine[]>(() => {
      if (initialLines.length > 0) return initialLines;
      return [
        {
          id: 'welcome',
          type: 'info',
          text: `Connected to ${adapter.technology.toUpperCase()} runtime. Type help or run commands interactively.`,
          timestamp: Date.now(),
        },
      ];
    });

    const [input, setInput] = useState<string>('');
    const [history, setHistory] = useState<string[]>([]);
    const [historyIndex, setHistoryIndex] = useState<number>(-1);
    const [isExecuting, setIsExecuting] = useState<boolean>(false);

    const bottomRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Auto-scroll on new output
    useEffect(() => {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [lines]);

    const runCommandInternal = async (commandToRun: string) => {
      const trimmed = commandToRun.trim();
      if (!trimmed) return;

      const inputLine: TerminalOutputLine = {
        id: `in-${Date.now()}-${Math.random()}`,
        type: 'input',
        text: `${adapter.promptPrefix} ${trimmed}`,
        timestamp: Date.now(),
      };

      setLines((prev) => [...prev, inputLine]);
      setHistory((prev) => [trimmed, ...prev.filter((h) => h !== trimmed)]);
      setHistoryIndex(-1);
      setInput('');
      setIsExecuting(true);

      if (trimmed.toLowerCase() === 'clear') {
        setLines([]);
        setIsExecuting(false);
        return;
      }

      try {
        const result = await adapter.execute(trimmed);

        const newLines: TerminalOutputLine[] = [];

        if (result.stdout) {
          newLines.push({
            id: `out-${Date.now()}-${Math.random()}`,
            type: result.exitCode === 0 ? 'stdout' : 'stderr',
            text: result.stdout,
            timestamp: Date.now(),
          });
        }

        if (result.stderr) {
          newLines.push({
            id: `err-${Date.now()}-${Math.random()}`,
            type: 'stderr',
            text: result.stderr,
            timestamp: Date.now(),
          });
        }

        if (result.hint) {
          newLines.push({
            id: `hint-${Date.now()}-${Math.random()}`,
            type: 'hint',
            text: `💡 Hint: ${result.hint}`,
            timestamp: Date.now(),
          });
        }

        setLines((prev) => [...prev, ...newLines]);
        if (onCommandExecuted) {
          onCommandExecuted(trimmed, result);
        }
      } catch (err: any) {
        setLines((prev) => [
          ...prev,
          {
            id: `err-${Date.now()}`,
            type: 'stderr',
            text: `Error executing command: ${err?.message || err}`,
            timestamp: Date.now(),
          },
        ]);
      } finally {
        setIsExecuting(false);
      }
    };

    useImperativeHandle(ref, () => ({
      executeCommand: async (cmd: string) => {
        await runCommandInternal(cmd);
      },
      clear: () => setLines([]),
      focus: () => inputRef.current?.focus(),
    }));

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        runCommandInternal(input);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (history.length === 0) return;
        const nextIndex = Math.min(historyIndex + 1, history.length - 1);
        setHistoryIndex(nextIndex);
        setInput(history[nextIndex]);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (historyIndex > 0) {
          const prevIndex = historyIndex - 1;
          setHistoryIndex(prevIndex);
          setInput(history[prevIndex]);
        } else if (historyIndex === 0) {
          setHistoryIndex(-1);
          setInput('');
        }
      } else if (e.key === 'Tab') {
        e.preventDefault();
        if (adapter.getCompletions && input.trim()) {
          const completions = adapter.getCompletions(input.trim());
          if (completions.length === 1) {
            setInput(completions[0]);
          } else if (completions.length > 1) {
            setLines((prev) => [
              ...prev,
              {
                id: `tab-${Date.now()}`,
                type: 'info',
                text: completions.join('    '),
                timestamp: Date.now(),
              },
            ]);
          }
        }
      }
    };

    const getTechnologyColor = () => {
      switch (adapter.technology) {
        case 'git':
          return 'text-orange-400 bg-orange-500/10 border-orange-500/30';
        case 'docker':
          return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30';
        case 'kubernetes':
          return 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30';
        default:
          return 'text-slate-400 bg-slate-500/10 border-slate-500/30';
      }
    };

    return (
      <div
        className={`flex flex-col h-full rounded-xl border border-slate-700/80 bg-slate-950 font-mono text-xs shadow-2xl overflow-hidden ${className}`}
      >
        {/* Terminal Header Bar */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900/90 border-b border-slate-800 select-none">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
            </div>
            <span className="text-[11px] font-semibold text-slate-300 ml-2">
              {title || `${adapter.technology.toUpperCase()} Shell`}
            </span>
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded border font-mono uppercase ${getTechnologyColor()}`}
            >
              {adapter.technology}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setLines([])}
              className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 text-[10px] transition-all"
              title="Clear terminal"
            >
              clear
            </button>
            {adapter.reset && (
              <button
                onClick={() => {
                  adapter.reset?.();
                  setLines([
                    {
                      id: `rst-${Date.now()}`,
                      type: 'warning',
                      text: `[SYSTEM] Environment state reset to initial baseline.`,
                      timestamp: Date.now(),
                    },
                  ]);
                }}
                className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 text-[10px] transition-all"
                title="Reset engine state"
              >
                reset
              </button>
            )}
          </div>
        </div>

        {/* Terminal Output Area */}
        <div
          className="flex-1 p-4 overflow-y-auto space-y-1.5 min-h-[160px] select-text bg-slate-950"
          onClick={() => inputRef.current?.focus()}
        >
          {lines.map((line) => {
            if (line.type === 'input') {
              return (
                <div key={line.id} className="text-cyan-300 font-semibold flex gap-2">
                  <span>{line.text}</span>
                </div>
              );
            }
            if (line.type === 'stderr') {
              return (
                <div key={line.id} className="text-rose-400 whitespace-pre-wrap leading-relaxed">
                  {line.text}
                </div>
              );
            }
            if (line.type === 'hint') {
              return (
                <div key={line.id} className="text-amber-300 whitespace-pre-wrap leading-relaxed">
                  {line.text}
                </div>
              );
            }
            if (line.type === 'warning') {
              return (
                <div key={line.id} className="text-amber-400/90 whitespace-pre-wrap leading-relaxed">
                  {line.text}
                </div>
              );
            }
            if (line.type === 'info') {
              return (
                <div key={line.id} className="text-slate-400 whitespace-pre-wrap leading-relaxed">
                  {line.text}
                </div>
              );
            }
            return (
              <div key={line.id} className="text-slate-200 whitespace-pre-wrap leading-relaxed">
                {line.text}
              </div>
            );
          })}

          {isExecuting && (
            <div className="text-slate-500 animate-pulse text-[11px]">
              Executing {adapter.technology} command...
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input Bar */}
        {!readOnly && (
          <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-900/90 border-t border-slate-800">
            <span className="text-emerald-400 font-bold select-none">{adapter.promptPrefix}</span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isExecuting}
              placeholder="type command here..."
              className="flex-1 bg-transparent text-slate-100 placeholder-slate-600 focus:outline-none font-mono text-xs"
              autoFocus
              spellCheck={false}
              autoComplete="off"
            />
          </div>
        )}
      </div>
    );
  }
);

UniversalTerminal.displayName = 'UniversalTerminal';
