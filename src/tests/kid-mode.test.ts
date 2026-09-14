import { describe, it, expect } from 'vitest';
import { KID_METAPHORS, getKidStatusSummary, KID_COMMAND_CHIPS } from '../data/kidMetaphors';

describe('Kid Mode & 10-Year-Old Learning Metaphors', () => {
  it('provides kid-friendly metaphors for all fundamental Git concepts', () => {
    const requiredTerms = [
      'git',
      'working-tree',
      'staging-area',
      'commit',
      'repository',
      'branch',
      'head',
      'merge',
      'conflict',
      'remote',
      'push',
      'pull',
      'restore',
      'diff',
    ];

    requiredTerms.forEach((termKey) => {
      const meta = KID_METAPHORS[termKey];
      expect(meta, `Missing metaphor for ${termKey}`).toBeDefined();
      expect(meta.kidTitle).toBeTruthy();
      expect(meta.emoji).toBeTruthy();
      expect(meta.oneLiner).toBeTruthy();
      expect(meta.funStory).toBeTruthy();
    });
  });

  it('maps working tree to Lego desk, staging area to backpack, and commit to polaroid photo', () => {
    expect(KID_METAPHORS['working-tree'].kidTitle).toContain('Lego');
    expect(KID_METAPHORS['staging-area'].kidTitle).toContain('Backpack');
    expect(KID_METAPHORS['commit'].kidTitle).toContain('Photo');
    expect(KID_METAPHORS['repository'].kidTitle).toContain('Album');
  });

  it('generates friendly status summaries for 10-year-olds based on repo state', () => {
    // 1. Clean state
    const cleanSummary = getKidStatusSummary(0, 0, 5);
    expect(cleanSummary).toContain('clean and tidy');

    // 2. Modified files on desk
    const modifiedSummary = getKidStatusSummary(3, 0, 5);
    expect(modifiedSummary).toContain('3 files on your desk');
    expect(modifiedSummary).toContain('Pack them with git add');

    // 3. Files in backpack
    const stagedSummary = getKidStatusSummary(3, 2, 5);
    expect(stagedSummary).toContain('Backpack has 2 items ready');
    expect(stagedSummary).toContain('git commit');

    // 4. Fresh empty repo
    const emptySummary = getKidStatusSummary(0, 0, 0);
    expect(emptySummary).toContain('Fresh new project');
  });

  it('provides magic wand command chips for essential beginner actions', () => {
    expect(KID_COMMAND_CHIPS.length).toBeGreaterThanOrEqual(4);
    const commands = KID_COMMAND_CHIPS.map((c) => c.cmd);
    expect(commands).toContain('git status');
    expect(commands).toContain('git add .');
    expect(commands).toContain('git log --oneline');

    KID_COMMAND_CHIPS.forEach((chip) => {
      expect(chip.label).toBeTruthy();
      expect(chip.hint).toBeTruthy();
      expect(chip.color).toMatch(/^#[0-9a-fA-F]{6}$/);
    });
  });
});
