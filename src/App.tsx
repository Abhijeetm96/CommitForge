import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { HeaderNav } from './components/layout/HeaderNav';
import { GitStateInspector } from './components/visualizer/GitStateInspector';
import { ThreeAreaVisualizer } from './components/visualizer/ThreeAreaVisualizer';
import { GitGraph } from './components/visualizer/GitGraph';
import { FileExplorer } from './components/editor/FileExplorer';
import { CodeEditor } from './components/editor/CodeEditor';
import { AppPreview } from './components/editor/AppPreview';
import { Terminal } from './components/terminal/Terminal';
import { LessonPanel } from './components/panels/LessonPanel';
import { First10MinutesView } from './components/labs/First10MinutesView';
import { FocusLessonView } from './components/learn/FocusLessonView';
import { TeacherLessonView } from './components/learn/TeacherLessonView';
import { GitJourneyView } from './components/journey/GitJourneyView';
import { GitAcademyView } from './components/academy/GitAcademyView';
import { GlobalProblemSearchModal } from './components/academy/GlobalProblemSearchModal';
import { CommandAtlasModal } from './components/navigation/CommandAtlasModal';
import { PillarsNavigatorModal } from './components/navigation/PillarsNavigatorModal';
import { PracticeView } from './components/practice/PracticeView';
import { DeveloperIdeView } from './components/ide/DeveloperIdeView';
import { LabsHubView } from './components/labs/LabsHubView';
import { CommandReferenceView } from './components/labs/CommandReferenceView';
import { InternalsModal } from './components/visualizer/InternalsModal';
import { ForgeTutor } from './components/tutor/ForgeTutor';
import { ImLostDrawer } from './components/tutor/ImLostDrawer';
import { OnboardingWizard } from './components/tutor/OnboardingWizard';
import { GitForHumansModal } from './components/tutor/GitForHumansModal';
import { GitMovieModal } from './components/animation/GitMovieModal';
import { Agentation } from 'agentation';
import { Database } from 'lucide-react';

const AppContent: React.FC = () => {
  const {
    mode,
    setMode,
    instructionMode,
    showOnboarding,
    setShowOnboarding,
    showLostDrawer,
    setShowLostDrawer,
    showGitMovie,
    setShowGitMovie,
    showCommandAtlas,
    setShowCommandAtlas,
    showProblemSearch,
    setShowProblemSearch,
    repo,
    executeCommand,
    activeHumansTerm,
    closeHumansModal,
    activeLessonConcept,
    setActiveLessonConcept,
  } = useApp();

  const [showInternalsModal, setShowInternalsModal] = useState(false);

  // Global ⌘K / Ctrl+K keyboard shortcut opens the Natural-Language Problem Solver
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setShowProblemSearch(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setShowProblemSearch]);

  // Check if current mode is a Labs sub-route
  const isLabsRoute =
    mode === 'labs' ||
    ['break-it', 'undo-lab', 'conflict-arena', 'hospital', 'two-dev', 'capstone', 'config-lab', 'discover'].includes(mode);

  return (
    <>
      <HeaderNav />

      <main
        className="main-content"
        style={{
          flex: '1 1 0%',
          display: 'flex',
          flexDirection: 'column',
          minHeight: 0,
          height: 'calc(100vh - 60px)',
          maxHeight: 'calc(100vh - 60px)',
          overflow: 'hidden',
        }}
      >
        {/* CANONICAL UNIFIED EXPERIENCE: 🎓 GIT ACADEMY (18 Topics + Universal Concept View + Sandbox) */}
        {(mode === 'learn' || mode === 'dashboard' || mode === 'roadmap' || mode === 'first10' || mode === 'visualize' || mode === 'community') && (
          <GitAcademyView initialConceptId={activeLessonConcept || 'c-git-commit'} />
        )}

        {/* EXPERIENCE 2: 🛠️ PRACTICE (Guided Developer Missions) */}
        {mode === 'practice' && <PracticeView />}

        {/* EXPERIENCE 3: 🔬 LABS (Break, Diagnose & Recover) */}
        {isLabsRoute && <LabsHubView />}

        {/* EXPERIENCE 4: 💻 DEVELOPER IDE (Work Like a Professional Developer) */}
        {mode === 'ide' && <DeveloperIdeView />}

        {/* REFERENCE / ENCYCLOPEDIA (Advanced/Expert Only) */}
        {mode === 'reference' && <CommandReferenceView />}
      </main>

      {/* Floating Git Internals Trigger Button - ONLY visible in Developer IDE or for Expert mode */}
      {(mode === 'ide' || instructionMode === 'expert') && (
        <button
          onClick={() => setShowInternalsModal(true)}
          style={{
            position: 'fixed',
            bottom: '16px',
            right: '16px',
            background: 'var(--bg-surface-elevated)',
            color: 'var(--git-orange)',
            border: '1px solid var(--git-orange)',
            padding: '0.5rem 1rem',
            borderRadius: '999px',
            fontSize: '0.8rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            cursor: 'pointer',
            boxShadow: 'var(--shadow-md)',
            zIndex: 90,
          }}
          title="Inspect .git/objects Object Database"
        >
          <Database size={15} />
          Git Internals DB
        </button>
      )}

      {/* Modals & Drawers */}
      {showInternalsModal && (
        <InternalsModal onClose={() => setShowInternalsModal(false)} />
      )}

      {showOnboarding && (
        <OnboardingWizard isOpen={showOnboarding} onClose={() => setShowOnboarding(false)} />
      )}

      {showLostDrawer && (
        <ImLostDrawer isOpen={showLostDrawer} onClose={() => setShowLostDrawer(false)} />
      )}

      {showGitMovie && (
        <GitMovieModal
          isOpen={showGitMovie}
          onClose={() => setShowGitMovie(false)}
          repo={repo}
          onExecuteCommand={executeCommand}
        />
      )}

      {activeHumansTerm && (
        <GitForHumansModal termId={activeHumansTerm} onClose={closeHumansModal} />
      )}

      {/* Global Natural-Language Problem Solver Modal ("What are you trying to do?") */}
      <GlobalProblemSearchModal
        isOpen={showProblemSearch}
        onClose={() => setShowProblemSearch(false)}
        onSelectConcept={(conceptId) => {
          setActiveLessonConcept(conceptId);
          setMode('learn');
        }}
      />

      {/* ⌘K Command Atlas Modal (Section 17) */}
      <CommandAtlasModal
        isOpen={showCommandAtlas}
        onClose={() => setShowCommandAtlas(false)}
        onSelectConcept={(conceptId) => {
          setActiveLessonConcept(conceptId);
          setMode('learn');
        }}
      />

      {/* 5 Pillars Navigator Modal (Definition, Syntax, Variations, Examples, Explanation) */}
      <PillarsNavigatorModal />

      {/* Visual Feedback toolbar for AI Agents & Developers */}
      <Agentation />
    </>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
