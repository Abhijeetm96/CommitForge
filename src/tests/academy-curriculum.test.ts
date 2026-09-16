import { describe, it, expect } from 'vitest';
import {
  ACADEMY_CURRICULUM_NODES,
  ACADEMY_STAGES,
  searchAcademyByIntent,
  PROBLEM_SOLVER_SCENARIOS,
} from '../data/academyCurriculum';
import { TEACHING_STEPS, SliceState } from '../data/teacherSliceStory';

describe('CommitForge Complete Git + GitHub Academy: 30-Level Curriculum', () => {
  it('contains all 30 levels from Level 0 to Level 29 exactly once', () => {
    expect(ACADEMY_CURRICULUM_NODES).toHaveLength(30);

    const levels = ACADEMY_CURRICULUM_NODES.map((n) => n.level);
    for (let i = 0; i <= 29; i++) {
      expect(levels).toContain(i);
    }

    // Ensure levels are unique
    const uniqueLevels = new Set(levels);
    expect(uniqueLevels.size).toBe(30);
  });

  it('correctly categorizes nodes across the 6 major curriculum stages', () => {
    expect(ACADEMY_STAGES).toHaveLength(6);

    const stage1 = ACADEMY_CURRICULUM_NODES.filter((n) => n.stageNumber === 1);
    const stage2 = ACADEMY_CURRICULUM_NODES.filter((n) => n.stageNumber === 2);
    const stage3 = ACADEMY_CURRICULUM_NODES.filter((n) => n.stageNumber === 3);
    const stage4 = ACADEMY_CURRICULUM_NODES.filter((n) => n.stageNumber === 4);
    const stage5 = ACADEMY_CURRICULUM_NODES.filter((n) => n.stageNumber === 5);
    const stage6 = ACADEMY_CURRICULUM_NODES.filter((n) => n.stageNumber === 6);

    // Stage 1: Levels 0–5 (6 nodes)
    expect(stage1).toHaveLength(6);
    // Stage 2: Levels 6–7 (2 nodes)
    expect(stage2).toHaveLength(2);
    // Stage 3: Levels 8–12 (5 nodes)
    expect(stage3).toHaveLength(5);
    // Stage 4: Levels 13–16 (4 nodes)
    expect(stage4).toHaveLength(4);
    // Stage 5: Levels 17–23 (7 nodes)
    expect(stage5).toHaveLength(7);
    // Stage 6: Levels 24–29 (6 nodes)
    expect(stage6).toHaveLength(6);
  });

  it('verifies all nodes have comprehensive metadata, concepts, and valid attributes', () => {
    ACADEMY_CURRICULUM_NODES.forEach((node) => {
      expect(node.id).toBeDefined();
      expect(node.title.length).toBeGreaterThan(3);
      expect(node.description.length).toBeGreaterThan(10);
      expect(node.whyItExists.length).toBeGreaterThan(10);
      expect(node.concepts.length).toBeGreaterThanOrEqual(3);
      expect(node.highlightIcon).toBeDefined();
      expect(node.estimatedMinutes).toBeGreaterThan(0);
      expect(['Beginner', 'Intermediate', 'Advanced', 'Expert']).toContain(node.difficulty);
      expect(['locked', 'available', 'in-progress', 'learned', 'mastered']).toContain(node.status);
    });
  });

  it('verifies topological validity: all prerequisite IDs exist in the curriculum', () => {
    const allNodeIds = new Set(ACADEMY_CURRICULUM_NODES.map((n) => n.id));

    ACADEMY_CURRICULUM_NODES.forEach((node) => {
      node.prerequisites.forEach((prereqId) => {
        expect(allNodeIds.has(prereqId)).toBe(true);
      });
    });
  });

  it('accurately matches developer intent in natural-language search', () => {
    // 1. "committed wrong file" -> should match undo/recovery
    const res1 = searchAcademyByIntent('committed wrong file');
    expect(res1.length).toBeGreaterThan(0);
    expect(res1[0].node.id).toBe('l5-undo-recovery');
    expect(res1[0].commands).toContain('git reset --soft HEAD~1');

    // 2. "see what changed" -> should match inspecting
    const res2 = searchAcademyByIntent('see what changed');
    expect(res2.length).toBeGreaterThan(0);
    expect(res2[0].node.id).toBe('l3-inspecting');
    expect(res2[0].commands).toContain('git diff');

    // 3. "lost commit" -> should match investigating / reflog
    const res3 = searchAcademyByIntent('lost commit');
    expect(res3.length).toBeGreaterThan(0);
    expect(res3[0].node.id).toBe('l16-investigating');
    expect(res3[0].commands).toContain('git reflog');

    // 4. "merge conflicts" -> should match merging
    const res4 = searchAcademyByIntent('merge conflicts');
    expect(res4.length).toBeGreaterThan(0);
    expect(res4[0].node.id).toBe('l7-merging');

    // 5. "cant push" -> should match remote git
    const res5 = searchAcademyByIntent('cant push');
    expect(res5.length).toBeGreaterThan(0);
    expect(res5[0].node.id).toBe('l8-remotes');

    // 6. "save my work" -> should match git foundations
    const res6 = searchAcademyByIntent('save my work');
    expect(res6.length).toBeGreaterThan(0);
    expect(res6[0].node.id).toBe('l2-git-foundations');
  });

  it('verifies Problem Solver scenarios contain actionable guidance and valid links', () => {
    expect(PROBLEM_SOLVER_SCENARIOS.length).toBeGreaterThanOrEqual(6);
    const allNodeIds = new Set(ACADEMY_CURRICULUM_NODES.map((n) => n.id));

    PROBLEM_SOLVER_SCENARIOS.forEach((scenario) => {
      expect(scenario.id).toBeDefined();
      expect(scenario.title.length).toBeGreaterThan(5);
      expect(scenario.whatProbablyHappened.length).toBeGreaterThan(15);
      expect(scenario.whatGitIsDoing.length).toBeGreaterThan(10);
      expect(scenario.whatToInspect.length).toBeGreaterThanOrEqual(1);
      expect(scenario.safeCommands.length).toBeGreaterThanOrEqual(1);
      expect(scenario.whatNotToDo.length).toBeGreaterThan(10);
      expect(scenario.whyAvoid.length).toBeGreaterThan(10);
      expect(scenario.howToVerify.length).toBeGreaterThanOrEqual(1);
      // Related node must exist in curriculum
      expect(allNodeIds.has(scenario.relatedNodeId)).toBe(true);
    });
  });

  it('maps Level 2 to the active teacher-led lesson with exact canonical state sequence', () => {
    const level2Node = ACADEMY_CURRICULUM_NODES.find((n) => n.id === 'l2-git-foundations');
    expect(level2Node).toBeDefined();
    expect(level2Node?.isFullyImplemented).toBe(true);
    expect(level2Node?.title).toBe('Your First Git Save Point');
    expect(level2Node?.status).toBe('in-progress');

    // Canonical 18 states in TEACHING_STEPS
    expect(TEACHING_STEPS).toHaveLength(18);
    const expectedStates: SliceState[] = [
      SliceState.PROBLEM,
      SliceState.INITIAL_REPO_EXPLORED,
      SliceState.FILES_MODIFIED,
      SliceState.STATUS_OBSERVED,
      SliceState.DIFF_OBSERVED,
      SliceState.STAGING_EXPLAINED,
      SliceState.PREDICT_STAGING,
      SliceState.INDEX_HTML_STAGED,
      SliceState.STAGING_VERIFIED,
      SliceState.COMMIT_EXPLAINED,
      SliceState.COMMIT_CREATED,
      SliceState.COMMIT_VERIFIED,
      SliceState.ENV_ACCIDENTALLY_STAGED,
      SliceState.DANGER_EXPLAINED,
      SliceState.ENV_UNSTAGED,
      SliceState.RECOVERY_VERIFIED,
      SliceState.INDEPENDENT_CHALLENGE,
      SliceState.MASTERY_GATE,
    ];

    TEACHING_STEPS.forEach((step, idx) => {
      expect(step.id).toBe(expectedStates[idx]);
    });
  });
});
