export interface DiffLine {
  type: 'add' | 'del' | 'same' | 'header';
  text: string;
  oldLineNumber?: number;
  newLineNumber?: number;
}

export interface FileDiff {
  path: string;
  oldPath?: string;
  newPath?: string;
  isNew: boolean;
  isDeleted: boolean;
  lines: DiffLine[];
  addedCount: number;
  deletedCount: number;
}

export function computeLineDiff(oldContent: string | null, newContent: string | null, filePath: string): FileDiff {
  const isNew = oldContent === null;
  const isDeleted = newContent === null;
  
  if (isNew && isDeleted) {
    return { path: filePath, isNew: false, isDeleted: false, lines: [], addedCount: 0, deletedCount: 0 };
  }

  const oldLines = oldContent !== null ? oldContent.split('\n') : [];
  const newLines = newContent !== null ? newContent.split('\n') : [];

  const lines: DiffLine[] = [];
  let addedCount = 0;
  let deletedCount = 0;

  if (isNew) {
    newLines.forEach((line, idx) => {
      lines.push({ type: 'add', text: `+${line}`, newLineNumber: idx + 1 });
      addedCount++;
    });
    return { path: filePath, isNew: true, isDeleted: false, lines, addedCount, deletedCount };
  }

  if (isDeleted) {
    oldLines.forEach((line, idx) => {
      lines.push({ type: 'del', text: `-${line}`, oldLineNumber: idx + 1 });
      deletedCount++;
    });
    return { path: filePath, isNew: false, isDeleted: true, lines, addedCount, deletedCount };
  }

  // Simple LCS-based or line comparison for clean unified diffs
  let i = 0;
  let j = 0;
  let oldLineNum = 1;
  let newLineNum = 1;

  // Simple dynamic programming or Myers-like line matcher for educational clarity
  while (i < oldLines.length || j < newLines.length) {
    if (i < oldLines.length && j < newLines.length && oldLines[i] === newLines[j]) {
      lines.push({ type: 'same', text: ` ${oldLines[i]}`, oldLineNumber: oldLineNum++, newLineNumber: newLineNum++ });
      i++;
      j++;
    } else {
      // Lookahead to check if lines were added or removed
      let foundInNew = -1;
      let foundInOld = -1;

      for (let look = 1; look <= 5; look++) {
        if (foundInNew === -1 && j + look < newLines.length && i < oldLines.length && oldLines[i] === newLines[j + look]) {
          foundInNew = look;
        }
        if (foundInOld === -1 && i + look < oldLines.length && j < newLines.length && oldLines[i + look] === newLines[j]) {
          foundInOld = look;
        }
      }

      if (foundInNew !== -1 && (foundInOld === -1 || foundInNew <= foundInOld)) {
        // Lines were added in new
        for (let k = 0; k < foundInNew; k++) {
          lines.push({ type: 'add', text: `+${newLines[j]}`, newLineNumber: newLineNum++ });
          addedCount++;
          j++;
        }
      } else if (foundInOld !== -1) {
        // Lines were removed in old
        for (let k = 0; k < foundInOld; k++) {
          lines.push({ type: 'del', text: `-${oldLines[i]}`, oldLineNumber: oldLineNum++ });
          deletedCount++;
          i++;
        }
      } else {
        // Single line substitution
        if (i < oldLines.length) {
          lines.push({ type: 'del', text: `-${oldLines[i]}`, oldLineNumber: oldLineNum++ });
          deletedCount++;
          i++;
        }
        if (j < newLines.length) {
          lines.push({ type: 'add', text: `+${newLines[j]}`, newLineNumber: newLineNum++ });
          addedCount++;
          j++;
        }
      }
    }
  }

  return {
    path: filePath,
    isNew: false,
    isDeleted: false,
    lines,
    addedCount,
    deletedCount,
  };
}

export function formatGitDiffOutput(fileDiff: FileDiff): string[] {
  if (fileDiff.addedCount === 0 && fileDiff.deletedCount === 0 && !fileDiff.isNew && !fileDiff.isDeleted) {
    return [];
  }

  const out: string[] = [
    `diff --git a/${fileDiff.path} b/${fileDiff.path}`,
    fileDiff.isNew ? `new file mode 100644` : fileDiff.isDeleted ? `deleted file mode 100644` : `index a1b2c3d..e5f6a7b 100644`,
    `--- ${fileDiff.isNew ? '/dev/null' : 'a/' + fileDiff.path}`,
    `+++ ${fileDiff.isDeleted ? '/dev/null' : 'b/' + fileDiff.path}`,
    `@@ -1,${fileDiff.lines.filter(l => l.type !== 'add').length} +1,${fileDiff.lines.filter(l => l.type !== 'del').length} @@`
  ];

  for (const line of fileDiff.lines) {
    out.push(line.text);
  }

  return out;
}
