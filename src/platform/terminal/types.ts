// src/platform/terminal/types.ts
/**
 * Unified Terminal & Runtime Adapter Types
 * Provides a uniform CLI interface across GitEngine, DockerEngine, and KubeEngine.
 */

export interface TerminalOutputLine {
  id: string;
  type: 'input' | 'stdout' | 'stderr' | 'info' | 'success' | 'warning' | 'hint';
  text: string;
  timestamp: number;
}

export interface ExecutionResult {
  stdout: string;
  stderr?: string;
  exitCode: number;
  hint?: string;
  stateChanged?: boolean;
  affectedResources?: string[];
}

export interface RuntimeAdapter {
  technology: 'git' | 'docker' | 'kubernetes';
  promptPrefix: string; // e.g. "repo (main) $" or "docker-host $" or "k8s-cluster $"
  execute(command: string): Promise<ExecutionResult> | ExecutionResult;
  getCompletions?(prefix: string): string[];
  reset?(): void;
  getEnvironmentInfo?(): { [key: string]: string };
}

export interface TerminalTheme {
  background: string;
  foreground: string;
  promptColor: string;
  borderColor: string;
  fontFamily: string;
}
