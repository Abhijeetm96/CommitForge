import { describe, it, expect } from 'vitest';
import {
  ROADMAP_SECTIONS,
  getAllRoadmapItems,
  searchRoadmap,
} from '../data/roadmapGraphData';

describe('Git and GitHub Complete Roadmap Model', () => {
  it('loads all roadmap sections and contains no duplicate IDs', () => {
    const allItems = getAllRoadmapItems();
    expect(allItems.length).toBeGreaterThan(80);

    const ids = new Set<string>();
    for (const item of allItems) {
      expect(ids.has(item.id)).toBe(false);
      ids.add(item.id);
      expect(item.label).toBeTruthy();
      expect(item.description).toBeTruthy();
      expect(item.category).toBeTruthy();
    }
  });

  it('contains all canonical nodes from roadmap.sh diagram', () => {
    const allItems = getAllRoadmapItems();
    const idMap = new Map(allItems.map((item) => [item.id, item]));

    // 1. Basics & Repos
    expect(idMap.has('learn-the-basics')).toBe(true);
    expect(idMap.has('what-is-vcs')).toBe(true);
    expect(idMap.has('why-use-vcs')).toBe(true);
    expect(idMap.has('git-vs-other-vcs')).toBe(true);
    expect(idMap.has('installing-git-locally')).toBe(true);
    expect(idMap.has('what-is-a-repository')).toBe(true);
    expect(idMap.has('git-init')).toBe(true);
    expect(idMap.has('git-config')).toBe(true);
    expect(idMap.has('local-vs-global-config')).toBe(true);
    expect(idMap.has('working-directory')).toBe(true);
    expect(idMap.has('staging-area')).toBe(true);
    expect(idMap.has('committing-changes')).toBe(true);
    expect(idMap.has('gitignore')).toBe(true);
    expect(idMap.has('viewing-commit-history')).toBe(true);

    // 2. Remotes & Branching
    expect(idMap.has('git-remotes')).toBe(true);
    expect(idMap.has('cloning-repositories')).toBe(true);
    expect(idMap.has('managing-remotes')).toBe(true);
    expect(idMap.has('pushing-pulling-changes')).toBe(true);
    expect(idMap.has('fetch-without-merge')).toBe(true);
    expect(idMap.has('branching-basics')).toBe(true);
    expect(idMap.has('creating-branch')).toBe(true);
    expect(idMap.has('renaming-branch')).toBe(true);
    expect(idMap.has('deleting-branch')).toBe(true);
    expect(idMap.has('checkout-branch')).toBe(true);
    expect(idMap.has('merging-basics')).toBe(true);
    expect(idMap.has('github-essentials')).toBe(true);
    expect(idMap.has('profile-readme')).toBe(true);
    expect(idMap.has('private-vs-public')).toBe(true);

    // 3. Merging, Collaboration & Best Practices
    expect(idMap.has('merge-strategies')).toBe(true);
    expect(idMap.has('fast-forward-vs-non-ff')).toBe(true);
    expect(idMap.has('rebase')).toBe(true);
    expect(idMap.has('squash')).toBe(true);
    expect(idMap.has('handling-conflicts')).toBe(true);
    expect(idMap.has('cherry-picking-commits')).toBe(true);
    expect(idMap.has('collaboration-on-github')).toBe(true);
    expect(idMap.has('forking-vs-cloning')).toBe(true);
    expect(idMap.has('issues')).toBe(true);
    expect(idMap.has('pull-requests')).toBe(true);
    expect(idMap.has('pr-from-a-fork')).toBe(true);
    expect(idMap.has('best-practices')).toBe(true);
    expect(idMap.has('commit-messages')).toBe(true);
    expect(idMap.has('documentation')).toBe(true);
    expect(idMap.has('citation-files')).toBe(true);

    // 4. Stash & Intermediate
    expect(idMap.has('git-stash-basics')).toBe(true);
    expect(idMap.has('history')).toBe(true);
    expect(idMap.has('linear-vs-non-linear')).toBe(true);
    expect(idMap.has('head-pointer')).toBe(true);
    expect(idMap.has('detached-head')).toBe(true);
    expect(idMap.has('github-projects')).toBe(true);
    expect(idMap.has('kanban-boards')).toBe(true);
    expect(idMap.has('working-in-a-team')).toBe(true);
    expect(idMap.has('github-organizations')).toBe(true);

    // 5. Undoing, Diffs, Rewriting
    expect(idMap.has('undoing-changes')).toBe(true);
    expect(idMap.has('git-revert')).toBe(true);
    expect(idMap.has('git-reset')).toBe(true);
    expect(idMap.has('reset-soft')).toBe(true);
    expect(idMap.has('reset-hard')).toBe(true);
    expect(idMap.has('reset-mixed')).toBe(true);
    expect(idMap.has('viewing-diffs')).toBe(true);
    expect(idMap.has('rewriting-history')).toBe(true);
    expect(idMap.has('git-commit-amend')).toBe(true);
    expect(idMap.has('git-rebase-interactive')).toBe(true);
    expect(idMap.has('git-filter-branch')).toBe(true);
    expect(idMap.has('git-push-force')).toBe(true);

    // 6. Submodules, Hooks, Tags
    expect(idMap.has('submodules')).toBe(true);
    expect(idMap.has('git-hooks')).toBe(true);
    expect(idMap.has('hook-commit-msg')).toBe(true);
    expect(idMap.has('hook-pre-commit')).toBe(true);
    expect(idMap.has('hook-pre-push')).toBe(true);
    expect(idMap.has('tagging')).toBe(true);
    expect(idMap.has('github-releases')).toBe(true);

    // 7. CLI, Advanced Git, GitHub Actions
    expect(idMap.has('github-workflow-patch')).toBe(true);
    expect(idMap.has('github-cli')).toBe(true);
    expect(idMap.has('advanced-git-topics')).toBe(true);
    expect(idMap.has('git-reflog')).toBe(true);
    expect(idMap.has('git-bisect')).toBe(true);
    expect(idMap.has('git-worktree')).toBe(true);
    expect(idMap.has('git-lfs')).toBe(true);
    expect(idMap.has('github-actions')).toBe(true);
    expect(idMap.has('actions-yaml-syntax')).toBe(true);
    expect(idMap.has('actions-secrets-env-vars')).toBe(true);

    // 8. APIs, Apps, Features
    expect(idMap.has('creating-apps')).toBe(true);
    expect(idMap.has('github-apps')).toBe(true);
    expect(idMap.has('github-api')).toBe(true);
    expect(idMap.has('rest-api')).toBe(true);
    expect(idMap.has('graphql-api')).toBe(true);
    expect(idMap.has('webhooks')).toBe(true);
    expect(idMap.has('more-github-features')).toBe(true);
    expect(idMap.has('github-copilot')).toBe(true);
    expect(idMap.has('github-codespaces')).toBe(true);
    expect(idMap.has('student-developer-pack')).toBe(true);
    expect(idMap.has('deploying-static-websites')).toBe(true);
    expect(idMap.has('github-pages')).toBe(true);
    expect(idMap.has('custom-domains')).toBe(true);
  });

  it('provides effective search matching across labels, commands, and categories', () => {
    const bisectResults = searchRoadmap('bisect');
    expect(bisectResults.length).toBeGreaterThan(0);
    expect(bisectResults[0].id).toBe('git-bisect');

    const actionResults = searchRoadmap('yaml');
    expect(actionResults.some((r) => r.id === 'actions-yaml-syntax')).toBe(true);

    const lfsResults = searchRoadmap('large file');
    expect(lfsResults.some((r) => r.id === 'git-lfs')).toBe(true);
  });
});
