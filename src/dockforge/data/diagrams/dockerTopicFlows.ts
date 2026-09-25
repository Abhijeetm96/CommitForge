import type { UniversalDockerConcept } from '../unifiedDockerData';
import type {
  DockerTopicFlowDiagramData,
  DockerFlowBlock,
  DockerFlowConnection,
  DockerFlowStep,
} from '../../components/diagrams/dockerDiagramTypes';

// ============================================================================
// TOPIC 01: INTRODUCTION TO CONTAINERS
// OCI Architecture, Virtualization Boundary & User-space Process Isolation
// ============================================================================
const TOPIC_01_FLOW = (c: { id: string; title: string }): DockerTopicFlowDiagramData => ({
  topicId: 'topic-01',
  topicNumber: '01',
  topicTitle: 'Introduction to Containers',
  conceptId: c.id,
  conceptTitle: c.title,
  architectureType: 'Container vs VM Virtualization & OCI Specification Pipeline',
  architecturalSummary:
    'Demonstrates how Docker utilizes host Linux kernel namespaces and cgroups to isolate user-space processes without hypervisor hardware emulation or guest operating systems.',
  subtopics: [
    'User-space process isolation',
    'Type-2 Hypervisor vs OS-level virtualization',
    'Open Container Initiative (OCI) runtime-spec and image-spec',
    'Runc reference container execution engine',
  ],
  blocks: [
    {
      id: 't01-client',
      label: 'Docker CLI / User',
      sublabel: 'Client Interface',
      category: 'client',
      icon: 'terminal',
      portOrProtocol: 'CLI User Space',
      statusText: 'Originator',
      details: {
        role: 'Accepts developer commands and formats REST API payloads for the Docker daemon.',
        processName: 'docker',
        cliDiagnostic: 'docker version --format "{{json .Client}}"',
        configLocation: '~/.docker/config.json',
        keyInsight: 'The CLI is purely a stateless client talking over /var/run/docker.sock.',
      },
    },
    {
      id: 't01-dockerd',
      label: 'Docker Daemon (dockerd)',
      sublabel: 'API Gateway & Engine',
      category: 'daemon',
      icon: 'server',
      portOrProtocol: '/var/run/docker.sock',
      statusText: 'Orchestrator',
      details: {
        role: 'Processes API requests, manages high-level image builds, network creation, and volume persistence.',
        processName: 'dockerd',
        cliDiagnostic: 'systemctl status docker --no-pager',
        configLocation: '/etc/docker/daemon.json',
        keyInsight: 'Delegates low-level container execution to containerd via gRPC API.',
      },
    },
    {
      id: 't01-containerd',
      label: 'containerd Supervisor',
      sublabel: 'Core Container Lifecycle',
      category: 'runtime',
      icon: 'box',
      portOrProtocol: 'gRPC /run/containerd/containerd.sock',
      statusText: 'Supervisor',
      details: {
        role: 'Supervises container execution, pulls OCI image bundles, unpacks snapshotter layers, and manages shims.',
        processName: 'containerd',
        cliDiagnostic: 'ctr version',
        configLocation: '/etc/containerd/config.toml',
        keyInsight: 'Industry-standard CNCF runtime used by Docker, Kubernetes (CRI), and cloud providers.',
      },
    },
    {
      id: 't01-runc',
      label: 'runc (OCI Runtime)',
      sublabel: 'Low-Level Spawner',
      category: 'runtime',
      icon: 'cpu',
      portOrProtocol: 'Direct Exec / CLI',
      statusText: 'Ephemeral Spawner',
      details: {
        role: 'Consumes OCI bundle (rootfs + config.json), invokes clone() syscall with namespace flags, and exits.',
        processName: 'runc',
        cliDiagnostic: 'runc --version',
        configLocation: '/run/containerd/io.containerd.runtime.v2.task/moby/<id>/config.json',
        keyInsight: 'runc runs once to spawn the isolated container process and immediately hands supervision to the shim.',
      },
    },
    {
      id: 't01-kernel',
      label: 'Linux Host Kernel',
      sublabel: 'Namespaces & cgroups',
      category: 'kernel',
      icon: 'layers',
      portOrProtocol: 'System Call ABI',
      statusText: 'Host Hardware Boundary',
      details: {
        role: 'Enforces memory/CPU quotas via cgroups and partitions system resources via 6 Linux namespaces.',
        processName: 'vmlinuz (Kernel)',
        cliDiagnostic: 'uname -r && cat /proc/cgroups',
        configLocation: '/sys/fs/cgroup',
        keyInsight: 'Containers are not virtual machines; they are ordinary Linux processes running directly on the host CPU.',
      },
    },
  ],
  connections: [
    { from: 't01-client', to: 't01-dockerd', label: 'REST API Command', protocol: 'UNIX Socket / IPC', stepNumber: 1 },
    { from: 't01-dockerd', to: 't01-containerd', label: 'Create Container Task', protocol: 'gRPC / HTTP2', stepNumber: 2 },
    { from: 't01-containerd', to: 't01-runc', label: 'Spawn OCI Bundle', protocol: 'OCI Runtime Spec', stepNumber: 3 },
    { from: 't01-runc', to: 't01-kernel', label: 'clone(CLONE_NEW*) & cgroups', protocol: 'Linux Syscall ABI', stepNumber: 4 },
  ],
  steps: [
    {
      step: 1,
      title: 'User Dispatches Container Command',
      summary: 'Docker CLI sends an HTTP POST request over UNIX domain socket to dockerd.',
      activeBlockIds: ['t01-client', 't01-dockerd'],
      activeConnectionIdxs: [0],
      detailExplanation: {
        simpleWords: 'You type "docker run" and the client asks the Docker daemon in the background to start a new container.',
        technicalMechanics: 'The CLI parses command line arguments and invokes POST /v1.44/containers/create over /var/run/docker.sock.',
      },
      dockerTrace: 'docker events --filter "type=container"',
    },
    {
      step: 2,
      title: 'dockerd Delegates to containerd',
      summary: 'Docker daemon translates the request into an OCI container specification for containerd.',
      activeBlockIds: ['t01-dockerd', 't01-containerd'],
      activeConnectionIdxs: [1],
      detailExplanation: {
        simpleWords: 'The daemon prepares image layers and tells containerd: "create a supervised execution unit with this root filesystem".',
        technicalMechanics: 'dockerd calls containerd CreateTask gRPC endpoint with snapshot mounts and namespace isolation configs.',
      },
      dockerTrace: 'ctr tasks list',
    },
    {
      step: 3,
      title: 'containerd Launches runc',
      summary: 'containerd executes runc passing the unpacked root filesystem and config.json spec.',
      activeBlockIds: ['t01-containerd', 't01-runc'],
      activeConnectionIdxs: [2],
      detailExplanation: {
        simpleWords: 'runc is the precision engine that creates the Linux container boundary on the operating system.',
        technicalMechanics: 'runc reads config.json specifying Linux namespaces (pid, net, mnt, ipc, uts, user) and cgroup resource quotas.',
      },
      dockerTrace: 'ls -la /run/containerd/io.containerd.runtime.v2.task/moby/',
    },
    {
      step: 4,
      title: 'Kernel Establishes Namespaces & cgroups',
      summary: 'Host kernel creates isolated process table, virtual ethernet device, and CPU/memory accounting boundary.',
      activeBlockIds: ['t01-runc', 't01-kernel'],
      activeConnectionIdxs: [3],
      detailExplanation: {
        simpleWords: 'The container process now runs at native bare-metal speed while believing it is on its own private computer.',
        technicalMechanics: 'Linux kernel executes clone() with CLONE_NEWPID|CLONE_NEWNET|CLONE_NEWNS, applies pivot_root to Overlay2 rootfs, and writes PID to /sys/fs/cgroup.',
      },
      dockerTrace: 'lsns -t pid,net,mnt',
    },
  ],
});

// ============================================================================
// TOPIC 02: UNDERLYING LINUX TECHNOLOGIES
// Namespaces, cgroups v1/v2 & Copy-on-Write UnionFS (Overlay2)
// ============================================================================
const TOPIC_02_FLOW = (c: { id: string; title: string }): DockerTopicFlowDiagramData => ({
  topicId: 'topic-02',
  topicNumber: '02',
  topicTitle: 'Underlying Linux Technologies',
  conceptId: c.id,
  conceptTitle: c.title,
  architectureType: 'Linux Kernel Isolation Subsystems & Overlay2 Storage Driver',
  architecturalSummary:
    'Visualizes how the three core Linux pillars—Namespaces (visibility), cgroups (resource limits), and OverlayFS (layered filesystem)—combine to construct containers.',
  subtopics: [
    'Linux Namespaces: PID, NET, MNT, IPC, UTS, USER',
    'Control Groups (cgroups v2): CPU, Memory, IO, PIDs limits',
    'OverlayFS: lowerdir (read-only), upperdir (read-write), merged view',
    'Copy-on-Write (CoW) disk mechanics',
  ],
  blocks: [
    {
      id: 't02-proc',
      label: 'Isolated Container Process',
      sublabel: 'PID 1 inside Namespace',
      category: 'runtime',
      icon: 'box',
      portOrProtocol: 'PID 1 (Namespaced)',
      statusText: 'Executing',
      details: {
        role: 'Target container application binary executing inside isolated kernel context.',
        processName: 'app (PID 1)',
        cliDiagnostic: 'docker top <container_id>',
        configLocation: '/proc/1/ns',
        keyInsight: 'Appears as PID 1 inside the container, but has an ordinary PID (e.g. 42819) on the host.',
      },
    },
    {
      id: 't02-ns',
      label: 'Linux Namespaces (6 Pillars)',
      sublabel: 'PID, NET, MNT, IPC, UTS, USER',
      category: 'kernel',
      icon: 'shield',
      portOrProtocol: 'Kernel Subsystem',
      statusText: 'Visibility Wall',
      details: {
        role: 'Restricts what a process can SEE: its own process list, network interfaces, filesystem mounts, and hostname.',
        processName: 'Kernel Namespaces',
        cliDiagnostic: 'lsns -p $(pgrep -f "docker-container")',
        configLocation: '/proc/<pid>/ns/*',
        keyInsight: 'Two containers on the same host cannot see each other’s processes or network sockets unless explicitly shared.',
      },
    },
    {
      id: 't02-cgroups',
      label: 'cgroups v2 Controller',
      sublabel: 'CPU, Memory & I/O Throttling',
      category: 'kernel',
      icon: 'cpu',
      portOrProtocol: '/sys/fs/cgroup',
      statusText: 'Resource Governor',
      details: {
        role: 'Restricts how much a process can USE: memory.max limits prevent OOM crashing the host; cpu.max throttles CPU cycles.',
        processName: 'systemd cgroup driver',
        cliDiagnostic: 'cat /sys/fs/cgroup/system.slice/docker-*.scope/memory.current',
        configLocation: '/sys/fs/cgroup/docker/',
        keyInsight: 'If a container exceeds memory.max, the kernel OOM Killer immediately terminates it without harming the host.',
      },
    },
    {
      id: 't02-overlay',
      label: 'Overlay2 UnionFS',
      sublabel: 'lowerdir (Image) + upperdir (Writable)',
      category: 'storage',
      icon: 'layers',
      portOrProtocol: 'mount -t overlay',
      statusText: 'Merged Filesystem',
      details: {
        role: 'Combines multiple immutable read-only image layers (lowerdir) with a single thin read-write container layer (upperdir).',
        processName: 'overlay2.ko',
        cliDiagnostic: 'docker inspect <id> --format "{{json .GraphDriver.Data}}"',
        configLocation: '/var/lib/docker/overlay2/<hash>/',
        keyInsight: 'Modifying an existing file triggers Copy-on-Write: file is duplicated to upperdir before being edited.',
      },
    },
    {
      id: 't02-hostfs',
      label: 'Host Physical Storage',
      sublabel: 'NVMe / SSD Host Disk',
      category: 'storage',
      icon: 'hard-drive',
      portOrProtocol: 'ext4 / xfs Block I/O',
      statusText: 'Persistent Media',
      details: {
        role: 'Physical storage blocks backing the Overlay2 directories.',
        processName: 'Kernel VFS',
        cliDiagnostic: 'df -h /var/lib/docker',
        configLocation: '/var/lib/docker',
        keyInsight: 'Direct host disk performance for shared base images via hardlinks and copy-on-write.',
      },
    },
  ],
  connections: [
    { from: 't02-proc', to: 't02-ns', label: 'Process Scoped to NS', protocol: 'Kernel clone(2)', stepNumber: 1 },
    { from: 't02-proc', to: 't02-cgroups', label: 'Resource Accounting', protocol: 'cgroupfs Controller', stepNumber: 2 },
    { from: 't02-proc', to: 't02-overlay', label: 'VFS Path Lookup', protocol: 'Merged Mount View', stepNumber: 3 },
    { from: 't02-overlay', to: 't02-hostfs', label: 'Copy-on-Write Disk I/O', protocol: 'Host Storage Driver', stepNumber: 4 },
  ],
  steps: [
    {
      step: 1,
      title: 'Namespace Isolation Instantiation',
      summary: 'Kernel isolates process trees, network stacks, and mount points.',
      activeBlockIds: ['t02-proc', 't02-ns'],
      activeConnectionIdxs: [0],
      detailExplanation: {
        simpleWords: 'Namespaces act like blinders on a horse: the container only sees its own processes and virtual network card.',
        technicalMechanics: 'The process executes inside independent nsproxy struct with CLONE_NEWPID, CLONE_NEWNET, CLONE_NEWNS, and CLONE_NEWUTS.',
      },
      dockerTrace: 'readlink /proc/$$/ns/net',
    },
    {
      step: 2,
      title: 'cgroups Enforces Resource Quotas',
      summary: 'Kernel monitors memory usage and assigns CPU time slices according to container limits.',
      activeBlockIds: ['t02-proc', 't02-cgroups'],
      activeConnectionIdxs: [1],
      detailExplanation: {
        simpleWords: 'cgroups prevent a runaway script in one container from consuming 100% of your computer RAM and freezing your system.',
        technicalMechanics: 'Kernel CFS (Completely Fair Scheduler) applies cpu.cfs_quota_us against cpu.cfs_period_us and tracks memory.current in cgroup tree.',
      },
      dockerTrace: 'systemd-cgls',
    },
    {
      step: 3,
      title: 'Overlay2 Presents Unified Root Filesystem',
      summary: 'OverlayFS stacks lowerdir image layers under upperdir to present merged view at /.',
      activeBlockIds: ['t02-proc', 't02-overlay'],
      activeConnectionIdxs: [2],
      detailExplanation: {
        simpleWords: 'When the container reads a file, it looks through the stack of image layers seamlessly as if it was one normal hard drive.',
        technicalMechanics: 'VFS looks up inode in upperdir; if missing, falls through to lowerdir stack. Multiple containers share the exact same lowerdir in RAM.',
      },
      dockerTrace: 'mount | grep overlay',
    },
    {
      step: 4,
      title: 'Copy-on-Write Triggered on File Modification',
      summary: 'Modifying an image file copies it to upperdir before writing to physical disk.',
      activeBlockIds: ['t02-overlay', 't02-hostfs'],
      activeConnectionIdxs: [3],
      detailExplanation: {
        simpleWords: 'Base image files never change. The first time you write to an image file, Docker makes a private copy in your container layer.',
        technicalMechanics: 'OverlayFS intercepts write(2), copies file from lowerdir to upperdir, modifies attributes, and writes changes to host disk.',
      },
      dockerTrace: 'docker diff <container_name>',
    },
  ],
});

// ============================================================================
// TOPIC 03: INSTALLATION / SETUP
// Docker Desktop Architecture, WSL2 VM Helper & Linux Native Engine
// ============================================================================
const TOPIC_03_FLOW = (c: { id: string; title: string }): DockerTopicFlowDiagramData => ({
  topicId: 'topic-03',
  topicNumber: '03',
  topicTitle: 'Installation / Setup',
  conceptId: c.id,
  conceptTitle: c.title,
  architectureType: 'Docker Desktop WSL2 / Hyper-V Engine & Linux Native Socket Architecture',
  architecturalSummary:
    'Contrasts how Docker Desktop operates via a lightweight Linux VM (WSL2 on Windows, Apple Virtualization on macOS) versus native Linux systemd socket activation.',
  subtopics: [
    'Windows WSL2 utility VM integration',
    'macOS Apple Virtualization framework & gRPC FUSE',
    'Linux native dockerd systemd service',
    'Docker CLI context switching & socket permissions',
  ],
  blocks: [
    {
      id: 't03-hostos',
      label: 'Host OS (Win / macOS / Linux)',
      sublabel: 'Developer Desktop / Terminal',
      category: 'client',
      icon: 'terminal',
      portOrProtocol: 'Host Environment',
      statusText: 'Host Machine',
      details: {
        role: 'Runs your code editor, terminal, and browser. Sends commands through localhost proxy.',
        processName: 'Docker Desktop UI / CLI',
        cliDiagnostic: 'docker context ls',
        configLocation: '~/.docker/contexts/meta/',
        keyInsight: 'Containers require a Linux kernel; Windows and Mac run a transparent hypervisor VM to provide that kernel.',
      },
    },
    {
      id: 't03-proxy',
      label: 'Virtualization Bridge',
      sublabel: 'WSL2 / HyperKit / Socket Proxy',
      category: 'daemon',
      icon: 'network',
      portOrProtocol: 'Named Pipe / UNIX Socket',
      statusText: 'Bridging Layer',
      details: {
        role: 'Forwards Docker socket communications from host OS into the lightweight Linux VM.',
        processName: 'docker-desktop-proxy',
        cliDiagnostic: 'wsl.exe -l -v',
        configLocation: '%APPDATA%\\Docker\\settings.json',
        keyInsight: 'Translates host filesystem paths to Linux mount paths (e.g. C:\\Users to /mnt/c/Users).',
      },
    },
    {
      id: 't03-vmengine',
      label: 'Linux Engine VM (WSL2 / docker-desktop)',
      sublabel: 'Real Linux Kernel Instance',
      category: 'runtime',
      icon: 'server',
      portOrProtocol: 'systemd / dockerd',
      statusText: 'Linux Host',
      details: {
        role: 'Hosts dockerd, containerd, and active containers with full Linux kernel capabilities.',
        processName: 'dockerd in VM',
        cliDiagnostic: 'docker info --format "{{.OperatingSystem}} {{.KernelVersion}}"',
        configLocation: '/var/lib/docker',
        keyInsight: 'On native Linux, this VM layer does not exist—dockerd runs directly on bare metal!',
      },
    },
    {
      id: 't03-socket',
      label: '/var/run/docker.sock',
      sublabel: 'UNIX Domain Control Socket',
      category: 'security',
      icon: 'shield',
      portOrProtocol: 'UNIX Socket (0660 docker)',
      statusText: 'IPC Gateway',
      details: {
        role: 'Controls Docker engine. Only members of the docker group or root can write to it.',
        processName: 'IPC Socket',
        cliDiagnostic: 'ls -l /var/run/docker.sock',
        configLocation: '/var/run/docker.sock',
        keyInsight: 'Giving a user write access to docker.sock is effectively giving them full root privileges on the host.',
      },
    },
  ],
  connections: [
    { from: 't03-hostos', to: 't03-proxy', label: 'CLI Dispatches Commands', protocol: 'Named Pipe / IPC', stepNumber: 1 },
    { from: 't03-proxy', to: 't03-socket', label: 'Cross-VM Socket Forwarding', protocol: 'UNIX Domain Socket', stepNumber: 2 },
    { from: 't03-socket', to: 't03-vmengine', label: 'dockerd Executes Request', protocol: 'Engine REST API', stepNumber: 3 },
  ],
  steps: [
    {
      step: 1,
      title: 'Host CLI Initiates Connection',
      summary: 'Developer executes docker command in Windows PowerShell, Mac Terminal, or Linux shell.',
      activeBlockIds: ['t03-hostos', 't03-proxy'],
      activeConnectionIdxs: [0],
      detailExplanation: {
        simpleWords: 'You run docker commands on your laptop just like any normal command line utility.',
        technicalMechanics: 'Docker CLI inspects current context (desktop-linux or default) and connects to target named pipe or socket.',
      },
      dockerTrace: 'docker context show',
    },
    {
      step: 2,
      title: 'Bridge Forwards Request to Linux Socket',
      summary: 'Docker Desktop proxy routes traffic into the internal WSL2 or VM socket.',
      activeBlockIds: ['t03-proxy', 't03-socket'],
      activeConnectionIdxs: [1],
      detailExplanation: {
        simpleWords: 'Because Windows/Mac do not natively run Linux containers, the proxy forwards the message into the Linux VM.',
        technicalMechanics: 'High-speed IPC proxy bridges Windows named pipe \\\\.\\pipe\\docker_engine to Linux /var/run/docker.sock.',
      },
      dockerTrace: 'docker version',
    },
    {
      step: 3,
      title: 'Docker Engine Processes Request',
      summary: 'dockerd daemon inside Linux environment invokes containerd to perform container operations.',
      activeBlockIds: ['t03-socket', 't03-vmengine'],
      activeConnectionIdxs: [2],
      detailExplanation: {
        simpleWords: 'The Docker daemon in the Linux environment receives the instruction and creates or manages the container.',
        technicalMechanics: 'Daemon validates security permissions, parses payload, and communicates with containerd over local gRPC socket.',
      },
      dockerTrace: 'docker info',
    },
  ],
});

// ============================================================================
// TOPIC 04: BASICS OF DOCKER
// Container Lifecycle: run, exec, stop (SIGTERM vs SIGKILL), rm
// ============================================================================
const TOPIC_04_FLOW = (c: { id: string; title: string }): DockerTopicFlowDiagramData => ({
  topicId: 'topic-04',
  topicNumber: '04',
  topicTitle: 'Basics of Docker',
  conceptId: c.id,
  conceptTitle: c.title,
  architectureType: 'Container Lifecycle Execution Pipeline & Signal Dispatch',
  architecturalSummary:
    'Traces the complete lifecycle of a container from image pull through runc spawning, interactive exec attachment, graceful SIGTERM shutdown, and filesystem pruning.',
  subtopics: [
    'docker run: image pull, create, and start transition',
    'docker exec: pty allocation & joining existing namespaces (setns)',
    'Graceful shutdown: SIGTERM (exit code 143) vs SIGKILL (timeout 10s)',
    'docker rm: removing container layer and releasing network IP',
  ],
  blocks: [
    {
      id: 't04-client',
      label: 'docker CLI',
      sublabel: 'User Interactive Shell',
      category: 'client',
      icon: 'terminal',
      portOrProtocol: 'TTY / stdio',
      statusText: 'Terminal Session',
      details: {
        role: 'Streams stdin, stdout, and stderr between developer terminal and container process.',
        processName: 'docker',
        cliDiagnostic: 'docker ps',
        configLocation: '~/.docker',
        keyInsight: 'The -it flag allocates a pseudo-TTY and keeps stdin open for interactive debugging.',
      },
    },
    {
      id: 't04-dockerd',
      label: 'Docker Daemon',
      sublabel: 'Lifecycle Orchestrator',
      category: 'daemon',
      icon: 'server',
      portOrProtocol: '/var/run/docker.sock',
      statusText: 'Managing State',
      details: {
        role: 'Coordinates image fetching, assigns container ID, creates network veth pair, and monitors container health.',
        processName: 'dockerd',
        cliDiagnostic: 'docker events --filter "event=start"',
        configLocation: '/var/lib/docker/containers/<id>/',
        keyInsight: 'Stores container metadata, log stream configuration, and restart policy in config.v2.json.',
      },
    },
    {
      id: 't04-shim',
      label: 'containerd-shim-v2',
      sublabel: 'Headless Container Babysitter',
      category: 'runtime',
      icon: 'cpu',
      portOrProtocol: 'UNIX Socket IPC',
      statusText: 'Supervising Process',
      details: {
        role: 'Holds open container file descriptors (stdin/out/err) and exit code so dockerd can restart without killing containers.',
        processName: 'containerd-shim-runc-v2',
        cliDiagnostic: 'pgrep -f "containerd-shim"',
        configLocation: '/run/containerd/io.containerd.runtime.v2.task/moby/<id>/',
        keyInsight: 'Allows daemonless containers: you can restart Docker without interrupting running containers!',
      },
    },
    {
      id: 't04-container',
      label: 'Container Main Process',
      sublabel: 'PID 1 inside Container',
      category: 'runtime',
      icon: 'box',
      portOrProtocol: 'Namespaced Process',
      statusText: 'Running',
      details: {
        role: 'Target container application (e.g. nginx, node, python).',
        processName: 'app / entrypoint',
        cliDiagnostic: 'docker top <container_id>',
        configLocation: '/proc/1',
        keyInsight: 'PID 1 must handle POSIX signals like SIGTERM properly, or container stops will hang for 10s.',
      },
    },
    {
      id: 't04-exec',
      label: 'docker exec Worker',
      sublabel: 'Secondary Injected Process',
      category: 'runtime',
      icon: 'zap',
      portOrProtocol: 'setns(2) Syscall',
      statusText: 'Injected Shell',
      details: {
        role: 'A new process spawned inside an EXISTING container’s namespaces using the setns() system call.',
        processName: '/bin/sh or /bin/bash',
        cliDiagnostic: 'docker exec -it <id> ps aux',
        configLocation: '/proc/<pid>/ns',
        keyInsight: 'exec does NOT create a new container; it merely attaches an extra process into the existing container boundary.',
      },
    },
  ],
  connections: [
    { from: 't04-client', to: 't04-dockerd', label: 'docker run / exec / stop', protocol: 'REST over Socket', stepNumber: 1 },
    { from: 't04-dockerd', to: 't04-shim', label: 'Task Lifecycle Request', protocol: 'containerd gRPC', stepNumber: 2 },
    { from: 't04-shim', to: 't04-container', label: 'spawn / SIGTERM signal', protocol: 'POSIX Signals / IPC', stepNumber: 3 },
    { from: 't04-dockerd', to: 't04-exec', label: 'setns() into container', protocol: 'Kernel setns Syscall', stepNumber: 4 },
  ],
  steps: [
    {
      step: 1,
      title: 'Dispatch Lifecycle Command',
      summary: 'User runs "docker run -d", "docker exec -it", or "docker stop".',
      activeBlockIds: ['t04-client', 't04-dockerd'],
      activeConnectionIdxs: [0],
      detailExplanation: {
        simpleWords: 'You issue a lifecycle command, and Docker prepares the requested action.',
        technicalMechanics: 'CLI submits HTTP request to Docker daemon REST API with execution parameters.',
      },
      dockerTrace: 'docker ps -a',
    },
    {
      step: 2,
      title: 'containerd Shim Creation',
      summary: 'A containerd-shim process is created as a dedicated supervisor for this container.',
      activeBlockIds: ['t04-dockerd', 't04-shim'],
      activeConnectionIdxs: [1],
      detailExplanation: {
        simpleWords: 'The shim acts like an invisible babysitter holding the container output pipes.',
        technicalMechanics: 'containerd spawns containerd-shim-runc-v2, which opens stdio FIFOs and awaits runc execution.',
      },
      dockerTrace: 'pstree -pa $(pgrep containerd)',
    },
    {
      step: 3,
      title: 'Signal Dispatch & Graceful Shutdown (SIGTERM)',
      summary: 'When stopping, Docker sends SIGTERM to PID 1, waits 10s grace period, then falls back to SIGKILL.',
      activeBlockIds: ['t04-shim', 't04-container'],
      activeConnectionIdxs: [2],
      detailExplanation: {
        simpleWords: 'Docker politely asks your app to finish ongoing web requests, close database connections, and exit.',
        technicalMechanics: 'kill -15 (SIGTERM) sent to PID 1. If process does not terminate within --time=10s, kill -9 (SIGKILL) is dispatched.',
      },
      dockerTrace: 'docker stop -t 5 <container_id>',
    },
    {
      step: 4,
      title: 'Interactive Debugging via setns()',
      summary: 'Running docker exec injects a shell process into the container’s existing namespaces.',
      activeBlockIds: ['t04-dockerd', 't04-exec'],
      activeConnectionIdxs: [3],
      detailExplanation: {
        simpleWords: 'docker exec drops you right inside the running container to inspect files and test commands.',
        technicalMechanics: 'The new shell process invokes setns(2) for each namespace FD of PID 1, adopting its network, mount, and PID view.',
      },
      dockerTrace: 'docker exec -it <container_id> sh',
    },
  ],
});

// ============================================================================
// TOPIC 05: DATA PERSISTENCE
// Ephemeral Layers, Managed Volumes (/var/lib/docker/volumes) & Bind Mounts
// ============================================================================
const TOPIC_05_FLOW = (c: { id: string; title: string }): DockerTopicFlowDiagramData => ({
  topicId: 'topic-05',
  topicNumber: '05',
  topicTitle: 'Data Persistence',
  conceptId: c.id,
  conceptTitle: c.title,
  architectureType: 'Docker Storage Persistence Architecture & Mount Namespace Binding',
  architecturalSummary:
    'Visualizes the fundamental contrast between the ephemeral copy-on-write container layer, Docker-managed named volumes, and host-managed bind mounts.',
  subtopics: [
    'Ephemeral upperdir lifecycle (destroyed on docker rm)',
    'Named Volumes: /var/lib/docker/volumes/<name>/_data',
    'Bind Mounts: mapping host paths to container paths',
    'Mount propagation & performance on Windows/macOS',
  ],
  blocks: [
    {
      id: 't05-container',
      label: 'Container Filesystem (VFS)',
      sublabel: 'User Space Mount Tree',
      category: 'runtime',
      icon: 'box',
      portOrProtocol: 'VFS Path: /app /var/lib/db',
      statusText: 'Active Mount',
      details: {
        role: 'The file tree seen by the application running inside the container.',
        processName: 'Mount Namespace',
        cliDiagnostic: 'docker exec <id> df -h',
        configLocation: '/proc/mounts',
        keyInsight: 'Files written to unmounted paths go to the ephemeral layer; files written to volume paths bypass OverlayFS.',
      },
    },
    {
      id: 't05-ephemeral',
      label: 'Ephemeral Container Layer',
      sublabel: 'Overlay2 upperdir (Temporary)',
      category: 'storage',
      icon: 'layers',
      portOrProtocol: 'Copy-on-Write Layer',
      statusText: 'Volatile',
      details: {
        role: 'Holds temporary changes made during container execution. Destroyed when container is removed.',
        processName: 'Overlay2 Upper Layer',
        cliDiagnostic: 'docker diff <container_id>',
        configLocation: '/var/lib/docker/overlay2/<id>-upper',
        keyInsight: 'Writing databases directly to the ephemeral layer causes performance degradation and data loss on container recreation.',
      },
    },
    {
      id: 't05-volume',
      label: 'Docker Named Volume',
      sublabel: 'Managed Host Persistence',
      category: 'storage',
      icon: 'database',
      portOrProtocol: '/var/lib/docker/volumes/',
      statusText: 'Persistent Store',
      details: {
        role: 'Isolated directory on host managed by Docker daemon. Outlives any single container.',
        processName: 'Docker Volume Driver',
        cliDiagnostic: 'docker volume ls && docker volume inspect <name>',
        configLocation: '/var/lib/docker/volumes/<name>/_data',
        keyInsight: 'Best practice for production databases (Postgres, MySQL, Mongo) due to native disk write speeds.',
      },
    },
    {
      id: 't05-bind',
      label: 'Host Bind Mount',
      sublabel: 'Developer Source Folder',
      category: 'storage',
      icon: 'hard-drive',
      portOrProtocol: 'Host Path: $(pwd):/app',
      statusText: 'Direct Host Link',
      details: {
        role: 'Directly maps a directory on the developer’s host machine into the container filesystem.',
        processName: 'Kernel Bind Mount',
        cliDiagnostic: 'docker inspect <id> --format "{{json .Mounts}}"',
        configLocation: 'c:\\project or /home/user/project',
        keyInsight: 'Ideal for local development: changes made in VS Code immediately reflect inside the container without rebuilding images.',
      },
    },
  ],
  connections: [
    { from: 't05-container', to: 't05-ephemeral', label: 'Standard File Writes', protocol: 'OverlayFS CoW', stepNumber: 1 },
    { from: 't05-container', to: 't05-volume', label: 'Database / Persistent Writes', protocol: 'Direct VFS Bind', stepNumber: 2 },
    { from: 't05-container', to: 't05-bind', label: 'Source Code / Config Sync', protocol: 'Host Directory Bind', stepNumber: 3 },
  ],
  steps: [
    {
      step: 1,
      title: 'Ephemeral Layer Intercepts General Writes',
      summary: 'Writes to normal container paths are trapped in the thin writable Overlay2 layer.',
      activeBlockIds: ['t05-container', 't05-ephemeral'],
      activeConnectionIdxs: [0],
      detailExplanation: {
        simpleWords: 'If you create a temporary log file inside the container, it lives in this temporary layer.',
        technicalMechanics: 'Kernel OverlayFS writes delta blocks to upperdir. When "docker rm" is called, the entire upperdir directory is wiped.',
      },
      dockerTrace: 'docker diff <container_id>',
    },
    {
      step: 2,
      title: 'Named Volume Bypasses Storage Driver',
      summary: 'Volume mounts connect directly to /var/lib/docker/volumes/<name>/_data with native disk performance.',
      activeBlockIds: ['t05-container', 't05-volume'],
      activeConnectionIdxs: [1],
      detailExplanation: {
        simpleWords: 'Your database data is stored safely on the host hard drive, completely protected from container restarts or deletion.',
        technicalMechanics: 'Linux kernel attaches host directory directly into container mount namespace via mount --bind, achieving 100% native NVMe I/O.',
      },
      dockerTrace: 'docker volume inspect my-db-data',
    },
    {
      step: 3,
      title: 'Bind Mount Bridges Host Code Directly',
      summary: 'Editing code in your IDE on the host immediately triggers hot reloading inside the container.',
      activeBlockIds: ['t05-container', 't05-bind'],
      activeConnectionIdxs: [2],
      detailExplanation: {
        simpleWords: 'You edit a file in VS Code on your laptop, and the container sees the new code instantly without restarting.',
        technicalMechanics: 'Mount namespace binds host project directory. inotify events propagate across the mount to notify file watchers like nodemon or vite.',
      },
      dockerTrace: 'docker run -v $(pwd):/app -w /app node:20 npm start',
    },
  ],
});

// ============================================================================
// TOPIC 06: USING 3RD PARTY CONTAINER IMAGES
// Official Registries, Environment Variables & Disposable CLI Containers
// ============================================================================
const TOPIC_06_FLOW = (c: { id: string; title: string }): DockerTopicFlowDiagramData => ({
  topicId: 'topic-06',
  topicNumber: '06',
  topicTitle: 'Using 3rd Party Container Images',
  conceptId: c.id,
  conceptTitle: c.title,
  architectureType: 'Off-the-Shelf Image Deployment & Configuration Injection Pipeline',
  architecturalSummary:
    'Demonstrates pulling verified official database and utility images from Docker Hub, configuring them via environment variables, and running disposable (--rm) diagnostic tasks.',
  subtopics: [
    'Docker Official Images program and security vetting',
    'Configuring containers via environment variables (-e / --env-file)',
    'Disposable diagnostic containers (docker run --rm -it alpine)',
    'Multi-tier database & cache orchestration',
  ],
  blocks: [
    {
      id: 't06-hub',
      label: 'Docker Hub Official Images',
      sublabel: 'postgres, redis, nginx, alpine',
      category: 'registry',
      icon: 'cloud',
      portOrProtocol: 'HTTPS / Registry v2',
      statusText: 'Verified Artifacts',
      details: {
        role: 'Provides cryptographically signed, vulnerability-scanned base and service images maintained by upstream open source teams.',
        processName: 'Docker Hub Registry',
        cliDiagnostic: 'docker pull postgres:16-alpine',
        configLocation: 'https://hub.docker.com/_/postgres',
        keyInsight: 'Official images follow security standards: minimal attack surface, non-root users, and standardized env vars.',
      },
    },
    {
      id: 't06-dockerd',
      label: 'Docker Daemon (Local Engine)',
      sublabel: 'Layer Cache & Env Injector',
      category: 'daemon',
      icon: 'server',
      portOrProtocol: '/var/run/docker.sock',
      statusText: 'Provisioning',
      details: {
        role: 'Pulls missing layers, injects runtime environment variables, creates persistent storage mounts, and publishes ports.',
        processName: 'dockerd',
        cliDiagnostic: 'docker inspect <id> --format "{{json .Config.Env}}"',
        configLocation: '/var/lib/docker/image/overlay2',
        keyInsight: 'Environment variables passed via -e POSTGRES_PASSWORD=secret are populated into /proc/1/environ before app start.',
      },
    },
    {
      id: 't06-db',
      label: 'Running Service (e.g. Postgres)',
      sublabel: 'Production-ready Database Container',
      category: 'runtime',
      icon: 'database',
      portOrProtocol: 'TCP :5432 Published',
      statusText: 'Listening',
      details: {
        role: 'Executes official entrypoint script (docker-entrypoint.sh), initializes database cluster, and accepts SQL queries.',
        processName: 'postgres:16',
        cliDiagnostic: 'docker logs <db_container_id>',
        configLocation: '/var/lib/postgresql/data',
        keyInsight: 'Official database images execute initialization scripts placed in /docker-entrypoint-initdb.d/ automatically on first boot.',
      },
    },
    {
      id: 't06-cli',
      label: 'Disposable CLI Container (--rm)',
      sublabel: 'One-off Diagnostic Tool (curl / psql)',
      category: 'client',
      icon: 'terminal',
      portOrProtocol: 'Internal Network Socket',
      statusText: 'Temporary Task',
      details: {
        role: 'Runs a quick query or network healthcheck against the database and automatically vanishes upon exit.',
        processName: 'alpine / psql',
        cliDiagnostic: 'docker run --rm -it alpine ping -c 3 postgres',
        configLocation: 'RAM / Tempfs',
        keyInsight: 'The --rm flag guarantees zero disk litter: container metadata, writable layer, and network endpoint are deleted immediately on exit.',
      },
    },
  ],
  connections: [
    { from: 't06-hub', to: 't06-dockerd', label: 'Pull Image Layers & Manifest', protocol: 'HTTPS / TLS 1.3', stepNumber: 1 },
    { from: 't06-dockerd', to: 't06-db', label: 'Inject Env & Mount Volume', protocol: 'Container Creation', stepNumber: 2 },
    { from: 't06-cli', to: 't06-db', label: 'Diagnostic Query / SQL Ping', protocol: 'Internal TCP Connection', stepNumber: 3 },
  ],
  steps: [
    {
      step: 1,
      title: 'Pull Verified Image Layers',
      summary: 'Docker downloads compressed image layers from Docker Hub registry with cryptographic digest verification.',
      activeBlockIds: ['t06-hub', 't06-dockerd'],
      activeConnectionIdxs: [0],
      detailExplanation: {
        simpleWords: 'Docker downloads official PostgreSQL or Redis without requiring you to compile or install database software on your laptop.',
        technicalMechanics: 'Daemon queries GET /v2/library/postgres/manifests/16-alpine, verifies sha256 checksums, and unpackages tar layers in parallel.',
      },
      dockerTrace: 'docker pull postgres:16-alpine',
    },
    {
      step: 2,
      title: 'Inject Environment Variables & Volume Mount',
      summary: 'Daemon launches database container, injecting credentials and binding persistent host storage.',
      activeBlockIds: ['t06-dockerd', 't06-db'],
      activeConnectionIdxs: [1],
      detailExplanation: {
        simpleWords: 'You set the database password with "-e POSTGRES_PASSWORD=secret" and attach a volume to keep your tables safe.',
        technicalMechanics: 'docker-entrypoint.sh reads POSTGRES_PASSWORD, runs initdb, configures pg_hba.conf, and starts postgres server.',
      },
      dockerTrace: 'docker run -d --name my-db -e POSTGRES_PASSWORD=secret -v pgdata:/var/lib/postgresql/data -p 5432:5432 postgres:16-alpine',
    },
    {
      step: 3,
      title: 'Disposable Diagnostic Testing (--rm)',
      summary: 'A short-lived client container tests the service and cleans itself up cleanly.',
      activeBlockIds: ['t06-cli', 't06-db'],
      activeConnectionIdxs: [2],
      detailExplanation: {
        simpleWords: 'You run a quick command to test if the database is healthy. When the command finishes, the test container vanishes cleanly.',
        technicalMechanics: 'Container runs with AutoRemove=true. containerd terminates the task and dockerd cleans up all namespace and layer references.',
      },
      dockerTrace: 'docker run --rm postgres:16-alpine pg_isready -h host.docker.internal -p 5432',
    },
  ],
});

// ============================================================================
// TOPIC 07: BUILDING CONTAINER IMAGES
// Dockerfile Instructions, BuildKit Directed Acyclic Graph (DAG) & Layer Caching
// ============================================================================
const TOPIC_07_FLOW = (c: { id: string; title: string }): DockerTopicFlowDiagramData => ({
  topicId: 'topic-07',
  topicNumber: '07',
  topicTitle: 'Building Container Images',
  conceptId: c.id,
  conceptTitle: c.title,
  architectureType: 'BuildKit Compilation DAG, Content-Addressable Caching & Multi-Stage Pipeline',
  architecturalSummary:
    'Details how Docker BuildKit parses declarative Dockerfile instructions into a Directed Acyclic Graph (DAG), executes build stages concurrently, and utilizes content hashes for instant cache hits.',
  subtopics: [
    'Dockerfile instructions: FROM, WORKDIR, COPY, RUN, EXPOSE, CMD vs ENTRYPOINT',
    'BuildKit DAG optimization & concurrent stage execution',
    'Layer cache invalidation: package.json vs source code ordering',
    'Multi-stage builds: build environment vs lean production runtime',
  ],
  blocks: [
    {
      id: 't07-dockerfile',
      label: 'Dockerfile Recipe',
      sublabel: 'Declarative Build Manifest',
      category: 'client',
      icon: 'terminal',
      portOrProtocol: 'Text Spec',
      statusText: 'Source Manifest',
      details: {
        role: 'Specifies base image, dependencies, environment variables, build steps, and container default command.',
        processName: 'Dockerfile',
        cliDiagnostic: 'docker build -t my-app:latest .',
        configLocation: './Dockerfile',
        keyInsight: 'Order instructions from least frequently changed (OS packages) to most frequently changed (source code) for optimal caching.',
      },
    },
    {
      id: 't07-buildkit',
      label: 'BuildKit Engine (buildx)',
      sublabel: 'High-Performance Build Daemon',
      category: 'daemon',
      icon: 'cpu',
      portOrProtocol: 'gRPC / moby.buildkit.v1',
      statusText: 'Compiling DAG',
      details: {
        role: 'Parses Dockerfile into Low-Level Intermediate Representation (LLB), optimizes graph, and runs independent build stages concurrently.',
        processName: 'buildkitd',
        cliDiagnostic: 'docker buildx ls',
        configLocation: '/var/lib/docker/buildkit',
        keyInsight: 'BuildKit skips unused build stages entirely and parallelizes stages that do not depend on each other.',
      },
    },
    {
      id: 't07-cache',
      label: 'Content-Addressable Cache',
      sublabel: 'sha256 Layer Checksums',
      category: 'storage',
      icon: 'layers',
      portOrProtocol: 'Local Storage / Registry Cache',
      statusText: 'Cache Evaluator',
      details: {
        role: 'Compares checksum of files and command strings against existing layers to reuse built artifacts in 0.1s.',
        processName: 'BuildKit Cache Importer',
        cliDiagnostic: 'docker buildx du',
        configLocation: '/var/lib/docker/buildkit/cache',
        keyInsight: 'If package.json has not changed, "RUN npm install" hits cache immediately and finishes in milliseconds.',
      },
    },
    {
      id: 't07-stage1',
      label: 'Builder Stage (Heavyweight)',
      sublabel: 'Node / Go / Rust SDK + Build Tools',
      category: 'runtime',
      icon: 'box',
      portOrProtocol: 'Stage: "AS builder"',
      statusText: 'Compiling App',
      details: {
        role: 'Compiles TypeScript, minifies bundles, or builds Go binaries. Contains compilers and devDependencies.',
        processName: 'npm run build',
        cliDiagnostic: 'docker build --target builder -t my-app:builder .',
        configLocation: '/app/dist',
        keyInsight: 'This stage is completely discarded from the final image, saving hundreds of megabytes.',
      },
    },
    {
      id: 't07-stage2',
      label: 'Production Stage (Distroless / Alpine)',
      sublabel: 'Ultra-lean 15MB Final Artifact',
      category: 'runtime',
      icon: 'shield',
      portOrProtocol: 'Target Image Output',
      statusText: 'Final Image',
      details: {
        role: 'Contains ONLY the compiled binary/artifacts copied from the builder stage and zero build tools.',
        processName: 'distroless / alpine',
        cliDiagnostic: 'docker images my-app:latest',
        configLocation: '/var/lib/docker/overlay2',
        keyInsight: 'Dropping build tools from production images drastically shrinks CVE vulnerability surface and speeds up deployment rollouts.',
      },
    },
  ],
  connections: [
    { from: 't07-dockerfile', to: 't07-buildkit', label: 'Parse AST into LLB Graph', protocol: 'gRPC / LLB Spec', stepNumber: 1 },
    { from: 't07-buildkit', to: 't07-cache', label: 'Checksum Layer Hash Check', protocol: 'Content Hash Lookup', stepNumber: 2 },
    { from: 't07-buildkit', to: 't07-stage1', label: 'Execute Compilation Stage', protocol: 'Snapshotter Mount', stepNumber: 3 },
    { from: 't07-stage1', to: 't07-stage2', label: 'COPY --from=builder /app/dist', protocol: 'Inter-Stage Layer Copy', stepNumber: 4 },
  ],
  steps: [
    {
      step: 1,
      title: 'BuildKit Compiles Dockerfile into LLB DAG',
      summary: 'BuildKit reads the Dockerfile and compiles it into a Directed Acyclic Graph of independent tasks.',
      activeBlockIds: ['t07-dockerfile', 't07-buildkit'],
      activeConnectionIdxs: [0],
      detailExplanation: {
        simpleWords: 'BuildKit reads your recipe and figures out which steps can be done at the exact same time to save time.',
        technicalMechanics: 'The frontend translates Dockerfile syntax into protobuf Low-Level Builder (LLB) instructions with explicit input/output edges.',
      },
      dockerTrace: 'DOCKER_BUILDKIT=1 docker build -t app:v1 .',
    },
    {
      step: 2,
      title: 'Content-Addressable Cache Evaluation',
      summary: 'BuildKit computes sha256 checksums of COPY source files and command strings.',
      activeBlockIds: ['t07-buildkit', 't07-cache'],
      activeConnectionIdxs: [1],
      detailExplanation: {
        simpleWords: 'If you did not touch your package.json, Docker does not waste time reinstalling your dependencies.',
        technicalMechanics: 'BuildKit evaluates checksum of files matching glob in build context. On cache hit, step is marked CACHED with zero execution time.',
      },
      dockerTrace: 'docker image history app:v1',
    },
    {
      step: 3,
      title: 'Builder Stage Compiles Application Artifacts',
      summary: 'Heavyweight compiler tools build the application inside an isolated temporary stage.',
      activeBlockIds: ['t07-buildkit', 't07-stage1'],
      activeConnectionIdxs: [2],
      detailExplanation: {
        simpleWords: 'The builder container runs compilers (like gcc, go, or npm) to produce the final executable.',
        technicalMechanics: 'BuildKit executes commands inside isolated runc containers mounting layer snapshots as overlay rootfs.',
      },
      dockerTrace: 'docker build --progress=plain .',
    },
    {
      step: 4,
      title: 'Multi-Stage Transfer: Extract Lean Artifacts',
      summary: 'Production stage copies only the built binary from builder, discarding all compiler bloat.',
      activeBlockIds: ['t07-stage1', 't07-stage2'],
      activeConnectionIdxs: [3],
      detailExplanation: {
        simpleWords: 'Instead of shipping a 1GB image filled with build tools, you ship a 20MB image with just your compiled app.',
        technicalMechanics: 'COPY --from=builder extracts target directory into minimal base (scratch or alpine) and commits final OCI image manifest.',
      },
      dockerTrace: 'docker history app:v1 --no-trunc',
    },
  ],
});

// ============================================================================
// TOPIC 08: CONTAINER REGISTRIES
// OCI Image Distribution, Tagging Best Practices & Private Cloud Registries
// ============================================================================
const TOPIC_08_FLOW = (c: { id: string; title: string }): DockerTopicFlowDiagramData => ({
  topicId: 'topic-08',
  topicNumber: '08',
  topicTitle: 'Container Registries',
  conceptId: c.id,
  conceptTitle: c.title,
  architectureType: 'OCI Image Distribution Specification & Content-Addressable Blob Storage',
  architecturalSummary:
    'Illustrates the OCI registry protocol: how image manifests, config JSON, and gzip/zstd layer blobs are pushed, pulled, tagged, and authenticated across cloud registries.',
  subtopics: [
    'OCI Distribution Spec: manifests, config, and layer blobs',
    'Semantic versioning vs Git SHA tags vs :latest anti-pattern',
    'Docker Hub authentication (docker login) & personal access tokens',
    'Enterprise registries: AWS ECR, GitHub Container Registry (GHCR), Azure ACR',
  ],
  blocks: [
    {
      id: 't08-client',
      label: 'Developer / CI Pipeline',
      sublabel: 'docker push / pull',
      category: 'client',
      icon: 'terminal',
      portOrProtocol: 'HTTPS / TLS 1.3',
      statusText: 'Client',
      details: {
        role: 'Authenticates with bearer tokens and pushes built images or pulls deployments.',
        processName: 'docker push ghcr.io/org/app:v1.2.0',
        cliDiagnostic: 'docker login ghcr.io -u <user> --password-stdin',
        configLocation: '~/.docker/config.json',
        keyInsight: 'Stores base64 encoded auth tokens or references credential helpers (osxkeychain, pass, wincred).',
      },
    },
    {
      id: 't08-regauth',
      label: 'Registry Auth Service',
      sublabel: 'Token Exchange Gateway',
      category: 'security',
      icon: 'shield',
      portOrProtocol: 'OAuth2 / Bearer Token',
      statusText: 'Authenticator',
      details: {
        role: 'Challenges incoming client with HTTP 401 Unauthorized, validates credentials, and issues scoped JWT bearer token.',
        processName: 'Auth Token Service',
        cliDiagnostic: 'curl -I https://registry-1.docker.io/v2/',
        configLocation: 'https://auth.docker.io/token',
        keyInsight: 'Tokens encode repository-specific pull/push scopes with strict expiration timestamps.',
      },
    },
    {
      id: 't08-manifest',
      label: 'OCI Manifest Store',
      sublabel: 'application/vnd.oci.image.manifest.v1+json',
      category: 'registry',
      icon: 'server',
      portOrProtocol: '/v2/<name>/manifests/<tag>',
      statusText: 'Manifest Store',
      details: {
        role: 'Maps human-readable image tags (e.g. v1.2.0) to immutable sha256 config and layer blob digests.',
        processName: 'OCI Manifest Engine',
        cliDiagnostic: 'docker manifest inspect nginx:alpine',
        configLocation: '/v2/<name>/manifests/',
        keyInsight: 'Tags are mutable pointers; sha256 digests (e.g. @sha256:abc...) are 100% immutable and tamper-proof.',
      },
    },
    {
      id: 't08-blobstore',
      label: 'Content-Addressable Blob Storage',
      sublabel: 'S3 / GCS / Cloud Object Storage',
      category: 'storage',
      icon: 'cloud',
      portOrProtocol: '/v2/<name>/blobs/sha256:<hash>',
      statusText: 'Layer Blobs',
      details: {
        role: 'Stores compressed tar filesystem layers deduplicated across all repositories in the registry.',
        processName: 'S3 / Cloud Storage Bucket',
        cliDiagnostic: 'docker pull --quiet nginx:alpine',
        configLocation: 's3://docker-registry-blobs/',
        keyInsight: 'If 50 different microservices use node:20-alpine base layer, the registry stores that layer blob only once!',
      },
    },
  ],
  connections: [
    { from: 't08-client', to: 't08-regauth', label: '1. Request Scope Bearer Token', protocol: 'HTTPS / OAuth2', stepNumber: 1 },
    { from: 't08-client', to: 't08-manifest', label: '2. Check / Push Manifest JSON', protocol: 'OCI Distribution v2', stepNumber: 2 },
    { from: 't08-client', to: 't08-blobstore', label: '3. Stream Missing Layer Blobs', protocol: 'HTTPS / Parallel Streaming', stepNumber: 3 },
  ],
  steps: [
    {
      step: 1,
      title: 'Client Authenticates with Token Service',
      summary: 'Client negotiates JWT token authorizing push or pull against specific repository.',
      activeBlockIds: ['t08-client', 't08-regauth'],
      activeConnectionIdxs: [0],
      detailExplanation: {
        simpleWords: 'Docker checks your login credentials and gets a digital passport to access your repository.',
        technicalMechanics: 'Client receives Www-Authenticate header, requests JWT token from token service, and attaches Authorization: Bearer <token>.',
      },
      dockerTrace: 'cat ~/.docker/config.json',
    },
    {
      step: 2,
      title: 'Inspect OCI Image Manifest',
      summary: 'Client checks which layer digests already exist in the registry blob store.',
      activeBlockIds: ['t08-client', 't08-manifest'],
      activeConnectionIdxs: [1],
      detailExplanation: {
        simpleWords: 'Docker sends a list of file layer fingerprints to see what the registry already has.',
        technicalMechanics: 'Client issues HEAD requests against /v2/<name>/blobs/<digest>. Existing blobs return 200 OK and are skipped.',
      },
      dockerTrace: 'docker inspect --format="{{index .RepoDigests 0}}" <image>',
    },
    {
      step: 3,
      title: 'Stream Compressed Layer Blobs',
      summary: 'Only newly modified filesystem layers are uploaded or downloaded in parallel streams.',
      activeBlockIds: ['t08-client', 't08-blobstore'],
      activeConnectionIdxs: [2],
      detailExplanation: {
        simpleWords: 'Only the parts of your app that actually changed are transferred over the internet, saving massive bandwidth.',
        technicalMechanics: 'Parallel HTTP POST /v2/<name>/blobs/uploads/ streams tar.gz chunks with Content-Range and verifies final sha256 checksums.',
      },
      dockerTrace: 'docker push ghcr.io/org/app:v1.2.0',
    },
  ],
});

// ============================================================================
// TOPIC 09: RUNTIME CONFIGURATION & DOCKER COMPOSE
// Port Publishing, Restart Policies & Multi-Container Service Linking
// ============================================================================
const TOPIC_09_FLOW = (c: { id: string; title: string }): DockerTopicFlowDiagramData => ({
  topicId: 'topic-09',
  topicNumber: '09',
  topicTitle: 'Runtime Configuration & Compose',
  conceptId: c.id,
  conceptTitle: c.title,
  architectureType: 'Docker Compose v2 Multi-Service Topology & Network Orchestration',
  architecturalSummary:
    'Traces how Docker Compose parses compose.yaml, instantiates isolated project bridge networks, provisions dependent services with healthchecks, and mounts volumes.',
  subtopics: [
    'compose.yaml specification: services, networks, volumes, secrets',
    'Service dependency graphs (depends_on with condition: service_healthy)',
    'Automatic DNS discovery: contacting "db:5432" without hardcoded IPs',
    'Restart policies: no, on-failure, unless-stopped, always',
  ],
  blocks: [
    {
      id: 't09-compose',
      label: 'Docker Compose CLI',
      sublabel: 'compose.yaml Parser & Engine',
      category: 'compose',
      icon: 'layers',
      portOrProtocol: 'Compose v2 Go Engine',
      statusText: 'Orchestrating',
      details: {
        role: 'Builds dependency topological sort, creates custom bridge network, and spins up services in order.',
        processName: 'docker compose up -d',
        cliDiagnostic: 'docker compose config',
        configLocation: './compose.yaml',
        keyInsight: 'Compose v2 is written in Go and fully embedded directly inside the standard "docker" CLI binary.',
      },
    },
    {
      id: 't09-net',
      label: 'Project Bridge Network',
      sublabel: 'myapp_default (172.28.0.0/16)',
      category: 'network',
      icon: 'network',
      portOrProtocol: 'Embedded DNS :127.0.0.11',
      statusText: 'Isolated Subnet',
      details: {
        role: 'Private software bridge switch. Resolves container service names to private internal container IPs automatically.',
        processName: 'docker network driver',
        cliDiagnostic: 'docker network inspect myapp_default',
        configLocation: '/var/lib/docker/network/files/local-kv.db',
        keyInsight: 'Unlike the default bridge network, user-defined Compose networks provide automatic container name DNS resolution.',
      },
    },
    {
      id: 't09-web',
      label: 'Web Application Service',
      sublabel: 'Node / React / Python (Ports: 8080:80)',
      category: 'runtime',
      icon: 'box',
      portOrProtocol: 'Published Port 8080:80',
      statusText: 'Frontend Service',
      details: {
        role: 'Processes incoming user traffic from host port 8080 and queries the backend database.',
        processName: 'node server.js',
        cliDiagnostic: 'docker compose ps',
        configLocation: 'compose.yaml -> services.web',
        keyInsight: 'Can connect to PostgreSQL simply using host string "db" instead of hardcoding any IP address.',
      },
    },
    {
      id: 't09-db',
      label: 'Database Service',
      sublabel: 'PostgreSQL 16 (Internal: 5432)',
      category: 'runtime',
      icon: 'database',
      portOrProtocol: 'Internal Port 5432 (Unpublished)',
      statusText: 'Healthy',
      details: {
        role: 'Persists application data. Shielded from the public internet with no exposed host ports.',
        processName: 'postgres',
        cliDiagnostic: 'docker compose exec db pg_isready',
        configLocation: 'compose.yaml -> services.db',
        keyInsight: 'Omitting the "ports" block keeps the database safe from external host network port scanning.',
      },
    },
  ],
  connections: [
    { from: 't09-compose', to: 't09-net', label: '1. Create Isolated Bridge Network', protocol: 'Bridge Netlink API', stepNumber: 1 },
    { from: 't09-compose', to: 't09-db', label: '2. Boot Database & Wait Healthy', protocol: 'Healthcheck Polling', stepNumber: 2 },
    { from: 't09-compose', to: 't09-web', label: '3. Boot Web Service & Map Port', protocol: 'Container Creation', stepNumber: 3 },
    { from: 't09-web', to: 't09-db', label: '4. Inter-Service Traffic via DNS', protocol: 'TCP 5432 (DNS: "db")', stepNumber: 4 },
  ],
  steps: [
    {
      step: 1,
      title: 'Provision Dedicated Project Network',
      summary: 'Compose creates a private user-defined bridge network for the stack.',
      activeBlockIds: ['t09-compose', 't09-net'],
      activeConnectionIdxs: [0],
      detailExplanation: {
        simpleWords: 'Docker Compose sets up a private virtual WiFi network so your containers can talk to each other safely.',
        technicalMechanics: 'Daemon provisions Linux bridge device and configures iptables isolation chains for the project subnet.',
      },
      dockerTrace: 'docker network ls',
    },
    {
      step: 2,
      title: 'Initialize Dependent Database & Evaluate Health',
      summary: 'The database container starts first and runs healthcheck before dependent apps boot.',
      activeBlockIds: ['t09-compose', 't09-db'],
      activeConnectionIdxs: [1],
      detailExplanation: {
        simpleWords: 'Compose waits until PostgreSQL is 100% ready before starting your web app, preventing startup crash loops.',
        technicalMechanics: 'Compose monitors health status until pg_isready returns exit code 0 matching "condition: service_healthy".',
      },
      dockerTrace: 'docker compose ps',
    },
    {
      step: 3,
      title: 'Start Web Service & Bind Host Ports',
      summary: 'Web app boots, connects to project network, and binds host port 8080 to container port 80.',
      activeBlockIds: ['t09-compose', 't09-web'],
      activeConnectionIdxs: [2],
      detailExplanation: {
        simpleWords: 'Your web app starts up and opens port 8080 so you can open it in your laptop browser.',
        technicalMechanics: 'docker-proxy process binds 0.0.0.0:8080 and writes iptables DNAT rule forwarding traffic to container IP:80.',
      },
      dockerTrace: 'curl -I http://localhost:8080',
    },
    {
      step: 4,
      title: 'Internal DNS Resolves Service Names',
      summary: 'Web app connects to database by service name "db" using Docker’s embedded DNS server.',
      activeBlockIds: ['t09-web', 't09-db'],
      activeConnectionIdxs: [3],
      detailExplanation: {
        simpleWords: 'Your app talks to the database using the name "db" just like a website name on the internet.',
        technicalMechanics: 'Embedded DNS daemon on 127.0.0.11 intercepts query for "db" and returns container IP (e.g. 172.28.0.2).',
      },
      dockerTrace: 'docker compose logs -f web',
    },
  ],
});

// ============================================================================
// TOPIC 10: RUNNING & MANAGING CONTAINERS
// Container Logs, stdout/stderr Interception, Metrics & Inspect JSON
// ============================================================================
const TOPIC_10_FLOW = (c: { id: string; title: string }): DockerTopicFlowDiagramData => ({
  topicId: 'topic-10',
  topicNumber: '10',
  topicTitle: 'Running & Managing Containers',
  conceptId: c.id,
  conceptTitle: c.title,
  architectureType: 'Container Observability Pipeline, Logging Drivers & Live Metrics',
  architecturalSummary:
    'Visualizes how Docker captures process stdout and stderr streams via non-blocking logging rings (json-file, local, journald) and extracts live cgroup performance metrics.',
  subtopics: [
    'stdout/stderr multiplexed streams (header bytes: 1=stdout, 2=stderr)',
    'Logging drivers: json-file, local (with max-size rotation), syslog, fluentd',
    'Real-time metrics: docker stats (CPU%, Mem usage, Net I/O, Block I/O)',
    'Deep diagnostic inspection: docker inspect JSON parsing with Go templates',
  ],
  blocks: [
    {
      id: 't10-app',
      label: 'Container App (stdout / stderr)',
      sublabel: 'File Descriptors 1 & 2',
      category: 'runtime',
      icon: 'box',
      portOrProtocol: 'POSIX Stdio Pipes',
      statusText: 'Emitting Logs',
      details: {
        role: 'Application logs directly to standard output and standard error instead of writing to log files.',
        processName: 'app process',
        cliDiagnostic: 'docker logs --tail 20 -f <container_id>',
        configLocation: '/proc/1/fd/1',
        keyInsight: 'The Twelve-Factor App methodology mandates treating logs as event streams piped to stdout.',
      },
    },
    {
      id: 't10-driver',
      label: 'Docker Logging Driver',
      sublabel: 'local / json-file Ring Buffer',
      category: 'daemon',
      icon: 'server',
      portOrProtocol: 'Circular Buffer Disk Log',
      statusText: 'Multiplexing',
      details: {
        role: 'Reads stdio pipes, timestamps entries, attaches stream headers, and writes rotating log chunks to disk.',
        processName: 'dockerd log multiplexer',
        cliDiagnostic: 'cat /var/lib/docker/containers/<id>/<id>-json.log',
        configLocation: '/etc/docker/daemon.json ("log-driver": "local")',
        keyInsight: 'Using "local" or "json-file" with max-size=50m prevents containers from filling up your entire host hard drive with logs.',
      },
    },
    {
      id: 't10-cgroupstats',
      label: 'Kernel cgroup Accounting',
      sublabel: 'cpu.stat, memory.current, io.stat',
      category: 'kernel',
      icon: 'activity',
      portOrProtocol: '/sys/fs/cgroup',
      statusText: 'Real-time Metrics',
      details: {
        role: 'Kernel continuously computes nanoseconds of CPU consumed, RAM bytes, and network packets.',
        processName: 'Kernel cgroup subsys',
        cliDiagnostic: 'docker stats --no-stream',
        configLocation: '/sys/fs/cgroup/docker/<id>/',
        keyInsight: 'docker stats reads these kernel counters with near-zero performance overhead.',
      },
    },
    {
      id: 't10-inspect',
      label: 'State Engine (docker inspect)',
      sublabel: 'Low-level Metadata JSON Store',
      category: 'client',
      icon: 'terminal',
      portOrProtocol: 'REST /containers/<id>/json',
      statusText: 'Query Interface',
      details: {
        role: 'Exposes full container configuration, network IP, mount states, exit codes, and healthcheck history.',
        processName: 'docker inspect',
        cliDiagnostic: 'docker inspect <id> --format "{{.State.Status}} (Exit: {{.State.ExitCode}})"',
        configLocation: '/var/lib/docker/containers/<id>/config.v2.json',
        keyInsight: 'The gold standard for debugging container crashes, IP address queries, and mount verification.',
      },
    },
  ],
  connections: [
    { from: 't10-app', to: 't10-driver', label: '1. Pipe stdout/stderr Streams', protocol: 'UNIX Anonymous Pipe', stepNumber: 1 },
    { from: 't10-cgroupstats', to: 't10-inspect', label: '2. Poll Resource Counters', protocol: 'cgroupfs Read', stepNumber: 2 },
    { from: 't10-driver', to: 't10-inspect', label: '3. Stream Formatted Log JSON', protocol: 'Docker Engine API', stepNumber: 3 },
  ],
  steps: [
    {
      step: 1,
      title: 'Capture stdout and stderr Streams',
      summary: 'Docker daemon reads output pipes from the container process and prepends 8-byte stream headers.',
      activeBlockIds: ['t10-app', 't10-driver'],
      activeConnectionIdxs: [0],
      detailExplanation: {
        simpleWords: 'Whatever your program prints with console.log() or print() is captured by Docker automatically.',
        technicalMechanics: 'dockerd reads from FIFO pipes, adds 8-byte multiplex header (identifying stdout vs stderr), and records microsecond timestamp.',
      },
      dockerTrace: 'docker logs -t <container_id>',
    },
    {
      step: 2,
      title: 'Poll Real-Time Kernel Performance Stats',
      summary: 'Docker inspects kernel cgroup stats files to report exact CPU%, memory, and network I/O.',
      activeBlockIds: ['t10-cgroupstats', 't10-inspect'],
      activeConnectionIdxs: [1],
      detailExplanation: {
        simpleWords: 'You can see live CPU and RAM consumption in real-time without guessing.',
        technicalMechanics: 'Daemon reads /sys/fs/cgroup/cpu.stat and computes delta between container CPU usage and total host CPU ticks.',
      },
      dockerTrace: 'docker stats',
    },
    {
      step: 3,
      title: 'Query Complete Container State JSON',
      summary: 'docker inspect provides deep diagnostic insight into container environment, network, and crash reasons.',
      activeBlockIds: ['t10-driver', 't10-inspect'],
      activeConnectionIdxs: [2],
      detailExplanation: {
        simpleWords: 'If a container fails to start, inspect tells you the exact exit code and why it stopped.',
        technicalMechanics: 'Daemon formats internal state into JSON hierarchy containing State, HostConfig, NetworkSettings, and Mounts.',
      },
      dockerTrace: 'docker inspect <container_id> --format "{{json .State}}"',
    },
  ],
});

// ============================================================================
// TOPIC 11: DOCKER CLI MASTERY
// Resource Management, Pruning Unused Objects & Network Bridge Topologies
// ============================================================================
const TOPIC_11_FLOW = (c: { id: string; title: string }): DockerTopicFlowDiagramData => ({
  topicId: 'topic-11',
  topicNumber: '11',
  topicTitle: 'Docker CLI Mastery',
  conceptId: c.id,
  conceptTitle: c.title,
  architectureType: 'Docker Subsystem Resource Management & Network Topology Matrix',
  architecturalSummary:
    'Covers mastery of the 4 core Docker resource types: Images, Containers, Volumes, and Networks, and demonstrates safe system pruning and garbage collection.',
  subtopics: [
    'Object garbage collection: docker system prune -a --volumes',
    'Bridge networks: docker0 vs custom bridge vs host vs none',
    'Volume lifecycle: orphan volume detection and safe deletion',
    'Container states: created, running, paused, restarting, exited, dead',
  ],
  blocks: [
    {
      id: 't11-cli',
      label: 'Docker CLI Command Line',
      sublabel: 'Management Console',
      category: 'client',
      icon: 'terminal',
      portOrProtocol: 'CLI Subsystems',
      statusText: 'Master Interface',
      details: {
        role: 'Unified management interface for images, containers, volumes, and networks.',
        processName: 'docker',
        cliDiagnostic: 'docker system df',
        configLocation: '~/.docker/config.json',
        keyInsight: 'docker system df shows exact disk reclamation potential across all 4 resource types.',
      },
    },
    {
      id: 't11-images',
      label: 'Image Store Subsystem',
      sublabel: 'Dangling & Tagged Layers',
      category: 'storage',
      icon: 'layers',
      portOrProtocol: 'Local Image Cache',
      statusText: 'Reclaimable',
      details: {
        role: 'Maintains image cache. "Dangling" images (<none>:<none>) are untagged layers replaced by newer builds.',
        processName: 'Image Cache Manager',
        cliDiagnostic: 'docker image prune -a',
        configLocation: '/var/lib/docker/image',
        keyInsight: 'Dangling images take up gigabytes of disk without providing any value—safe to prune routinely.',
      },
    },
    {
      id: 't11-networks',
      label: 'Network Bridge Subsystem',
      sublabel: 'bridge, host, none, overlay',
      category: 'network',
      icon: 'network',
      portOrProtocol: 'Linux veth & iptables',
      statusText: 'Routing Mesh',
      details: {
        role: 'Creates virtual ethernet pairs and configures NAT rules for inter-container and external traffic.',
        processName: 'libnetwork',
        cliDiagnostic: 'docker network ls',
        configLocation: '/var/lib/docker/network',
        keyInsight: 'host network mode shares host networking directly with zero NAT overhead, ideal for high-throughput streaming.',
      },
    },
    {
      id: 't11-volumes',
      label: 'Volume Storage Subsystem',
      sublabel: 'Named & Anonymous Volumes',
      category: 'storage',
      icon: 'hard-drive',
      portOrProtocol: 'Direct Host Mounts',
      statusText: 'Protected Data',
      details: {
        role: 'Preserves database and application data. Never pruned by default unless --volumes flag is passed.',
        processName: 'Volume Manager',
        cliDiagnostic: 'docker volume prune',
        configLocation: '/var/lib/docker/volumes',
        keyInsight: 'Docker protects volumes aggressively: running "docker system prune" will never delete volumes by accident.',
      },
    },
  ],
  connections: [
    { from: 't11-cli', to: 't11-images', label: 'docker image prune', protocol: 'Engine API / Prune', stepNumber: 1 },
    { from: 't11-cli', to: 't11-networks', label: 'docker network connect', protocol: 'Netlink veth Configuration', stepNumber: 2 },
    { from: 't11-cli', to: 't11-volumes', label: 'docker volume inspect', protocol: 'Storage Metadata Query', stepNumber: 3 },
  ],
  steps: [
    {
      step: 1,
      title: 'Analyze & Reclaim Disk Space with Pruning',
      summary: 'docker system df categorizes reclaimable space; prune removes stopped containers and dangling images.',
      activeBlockIds: ['t11-cli', 't11-images'],
      activeConnectionIdxs: [0],
      detailExplanation: {
        simpleWords: 'When your hard drive fills up, Docker can clean out all abandoned test containers and old image layers in one click.',
        technicalMechanics: 'Daemon unlinks unreferenced layer snapshots from /var/lib/docker/overlay2 and triggers filesystem garbage collection.',
      },
      dockerTrace: 'docker system df',
    },
    {
      step: 2,
      title: 'Dynamic Network Reconfiguration',
      summary: 'Containers can be attached or detached from multiple bridge networks dynamically without stopping.',
      activeBlockIds: ['t11-cli', 't11-networks'],
      activeConnectionIdxs: [1],
      detailExplanation: {
        simpleWords: 'You can plug a running container into another network on the fly, just like plugging in a network cable.',
        technicalMechanics: 'libnetwork creates a new veth pair, moves one end into the container network namespace, and attaches other end to bridge.',
      },
      dockerTrace: 'docker network connect my-bridge my-container',
    },
    {
      step: 3,
      title: 'Auditing Persistent Volumes & Storage Drivers',
      summary: 'Inspect volume mount points on host disk and clean up orphaned anonymous volumes.',
      activeBlockIds: ['t11-cli', 't11-volumes'],
      activeConnectionIdxs: [2],
      detailExplanation: {
        simpleWords: 'You inspect exactly where database files live on your computer and clean up abandoned storage buckets.',
        technicalMechanics: 'Volume manager checks refcounts of all named volumes against active container mounts.',
      },
      dockerTrace: 'docker volume ls -qf dangling=true',
    },
  ],
});

// ============================================================================
// TOPIC 12: CONTAINER SECURITY
// Vulnerability Scanning, Non-Root USER, Read-Only rootfs & Dropping Capabilities
// ============================================================================
const TOPIC_12_FLOW = (c: { id: string; title: string }): DockerTopicFlowDiagramData => ({
  topicId: 'topic-12',
  topicNumber: '12',
  topicTitle: 'Container Security',
  conceptId: c.id,
  conceptTitle: c.title,
  architectureType: 'Defense-in-Depth Container Hardening & Static Vulnerability Scanning',
  architecturalSummary:
    'Demonstrates enterprise hardening: scanning base image layers for CVE vulnerabilities (Trivy), enforcing non-root user execution, locking rootfs as read-only, and dropping Linux kernel capabilities.',
  subtopics: [
    'Static vulnerability scanning: Trivy / Clair / Docker Scout CVE analysis',
    'Rootless containers & non-root USER execution (UID 10001)',
    'Immutable containers: --read-only root filesystem with tmpfs mounts',
    'Linux kernel capabilities: --cap-drop=ALL --cap-add=NET_BIND_SERVICE',
  ],
  blocks: [
    {
      id: 't12-scanner',
      label: 'Vulnerability Scanner (Trivy / Scout)',
      sublabel: 'Static CVE Analysis Engine',
      category: 'security',
      icon: 'shield',
      portOrProtocol: 'NVD / GitHub Advisory DB',
      statusText: 'Scanning Layers',
      details: {
        role: 'Scans image OS packages (apt, apk) and language dependencies (npm, pip, maven) against vulnerability databases.',
        processName: 'trivy image my-app:latest',
        cliDiagnostic: 'docker scout cves <image>',
        configLocation: '~/.cache/trivy/db',
        keyInsight: 'Blocks vulnerable images from being deployed to production if CRITICAL or HIGH CVEs are detected.',
      },
    },
    {
      id: 't12-user',
      label: 'Non-Root Execution (USER 10001)',
      sublabel: 'Privilege Demotion Boundary',
      category: 'security',
      icon: 'shield',
      portOrProtocol: 'UID / GID 10001',
      statusText: 'Unprivileged',
      details: {
        role: 'Runs container processes as unprivileged non-root user instead of default UID 0 (root).',
        processName: 'app (UID 10001)',
        cliDiagnostic: 'docker exec <id> id',
        configLocation: 'Dockerfile -> USER 10001:10001',
        keyInsight: 'If an attacker compromises your web app, they cannot install packages or escape to root on the host machine.',
      },
    },
    {
      id: 't12-rootfs',
      label: 'Read-Only Root Filesystem',
      sublabel: '--read-only + tmpfs /tmp',
      category: 'storage',
      icon: 'hard-drive',
      portOrProtocol: 'VFS Read-Only Mount',
      statusText: 'Locked Disk',
      details: {
        role: 'Locks container filesystem into read-only mode. Prevents malware, miners, or web shells from writing binaries to disk.',
        processName: 'VFS MS_RDONLY',
        cliDiagnostic: 'docker run --read-only --tmpfs /tmp my-app',
        configLocation: 'Container HostConfig.ReadonlyRootfs',
        keyInsight: 'Any attempt by an attacker to download a malicious script to /tmp or /bin fails instantly with EROFS (Read-only file system).',
      },
    },
    {
      id: 't12-caps',
      label: 'Linux Capabilities Dropper',
      sublabel: '--cap-drop=ALL',
      category: 'kernel',
      icon: 'cpu',
      portOrProtocol: 'Kernel cap_bset',
      statusText: 'Hardened Kernel',
      details: {
        role: 'Strips dangerous root capabilities (CAP_SYS_ADMIN, CAP_NET_RAW, CAP_SYS_PTRACE).',
        processName: 'Kernel Capability Set',
        cliDiagnostic: 'docker run --cap-drop=ALL --cap-add=NET_BIND_SERVICE ...',
        configLocation: '/proc/sys/kernel/cap_last_cap',
        keyInsight: 'Without CAP_SYS_ADMIN and raw sockets, 95% of container escape vulnerabilities become impossible to exploit.',
      },
    },
  ],
  connections: [
    { from: 't12-scanner', to: 't12-user', label: '1. Scan & Enforce Non-Root UID', protocol: 'CI Build Verification', stepNumber: 1 },
    { from: 't12-user', to: 't12-rootfs', label: '2. Restrict Filesystem to Read-Only', protocol: 'Mount Namespace Flag', stepNumber: 2 },
    { from: 't12-user', to: 't12-caps', label: '3. Drop Dangerous Capabilities', protocol: 'Kernel capset Syscall', stepNumber: 3 },
  ],
  steps: [
    {
      step: 1,
      title: 'Automated Image Vulnerability Scanning',
      summary: 'Trivy or Docker Scout scans base image packages and fails builds containing critical exploits.',
      activeBlockIds: ['t12-scanner', 't12-user'],
      activeConnectionIdxs: [0],
      detailExplanation: {
        simpleWords: 'Before shipping your app, a scanner checks all underlying software libraries for known security bugs.',
        technicalMechanics: 'Scanner compares package manifests (dpkg/apk/rpm databases) against CVE vulnerability feeds and generates severity reports.',
      },
      dockerTrace: 'docker scout quickview <image>',
    },
    {
      step: 2,
      title: 'Enforce Unprivileged Non-Root Execution',
      summary: 'Container starts with non-root UID 10001, blocking system modifications and host root mapping.',
      activeBlockIds: ['t12-user', 't12-rootfs'],
      activeConnectionIdxs: [1],
      detailExplanation: {
        simpleWords: 'Your app runs as a restricted guest user, not as the system administrator.',
        technicalMechanics: 'runc sets credentials via setuid(10001) and setgid(10001) before calling execve() on application binary.',
      },
      dockerTrace: 'docker run --rm --user 10001:10001 alpine id',
    },
    {
      step: 3,
      title: 'Apply Read-Only Filesystem & Drop Capabilities',
      summary: 'Kernel capability bounding set is stripped and root filesystem is mounted with MS_RDONLY.',
      activeBlockIds: ['t12-user', 't12-caps'],
      activeConnectionIdxs: [2],
      detailExplanation: {
        simpleWords: 'Even if someone hacks your web server, they cannot save any malicious files or tamper with system memory.',
        technicalMechanics: 'Kernel enforces CAP_DROP=ALL via prctl(PR_CAPBSET_DROP) and mounts rootfs read-only, allocating memory-only tmpfs for /tmp.',
      },
      dockerTrace: 'docker run --rm --cap-drop=ALL alpine ping 127.0.0.1',
    },
  ],
});

// ============================================================================
// TOPIC 13: DEVELOPER EXPERIENCE
// Hot Reloading, Remote Debugging, Containerized Tests & CI/CD Pipelines
// ============================================================================
const TOPIC_13_FLOW = (c: { id: string; title: string }): DockerTopicFlowDiagramData => ({
  topicId: 'topic-13',
  topicNumber: '13',
  topicTitle: 'Developer Experience',
  conceptId: c.id,
  conceptTitle: c.title,
  architectureType: 'Developer Feedback Loop, Containerized Test Runners & CI Automation',
  architecturalSummary:
    'Demonstrates high-velocity development: Docker Compose file watch hot reloading, attaching debuggers via exposed debug ports, running automated tests in isolated containers, and CI buildx pipelines.',
  subtopics: [
    'Docker Compose Watch: syncing code into running containers without restarts',
    'Remote debugging: exposing V8 / Python debug ports (:9229 / :5678)',
    'Test isolation: running Jest / Pytest / Go test in throwaway containers',
    'CI/CD multi-platform builds (linux/amd64 and linux/arm64 with buildx)',
  ],
  blocks: [
    {
      id: 't13-ide',
      label: 'Host IDE (VS Code / JetBrains)',
      sublabel: 'Developer Source Workspace',
      category: 'client',
      icon: 'terminal',
      portOrProtocol: 'Local Filesystem',
      statusText: 'Editing Code',
      details: {
        role: 'Developer edits code and sets breakpoints in local IDE on host laptop.',
        processName: 'code / ide',
        cliDiagnostic: 'docker compose watch',
        configLocation: './src/',
        keyInsight: 'No need to install Node, Python, or Go SDKs on the host machine—everything is containerized.',
      },
    },
    {
      id: 't13-watch',
      label: 'Compose Watch Sync Engine',
      sublabel: 'Inotify File Event Synchronizer',
      category: 'compose',
      icon: 'zap',
      portOrProtocol: 'File Sync / Tar Stream',
      statusText: 'Watching Files',
      details: {
        role: 'Detects file modifications on host and streams updated files directly into the container in milliseconds.',
        processName: 'docker compose watch',
        cliDiagnostic: 'docker compose alpha watch',
        configLocation: 'compose.yaml -> develop.watch',
        keyInsight: 'Sub-second feedback loops: only changed files are synchronized instead of rebuilding the whole image.',
      },
    },
    {
      id: 't13-app',
      label: 'Live Container with Debugger',
      sublabel: 'Node --inspect=0.0.0.0:9229',
      category: 'runtime',
      icon: 'box',
      portOrProtocol: 'TCP :9229 Debug Port',
      statusText: 'Hot Reloading',
      details: {
        role: 'Runs nodemon / vite with exposed debug port allowing VS Code debugger attachment.',
        processName: 'node --inspect',
        cliDiagnostic: 'curl -I http://localhost:9229/json',
        configLocation: '.vscode/launch.json',
        keyInsight: 'Breakpoints set in VS Code pause execution directly inside the Linux container!',
      },
    },
    {
      id: 't13-testrunner',
      label: 'Isolated Test Runner Container',
      sublabel: 'CI/CD Automated Unit & Integration Tests',
      category: 'runtime',
      icon: 'shield',
      portOrProtocol: 'docker run --rm app npm test',
      statusText: 'Test Execution',
      details: {
        role: 'Runs automated test suite inside clean, isolated sandbox with mock database.',
        processName: 'npm test / pytest',
        cliDiagnostic: 'docker compose run --rm web npm test',
        configLocation: 'package.json -> scripts.test',
        keyInsight: 'Eliminates "test passed on my laptop but failed on CI" because environment is 100% identical.',
      },
    },
  ],
  connections: [
    { from: 't13-ide', to: 't13-watch', label: '1. File Modification Event', protocol: 'inotify Watcher', stepNumber: 1 },
    { from: 't13-watch', to: 't13-app', label: '2. Synchronize File Delta to Container', protocol: 'Compose File Sync', stepNumber: 2 },
    { from: 't13-ide', to: 't13-app', label: '3. Attach Remote Debugger Socket', protocol: 'Chrome DevTools Protocol (CDP)', stepNumber: 3 },
    { from: 't13-app', to: 't13-testrunner', label: '4. Execute Automated Test Suite', protocol: 'Isolated Sandbox Execution', stepNumber: 4 },
  ],
  steps: [
    {
      step: 1,
      title: 'Developer Edits Code in Local IDE',
      summary: 'Developer modifies a source file on the host machine.',
      activeBlockIds: ['t13-ide', 't13-watch'],
      activeConnectionIdxs: [0],
      detailExplanation: {
        simpleWords: 'You write code in VS Code on your laptop just like you always do.',
        technicalMechanics: 'Host filesystem inotify/FSEvents triggers and alerts the Docker Compose watch daemon.',
      },
      dockerTrace: 'docker compose watch',
    },
    {
      step: 2,
      title: 'Compose Watch Syncs Code Instantly',
      summary: 'Compose synchronizes only the modified file into the container filesystem, triggering hot reload.',
      activeBlockIds: ['t13-watch', 't13-app'],
      activeConnectionIdxs: [1],
      detailExplanation: {
        simpleWords: 'The new code updates inside the running container in less than a second without restarting.',
        technicalMechanics: 'Compose streams tar archive of updated file into container rootfs; Vite/Nodemon detects file delta and refreshes browser.',
      },
      dockerTrace: 'docker compose logs -f web',
    },
    {
      step: 3,
      title: 'Attach Remote IDE Debugger',
      summary: 'VS Code connects to container port 9229 to inspect variables, call stacks, and breakpoints.',
      activeBlockIds: ['t13-ide', 't13-app'],
      activeConnectionIdxs: [2],
      detailExplanation: {
        simpleWords: 'You can pause code on a breakpoint, step through lines, and inspect variables live inside the container.',
        technicalMechanics: 'VS Code debugger connects via Chrome DevTools Protocol (CDP) WebSocket to localhost:9229 mapped to container.',
      },
      dockerTrace: 'netstat -an | grep 9229',
    },
    {
      step: 4,
      title: 'Execute Automated Tests in Disposable Containers',
      summary: 'Unit and integration tests run inside clean, fresh container with guaranteed reproducibility.',
      activeBlockIds: ['t13-app', 't13-testrunner'],
      activeConnectionIdxs: [3],
      detailExplanation: {
        simpleWords: 'Tests run in a clean environment that guarantees it will pass on CI and production.',
        technicalMechanics: 'docker run --rm provisions ephemeral container, executes test suite, outputs JUnit XML / TAP reports, and exits with code 0.',
      },
      dockerTrace: 'docker run --rm my-app:test npm test',
    },
  ],
});

// ============================================================================
// TOPIC 14: DEPLOYING CONTAINERS
// PaaS Platforms, Docker Swarm Ingress Routing Mesh, Kubernetes & Nomad
// ============================================================================
const TOPIC_14_FLOW = (c: { id: string; title: string }): DockerTopicFlowDiagramData => ({
  topicId: 'topic-14',
  topicNumber: '14',
  topicTitle: 'Deploying Containers',
  conceptId: c.id,
  conceptTitle: c.title,
  architectureType: 'Production Container Orchestration & Distributed Routing Mesh',
  architecturalSummary:
    'Explores moving from single-host Docker to distributed production systems: Cloud PaaS (AWS ECS, Fly.io), Docker Swarm ingress routing mesh, HashiCorp Nomad, and transition bridge to Kubernetes PodForge.',
  subtopics: [
    'Cloud PaaS containers: AWS ECS Fargate, Google Cloud Run, Fly.io',
    'Docker Swarm Mode: Raft consensus, overlay networks & ingress routing mesh',
    'Bridge to Kubernetes PodForge: Pods, Services, and Deployments',
    'HashiCorp Nomad declarative job specifications',
  ],
  blocks: [
    {
      id: 't14-client',
      label: 'External User Traffic',
      sublabel: 'HTTPS Public Internet',
      category: 'client',
      icon: 'network',
      portOrProtocol: 'HTTPS :443',
      statusText: 'Traffic Influx',
      details: {
        role: 'Public web requests arriving at cluster entrypoint.',
        processName: 'Internet Client',
        cliDiagnostic: 'curl -I https://app.example.com',
        configLocation: 'DNS A Record',
        keyInsight: 'Distributed orchestrators balance requests across dozens of worker nodes automatically.',
      },
    },
    {
      id: 't14-mesh',
      label: 'Swarm / PaaS Routing Mesh',
      sublabel: 'Virtual IP (VIP) & IPVS Load Balancer',
      category: 'network',
      icon: 'network',
      portOrProtocol: 'IPVS / VXLAN Overlay',
      statusText: 'Distributing Traffic',
      details: {
        role: 'Accepts connections on any cluster node and routes to an active container replica anywhere in the cluster.',
        processName: 'IPVS / kube-proxy / Cloud ALB',
        cliDiagnostic: 'docker service ls',
        configLocation: 'docker service create --replicas=5',
        keyInsight: 'In Docker Swarm routing mesh, connecting to port 80 on Node 1 routes transparently to a container running on Node 3.',
      },
    },
    {
      id: 't14-node1',
      label: 'Worker Node Alpha',
      sublabel: 'Host Instance (2 Replicas)',
      category: 'cloud',
      icon: 'server',
      portOrProtocol: 'Overlay VXLAN 4789',
      statusText: 'Healthy Host',
      details: {
        role: 'Executes container replicas with local container engine.',
        processName: 'dockerd worker',
        cliDiagnostic: 'docker node ls',
        configLocation: '/var/lib/docker/swarm',
        keyInsight: 'If Node Alpha loses power, the orchestrator detects heartbeat loss and reschedules replicas on remaining nodes.',
      },
    },
    {
      id: 't14-node2',
      label: 'Worker Node Beta',
      sublabel: 'Host Instance (3 Replicas)',
      category: 'cloud',
      icon: 'server',
      portOrProtocol: 'Overlay VXLAN 4789',
      statusText: 'Healthy Host',
      details: {
        role: 'Executes additional container replicas for high availability across availability zones.',
        processName: 'dockerd worker',
        cliDiagnostic: 'docker service ps my-app',
        configLocation: '/var/lib/docker/swarm',
        keyInsight: 'Self-healing: automatically reconciles desired replica count (e.g. 5) against actual running containers.',
      },
    },
    {
      id: 't14-k8s',
      label: 'PodForge K8s Bridge',
      sublabel: 'Deployment & Pod Orchestration',
      category: 'cloud',
      icon: 'layers',
      portOrProtocol: 'Kubernetes API / Pods',
      statusText: 'Next Step',
      details: {
        role: 'Transition path from Docker Compose to enterprise Kubernetes Pods and Services.',
        processName: 'kube-apiserver / PodForge',
        cliDiagnostic: 'kubectl get deployments',
        configLocation: 'k8s/deployment.yaml',
        keyInsight: 'Everything learned in DockForge directly applies to Kubernetes PodForge—a Pod is simply one or more co-located containers!',
      },
    },
  ],
  connections: [
    { from: 't14-client', to: 't14-mesh', label: '1. Inbound Public HTTP Request', protocol: 'TLS Termination / Port 443', stepNumber: 1 },
    { from: 't14-mesh', to: 't14-node1', label: '2. Route to Replica on Node Alpha', protocol: 'IPVS VXLAN Tunnel', stepNumber: 2 },
    { from: 't14-mesh', to: 't14-node2', label: '3. Route to Replica on Node Beta', protocol: 'IPVS VXLAN Tunnel', stepNumber: 3 },
    { from: 't14-node2', to: 't14-k8s', label: '4. Bridge to PodForge K8s Scaling', protocol: 'Declarative K8s Manifests', stepNumber: 4 },
  ],
  steps: [
    {
      step: 1,
      title: 'Client Traffic Hits Production Cluster',
      summary: 'Public web requests reach cloud load balancer or Swarm ingress routing mesh.',
      activeBlockIds: ['t14-client', 't14-mesh'],
      activeConnectionIdxs: [0],
      detailExplanation: {
        simpleWords: 'Users access your web application using your company domain name.',
        technicalMechanics: 'Cloud load balancer or ingress node accepts TCP connection on published service port.',
      },
      dockerTrace: 'curl -I https://app.example.com',
    },
    {
      step: 2,
      title: 'Routing Mesh Distributes via Virtual IP (VIP)',
      summary: 'Traffic is balanced across all worker nodes in the cluster using IPVS kernel module.',
      activeBlockIds: ['t14-mesh', 't14-node1', 't14-node2'],
      activeConnectionIdxs: [1, 2],
      detailExplanation: {
        simpleWords: 'The cluster balances incoming visitors equally across all running copies of your application.',
        technicalMechanics: 'Linux IPVS module encapsulates packets into VXLAN overlay UDP 4789 frames and routes to target container network namespace.',
      },
      dockerTrace: 'docker service ps my-service',
    },
    {
      step: 3,
      title: 'Self-Healing & Automated Replica Rebalancing',
      summary: 'If a node crashes, the orchestrator detects failure and reschedules containers on surviving hosts.',
      activeBlockIds: ['t14-node1', 't14-node2'],
      activeConnectionIdxs: [2],
      detailExplanation: {
        simpleWords: 'If a server crashes at 3 AM, the cluster automatically moves your containers to another server without downtime.',
        technicalMechanics: 'Raft consensus manager detects missed heartbeats (default 5s), updates desired state, and triggers worker node convergence.',
      },
      dockerTrace: 'docker service inspect my-service --pretty',
    },
    {
      step: 4,
      title: 'Seamless Bridge to Kubernetes PodForge',
      summary: 'When systems outgrow single-cluster Docker, PodForge guides the transition to Kubernetes Pods & Services.',
      activeBlockIds: ['t14-node2', 't14-k8s'],
      activeConnectionIdxs: [3],
      detailExplanation: {
        simpleWords: 'Your Docker skills carry directly over to Kubernetes PodForge for large-scale enterprise microservices.',
        technicalMechanics: 'Docker images pushed to registry are consumed directly by Kubernetes Kubelet via Container Runtime Interface (CRI).',
      },
      dockerTrace: 'kubectl get pods -A',
    },
  ],
});

// ============================================================================
// DYNAMIC DISPATCH ENGINE FOR ALL 14 DOCKER TOPICS & CONCEPTS
// ============================================================================
export function getDockerDiagramData(concept: {
  id: string;
  title: string;
  topicId?: string;
  topicNumber?: string;
  command?: string;
}): DockerTopicFlowDiagramData {
  const cid = concept.id.toLowerCase();
  const tid = (concept.topicId || '').toLowerCase();
  const tnum = parseInt(concept.topicNumber || '0', 10);

  // Exact concept match first
  if (cid.startsWith('c-what-are') || cid.startsWith('c-why-need') || cid.startsWith('c-baremetal') || cid.startsWith('c-docker-and-oci') || tnum === 1 || tid === 'topic-01') {
    return TOPIC_01_FLOW(concept);
  }
  if (cid.startsWith('c-linux-ns') || cid.startsWith('c-cgroups') || cid.startsWith('c-union') || tnum === 2 || tid === 'topic-02') {
    return TOPIC_02_FLOW(concept);
  }
  if (cid.startsWith('c-docker-desktop') || cid.startsWith('c-docker-engine-linux') || tnum === 3 || tid === 'topic-03') {
    return TOPIC_03_FLOW(concept);
  }
  if (cid.startsWith('c-docker-run') || cid.startsWith('c-docker-exec') || cid.startsWith('c-docker-stop') || cid.startsWith('c-docker-rm') || tnum === 4 || tid === 'topic-04') {
    return TOPIC_04_FLOW(concept);
  }
  if (cid.startsWith('c-ephemeral') || cid.startsWith('c-volume') || cid.startsWith('c-bind') || tnum === 5 || tid === 'topic-05') {
    return TOPIC_05_FLOW(concept);
  }
  if (cid.startsWith('c-running-db') || cid.startsWith('c-running-data') || cid.startsWith('c-cli-util') || tnum === 6 || tid === 'topic-06') {
    return TOPIC_06_FLOW(concept);
  }
  if (cid.startsWith('c-dockerfile') || cid.startsWith('c-layer-cache') || cid.startsWith('c-image-size') || tnum === 7 || tid === 'topic-07') {
    return TOPIC_07_FLOW(concept);
  }
  if (cid.startsWith('c-dockerhub') || cid.startsWith('c-image-tag') || cid.startsWith('c-cloud-reg') || tnum === 8 || tid === 'topic-08') {
    return TOPIC_08_FLOW(concept);
  }
  if (cid.startsWith('c-docker-run-flags') || cid.startsWith('c-docker-compose') || tnum === 9 || tid === 'topic-09') {
    return TOPIC_09_FLOW(concept);
  }
  if (cid.startsWith('c-container-logs') || cid.startsWith('c-container-inspect') || tnum === 10 || tid === 'topic-10') {
    return TOPIC_10_FLOW(concept);
  }
  if (cid.startsWith('c-cli-images') || cid.startsWith('c-cli-containers') || cid.startsWith('c-cli-volumes') || cid.startsWith('c-cli-networks') || tnum === 11 || tid === 'topic-11') {
    return TOPIC_11_FLOW(concept);
  }
  if (cid.startsWith('c-image-security') || cid.startsWith('c-runtime-security') || tnum === 12 || tid === 'topic-12') {
    return TOPIC_12_FLOW(concept);
  }
  if (cid.startsWith('c-hot-reload') || cid.startsWith('c-container-debug') || cid.startsWith('c-container-test') || cid.startsWith('c-continuous') || tnum === 13 || tid === 'topic-13') {
    return TOPIC_13_FLOW(concept);
  }
  if (cid.startsWith('c-paas') || cid.startsWith('c-docker-swarm') || cid.startsWith('c-kubernetes') || cid.startsWith('c-nomad') || tnum === 14 || tid === 'topic-14') {
    return TOPIC_14_FLOW(concept);
  }

  // Fallback to topic number
  switch (tnum) {
    case 1: return TOPIC_01_FLOW(concept);
    case 2: return TOPIC_02_FLOW(concept);
    case 3: return TOPIC_03_FLOW(concept);
    case 4: return TOPIC_04_FLOW(concept);
    case 5: return TOPIC_05_FLOW(concept);
    case 6: return TOPIC_06_FLOW(concept);
    case 7: return TOPIC_07_FLOW(concept);
    case 8: return TOPIC_08_FLOW(concept);
    case 9: return TOPIC_09_FLOW(concept);
    case 10: return TOPIC_10_FLOW(concept);
    case 11: return TOPIC_11_FLOW(concept);
    case 12: return TOPIC_12_FLOW(concept);
    case 13: return TOPIC_13_FLOW(concept);
    case 14: return TOPIC_14_FLOW(concept);
    default: return TOPIC_01_FLOW(concept);
  }
}
