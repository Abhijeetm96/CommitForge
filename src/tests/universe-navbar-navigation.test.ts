import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Concepts Universe Navbar Navigation', () => {
  it('ensures HeaderNav has 71 Concepts button in the top navigation bar', () => {
    const headerNavPath = path.resolve(__dirname, '../commitforge/components/layout/HeaderNav.tsx');
    const content = fs.readFileSync(headerNavPath, 'utf-8');

    expect(content).toContain('71 Concepts');
    expect(content).toContain("setAcademyTab('Universe')");
    expect(content).toContain("academyTab === 'Universe'");
  });

  it('ensures UniversalConceptHero includes All 71 Concepts tab in the subtabs navigation bar', () => {
    const heroPath = path.resolve(__dirname, '../commitforge/components/academy/UniversalConceptHero.tsx');
    const content = fs.readFileSync(heroPath, 'utf-8');

    expect(content).toContain("id: 'Universe', label: 'All 71 Concepts'");
    expect(content).toContain("tab === 'Universe'");
  });

  it('ensures UniversalConceptView routes activeTab Universe to ConceptExploreTab with initialViewMode all', () => {
    const viewPath = path.resolve(__dirname, '../commitforge/components/academy/UniversalConceptView.tsx');
    const content = fs.readFileSync(viewPath, 'utf-8');

    expect(content).toContain("activeTab === 'Universe'");
    expect(content).toContain('initialViewMode="all"');
    expect(content).toContain("activeTab === 'Explore'");
    expect(content).toContain('initialViewMode="current"');
  });

  it('ensures ConceptExploreTab removed redundant in-card button and banner', () => {
    const exploreTabPath = path.resolve(__dirname, '../commitforge/components/academy/ConceptExploreTab.tsx');
    const content = fs.readFileSync(exploreTabPath, 'utf-8');

    // The in-card button is removed from the body
    expect(content).not.toContain('VIEW MODE:');
    expect(content).not.toContain('Want to practice variations and case scenarios across the entire curriculum?');
    // useEffect is present to sync initialViewMode
    expect(content).toContain('useEffect');
    expect(content).toContain('setViewMode(initialViewMode)');
  });
});
