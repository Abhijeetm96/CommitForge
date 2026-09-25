import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { mapSegmentToMode, mapModeToSegment, getTitleForMode } from '../platform/routing/urlRouter';

describe('Concepts Universe Independent Page Architecture', () => {
  it('ensures HeaderNav has 71 Concepts button that routes to independent mode universe', () => {
    const headerNavPath = path.resolve(__dirname, '../commitforge/components/layout/HeaderNav.tsx');
    const content = fs.readFileSync(headerNavPath, 'utf-8');

    expect(content).toContain('71 Concepts');
    expect(content).toContain("setMode('universe')");
    expect(content).toContain("mode === 'universe'");
  });

  it('ensures CommitForgeApp mounts ConceptsUniverseView as an independent experience', () => {
    const appPath = path.resolve(__dirname, '../commitforge/CommitForgeApp.tsx');
    const content = fs.readFileSync(appPath, 'utf-8');

    expect(content).toContain("import { ConceptsUniverseView } from './components/universe/ConceptsUniverseView'");
    expect(content).toContain("mode === 'universe' && <ConceptsUniverseView />");
  });

  it('ensures urlRouter maps universe to independent ViewMode and canonical segment', () => {
    expect(mapSegmentToMode('universe')).toBe('universe');
    expect(mapSegmentToMode('concepts')).toBe('universe');
    expect(mapModeToSegment('universe')).toBe('universe');
    expect(getTitleForMode('universe')).toContain('71 Concepts Universe');
  });

  it('ensures UniversalConceptHero has a direct launcher button to the independent Universe page', () => {
    const heroPath = path.resolve(__dirname, '../commitforge/components/academy/UniversalConceptHero.tsx');
    const content = fs.readFileSync(heroPath, 'utf-8');

    expect(content).toContain("setMode('universe')");
    expect(content).toContain('71 Concepts Universe');
  });

  it('ensures ConceptsUniverseView contains full curriculum catalog with all 71 concepts and search', () => {
    const universeViewPath = path.resolve(__dirname, '../commitforge/components/universe/ConceptsUniverseView.tsx');
    const content = fs.readFileSync(universeViewPath, 'utf-8');

    expect(content).toContain('The 71 Git Concepts Universe');
    expect(content).toContain('ACADEMY_18_TOPICS');
    expect(content).toContain('searchQuery');
    expect(content).toContain('navigateToAcademy');
  });
});
