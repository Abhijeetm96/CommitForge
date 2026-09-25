import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { KubeEngine } from '../kube-engine/engine';
import type { ClusterState, Pod, Node, CommandResult } from '../kube-engine/types';
import { KUBE_CHAPTERS } from '../data/topics';
import type { KubeConcept } from '../data/topics';
import { ProgressManager } from '../../progress/ProgressManager';
import { parseCurrentRoute, syncUrlWithMode } from '../../platform/routing/urlRouter';

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
  const [mode, setMode] = useState<AppMode>(() => {
    try {
      const saved = localStorage.getItem('podforge_initial_mode') as AppMode;
      if (saved && ['academy', 'labs', 'ide', 'cluster'].includes(saved)) {
        localStorage.removeItem('podforge_initial_mode');
        return saved;
      }
    } catch {}
    return 'academy';
  });
  const progressManager = useMemo(() => ProgressManager.getInstance(), []);
  const [activeConceptId, setActiveConceptIdState] = useState<string>(() => {
    try {
      const { conceptId } = parseCurrentRoute();
      if (conceptId && KUBE_CHAPTERS.some(ch => ch.concepts.some(c => c.id === conceptId))) {
        return conceptId;
      }
    } catch {}
    return progressManager.getAcademyProgress('podforge').currentLessonId || 'c-k8s-overview';
  });
  const [completedConcepts, setCompletedConcepts] = useState<string[]>(() => {
    return progressManager.getAcademyProgress('podforge').completedLessonIds;
  });

  useEffect(() => {
    return progressManager.subscribe((state) => {
      const ids = state.academies.podforge?.completedLessonIds || [];
      setCompletedConcepts([...ids]);
    });
  }, [progressManager]);

  const setActiveConceptId = (id: string) => {
    setActiveConceptIdState(id);
    progressManager.startLesson('podforge', id);
    syncUrlWithMode('podforge', id);
  };

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
    progressManager.completeLesson('podforge', id);
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
