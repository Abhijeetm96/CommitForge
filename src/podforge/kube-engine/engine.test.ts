import { describe, it, expect, beforeEach } from 'vitest';
import { KubeEngine } from './engine';

describe('KubeEngine - Virtual Kubernetes Control Plane', () => {
  let engine: KubeEngine;

  beforeEach(() => {
    engine = new KubeEngine();
  });

  describe('Cluster Initialization', () => {
    it('initializes with default nodes and pods', () => {
      const state = engine.getState();
      const nodes = Object.values(state.nodes);
      const pods = Object.values(state.pods);
      const deployments = Object.values(state.deployments);
      const services = Object.values(state.services);

      expect(nodes.length).toBeGreaterThanOrEqual(3);
      expect(pods.length).toBeGreaterThanOrEqual(2);
      expect(deployments.length).toBeGreaterThanOrEqual(1);
      expect(services.length).toBeGreaterThanOrEqual(1);
    });

    it('has a control-plane node and ready worker nodes', () => {
      const state = engine.getState();
      const controlPlane = state.nodes['control-plane-1'];
      expect(controlPlane).toBeDefined();
      expect(controlPlane?.status.ready).toBe(true);
      expect(controlPlane?.status.role).toBe('control-plane');

      const worker1 = state.nodes['worker-node-1'];
      const worker2 = state.nodes['worker-node-2'];
      expect(worker1).toBeDefined();
      expect(worker1?.status.ready).toBe(true);
      expect(worker2).toBeDefined();
      expect(worker2?.status.ready).toBe(true);
    });
  });

  describe('kubectl get', () => {
    it('executes "kubectl get pods"', () => {
      const res = engine.execute('kubectl get pods');
      expect(res.exitCode).toBe(0);
      expect(res.stdout[0]).toContain('NAME');
      expect(res.stdout[0]).toContain('READY');
      expect(res.stdout[0]).toContain('STATUS');
      expect(res.stdout.length).toBeGreaterThan(1);
    });

    it('executes "kubectl get nodes"', () => {
      const res = engine.execute('kubectl get nodes');
      expect(res.exitCode).toBe(0);
      expect(res.stdout[0]).toContain('NAME');
      expect(res.stdout[0]).toContain('STATUS');
      expect(res.stdout[0]).toContain('ROLES');
      expect(res.stdout.some((l) => l.includes('control-plane'))).toBe(true);
    });

    it('executes "kubectl get deployments"', () => {
      const res = engine.execute('kubectl get deployments');
      expect(res.exitCode).toBe(0);
      expect(res.stdout[0]).toContain('READY');
      expect(res.stdout[0]).toContain('UP-TO-DATE');
      expect(res.stdout.some((l) => l.includes('frontend-web'))).toBe(true);
    });

    it('executes "kubectl get services"', () => {
      const res = engine.execute('kubectl get svc');
      expect(res.exitCode).toBe(0);
      expect(res.stdout[0]).toContain('TYPE');
      expect(res.stdout[0]).toContain('CLUSTER-IP');
      expect(res.stdout.some((l) => l.includes('frontend-svc'))).toBe(true);
    });
  });

  describe('kubectl describe', () => {
    it('describes an existing pod', () => {
      const pods = Object.values(engine.getState().pods);
      const targetPod = pods[0].metadata.name;

      const res = engine.execute(`kubectl describe pod ${targetPod}`);
      expect(res.exitCode).toBe(0);
      expect(res.stdout.some((l) => l.includes(`Name:         ${targetPod}`))).toBe(true);
      expect(res.stdout.some((l) => l.includes('Containers:'))).toBe(true);
      expect(res.stdout.some((l) => l.includes('Events:'))).toBe(true);
    });

    it('returns error when describing non-existent resource', () => {
      const res = engine.execute('kubectl describe pod phantom-pod-999');
      expect(res.exitCode).toBe(1);
      expect(res.stderr.length).toBeGreaterThan(0);
    });
  });

  describe('kubectl logs', () => {
    it('retrieves container logs for a pod', () => {
      const pods = Object.values(engine.getState().pods);
      const targetPod = pods[0].metadata.name;

      const res = engine.execute(`kubectl logs ${targetPod}`);
      expect(res.exitCode).toBe(0);
      expect(res.stdout.length).toBeGreaterThan(0);
    });
  });

  describe('kubectl scale', () => {
    it('scales a deployment up and creates new pods', () => {
      const res = engine.execute('kubectl scale deployment frontend-web --replicas=4');
      expect(res.exitCode).toBe(0);

      const updatedDeployment = engine.getState().deployments['frontend-web'];
      expect(updatedDeployment?.spec.replicas).toBe(4);

      const currentPods = Object.values(engine.getState().pods).filter((p) => p.metadata.labels?.app === 'frontend-web');
      expect(currentPods.length).toBe(4);
    });

    it('scales a deployment down and terminates pods', () => {
      engine.execute('kubectl scale deployment frontend-web --replicas=1');
      const updatedDeployment = engine.getState().deployments['frontend-web'];
      expect(updatedDeployment?.spec.replicas).toBe(1);

      const currentPods = Object.values(engine.getState().pods).filter((p) => p.metadata.labels?.app === 'frontend-web');
      expect(currentPods.length).toBe(1);
    });
  });

  describe('Self-Healing Deployment Controller', () => {
    it('automatically respawns a replacement pod when a deployment-managed pod is deleted', () => {
      const initialPods = Object.values(engine.getState().pods).filter((p) => p.metadata.labels?.app === 'frontend-web');
      const podToDelete = initialPods[0].metadata.name;

      const res = engine.execute(`kubectl delete pod ${podToDelete}`);
      expect(res.exitCode).toBe(0);

      const remainingPods = Object.values(engine.getState().pods).filter((p) => p.metadata.labels?.app === 'frontend-web');
      const deployment = engine.getState().deployments['frontend-web'];
      expect(remainingPods.length).toBe(deployment?.spec.replicas);
      expect(remainingPods.some((p) => p.metadata.name === podToDelete)).toBe(false);
    });
  });

  describe('Node Operations: cordon & drain', () => {
    it('cordons a node to disable new scheduling', () => {
      const res = engine.execute('kubectl cordon worker-2');
      expect(res.exitCode).toBe(0);

      const node = engine.getState().nodes['worker-node-2'];
      expect(node?.spec.unschedulable).toBe(true);
    });

    it('uncordons a cordoned node', () => {
      engine.execute('kubectl cordon worker-node-2');
      const res = engine.execute('kubectl uncordon worker-node-2');
      expect(res.exitCode).toBe(0);

      const node = engine.getState().nodes['worker-node-2'];
      expect(node?.spec.unschedulable).toBe(false);
    });

    it('drains a node by cordoning and evicting pods to healthy nodes', () => {
      const res = engine.execute('kubectl drain worker-node-1');
      expect(res.exitCode).toBe(0);

      const node = engine.getState().nodes['worker-node-1'];
      expect(node?.spec.unschedulable).toBe(true);

      const podsOnWorker1 = Object.values(engine.getState().pods).filter((p) => p.spec.nodeName === 'worker-node-1');
      expect(podsOnWorker1.length).toBe(0);
    });
  });

  describe('Disaster Injections for SRE / DevOps Labs', () => {
    it('injects CrashLoopBackOff state onto a pod', () => {
      engine.injectDisaster('crashloop');
      const pods = Object.values(engine.getState().pods);
      const crashed = pods.find((p) => p.status.phase === 'CrashLoopBackOff');
      expect(crashed).toBeDefined();
      expect(crashed?.status.containerStatuses[0].restartCount).toBeGreaterThan(0);
    });

    it('injects OOMKilled state onto a pod', () => {
      engine.injectDisaster('oom');
      const pods = Object.values(engine.getState().pods);
      const oom = pods.find((p) => p.status.phase === 'OOMKilled');
      expect(oom).toBeDefined();
    });

    it('resets cluster cleanly back to pristine defaults', () => {
      engine.injectDisaster('crashloop');
      engine.execute('kubectl scale deployment frontend-web --replicas=5');
      engine.resetCluster();

      const state = engine.getState();
      const crashed = Object.values(state.pods).find((p) => p.status.phase === 'CrashLoopBackOff');
      expect(crashed).toBeUndefined();

      const gateway = state.deployments['frontend-web'];
      expect(gateway?.spec.replicas).toBe(2);
    });
  });
});
