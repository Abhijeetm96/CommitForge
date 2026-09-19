import { describe, it, expect } from 'vitest';
import {
  ACADEMY_18_TOPICS,
  BESPOKE_CONCEPTS,
  getUniversalConcept,
  GLOBAL_PROBLEM_SOLUTIONS,
} from '../data/unifiedAcademyData';

describe('Unified Academy Syllabus (18 Topics Model)', () => {
  it('contains exactly 18 numbered topics from 01 to 18 in order', () => {
    expect(ACADEMY_18_TOPICS).toHaveLength(18);

    ACADEMY_18_TOPICS.forEach((topic, idx) => {
      const expectedNum = String(idx + 1).padStart(2, '0');
      expect(topic.number).toBe(expectedNum);
      expect(topic.title).toBeTruthy();
      expect(topic.concepts.length).toBeGreaterThan(0);
    });
  });

  it('verifies Topic 02 is "Git Commands" containing core commands', () => {
    const topic02 = ACADEMY_18_TOPICS.find((t) => t.number === '02');
    expect(topic02).toBeDefined();
    expect(topic02?.title).toBe('Git Commands');

    const commandNames = topic02?.concepts.map((c) => c.command);
    expect(commandNames).toContain('git status');
    expect(commandNames).toContain('git add');
    expect(commandNames).toContain('git commit');
    expect(commandNames).toContain('git diff');
    expect(commandNames).toContain('git restore --staged');
  });
});

describe('First Vertical Slice Bespoke Concepts', () => {
  const sliceCommands = [
    'c-git-status',
    'c-git-diff',
    'c-git-add',
    'c-git-commit',
    'c-git-restore-staged',
  ];

  it('has fully authored bespoke concepts for all 5 required vertical slice items', () => {
    sliceCommands.forEach((conceptId) => {
      const concept = BESPOKE_CONCEPTS[conceptId];
      expect(concept, `Missing bespoke concept ${conceptId}`).toBeDefined();

      // Identity & Hero
      expect(concept.title).toBeTruthy();
      expect(concept.badges.length).toBeGreaterThan(0);
      expect(concept.quote).toBeTruthy();

      // Level 1: Understand
      expect(concept.whatIsIt).toBeTruthy();
      expect(concept.inSimpleWords).toBeTruthy();
      expect(concept.whyDoYouNeedIt).toBeTruthy();
      expect(concept.realWorldAnalogy).toBeTruthy();

      // Level 2: Syntax
      expect(concept.syntaxCode).toBeTruthy();
      expect(concept.syntaxTokens.length).toBeGreaterThanOrEqual(2);
      concept.syntaxTokens.forEach((st) => {
        expect(st.token).toBeTruthy();
        expect(st.role).toBeTruthy();
        expect(st.explanation).toBeTruthy();
      });

      // Level 3: Action Stage
      expect(concept.actionStage.before).toBeDefined();
      expect(concept.actionStage.running).toBeDefined();
      expect(concept.actionStage.after).toBeDefined();

      // Crucial requirement: What changed vs What did NOT change
      expect(concept.actionStage.after.whatChanged.length).toBeGreaterThan(0);
      expect(concept.actionStage.after.whatDidNotChange.length).toBeGreaterThan(0);

      // Level 4: Explore
      expect(concept.variations.length).toBeGreaterThan(0);
      concept.variations.forEach((v) => {
        expect(v.syntax).toBeTruthy();
        expect(v.whatItDoes).toBeTruthy();
        expect(v.whenToUse).toBeTruthy();
      });

      // Level 5: Practice & Challenge
      expect(concept.sandbox.guidedSteps.length).toBeGreaterThan(0);
      expect(concept.challenge.title).toBeTruthy();
      expect(concept.challenge.hints.length).toBeGreaterThanOrEqual(1);
      expect(concept.challenge.safeFailure?.recoveryCommand).toBeTruthy();

      // Level 6: Reference
      expect(concept.reference.synopsis).toBeTruthy();
      expect(concept.reference.options?.length).toBeGreaterThan(0);
      expect(concept.reference.gitInternals?.objectType).toBeTruthy();
    });
  });

  it('git commit concept specifically matches reference UI requirements', () => {
    const commit = BESPOKE_CONCEPTS['c-git-commit'];
    expect(commit.quote).toBe('A commit is a checkpoint for your project.');
    expect(commit.actionStage.after.whatDidNotChange).toContain(
      'Nothing is uploaded to GitHub. A commit is local until you push.'
    );
    expect(commit.syntaxCode).toBe('git commit -m "Your commit message"');
  });

  it('generates rich fallback concepts for any of the 18 syllabus topics', () => {
    const tagConcept = getUniversalConcept('c-lightweight-tags');
    expect(tagConcept).toBeDefined();
    expect(tagConcept.title).toBe('Lightweight Tags');
    expect(tagConcept.syntaxTokens.length).toBeGreaterThan(0);
    expect(tagConcept.actionStage.after.whatChanged.length).toBeGreaterThan(0);
  });
});

describe('Global Problem Solver ("What are you trying to do?")', () => {
  it('contains solutions for common Git dilemmas', () => {
    expect(GLOBAL_PROBLEM_SOLUTIONS.length).toBeGreaterThanOrEqual(5);

    const undoCommit = GLOBAL_PROBLEM_SOLUTIONS.find((s) => s.id === 'prob-undo-commit');
    expect(undoCommit).toBeDefined();
    expect(undoCommit?.decisionTree).toBeDefined();
    expect(undoCommit?.decisionTree?.question).toContain('pushed to GitHub');

    const options = undoCommit?.decisionTree?.options || [];
    const yesPushed = options.find((o) => o.label.includes('YES'));
    const noPushed = options.find((o) => o.label.includes('NO'));

    expect(yesPushed?.recommendedCommand).toContain('git revert');
    expect(noPushed?.recommendedCommand).toContain('git reset');
  });

  it('verifies unstage file directs to git restore --staged', () => {
    const unstage = GLOBAL_PROBLEM_SOLUTIONS.find((s) => s.id === 'prob-unstage-file');
    expect(unstage).toBeDefined();
    expect(unstage?.directRecommendation?.recommendedCommand).toContain('git restore --staged');
    expect(unstage?.directRecommendation?.targetConceptId).toBe('c-git-restore-staged');
  });
});
