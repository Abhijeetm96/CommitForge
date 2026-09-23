import React, { createContext, useContext, useState, useMemo, useCallback, useEffect } from 'react';
import { DockerEngine } from '../docker-engine/engine';
import { Container, DockerImage, DockerVolume, DockerNetwork, DockerCommandResult } from '../docker-engine/types';
import { DOCKER_14_TOPICS, DOCKER_UNIVERSAL_CONCEPTS, UniversalDockerConcept } from '../data/unifiedDockerData';
import { ProgressManager } from '../../progress/ProgressManager';

export type DockMode = 'academy' | 'labs' | 'ide' | 'visualizer';

interface TerminalEntry {
  command?: string;
  stdout?: string[];
  stderr?: string[];
  exitCode?: number;
}

export interface DockerContextType {
  mode: DockMode;
  setMode: (m: DockMode) => void;
  
  // Curriculum state
  activeTopicId: string;
  setActiveTopicId: (id: string) => void;
  activeConceptId: string;
  setActiveConceptId: (id: string) => void;
  currentConcept: UniversalDockerConcept;
  completedConceptIds: string[];
  markConceptComplete: (id: string) => void;

  // Docker Engine state
  engine: DockerEngine;
  containers: Container[];
  images: DockerImage[];
  volumes: DockerVolume[];
  networks: DockerNetwork[];

  // Terminal & Command Pipeline
  terminalHistory: TerminalEntry[];
  executeCommand: (cmd: string) => DockerCommandResult;
  clearTerminal: () => void;

  // IDE State
  activeIdeFile: string;
  setActiveIdeFile: (f: string) => void;
  dockerfileContent: string;
  setDockerfileContent: (c: string) => void;
  composeContent: string;
  setComposeContent: (c: string) => void;
}

const DockerContext = createContext<DockerContextType | null>(null);

export const DockerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<DockMode>(() => {
    try {
      const saved = localStorage.getItem('dockforge_initial_mode') as DockMode;
      if (saved && ['academy', 'labs', 'ide', 'visualizer'].includes(saved)) {
        localStorage.removeItem('dockforge_initial_mode');
        return saved;
      }
    } catch {}
    return 'academy';
  });
  const progressManager = useMemo(() => ProgressManager.getInstance(), []);
  const [activeTopicIdState, setActiveTopicIdState] = useState<string>(() => {
    return progressManager.getAcademyProgress('dockforge').currentTopicId || 'topic-01';
  });
  const [activeConceptIdState, setActiveConceptIdState] = useState<string>(() => {
    return progressManager.getAcademyProgress('dockforge').currentLessonId || 'c-what-are-containers';
  });
  const [completedConceptIds, setCompletedConceptIds] = useState<string[]>(() => {
    return progressManager.getAcademyProgress('dockforge').completedLessonIds;
  });

  useEffect(() => {
    return progressManager.subscribe((state) => {
      const ids = state.academies.dockforge?.completedLessonIds || [];
      setCompletedConceptIds([...ids]);
    });
  }, [progressManager]);

  const setActiveTopicId = useCallback((topicId: string) => {
    setActiveTopicIdState(topicId);
    const topic = DOCKER_14_TOPICS.find((t) => t.id === topicId);
    if (topic && topic.concepts.length > 0) {
      setActiveConceptIdState((currConceptId) => {
        const belongs = topic.concepts.some((c) => c.id === currConceptId);
        return belongs ? currConceptId : topic.concepts[0].id;
      });
    }
  }, []);

  const setActiveConceptId = useCallback((conceptId: string) => {
    setActiveConceptIdState(conceptId);
    progressManager.startLesson('dockforge', conceptId);
    const parentTopic = DOCKER_14_TOPICS.find((t) => t.concepts.some((c) => c.id === conceptId));
    if (parentTopic) {
      setActiveTopicIdState(parentTopic.id);
    }
  }, [progressManager]);

  const activeTopicId = activeTopicIdState;
  const activeConceptId = activeConceptIdState;

  // Engine instance
  const engine = useMemo(() => new DockerEngine(), []);
  const [containers, setContainers] = useState<Container[]>(() => engine.getContainers());
  const [images, setImages] = useState<DockerImage[]>(() => engine.getImages());
  const [volumes, setVolumes] = useState<DockerVolume[]>(() => engine.getVolumes());
  const [networks, setNetworks] = useState<DockerNetwork[]>(() => engine.getNetworks());

  // Terminal history
  const [terminalHistory, setTerminalHistory] = useState<TerminalEntry[]>([
    {
      stdout: [
        'Welcome to DockForge Virtual Docker Engine v26.0.0',
        'Type "docker --help" or "docker ps" to get started.',
      ],
    },
  ]);

  // IDE Files
  const [activeIdeFile, setActiveIdeFile] = useState<string>('Dockerfile');
  const [dockerfileContent, setDockerfileContent] = useState<string>(`FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 8080
CMD ["npm", "start"]`);

  const [composeContent, setComposeContent] = useState<string>(`version: '3.8'

services:
  web:
    build: .
    ports:
      - "8080:8080"
    environment:
      - NODE_ENV=production
      - DB_HOST=db
    depends_on:
      - db

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_PASSWORD: secretpassword
      POSTGRES_DB: production_db
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:`);

  const currentConcept = useMemo(() => {
    return (
      DOCKER_UNIVERSAL_CONCEPTS[activeConceptId] ||
      DOCKER_UNIVERSAL_CONCEPTS['c-what-are-containers']
    );
  }, [activeConceptId]);

  const markConceptComplete = useCallback((id: string) => {
    progressManager.completeLesson('dockforge', id);
  }, [progressManager]);

  const executeCommand = useCallback(
    (rawCommand: string): DockerCommandResult => {
      const res = engine.executeCommand(rawCommand);

      // Update state snapshot after command execution
      setContainers(engine.getContainers());
      setImages(engine.getImages());
      setVolumes(engine.getVolumes());
      setNetworks(engine.getNetworks());

      setTerminalHistory((prev) => [
        ...prev,
        {
          command: rawCommand,
          stdout: res.stdout,
          stderr: res.stderr,
          exitCode: res.exitCode,
        },
      ]);

      return res;
    },
    [engine]
  );

  const clearTerminal = useCallback(() => {
    setTerminalHistory([]);
  }, []);

  return (
    <DockerContext.Provider
      value={{
        mode,
        setMode,
        activeTopicId,
        setActiveTopicId,
        activeConceptId,
        setActiveConceptId,
        currentConcept,
        completedConceptIds,
        markConceptComplete,
        engine,
        containers,
        images,
        volumes,
        networks,
        terminalHistory,
        executeCommand,
        clearTerminal,
        activeIdeFile,
        setActiveIdeFile,
        dockerfileContent,
        setDockerfileContent,
        composeContent,
        setComposeContent,
      }}
    >
      {children}
    </DockerContext.Provider>
  );
};

export const useDocker = () => {
  const ctx = useContext(DockerContext);
  if (!ctx) {
    throw new Error('useDocker must be used within a DockerProvider');
  }
  return ctx;
};
