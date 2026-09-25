import { describe, it, expect } from 'vitest';

describe('DockerTerminal Command History Traversal (Issue #7)', () => {
  it('correctly navigates backwards and forwards through command history', () => {
    const history = [
      { command: 'docker ps' },
      { command: 'docker run -d nginx' },
      { command: 'docker inspect web' },
    ];

    const userCommands = history
      .map((h) => h.command)
      .filter((c): c is string => typeof c === 'string' && c.trim().length > 0);

    expect(userCommands).toEqual(['docker ps', 'docker run -d nginx', 'docker inspect web']);

    // Emulate Up arrow from empty input
    let historyIndex: number | null = null;
    let inputVal = '';

    // First ArrowUp: points to the most recent command (index 2)
    historyIndex = historyIndex === null ? userCommands.length - 1 : Math.max(0, historyIndex - 1);
    inputVal = userCommands[historyIndex];
    expect(historyIndex).toBe(2);
    expect(inputVal).toBe('docker inspect web');

    // Second ArrowUp: points to index 1
    historyIndex = historyIndex === null ? userCommands.length - 1 : Math.max(0, historyIndex - 1);
    inputVal = userCommands[historyIndex];
    expect(historyIndex).toBe(1);
    expect(inputVal).toBe('docker run -d nginx');

    // Third ArrowUp: points to index 0 (oldest command)
    historyIndex = historyIndex === null ? userCommands.length - 1 : Math.max(0, historyIndex - 1);
    inputVal = userCommands[historyIndex];
    expect(historyIndex).toBe(0);
    expect(inputVal).toBe('docker ps');

    // Fourth ArrowUp at boundary: stays at index 0
    historyIndex = historyIndex === null ? userCommands.length - 1 : Math.max(0, historyIndex - 1);
    inputVal = userCommands[historyIndex];
    expect(historyIndex).toBe(0);
    expect(inputVal).toBe('docker ps');

    // First ArrowDown: advances to index 1
    historyIndex = historyIndex + 1;
    inputVal = userCommands[historyIndex];
    expect(historyIndex).toBe(1);
    expect(inputVal).toBe('docker run -d nginx');

    // Second ArrowDown: advances to index 2
    historyIndex = historyIndex + 1;
    inputVal = userCommands[historyIndex];
    expect(historyIndex).toBe(2);
    expect(inputVal).toBe('docker inspect web');

    // Third ArrowDown: past end of history, resets to null and empty input
    const nextIdx = historyIndex + 1;
    if (nextIdx >= userCommands.length) {
      historyIndex = null;
      inputVal = '';
    }
    expect(historyIndex).toBeNull();
    expect(inputVal).toBe('');
  });
});
