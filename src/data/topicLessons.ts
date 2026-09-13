import { GitRepo } from '../git-engine/types';
import {
  TeachingStep,
  MilestoneType,
  SliceState,
  TEACHING_STEPS as STAGING_TEACHING_STEPS,
  seedTeacherSliceRepo,
} from './teacherSliceStory';
import { BENTO_CATEGORIES, BentoCategory, JourneyConcept } from './journeyModel';
import { getSeedRepoForCategory, CHAPTER_SEEDERS } from './chapterSeeders';
import { getCuratedLessonForConcept } from './chapterCurations';

export interface TopicLessonPackage {
  conceptId: string;
  title: string;
  categoryTitle: string;
  categoryAccent: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  subtopics: string[];
  steps: TeachingStep[];
  seedRepo: () => GitRepo;
}

// Basic repository seeder for foundations and general lessons
export const createInitialDemoRepo = (): GitRepo => {
  const base = seedTeacherSliceRepo();
  return {
    ...base,
    initialized: false,
    commits: {},
    index: {},
    branches: {},
    tags: {},
    stash: [],
    reflog: [],
    mergeState: null,
    rebaseState: null,
    bisectState: null,
    workingDirectory: {
      'index.html': '<!DOCTYPE html>\n<html>\n<head><title>My Project</title></head>\n<body>\n  <h1>Hello, Git!</h1>\n</body>\n</html>',
      'README.md': '# My Project\nA beginner developer project learning Git.',
    },
  };
};

export const createInitializedDemoRepo = (): GitRepo => {
  const repo = createInitialDemoRepo();
  repo.initialized = true;
  repo.branches['main'] = {
    name: 'main',
    targetCommitHash: '',
  };
  return repo;
};

// ============================================================================
// DYNAMIC TOPIC LESSON SYNTHESIZER
// Generates a tailored, fully functional interactive lesson for ANY concept
// ============================================================================

export const synthesizeConceptLesson = (
  concept: JourneyConcept,
  category: BentoCategory
): TopicLessonPackage => {
  // Retrieve bespoke curation for this concept and chapter
  const curation = getCuratedLessonForConcept(
    concept.id,
    concept.title,
    concept.description,
    category.id,
    concept.commands,
    concept.subtopics
  );

  const subtopicsList = (concept.subtopics && concept.subtopics.length > 0)
    ? concept.subtopics
    : [
        `Mental model of ${concept.title}`,
        `Command execution and options`,
        `Verification and best practices`,
      ];

  const steps: TeachingStep[] = [
    // Step 1: Problem & Prediction
    {
      id: `${concept.id}-step-1-problem` as SliceState,
      stepIndex: 1,
      totalSteps: 3,
      milestone: 'Problem' as MilestoneType,
      milestoneLabel: 'Problem',
      title: `${concept.title}: Understanding the Goal`,
      seniorDeveloperDialogue: curation.dialogue,
      inPlainEnglish: curation.inPlainEnglish,
      highlightArea: 'working',
      prediction: curation.prediction,
      masteryRequirements: {
        prediction: true,
      },
    },

    // Step 2: Inspect & Action
    {
      id: `${concept.id}-step-2-inspect` as SliceState,
      stepIndex: 2,
      totalSteps: 3,
      milestone: 'Inspect' as MilestoneType,
      milestoneLabel: 'Inspect',
      title: `${concept.title}: Core Workflow`,
      seniorDeveloperDialogue: `Great intuition! Let's explore the core subtopics of ${concept.title}: ${subtopicsList.map((s, i) => `(${i + 1}) ${s}`).join(', ')}. Now let's execute the primary command to observe its effect on your repository state.`,
      inPlainEnglish: curation.actionPrompt,
      highlightArea: 'working',
      syntaxBreakdown: curation.syntaxBreakdown,
      variations: curation.variations,
      actionPrompt: curation.actionPrompt,
      expectedCommand: curation.expectedCommand,
      commandHints: curation.commandHints,
      masteryRequirements: {
        stateTransition: () => true,
      },
    },

    // Step 3: Reflection & Prove
    {
      id: `${concept.id}-step-3-prove` as SliceState,
      stepIndex: 3,
      totalSteps: 3,
      milestone: 'Prove' as MilestoneType,
      milestoneLabel: 'Prove',
      title: `${concept.title}: Knowledge Verification`,
      seniorDeveloperDialogue: `Outstanding work! You executed the command and observed the repository state. Complete this quick reflection question to solidify your knowledge and earn your badge.`,
      inPlainEnglish: `${concept.title} is now verified in your developer toolkit.`,
      highlightArea: 'staging',
      reflection: curation.reflection,
      masteryRequirements: {
        reflection: true,
      },
    },
  ];

  return {
    conceptId: concept.id,
    title: concept.title,
    categoryTitle: category.title,
    categoryAccent: category.accentColor,
    difficulty: concept.difficulty,
    subtopics: subtopicsList,
    steps,
    seedRepo: getSeedRepoForCategory(category.id),
  };
};

// ============================================================================
// MAIN REGISTRY ACCESSOR
// ============================================================================

export const getTopicLesson = (conceptId?: string | null): TopicLessonPackage => {
  const targetId = conceptId || 'c-what-is-vcs';

  // If the concept is the staging area canonical slice, use the full 18-step story
  if (targetId === 'c-staging-area' || targetId === 'staging-area') {
    return {
      conceptId: 'c-staging-area',
      title: 'Staging Area (Index)',
      categoryTitle: 'Foundations',
      categoryAccent: '#38bdf8',
      difficulty: 'Beginner',
      subtopics: [
        'The intermediate snapshot staging buffer (Index)',
        'Curating clean atomic commits before finalizing',
        'Staging individual files vs staging all changes',
        'Interactive hunk staging (git add -p)',
      ],
      steps: STAGING_TEACHING_STEPS,
      seedRepo: seedTeacherSliceRepo,
    };
  }

  // Find concept and category from BENTO_CATEGORIES
  let foundCategory: BentoCategory | undefined;
  let foundConcept: JourneyConcept | undefined;

  for (const cat of BENTO_CATEGORIES) {
    const c = cat.concepts.find((item) => item.id === targetId);
    if (c) {
      foundCategory = cat;
      foundConcept = c;
      break;
    }
  }

  // Fallback to first concept if not found
  if (!foundCategory || !foundConcept) {
    foundCategory = BENTO_CATEGORIES[0];
    foundConcept = foundCategory.concepts[0];
  }

  return synthesizeConceptLesson(foundConcept, foundCategory);
};
