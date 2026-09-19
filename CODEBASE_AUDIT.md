# COMMITFORGE FINAL CODEBASE AUDIT & ARCHITECTURAL REPORT

**Date:** September 19, 2026  
**Auditor:** Antigravity Autonomous Pair Programmer  
**Objective:** Transform CommitForge from multiple overlapping experimental prototypes into one deliberate Git learning product with a clean, canonical architecture.

---

## 1. Executive Architectural Summary

Over multiple iterations, CommitForge accumulated duplicate learning UX generations, multiple roadmap paradigms, legacy teacher slice models, and redundant data schemas.

At the current entry point (`src/App.tsx`), the application already funnels primary navigation modes (`learn`, `dashboard`, `roadmap`, `first10`, `visualize`, `community`) into the single unified **GitAcademyView** (`src/components/academy/GitAcademyView.tsx`).

The goal of this cleanup is to:
1. Establish **GitAcademyView + UniversalConceptView + unifiedAcademyData** as the single canonical learning architecture.
2. Preserve secondary practice (**PracticeView**), simulated recovery labs (**LabsHubView**), developer workspace (**DeveloperIdeView**), and reference encyclopedia (**CommandReferenceView**).
3. Connect all 7 valuable practice labs (Conflict Arena, Git Hospital, Break It & Fix It, Two-Dev Simulation, Command Discovery, Undo Lab, Capstone, Configuration Lab) in `LabsHubView`.
4. Completely eliminate the orphaned legacy generation files (FocusLessonView cluster, TeacherLessonView cluster, First10MinutesView cluster, RoadmapView cluster, and GitJourneyView bento cluster).
5. Remove unused starter assets (`hero.png`, `react.svg`, `vite.svg`) and dead dependencies (`elkjs`).
6. Guarantee 100% test coverage and compilation with 0 TypeScript errors and 0 lint issues.

---

## 2. Active Architecture & Routes

| Route / Mode | View Component | Status | Purpose |
| :--- | :--- | :--- | :--- |
| `learn`, `visualize`, `community`, `dashboard`, `roadmap`, `first10` | `GitAcademyView` | **CORE CANONICAL** | Primary Academy: 18 Topics, 71 Concepts, Interactive UniversalConceptView, Sandbox, Visualizer & Practice Tabs |
| `practice` | `PracticeView` | **ACTIVE SUPPORTING** | Guided developer missions (Level 0 through 12) with live engine grading |
| `labs` (and sub-routes) | `LabsHubView` | **ACTIVE LABS** | Secondary practice: Conflict Arena, Git Hospital, Break It, Two-Dev, Undo, Capstone, Config Lab |
| `ide` | `DeveloperIdeView` | **ACTIVE ADVANCED** | Full simulated developer IDE with File Explorer, Code Editor, Visualizer, DAG Graph, Terminal |
| `reference` | `CommandReferenceView` | **ACTIVE REFERENCE** | Comprehensive Git command reference, danger levels, tier coverage |

### Active Shared Overlays & Modals
- **GlobalProblemSearchModal** (`components/academy/GlobalProblemSearchModal.tsx`): ⌘K natural language "What are you trying to do?" solver.
- **CommandAtlasModal** (`components/navigation/CommandAtlasModal.tsx`): Intent-based command catalog connecting directly to Academy concepts.
- **InternalsModal** (`components/visualizer/InternalsModal.tsx`): Low-level object database inspector (`.git/objects`, SHA-1 hashes, trees, blobs).
- **GitMovieModal** (`components/animation/GitMovieModal.tsx`): Git animation playback modal powered by `GitAnimationStage.tsx`.
- **OnboardingWizard** (`components/tutor/OnboardingWizard.tsx`): Experience level setup (Beginner → Expert).
- **ImLostDrawer** (`components/tutor/ImLostDrawer.tsx`): Help and troubleshooting drawer.
- **GitForHumansModal** (`components/tutor/GitForHumansModal.tsx`): Plain English Git terminology dictionary.

---

## 3. Canonical Learning System

```
                           COMMITFORGE
                                |
                           GIT ACADEMY
                      (GitAcademyView.tsx)
                                |
                     UNIVERSAL CONCEPT VIEW
                    (UniversalConceptView.tsx)
                                |
     ┌──────────────────────────┼──────────────────────────┐
     |                          |                          |
   LEARN                    VISUALIZE                   PRACTICE
 (Concept Hero,        (ConceptVisualizerTab,      (ConceptPracticeTab,
  Syntax Explorer,      ActionStage, GitGraph,      Terminal Sandbox,
  Scenarios & Diff)     ThreeAreaVisualizer)        Guided Challenges)
     |                          |                          |
  EXPLORE                   REFERENCE
 (Variations,           (Flags, Syntax Manual,
  Real-World Pitfalls)   Internals Breakdown)
```

- **Data Backbone:** `src/data/unifiedAcademyData.ts` backed by modular topic files in `src/data/academyTopics/topic*.ts`.
- **Coverage:** 18 Chapters / Topics, 71 Concepts covering Foundations, Everyday Commands, Branching, Merging, Rewriting, Remotes, Collaboration, Recovery, Advanced, and Plumbing Internals.

---

## 4. Canonical Visualization Architecture

CommitForge has unified visualization responsibilities across distinct tools:
1. **ThreeAreaVisualizer** (`components/visualizer/ThreeAreaVisualizer.tsx`):
   - Clear three-tier visualization of Working Tree → Staging Area (Index) → Git Repository (HEAD / Commits).
   - Used in `ConceptVisualizerTab` and `DeveloperIdeView`.
2. **GitGraph** (`components/visualizer/GitGraph.tsx`):
   - SVG DAG visualizer showing commit nodes, parent links, branch pointers, and HEAD tracking.
   - Used in `ConceptVisualizerTab`, `ConceptVisualActionStage`, and `DeveloperIdeView`.
3. **ConceptVisualActionStage** (`components/academy/ConceptVisualActionStage.tsx`):
   - Step-by-step state transition stage showing "Before", "Running Command", and "After" state diffs.
4. **GitStateInspector** (`components/visualizer/GitStateInspector.tsx`):
   - Real-time HUD showing HEAD status, sync status, and state inspection explanations in `DeveloperIdeView`.
5. **GitAnimationStage** (`components/animation/GitAnimationStage.tsx`):
   - Physics-based animated particles and causal transition playback in `GitMovieModal`.

---

## 5. Comprehensive Component & Data Classification

| File | Category | Used By | Action |
| :--- | :--- | :--- | :--- |
| `src/App.tsx` | CORE | `main.tsx` | REFACTOR (clean dead imports) |
| `src/context/AppContext.tsx` | CORE | Whole app | REFACTOR (clean dead types) |
| `src/components/layout/HeaderNav.tsx` | CORE | `App.tsx` | REFACTOR (add Labs link) |
| `src/components/academy/GitAcademyView.tsx` | CORE | `App.tsx` | KEEP |
| `src/components/academy/UniversalConceptView.tsx` | CORE | `GitAcademyView` | KEEP |
| `src/components/academy/UniversalConceptHero.tsx` | CORE | `UniversalConceptView` | KEEP |
| `src/components/academy/InteractiveSyntaxExplorer.tsx` | CORE | `UniversalConceptView` | KEEP |
| `src/components/academy/InteractiveTerminalSandbox.tsx` | CORE | `UniversalConceptView` | KEEP |
| `src/components/academy/ConceptVisualActionStage.tsx` | CORE | `UniversalConceptView` | KEEP |
| `src/components/academy/ConceptExploreTab.tsx` | CORE | `UniversalConceptView` | KEEP |
| `src/components/academy/ConceptPracticeTab.tsx` | CORE | `UniversalConceptView` | KEEP |
| `src/components/academy/ConceptReferenceTab.tsx` | CORE | `UniversalConceptView` | KEEP |
| `src/components/academy/ConceptVisualizerTab.tsx` | CORE | `UniversalConceptView` | KEEP |
| `src/components/academy/GlobalProblemSearchModal.tsx` | CORE | `App.tsx`, `HeaderNav.tsx` | KEEP |
| `src/components/academy/academyIcons.tsx` | SUPPORTING | `GitAcademyView` | KEEP |
| `src/components/practice/PracticeView.tsx` | ACTIVE | `App.tsx`, `HeaderNav.tsx` | KEEP |
| `src/components/labs/LabsHubView.tsx` | ACTIVE | `App.tsx` | REFACTOR (enable all 7 labs) |
| `src/components/labs/ConflictArenaView.tsx` | LAB | `LabsHubView` | KEEP |
| `src/components/labs/GitHospitalView.tsx` | LAB | `LabsHubView` | KEEP |
| `src/components/labs/BreakItView.tsx` | LAB | `LabsHubView` | KEEP |
| `src/components/labs/TwoDevView.tsx` | LAB | `LabsHubView` | KEEP |
| `src/components/labs/CommandDiscoveryView.tsx` | LAB | `LabsHubView` | KEEP |
| `src/components/labs/UndoLabView.tsx` | LAB | `LabsHubView` | CONSOLIDATE (wire into LabsHub) |
| `src/components/labs/CapstoneView.tsx` | LAB | `LabsHubView` | CONSOLIDATE (wire into LabsHub) |
| `src/components/labs/ConfigLabView.tsx` | LAB | `LabsHubView` | CONSOLIDATE (wire into LabsHub) |
| `src/components/labs/CommandReferenceView.tsx` | ACTIVE | `App.tsx`, `HeaderNav.tsx` | KEEP |
| `src/components/ide/DeveloperIdeView.tsx` | ACTIVE | `App.tsx` | KEEP |
| `src/components/editor/CodeEditor.tsx` | SUPPORTING | `DeveloperIdeView` | KEEP |
| `src/components/editor/FileExplorer.tsx` | SUPPORTING | `DeveloperIdeView` | KEEP |
| `src/components/terminal/Terminal.tsx` | CORE | `DeveloperIdeView`, `PracticeView` | KEEP |
| `src/components/visualizer/ThreeAreaVisualizer.tsx` | CORE | `ConceptVisualizerTab`, `DeveloperIdeView` | KEEP |
| `src/components/visualizer/GitGraph.tsx` | CORE | `ConceptVisualizerTab`, `DeveloperIdeView` | KEEP |
| `src/components/visualizer/GitStateInspector.tsx` | CORE | `DeveloperIdeView` | KEEP |
| `src/components/visualizer/InternalsModal.tsx` | CORE | `App.tsx` | KEEP |
| `src/components/tutor/OnboardingWizard.tsx` | CORE | `App.tsx` | KEEP |
| `src/components/tutor/ImLostDrawer.tsx` | CORE | `App.tsx`, `HeaderNav.tsx` | KEEP |
| `src/components/tutor/GitForHumansModal.tsx` | CORE | `App.tsx` | KEEP |
| `src/components/animation/GitMovieModal.tsx` | CORE | `App.tsx` | KEEP |
| `src/components/animation/GitAnimationStage.tsx` | CORE | `GitMovieModal` | KEEP |
| `src/components/animation/causalStories.ts` | SUPPORTING | `GitAnimationStage` | KEEP |
| `src/components/animation/gitPhysics.ts` | SUPPORTING | `GitAnimationStage` | KEEP |
| `src/components/animation/stateDiff.ts` | SUPPORTING | `GitAnimationStage` | KEEP |
| `src/components/animation/GitKnowsModal.tsx` | SUPPORTING | `GitAnimationStage` | KEEP |
| `src/components/animation/WhyDidGitDoThatModal.tsx` | SUPPORTING | `GitAnimationStage` | KEEP |
| `src/components/animation/types.ts` | SUPPORTING | `GitAnimationStage` | KEEP |
| `src/components/navigation/CommandAtlasModal.tsx` | SUPPORTING | `App.tsx`, `HeaderNav.tsx` | KEEP |
| `src/data/unifiedAcademyData.ts` | CORE DATA | `GitAcademyView`, `UniversalConceptView` | KEEP |
| `src/data/academyTopics/topic*.ts` (10 files) | CORE DATA | `unifiedAcademyData.ts` | KEEP |
| `src/data/gitCommandCoverage.ts` | CORE DATA | `CommandReferenceView` | KEEP |
| `src/data/commandsRef.ts` | CORE DATA | `CommandReferenceView` | KEEP |
| `src/data/gitForHumans.ts` | SUPPORTING DATA | `GitForHumansModal` | KEEP |
| `src/data/projects.ts` | SUPPORTING DATA | `AppContext`, `HeaderNav` | KEEP |
| `src/data/hospitalCases.ts` | LAB DATA | `GitHospitalView` | KEEP |
| `src/data/undoScenarios.ts` | LAB DATA | `UndoLabView` | KEEP |
| `src/data/capstone.ts` | LAB DATA | `CapstoneView` | KEEP |
| `src/git-engine/*` (all 15 files) | CORE ENGINE | App, Context, Visualizers | KEEP |
| `src/components/learn/FocusLessonView.tsx` | LEGACY | Unused in `App.tsx` | DELETE |
| `src/components/learn/ContextualForge.tsx` | LEGACY | `FocusLessonView` | DELETE |
| `src/components/learn/LessonTerminalBridge.tsx` | LEGACY | `FocusLessonView` | DELETE |
| `src/components/learn/LessonTopicPicker.tsx` | LEGACY | `FocusLessonView` | DELETE |
| `src/components/learn/PhysicalGitStage.tsx` | LEGACY | `FocusLessonView` | DELETE |
| `src/components/learn/PredictionInteraction.tsx` | LEGACY | `FocusLessonView` | DELETE |
| `src/components/learn/SceneQuestion.tsx` | LEGACY | `FocusLessonView` | DELETE |
| `src/components/learn/StateTransition.tsx` | LEGACY | `FocusLessonView` | DELETE |
| `src/components/learn/TechnicalReveal.tsx` | LEGACY | `FocusLessonView` | DELETE |
| `src/data/focusLessonScenes.ts` | LEGACY DATA | `FocusLessonView` | DELETE |
| `src/tests/focus-lesson.test.ts` | LEGACY TEST | `focusLessonScenes.ts` | DELETE |
| `src/components/learn/TeacherLessonView.tsx` | LEGACY | Unused in `App.tsx` | DELETE |
| `src/components/learn/ContextualGitStage.tsx` | LEGACY | `TeacherLessonView` | DELETE |
| `src/components/learn/TeacherDialogueCard.tsx` | LEGACY | `TeacherLessonView` | DELETE |
| `src/components/learn/TeachingCanvas.tsx` | LEGACY | `TeacherLessonView` | DELETE |
| `src/components/learn/ContextualTermPopover.tsx` | LEGACY | `TeacherDialogueCard` | DELETE |
| `src/components/learn/IndependentChallengeView.tsx` | LEGACY | `TeachingCanvas` | DELETE |
| `src/components/learn/StateImpactDiff.tsx` | LEGACY | `TeachingCanvas` | DELETE |
| `src/components/learn/SyntaxTokenBreakdown.tsx` | LEGACY | `TeachingCanvas` | DELETE |
| `src/components/learn/KnowledgePillarsCard.tsx` | LEGACY | `TeachingCanvas`, `PillarsNavigatorModal` | DELETE |
| `src/data/teacherSliceStory.ts` | LEGACY DATA | `TeacherLessonView` | DELETE |
| `src/data/topicLessons.ts` | LEGACY DATA | `TeacherLessonView` | DELETE |
| `src/tests/teacher-vertical-slice.test.ts` | LEGACY TEST | `teacherSliceStory.ts` | DELETE |
| `src/tests/topic-lessons.test.ts` | LEGACY TEST | `topicLessons.ts` | DELETE |
| `src/components/labs/First10MinutesView.tsx` | LEGACY | Unused in `App.tsx` | DELETE |
| `src/components/common/ForgeAvatar.tsx` | LEGACY | `First10MinutesView` | DELETE |
| `src/data/first10Minutes.ts` | LEGACY DATA | `First10MinutesView` | DELETE |
| `src/components/roadmap/RoadmapView.tsx` | LEGACY | Unused | DELETE |
| `src/components/roadmap/RoadmapCanvas.tsx` | LEGACY | `RoadmapView` | DELETE |
| `src/services/roadmapLayoutEngine.ts` | LEGACY SERVICE | `RoadmapCanvas` | DELETE |
| `src/data/roadmapGraphData.ts` | LEGACY DATA | Test only | DELETE |
| `src/data/roadmapGraphModel.ts` | LEGACY DATA | `RoadmapCanvas` | DELETE |
| `src/tests/roadmap-graph.test.ts` | LEGACY TEST | `roadmapGraphData.ts` | DELETE |
| `src/tests/roadmap-graph-engine.test.ts` | LEGACY TEST | `roadmapLayoutEngine.ts` | DELETE |
| `src/components/journey/GitJourneyView.tsx` | LEGACY | Unused in `App.tsx` | DELETE |
| `src/components/journey/CurriculumBento.tsx` | LEGACY | `GitJourneyView` | DELETE |
| `src/components/journey/CurriculumPreviews.tsx` | LEGACY | `CurriculumBento` | DELETE |
| `src/components/journey/ExpandedCurriculumSection.tsx` | LEGACY | `GitJourneyView` | DELETE |
| `src/components/journey/JourneyTimeline.tsx` | LEGACY | `GitJourneyView` | DELETE |
| `src/components/journey/ContinueLearningCard.tsx` | LEGACY | `GitJourneyView` | DELETE |
| `src/components/navigation/PillarsNavigatorModal.tsx` | LEGACY | Replaced by `GitAcademyView` tabs | DELETE |
| `src/data/journeyModel.ts` | LEGACY DATA | Bento / Journey components | DELETE |
| `src/data/chapterCurations.ts` | LEGACY DATA | Bento / Journey components | DELETE |
| `src/data/chapterSeeders.ts` | LEGACY DATA | `topicLessons.ts` | DELETE |
| `src/data/topicPillars.ts` | LEGACY DATA | `PillarsNavigatorModal` | DELETE |
| `src/tests/journey-bento.test.ts` | LEGACY TEST | `journeyModel.ts` | DELETE |
| `src/tests/chapter-curations.test.ts` | LEGACY TEST | `chapterCurations.ts` | DELETE |
| `src/tests/topic-pillars.test.ts` | LEGACY TEST | `topicPillars.ts` | DELETE |
| `src/components/dashboard/DashboardView.tsx` | LEGACY | Unused | DELETE |
| `src/components/academy/AcademyMapView.tsx` | LEGACY | `DashboardView` | DELETE |
| `src/components/academy/ConceptPreviewDrawer.tsx` | LEGACY | `AcademyMapView` | DELETE |
| `src/components/academy/ProblemSolverModal.tsx` | LEGACY | Replaced by `GlobalProblemSearchModal` | DELETE |
| `src/data/academyCurriculum.ts` | LEGACY DATA | `AcademyMapView` | DELETE |
| `src/tests/academy-curriculum.test.ts` | LEGACY TEST | `academyCurriculum.ts` | DELETE |
| `src/components/animation/InteractiveSimulator.tsx` | ORPHAN | None | DELETE |
| `src/components/learn/CommandSidebar.tsx` | ORPHAN | None | DELETE |
| `src/components/editor/AppPreview.tsx` | ORPHAN | Unused in `App.tsx` | DELETE |
| `src/components/panels/LessonPanel.tsx` | ORPHAN | Unused in `App.tsx` | DELETE |
| `src/data/curriculum.ts` | ORPHAN DATA | `LessonPanel.tsx` | DELETE |
| `src/assets/hero.png` | UNUSED ASSET | None | DELETE |
| `src/assets/react.svg` | UNUSED ASSET | None | DELETE |
| `src/assets/vite.svg` | UNUSED ASSET | None | DELETE |
| `elkjs` | UNUSED DEP | `roadmapLayoutEngine.ts` | UNINSTALL / REMOVE |

---

## 6. Recommended Deletions (52 Files Total)

| File | Why | References Checked | Replacement / Active Canonical | Risk |
| :--- | :--- | :--- | :--- | :--- |
| `components/learn/FocusLessonView.tsx` | Dead prototype lesson flow | Only in dead `App.tsx` import | `GitAcademyView` + `UniversalConceptView` | Zero |
| `components/learn/ContextualForge.tsx` | Child of FocusLessonView | Only in `FocusLessonView` | Integrated in `UniversalConceptView` | Zero |
| `components/learn/LessonTerminalBridge.tsx` | Child of FocusLessonView | Only in `FocusLessonView` | Integrated in `InteractiveTerminalSandbox` | Zero |
| `components/learn/LessonTopicPicker.tsx` | Child of FocusLessonView | Only in `FocusLessonView` | 18-Topic Sidebar in `GitAcademyView` | Zero |
| `components/learn/PhysicalGitStage.tsx` | Child of FocusLessonView | Only in `FocusLessonView` | `ThreeAreaVisualizer` + `ConceptVisualActionStage` | Zero |
| `components/learn/PredictionInteraction.tsx` | Child of FocusLessonView | Only in `FocusLessonView` | Scenarios in `UniversalConceptView` | Zero |
| `components/learn/SceneQuestion.tsx` | Child of FocusLessonView | Only in `FocusLessonView` | Scenarios in `ConceptExploreTab` | Zero |
| `components/learn/StateTransition.tsx` | Child of FocusLessonView | Only in `FocusLessonView` | `ConceptVisualActionStage` | Zero |
| `components/learn/TechnicalReveal.tsx` | Child of FocusLessonView | Only in `FocusLessonView` | Deep dive in `UniversalConceptView` | Zero |
| `data/focusLessonScenes.ts` | Data for FocusLessonView | `FocusLessonView` & test | `unifiedAcademyData.ts` | Zero |
| `tests/focus-lesson.test.ts` | Tests dead focus lesson | Only tests `focusLessonScenes.ts` | `academy-unified.test.ts` | Zero |
| `components/learn/TeacherLessonView.tsx` | Old vertical slice | Only in dead `App.tsx` import | `GitAcademyView` | Zero |
| `components/learn/ContextualGitStage.tsx` | Child of TeacherLessonView | Only in `TeacherLessonView` | `ConceptVisualActionStage` | Zero |
| `components/learn/TeacherDialogueCard.tsx` | Child of TeacherLessonView | Only in `TeacherLessonView` | `UniversalConceptHero` | Zero |
| `components/learn/TeachingCanvas.tsx` | Child of TeacherLessonView | Only in `TeacherLessonView` | `UniversalConceptView` | Zero |
| `components/learn/ContextualTermPopover.tsx` | Child of TeacherDialogueCard | Only in `TeacherDialogueCard` | Terminology in `UniversalConceptView` | Zero |
| `components/learn/IndependentChallengeView.tsx` | Child of TeachingCanvas | Only in `TeachingCanvas` | `ConceptPracticeTab` challenges | Zero |
| `components/learn/StateImpactDiff.tsx` | Child of TeachingCanvas | Only in `TeachingCanvas` | `ConceptVisualActionStage` diffs | Zero |
| `components/learn/SyntaxTokenBreakdown.tsx` | Child of TeachingCanvas | Only in `TeachingCanvas` | `InteractiveSyntaxExplorer` | Zero |
| `components/learn/KnowledgePillarsCard.tsx` | Obsolete 5-pillar UI card | `TeachingCanvas`, `PillarsNavigatorModal` | Tabs in `UniversalConceptView` | Zero |
| `data/teacherSliceStory.ts` | Story data for teacher slice | `TeacherLessonView` & test | `unifiedAcademyData.ts` | Zero |
| `data/topicLessons.ts` | Old topic lesson mapping | `TeacherLessonView` & test | `unifiedAcademyData.ts` | Zero |
| `tests/teacher-vertical-slice.test.ts` | Tests dead teacher slice | Tests `teacherSliceStory.ts` | `all-topics-curriculum.test.ts` | Zero |
| `tests/topic-lessons.test.ts` | Tests dead topic lessons | Tests `topicLessons.ts` | `all-topics-curriculum.test.ts` | Zero |
| `components/labs/First10MinutesView.tsx` | Dead onboarding wizard | Only in dead `App.tsx` import | `OnboardingWizard` + Topic 01 in Academy | Zero |
| `components/common/ForgeAvatar.tsx` | Only used in First10Minutes | Only in `First10MinutesView` | None needed | Zero |
| `data/first10Minutes.ts` | Data for First10MinutesView | `First10MinutesView` & test | Topic 01 in `unifiedAcademyData.ts` | Zero |
| `components/roadmap/RoadmapView.tsx` | Unreachable roadmap view | None | 18-Topic roadmap in `GitAcademyView` | Zero |
| `components/roadmap/RoadmapCanvas.tsx` | Unreachable ELK canvas | `RoadmapView` | 18-Topic roadmap in `GitAcademyView` | Zero |
| `services/roadmapLayoutEngine.ts` | ELK layout engine for canvas | `RoadmapCanvas` & test | Not needed | Zero |
| `data/roadmapGraphData.ts` | Data for dead roadmap | Test only | `unifiedAcademyData.ts` | Zero |
| `data/roadmapGraphModel.ts` | Types for dead roadmap | `RoadmapCanvas` & test | `unifiedAcademyData.ts` | Zero |
| `tests/roadmap-graph.test.ts` | Tests dead graph data | Tests `roadmapGraphData.ts` | Not needed | Zero |
| `tests/roadmap-graph-engine.test.ts` | Tests dead ELK engine | Tests `roadmapLayoutEngine.ts` | Not needed | Zero |
| `components/journey/GitJourneyView.tsx` | Dead 12-bento journey | Only in dead `App.tsx` import | `GitAcademyView` | Zero |
| `components/journey/CurriculumBento.tsx` | 12-card bento grid | `GitJourneyView` | 18-Topic Academy Curriculum | Zero |
| `components/journey/CurriculumPreviews.tsx` | Bento preview cards | `CurriculumBento` | `UniversalConceptView` | Zero |
| `components/journey/ExpandedCurriculumSection.tsx` | Bento expanded view | `GitJourneyView` | `UniversalConceptView` | Zero |
| `components/journey/JourneyTimeline.tsx` | Journey timeline list | `GitJourneyView` | 18-Topic Academy Sidebar | Zero |
| `components/journey/ContinueLearningCard.tsx` | Continue card in journey | `GitJourneyView` | Progress tracked in `GitAcademyView` | Zero |
| `components/navigation/PillarsNavigatorModal.tsx` | Redundant modal for 5 pillars | Unused alternative | Fully integrated in `UniversalConceptView` | Zero |
| `data/journeyModel.ts` | 12-category journey model | Bento components & tests | `unifiedAcademyData.ts` | Zero |
| `data/chapterCurations.ts` | 12-chapter metadata | Bento components & tests | `unifiedAcademyData.ts` | Zero |
| `data/chapterSeeders.ts` | Old chapter seed repos | `topicLessons.ts` | `sandbox` in `unifiedAcademyData.ts` | Zero |
| `data/topicPillars.ts` | Synthesized 5-pillars | `PillarsNavigatorModal` & tests | `unifiedAcademyData.ts` | Zero |
| `tests/journey-bento.test.ts` | Tests dead bento model | Tests `journeyModel.ts` | `academy-unified.test.ts` | Zero |
| `tests/chapter-curations.test.ts` | Tests dead chapter curations | Tests `chapterCurations.ts` | `all-topics-curriculum.test.ts` | Zero |
| `tests/topic-pillars.test.ts` | Tests dead topic pillars | Tests `topicPillars.ts` | `all-topics-curriculum.test.ts` | Zero |
| `components/dashboard/DashboardView.tsx` | Dead dashboard view | None | `GitAcademyView` | Zero |
| `components/academy/AcademyMapView.tsx` | Dead 6-stage curriculum map | `DashboardView` | 18-Topic Academy Map | Zero |
| `components/academy/ConceptPreviewDrawer.tsx` | Drawer for dead map | `AcademyMapView` | Concept tabs in `UniversalConceptView` | Zero |
| `components/academy/ProblemSolverModal.tsx` | Old problem modal | `AcademyMapView` | `GlobalProblemSearchModal.tsx` | Zero |
| `data/academyCurriculum.ts` | Old 6-stage curriculum data | `AcademyMapView` & test | `unifiedAcademyData.ts` | Zero |
| `tests/academy-curriculum.test.ts` | Tests dead 6-stage curriculum | Tests `academyCurriculum.ts` | `academy-unified.test.ts` | Zero |
| `components/animation/InteractiveSimulator.tsx` | Dead orphan component | None | `GitAnimationStage.tsx` | Zero |
| `components/learn/CommandSidebar.tsx` | Dead orphan component | None | 18-Topic Academy Sidebar | Zero |
| `components/editor/AppPreview.tsx` | Dead file | None | None needed | Zero |
| `components/panels/LessonPanel.tsx` | Dead file | None | None needed | Zero |
| `data/curriculum.ts` | Obsolete Levels 0-12 data | `LessonPanel.tsx` | `unifiedAcademyData.ts` | Zero |
| `assets/hero.png` | Unused starter asset | None | None | Zero |
| `assets/react.svg` | Unused starter asset | None | None | Zero |
| `assets/vite.svg` | Unused starter asset | None | None | Zero |

---

## 7. Consolidation Plan

1. **`src/App.tsx`**:
   - Remove unused imports: `GitStateInspector`, `ThreeAreaVisualizer`, `GitGraph`, `FileExplorer`, `CodeEditor`, `AppPreview`, `Terminal`, `LessonPanel`, `First10MinutesView`, `FocusLessonView`, `TeacherLessonView`, `GitJourneyView`, `PillarsNavigatorModal`.
   - Remove dead `<PillarsNavigatorModal />` from JSX.
   - Retain all active routes: `GitAcademyView`, `PracticeView`, `LabsHubView`, `DeveloperIdeView`, `CommandReferenceView`.

2. **`src/components/layout/HeaderNav.tsx`**:
   - Add explicit **Labs** button to the main navigation tabs (`setMode('labs')`).
   - Remove "5 Pillars" button (since the 5 pillars are already embedded in every concept in `GitAcademyView`).
   - Retain Search (⌘K), Theme Toggle, Reset, Profile, Help ("Problem?").

3. **`src/components/labs/LabsHubView.tsx`**:
   - Connect **UndoLabView**, **CapstoneView**, and **ConfigLabView** into `LAB_CARDS` and the view switcher, so learners have access to all 7 lab environments.

4. **`src/context/AppContext.tsx`**:
   - Remove unused import of `LESSONS, Lesson, LEVELS` from `curriculum.ts`.
   - Remove `openPillarsModal` and `showPillarsModal` dead state.

5. **`src/tests/learning-ux.test.ts`**:
   - Remove the first `describe('Gated Progression')` block that tested dead `FIRST_10_MINUTES_STEPS`.
   - Keep Evidence-Based Mastery, Engine as Teacher, and Command Coverage tests completely intact.

6. **`package.json`**:
   - Remove `elkjs` dependency.

---

## 8. Verification Plan
- **TypeScript Compilation:** `npx tsc --noEmit` must pass with 0 errors.
- **Unit & Integration Tests:** `npm test` must run and pass 100% of canonical tests.
- **Production Build:** `npm run build` must succeed without warnings.
- **Linter:** `npm run lint` must pass with 0 errors.
- **Interactive Browser Verification:** Verify navigation between Learn, Practice, Visualize, Labs, Reference, and IDE.
