import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { SuiteHeaderNav } from './components/layout/SuiteHeaderNav';
import { ForgeSuiteHomeView } from './components/home/ForgeSuiteHomeView';
import { DevOpsRoadmapView } from './components/roadmap/DevOpsRoadmapView';
import { CommitForgeApp } from './commitforge/CommitForgeApp';
import { PodForgeApp } from './podforge/PodForgeApp';
import { DockForgeApp } from './dockforge/DockForgeApp';
import { Agentation } from 'agentation';

import { UniversalProblemSolver } from './platform/search/UniversalProblemSolver';
import { TechnologyType } from './platform/lesson-runtime/types';
import { ProgressProvider, ProgressSettingsModal } from './progress';

const AppContent: React.FC = () => {
  const { mode, setMode, showProblemSearch, setShowProblemSearch } = useApp();

  // Global ⌘K / Ctrl+K keyboard shortcut opens the Universal Problem Solver
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

  const handleSelectLessonFromSolver = (tech: TechnologyType, _lessonId: string) => {
    if (tech === 'git') setMode('learn');
    else if (tech === 'docker') setMode('dockforge');
    else if (tech === 'kubernetes') setMode('podforge');
  };

  const renderActiveView = () => {
    if (mode === 'home') {
      return (
        <>
          <SuiteHeaderNav />
          <main
            className="main-content"
            style={{
              flex: '1 1 0%',
              display: 'flex',
              flexDirection: 'column',
              minHeight: 0,
              height: 'calc(100vh - 60px)',
              maxHeight: 'calc(100vh - 60px)',
              overflowY: 'auto',
              overflowX: 'hidden',
            }}
          >
            <ForgeSuiteHomeView />
          </main>
        </>
      );
    }

    if (mode === 'roadmap') {
      return (
        <>
          <SuiteHeaderNav />
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
            <DevOpsRoadmapView />
          </main>
        </>
      );
    }

    if (mode === 'podforge') {
      return <PodForgeApp onSwitchToSuite={(newMode) => setMode(newMode)} />;
    }

    if (mode === 'dockforge') {
      return <DockForgeApp onSwitchToSuite={(newMode) => setMode(newMode)} />;
    }

    return <CommitForgeApp onSwitchToSuite={(newMode) => setMode(newMode)} />;
  };

  return (
    <>
      {renderActiveView()}
      <UniversalProblemSolver
        isOpen={showProblemSearch}
        onClose={() => setShowProblemSearch(false)}
        onSelectLesson={handleSelectLessonFromSolver}
      />
      <ProgressSettingsModal />
      <Agentation />
    </>
  );
};

export default function App() {
  return (
    <ProgressProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </ProgressProvider>
  );
}
