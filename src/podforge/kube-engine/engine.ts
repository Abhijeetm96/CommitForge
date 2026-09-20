import type {
  ClusterState,
  CommandResult,
} from './types';

export class KubeEngine {
  private state: ClusterState;
  private listeners: ((state: ClusterState) => void)[] = [];

  constructor(initialState?: Partial<ClusterState>) {
    this.state = {
      nodes: {
        'control-plane-1': {
          metadata: { name: 'control-plane-1', labels: { 'node-role.kubernetes.io/control-plane': '' } },
          spec: { taints: [{ key: 'node-role.kubernetes.io/control-plane', value: '', effect: 'NoSchedule' }] },
          status: {
            ready: true,
            role: 'control-plane',
            capacity: { cpu: '4', memory: '16Gi', pods: 110 },
            usage: { cpuPercent: 18, memoryPercent: 24 },
            nodeIP: '192.168.1.10',
            osImage: 'Ubuntu 22.04 LTS',
            kubeletVersion: 'v1.31.0',
          },
        },
        'worker-node-1': {
          metadata: { name: 'worker-node-1', labels: { 'node-role.kubernetes.io/worker': '', zone: 'us-east-1a' } },
          spec: {},
          status: {
            ready: true,
            role: 'worker',
            capacity: { cpu: '8', memory: '32Gi', pods: 110 },
            usage: { cpuPercent: 35, memoryPercent: 42 },
            nodeIP: '192.168.1.11',
            osImage: 'Ubuntu 22.04 LTS',
            kubeletVersion: 'v1.31.0',
          },
        },
        'worker-node-2': {
          metadata: { name: 'worker-node-2', labels: { 'node-role.kubernetes.io/worker': '', zone: 'us-east-1b' } },
          spec: {},
          status: {
            ready: true,
            role: 'worker',
            capacity: { cpu: '8', memory: '32Gi', pods: 110 },
            usage: { cpuPercent: 28, memoryPercent: 36 },
            nodeIP: '192.168.1.12',
            osImage: 'Ubuntu 22.04 LTS',
            kubeletVersion: 'v1.31.0',
          },
        },
      },
      pods: {
        'frontend-web-7bc9f-1': {
          apiVersion: 'v1',
          kind: 'Pod',
          metadata: {
            name: 'frontend-web-7bc9f-1',
            namespace: 'default',
            labels: { app: 'frontend-web', tier: 'presentation' },
            creationTimestamp: Date.now() - 3600000 * 2,
          },
          spec: {
            nodeName: 'worker-node-1',
            containers: [
              {
                name: 'nginx',
                image: 'nginx:1.25-alpine',
                ports: [{ containerPort: 80, name: 'http' }],
                resources: { requests: { cpu: '100m', memory: '128Mi' }, limits: { cpu: '250m', memory: '256Mi' } },
              },
            ],
          },
          status: {
            phase: 'Running',
            podIP: '10.244.1.14',
            hostIP: '192.168.1.11',
            containerStatuses: [
              {
                name: 'nginx',
                ready: true,
                restartCount: 0,
                image: 'nginx:1.25-alpine',
                state: { running: { startedAt: Date.now() - 3600000 * 2 } },
              },
            ],
          },
        },
        'frontend-web-7bc9f-2': {
          apiVersion: 'v1',
          kind: 'Pod',
          metadata: {
            name: 'frontend-web-7bc9f-2',
            namespace: 'default',
            labels: { app: 'frontend-web', tier: 'presentation' },
            creationTimestamp: Date.now() - 3600000 * 2,
          },
          spec: {
            nodeName: 'worker-node-2',
            containers: [
              {
                name: 'nginx',
                image: 'nginx:1.25-alpine',
                ports: [{ containerPort: 80, name: 'http' }],
                resources: { requests: { cpu: '100m', memory: '128Mi' }, limits: { cpu: '250m', memory: '256Mi' } },
              },
            ],
          },
          status: {
            phase: 'Running',
            podIP: '10.244.2.18',
            hostIP: '192.168.1.12',
            containerStatuses: [
              {
                name: 'nginx',
                ready: true,
                restartCount: 0,
                image: 'nginx:1.25-alpine',
                state: { running: { startedAt: Date.now() - 3600000 * 2 } },
              },
            ],
          },
        },
      },
      deployments: {
        'frontend-web': {
          apiVersion: 'apps/v1',
          kind: 'Deployment',
          metadata: { name: 'frontend-web', namespace: 'default', labels: { app: 'frontend-web' } },
          spec: {
            replicas: 2,
            selector: { matchLabels: { app: 'frontend-web' } },
            template: {
              metadata: { labels: { app: 'frontend-web' } },
              spec: {
                containers: [{ name: 'nginx', image: 'nginx:1.25-alpine', ports: [{ containerPort: 80 }] }],
              },
            },
          },
          status: { replicas: 2, readyReplicas: 2, updatedReplicas: 2, availableReplicas: 2 },
        },
      },
      services: {
        'frontend-svc': {
          apiVersion: 'v1',
          kind: 'Service',
          metadata: { name: 'frontend-svc', namespace: 'default' },
          spec: {
            type: 'ClusterIP',
            selector: { app: 'frontend-web' },
            ports: [{ port: 80, targetPort: 80, protocol: 'TCP' }],
            clusterIP: '10.96.14.220',
          },
          status: {},
        },
      },
      configMaps: {
        'app-config': {
          apiVersion: 'v1',
          kind: 'ConfigMap',
          metadata: { name: 'app-config', namespace: 'default' },
          data: { 'APP_ENV': 'production', 'LOG_LEVEL': 'info' },
        },
      },
      secrets: {
        'db-credentials': {
          apiVersion: 'v1',
          kind: 'Secret',
          metadata: { name: 'db-credentials', namespace: 'default' },
          data: { 'username': 'cG9kZm9yZ2U=', 'password': 'c3VwZXJzZWNyZXQ=' },
        },
      },
      namespaces: ['default', 'kube-system', 'production', 'monitoring'],
      events: [
        {
          id: 'ev-1',
          timestamp: Date.now() - 3600000 * 2,
          type: 'Normal',
          reason: 'Scheduled',
          objectKind: 'Pod',
          objectName: 'frontend-web-7bc9f-1',
          message: 'Successfully assigned default/frontend-web-7bc9f-1 to worker-node-1',
        },
        {
          id: 'ev-2',
          timestamp: Date.now() - 3600000 * 2,
          type: 'Normal',
          reason: 'Pulled',
          objectKind: 'Pod',
          objectName: 'frontend-web-7bc9f-1',
          message: 'Container image "nginx:1.25-alpine" already present on machine',
        },
      ],
      ...initialState,
    };
  }

  public getState(): ClusterState {
    return this.state;
  }

  public subscribe(cb: (state: ClusterState) => void): () => void {
    this.listeners.push(cb);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== cb);
    };
  }

  private notify() {
    this.listeners.forEach((cb) => cb(this.state));
  }

  public execute(cmdStr: string): CommandResult {
    const raw = cmdStr.trim();
    if (!raw) return { exitCode: 0, stdout: [], stderr: [] };

    const tokens = raw.split(/\s+/);
    if (tokens[0] !== 'kubectl') {
      if (raw === 'clear') return { exitCode: 0, stdout: ['__CLEAR__'], stderr: [] };
      return {
        exitCode: 127,
        stdout: [],
        stderr: [`command not found: ${tokens[0]}. Did you mean 'kubectl'?`],
      };
    }

    const action = tokens[1];
    const resource = tokens[2];
    const name = tokens[3];

    switch (action) {
      case 'get':
        return this.handleGet(tokens.slice(2));
      case 'describe':
        return this.handleDescribe(resource, name);
      case 'logs':
        return this.handleLogs(tokens.slice(2));
      case 'scale':
        return this.handleScale(tokens.slice(2));
      case 'apply':
        return this.handleApply();
      case 'delete':
        return this.handleDelete(resource, name);
      case 'rollout':
        return this.handleRollout(tokens.slice(2));
      case 'cordon':
        return this.handleCordon(resource, true);
      case 'uncordon':
        return this.handleCordon(resource, false);
      case 'drain':
        return this.handleDrain(resource);
      default:
        return {
          exitCode: 1,
          stdout: [],
          stderr: [`unknown command "${action}" for "kubectl"`],
        };
    }
  }

  private handleGet(args: string[]): CommandResult {
    const target = args[0] || '';
    const wide = args.includes('-o') && args.includes('wide');

    if (target === 'pods' || target === 'pod' || target === 'po') {
      const pods = Object.values(this.state.pods);
      if (pods.length === 0) {
        return { exitCode: 0, stdout: ['No resources found in default namespace.'], stderr: [] };
      }
      const header = wide
        ? 'NAME                             READY   STATUS             RESTARTS   AGE    IP            NODE'
        : 'NAME                             READY   STATUS             RESTARTS   AGE';

      const lines = pods.map((p) => {
        const readyCount = p.status.containerStatuses.filter((c) => c.ready).length;
        const totalCount = p.status.containerStatuses.length || 1;
        const readyStr = `${readyCount}/${totalCount}`;
        const restarts = p.status.containerStatuses.reduce((acc, c) => acc + c.restartCount, 0);
        const nameCol = p.metadata.name.padEnd(32, ' ');
        const readyCol = readyStr.padEnd(7, ' ');
        const statusCol = p.status.phase.padEnd(18, ' ');
        const restartCol = String(restarts).padEnd(10, ' ');
        const ageCol = '2h';

        if (wide) {
          const ipCol = (p.status.podIP || '<none>').padEnd(13, ' ');
          const nodeCol = p.spec.nodeName || '<none>';
          return `${nameCol} ${readyCol} ${statusCol} ${restartCol} ${ageCol}   ${ipCol} ${nodeCol}`;
        }
        return `${nameCol} ${readyCol} ${statusCol} ${restartCol} ${ageCol}`;
      });

      return { exitCode: 0, stdout: [header, ...lines], stderr: [] };
    }

    if (target === 'nodes' || target === 'node' || target === 'no') {
      const nodes = Object.values(this.state.nodes);
      const header = 'NAME              STATUS   ROLES           AGE   VERSION';
      const lines = nodes.map((n) => {
        const nameCol = n.metadata.name.padEnd(17, ' ');
        const statusCol = (n.status.ready ? 'Ready' : 'NotReady').padEnd(8, ' ');
        const roleCol = n.status.role.padEnd(15, ' ');
        return `${nameCol} ${statusCol} ${roleCol} 5d    ${n.status.kubeletVersion}`;
      });
      return { exitCode: 0, stdout: [header, ...lines], stderr: [] };
    }

    if (target === 'deployments' || target === 'deployment' || target === 'deploy') {
      const deps = Object.values(this.state.deployments);
      const header = 'NAME           READY   UP-TO-DATE   AVAILABLE   AGE';
      const lines = deps.map((d) => {
        const nameCol = d.metadata.name.padEnd(14, ' ');
        const readyCol = `${d.status.readyReplicas}/${d.spec.replicas}`.padEnd(7, ' ');
        const upToDate = String(d.status.updatedReplicas).padEnd(12, ' ');
        const available = String(d.status.availableReplicas).padEnd(11, ' ');
        return `${nameCol} ${readyCol} ${upToDate} ${available} 2h`;
      });
      return { exitCode: 0, stdout: [header, ...lines], stderr: [] };
    }

    if (target === 'services' || target === 'service' || target === 'svc') {
      const svcs = Object.values(this.state.services);
      const header = 'NAME           TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)        AGE';
      const lines = svcs.map((s) => {
        const nameCol = s.metadata.name.padEnd(14, ' ');
        const typeCol = s.spec.type.padEnd(11, ' ');
        const ipCol = (s.spec.clusterIP || '10.96.0.1').padEnd(15, ' ');
        const portCol = s.spec.ports.map((p) => `${p.port}/${p.protocol || 'TCP'}`).join(',');
        return `${nameCol} ${typeCol} ${ipCol} <none>        ${portCol.padEnd(14, ' ')} 2h`;
      });
      return { exitCode: 0, stdout: [header, ...lines], stderr: [] };
    }

    return {
      exitCode: 1,
      stdout: [],
      stderr: [`error: the server doesn't have a resource type "${target}"`],
    };
  }

  private handleDescribe(resource?: string, name?: string): CommandResult {
    if (!resource || !name) {
      return { exitCode: 1, stdout: [], stderr: ['error: you must specify the type and name of the resource'] };
    }

    if (resource === 'pod' || resource === 'pods') {
      const pod = this.state.pods[name];
      if (!pod) return { exitCode: 1, stdout: [], stderr: [`Error from server (NotFound): pods "${name}" not found`] };

      const c = pod.spec.containers[0];
      const status = pod.status.containerStatuses[0];
      const lines = [
        `Name:         ${pod.metadata.name}`,
        `Namespace:    ${pod.metadata.namespace || 'default'}`,
        `Node:         ${pod.spec.nodeName}/192.168.1.11`,
        `Status:       ${pod.status.phase}`,
        `IP:           ${pod.status.podIP || '<none>'}`,
        `Containers:`,
        `  ${c?.name || 'app'}:`,
        `    Image:          ${c?.image || 'unknown'}`,
        `    Port:           ${c?.ports?.[0]?.containerPort || 80}/TCP`,
        `    State:          ${pod.status.phase === 'Running' ? 'Running' : 'Waiting'}`,
        `    Restart Count:  ${status?.restartCount || 0}`,
        `Events:`,
        `  Type    Reason     Age   From               Message`,
        `  ----    ------     ----  ----               -------`,
        `  Normal  Scheduled  2m    default-scheduler  Successfully assigned default/${pod.metadata.name}`,
        `  Normal  Pulled     1m    kubelet            Container image pulled successfully`,
      ];
      return { exitCode: 0, stdout: lines, stderr: [] };
    }

    return { exitCode: 0, stdout: [`Described ${resource}/${name}`], stderr: [] };
  }

  private handleLogs(args: string[]): CommandResult {
    const podName = args[0];
    if (!podName) return { exitCode: 1, stdout: [], stderr: ['error: Pod name is required'] };

    const pod = this.state.pods[podName];
    if (!pod) return { exitCode: 1, stdout: [], stderr: [`Error: pod "${podName}" not found`] };

    if (pod.status.phase === 'CrashLoopBackOff') {
      return {
        exitCode: 1,
        stdout: [
          `[error] 2026/09/20 03:40:12 Fatal runtime error: failed to parse DATABASE_URL environment variable`,
          `[error] 2026/09/20 03:40:12 Process exited with code 1 (CrashLoopBackOff)`,
        ],
        stderr: [],
      };
    }

    return {
      exitCode: 0,
      stdout: [
        `[info] 2026/09/20 03:30:00 Starting PodForge production container runtime...`,
        `[info] 2026/09/20 03:30:01 Listening for incoming HTTP traffic on port 80...`,
        `[info] 2026/09/20 03:30:05 Health check probe GET /healthz 200 OK (1.2ms)`,
      ],
      stderr: [],
    };
  }

  private handleScale(args: string[]): CommandResult {
    const name = args[1];
    const repArg = args.find((a) => a.startsWith('--replicas='));
    if (!repArg || !name) {
      return { exitCode: 1, stdout: [], stderr: ['usage: kubectl scale deployment <name> --replicas=<count>'] };
    }

    const count = parseInt(repArg.split('=')[1], 10);
    const dep = this.state.deployments[name];
    if (!dep) return { exitCode: 1, stdout: [], stderr: [`deployments.apps "${name}" not found`] };

    dep.spec.replicas = count;
    dep.status.replicas = count;
    dep.status.readyReplicas = count;
    dep.status.updatedReplicas = count;
    dep.status.availableReplicas = count;

    // Adjust pods
    const existingPods = Object.keys(this.state.pods).filter((p) => p.startsWith(name));
    if (existingPods.length < count) {
      for (let i = existingPods.length + 1; i <= count; i++) {
        const podId = `${name}-7bc9f-${i}`;
        this.state.pods[podId] = {
          apiVersion: 'v1',
          kind: 'Pod',
          metadata: { name: podId, namespace: 'default', labels: { app: name } },
          spec: { nodeName: i % 2 === 0 ? 'worker-node-2' : 'worker-node-1', containers: [{ name: 'app', image: 'nginx:1.25' }] },
          status: {
            phase: 'Running',
            podIP: `10.244.${(i % 2) + 1}.${20 + i}`,
            containerStatuses: [{ name: 'app', ready: true, restartCount: 0, image: 'nginx:1.25', state: { running: { startedAt: Date.now() } } }],
          },
        };
      }
    } else if (existingPods.length > count) {
      for (let i = count; i < existingPods.length; i++) {
        delete this.state.pods[existingPods[i]];
      }
    }

    this.notify();
    return { exitCode: 0, stdout: [`deployment.apps/${name} scaled to ${count}`], stderr: [] };
  }

  private handleApply(): CommandResult {
    return {
      exitCode: 0,
      stdout: ['deployment.apps/frontend-web configured', 'service/frontend-svc unchanged'],
      stderr: [],
    };
  }

  private handleDelete(resource?: string, name?: string): CommandResult {
    if (!resource || !name) return { exitCode: 1, stdout: [], stderr: ['error: specify resource and name'] };

    if (resource === 'pod' || resource === 'pods') {
      if (this.state.pods[name]) {
        const deletedPod = this.state.pods[name];
        delete this.state.pods[name];

        const appLabel = deletedPod.metadata.labels?.app;
        if (appLabel && this.state.deployments[appLabel]) {
          const uniqueSuffix = Math.random().toString(36).substring(2, 6);
          const newPodName = `${appLabel}-7bc9f-${uniqueSuffix}`;
          this.state.pods[newPodName] = {
            apiVersion: 'v1',
            kind: 'Pod',
            metadata: {
              name: newPodName,
              namespace: deletedPod.metadata.namespace || 'default',
              labels: { ...deletedPod.metadata.labels },
              creationTimestamp: Date.now(),
            },
            spec: {
              nodeName: deletedPod.spec.nodeName === 'worker-node-1' ? 'worker-node-2' : 'worker-node-1',
              containers: [{ name: 'nginx', image: 'nginx:1.25-alpine' }],
            },
            status: {
              phase: 'Running',
              podIP: '10.244.1.77',
              hostIP: '192.168.1.11',
              containerStatuses: [
                {
                  name: 'nginx',
                  ready: true,
                  restartCount: 0,
                  image: 'nginx:1.25-alpine',
                  state: { running: { startedAt: Date.now() } },
                },
              ],
            },
          };
        }

        this.notify();
        return { exitCode: 0, stdout: [`pod "${name}" deleted`], stderr: [] };
      }
      return { exitCode: 1, stdout: [], stderr: [`pods "${name}" not found`] };
    }

    return { exitCode: 0, stdout: [`${resource} "${name}" deleted`], stderr: [] };
  }

  private handleRollout(args: string[]): CommandResult {
    const sub = args[0];
    const target = args[1];
    if (sub === 'undo' && target) {
      return { exitCode: 0, stdout: [`deployment.apps/${target.replace('deployment/', '')} rolled back to revision 1`], stderr: [] };
    }
    return { exitCode: 0, stdout: ['rollout status: deployment "frontend-web" successfully rolled out'], stderr: [] };
  }

  private resolveNodeName(name?: string): string | undefined {
    if (!name) return undefined;
    if (this.state.nodes[name]) return name;
    if (name === 'worker-1' && this.state.nodes['worker-node-1']) return 'worker-node-1';
    if (name === 'worker-2' && this.state.nodes['worker-node-2']) return 'worker-node-2';
    return undefined;
  }

  private handleCordon(rawNodeName?: string, cordon: boolean = true): CommandResult {
    const nodeName = this.resolveNodeName(rawNodeName);
    if (!nodeName || !this.state.nodes[nodeName]) {
      return { exitCode: 1, stdout: [], stderr: [`node "${rawNodeName}" not found`] };
    }
    this.state.nodes[nodeName].spec.unschedulable = cordon;
    this.notify();
    return { exitCode: 0, stdout: [`node/${nodeName} ${cordon ? 'cordoned' : 'uncordoned'}`], stderr: [] };
  }

  private handleDrain(rawNodeName?: string): CommandResult {
    const nodeName = this.resolveNodeName(rawNodeName);
    if (!nodeName || !this.state.nodes[nodeName]) {
      return { exitCode: 1, stdout: [], stderr: [`node "${rawNodeName}" not found`] };
    }
    this.state.nodes[nodeName].spec.unschedulable = true;
    const targetNode = nodeName === 'worker-node-1' ? 'worker-node-2' : 'worker-node-1';
    Object.values(this.state.pods).forEach((p) => {
      if (p.spec.nodeName === nodeName) {
        p.spec.nodeName = targetNode;
      }
    });
    this.notify();
    return { exitCode: 0, stdout: [`node/${nodeName} cordoned`, `evicting pods from ${nodeName}...`, `node/${nodeName} drained successfully`], stderr: [] };
  }

  public injectCrashLoop(podName: string) {
    if (this.state.pods[podName]) {
      this.state.pods[podName].status.phase = 'CrashLoopBackOff';
      this.state.pods[podName].status.containerStatuses[0].ready = false;
      this.state.pods[podName].status.containerStatuses[0].restartCount += 5;
      this.notify();
    }
  }

  public injectOOMKilled(podName: string) {
    if (this.state.pods[podName]) {
      this.state.pods[podName].status.phase = 'OOMKilled';
      this.state.pods[podName].status.containerStatuses[0].ready = false;
      this.state.pods[podName].status.containerStatuses[0].restartCount += 2;
      this.notify();
    }
  }

  public curePod(podName: string) {
    if (this.state.pods[podName]) {
      this.state.pods[podName].status.phase = 'Running';
      this.state.pods[podName].status.containerStatuses[0].ready = true;
      this.notify();
    }
  }

  public injectDisaster(type: 'crashloop' | 'oom' | 'node_offline', target?: string) {
    const podNames = Object.keys(this.state.pods);
    const targetPod = target || podNames[0];
    if (type === 'crashloop' && targetPod) {
      this.injectCrashLoop(targetPod);
    } else if (type === 'oom' && targetPod) {
      this.injectOOMKilled(targetPod);
    } else if (type === 'node_offline') {
      const nodeKey = this.resolveNodeName(target) || 'worker-node-2';
      if (this.state.nodes[nodeKey]) {
        this.state.nodes[nodeKey].status.ready = false;
        this.notify();
      }
    }
  }

  public resetCluster() {
    const fresh = new KubeEngine();
    this.state = JSON.parse(JSON.stringify(fresh.getState()));
    this.notify();
  }
}
