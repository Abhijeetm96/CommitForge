import React from 'react';
import { DockerProvider, useDocker } from './context/DockerContext';
import { HeaderNav } from './components/layout/HeaderNav';
import { DockerAcademyView } from './components/academy/DockerAcademyView';
import { ContainerMeshVisualizer } from './components/visualizer/ContainerMeshVisualizer';
import { DockerLabsHubView } from './components/labs/DockerLabsHubView';
import { DockerIdeView } from './components/ide/DockerIdeView';
import './styles/dockforge.css';

interface DockForgeAppProps {
  onSwitchToSuite?: (mode: 'home' | 'learn' | 'podforge') => void;
}

const DockForgeContent: React.FC<DockForgeAppProps> = ({ onSwitchToSuite }) => {
  const { mode } = useDocker();

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
