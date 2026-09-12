import { GitRepo } from './types';
import { generateGitHash } from './hash';

export interface GitObject {
  id: string;
  type: 'blob' | 'tree' | 'commit' | 'tag';
  size: number;
  content: string;
  details: Record<string, any>;
}

export function extractObjectDatabase(repo: GitRepo): GitObject[] {
  const objects: GitObject[] = [];
  const seenIds = new Set<string>();

  // 1. Commits and their Trees and Blobs
  for (const commit of Object.values(repo.commits)) {
    // Commit Object
    if (!seenIds.has(commit.hash)) {
      seenIds.add(commit.hash);
      const commitRaw = [
        `tree ${commit.hash.slice(0, 10)}tree`,
        ...commit.parents.map(p => `parent ${p}`),
        `author ${commit.author} <${commit.email}> ${commit.timestamp}`,
        `committer ${commit.author} <${commit.email}> ${commit.timestamp}`,
        '',
        commit.message,
      ].join('\n');

      objects.push({
        id: commit.hash,
        type: 'commit',
        size: commitRaw.length,
        content: commitRaw,
        details: {
          shortHash: commit.shortHash,
          parents: commit.parents,
          message: commit.message,
          author: commit.author,
          date: commit.date,
          treeId: commit.hash.slice(0, 10) + 'tree',
        },
      });
    }

    // Tree Object for this commit
    const treeId = commit.hash.slice(0, 10) + 'tree';
    if (!seenIds.has(treeId)) {
      seenIds.add(treeId);
      const treeEntries = Object.entries(commit.files).map(([path, content]) => {
        const { hash: blobHash } = generateGitHash('blob ' + content.length + '\0' + content);
        return {
          mode: '100644',
          type: 'blob',
          id: blobHash,
          path,
        };
      });

      const treeRaw = treeEntries.map(e => `${e.mode} ${e.type} ${e.id.slice(0, 7)}\t${e.path}`).join('\n');
      objects.push({
        id: treeId,
        type: 'tree',
        size: treeRaw.length,
        content: treeRaw,
        details: {
          entries: treeEntries,
        },
      });

      // Blob Objects for each file
      for (const [path, content] of Object.entries(commit.files)) {
        const { hash: blobHash } = generateGitHash('blob ' + content.length + '\0' + content);
        if (!seenIds.has(blobHash)) {
          seenIds.add(blobHash);
          objects.push({
            id: blobHash,
            type: 'blob',
            size: content.length,
            content,
            details: {
              path,
              lineCount: content.split('\n').length,
            },
          });
        }
      }
    }
  }

  return objects;
}
