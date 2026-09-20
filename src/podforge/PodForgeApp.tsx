import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { HeaderNav } from './components/layout/HeaderNav';
import { PodAcademyView } from './components/academy/PodAcademyView';
import { PodLabsHubView } from './components/labs/PodLabsHubView';
import { ClusterIdeView } from './components/ide/ClusterIdeView';
import { ClusterCanvas } from './components/visualizer/ClusterCanvas';
import './styles/podforge.css';

interface PodForgeAppProps {
  onSwitchToSuite?: (mode: 'home' | 'learn' | 'roadmap') => void;
}

const PodForgeContent: React.FC<PodForgeAppProps> = ({ onSwitchToSuite }) => {
  const { mode } = useApp();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', overflow: 'hidden' }}>
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
        {mode === 'academy' && <PodAcademyView onSwitchToSuite={onSwitchToSuite} />}
        {mode === 'labs' && <PodLabsHubView />}
        {mode === 'ide' && <ClusterIdeView />}
        {mode === 'cluster' && <ClusterCanvas />}
      </main>
    </div>
  );
};

export const PodForgeApp: React.FC<PodForgeAppProps> = (props) => {
  return (
    <AppProvider>
      <PodForgeContent {...props} />
    </AppProvider>
  );
};
