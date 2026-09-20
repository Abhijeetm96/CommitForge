import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { KubeEngine } from '../kube-engine/engine';
import type { ClusterState, Pod, Node, CommandResult } from '../kube-engine/types';
import { KUBE_CHAPTERS } from '../data/topics';
import type { KubeConcept } from '../data/topics';

export type AppMode = 'academy' | 'labs' | 'ide' | 'cluster';

interface TerminalHistoryItem {
  command?: string;
  stdout?: string[];
  stderr?: string[];
}

interface AppContextType {
  engine: KubeEngine;
  clusterState: ClusterState;
  mode: AppMode;
  setMode: (mode: AppMode) => void;
  activeConcept: KubeConcept;
  setActiveConceptId: (id: string) => void;
  completedConcepts: string[];
  markConceptComplete: (id: string) => void;
  terminalHistory: TerminalHistoryItem[];
  executeCommand: (cmd: string) => CommandResult;
  clearTerminal: () => void;
  selectedPod: Pod | null;
  setSelectedPod: (pod: Pod | null) => void;
  selectedNode: Node | null;
  setSelectedNode: (node: Node | null) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const engine = useMemo(() => new KubeEngine(), []);
  const [clusterState, setClusterState] = useState<ClusterState>(() => engine.getState());
  const [mode, setMode] = useState<AppMode>('academy');
  const [activeConceptId, setActiveConceptId] = useState<string>('c-pod-basics');
  const [completedConcepts, setCompletedConcepts] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('podforge_completed');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [selectedPod, setSelectedPod] = useState<Pod | null>(null);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  const [terminalHistory, setTerminalHistory] = useState<TerminalHistoryItem[]>([
    {
      stdout: [
        'Welcome to PodForge ☸️ In-Browser Virtual Kubernetes Environment',
        'Connected to cluster: podforge-k8s-us-east (v1.31.0)',
        'Type "kubectl get nodes" or "kubectl get pods" to begin.',
        '------------------------------------------------------------------',
      ],
    },
  ]);

  useEffect(() => {
    return engine.subscribe((newState) => {
      setClusterState({ ...newState });
      if (selectedPod && newState.pods[selectedPod.metadata.name]) {
        setSelectedPod({ ...newState.pods[selectedPod.metadata.name] });
      }
    });
  }, [engine, selectedPod]);

  const activeConcept = useMemo(() => {
    for (const ch of KUBE_CHAPTERS) {
      const found = ch.concepts.find((c) => c.id === activeConceptId);
      if (found) return found;
    }
    return KUBE_CHAPTERS[0].concepts[0];
  }, [activeConceptId]);

  const markConceptComplete = (id: string) => {
    setCompletedConcepts((prev) => {
      if (prev.includes(id)) return prev;
      const next = [...prev, id];
      try {
        localStorage.setItem('podforge_completed', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const executeCommand = (cmd: string): CommandResult => {
    const res = engine.execute(cmd);
    if (res.stdout.includes('__CLEAR__')) {
      setTerminalHistory([]);
      return res;
    }

    setTerminalHistory((prev) => [
      ...prev,
      {
        command: cmd,
        stdout: res.stdout.length > 0 ? res.stdout : undefined,
        stderr: res.stderr.length > 0 ? res.stderr : undefined,
      },
    ]);

    return res;
  };

  const clearTerminal = () => setTerminalHistory([]);

  return (
    <AppContext.Provider
      value={{
        engine,
        clusterState,
        mode,
        setMode,
        activeConcept,
        setActiveConceptId,
        completedConcepts,
        markConceptComplete,
        terminalHistory,
        executeCommand,
        clearTerminal,
        selectedPod,
        setSelectedPod,
        selectedNode,
        setSelectedNode,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
