import React from 'react';
import { DockerProvider, useDocker } from './context/DockerContext';
import { HeaderNav } from './components/layout/HeaderNav';
import { DockerAcademyView } from './components/academy/DockerAcademyView';
import { ContainerMeshVisualizer } from './components/visualizer/ContainerMeshVisualizer';
import { DockerLabsHubView } from './components/labs/DockerLabsHubView';
import { DockerIdeView } from './components/ide/DockerIdeView';
import { UniversalLessonRuntime } from '../platform/lesson-runtime/UniversalLessonRuntime';
import { DockerRuntimeAdapter, dockerLessonAdapter } from '../platform/adapters/dockerAdapter';
import { ViewMode } from '../context/AppContext';
import './styles/dockforge.css';

interface DockForgeAppProps {
  initialConceptId?: string;
  onSwitchToSuite?: (mode: ViewMode) => void;
}

const DockForgeContent: React.FC<DockForgeAppProps> = ({ onSwitchToSuite, initialConceptId }) => {
  const { mode, setMode, activeConceptId, setActiveConceptId, currentConcept, engine } = useDocker();

  React.useEffect(() => {
    if (initialConceptId && initialConceptId !== activeConceptId) {
      setActiveConceptId(initialConceptId);
      if (mode !== 'academy') {
        setMode('academy');
      }
    }
  }, [initialConceptId, activeConceptId, mode, setActiveConceptId, setMode]);

  return (
    <div className="dockforge-container" style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', overflow: 'hidden' }}>
      <HeaderNav onSwitchToSuite={onSwitchToSuite} />
      <main
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minHeight: 0,
          height: 'calc(100vh - 60px)',
          maxHeight: 'calc(100vh - 60px)',
          overflow: 'hidden',
        }}
      >
        {mode === 'academy' && <DockerAcademyView />}
        {(mode === 'lesson' || mode === 'guided-lesson') && (
          <UniversalLessonRuntime
            lesson={dockerLessonAdapter(currentConcept)}
            adapter={new DockerRuntimeAdapter(engine)}
            onNextLesson={() => setMode('academy')}
            onPrevLesson={() => setMode('academy')}
          />
        )}
        {mode === 'visualizer' && <ContainerMeshVisualizer />}
        {mode === 'labs' && <DockerLabsHubView />}
        {mode === 'ide' && <DockerIdeView />}
      </main>
    </div>
  );
};

export const DockForgeApp: React.FC<DockForgeAppProps> = (props) => {
  return (
    <DockerProvider>
      <DockForgeContent {...props} />
    </DockerProvider>
  );
};
