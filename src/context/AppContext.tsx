import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { GitEngine } from '../git-engine/engine';
import { GitRepo, CommandResult, StateInspectorData, WhyExplanation, CommandComparison } from '../git-engine/types';
import { PROJECTS, ProjectDefinition } from '../data/projects';
import { LESSONS, Lesson, LEVELS } from '../data/curriculum';

export type ViewMode =
  | 'dashboard'
  | 'first10'
  | 'learn'
  | 'ide'
  | 'discover'
  | 'undo-lab'
  | 'conflict-arena'
  | 'hospital'
  | 'break-it'
  | 'rebase-lab'
  | 'two-dev'
  | 'capstone'
  | 'reference'
  | 'config-lab';

export type InstructionMode = 'beginner' | 'intermediate' | 'advanced' | 'expert';

export interface MasteryScores {
  status: number;
  staging: number;
  commits: number;
  branches: number;
  merging: number;
  rebase: number;
  recovery: number;
  remotes: number;
}

export interface AppContextType {
  mode: ViewMode;
  setMode: (m: ViewMode) => void;
  instructionMode: InstructionMode;
  setInstructionMode: (im: InstructionMode) => void;
  theme: 'dark' | 'light';
  setTheme: (t: 'dark' | 'light') => void;
  
  // Project & Engine
  currentProject: ProjectDefinition;
  setProjectKey: (key: string) => void;
  engine: GitEngine;
  repo: GitRepo;
  inspection: StateInspectorData;
  
  // Editor State
  activeFile: string | null;
  setActiveFile: (f: string | null) => void;
  openFiles: string[];
  openFileTab: (f: string) => void;
  closeFileTab: (f: string) => void;
  updateEditorContent: (path: string, content: string) => void;

  // Terminal & Command Pipeline
  terminalHistory: { command?: string; stdout?: string[]; stderr?: string[]; exitCode?: number }[];
  executeCommand: (cmd: string) => CommandResult;
  clearTerminal: () => void;

  // Curriculum & Lesson
  currentLesson: Lesson;
  setCurrentLessonId: (id: string) => void;
  completedLessonIds: string[];
  markLessonComplete: (id: string) => void;
  predictionRecord: { total: number; correct: number };
  recordPrediction: (correct: boolean) => void;

  // Educational Feedback & Explanations
  lastWhyExplanation: WhyExplanation | null;
  lastComparison: CommandComparison | null;
  setLastWhyExplanation: (w: WhyExplanation | null) => void;
  setLastComparison: (c: CommandComparison | null) => void;
  
  // Danger Warning Modal
  dangerPrompt: { rawCommand: string; dangerInfo: any } | null;
  confirmDangerCommand: () => void;
  cancelDangerCommand: () => void;

  // Mastery
  mastery: MasteryScores;
  resetCurrentExercise: () => void;

  // Beginner-First Tutor & Modal Controls
  showOnboarding: boolean;
  setShowOnboarding: (v: boolean) => void;
  showLostDrawer: boolean;
  setShowLostDrawer: (v: boolean) => void;
  activeHumansTerm: string | null;
  openHumansTerm: (termId: string) => void;
  closeHumansModal: () => void;
  first10Step: number;
  setFirst10Step: (s: number) => void;
  replayTrigger: number;
  triggerReplay: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<ViewMode>('dashboard');
  const [instructionMode, setInstructionMode] = useState<InstructionMode>('beginner');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [projectKey, setProjectKeyState] = useState<string>('personal-website');

  const currentProject = useMemo(() => PROJECTS[projectKey] || PROJECTS['personal-website'], [projectKey]);
  
  // Initialize GitEngine with current project files
  const engine = useMemo(() => new GitEngine(currentProject.files), [currentProject]);
  const [repo, setRepo] = useState<GitRepo>(engine.getRepo());
  const [inspection, setInspection] = useState<StateInspectorData>(engine.getInspection());

  // Subscribe to engine mutations
  useEffect(() => {
    return engine.subscribe(newRepo => {
      setRepo(newRepo);
      setInspection(engine.getInspection());
    });
  }, [engine]);

  // Editor tabs
  const initialFiles = Object.keys(currentProject.files);
  const [activeFile, setActiveFile] = useState<string | null>(initialFiles[0] || null);
  const [openFiles, setOpenFiles] = useState<string[]>(initialFiles.slice(0, 3));

  // Terminal History
  const [terminalHistory, setTerminalHistory] = useState<{ command?: string; stdout?: string[]; stderr?: string[]; exitCode?: number }[]>([
    {
      stdout: [
        'Welcome to CommitForge Interactive Terminal ⚡',
        'Type Git commands or Unix navigation (ls, pwd, cd, cat, touch, rm).',
        'Type `git status` or `git --help` to begin.',
      ],
    },
  ]);

  // Lessons
  const [currentLessonId, setCurrentLessonId] = useState<string>(LESSONS[0].id);
  const currentLesson = useMemo(() => LESSONS.find(l => l.id === currentLessonId) || LESSONS[0], [currentLessonId]);
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>([]);
  const [predictionRecord, setPredictionRecord] = useState<{ total: number; correct: number }>({ total: 0, correct: 0 });

  // Why explanation & comparisons
  const [lastWhyExplanation, setLastWhyExplanation] = useState<WhyExplanation | null>(null);
  const [lastComparison, setLastComparison] = useState<CommandComparison | null>(null);

  // Danger modal
  const [dangerPrompt, setDangerPrompt] = useState<{ rawCommand: string; dangerInfo: any } | null>(null);

  // Mastery
  const [mastery, setMastery] = useState<MasteryScores>({
    status: 40,
    staging: 35,
    commits: 30,
    branches: 20,
    merging: 15,
    rebase: 10,
    recovery: 15,
    remotes: 10,
  });

  // Beginner-First & Tutor State
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showLostDrawer, setShowLostDrawer] = useState(false);
  const [activeHumansTerm, setActiveHumansTerm] = useState<string | null>(null);
  const [first10Step, setFirst10Step] = useState(1);
  const [replayTrigger, setReplayTrigger] = useState(0);

  const openHumansTerm = (id: string) => setActiveHumansTerm(id);
  const closeHumansModal = () => setActiveHumansTerm(null);
  const triggerReplay = () => setReplayTrigger(prev => prev + 1);

  const recordPrediction = (correct: boolean) => {
    setPredictionRecord(prev => ({
      total: prev.total + 1,
      correct: prev.correct + (correct ? 1 : 0),
    }));
  };

  const markLessonComplete = (id: string) => {
    if (!completedLessonIds.includes(id)) {
      setCompletedLessonIds(prev => [...prev, id]);
      // Boost mastery scores
      setMastery(prev => ({
        ...prev,
        status: Math.min(100, prev.status + 5),
        staging: Math.min(100, prev.staging + 6),
        commits: Math.min(100, prev.commits + 5),
        branches: Math.min(100, prev.branches + 7),
        merging: Math.min(100, prev.merging + 8),
        recovery: Math.min(100, prev.recovery + 8),
      }));
    }
  };

  const setProjectKey = (key: string) => {
    setProjectKeyState(key);
    const proj = PROJECTS[key] || PROJECTS['personal-website'];
    engine.setRepo({
      ...engine.getRepo(),
      workingDirectory: { ...proj.files },
      index: {},
    });
    const keys = Object.keys(proj.files);
    setActiveFile(keys[0] || null);
    setOpenFiles(keys.slice(0, 3));
  };

  const openFileTab = (path: string) => {
    if (!openFiles.includes(path)) {
      setOpenFiles(prev => [...prev, path]);
    }
    setActiveFile(path);
  };

  const closeFileTab = (path: string) => {
    const next = openFiles.filter(p => p !== path);
    setOpenFiles(next);
    if (activeFile === path) {
      setActiveFile(next[0] || null);
    }
  };

  const updateEditorContent = (path: string, content: string) => {
    engine.updateFileContent(path, content);
  };

  const executeCommand = (cmd: string): CommandResult => {
    const res = engine.execute(cmd);

    if (res.whyExplanation) {
      setLastWhyExplanation(res.whyExplanation);
    }
    if (res.comparisons) {
      setLastComparison(res.comparisons);
    }

    if (res.stdout[0] === '__CLEAR__') {
      setTerminalHistory([]);
      return res;
    }

    setTerminalHistory(prev => [
      ...prev,
      {
        command: cmd,
        stdout: res.stdout,
        stderr: res.stderr,
        exitCode: res.exitCode,
      },
    ]);

    return res;
  };

  const clearTerminal = () => setTerminalHistory([]);

  const confirmDangerCommand = () => {
    if (dangerPrompt) {
      executeCommand(dangerPrompt.rawCommand);
      setDangerPrompt(null);
    }
  };

  const cancelDangerCommand = () => setDangerPrompt(null);

  const resetCurrentExercise = () => {
    engine.resetRepo();
    setTerminalHistory(prev => [
      ...prev,
      {
        stdout: ['Repository state has been reset to its initial clean state.'],
      },
    ]);
  };

  return (
    <AppContext.Provider
      value={{
        mode,
        setMode,
        instructionMode,
        setInstructionMode,
        theme,
        setTheme,
        currentProject,
        setProjectKey,
        engine,
        repo,
        inspection,
        activeFile,
        setActiveFile,
        openFiles,
        openFileTab,
        closeFileTab,
        updateEditorContent,
        terminalHistory,
        executeCommand,
        clearTerminal,
        currentLesson,
        setCurrentLessonId,
        completedLessonIds,
        markLessonComplete,
        predictionRecord,
        recordPrediction,
        lastWhyExplanation,
        lastComparison,
        setLastWhyExplanation,
        setLastComparison,
        dangerPrompt,
        confirmDangerCommand,
        cancelDangerCommand,
        mastery,
        resetCurrentExercise,
        showOnboarding,
        setShowOnboarding,
        showLostDrawer,
        setShowLostDrawer,
        activeHumansTerm,
        openHumansTerm,
        closeHumansModal,
        first10Step,
        setFirst10Step,
        replayTrigger,
        triggerReplay,
      }}
    >
      <div className={`app-root ${theme}`}>{children}</div>
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
};
