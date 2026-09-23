// src/platform/adapters/gitAdapter.ts
import { GitEngine } from '../../commitforge/git-engine/engine';
import { UniversalConcept } from '../../commitforge/data/unifiedAcademyData';
import {
  UniversalLesson,
  SyntaxTokenBreakdown,
  ConceptVariation as PlatformVariation,
  TerminologyItem,
  DiagramNode,
} from '../lesson-runtime/types';
import { RuntimeAdapter, ExecutionResult } from '../terminal/types';

/**
 * GitRuntimeAdapter connects the pure GitEngine state machine
 * to the UniversalTerminal.
 */
export class GitRuntimeAdapter implements RuntimeAdapter {
  technology = 'git' as const;
  private engine: GitEngine;

  constructor(engine: GitEngine) {
    this.engine = engine;
  }

  get promptPrefix(): string {
    const repo = this.engine.getRepo();
    if (!repo.initialized) return '~/project $';
    const branch = repo.head.type === 'branch' ? repo.head.ref : `(${repo.head.ref.slice(0, 7)})`;
    return `repo (${branch}) $`;
  }

  execute(command: string): ExecutionResult {
    const res = this.engine.execute(command);
    return {
      stdout: res.stdout.join('\n'),
      stderr: res.stderr.join('\n'),
      exitCode: res.exitCode,
      stateChanged: res.stateChanged,
    };
  }

  getCompletions(prefix: string): string[] {
    const gitCommands = [
      'git status',
      'git add .',
      'git commit -m ""',
      'git log --oneline',
      'git branch',
      'git checkout',
      'git switch',
      'git merge',
      'git rebase',
      'git diff',
      'git stash',
      'git reset --soft HEAD~1',
      'git restore',
      'git remote -v',
      'git push',
      'git pull',
      'git fetch',
    ];
    return gitCommands.filter((c) => c.startsWith(prefix));
  }

  reset(): void {
    this.engine.resetRepo();
  }

  getEnvironmentInfo(): Record<string, string> {
    const repo = this.engine.getRepo();
    return {
      initialized: String(repo.initialized),
      branch: repo.head.ref,
      commitCount: String(Object.keys(repo.commits).length),
    };
  }
}

/**
 * Maps a CommitForge UniversalConcept into the platform-wide UniversalLesson schema.
 */
export function gitLessonAdapter(concept: UniversalConcept): UniversalLesson {
  // 1. Map Syntax Tokens
  const tokens: SyntaxTokenBreakdown[] = concept.syntaxTokens.map((t, idx) => {
    let role: SyntaxTokenBreakdown['role'] = 'argument';
    if (idx === 0) role = 'binary';
    else if (idx === 1 && !t.token.startsWith('-')) role = 'subcommand';
    else if (t.token.startsWith('-')) role = 'flag';
    else if (t.role.toLowerCase().includes('option')) role = 'option';
    else if (t.role.toLowerCase().includes('target')) role = 'target';

    return {
      token: t.token,
      role,
      meaning: t.explanation || `${t.token} operator in ${concept.command}`,
      withoutIt: idx <= 1 ? 'Command will fail to execute or default to help' : 'Default behavior applies without this flag',
      whenToUse: `Use when executing ${concept.command} in standard development workflows`,
      alternatives: t.token.startsWith('-') ? ['--help', '-v'] : undefined,
    };
  });

  // 2. Map Variations
  const variations: PlatformVariation[] = (concept.variations || []).map((v) => ({
    title: v.title || 'Standard variation',
    syntax: v.syntax || v.snippet || concept.command,
    explanation: v.whatItDoes || v.desc || concept.whatIsIt,
    whenToUse: v.whenToUse || 'When standard defaults require specialization',
  }));

  // Ensure at least 2 variations
  if (variations.length < 2) {
    variations.push({
      title: 'Verbose / Diagnostic Flag',
      syntax: `${concept.command} -v`,
      explanation: 'Prints extra debugging output and execution traces to stdout.',
      whenToUse: 'When troubleshooting command behavior or inspecting details.',
    });
  }

  // 3. Map Diagram Nodes
  const nodes: DiagramNode[] = [
    {
      id: 'working-tree',
      label: 'Working Tree',
      simpleDef: 'Your active files being edited in the editor.',
      techDef: 'Uncommitted file modifications on disk awaiting git add.',
      status: 'active',
    },
    {
      id: 'staging-area',
      label: 'Staging Area (Index)',
      simpleDef: 'The staging staging prep room for the next commit snapshot.',
      techDef: 'The binary .git/index tracking tree entry SHAs to be packaged into a commit.',
      status: 'active',
    },
    {
      id: 'repo-history',
      label: 'Git Repository (.git)',
      simpleDef: 'Permanent immutable project history database.',
      techDef: 'Directed Acyclic Graph (DAG) of commit objects referenced by branch pointers.',
      status: 'success',
    },
  ];

  // 4. Map Terminology
  const terminology: TerminologyItem[] = [
    {
      term: 'Working Directory',
      simpleDef: 'The visible files on your computer you are currently writing code in.',
      technicalDef: 'The filesystem tree synced with the currently checked-out commit.',
      analogy: 'Your physical workbench where raw parts are assembled.',
      confusionNote: "Don't confuse with the staging area; changes here are not yet tracked by Git snapshotting.",
    },
    {
      term: 'Staging Area (Index)',
      simpleDef: 'A pre-flight area where you organize changes before recording them.',
      technicalDef: 'The .git/index file holding exact blob hashes for the next commit tree.',
      analogy: 'A shipping box you fill with items before taping and labelling it.',
      confusionNote: 'Staged files are ready for commit, but have not yet received a permanent commit hash.',
    },
    {
      term: 'Commit (Snapshot)',
      simpleDef: 'A permanent save point in your project timeline.',
      technicalDef: 'An immutable SHA-1 object pointing to a tree object, parent commits, author, and message.',
      analogy: 'A Polaroid photograph capturing the exact state of everything at that instant.',
      confusionNote: 'Commits are immutable snapshots, not incremental diff patches.',
    },
    {
      term: 'HEAD',
      simpleDef: 'A pointer showing which branch or commit you are currently looking at.',
      technicalDef: 'The symbolic reference in .git/HEAD pointing to the active branch ref.',
      analogy: 'A bookmark in your project story indicating the active page.',
      confusionNote: 'Detached HEAD means HEAD points directly to a commit SHA rather than a branch name.',
    },
  ];

  // 5. Scenarios
  const firstScenario = concept.scenarios?.[0];
  const beginnerScenario = {
    title: firstScenario?.title || `Basic ${concept.command} Usage`,
    context: firstScenario?.context || `You made local edits and need to record them using ${concept.command}.`,
    goal: `Execute ${concept.command} and verify clean working tree state.`,
  };

  const realDevScenario = {
    title: 'Feature Branch Integration',
    setup: 'You are working on a team branch with 3 uncommitted modified files.',
    problem: 'You need to ensure only reviewed files are included in the upcoming deployment snapshot.',
    solution: `Use ${concept.command} to stage and seal your atomic changes.`,
  };

  const productionScenario = {
    title: 'Production Rollout / CI Verification',
    context: `CI/CD pipelines rely on deterministic commit hashes generated by ${concept.command} to tag Docker containers and trigger deployments.`,
    takeaway: 'Atomic, clean commits enable effortless rollbacks and accurate git bisect debugging.',
  };

  // 6. Simulation Steps
  const beforeState = concept.actionStage?.before;
  const runningState = concept.actionStage?.running;
  const afterState = concept.actionStage?.after;

  const simSteps = [
    {
      stepNumber: 1,
      actionTitle: beforeState?.label || 'Initial State',
      whatHappens: beforeState?.description || 'Modified files reside in working directory.',
      why: 'Changes begin on the filesystem before Git tracking.',
      technicalDetail: `Working tree contains ${beforeState?.workingDirectory?.length || 1} uncommitted file(s).`,
    },
    {
      stepNumber: 2,
      actionTitle: runningState?.label || `Execute ${concept.command}`,
      whatHappens: runningState?.description || 'Git calculates blob hashes and prepares the state transition.',
      why: 'The Git engine writes tree and blob objects into the object database.',
      technicalDetail: runningState?.commandPill || concept.command,
    },
    {
      stepNumber: 3,
      actionTitle: afterState?.label || 'Final State',
      whatHappens: afterState?.description || 'Repository state is updated; HEAD pointer advances.',
      why: 'Branch ref updated to point to the newly minted commit SHA.',
      technicalDetail: afterState?.whatChanged?.join(', ') || 'Working directory cleaned; index updated.',
    },
  ];

  // 7. Mistake & Recovery
  const safeFail = concept.challenge?.safeFailure;
  const mistakeAndRecovery = {
    mistakeTitle: safeFail?.mistakeTitle || `Accidental ${concept.command} on Wrong Branch`,
    mistakeCommand: safeFail?.mistakeCommand || `${concept.command} --wrong-flag`,
    whatHappened: safeFail?.whatHappened || 'Operation executed with unintended target or options.',
    whatWasNotLost: safeFail?.whatWasNotLost || 'All project file contents remain safely stored in the object database.',
    recoveryCommand: safeFail?.recoveryCommand || 'git reset --soft HEAD~1',
    recoveryExplanation:
      safeFail?.recoveryExplanation ||
      'Soft reset moves HEAD back one commit without touching your staging area or working tree files.',
  };

  // 8. Challenge
  const practice = concept.challenge;
  const challenge = {
    instructions: Array.isArray(practice?.instructions)
      ? practice.instructions.join(' ')
      : practice?.instructions || `Run ${concept.command} to achieve the goal state.`,
    taskGoal: practice?.objective || practice?.title || `Master ${concept.command}`,
    seedCommands: practice?.seedCommands,
    solutionCommand: practice?.expectedCommands?.[0] || concept.command,
    hints: practice?.hints?.length ? practice.hints : ['Check the syntax tab for required flags.', 'Run git status first.'],
    explanation: practice?.solutionExplanation || `Successfully executed ${concept.command} with correct parameters.`,
  };

  return {
    id: concept.id,
    technology: 'git',
    topicId: concept.topicId,
    topicNumber: concept.topicNumber,
    topicTitle: concept.topicTitle,
    title: concept.title,
    command: concept.command,
    subtitle: concept.subtitle,
    difficulty: concept.difficulty,
    badges: concept.badges || ['Git', 'Core'],

    definition: concept.whatIsIt,
    inSimpleWords: concept.inSimpleWords,
    beginnerExplanation: concept.whatIsIt,
    technicalExplanation: `Git engine command ${concept.command}. Manipulates working tree, staging index, and object store refs.`,
    realWorldAnalogy: {
      metaphor: 'Checkpoint in a Video Game',
      explanation: concept.realWorldAnalogy || 'Creates a permanent save point you can always return to if things go wrong.',
    },

    whyDoWeNeedIt: concept.whyDoYouNeedIt,
    problemItSolves: concept.quote || `Solves synchronization and state capture for ${concept.command}.`,
    whenToUse: [
      `When managing version history with ${concept.command}`,
      'Before pushing updates to remote collaborators',
      'When creating clean, atomic logical checkpoints',
    ],
    whenNotToUse: [
      'When files contain unencrypted passwords or API secrets',
      'When build artifacts or node_modules are unintentionally included (use .gitignore instead)',
    ],
    whereCommonlyUsed: ['Daily software development', 'Code review pipelines', 'Automated CI/CD workflows'],

    visualDiagram: {
      title: 'Git Three-Area Architecture',
      nodes,
      flow: [
        { from: 'working-tree', to: 'staging-area', label: 'git add' },
        { from: 'staging-area', to: 'repo-history', label: 'git commit' },
      ],
    },

    terminology,

    syntax: {
      command: concept.syntaxCode || concept.command,
      tokens,
      variations,
    },

    scenarios: {
      beginner: beginnerScenario,
      realDeveloper: realDevScenario,
      production: productionScenario,
    },

    simulation: {
      initialStateDescription: 'Git working tree with active project files.',
      visualComponentKey: 'git-three-area',
      steps: simSteps,
    },

    mistakeAndRecovery,
    challenge,
  };
}
