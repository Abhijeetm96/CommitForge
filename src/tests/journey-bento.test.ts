import { describe, it, expect } from 'vitest';
import { BENTO_CATEGORIES, JOURNEY_TIMELINE_STEPS, CONTINUING_ROADMAPS } from '../data/journeyModel';

describe('CommitForge Git Journey & Bento Architecture', () => {
  it('defines exactly 12 canonical Bento categories in correct order', () => {
    expect(BENTO_CATEGORIES).toHaveLength(12);

    const expectedNumbers = [
      '01', '02', '03', '04', '05', '06',
      '07', '08', '09', '10', '11', '12'
    ];
    expect(BENTO_CATEGORIES.map((c) => c.number)).toEqual(expectedNumbers);

    expect(BENTO_CATEGORIES[0].title).toBe('Foundations');
    expect(BENTO_CATEGORIES[1].title).toBe('Inspect & Save');
    expect(BENTO_CATEGORIES[2].title).toBe('Undo & Recover');
    expect(BENTO_CATEGORIES[3].title).toBe('Branching');
    expect(BENTO_CATEGORIES[4].title).toBe('Merging & Strategies');
    expect(BENTO_CATEGORIES[5].title).toBe('Remote Git');
    expect(BENTO_CATEGORIES[6].title).toBe('GitHub Essentials & Profile');
    expect(BENTO_CATEGORIES[7].title).toBe('Collaboration, PRs & Projects');
    expect(BENTO_CATEGORIES[8].title).toBe('Advanced Git & History Rewriting');
    expect(BENTO_CATEGORIES[9].title).toBe('Git Engineering & Hooks');
    expect(BENTO_CATEGORIES[10].title).toBe('GitHub Automation & Actions');
    expect(BENTO_CATEGORIES[11].title).toBe('GitHub Developer Tools & Ecosystem');
  });

  it('preserves full 110+ curriculum concepts across all 12 categories matching the PDF', () => {
    let totalConcepts = 0;

    BENTO_CATEGORIES.forEach((cat) => {
      expect(cat.concepts.length).toBeGreaterThanOrEqual(4);
      expect(cat.tagline).toBeTruthy();
      expect(cat.description).toBeTruthy();
      expect(cat.accentColor).toMatch(/^#[0-9a-fA-F]{6}$/);
      expect(cat.colSpanDesktop).toBeGreaterThanOrEqual(4);
      totalConcepts += cat.concepts.length;

      // Verify every concept has required properties
      cat.concepts.forEach((concept) => {
        expect(concept.id).toBeTruthy();
        expect(concept.title).toBeTruthy();
        expect(concept.description).toBeTruthy();
        expect(['locked', 'available', 'in-progress', 'learned', 'mastered']).toContain(concept.status);
        expect(['Beginner', 'Intermediate', 'Advanced', 'Expert']).toContain(concept.difficulty);
      });
    });

    // Verify 100% curriculum coverage (112 topics)
    expect(totalConcepts).toBeGreaterThanOrEqual(110);
  });

  it('enriches concepts with granular subtopics matching the PDF branches', () => {
    let conceptsWithSubtopics = 0;
    let totalSubtopics = 0;

    BENTO_CATEGORIES.forEach((cat) => {
      cat.concepts.forEach((concept) => {
        if (concept.subtopics && concept.subtopics.length > 0) {
          conceptsWithSubtopics++;
          totalSubtopics += concept.subtopics.length;
        }
      });
    });

    expect(conceptsWithSubtopics).toBeGreaterThanOrEqual(100);
    expect(totalSubtopics).toBeGreaterThanOrEqual(300);
  });

  it('provides continuing learning roadmaps matching the PDF footer', () => {
    expect(CONTINUING_ROADMAPS).toHaveLength(4);
    expect(CONTINUING_ROADMAPS.map((r) => r.title)).toEqual([
      'Frontend',
      'Backend',
      'DevOps',
      'Full-stack'
    ]);
  });

  it('provides a 11-step horizontal Journey Timeline linking to valid categories', () => {
    expect(JOURNEY_TIMELINE_STEPS).toHaveLength(11);

    const labels = JOURNEY_TIMELINE_STEPS.map((s) => s.label);
    expect(labels).toEqual([
      'Foundations',
      'Inspect',
      'Save',
      'Recover',
      'Branch',
      'Merge',
      'Remote',
      'GitHub',
      'Collaborate',
      'Advanced',
      'Engineering',
    ]);

    const categoryIds = new Set(BENTO_CATEGORIES.map((c) => c.id));
    JOURNEY_TIMELINE_STEPS.forEach((step) => {
      expect(categoryIds.has(step.categoryId)).toBe(true);
      expect(['completed', 'current', 'upcoming']).toContain(step.status);
    });

    // Exactly one current active step
    const currentSteps = JOURNEY_TIMELINE_STEPS.filter((s) => s.status === 'current');
    expect(currentSteps).toHaveLength(1);
    expect(currentSteps[0].label).toBe('Foundations');
  });

  it('assigns unique visual preview types to appropriate categories', () => {
    const previewTypes = BENTO_CATEGORIES.map((c) => c.previewType);
    expect(previewTypes).toContain('repository');
    expect(previewTypes).toContain('staging');
    expect(previewTypes).toContain('recovery');
    expect(previewTypes).toContain('branching');
    expect(previewTypes).toContain('merging');
    expect(previewTypes).toContain('remote');
    expect(previewTypes).toContain('github');
    expect(previewTypes).toContain('collaboration');
    expect(previewTypes).toContain('rebase');
    expect(previewTypes).toContain('internals');
    expect(previewTypes).toContain('actions');
    expect(previewTypes).toContain('api');
  });
});
