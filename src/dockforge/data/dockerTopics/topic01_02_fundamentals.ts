import { UniversalDockerConcept } from '../unifiedDockerData';

export const TOPIC_01_02_CONCEPTS: Record<string, UniversalDockerConcept> = {
  'c-what-are-containers': {
    id: 'c-what-are-containers',
    command: 'docker info',
    title: 'What are Containers?',
    topicId: 'topic-01',
    topicNumber: '01',
    topicTitle: 'Introduction to Containers',
    subtitle: 'Lightweight, isolated process execution environments sharing the Linux OS kernel.',
    badges: ['Beginner', 'Foundations', 'Architecture'],
    quote: 'A container is an isolated user-space process that packages code, libraries, and dependencies into a single portable unit.',
    difficulty: 'Beginner',

    whatIsIt:
      'Containers are lightweight, standalone execution packages that enclose application source code along with all system libraries, dependencies, configuration files, and runtime binaries needed to run consistently across any computing environment.',
    inSimpleWords:
      'Imagine a standardized shipping container on a cargo ship. It holds your entire app and all its tools. You can drop that container onto a Mac, Windows laptop, or Linux cloud server, and it runs identically without messing up the host computer.',
    whyDoYouNeedIt:
      'Without containers, installing different versions of Python, Node.js, or PostgreSQL on host servers causes version conflicts ("works on my laptop but broke on production server"). Containers eliminate this pain entirely.',
    realWorldAnalogy:
      'A hotel guest room. Each guest has their own private bathroom, bed, key card, and TV (isolated environment), but all rooms share the hotel foundation, electrical grid, and plumbing (shared host kernel).',

    syntaxCode: 'docker run -d --name web-server -p 8080:80 nginx:alpine',
    syntaxTokens: [
      { token: 'docker run', role: 'Command', explanation: 'Creates and starts a container instance from an image.' },
      { token: '-d', role: 'Flag', explanation: 'Detached mode: runs container in the background.' },
      { token: '--name web-server', role: 'Flag', explanation: 'Assigns a custom human-readable name to the container.' },
      { token: '-p 8080:80', role: 'Flag', explanation: 'Maps host port 8080 to container port 80.' },
      { token: 'nginx:alpine', role: 'Image Target', explanation: 'Specifies the Nginx image built on lightweight Alpine Linux.' },
    ],

    actionStage: {
      before: {
        label: 'Bare Host OS',
        description: 'Host machine with global node/python packages where applications conflict.',
        stateBadge: 'Un-isolated Host',
        details: ['Host Linux Kernel 6.6', 'Global node_modules', 'Shared Port 80', 'Single global environment'],
      },
      running: {
        label: 'Docker Daemon Initialization',
        description: 'Docker daemon creates PID, Net, and Mount namespaces and attaches OverlayFS.',
        stateBadge: 'Initializing Namespaces',
        details: ['Allocating IP: 172.17.0.2', 'cgroups limits attached', 'Attaching Overlay2 rootfs', 'Starting PID 1'],
      },
      after: {
        label: 'Isolated Container Active',
        description: 'Container runs as an isolated process with mapped network ports.',
        stateBadge: 'Running & Isolated',
        details: ['Container ID: c-web-server', 'Host 8080 -> Container 80', 'Status: Up (healthy)', 'Isolated process tree'],
      },
    },

    variations: [
      {
        title: 'Interactive Terminal Shell',
        syntax: 'docker run -it alpine sh',
        whatItDoes: 'Attaches an interactive terminal shell (TTY) inside a container.',
        whenToUse: 'Debugging files or exploring a container environment interactively.',
      },
      {
        title: 'Disposable Self-Deleting Container',
        syntax: 'docker run --rm alpine echo "Hello World"',
        whatItDoes: 'Executes a single command and immediately removes the container on exit.',
        whenToUse: 'One-off diagnostic scripts, automated tests, or quick commands.',
      },
    ],

    scenarios: [
      {
        title: 'Container vs Host Kernel Sharing',
        question: 'What kernel does a Linux Docker container use when running on a host?',
        options: [
          { label: 'The host machine\'s Linux kernel', command: 'host-kernel', isCorrect: true, explanation: 'Containers share the host OS kernel, which is why they boot instantly in milliseconds.' },
          { label: 'Its own full guest OS kernel', command: 'guest-kernel', isCorrect: false, explanation: 'Virtual Machines use full guest kernels, not containers.' },
        ],
      },
    ],

    sandbox: {
      initialCommands: ['docker ps'],
      guidedSteps: [
        { instruction: 'Inspect running containers', command: 'docker ps', hint: 'Type docker ps' },
        { instruction: 'Start a detached Nginx container on port 8080', command: 'docker run -d -p 8080:80 nginx:1.25-alpine', hint: 'Type docker run -d -p 8080:80 nginx:1.25-alpine' },
        { instruction: 'Verify container is active', command: 'docker ps', hint: 'Type docker ps' },
      ],
      targetTask: 'Launch an isolated Nginx container.',
      solutionCommands: ['docker run -d -p 8080:80 nginx:1.25-alpine'],
    },

    reference: {
      officialDocUrl: 'https://docs.docker.com/get-started/overview/',
      syntaxCheatSheet: [
        'docker run -d [IMAGE]      # Run in background',
        'docker ps                  # List running containers',
        'docker stop [CONTAINER]    # Stop container',
        'docker rm [CONTAINER]      # Remove container',
      ],
      bestPractices: [
        'Use small base images like Alpine or Distroless.',
        'Never store permanent data directly inside container write layers.',
        'Assign explicit container names using --name.',
      ],
    },
  },

  'c-why-need-containers': {
    id: 'c-why-need-containers',
    command: 'docker run',
    title: 'Why do we need Containers?',
    topicId: 'topic-01',
    topicNumber: '01',
    topicTitle: 'Introduction to Containers',
    subtitle: 'Solving environment mismatches, dependency hell, and deployment friction.',
    badges: ['Beginner', 'DevOps', 'Workflow'],
    quote: 'Containers guarantee that if code builds and runs on your developer machine, it will run identically in testing, staging, and cloud production.',
    difficulty: 'Beginner',

    whatIsIt:
      'Before containers, software deployment required manually installing runtime environments, setting path variables, and configuring server dependencies. Version mismatches between developer laptops and production servers caused constant crashes.',
    inSimpleWords:
      'Containers wrap your app and its entire environment inside an immutable box. You test the box, ship the box, and deploy the box. No surprises, no missing DLLs or package errors.',
    whyDoYouNeedIt:
      'It provides environment consistency, instant local setup for new team members, fast CI/CD builds, and efficient cloud resource utilization.',
    realWorldAnalogy:
      'A pre-packaged meal kit. Instead of buying individual raw ingredients and hoping your stove matches the chef\'s oven, you get an exact pre-measured meal box that cooks perfectly anywhere.',

    syntaxCode: 'docker run -d -p 3000:3000 my-company-app:v1.0',
    syntaxTokens: [
      { token: 'docker run', role: 'Command', explanation: 'Executes container' },
      { token: 'my-company-app:v1.0', role: 'Target Image', explanation: 'Immutable build artifact containing code + runtime' },
    ],

    actionStage: {
      before: {
        label: 'Legacy Manual Deployment',
        description: 'Server missing Node 20, missing libssl, outdated Python version.',
        stateBadge: 'Dependency Failure',
        details: ['App crash: Cannot find module express', 'Server OS: Ubuntu 18.04', 'Developer laptop: macOS Sequoia'],
      },
      running: {
        label: 'Containerized Deployment',
        description: 'Pulling self-contained image with Node 20 and dependencies pre-baked.',
        stateBadge: 'Deploying Image',
        details: ['Pulling my-company-app:v1.0', 'Extracting layers', 'Starting PID 1'],
      },
      after: {
        label: 'Flawless Execution',
        description: 'Application starts cleanly in milliseconds on any server.',
        stateBadge: 'Consistent & Live',
        details: ['Status: Healthy', 'Identical environment to developer laptop', 'Zero host configuration needed'],
      },
    },

    variations: [
      { title: 'Standard Run', syntax: 'docker run -d app:v1', whatItDoes: 'Runs production app version' },
    ],

    scenarios: [
      {
        title: 'Work on My Machine Syndrome',
        question: 'How do containers solve the "works on my machine" problem?',
        options: [
          { label: 'By packaging the application code along with its exact OS dependencies and runtime into an immutable image', command: 'pkg', isCorrect: true, explanation: 'The environment is locked inside the image.' },
          { label: 'By buying identical laptops for all developers and cloud servers', command: 'laptop', isCorrect: false, explanation: 'Hardware matching is expensive and impractical.' },
        ],
      },
    ],

    sandbox: {
      initialCommands: ['docker images'],
      guidedSteps: [
        { instruction: 'Check available local images', command: 'docker images', hint: 'Type docker images' },
      ],
      targetTask: 'Understand container deployment stability.',
      solutionCommands: ['docker images'],
    },

    reference: {
      syntaxCheatSheet: ['docker run -d -p [HOST_PORT]:[CONTAINER_PORT] [IMAGE]'],
      bestPractices: ['Bake runtime dependencies into images rather than downloading them at container startup.'],
    },
  },

  'c-baremetal-vm-containers': {
    id: 'c-baremetal-vm-containers',
    command: 'docker stats',
    title: 'Bare Metal vs VMs vs Containers',
    topicId: 'topic-01',
    topicNumber: '01',
    topicTitle: 'Introduction to Containers',
    subtitle: 'Comparing OS virtualization, hypervisors, and kernel-level container process isolation.',
    badges: ['Beginner', 'Architecture', 'Comparison'],
    quote: 'Virtual Machines virtualize hardware; Containers virtualize the operating system kernel.',
    difficulty: 'Beginner',

    whatIsIt:
      'Bare metal runs OS directly on server hardware. Virtual Machines (VMs) use a hypervisor (ESXi, Hyper-V, KVM) to emulate hardware and run full guest OS instances (gigabytes of RAM and CPU overhead). Containers share the host kernel and isolate processes using Linux namespaces and cgroups.',
    inSimpleWords:
      'Bare Metal = Owning a single-family house. Virtual Machine = An apartment building where every apartment has its own heavy concrete foundation and plumbing (Heavy). Container = Cubicles inside an office floor sharing the main AC and lights (Lightweight & Fast).',
    whyDoYouNeedIt:
      'VMs take minutes to boot and consume gigabytes of memory per guest OS. Containers boot in milliseconds, use megabytes of memory, and allow 10x higher density on servers.',
    realWorldAnalogy:
      'Shipping whole houses across the ocean (VMs) versus shipping standardized wooden boxes on a cargo container ship (Containers).',

    syntaxCode: 'docker stats',
    syntaxTokens: [
      { token: 'docker stats', role: 'Command', explanation: 'Streams live CPU, memory, and network usage stats for containers.' },
    ],

    actionStage: {
      before: {
        label: 'Virtual Machine Architecture',
        description: 'Hardware -> Host OS -> Hypervisor -> Guest OS (4GB) -> App.',
        stateBadge: 'Heavy (Gigabytes)',
        details: ['Boot time: 1-3 minutes', 'RAM per VM: 2GB-8GB', 'Full guest kernel overhead'],
      },
      running: {
        label: 'Container Architecture',
        description: 'Hardware -> Host OS -> Docker Daemon -> Container Process.',
        stateBadge: 'Lightweight (Megabytes)',
        details: ['Boot time: 100 milliseconds', 'RAM per Container: 15MB-50MB', 'Shared host Linux kernel'],
      },
      after: {
        label: 'Density Comparison',
        description: 'Server runs 10 VMs vs 200 Containers on the same physical server.',
        stateBadge: '10x Density Improvement',
        details: ['Higher CPU efficiency', 'Lower cloud hosting costs', 'Instant scaling'],
      },
    },

    variations: [
      { title: 'Live Metric Streaming', syntax: 'docker stats', whatItDoes: 'Displays container CPU % and Memory MB usage in real-time' },
    ],

    scenarios: [
      {
        title: 'Virtualization Mechanism',
        question: 'What layer is emulated by a Virtual Machine that is NOT emulated by a Docker Container?',
        options: [
          { label: 'Virtual Hardware and a Guest Operating System Kernel', command: 'vm-kernel', isCorrect: true, explanation: 'VMs emulate virtual disk controllers, BIOS, and run full guest kernels.' },
          { label: 'User application source code', command: 'app-code', isCorrect: false, explanation: 'Both run application code.' },
        ],
      },
    ],

    sandbox: {
      initialCommands: ['docker stats'],
      guidedSteps: [
        { instruction: 'Inspect real-time CPU and memory stats of running containers', command: 'docker stats', hint: 'Type docker stats' },
      ],
      targetTask: 'Observe container resource efficiency.',
      solutionCommands: ['docker stats'],
    },

    reference: {
      syntaxCheatSheet: ['docker stats    # View CPU, MEM, NET I/O stats'],
      bestPractices: ['Use containers for microservices and web apps; use VMs when absolute kernel isolation or different kernel versions are required.'],
    },
  },

  'c-docker-and-oci': {
    id: 'c-docker-and-oci',
    command: 'docker version',
    title: 'Docker and OCI',
    topicId: 'topic-01',
    topicNumber: '01',
    topicTitle: 'Introduction to Containers',
    subtitle: 'Understanding the Open Container Initiative, runc, and containerd specifications.',
    badges: ['Beginner', 'Standards', 'OCI'],
    quote: 'The OCI ensures container images and runtimes remain open, vendor-neutral standards.',
    difficulty: 'Beginner',

    whatIsIt:
      'The Open Container Initiative (OCI) is an open governance structure created in 2015 to establish universal standards for container image formats (OCI Image Specification) and low-level execution runtimes (OCI Runtime Specification / runc).',
    inSimpleWords:
      'OCI is like the USB standard for containers. Because everyone follows the OCI spec, an image built with Docker can run on Kubernetes, Podman, containerd, or AWS ECS without modification.',
    whyDoYouNeedIt:
      'It prevents vendor lock-in. Docker CLI communicates with containerd, which uses runc to interact with Linux kernel namespaces.',
    realWorldAnalogy:
      'Standardized 3-prong electrical wall sockets. Any device manufacturer (Docker, Podman, K8s) can plug into the standard socket.',

    syntaxCode: 'docker version',
    syntaxTokens: [
      { token: 'docker version', role: 'Command', explanation: 'Displays Docker client, daemon, OCI runtime (runc), and containerd versions.' },
    ],

    actionStage: {
      before: {
        label: 'High-Level Docker CLI',
        description: 'User enters "docker run".',
        stateBadge: 'User Command',
        details: ['docker CLI client', 'REST API request to dockerd'],
      },
      running: {
        label: 'Containerd & OCI Runc Execution',
        description: 'dockerd hands off execution to containerd, which calls OCI runtime "runc".',
        stateBadge: 'OCI Spec Hand-off',
        details: ['dockerd -> containerd', 'containerd -> runc', 'runc invokes Linux kernel clone()'],
      },
      after: {
        label: 'Running Process',
        description: 'runc exits after launching process; containerd manages container lifecycle.',
        stateBadge: 'OCI Process Active',
        details: ['OCI Spec Compliant', 'Universal image layer structure'],
      },
    },

    variations: [
      { title: 'Check Versions', syntax: 'docker version', whatItDoes: 'Lists dockerd, containerd, and runc engine versions' },
    ],

    scenarios: [
      {
        title: 'OCI Low-level Runtime',
        question: 'What is the default low-level OCI runtime reference implementation used by Docker and Kubernetes?',
        options: [
          { label: 'runc', command: 'runc', isCorrect: true, explanation: 'runc is the lightweight CLI tool for spawning containers according to the OCI specification.' },
          { label: 'VMware ESXi', command: 'esxi', isCorrect: false, explanation: 'ESXi is a hypervisor for VMs.' },
        ],
      },
    ],

    sandbox: {
      initialCommands: ['docker version'],
      guidedSteps: [
        { instruction: 'Inspect Docker engine, containerd, and runc versions', command: 'docker version', hint: 'Type docker version' },
      ],
      targetTask: 'Inspect container engine architecture.',
      solutionCommands: ['docker version'],
    },

    reference: {
      officialDocUrl: 'https://opencontainers.org/',
      syntaxCheatSheet: ['docker version    # View OCI runtime specs'],
    },
  },

  'c-linux-namespaces': {
    id: 'c-linux-namespaces',
    command: 'unshare --pid',
    title: 'Namespaces',
    topicId: 'topic-02',
    topicNumber: '02',
    topicTitle: 'Underlying Linux Technologies',
    subtitle: 'Process, Network, Mount, IPC, UTS, and User namespace isolation in the Linux kernel.',
    badges: ['Intermediate', 'Kernel', 'Security'],
    quote: 'Namespaces provide the isolation layer that gives containers the illusion of being dedicated operating systems.',
    difficulty: 'Intermediate',

    whatIsIt:
      'Linux Namespaces wrap global system resources into isolated abstractions. When a container runs, its processes operate inside dedicated PID (processes), NET (networking), MNT (mount points), IPC (inter-process communication), UTS (hostname), and USER (UID/GID) namespaces.',
    inSimpleWords:
      'Namespaces give containers blinders. Inside a container, PID 1 is your app. The container cannot see or touch other processes running on the main computer.',
    whyDoYouNeedIt:
      'Without namespaces, a process inside one container could inspect or kill processes running in another container or on the host machine.',
    realWorldAnalogy:
      'Soundproof booths in a call center. Operators inside their booth can speak freely without seeing or hearing operators in adjacent booths.',

    syntaxCode: 'docker run --net=bridge --pid=host alpine ps aux',
    syntaxTokens: [
      { token: 'docker run', role: 'Command', explanation: 'Launches container' },
      { token: '--net=bridge', role: 'Flag', explanation: 'Isolates networking in virtual bridge namespace' },
      { token: '--pid=host', role: 'Flag', explanation: 'Shares host PID namespace for diagnostic debugging' },
    ],

    actionStage: {
      before: {
        label: 'Global Host Namespace',
        description: 'Single global PID table (PIDs 1 to 32768) visible on host.',
        stateBadge: 'Global View',
        details: ['PID 1: systemd', 'PID 420: dockerd', 'PID 8901: postgres'],
      },
      running: {
        label: 'Syscall clone(CLONE_NEWPID)',
        description: 'Kernel allocates new namespace structures.',
        stateBadge: 'Syscall Invoked',
        details: ['CLONE_NEWPID', 'CLONE_NEWNET', 'CLONE_NEWNS', 'CLONE_NEWUTS'],
      },
      after: {
        label: 'Container Isolated View',
        description: 'Container main process becomes PID 1 inside its isolated namespace.',
        stateBadge: 'Blind Isolation',
        details: ['Container PID 1: nginx', 'Container PID 2: worker', 'Host PID 12400 (mapped)'],
      },
    },

    variations: [
      { title: 'Share PID with Host', syntax: 'docker run --pid=host alpine ps aux', whatItDoes: 'Allows container to view host process tree' },
    ],

    scenarios: [
      {
        title: 'Network Namespace Isolation',
        question: 'Which namespace gives a container its own virtual network card and IP address?',
        options: [
          { label: 'NET Namespace', command: 'net-ns', isCorrect: true, explanation: 'The NET namespace isolates network devices, IP addresses, routing tables, and firewall rules.' },
          { label: 'UTS Namespace', command: 'uts-ns', isCorrect: false, explanation: 'UTS isolates hostnames.' },
        ],
      },
    ],

    sandbox: {
      initialCommands: ['docker exec web-frontend ps aux'],
      guidedSteps: [
        { instruction: 'Inspect isolated process tree inside web-frontend container', command: 'docker exec web-frontend ps aux', hint: 'Type docker exec web-frontend ps aux' },
      ],
      targetTask: 'Inspect container PID 1 isolation.',
      solutionCommands: ['docker exec web-frontend ps aux'],
    },

    reference: {
      syntaxCheatSheet: [
        'PID NS    # Isolates Process IDs',
        'NET NS    # Isolates Network interfaces & IPs',
        'MNT NS    # Isolates Filesystem mount points',
        'USER NS   # Maps container root to unprivileged host user',
      ],
    },
  },

  'c-cgroups': {
    id: 'c-cgroups',
    command: 'cgget -r memory',
    title: 'cgroups (Control Groups)',
    topicId: 'topic-02',
    topicNumber: '02',
    topicTitle: 'Underlying Linux Technologies',
    subtitle: 'Allocating and throttling CPU, Memory, and I/O resource consumption.',
    badges: ['Intermediate', 'Kernel', 'Performance'],
    quote: 'cgroups ensure no single container can hog system resources and starve other workloads.',
    difficulty: 'Intermediate',

    whatIsIt:
      'Control Groups (cgroups v1/v2) are a Linux kernel feature that limits, accounts for, and isolates resource usage (CPU, Memory, Disk I/O, Network bandwidth) for groups of processes.',
    inSimpleWords:
      'If namespaces give containers blinders (isolation), cgroups give containers handcuffs (resource limits). You can cap a container to use only 512MB of RAM and 1 CPU core so it doesn\'t crash your server.',
    whyDoYouNeedIt:
      'Without cgroups, a buggy container with a memory leak would consume 100% of host RAM, triggering Linux OOM (Out Of Memory) killer and crashing all host applications.',
    realWorldAnalogy:
      'Parental control limits on a smartphone. You cap screen time to 1 hour per day and data usage to 5GB.',

    syntaxCode: 'docker run -d --memory="512m" --cpus="1.5" nginx:alpine',
    syntaxTokens: [
      { token: '--memory="512m"', role: 'Flag', explanation: 'Caps max RAM usage to 512 Megabytes (Triggers OOMKilled if exceeded).' },
      { token: '--cpus="1.5"', role: 'Flag', explanation: 'Limits CPU execution time to 1.5 cores.' },
    ],

    actionStage: {
      before: {
        label: 'Unconstrained Container',
        description: 'Container can consume 100% of host CPU and 32GB RAM.',
        stateBadge: 'Uncapped Risk',
        details: ['RAM: Unlimited', 'CPU: Unlimited', 'Risk of host crash on memory leak'],
      },
      running: {
        label: 'cgroups v2 Quota Enforced',
        description: 'Kernel memory controller sets memory.max and cpu.max.',
        stateBadge: 'Quota Enforced',
        details: ['memory.max = 536870912 bytes', 'cpu.max = 150000 100000'],
      },
      after: {
        label: 'Protected Server Host',
        description: 'Container is strictly constrained within its 512MB boundary.',
        stateBadge: 'Safe & Capped',
        details: ['Max RAM: 512MB', 'CPU quota: 1.5 cores', 'Host protected from noisy neighbors'],
      },
    },

    variations: [
      { title: 'Limit Memory', syntax: 'docker run -m 256m app', whatItDoes: 'Caps RAM to 256MB' },
      { title: 'Limit CPU Cores', syntax: 'docker run --cpus="2" app', whatItDoes: 'Limits execution to 2 CPU cores' },
    ],

    scenarios: [
      {
        title: 'OOMKilled Container',
        question: 'What happens when a container exceeds its cgroups --memory limit?',
        options: [
          { label: 'The kernel OOM killer terminates the container process with exit code 137', command: 'oom-kill', isCorrect: true, explanation: 'Exit code 137 indicates SIGKILL (128 + 9) due to Out Of Memory constraint.' },
          { label: 'The computer reboots', command: 'reboot', isCorrect: false, explanation: 'cgroups protects the host computer from rebooting.' },
        ],
      },
    ],

    sandbox: {
      initialCommands: ['docker run -d --name capped-app --memory="256m" nginx:alpine', 'docker stats --no-stream'],
      guidedSteps: [
        { instruction: 'Launch an Nginx container capped at 256MB memory', command: 'docker run -d --name capped-app --memory="256m" nginx:alpine', hint: 'Run docker run -d --name capped-app --memory="256m" nginx:alpine' },
        { instruction: 'Inspect live container cgroups stats', command: 'docker stats --no-stream', hint: 'Run docker stats --no-stream' },
      ],
      targetTask: 'Enforce cgroups memory limits on a container.',
      solutionCommands: ['docker run -d --name capped-app --memory="256m" nginx:alpine', 'docker stats --no-stream'],
    },

    reference: {
      syntaxCheatSheet: [
        '--memory="512m"    # Hard RAM ceiling',
        '--cpus="2.0"       # Limit CPU cores',
        '--memory-swap="1g"# Memory + Swap total limit',
      ],
    },
  },

  'c-union-filesystems': {
    id: 'c-union-filesystems',
    command: 'mount -t overlay',
    title: 'Union Filesystems (Overlay2)',
    topicId: 'topic-02',
    topicNumber: '02',
    topicTitle: 'Underlying Linux Technologies',
    subtitle: 'Combining read-only image layers with a writeable container layer using Copy-on-Write (CoW).',
    badges: ['Intermediate', 'Kernel', 'Filesystem'],
    quote: 'UnionFS allows files and directories from separate filesystems to be transparently overlaid into a single coherent filesystem.',
    difficulty: 'Intermediate',

    whatIsIt:
      'Union Filesystems (such as Overlay2) merge multiple directories into a single unified view. A Docker container consists of lower read-only image layers overlaid by a thin upper writeable container layer.',
    inSimpleWords:
      'Think of stacked transparent plastic slides. Bottom slides (image layers) contain read-only code. Top slide (container layer) is where you write with dry-erase marker. Erasing or editing a file makes a copy on the top slide (Copy-on-Write).',
    whyDoYouNeedIt:
      'It makes container startup instant and saves disk space. 100 containers sharing the same 200MB base image use 200MB total instead of 20GB.',
    realWorldAnalogy:
      'Tracing paper placed over a printed map. You draw custom routes on the tracing paper without altering the original map underneath.',

    syntaxCode: 'docker diff web-frontend',
    syntaxTokens: [
      { token: 'docker diff', role: 'Command', explanation: 'Displays all file modifications made in the writeable container layer.' },
    ],

    actionStage: {
      before: {
        label: 'Lower Image Layers (Read-Only)',
        description: 'Base OS layers (Alpine + Nginx binaries) stored immutably.',
        stateBadge: 'Read-Only Image Layers',
        details: ['Layer 1: Alpine base (7MB)', 'Layer 2: Nginx package (34MB)', 'Shared across all container instances'],
      },
      running: {
        label: 'Copy-on-Write (CoW) Triggered',
        description: 'Container modifies /etc/nginx/nginx.conf. File is copied to upper container layer.',
        stateBadge: 'Copy-on-Write Action',
        details: ['Original file copied up to Container Write Layer', 'Changes isolated to single container instance'],
      },
      after: {
        label: 'Unified Container View',
        description: 'OverlayFS presents merged view of lower layers + write layer.',
        stateBadge: 'Merged Overlay View',
        details: ['Base image untouched', 'Fast disk savings', 'Changes lost if container is deleted without volume'],
      },
    },

    variations: [
      { title: 'Inspect Container File Changes', syntax: 'docker diff [CONTAINER]', whatItDoes: 'Lists Added (A), Changed (C), or Deleted (D) files in container layer' },
    ],

    scenarios: [
      {
        title: 'Copy-on-Write Behavior',
        question: 'What happens when a container modifies a file that exists in its base read-only image layer?',
        options: [
          { label: 'The file is copied into the container\'s writeable upper layer before modification (Copy-on-Write)', command: 'cow', isCorrect: true, explanation: 'The base image layer remains completely read-only and untouched.' },
          { label: 'The base image file is modified permanently for all other containers', command: 'base-modify', isCorrect: false, explanation: 'Base layers are immutable.' },
        ],
      },
    ],

    sandbox: {
      initialCommands: ['docker diff web-frontend'],
      guidedSteps: [
        { instruction: 'Inspect modified filesystem layers of container web-frontend', command: 'docker diff web-frontend', hint: 'Type docker diff web-frontend' },
      ],
      targetTask: 'Understand Overlay2 Copy-on-Write.',
      solutionCommands: ['docker diff web-frontend'],
    },

    reference: {
      syntaxCheatSheet: [
        'docker diff [CONTAINER]    # List changed files in write layer',
        'A = Added, C = Changed, D = Deleted',
      ],
    },
  },
};
