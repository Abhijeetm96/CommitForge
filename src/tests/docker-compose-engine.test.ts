import { describe, it, expect } from 'vitest';
import { DockerEngine } from '../dockforge/docker-engine/engine';

describe('DockerEngine Compose Stack Simulation (Issue #4)', () => {
  it('adds both app-web-1 and app-db-1 containers to state on docker compose up', () => {
    const engine = new DockerEngine();
    const result = engine.executeCommand('docker compose up -d');

    expect(result.exitCode).toBe(0);
    const containers = engine.getContainers();

    const dbContainer = containers.find((c) => c.name === 'app-db-1');
    const webContainer = containers.find((c) => c.name === 'app-web-1');

    expect(dbContainer).toBeDefined();
    expect(dbContainer?.status).toBe('running');
    expect(dbContainer?.ports[0].containerPort).toBe(5432);

    expect(webContainer).toBeDefined();
    expect(webContainer?.status).toBe('running');
    expect(webContainer?.ports[0].containerPort).toBe(3000);

    const networks = engine.getNetworks();
    const composeNetwork = networks.find((n) => n.name === 'app_default');
    expect(composeNetwork).toBeDefined();
    expect(composeNetwork?.containers).toContain('app-db-1');
    expect(composeNetwork?.containers).toContain('app-web-1');
  });

  it('removes compose containers and networks on docker compose down', () => {
    const engine = new DockerEngine();
    engine.executeCommand('docker compose up -d');
    expect(engine.getContainers().some((c) => c.name === 'app-db-1')).toBe(true);

    const downResult = engine.executeCommand('docker compose down');
    expect(downResult.exitCode).toBe(0);

    expect(engine.getContainers().some((c) => c.name === 'app-db-1')).toBe(false);
    expect(engine.getContainers().some((c) => c.name === 'app-web-1')).toBe(false);
    expect(engine.getNetworks().some((n) => n.name === 'app_default')).toBe(false);
  });
});
