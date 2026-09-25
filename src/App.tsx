import React, { Suspense } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { SuiteHeaderNav } from './components/layout/SuiteHeaderNav';
import { ForgeSuiteHomeView } from './components/home/ForgeSuiteHomeView';
import { Agentation } from 'agentation';

import { TechnologyType } from './platform/lesson-runtime/types';
import { ProgressProvider, ProgressSettingsModal } from './progress';
import { SuiteErrorBoundary } from './platform/errors/SuiteErrorBoundary';

// Code-split heavy academy engines and secondary views for optimal initial page latency
const CommitForgeApp = React.lazy(() =>
  import('./commitforge/CommitForgeApp').then((m) => ({ default: m.CommitForgeApp }))
);
const PodForgeApp = React.lazy(() =>
  import('./podforge/PodForgeApp').then((m) => ({ default: m.PodForgeApp }))
);
const DockForgeApp = React.lazy(() =>
  import('./dockforge/DockForgeApp').then((m) => ({ default: m.DockForgeApp }))
);
const DevOpsRoadmapView = React.lazy(() =>
  import('./components/roadmap/DevOpsRoadmapView').then((m) => ({ default: m.DevOpsRoadmapView }))
);
const UniversalProblemSolver = React.lazy(() =>
  import('./platform/search/UniversalProblemSolver').then((m) => ({ default: m.UniversalProblemSolver }))
);

const ViewLoadingFallback: React.FC<{ label?: string }> = ({ label = 'Loading Academy Engine...' }) => (
  <div
    style={{
      flex: 1,
      minHeight: 'calc(100vh - 60px)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(ellipse at top, #0f172a 0%, #030712 100%)',
      color: '#94a3b8',
      gap: '1rem',
    }}
  >
    <div
      style={{
        width: '32px',
        height: '32px',
        borderRadius: '50%',
        border: '3px solid rgba(56, 189, 248, 0.2)',
        borderTopColor: '#38bdf8',
        animation: 'spin 0.8s linear infinite',
      }}
    />
    <span style={{ fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.02em', color: '#cbd5e1' }}>
      {label}
    </span>
  </div>
);

const AppContent: React.FC = () => {
  const { mode, setMode, showProblemSearch, setShowProblemSearch, activeLessonConcept } = useApp();

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

  const handleSelectLessonFromSolver = (tech: TechnologyType, lessonId: string) => {
    if (tech === 'git') setMode('learn', lessonId);
    else if (tech === 'docker') setMode('dockforge', lessonId);
    else if (tech === 'kubernetes') setMode('podforge', lessonId);
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
            <Suspense fallback={<ViewLoadingFallback label="Loading DevOps Roadmap..." />}>
              <DevOpsRoadmapView />
            </Suspense>
          </main>
        </>
      );
    }

    if (mode === 'podforge') {
      return (
        <SuiteErrorBoundary fallbackTitle="PodForge Kubernetes Academy Error">
          <Suspense fallback={<ViewLoadingFallback label="Booting Kubernetes Engine..." />}>
            <PodForgeApp
              initialConceptId={activeLessonConcept || undefined}
              onSwitchToSuite={(newMode) => setMode(newMode)}
            />
          </Suspense>
        </SuiteErrorBoundary>
      );
    }

    if (mode === 'dockforge') {
      return (
        <SuiteErrorBoundary fallbackTitle="DockForge Docker Academy Error">
          <Suspense fallback={<ViewLoadingFallback label="Starting Docker Daemon..." />}>
            <DockForgeApp
              initialConceptId={activeLessonConcept || undefined}
              onSwitchToSuite={(newMode) => setMode(newMode)}
            />
          </Suspense>
        </SuiteErrorBoundary>
      );
    }

    return (
      <SuiteErrorBoundary fallbackTitle="CommitForge Git Academy Error">
        <Suspense fallback={<ViewLoadingFallback label="Initializing Git Academy..." />}>
          <CommitForgeApp onSwitchToSuite={(newMode) => setMode(newMode)} />
        </Suspense>
      </SuiteErrorBoundary>
    );
  };

  return (
    <>
      {renderActiveView()}
      {showProblemSearch && (
        <Suspense fallback={null}>
          <UniversalProblemSolver
            isOpen={showProblemSearch}
            onClose={() => setShowProblemSearch(false)}
            onSelectLesson={handleSelectLessonFromSolver}
          />
        </Suspense>
      )}
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
