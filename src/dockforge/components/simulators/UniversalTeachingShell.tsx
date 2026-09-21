import React from 'react';
import { UniversalDockerConcept } from '../../data/unifiedDockerData';
import { ConceptTeachingEngine } from './ConceptTeachingEngine';

interface UniversalTeachingShellProps {
  concept: UniversalDockerConcept;
  completedConceptIds: string[];
  markConceptComplete: (id: string) => void;
  executeCommand: (cmd: string) => void;
  showToast: (msg: string) => void;
  prevConcept?: { id: string; title: string } | null;
  nextConcept?: { id: string; title: string } | null;
  onSelectConcept?: (id: string) => void;
}

export const UniversalTeachingShell: React.FC<UniversalTeachingShellProps> = (props) => {
  return <ConceptTeachingEngine {...props} />;
};
