// src/progress/ProgressContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { ProgressManager } from './ProgressManager';
import { ForgeSuiteProgress } from './progressTypes';

export interface ProgressContextValue {
  manager: ProgressManager;
  progress: ForgeSuiteProgress;
  isLoaded: boolean;
  showSettingsModal: boolean;
  setShowSettingsModal: (show: boolean) => void;
}

const ProgressContext = createContext<ProgressContextValue | null>(null);

export const ProgressProvider: React.FC<{
  manager?: ProgressManager;
  children: React.ReactNode;
}> = ({ manager: customManager, children }) => {
  const [manager] = useState<ProgressManager>(() => customManager || ProgressManager.getInstance());
  const [progress, setProgress] = useState<ForgeSuiteProgress>(() => manager.getState());
  const [isLoaded, setIsLoaded] = useState<boolean>(() => manager.getIsLoaded());
  const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false);

  useEffect(() => {
    let mounted = true;

    // Initialize manager asynchronously from storage
    manager.initialize().then(() => {
      if (mounted) {
        setIsLoaded(true);
        setProgress(manager.getState());
      }
    });

    // Subscribe to state updates
    const unsubscribe = manager.subscribe((latestState) => {
      if (mounted) {
        setProgress(latestState);
      }
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, [manager]);

  return (
    <ProgressContext.Provider
      value={{
        manager,
        progress,
        isLoaded,
        showSettingsModal,
        setShowSettingsModal,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
};

export function useProgressContext(): ProgressContextValue {
  const ctx = useContext(ProgressContext);
  if (!ctx) {
    throw new Error('useProgressContext must be used within a ProgressProvider');
  }
  return ctx;
}
