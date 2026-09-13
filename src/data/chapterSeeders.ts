import { GitRepo, Commit, Branch, Remote, Tag, StashEntry, ReflogEntry } from '../git-engine/types';

// Helper to create ISO date strings in the past
const hoursAgo = (h: number): string => new Date(Date.now() - h * 3600000).toISOString();
const timestampHoursAgo = (h: number): number => Date.now() - h * 3600000;

// Base template repo
const createBaseRepo = (): GitRepo => ({
  initialized: true,
  currentDir: '/home/developer/project',
  workingDirectory: {},
  index: {},
  head: { type: 'branch', ref: 'main' },
  branches: {},
  remotes: {},
  commits: {},
  tags: {},
  stash: [],
  reflog: [],
  mergeState: null,
  rebaseState: null,
  bisectState: null,
  config: {
    'user.name': 'Junior Coder',
    'user.email': 'coder@commitforge.dev',
    'init.defaultBranch': 'main',
  },
  ignoredPatterns: ['node_modules/', '.env', 'dist/'],
  hooks: {},
});

// ============================================================================
// 1. CHAPTER 1: FOUNDATIONS SEED REPO
// A clean, freshly initialized beginner repository with foundational files
// ============================================================================
export const seedFoundationsRepo = (): GitRepo => {
  const repo = createBaseRepo();
  const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>My First Magic Castle</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <h1>🏰 Welcome to the Magic Castle</h1>
  <p>Building our dream web project step-by-step.</p>
</body>
</html>`;

  const styleCss = `body {
  font-family: 'Inter', system-ui, sans-serif;
  background: #0f172a;
  color: #f8fafc;
  margin: 0;
  padding: 2rem;
}
h1 { color: #38bdf8; }`;

  const readme = `# Magic Castle
A beginner-friendly web application learning Git version control.
Created with wonder and curiosity!`;

  repo.workingDirectory = {
    'index.html': indexHtml,
    'style.css': styleCss,
    'README.md': readme,
  };

  // Staged in index ready for initial commit
  repo.index = {
    'index.html': indexHtml,
    'style.css': styleCss,
    'README.md': readme,
  };

  repo.branches['main'] = {
    name: 'main',
    targetCommitHash: '',
  };

  return repo;
};

// ============================================================================
// 2. CHAPTER 2: INSPECT & SAVE SEED REPO
// Realistic repository with existing commits, uncommitted changes, staged changes
// ============================================================================
export const seedInspectSaveRepo = (): GitRepo => {
  const repo = createBaseRepo();

  const c1Hash = 'a1f38e2';
  const c2Hash = 'b4d92c1';

  const initialHtml = `<!DOCTYPE html>
<html>
<head><title>Space Arcade</title></head>
<body>
  <header><h1>🚀 Space Arcade</h1></header>
</body>
</html>`;

  const heroHtml = `<!DOCTYPE html>
<html>
<head><title>Space Arcade</title></head>
<body>
  <header>
    <h1>🚀 Space Arcade</h1>
    <p>High Score: 9,999</p>
  </header>
  <main id="game-canvas"></main>
</body>
</html>`;

  const modifiedHeroHtml = `<!DOCTYPE html>
<html>
<head><title>Space Arcade Deluxe</title></head>
<body>
  <header>
    <h1>🚀 Space Arcade Deluxe</h1>
    <p>High Score: 12,500</p>
  </header>
  <main id="game-canvas"></main>
  <footer>Built with Git & TypeScript</footer>
</body>
</html>`;

  const styleCss = `body { background: #0b0f19; color: #fff; }
#game-canvas { border: 2px solid #38bdf8; width: 640px; height: 480px; }`;

  const modifiedStyleCss = `body { background: #0b0f19; color: #fff; font-family: sans-serif; }
#game-canvas { border: 3px solid #10b981; width: 800px; height: 600px; box-shadow: 0 0 20px #10b98144; }`;

  const appJs = `console.log("Game initialized!");\nconst score = 12500;`;

  repo.commits[c1Hash] = {
    hash: c1Hash,
    shortHash: c1Hash,
    parents: [],
    tree: { 'index.html': 'blob_idx_1', 'style.css': 'blob_css_1' },
    files: { 'index.html': initialHtml, 'style.css': styleCss },
    author: 'Commander Alex <alex@spacearcade.io>',
    email: 'alex@spacearcade.io',
    date: hoursAgo(24),
    timestamp: timestampHoursAgo(24),
    message: 'feat: initial space arcade setup',
  };

  repo.commits[c2Hash] = {
    hash: c2Hash,
    shortHash: c2Hash,
    parents: [c1Hash],
    tree: { 'index.html': 'blob_idx_2', 'style.css': 'blob_css_1' },
    files: { 'index.html': heroHtml, 'style.css': styleCss },
    author: 'Commander Alex <alex@spacearcade.io>',
    email: 'alex@spacearcade.io',
    date: hoursAgo(6),
    timestamp: timestampHoursAgo(6),
    message: 'feat(ui): add game canvas and high score display',
  };

  repo.branches['main'] = {
    name: 'main',
    targetCommitHash: c2Hash,
  };

  // Staged: style.css is modified and staged
  repo.index = {
    'index.html': heroHtml, // unmodified in index
    'style.css': modifiedStyleCss, // staged modification
  };

  // Working directory: index.html has un-staged modifications, app.js is untracked
  repo.workingDirectory = {
    'index.html': modifiedHeroHtml,
    'style.css': modifiedStyleCss,
    'app.js': appJs,
    'notes.txt': 'TODO: Add laser sound effects and boss battle.',
  };

  repo.reflog = [
    { index: 0, fromHash: c1Hash, toHash: c2Hash, action: 'commit', message: 'commit: feat(ui): add game canvas and high score display', timestamp: timestampHoursAgo(6) },
    { index: 1, fromHash: '', toHash: c1Hash, action: 'commit (initial)', message: 'commit (initial): feat: initial space arcade setup', timestamp: timestampHoursAgo(24) },
  ];

  return repo;
};

// ============================================================================
// 3. CHAPTER 3: UNDO & RECOVER SEED REPO
// Realistic repository with mistake files, staged secret tokens, and commits to undo
// ============================================================================
export const seedUndoRecoverRepo = (): GitRepo => {
  const repo = createBaseRepo();

  const c1 = '7a19bc3';
  const c2 = '8e44f12';
  const c3Bad = '9c02d88'; // Commit with buggy code that should be reverted

  const cleanJs = `// Production Server
export function calculateDamage(base, power) {
  return base * power;
}`;

  const buggyJs = `// Production Server - BUGGY SYNTAX ERROR
export function calculateDamage(base, power) {
  return base * 999999999999; // CRASH OVERFLOW!
}`;

  repo.commits[c1] = {
    hash: c1,
    shortHash: c1,
    parents: [],
    tree: { 'server.js': 'blob_srv_1' },
    files: { 'server.js': cleanJs },
    author: 'Senior Dev <team@studio.dev>',
    email: 'team@studio.dev',
    date: hoursAgo(12),
    timestamp: timestampHoursAgo(12),
    message: 'feat: add core combat battle calculation engine',
  };

  repo.commits[c2] = {
    hash: c2,
    shortHash: c2,
    parents: [c1],
    tree: { 'server.js': 'blob_srv_1', 'config.json': 'blob_cfg_1' },
    files: { 'server.js': cleanJs, 'config.json': '{\n  "version": "1.0.0",\n  "env": "production"\n}' },
    author: 'Senior Dev <team@studio.dev>',
    email: 'team@studio.dev',
    date: hoursAgo(8),
    timestamp: timestampHoursAgo(8),
    message: 'chore: add production app config manifest',
  };

  repo.commits[c3Bad] = {
    hash: c3Bad,
    shortHash: c3Bad,
    parents: [c2],
    tree: { 'server.js': 'blob_srv_bad', 'config.json': 'blob_cfg_1' },
    files: { 'server.js': buggyJs, 'config.json': '{\n  "version": "1.0.0",\n  "env": "production"\n}' },
    author: 'Rookie Intern <intern@studio.dev>',
    email: 'intern@studio.dev',
    date: hoursAgo(1),
    timestamp: timestampHoursAgo(1),
    message: 'feat(combat): increase damage multiplier (BUGGY!)',
  };

  repo.branches['main'] = {
    name: 'main',
    targetCommitHash: c3Bad,
  };

  // Accidentally staged secret .env file!
  const secretEnv = `STRIPE_SECRET_KEY=sk_live_998877665544332211\nDATABASE_PASSWORD=SuperSecretP@ssw0rd!`;
  const scratchNotes = `Accidental scribble that developer wants to discard from desk`;

  repo.index = {
    'server.js': buggyJs,
    'config.json': '{\n  "version": "1.0.0",\n  "env": "production"\n}',
    '.env': secretEnv, // DANGER: staged file that should be unstaged!
  };

  repo.workingDirectory = {
    'server.js': buggyJs,
    'config.json': '{\n  "version": "1.0.0",\n  "env": "production"\n}',
    '.env': secretEnv,
    'scratch.tmp': scratchNotes,
  };

  repo.reflog = [
    { index: 0, fromHash: c2, toHash: c3Bad, action: 'commit', message: 'commit: feat(combat): increase damage multiplier (BUGGY!)', timestamp: timestampHoursAgo(1) },
    { index: 1, fromHash: c1, toHash: c2, action: 'commit', message: 'commit: chore: add production app config manifest', timestamp: timestampHoursAgo(8) },
    { index: 2, fromHash: '', toHash: c1, action: 'commit (initial)', message: 'commit: feat: add core combat battle calculation engine', timestamp: timestampHoursAgo(12) },
  ];

  return repo;
};

// ============================================================================
// 4. CHAPTER 4: BRANCHING SEED REPO
// Multiple realistic branches (main, feature/dragon-shield, bugfix/jump-height)
// ============================================================================
export const seedBranchingRepo = (): GitRepo => {
  const repo = createBaseRepo();

  const cBase = '11aa22b';
  const cFeature = '33cc44d';
  const cBugfix = '55ee66f';

  repo.commits[cBase] = {
    hash: cBase,
    shortHash: cBase,
    parents: [],
    tree: { 'game.ts': 'blob_g_1', 'hero.ts': 'blob_h_1' },
    files: {
      'game.ts': 'export const GameTitle = "Dragon Knight Adventure";',
      'hero.ts': 'export const Hero = { name: "Arthur", hp: 100, shield: "Wooden Shield" };',
    },
    author: 'Lead Architect <lead@gamecraft.com>',
    email: 'lead@gamecraft.com',
    date: hoursAgo(48),
    timestamp: timestampHoursAgo(48),
    message: 'feat: initial Dragon Knight engine',
  };

  repo.commits[cFeature] = {
    hash: cFeature,
    shortHash: cFeature,
    parents: [cBase],
    tree: { 'game.ts': 'blob_g_1', 'hero.ts': 'blob_h_2' },
    files: {
      'game.ts': 'export const GameTitle = "Dragon Knight Adventure";',
      'hero.ts': 'export const Hero = { name: "Arthur", hp: 150, shield: "Legendary Dragon Shield" };',
    },
    author: 'Shield Artisan <art@gamecraft.com>',
    email: 'art@gamecraft.com',
    date: hoursAgo(10),
    timestamp: timestampHoursAgo(10),
    message: 'feat(items): craft Legendary Dragon Shield with +50 HP boost',
  };

  repo.commits[cBugfix] = {
    hash: cBugfix,
    shortHash: cBugfix,
    parents: [cBase],
    tree: { 'game.ts': 'blob_g_2', 'hero.ts': 'blob_h_1' },
    files: {
      'game.ts': 'export const GameTitle = "Dragon Knight Adventure";\nexport const Gravity = 9.8;',
      'hero.ts': 'export const Hero = { name: "Arthur", hp: 100, shield: "Wooden Shield" };',
    },
    author: 'Bug Squasher <bugs@gamecraft.com>',
    email: 'bugs@gamecraft.com',
    date: hoursAgo(4),
    timestamp: timestampHoursAgo(4),
    message: 'fix(physics): calibrate gravity constant to prevent infinite jumping',
  };

  repo.branches = {
    main: {
      name: 'main',
      targetCommitHash: cBase,
    },
    'feature/dragon-shield': {
      name: 'feature/dragon-shield',
      targetCommitHash: cFeature,
    },
    'bugfix/jump-height': {
      name: 'bugfix/jump-height',
      targetCommitHash: cBugfix,
    },
    'experiment/dark-mode': {
      name: 'experiment/dark-mode',
      targetCommitHash: cBase,
    },
  };

  repo.head = { type: 'branch', ref: 'main' };

  repo.index = {
    'game.ts': 'export const GameTitle = "Dragon Knight Adventure";',
    'hero.ts': 'export const Hero = { name: "Arthur", hp: 100, shield: "Wooden Shield" };',
  };

  repo.workingDirectory = { ...repo.index };

  repo.reflog = [
    { index: 0, fromHash: '', toHash: cBase, action: 'checkout', message: 'checkout: moving from feature to main', timestamp: timestampHoursAgo(2) },
    { index: 1, fromHash: '', toHash: cBase, action: 'commit', message: 'feat: initial Dragon Knight engine', timestamp: timestampHoursAgo(48) },
  ];

  return repo;
};

// ============================================================================
// 5. CHAPTER 5: MERGING & STRATEGIES SEED REPO
// 3-way merge ready repo and conflict scenario files
// ============================================================================
export const seedMergingRepo = (): GitRepo => {
  const repo = createBaseRepo();

  const cCommon = 'm00base';
  const cMain = 'm11main';
  const cFeature = 'm22feat';

  repo.commits[cCommon] = {
    hash: cCommon,
    shortHash: cCommon,
    parents: [],
    tree: { 'recipe.txt': 'blob_rec_0', 'chef.txt': 'blob_chef_0' },
    files: {
      'recipe.txt': '# Secret Pizza Recipe\n1. Roll the fresh dough\n2. Add tomato sauce\n3. Sprinkle mozzarella cheese\n4. Bake at 450F for 12 minutes',
      'chef.txt': 'Head Chef: Mario',
    },
    author: 'Mario <mario@pizzahouse.io>',
    email: 'mario@pizzahouse.io',
    date: hoursAgo(24),
    timestamp: timestampHoursAgo(24),
    message: 'feat: add original secret pizza recipe',
  };

  repo.commits[cMain] = {
    hash: cMain,
    shortHash: cMain,
    parents: [cCommon],
    tree: { 'recipe.txt': 'blob_rec_main', 'chef.txt': 'blob_chef_0' },
    files: {
      'recipe.txt': '# Secret Pizza Recipe\n1. Roll the fresh dough\n2. Add tomato sauce with fresh basil\n3. Sprinkle mozzarella cheese\n4. Bake at 450F for 12 minutes\n5. Drizzle olive oil',
      'chef.txt': 'Head Chef: Mario',
    },
    author: 'Mario <mario@pizzahouse.io>',
    email: 'mario@pizzahouse.io',
    date: hoursAgo(10),
    timestamp: timestampHoursAgo(10),
    message: 'feat(main): enhance sauce with fresh basil and finishing olive oil',
  };

  repo.commits[cFeature] = {
    hash: cFeature,
    shortHash: cFeature,
    parents: [cCommon],
    tree: { 'recipe.txt': 'blob_rec_feat', 'dessert.txt': 'blob_des_0' },
    files: {
      'recipe.txt': '# Secret Pizza Recipe\n1. Roll the fresh dough\n2. Add tomato sauce\n3. Sprinkle mozzarella cheese\n4. Bake at 450F for 12 minutes\n5. Serve with garlic dipping sauce',
      'chef.txt': 'Head Chef: Mario',
      'dessert.txt': 'Tiramisu with cocoa powder and espresso biscuits.',
    },
    author: 'Luigi <luigi@pizzahouse.io>',
    email: 'luigi@pizzahouse.io',
    date: hoursAgo(6),
    timestamp: timestampHoursAgo(6),
    message: 'feat(menu): add garlic dipping sauce and Luigi special tiramisu',
  };

  repo.branches = {
    main: {
      name: 'main',
      targetCommitHash: cMain,
    },
    'feature/dessert-menu': {
      name: 'feature/dessert-menu',
      targetCommitHash: cFeature,
    },
  };

  repo.head = { type: 'branch', ref: 'main' };
  repo.index = { ...repo.commits[cMain].files };
  repo.workingDirectory = { ...repo.commits[cMain].files };

  return repo;
};

// ============================================================================
// 6. CHAPTER 6: REMOTE GIT SEED REPO
// Configured origin remote with ahead/behind branches and tracking setup
// ============================================================================
export const seedRemoteRepo = (): GitRepo => {
  const repo = createBaseRepo();

  const cOrigin = 'rem0011';
  const cLocalAhead = 'rem0022';

  repo.commits[cOrigin] = {
    hash: cOrigin,
    shortHash: cOrigin,
    parents: [],
    tree: { 'spacecraft.json': 'blob_sc_1' },
    files: {
      'spacecraft.json': '{\n  "ship": "Apollo Falcon",\n  "fuel": 100,\n  "shields": "ONLINE"\n}',
    },
    author: 'Mission Control <ground@orbit.nasa>',
    email: 'ground@orbit.nasa',
    date: hoursAgo(20),
    timestamp: timestampHoursAgo(20),
    message: 'feat: spacecraft telemetry online in orbit',
  };

  repo.commits[cLocalAhead] = {
    hash: cLocalAhead,
    shortHash: cLocalAhead,
    parents: [cOrigin],
    tree: { 'spacecraft.json': 'blob_sc_2' },
    files: {
      'spacecraft.json': '{\n  "ship": "Apollo Falcon",\n  "fuel": 95,\n  "shields": "ONLINE",\n  "warpDrive": "READY"\n}',
    },
    author: 'Astronaut Kid <astro@space.dev>',
    email: 'astro@space.dev',
    date: hoursAgo(2),
    timestamp: timestampHoursAgo(2),
    message: 'feat(drive): power on hyper-warp engines (local save point)',
  };

  repo.branches = {
    main: {
      name: 'main',
      targetCommitHash: cLocalAhead,
      upstream: 'origin/main',
    },
  };

  repo.remotes = {
    origin: {
      name: 'origin',
      url: 'https://github.com/coder-kid/space-adventure.git',
      branches: {
        main: {
          remote: 'origin',
          branch: 'main',
          targetCommitHash: cOrigin, // Remote is 1 commit behind local
        },
        'alien-encounter': {
          remote: 'origin',
          branch: 'alien-encounter',
          targetCommitHash: cOrigin,
        },
      },
    },
  };

  repo.head = { type: 'branch', ref: 'main' };
  repo.index = { ...repo.commits[cLocalAhead].files };
  repo.workingDirectory = { ...repo.commits[cLocalAhead].files };

  return repo;
};

// ============================================================================
// 7. CHAPTER 7: GITHUB ESSENTIALS SEED REPO
// Repository with README, CONTRIBUTING, LICENSE, and GitHub profile files
// ============================================================================
export const seedGitHubRepo = (): GitRepo => {
  const repo = createBaseRepo();
  const cInit = 'gh0011a';

  const readmeContent = `# 🌟 StarQuest Engine
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://github.com/coder-kid/starquest)

The open-source galaxy exploration engine built for young adventurers!

## 🚀 Quick Start
\`\`\`bash
git clone https://github.com/coder-kid/starquest.git
cd starquest
npm install
npm run dev
\`\`\`

## 🤝 How to Contribute
Check out [CONTRIBUTING.md](CONTRIBUTING.md) to join the crew!
`;

  const contributing = `# Contributing to StarQuest
We love new star explorers!
1. Fork the repo.
2. Create your feature branch (\`git switch -c feature/cool-nebula\`).
3. Commit your changes (\`git commit -m "feat: add neon nebula"\`).
4. Push to your branch and open a Pull Request.`;

  const license = `MIT License
Copyright (c) 2026 CommitForge Star Explorers
Permission is hereby granted, free of charge, to any person obtaining a copy...`;

  repo.commits[cInit] = {
    hash: cInit,
    shortHash: cInit,
    parents: [],
    tree: { 'README.md': 'blob_gh_rm', 'CONTRIBUTING.md': 'blob_gh_co', 'LICENSE': 'blob_gh_li' },
    files: { 'README.md': readmeContent, 'CONTRIBUTING.md': contributing, 'LICENSE': license },
    author: 'Star Captain <captain@starquest.io>',
    email: 'captain@starquest.io',
    date: hoursAgo(48),
    timestamp: timestampHoursAgo(48),
    message: 'docs: establish open source community guidelines and README',
  };

  repo.branches['main'] = { name: 'main', targetCommitHash: cInit };
  repo.head = { type: 'branch', ref: 'main' };
  repo.index = { ...repo.commits[cInit].files };
  repo.workingDirectory = { ...repo.commits[cInit].files };

  return repo;
};

// ============================================================================
// 8. CHAPTER 8: COLLABORATION & PRS SEED REPO
// Multi-author repo with CODEOWNERS, PR templates, and team review branches
// ============================================================================
export const seedCollaborationRepo = (): GitRepo => {
  const repo = createBaseRepo();
  const c1 = 'col001a';
  const c2 = 'col002b';

  const codeowners = `# Global code owners
* @tech-lead @captain-kid

# Frontend team
src/components/ @ui-wizards
src/styles/ @design-heroes
`;

  const prTemplate = `## Description
What does this Pull Request add or fix?

## Checklist
- [ ] Code compiles without errors
- [ ] Tested locally on desktop
- [ ] Assigned reviewers
`;

  repo.commits[c1] = {
    hash: c1,
    shortHash: c1,
    parents: [],
    tree: { 'CODEOWNERS': 'blob_co', '.github/PULL_REQUEST_TEMPLATE.md': 'blob_pr' },
    files: { 'CODEOWNERS': codeowners, '.github/PULL_REQUEST_TEMPLATE.md': prTemplate },
    author: 'Tech Lead Sarah <sarah@teamcraft.io>',
    email: 'sarah@teamcraft.io',
    date: hoursAgo(72),
    timestamp: timestampHoursAgo(72),
    message: 'chore: establish CODEOWNERS and standard PR review template',
  };

  repo.commits[c2] = {
    hash: c2,
    shortHash: c2,
    parents: [c1],
    tree: { 'src/App.tsx': 'blob_app_1' },
    files: {
      'CODEOWNERS': codeowners,
      '.github/PULL_REQUEST_TEMPLATE.md': prTemplate,
      'src/App.tsx': 'export const App = () => <div>Welcome to TeamCraft Collab!</div>;',
    },
    author: 'Samira Developer <samira@teamcraft.io>',
    email: 'samira@teamcraft.io',
    date: hoursAgo(12),
    timestamp: timestampHoursAgo(12),
    message: 'feat: implement initial collaborative team dashboard',
  };

  repo.branches = {
    main: { name: 'main', targetCommitHash: c2 },
    'pr/team-feature': { name: 'pr/team-feature', targetCommitHash: c2 },
  };

  repo.head = { type: 'branch', ref: 'main' };
  repo.index = { ...repo.commits[c2].files };
  repo.workingDirectory = { ...repo.commits[c2].files };

  return repo;
};

// ============================================================================
// 9. CHAPTER 9: ADVANCED GIT SEED REPO
// Rebase candidates, stashed work, annotated tags, bisect-ready commits
// ============================================================================
export const seedAdvancedRepo = (): GitRepo => {
  const repo = createBaseRepo();

  const c1 = 'adv001a';
  const c2 = 'adv002b';
  const c3 = 'adv003c';
  const c4 = 'adv004d';

  repo.commits[c1] = {
    hash: c1,
    shortHash: c1,
    parents: [],
    tree: { 'magic.ts': 'blob_m_1' },
    files: { 'magic.ts': 'export const SpellPower = 10;' },
    author: 'Grand Wizard <wizard@magic.academy>',
    email: 'wizard@magic.academy',
    date: hoursAgo(96),
    timestamp: timestampHoursAgo(96),
    message: 'feat: initialize magic academy spell engine',
  };

  repo.commits[c2] = {
    hash: c2,
    shortHash: c2,
    parents: [c1],
    tree: { 'magic.ts': 'blob_m_2' },
    files: { 'magic.ts': 'export const SpellPower = 25;\nexport const ManaCost = 5;' },
    author: 'Apprentice <apprentice@magic.academy>',
    email: 'apprentice@magic.academy',
    date: hoursAgo(48),
    timestamp: timestampHoursAgo(48),
    message: 'feat(spells): add lightning storm spell (draft 1)',
  };

  repo.commits[c3] = {
    hash: c3,
    shortHash: c3,
    parents: [c2],
    tree: { 'magic.ts': 'blob_m_3' },
    files: { 'magic.ts': 'export const SpellPower = 30;\nexport const ManaCost = 8;\n// fix typo' },
    author: 'Apprentice <apprentice@magic.academy>',
    email: 'apprentice@magic.academy',
    date: hoursAgo(24),
    timestamp: timestampHoursAgo(24),
    message: 'fix: typo in spell name (squash candidate)',
  };

  repo.commits[c4] = {
    hash: c4,
    shortHash: c4,
    parents: [c3],
    tree: { 'magic.ts': 'blob_m_4' },
    files: { 'magic.ts': 'export const SpellPower = 50;\nexport const ManaCost = 10;\nexport const Cooldown = 3;' },
    author: 'Apprentice <apprentice@magic.academy>',
    email: 'apprentice@magic.academy',
    date: hoursAgo(2),
    timestamp: timestampHoursAgo(2),
    message: 'feat(spells): balance cooldown timing for lightning storm',
  };

  repo.branches['main'] = { name: 'main', targetCommitHash: c4 };
  repo.head = { type: 'branch', ref: 'main' };

  // Annotated Tag
  repo.tags['v1.0.0'] = {
    name: 'v1.0.0',
    targetCommitHash: c1,
    annotated: true,
    message: 'Production Release v1.0.0 — The Magic Academy Opens',
    tagger: 'Grand Wizard <wizard@magic.academy>',
    date: hoursAgo(96),
  };

  // Stash entry
  repo.stash = [
    {
      id: 0,
      message: 'WIP on main: secret invisibility cloak spell (in-progress)',
      branch: 'main',
      workingFiles: {
        'secret_cloak.ts': 'export const Invisibility = true; // Still testing duration',
      },
      indexFiles: {},
      timestamp: timestampHoursAgo(4),
    },
  ];

  repo.index = { ...repo.commits[c4].files };
  repo.workingDirectory = {
    ...repo.commits[c4].files,
    'lab_notes.md': '# Alchemist Research Notes\nTesting new potion recipes.',
  };

  return repo;
};

// ============================================================================
// 10. CHAPTER 10: GIT ENGINEERING & HOOKS SEED REPO
// Pre-commit hooks, commitlint, git config aliases, objects internals
// ============================================================================
export const seedEngineeringRepo = (): GitRepo => {
  const repo = createBaseRepo();
  const cInit = 'eng0011a';

  const preCommitHook = `#!/bin/sh
# CommitForge Guard Hook
echo "🛡️ Git Hook: Verifying code quality before commit..."
if grep -q "console.log" src/*.ts 2>/dev/null; then
  echo "⚠️ Warning: Found debug console.log statements!"
fi
exit 0`;

  const commitMsgHook = `#!/bin/sh
# Conventional Commits Validator
commit_msg=$(cat "$1")
if ! echo "$commit_msg" | grep -qE "^(feat|fix|docs|chore|refactor|test): "; then
  echo "❌ Error: Commit message must follow Conventional Commits: feat: / fix: / chore:"
  exit 1
fi`;

  repo.hooks = {
    'pre-commit': preCommitHook,
    'commit-msg': commitMsgHook,
  };

  repo.config = {
    'user.name': 'Dev Engineer',
    'user.email': 'engineer@commitforge.dev',
    'alias.st': 'status',
    'alias.co': 'checkout',
    'alias.lg': 'log --graph --oneline --decorate --all',
    'alias.br': 'branch',
  };

  repo.commits[cInit] = {
    hash: cInit,
    shortHash: cInit,
    parents: [],
    tree: { 'src/index.ts': 'blob_eng_1' },
    files: { 'src/index.ts': 'export const systemHealth = "100% Operational";' },
    author: 'Site Reliability Hero <sre@cloudinfra.net>',
    email: 'sre@cloudinfra.net',
    date: hoursAgo(100),
    timestamp: timestampHoursAgo(100),
    message: 'feat: initialize core engineering platform architecture',
  };

  repo.branches['main'] = { name: 'main', targetCommitHash: cInit };
  repo.head = { type: 'branch', ref: 'main' };
  repo.index = { ...repo.commits[cInit].files };
  repo.workingDirectory = {
    ...repo.commits[cInit].files,
    '.git/hooks/pre-commit': preCommitHook,
  };

  return repo;
};

// ============================================================================
// 11. CHAPTER 11: GITHUB ACTIONS SEED REPO
// Complete CI/CD workflow YAML, test suite, and matrix build config
// ============================================================================
export const seedGitHubActionsRepo = (): GitRepo => {
  const repo = createBaseRepo();
  const cInit = 'act0011a';

  const ciWorkflow = `name: CI Test & Build Pipeline
on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    name: Run Unit Tests
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [18.x, 20.x]
    steps:
      - name: 📥 Checkout Code
        uses: actions/checkout@v4

      - name: ⚡ Setup Node.js \${{ matrix.node-version }}
        uses: actions/setup-node@v4
        with:
          node-version: \${{ matrix.node-version }}
          cache: 'npm'

      - name: 📦 Install Dependencies
        run: npm ci

      - name: 🧪 Execute Test Suite
        run: npm test

      - name: 🏗️ Build Production Assets
        run: npm run build
`;

  const packageJson = `{\n  "name": "rocket-app",\n  "version": "1.0.0",\n  "scripts": {\n    "test": "vitest run",\n    "build": "vite build"\n  }\n}`;

  repo.commits[cInit] = {
    hash: cInit,
    shortHash: cInit,
    parents: [],
    tree: { '.github/workflows/ci.yml': 'blob_ci', 'package.json': 'blob_pkg' },
    files: {
      '.github/workflows/ci.yml': ciWorkflow,
      'package.json': packageJson,
      'src/math.ts': 'export const add = (a: number, b: number) => a + b;',
      'src/math.test.ts': 'import { add } from "./math"; test("adds", () => expect(add(1, 2)).toBe(3));',
    },
    author: 'Automation Bot <actions@github.com>',
    email: 'actions@github.com',
    date: hoursAgo(50),
    timestamp: timestampHoursAgo(50),
    message: 'ci: add GitHub Actions continuous integration workflow',
  };

  repo.branches['main'] = { name: 'main', targetCommitHash: cInit };
  repo.head = { type: 'branch', ref: 'main' };
  repo.index = { ...repo.commits[cInit].files };
  repo.workingDirectory = { ...repo.commits[cInit].files };

  return repo;
};

// ============================================================================
// 12. CHAPTER 12: GITHUB ECOSYSTEM SEED REPO
// Codespaces devcontainer, Dependabot config, GH CLI scripts, and release metadata
// ============================================================================
export const seedEcosystemRepo = (): GitRepo => {
  const repo = createBaseRepo();
  const cInit = 'eco0011a';

  const devcontainer = `{\n  "name": "Node.js & TypeScript Cloud Dev",\n  "image": "mcr.microsoft.com/devcontainers/typescript-node:1-20-bookworm",\n  "customizations": {\n    "vscode": {\n      "extensions": ["dbaeumer.vscode-eslint", "esbenp.prettier-vscode"]\n    }\n  }\n}`;

  const dependabot = `version: 2\nupdates:\n  - package-ecosystem: "npm"\n    directory: "/"\n    schedule:\n      interval: "weekly"\n    open-pull-requests-limit: 10`;

  repo.commits[cInit] = {
    hash: cInit,
    shortHash: cInit,
    parents: [],
    tree: {
      '.devcontainer/devcontainer.json': 'blob_devc',
      '.github/dependabot.yml': 'blob_dep',
      'README.md': 'blob_eco_rm',
    },
    files: {
      '.devcontainer/devcontainer.json': devcontainer,
      '.github/dependabot.yml': dependabot,
      'README.md': '# 🌐 Modern Cloud Ecosystem Project\nPowered by GitHub Codespaces, Dependabot security, and GH CLI.',
    },
    author: 'Ecosystem Architect <eco@github.com>',
    email: 'eco@github.com',
    date: hoursAgo(30),
    timestamp: timestampHoursAgo(30),
    message: 'chore: configure Codespaces devcontainer and Dependabot security updates',
  };

  repo.branches['main'] = { name: 'main', targetCommitHash: cInit };
  repo.head = { type: 'branch', ref: 'main' };
  repo.index = { ...repo.commits[cInit].files };
  repo.workingDirectory = { ...repo.commits[cInit].files };

  return repo;
};

// ============================================================================
// CHAPTER SEEDER REGISTRY
// Maps any Bento Category ID to its authentic tailored seed repository
// ============================================================================
export const CHAPTER_SEEDERS: Record<string, () => GitRepo> = {
  'cat-foundations': seedFoundationsRepo,
  'cat-inspect-save': seedInspectSaveRepo,
  'cat-undo-recover': seedUndoRecoverRepo,
  'cat-branching': seedBranchingRepo,
  'cat-merging': seedMergingRepo,
  'cat-remote-git': seedRemoteRepo,
  'cat-github': seedGitHubRepo,
  'cat-collaboration': seedCollaborationRepo,
  'cat-advanced-git': seedAdvancedRepo,
  'cat-git-engineering': seedEngineeringRepo,
  'cat-github-automation': seedGitHubActionsRepo,
  'cat-github-engineering': seedEcosystemRepo,
};

export const getSeedRepoForCategory = (categoryId: string): (() => GitRepo) => {
  return CHAPTER_SEEDERS[categoryId] || seedFoundationsRepo;
};
