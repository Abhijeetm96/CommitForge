import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { SuiteHeaderNav } from './components/layout/SuiteHeaderNav';
import { ForgeSuiteHomeView } from './components/home/ForgeSuiteHomeView';
import { DevOpsRoadmapView } from './components/roadmap/DevOpsRoadmapView';
import { CommitForgeApp } from './commitforge/CommitForgeApp';
import { PodForgeApp } from './podforge/PodForgeApp';
import { Agentation } from 'agentation';

const AppContent: React.FC = () => {
  const { mode, setMode, setShowProblemSearch } = useApp();

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
        <Agentation />
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
        <Agentation />
      </>
    );
  }

  if (mode === 'podforge') {
    return (
      <>
        <PodForgeApp onSwitchToSuite={(newMode) => setMode(newMode)} />
        <Agentation />
      </>
    );
  }

  // Active Git Academy: CommitForge
  return (
    <>
      <CommitForgeApp onSwitchToSuite={(newMode) => setMode(newMode)} />
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
