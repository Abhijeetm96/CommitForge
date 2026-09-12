import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { GitEngine } from '../git-engine/engine';
import { GitRepo, CommandResult, StateInspectorData, WhyExplanation, CommandComparison } from '../git-engine/types';
import { PROJECTS, ProjectDefinition } from '../data/projects';
import { LESSONS, Lesson, LEVELS } from '../data/curriculum';

export type ViewMode =
  | 'dashboard'
  | 'first10'
  | 'learn'
  | 'practice'
  | 'labs'
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

export type CompetencyLevel = 'not_assessed' | 'introduced' | 'practiced' | 'understood' | 'independent' | 'mastered';

export interface SkillMastery {
  level: CompetencyLevel;
  score: number; // 0 to 100
  evidenceCount: number;
}

export interface EvidenceMastery {
  foundations: SkillMastery;
  filesAndChanges: SkillMastery;
  staging: SkillMastery;
  commits: SkillMastery;
  branches: SkillMastery;
  merging: SkillMastery;
  recovery: SkillMastery;
}

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

export interface EngineDiff {
  command: string;
  whatHappened: string;
  whatChanged: string[];
  whatDidNotChange: string[];
  why: string;
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
  lastEngineDiff: EngineDiff | null;
  setLastWhyExplanation: (w: WhyExplanation | null) => void;
  setLastComparison: (c: CommandComparison | null) => void;
  
  // Danger Warning Modal
  dangerPrompt: { rawCommand: string; dangerInfo: any } | null;
  confirmDangerCommand: () => void;
  cancelDangerCommand: () => void;

  // Evidence-Based Mastery
  mastery: MasteryScores;
  evidenceMastery: EvidenceMastery;
  recordSkillEvidence: (skill: keyof EvidenceMastery, level: CompetencyLevel) => void;
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

  // Labs Hub
  activeLab: 'break-it' | 'undo-lab' | 'conflict-arena' | 'hospital' | 'two-dev' | 'capstone' | 'config-lab' | 'discover';
  setActiveLab: (l: 'break-it' | 'undo-lab' | 'conflict-arena' | 'hospital' | 'two-dev' | 'capstone' | 'config-lab' | 'discover') => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setModeState] = useState<ViewMode>('dashboard');
  const [instructionMode, setInstructionModeState] = useState<InstructionMode>(() => {
    return (localStorage.getItem('commitforge_instruction_mode') as InstructionMode) || 'beginner';
  });
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [projectKey, setProjectKeyState] = useState<string>('personal-website');

  const setInstructionMode = (im: InstructionMode) => {
    setInstructionModeState(im);
    localStorage.setItem('commitforge_instruction_mode', im);
  };

  const setMode = (m: ViewMode) => {
    setModeState(m);
  };

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
  const [lastEngineDiff, setLastEngineDiff] = useState<EngineDiff | null>(null);

  // Danger modal
  const [dangerPrompt, setDangerPrompt] = useState<{ rawCommand: string; dangerInfo: any } | null>(null);

  // Evidence-based Mastery (starts at 0% / not_assessed)
  const [evidenceMastery, setEvidenceMastery] = useState<EvidenceMastery>({
    foundations: { level: 'not_assessed', score: 0, evidenceCount: 0 },
    filesAndChanges: { level: 'not_assessed', score: 0, evidenceCount: 0 },
    staging: { level: 'not_assessed', score: 0, evidenceCount: 0 },
    commits: { level: 'not_assessed', score: 0, evidenceCount: 0 },
    branches: { level: 'not_assessed', score: 0, evidenceCount: 0 },
    merging: { level: 'not_assessed', score: 0, evidenceCount: 0 },
    recovery: { level: 'not_assessed', score: 0, evidenceCount: 0 },
  });

  const recordSkillEvidence = (skill: keyof EvidenceMastery, level: CompetencyLevel) => {
    const scoreMap: Record<CompetencyLevel, number> = {
      not_assessed: 0,
      introduced: 25,
      practiced: 50,
      understood: 75,
      independent: 90,
      mastered: 100,
    };
    setEvidenceMastery(prev => {
      const current = prev[skill];
      const newScore = Math.max(current.score, scoreMap[level]);
      return {
        ...prev,
        [skill]: {
          level,
          score: newScore,
          evidenceCount: current.evidenceCount + 1,
        },
      };
    });
  };

  const mastery: MasteryScores = useMemo(() => ({
    status: evidenceMastery.foundations.score,
    staging: evidenceMastery.staging.score,
    commits: evidenceMastery.commits.score,
    branches: evidenceMastery.branches.score,
    merging: evidenceMastery.merging.score,
    rebase: Math.round((evidenceMastery.branches.score + evidenceMastery.commits.score) / 2),
    recovery: evidenceMastery.recovery.score,
    remotes: Math.round(evidenceMastery.branches.score * 0.8),
  }), [evidenceMastery]);

  // Beginner-First & Tutor State
  const [showOnboarding, setShowOnboarding] = useState<boolean>(() => {
    return !localStorage.getItem('commitforge_onboarded');
  });
  const [showLostDrawer, setShowLostDrawer] = useState(false);
  const [activeHumansTerm, setActiveHumansTerm] = useState<string | null>(null);
  const [first10Step, setFirst10Step] = useState(1);
  const [replayTrigger, setReplayTrigger] = useState(0);
  const [activeLab, setActiveLab] = useState<'break-it' | 'undo-lab' | 'conflict-arena' | 'hospital' | 'two-dev' | 'capstone' | 'config-lab' | 'discover'>('break-it');

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
      recordSkillEvidence('foundations', 'practiced');
      recordSkillEvidence('commits', 'practiced');
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
    const prevRepo = { ...engine.getRepo() };
    const prevStagedCount = Object.keys(prevRepo.index).length;

    const res = engine.execute(cmd);
    const nextRepo = engine.getRepo();
    const nextStagedCount = Object.keys(nextRepo.index).length;

    // Calculate EngineDiff ("Engine as Teacher")
    const trimmed = cmd.trim();
    let diff: EngineDiff | null = null;
    if (trimmed.startsWith('git add')) {
      diff = {
        command: cmd,
        whatHappened: 'Selected files were placed into the Staging Area (the packing box).',
        whatChanged: [`${nextStagedCount} file(s) are now staged and ready for the next snapshot.`],
        whatDidNotChange: ['No commit was created yet. History is unchanged.'],
        why: 'Git requires a two-step commit rhythm: git add prepares the box, git commit seals the box.',
      };
      recordSkillEvidence('staging', 'practiced');
    } else if (trimmed.startsWith('git commit')) {
      if (prevStagedCount === 0 && Object.keys(prevRepo.workingDirectory).length > 0) {
        res.stderr.push('💡 Educational Mentor Note: You tried to commit, but Git has no staged changes.');
        res.stderr.push('Remember: Desk ➔ Packing Box ➔ Snapshot.');
        res.stderr.push('Your changes are still on the desk. Run `git add <file>` first!');
      } else if (res.exitCode === 0) {
        const headSha = nextRepo.head.type === 'branch' ? (nextRepo.branches[nextRepo.head.ref]?.targetCommitHash.substring(0, 7) || 'root') : 'commit';
        diff = {
          command: cmd,
          whatHappened: `Sealed a permanent snapshot (${headSha}) in your repository.`,
          whatChanged: ['New commit snapshot recorded in permanent history.', 'Staging area emptied.'],
          whatDidNotChange: ['Your working directory files remain safely on your desk.'],
          why: 'Commits are immutable historical snapshots that you can always inspect or return to.',
        };
        recordSkillEvidence('commits', 'practiced');
      }
    } else if (trimmed === 'pwd') {
      diff = {
        command: 'pwd',
        whatHappened: 'Printed current working directory path.',
        whatChanged: ['Terminal displayed your active location.'],
        whatDidNotChange: ['No files or Git history were modified.'],
        why: 'Verifying your location ensures commands are run in the right folder.',
      };
      recordSkillEvidence('foundations', 'practiced');
    } else if (trimmed === 'ls') {
      diff = {
        command: 'ls',
        whatHappened: 'Listed all files in the current folder.',
        whatChanged: ['Terminal printed project files.'],
        whatDidNotChange: ['No files or Git history were modified.'],
        why: 'Always inspect your files before making edits.',
      };
      recordSkillEvidence('foundations', 'practiced');
    } else if (trimmed.startsWith('git init')) {
      diff = {
        command: 'git init',
        whatHappened: 'Initialized a new Git repository.',
        whatChanged: ['Created hidden .git tracking database.'],
        whatDidNotChange: ['Existing files were untouched.'],
        why: 'Git is now ready to compare your files with saved versions.',
      };
      recordSkillEvidence('foundations', 'practiced');
    } else if (trimmed.startsWith('git status')) {
      diff = {
        command: 'git status',
        whatHappened: 'Compared working directory files against staging and commit history.',
        whatChanged: ['Displayed status report.'],
        whatDidNotChange: ['Nothing. git status is completely read-only.'],
        why: 'Run status before and after commands to stay aware of repository state.',
      };
      recordSkillEvidence('foundations', 'practiced');
    }

    if (diff) {
      setLastEngineDiff(diff);
    }

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
        lastEngineDiff,
        setLastWhyExplanation,
        setLastComparison,
        dangerPrompt,
        confirmDangerCommand,
        cancelDangerCommand,
        mastery,
        evidenceMastery,
        recordSkillEvidence,
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
        activeLab,
        setActiveLab,
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
