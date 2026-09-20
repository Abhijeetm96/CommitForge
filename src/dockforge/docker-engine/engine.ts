import {
  Container,
  DockerImage,
  DockerVolume,
  DockerNetwork,
  DockerCommandResult,
} from './types';

export class DockerEngine {
  private containers: Container[] = [];
  private images: DockerImage[] = [];
  private volumes: DockerVolume[] = [];
  private networks: DockerNetwork[] = [];

  constructor() {
    this.seedDefaultState();
  }

  private seedDefaultState() {
    // Standard images available locally
    this.images = [
      {
        id: 'img-nginx-125',
        repository: 'nginx',
        tag: '1.25-alpine',
        digest: 'sha256:7c9e13a48e28f321a5d',
        created: '3 days ago',
        sizeMb: 41.2,
        exposedPorts: [80],
        entrypoint: ['/docker-entrypoint.sh'],
        cmd: ['nginx', '-g', 'daemon off;'],
        layers: [
          { id: 'layer-1', createdCommand: 'FROM alpine:3.19', sizeMb: 7.3, cached: true },
          { id: 'layer-2', createdCommand: 'RUN apk add --no-cache nginx', sizeMb: 33.9, cached: true },
        ],
      },
      {
        id: 'img-postgres-16',
        repository: 'postgres',
        tag: '16-alpine',
        digest: 'sha256:9f41b2c78103a85e',
        created: '1 week ago',
        sizeMb: 82.5,
        exposedPorts: [5432],
        entrypoint: ['docker-entrypoint.sh'],
        cmd: ['postgres'],
        env: { POSTGRES_PASSWORD: 'secretpassword' },
        layers: [
          { id: 'layer-p1', createdCommand: 'FROM alpine:3.19', sizeMb: 7.3, cached: true },
          { id: 'layer-p2', createdCommand: 'RUN apk add postgresql16', sizeMb: 75.2, cached: true },
        ],
      },
      {
        id: 'img-node-20',
        repository: 'node',
        tag: '20-alpine',
        digest: 'sha256:1a84f39c2d1b',
        created: '2 weeks ago',
        sizeMb: 178.4,
        exposedPorts: [3000],
        entrypoint: ['docker-entrypoint.sh'],
        cmd: ['node'],
        layers: [
          { id: 'layer-n1', createdCommand: 'FROM alpine:3.19', sizeMb: 7.3, cached: true },
          { id: 'layer-n2', createdCommand: 'RUN apk add nodejs npm', sizeMb: 171.1, cached: true },
        ],
      },
      {
        id: 'img-alpine-319',
        repository: 'alpine',
        tag: '3.19',
        digest: 'sha256:6457d532ad2b',
        created: '1 month ago',
        sizeMb: 7.38,
        exposedPorts: [],
        cmd: ['/bin/sh'],
        layers: [
          { id: 'layer-a1', createdCommand: 'ADD alpine-minirootfs.tar.gz /', sizeMb: 7.38, cached: true },
        ],
      },
      {
        id: 'img-redis-7',
        repository: 'redis',
        tag: '7-alpine',
        digest: 'sha256:4b19c2810a9f',
        created: '2 weeks ago',
        sizeMb: 35.1,
        exposedPorts: [6379],
        entrypoint: ['docker-entrypoint.sh'],
        cmd: ['redis-server'],
        layers: [
          { id: 'layer-r1', createdCommand: 'FROM alpine:3.19', sizeMb: 7.3, cached: true },
          { id: 'layer-r2', createdCommand: 'RUN apk add redis', sizeMb: 27.8, cached: true },
        ],
      },
    ];

    // Standard volumes
    this.volumes = [
      {
        name: 'pgdata',
        driver: 'local',
        scope: 'local',
        mountpoint: '/var/lib/docker/volumes/pgdata/_data',
        createdAt: '2026-09-01T10:00:00Z',
        sizeMb: 124.5,
        labels: { app: 'postgres' },
      },
      {
        name: 'redis-cache',
        driver: 'local',
        scope: 'local',
        mountpoint: '/var/lib/docker/volumes/redis-cache/_data',
        createdAt: '2026-09-02T14:30:00Z',
        sizeMb: 18.2,
        labels: { app: 'redis' },
      },
    ];

    // Standard networks
    this.networks = [
      {
        id: 'net-bridge-01',
        name: 'bridge',
        driver: 'bridge',
        scope: 'local',
        subnet: '172.17.0.0/16',
        gateway: '172.17.0.1',
        containers: ['c-nginx-prod', 'c-postgres-db'],
      },
      {
        id: 'net-host-01',
        name: 'host',
        driver: 'host',
        scope: 'local',
        subnet: '0.0.0.0/0',
        gateway: '0.0.0.0',
        containers: [],
      },
      {
        id: 'net-app-01',
        name: 'app-net',
        driver: 'bridge',
        scope: 'local',
        subnet: '172.18.0.0/16',
        gateway: '172.18.0.1',
        containers: [],
      },
    ];

    // Standard initial containers
    this.containers = [
      {
        id: 'c-nginx-prod',
        name: 'web-frontend',
        imageId: 'img-nginx-125',
        imageName: 'nginx:1.25-alpine',
        status: 'running',
        created: '2 hours ago',
        ports: [{ containerPort: 80, hostPort: 8080, protocol: 'tcp' }],
        mounts: [{ type: 'bind', source: '/var/www/html', target: '/usr/share/nginx/html' }],
        network: 'bridge',
        ipAddress: '172.17.0.2',
        env: { NGINX_HOST: 'localhost', NGINX_PORT: '80' },
        cmd: 'nginx -g "daemon off;"',
        logs: [
          '172.17.0.1 - - [21/Sep/2026:02:40:01 +0000] "GET / HTTP/1.1" 200 615',
          '172.17.0.1 - - [21/Sep/2026:02:41:15 +0000] "GET /api/v1/health HTTP/1.1" 200 48',
          'Configuration reloaded successfully. Ready for incoming connections.',
        ],
        cpuUsagePct: 0.4,
        memoryUsageMb: 14.2,
        memoryLimitMb: 512,
      },
      {
        id: 'c-postgres-db',
        name: 'db-postgres',
        imageId: 'img-postgres-16',
        imageName: 'postgres:16-alpine',
        status: 'running',
        created: '3 days ago',
        ports: [{ containerPort: 5432, hostPort: 5432, protocol: 'tcp' }],
        mounts: [{ type: 'volume', source: 'pgdata', target: '/var/lib/postgresql/data' }],
        network: 'bridge',
        ipAddress: '172.17.0.3',
        env: { POSTGRES_DB: 'app_production', POSTGRES_USER: 'admin', POSTGRES_PASSWORD: 'secretpassword' },
        cmd: 'postgres',
        logs: [
          'PostgreSQL Database directory appears to contain a database; Skipping initialization',
          '2026-09-21 02:00:00.104 UTC [1] LOG: starting PostgreSQL 16.1 on x86_64-pc-linux-musl',
          '2026-09-21 02:00:00.105 UTC [1] LOG: listening on IPv4 address "0.0.0.0", port 5432',
          '2026-09-21 02:00:00.110 UTC [1] LOG: database system is ready to accept connections',
        ],
        cpuUsagePct: 1.2,
        memoryUsageMb: 48.6,
        memoryLimitMb: 2048,
      },
      {
        id: 'c-redis-cache',
        name: 'cache-redis',
        imageId: 'img-redis-7',
        imageName: 'redis:7-alpine',
        status: 'stopped',
        created: '1 day ago',
        ports: [{ containerPort: 6379, hostPort: 6379, protocol: 'tcp' }],
        mounts: [{ type: 'volume', source: 'redis-cache', target: '/data' }],
        network: 'app-net',
        ipAddress: '172.18.0.2',
        env: {},
        cmd: 'redis-server --save 60 1 --loglevel notice',
        logs: [
          '1:M 20 Sep 2026 12:00:00.000 * Running mode=standalone, port=6379.',
          '1:M 20 Sep 2026 12:00:00.000 # Server initialized',
          '1:M 20 Sep 2026 18:00:00.000 # User requested shutdown. DB saved on disk.',
        ],
        cpuUsagePct: 0.0,
        memoryUsageMb: 0.0,
        memoryLimitMb: 512,
      },
    ];
  }

  // Getters
  public getContainers(): Container[] {
    return [...this.containers];
  }

  public getImages(): DockerImage[] {
    return [...this.images];
  }

  public getVolumes(): DockerVolume[] {
    return [...this.volumes];
  }

  public getNetworks(): DockerNetwork[] {
    return [...this.networks];
  }

  // Command Execution Pipeline
  public executeCommand(rawCommand: string): DockerCommandResult {
    const trimmed = rawCommand.trim();
    if (!trimmed) {
      return { rawCommand, stdout: [], stderr: [], exitCode: 0 };
    }

    const tokens = trimmed.split(/\s+/);
    if (tokens[0] !== 'docker' && tokens[0] !== 'docker-compose') {
      return {
        rawCommand,
        stdout: [],
        stderr: [`command not found: ${tokens[0]}. Try starting with 'docker' or 'docker compose'`],
        exitCode: 127,
      };
    }

    // Handle docker compose as a single subcommand
    let mainSubcmd = tokens[1] || '';
    let argOffset = 2;

    if (tokens[0] === 'docker' && tokens[1] === 'compose') {
      mainSubcmd = 'compose';
      argOffset = 2;
    } else if (tokens[0] === 'docker-compose') {
      mainSubcmd = 'compose';
      argOffset = 1;
    }

    const subArgs = tokens.slice(argOffset);

    switch (mainSubcmd.toLowerCase()) {
      case 'ps':
        return this.handlePs(subArgs, rawCommand);

      case 'images':
        return this.handleImages(subArgs, rawCommand);

      case 'run':
        return this.handleRun(subArgs, rawCommand);

      case 'stop':
        return this.handleStop(subArgs, rawCommand);

      case 'start':
        return this.handleStart(subArgs, rawCommand);

      case 'rm':
        return this.handleRm(subArgs, rawCommand);

      case 'rmi':
        return this.handleRmi(subArgs, rawCommand);

      case 'exec':
        return this.handleExec(subArgs, rawCommand);

      case 'logs':
        return this.handleLogs(subArgs, rawCommand);

      case 'inspect':
        return this.handleInspect(subArgs, rawCommand);

      case 'volume':
        return this.handleVolume(subArgs, rawCommand);

      case 'network':
        return this.handleNetwork(subArgs, rawCommand);

      case 'build':
        return this.handleBuild(subArgs, rawCommand);

      case 'compose':
        return this.handleCompose(subArgs, rawCommand);

      case 'pull':
        return this.handlePull(subArgs, rawCommand);

      case 'push':
        return this.handlePush(subArgs, rawCommand);

      case 'stats':
        return this.handleStats(subArgs, rawCommand);

      case 'version':
      case '--version':
      case '-v':
        return {
          rawCommand,
          stdout: [
            'Docker version 26.0.0, build 2ae900e',
            'Docker Engine - Community v26.0.0',
            'OCI Runtime: runc v1.1.12',
            'Containerd: v1.7.13',
          ],
          stderr: [],
          exitCode: 0,
        };

      case 'info':
        return {
          rawCommand,
          stdout: [
            'Client: Docker Engine - Community',
            ' Context:    default',
            ' Debug Mode: false',
            'Plugins:',
            ' buildx: Docker Buildx v0.13.1',
            ' compose: Docker Compose v2.26.1',
            'Server:',
            ` Containers: ${this.containers.length}`,
            `  Running: ${this.containers.filter((c) => c.status === 'running').length}`,
            `  Paused: 0`,
            `  Stopped: ${this.containers.filter((c) => c.status !== 'running').length}`,
            ` Images: ${this.images.length}`,
            ' Server Version: 26.0.0',
            ' Storage Driver: overlay2',
            '  Backing Filesystem: extfs',
            ' Cgroup Driver: cgroupfs',
            ' Cgroup Version: 2',
            ' Security Options: apparmor seccomp rootless',
            ' Kernel Version: 6.6.13-linux-kit',
            ' Operating System: Docker Desktop Virtual Machine',
            ' OSType: linux',
            ' Architecture: x86_64',
            ' CPUs: 4',
            ' Total Memory: 7.766GiB',
          ],
          stderr: [],
          exitCode: 0,
        };

      default:
        return {
          rawCommand,
          stdout: [],
          stderr: [`docker: '${mainSubcmd}' is not a docker command. See 'docker --help'.`],
          exitCode: 1,
        };
    }
  }

  // Handlers
  private handlePs(args: string[], rawCommand: string): DockerCommandResult {
    const showAll = args.includes('-a') || args.includes('--all');
    const filtered = showAll ? this.containers : this.containers.filter((c) => c.status === 'running');

    if (filtered.length === 0) {
      return {
        rawCommand,
        stdout: ['CONTAINER ID   IMAGE     COMMAND   CREATED   STATUS    PORTS     NAMES'],
        stderr: [],
        exitCode: 0,
      };
    }

    const header = 'CONTAINER ID   IMAGE              COMMAND                  CREATED        STATUS         PORTS                    NAMES';
    const lines = filtered.map((c) => {
      const idStr = c.id.substring(0, 12).padEnd(14);
      const imgStr = c.imageName.padEnd(18);
      const cmdStr = `"${c.cmd}"`.substring(0, 22).padEnd(24);
      const createdStr = c.created.padEnd(14);
      const statusStr = (c.status === 'running' ? 'Up 2 hours' : 'Exited (0)').padEnd(14);
      const portsStr = c.ports.map((p) => `0.0.0.0:${p.hostPort}->${p.containerPort}/${p.protocol}`).join(', ').padEnd(24);
      return `${idStr}${imgStr}${cmdStr}${createdStr}${statusStr}${portsStr}${c.name}`;
    });

    return {
      rawCommand,
      stdout: [header, ...lines],
      stderr: [],
      exitCode: 0,
    };
  }

  private handleImages(args: string[], rawCommand: string): DockerCommandResult {
    const header = 'REPOSITORY         TAG          IMAGE ID       CREATED        SIZE';
    const lines = this.images.map((img) => {
      const repoStr = img.repository.padEnd(18);
      const tagStr = img.tag.padEnd(12);
      const idStr = img.id.replace('img-', '').substring(0, 12).padEnd(14);
      const createdStr = img.created.padEnd(14);
      const sizeStr = `${img.sizeMb.toFixed(1)}MB`;
      return `${repoStr}${tagStr}${idStr}${createdStr}${sizeStr}`;
    });

    return {
      rawCommand,
      stdout: [header, ...lines],
      stderr: [],
      exitCode: 0,
    };
  }

  private handleRun(args: string[], rawCommand: string): DockerCommandResult {
    let detach = false;
    let name = '';
    let hostPort: number | null = null;
    let containerPort: number | null = null;
    let envVars: Record<string, string> = {};
    let volumeSource = '';
    let volumeTarget = '';
    let network = 'bridge';
    let imageTarget = '';
    let customCmd = '';

    for (let i = 0; i < args.length; i++) {
      const arg = args[i];
      if (arg === '-d' || arg === '--detach') {
        detach = true;
      } else if (arg === '--name' && args[i + 1]) {
        name = args[i + 1];
        i++;
      } else if ((arg === '-p' || arg === '--publish') && args[i + 1]) {
        const parts = args[i + 1].split(':');
        if (parts.length === 2) {
          hostPort = parseInt(parts[0], 10);
          containerPort = parseInt(parts[1], 10);
        }
        i++;
      } else if ((arg === '-e' || arg === '--env') && args[i + 1]) {
        const parts = args[i + 1].split('=');
        if (parts.length === 2) {
          envVars[parts[0]] = parts[1];
        }
        i++;
      } else if ((arg === '-v' || arg === '--volume') && args[i + 1]) {
        const parts = args[i + 1].split(':');
        if (parts.length >= 2) {
          volumeSource = parts[0];
          volumeTarget = parts[1];
        }
        i++;
      } else if (arg === '--network' && args[i + 1]) {
        network = args[i + 1];
        i++;
      } else if (!arg.startsWith('-') && !imageTarget) {
        imageTarget = arg;
      } else if (!arg.startsWith('-') && imageTarget) {
        customCmd += (customCmd ? ' ' : '') + arg;
      }
    }

    if (!imageTarget) {
      return {
        rawCommand,
        stdout: [],
        stderr: ['docker run requires at least 1 argument: "docker run [OPTIONS] IMAGE [COMMAND] [ARG...]"'],
        exitCode: 1,
      };
    }

    // Find image or attempt pull simulation
    let foundImage = this.images.find(
      (img) => `${img.repository}:${img.tag}` === imageTarget || img.repository === imageTarget
    );

    let pullLogs: string[] = [];
    if (!foundImage) {
      // Auto-pull image
      const repo = imageTarget.includes(':') ? imageTarget.split(':')[0] : imageTarget;
      const tag = imageTarget.includes(':') ? imageTarget.split(':')[1] : 'latest';

      pullLogs = [
        `Unable to find image '${imageTarget}' locally`,
        `${tag}: Pulling from library/${repo}`,
        '2b9e67123a8e: Pull complete',
        '7c8a14b391d0: Pull complete',
        `Digest: sha256:${Math.random().toString(36).substring(2, 12)}`,
        `Status: Downloaded newer image for ${repo}:${tag}`,
      ];

      foundImage = {
        id: `img-${repo}-${Date.now().toString(36)}`,
        repository: repo,
        tag: tag,
        digest: `sha256:${Math.random().toString(36).substring(2, 12)}`,
        created: 'Just now',
        sizeMb: 54.0,
        exposedPorts: [80],
        layers: [{ id: `layer-${Date.now()}`, createdCommand: `FROM ${repo}:${tag}`, sizeMb: 54.0, cached: false }],
      };
      this.images.push(foundImage);
    }

    const containerId = `c-${Math.random().toString(36).substring(2, 10)}`;
    const containerName = name || `${foundImage.repository}-${containerId.substring(2, 6)}`;
    const finalCmd = customCmd || (foundImage.cmd ? foundImage.cmd.join(' ') : '/bin/sh');

    const newContainer: Container = {
      id: containerId,
      name: containerName,
      imageId: foundImage.id,
      imageName: `${foundImage.repository}:${foundImage.tag}`,
      status: 'running',
      created: 'Just now',
      ports: hostPort && containerPort ? [{ hostPort, containerPort, protocol: 'tcp' }] : [],
      mounts: volumeSource && volumeTarget ? [{ type: 'volume', source: volumeSource, target: volumeTarget }] : [],
      network: network,
      ipAddress: `172.17.0.${this.containers.length + 2}`,
      env: envVars,
      cmd: finalCmd,
      logs: [
        `Container ${containerName} started with command "${finalCmd}"`,
        `Listening on IP ${`172.17.0.${this.containers.length + 2}`}`,
      ],
      cpuUsagePct: 0.8,
      memoryUsageMb: 18.5,
      memoryLimitMb: 512,
    };

    this.containers.push(newContainer);

    const stdoutLines = [...pullLogs];
    if (detach) {
      stdoutLines.push(`${containerId}a92b7c4d9e1f82736458`);
    } else {
      stdoutLines.push(
        `[${containerName}] Container initialized in attached interactive mode`,
        `[${containerName}] ${finalCmd}`,
        `[${containerName}] System ready.`
      );
    }

    return {
      rawCommand,
      stdout: stdoutLines,
      stderr: [],
      exitCode: 0,
      whatHappened: `Started container "${containerName}" from image "${imageTarget}".`,
      affectedContainers: [containerId],
    };
  }

  private handleStop(args: string[], rawCommand: string): DockerCommandResult {
    const target = args[0];
    if (!target) {
      return { rawCommand, stdout: [], stderr: ['"docker stop" requires at least 1 argument.'], exitCode: 1 };
    }

    const container = this.containers.find((c) => c.id === target || c.name === target || c.id.startsWith(target));
    if (!container) {
      return { rawCommand, stdout: [], stderr: [`Error response from daemon: No such container: ${target}`], exitCode: 1 };
    }

    container.status = 'stopped';
    container.cpuUsagePct = 0;
    container.memoryUsageMb = 0;
    container.logs.push(`SIGTERM signal received. Container graceful shutdown completed.`);

    return {
      rawCommand,
      stdout: [target],
      stderr: [],
      exitCode: 0,
      whatHappened: `Stopped container "${container.name}".`,
      affectedContainers: [container.id],
    };
  }

  private handleStart(args: string[], rawCommand: string): DockerCommandResult {
    const target = args[0];
    if (!target) {
      return { rawCommand, stdout: [], stderr: ['"docker start" requires at least 1 argument.'], exitCode: 1 };
    }

    const container = this.containers.find((c) => c.id === target || c.name === target || c.id.startsWith(target));
    if (!container) {
      return { rawCommand, stdout: [], stderr: [`Error response from daemon: No such container: ${target}`], exitCode: 1 };
    }

    container.status = 'running';
    container.cpuUsagePct = 0.5;
    container.memoryUsageMb = 24.0;
    container.logs.push(`Container restarted successfully.`);

    return {
      rawCommand,
      stdout: [target],
      stderr: [],
      exitCode: 0,
      whatHappened: `Started container "${container.name}".`,
      affectedContainers: [container.id],
    };
  }

  private handleRm(args: string[], rawCommand: string): DockerCommandResult {
    const force = args.includes('-f') || args.includes('--force');
    const target = args.find((a) => !a.startsWith('-'));

    if (!target) {
      return { rawCommand, stdout: [], stderr: ['"docker rm" requires at least 1 argument.'], exitCode: 1 };
    }

    const index = this.containers.findIndex((c) => c.id === target || c.name === target || c.id.startsWith(target));
    if (index === -1) {
      return { rawCommand, stdout: [], stderr: [`Error response from daemon: No such container: ${target}`], exitCode: 1 };
    }

    const c = this.containers[index];
    if (c.status === 'running' && !force) {
      return {
        rawCommand,
        stdout: [],
        stderr: [`Error response from daemon: You cannot remove a running container ${c.name}. Stop the container before removing or run with -f`],
        exitCode: 1,
      };
    }

    this.containers.splice(index, 1);
    return {
      rawCommand,
      stdout: [target],
      stderr: [],
      exitCode: 0,
      whatHappened: `Removed container "${c.name}".`,
      affectedContainers: [c.id],
    };
  }

  private handleRmi(args: string[], rawCommand: string): DockerCommandResult {
    const target = args.find((a) => !a.startsWith('-'));
    if (!target) {
      return { rawCommand, stdout: [], stderr: ['"docker rmi" requires at least 1 argument.'], exitCode: 1 };
    }

    const index = this.images.findIndex(
      (img) => img.id === target || `${img.repository}:${img.tag}` === target || img.repository === target
    );

    if (index === -1) {
      return { rawCommand, stdout: [], stderr: [`Error response from daemon: No such image: ${target}`], exitCode: 1 };
    }

    const img = this.images[index];
    this.images.splice(index, 1);

    return {
      rawCommand,
      stdout: [
        `Untagged: ${img.repository}:${img.tag}`,
        `Deleted: sha256:${img.digest}`,
      ],
      stderr: [],
      exitCode: 0,
      whatHappened: `Deleted Docker image "${img.repository}:${img.tag}".`,
      affectedImages: [img.id],
    };
  }

  private handleExec(args: string[], rawCommand: string): DockerCommandResult {
    const containerTarget = args.find((a) => !a.startsWith('-'));
    if (!containerTarget) {
      return { rawCommand, stdout: [], stderr: ['"docker exec" requires at least 2 arguments.'], exitCode: 1 };
    }

    const idx = args.indexOf(containerTarget);
    const execCmd = args.slice(idx + 1).join(' ') || 'ls -la';

    const container = this.containers.find((c) => c.id === containerTarget || c.name === containerTarget);
    if (!container) {
      return { rawCommand, stdout: [], stderr: [`Error response from daemon: No such container: ${containerTarget}`], exitCode: 1 };
    }

    if (container.status !== 'running') {
      return {
        rawCommand,
        stdout: [],
        stderr: [`Error response from daemon: Container ${containerTarget} is not running`],
        exitCode: 1,
      };
    }

    let stdout: string[] = [];
    if (execCmd.includes('ls')) {
      stdout = ['total 32', 'drwxr-xr-x  1 root root 4096 Sep 21 02:00 .', 'drwxr-xr-x  1 root root 4096 Sep 21 02:00 ..', '-rw-r--r--  1 root root   27 Sep 21 02:00 index.html', 'drwxr-xr-x  2 root root 4096 Sep 21 02:00 static'];
    } else if (execCmd.includes('cat')) {
      stdout = ['<!DOCTYPE html><html><body><h1>Hello from Docker Container!</h1></body></html>'];
    } else if (execCmd.includes('env') || execCmd.includes('printenv')) {
      stdout = Object.entries(container.env).map(([k, v]) => `${k}=${v}`);
    } else {
      stdout = [`Executing '${execCmd}' inside container [${container.name}]...`, `Command returned exit code 0.`];
    }

    return {
      rawCommand,
      stdout,
      stderr: [],
      exitCode: 0,
    };
  }

  private handleLogs(args: string[], rawCommand: string): DockerCommandResult {
    const target = args.find((a) => !a.startsWith('-'));
    if (!target) {
      return { rawCommand, stdout: [], stderr: ['"docker logs" requires at least 1 argument.'], exitCode: 1 };
    }

    const container = this.containers.find((c) => c.id === target || c.name === target || c.id.startsWith(target));
    if (!container) {
      return { rawCommand, stdout: [], stderr: [`Error response from daemon: No such container: ${target}`], exitCode: 1 };
    }

    return {
      rawCommand,
      stdout: container.logs.length > 0 ? container.logs : ['[No log output available]'],
      stderr: [],
      exitCode: 0,
    };
  }

  private handleInspect(args: string[], rawCommand: string): DockerCommandResult {
    const target = args.find((a) => !a.startsWith('-'));
    if (!target) {
      return { rawCommand, stdout: [], stderr: ['"docker inspect" requires at least 1 argument.'], exitCode: 1 };
    }

    const container = this.containers.find((c) => c.id === target || c.name === target);
    if (container) {
      const inspectJson = JSON.stringify([
        {
          Id: container.id,
          Created: container.created,
          State: { Status: container.status, Running: container.status === 'running', Pid: 49201 },
          Image: container.imageId,
          Name: `/${container.name}`,
          NetworkSettings: { IPAddress: container.ipAddress, Ports: container.ports },
          Mounts: container.mounts,
          Config: { Env: Object.entries(container.env).map(([k, v]) => `${k}=${v}`), Cmd: [container.cmd] },
        },
      ], null, 2);

      return {
        rawCommand,
        stdout: inspectJson.split('\n'),
        stderr: [],
        exitCode: 0,
      };
    }

    return { rawCommand, stdout: [], stderr: [`Error: No such object: ${target}`], exitCode: 1 };
  }

  private handleVolume(args: string[], rawCommand: string): DockerCommandResult {
    const subcmd = args[0] || 'ls';

    if (subcmd === 'ls') {
      const header = 'DRIVER    VOLUME NAME';
      const lines = this.volumes.map((v) => `${v.driver.padEnd(10)}${v.name}`);
      return { rawCommand, stdout: [header, ...lines], stderr: [], exitCode: 0 };
    } else if (subcmd === 'create') {
      const volName = args[1] || `vol-${Date.now().toString(36)}`;
      const newVol: DockerVolume = {
        name: volName,
        driver: 'local',
        scope: 'local',
        mountpoint: `/var/lib/docker/volumes/${volName}/_data`,
        createdAt: new Date().toISOString(),
        sizeMb: 0.0,
        labels: {},
      };
      this.volumes.push(newVol);
      return { rawCommand, stdout: [volName], stderr: [], exitCode: 0 };
    } else if (subcmd === 'rm') {
      const volName = args[1];
      const idx = this.volumes.findIndex((v) => v.name === volName);
      if (idx !== -1) {
        this.volumes.splice(idx, 1);
        return { rawCommand, stdout: [volName], stderr: [], exitCode: 0 };
      }
      return { rawCommand, stdout: [], stderr: [`Error: No such volume: ${volName}`], exitCode: 1 };
    }

    return { rawCommand, stdout: [], stderr: [`docker volume ${subcmd} not recognized`], exitCode: 1 };
  }

  private handleNetwork(args: string[], rawCommand: string): DockerCommandResult {
    const subcmd = args[0] || 'ls';

    if (subcmd === 'ls') {
      const header = 'NETWORK ID     NAME      DRIVER    SCOPE';
      const lines = this.networks.map((n) => `${n.id.substring(0, 12).padEnd(15)}${n.name.padEnd(10)}${n.driver.padEnd(10)}${n.scope}`);
      return { rawCommand, stdout: [header, ...lines], stderr: [], exitCode: 0 };
    } else if (subcmd === 'create') {
      const netName = args[1] || `net-${Date.now().toString(36)}`;
      const newNet: DockerNetwork = {
        id: `net-${Math.random().toString(36).substring(2, 10)}`,
        name: netName,
        driver: 'bridge',
        scope: 'local',
        subnet: '172.19.0.0/16',
        gateway: '172.19.0.1',
        containers: [],
      };
      this.networks.push(newNet);
      return { rawCommand, stdout: [newNet.id], stderr: [], exitCode: 0 };
    }

    return { rawCommand, stdout: [], stderr: [`docker network ${subcmd} not recognized`], exitCode: 1 };
  }

  private handleBuild(args: string[], rawCommand: string): DockerCommandResult {
    let tag = 'custom-app:latest';
    for (let i = 0; i < args.length; i++) {
      if ((args[i] === '-t' || args[i] === '--tag') && args[i + 1]) {
        tag = args[i + 1];
        break;
      }
    }

    const [repo, tagVersion] = tag.includes(':') ? tag.split(':') : [tag, 'latest'];

    const newImage: DockerImage = {
      id: `img-${repo}-${Date.now().toString(36)}`,
      repository: repo,
      tag: tagVersion,
      digest: `sha256:${Math.random().toString(36).substring(2, 12)}`,
      created: 'Just now',
      sizeMb: 45.8,
      exposedPorts: [8080],
      layers: [
        { id: 'b-layer-1', createdCommand: 'FROM node:20-alpine', sizeMb: 35.0, cached: true },
        { id: 'b-layer-2', createdCommand: 'WORKDIR /app', sizeMb: 0.1, cached: false },
        { id: 'b-layer-3', createdCommand: 'COPY package*.json ./', sizeMb: 0.2, cached: false },
        { id: 'b-layer-4', createdCommand: 'RUN npm install', sizeMb: 8.5, cached: false },
        { id: 'b-layer-5', createdCommand: 'COPY . .', sizeMb: 2.0, cached: false },
        { id: 'b-layer-6', createdCommand: 'EXPOSE 8080', sizeMb: 0.0, cached: false },
        { id: 'b-layer-7', createdCommand: 'CMD ["npm", "start"]', sizeMb: 0.0, cached: false },
      ],
    };

    this.images.push(newImage);

    return {
      rawCommand,
      stdout: [
        `[+] Building 3.4s (8/8) FINISHED`,
        ` => [internal] load build definition from Dockerfile                              0.1s`,
        ` => [1/5] FROM docker.io/library/node:20-alpine                                   0.0s`,
        ` => [2/5] WORKDIR /app                                                           0.2s`,
        ` => [3/5] COPY package*.json ./                                                  0.1s`,
        ` => [4/5] RUN npm install                                                        2.1s`,
        ` => [5/5] COPY . .                                                               0.4s`,
        ` => exporting to image                                                           0.5s`,
        ` => => naming to docker.io/library/${tag}                                        0.0s`,
        `Successfully built ${newImage.id.substring(0, 12)}`,
        `Successfully tagged ${tag}`,
      ],
      stderr: [],
      exitCode: 0,
      whatHappened: `Built Docker image "${tag}" from Dockerfile.`,
      affectedImages: [newImage.id],
    };
  }

  private handleCompose(args: string[], rawCommand: string): DockerCommandResult {
    const subcmd = args[0] || 'ps';

    if (subcmd === 'up') {
      // Simulate compose up
      const webContainer: Container = {
        id: `c-compose-web-${Date.now().toString(36)}`,
        name: 'app-web-1',
        imageId: 'img-node-20',
        imageName: 'node:20-alpine',
        status: 'running',
        created: 'Just now',
        ports: [{ hostPort: 3000, containerPort: 3000, protocol: 'tcp' }],
        mounts: [],
        network: 'app-net',
        ipAddress: '172.18.0.3',
        env: { NODE_ENV: 'production', DB_HOST: 'app-db-1' },
        cmd: 'npm start',
        logs: ['Server listening on port 3000', 'Connected to PostgreSQL on app-db-1:5432'],
        cpuUsagePct: 1.1,
        memoryUsageMb: 36.4,
        memoryLimitMb: 512,
      };

      this.containers.push(webContainer);

      return {
        rawCommand,
        stdout: [
          '[-] Creating 2/2',
          ' ✔ Network app_default     Created                                               0.1s',
          ' ✔ Container app-db-1      Started                                               0.4s',
          ' ✔ Container app-web-1     Started                                               0.6s',
        ],
        stderr: [],
        exitCode: 0,
        whatHappened: 'Started Docker Compose stack (services: app-web-1, app-db-1).',
      };
    } else if (subcmd === 'down') {
      this.containers = this.containers.filter((c) => !c.name.startsWith('app-'));
      return {
        rawCommand,
        stdout: [
          '[-] Stopping 2/2',
          ' ✔ Container app-web-1     Stopped                                               0.3s',
          ' ✔ Container app-db-1      Stopped                                               0.5s',
          ' ✔ Network app_default     Removed                                               0.1s',
        ],
        stderr: [],
        exitCode: 0,
      };
    }

    return this.handlePs(['-a'], rawCommand);
  }

  private handlePull(args: string[], rawCommand: string): DockerCommandResult {
    const target = args[0];
    if (!target) {
      return { rawCommand, stdout: [], stderr: ['"docker pull" requires at least 1 argument.'], exitCode: 1 };
    }

    const repo = target.includes(':') ? target.split(':')[0] : target;
    const tag = target.includes(':') ? target.split(':')[1] : 'latest';

    const newImage: DockerImage = {
      id: `img-${repo}-${Date.now().toString(36)}`,
      repository: repo,
      tag: tag,
      digest: `sha256:${Math.random().toString(36).substring(2, 12)}`,
      created: 'Just now',
      sizeMb: 62.4,
      exposedPorts: [80],
      layers: [{ id: `l-${Date.now()}`, createdCommand: `FROM ${repo}:${tag}`, sizeMb: 62.4, cached: false }],
    };

    this.images.push(newImage);

    return {
      rawCommand,
      stdout: [
        `${tag}: Pulling from library/${repo}`,
        'af405c9314c2: Pull complete',
        '3b971a82d02a: Pull complete',
        `Digest: sha256:${newImage.digest}`,
        `Status: Downloaded newer image for ${repo}:${tag}`,
      ],
      stderr: [],
      exitCode: 0,
      whatHappened: `Pulled image "${repo}:${tag}" from Docker Hub.`,
    };
  }

  private handlePush(args: string[], rawCommand: string): DockerCommandResult {
    const target = args[0];
    if (!target) {
      return { rawCommand, stdout: [], stderr: ['"docker push" requires at least 1 argument.'], exitCode: 1 };
    }

    return {
      rawCommand,
      stdout: [
        `The push refers to repository [docker.io/${target}]`,
        '5f70bf18a086: Pushed',
        'c0d12e98fa10: Pushed',
        'latest: digest: sha256:8f2a1b4c7d9e size: 1420',
      ],
      stderr: [],
      exitCode: 0,
      whatHappened: `Pushed image "${target}" to registry.`,
    };
  }

  private handleStats(args: string[], rawCommand: string): DockerCommandResult {
    const header = 'CONTAINER ID   NAME           CPU %     MEM USAGE / LIMIT     MEM %     NET I/O         BLOCK I/O';
    const lines = this.containers
      .filter((c) => c.status === 'running')
      .map((c) => {
        const idStr = c.id.substring(0, 12).padEnd(15);
        const nameStr = c.name.padEnd(15);
        const cpuStr = `${c.cpuUsagePct.toFixed(2)}%`.padEnd(10);
        const memStr = `${c.memoryUsageMb.toFixed(1)}MiB / ${c.memoryLimitMb}MiB`.padEnd(22);
        const memPctStr = `${((c.memoryUsageMb / c.memoryLimitMb) * 100).toFixed(2)}%`.padEnd(10);
        return `${idStr}${nameStr}${cpuStr}${memStr}${memPctStr}1.2kB / 4.8kB   0B / 12.4MB`;
      });

    return {
      rawCommand,
      stdout: [header, ...lines],
      stderr: [],
      exitCode: 0,
    };
  }
}
