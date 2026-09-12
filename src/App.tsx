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
import { DashboardView } from './components/dashboard/DashboardView';
import { First10MinutesView } from './components/labs/First10MinutesView';
import { CommandDiscoveryView } from './components/labs/CommandDiscoveryView';
import { BreakItView } from './components/labs/BreakItView';
import { ConfigLabView } from './components/labs/ConfigLabView';
import { UndoLabView } from './components/labs/UndoLabView';
import { ConflictArenaView } from './components/labs/ConflictArenaView';
import { GitHospitalView } from './components/labs/GitHospitalView';
import { TwoDevView } from './components/labs/TwoDevView';
import { CapstoneView } from './components/labs/CapstoneView';
import { CommandReferenceView } from './components/labs/CommandReferenceView';
import { InternalsModal } from './components/visualizer/InternalsModal';
import { ForgeTutor } from './components/tutor/ForgeTutor';
import { ImLostDrawer } from './components/tutor/ImLostDrawer';
import { OnboardingWizard } from './components/tutor/OnboardingWizard';
import { GitForHumansModal } from './components/tutor/GitForHumansModal';
import { Database } from 'lucide-react';

const AppContent: React.FC = () => {
  const {
    mode,
    showOnboarding,
    setShowOnboarding,
    showLostDrawer,
    setShowLostDrawer,
    activeHumansTerm,
    closeHumansModal,
  } = useApp();

  const [showInternalsModal, setShowInternalsModal] = useState(false);

  // Dedicated modes manage their own visualizers
  const isCustomLayoutMode = ['first10', 'discover', 'break-it', 'config-lab', 'dashboard'].includes(mode);

  return (
    <>
      <HeaderNav />

      {!isCustomLayoutMode && (
        <>
          <GitStateInspector />
          <ThreeAreaVisualizer />
        </>
      )}

      <main className="main-content">
        {mode === 'dashboard' && <DashboardView />}
        {mode === 'first10' && <First10MinutesView />}
        {mode === 'discover' && <CommandDiscoveryView />}
        {mode === 'break-it' && <BreakItView />}
        {mode === 'config-lab' && <ConfigLabView />}

        {mode === 'learn' && (
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, position: 'relative' }}>
            <LessonPanel />
            <div className="ide-workspace">
              <FileExplorer />
              <CodeEditor />
              <div className="terminal-preview-column">
                <AppPreview />
                <Terminal />
              </div>
            </div>
            <div style={{ padding: '0.5rem 1rem' }}>
              <ForgeTutor />
            </div>
            <GitGraph />
          </div>
        )}

        {mode === 'ide' && (
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
            <div className="ide-workspace">
              <FileExplorer />
              <CodeEditor />
              <div className="terminal-preview-column">
                <AppPreview />
                <Terminal />
              </div>
            </div>
            <GitGraph />
          </div>
        )}

        {mode === 'undo-lab' && <UndoLabView />}
        {mode === 'conflict-arena' && <ConflictArenaView />}
        {mode === 'hospital' && <GitHospitalView />}
        {mode === 'two-dev' && <TwoDevView />}
        {mode === 'capstone' && <CapstoneView />}
        {mode === 'reference' && <CommandReferenceView />}
      </main>

      {/* Floating Git Internals Trigger Button */}
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

      {activeHumansTerm && (
        <GitForHumansModal termId={activeHumansTerm} onClose={closeHumansModal} />
      )}
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
