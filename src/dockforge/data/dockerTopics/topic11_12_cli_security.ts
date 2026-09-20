import { UniversalDockerConcept } from '../unifiedDockerData';

export const TOPIC_11_12_CONCEPTS: Record<string, UniversalDockerConcept> = {
  'c-cli-images': {
    id: 'c-cli-images',
    command: 'docker image prune',
    title: 'Docker CLI: Images',
    topicId: 'topic-11',
    topicNumber: '11',
    topicTitle: 'Docker CLI Mastery',
    subtitle: 'Comprehensive image management: listing, inspecting layer history, tagging, and disk cleanup.',
    badges: ['Beginner', 'CLI', 'Images'],
    quote: 'Managing images effectively keeps build caches fast and frees up unused disk space.',
    difficulty: 'Beginner',

    whatIsIt:
      'The `docker image` command subset (`docker image ls`, `docker image history`, `docker image rm`, `docker image prune`) allows developers to manage local image blueprints and inspect layer history.',
    inSimpleWords:
      '`docker image` commands are your blueprint organizer. You can view all downloaded blueprints (`ls`), see how a blueprint was built line-by-line (`history`), or delete unused blueprints to free up hard drive space (`prune`).',
    whyDoYouNeedIt:
      'Dangling images (tagged `<none>`) build up over time on developer machines and CI build agents, quickly consuming 50GB+ of disk space.',
    realWorldAnalogy:
      'Organizing physical blueprint blueprints in a filing cabinet and shredding old versions you no longer use.',

    syntaxCode: 'docker image ls\ndocker image history nginx:alpine\ndocker image prune -a',
    syntaxTokens: [
      { token: 'docker image ls', role: 'Command', explanation: 'Lists all locally stored images with tags and sizes.' },
      { token: 'docker image history', role: 'Command', explanation: 'Displays every Dockerfile layer command that constructed the image.' },
      { token: 'docker image prune -a', role: 'Command', explanation: 'Removes all unused images not attached to running containers.' },
    ],

    actionStage: {
      before: {
        label: 'Cluttered Disk Space',
        description: 'Dangling images consuming 45GB disk space.',
        stateBadge: 'Dangling Images',
        details: ['15 <none>:<none> images', 'Disk usage: 85%'],
      },
      running: {
        label: 'Prune Command Execution',
        description: 'Docker daemon removes unreferenced image layers.',
        stateBadge: 'Pruning Disk',
        details: ['Deleted: sha256:7f3a9b...', 'Deleted: sha256:1a84f3...'],
      },
      after: {
        label: 'Reclaimed Disk Storage',
        description: 'Reclaimed 40GB of free disk space.',
        stateBadge: 'Disk Reclaimed',
        details: ['Total reclaimed: 41.2GB', 'Only active images retained'],
      },
    },

    variations: [
      { title: 'Inspect Image Layers History', syntax: 'docker image history [IMAGE]', whatItDoes: 'Displays layer build commands and sizes' },
      { title: 'Prune All Unused Images', syntax: 'docker image prune -a -f', whatItDoes: 'Bulk deletes all unused images without confirmation prompt' },
    ],

    scenarios: [
      {
        title: 'Dangling Images',
        question: 'What is a "dangling" image in Docker?',
        options: [
          { label: 'An image layer that is no longer tagged by any repository name and is not used by any container', command: 'dangling-img', isCorrect: true, explanation: 'Dangling images (<none>:<none>) occur when rebuilding images with existing tags.' },
          { label: 'An image stored on a USB stick', command: 'usb-img', isCorrect: false, explanation: 'Incorrect.' },
        ],
      },
    ],

    sandbox: {
      initialCommands: ['docker image ls'],
      guidedSteps: [
        { instruction: 'List all local Docker images', command: 'docker image ls', hint: 'Run docker image ls' },
        { instruction: 'Inspect layer history for nginx:1.25-alpine image', command: 'docker image history nginx:1.25-alpine', hint: 'Run docker image history nginx:1.25-alpine' },
      ],
      targetTask: 'Master Docker image CLI commands.',
      solutionCommands: ['docker image ls', 'docker image history nginx:1.25-alpine'],
    },

    reference: {
      syntaxCheatSheet: [
        'docker image ls                 # List local images',
        'docker image history [IMAGE]    # View layer build history',
        'docker image rm [IMAGE]         # Delete specific image',
        'docker image prune -a           # Clean all unused images',
      ],
    },
  },

  'c-cli-containers': {
    id: 'c-cli-containers',
    command: 'docker ps -a',
    title: 'Docker CLI: Containers',
    topicId: 'topic-11',
    topicNumber: '11',
    topicTitle: 'Docker CLI Mastery',
    subtitle: 'Container subcommands: ps, pause, unpause, rename, kill, and container prune.',
    badges: ['Beginner', 'CLI', 'Containers'],
    quote: 'Managing container state transitions gives you complete control over process execution.',
    difficulty: 'Beginner',

    whatIsIt:
      'The `docker container` command subset (`docker container ls`, `docker container pause`, `docker container unpause`, `docker container rename`, `docker container prune`) provides full lifecycle management of container instances.',
    inSimpleWords:
      '`docker container` commands are your process manager. You can pause a running container (`pause`) to freeze CPU without losing memory state, or rename it (`rename`).',
    whyDoYouNeedIt:
      'Useful for pausing resource-heavy containers temporarily while running tests or renaming containers for clarity.',
    realWorldAnalogy:
      'Pressing the Pause button on a video game console to freeze gameplay temporarily without turning off the console.',

    syntaxCode: 'docker container ls -a\ndocker container pause web-frontend\ndocker container unpause web-frontend',
    syntaxTokens: [
      { token: 'docker container pause', role: 'Command', explanation: 'Freezes all running processes in container using cgroups freezer.' },
      { token: 'docker container unpause', role: 'Command', explanation: 'Resumes execution of paused container processes.' },
    ],

    actionStage: {
      before: {
        label: 'Running Container',
        description: 'web-frontend executing active CPU requests.',
        stateBadge: 'Running',
        details: ['CPU: 2.4%', 'RAM: 18MB'],
      },
      running: {
        label: 'cgroups Freezer Invoked',
        description: 'Freezing process scheduler ticks for container.',
        stateBadge: 'Freezing Processes',
        details: ['SIGSTOP sent to PIDs', 'CPU usage drops to 0%'],
      },
      after: {
        label: 'Paused State',
        description: 'Container status becomes "paused". Memory state retained.',
        stateBadge: 'Paused',
        details: ['Status: Up 2 hours (paused)', 'Zero CPU consumed'],
      },
    },

    variations: [
      { title: 'Pause Container', syntax: 'docker container pause [NAME]', whatItDoes: 'Freezes container processes' },
      { title: 'Unpause Container', syntax: 'docker container unpause [NAME]', whatItDoes: 'Resumes frozen container processes' },
    ],

    scenarios: [
      {
        title: 'Pause vs Stop',
        question: 'What is the main difference between "docker pause" and "docker stop"?',
        options: [
          { label: 'Pause freezes running processes in RAM without terminating them; Stop sends SIGTERM to end processes entirely', command: 'pause-vs-stop', isCorrect: true, explanation: 'Pause uses cgroups freezer; stop terminates PID 1.' },
          { label: 'Pause deletes the container', command: 'del-container', isCorrect: false, explanation: 'Incorrect.' },
        ],
      },
    ],

    sandbox: {
      initialCommands: ['docker ps'],
      guidedSteps: [
        { instruction: 'List all running containers', command: 'docker ps', hint: 'Run docker ps' },
      ],
      targetTask: 'Master container CLI subcommands.',
      solutionCommands: ['docker ps'],
    },

    reference: {
      syntaxCheatSheet: [
        'docker container ls -a',
        'docker container pause [NAME]',
        'docker container unpause [NAME]',
      ],
    },
  },

  'c-cli-volumes': {
    id: 'c-cli-volumes',
    command: 'docker volume prune',
    title: 'Docker CLI: Volumes',
    topicId: 'topic-11',
    topicNumber: '11',
    topicTitle: 'Docker CLI Mastery',
    subtitle: 'Managing persistent volumes: create, inspect, rm, and volume prune.',
    badges: ['Intermediate', 'Storage', 'CLI'],
    quote: 'Volume CLI subcommands provide storage administration and cleanup tools for persistent data.',
    difficulty: 'Intermediate',

    whatIsIt:
      'The `docker volume` command set (`create`, `ls`, `inspect`, `rm`, `prune`) allows storage management for named Docker volumes.',
    inSimpleWords:
      'Use `docker volume` commands to inspect where your database files are stored on disk or to delete old unattached database backup volumes.',
    whyDoYouNeedIt:
      'Prevents orphan volumes from consuming storage space after containers have been deleted.',
    realWorldAnalogy:
      'Managing external USB hard drives on a shelf and discarding old drives you no longer need.',

    syntaxCode: 'docker volume create redis-data\ndocker volume inspect redis-data\ndocker volume prune -f',
    syntaxTokens: [
      { token: 'docker volume prune', role: 'Command', explanation: 'Deletes all unattached named volumes not connected to containers.' },
    ],

    actionStage: {
      before: {
        label: 'Unused Orphan Volumes',
        description: '3 unattached volumes leftover from old database tests.',
        stateBadge: 'Orphan Volumes',
        details: ['Unattached storage: 1.4GB'],
      },
      running: {
        label: 'Prune Execution',
        description: 'Docker removes unused volume directories.',
        stateBadge: 'Purging Volumes',
        details: ['Deleting /var/lib/docker/volumes/test-data'],
      },
      after: {
        label: 'Storage Cleaned',
        description: 'Reclaimed storage space.',
        stateBadge: 'Storage Reclaimed',
        details: ['Reclaimed 1.4GB'],
      },
    },

    variations: [
      { title: 'Prune Unused Volumes', syntax: 'docker volume prune -f', whatItDoes: 'Deletes all unattached volumes' },
    ],

    scenarios: [
      {
        title: 'Volume Pruning Safety',
        question: 'Will "docker volume prune" delete a volume that is currently attached to a RUNNING container?',
        options: [
          { label: 'No, Docker volume prune ONLY deletes unattached volumes that are not in use by any container', command: 'safe-vol-prune', isCorrect: true, explanation: 'In-use volumes are protected from accidental pruning.' },
          { label: 'Yes, it deletes all volumes on the computer', command: 'del-all', isCorrect: false, explanation: 'Incorrect.' },
        ],
      },
    ],

    sandbox: {
      initialCommands: ['docker volume ls'],
      guidedSteps: [
        { instruction: 'List all volumes managed by Docker', command: 'docker volume ls', hint: 'Run docker volume ls' },
      ],
      targetTask: 'Manage Docker volumes via CLI.',
      solutionCommands: ['docker volume ls'],
    },

    reference: {
      syntaxCheatSheet: [
        'docker volume create [NAME]',
        'docker volume ls',
        'docker volume inspect [NAME]',
        'docker volume prune',
      ],
    },
  },

  'c-cli-networks': {
    id: 'c-cli-networks',
    command: 'docker network connect',
    title: 'Docker CLI: Networks',
    topicId: 'topic-11',
    topicNumber: '11',
    topicTitle: 'Docker CLI Mastery',
    subtitle: 'Managing virtual bridge networks, host networking, network inspection, and container attachments.',
    badges: ['Intermediate', 'Networking', 'CLI'],
    quote: 'Docker networks provide isolated virtual switches for inter-container communication and automatic DNS service discovery.',
    difficulty: 'Intermediate',

    whatIsIt:
      'The `docker network` command set (`ls`, `create`, `inspect`, `connect`, `disconnect`, `rm`, `prune`) manages virtual network drivers (`bridge`, `host`, `overlay`, `none`).',
    inSimpleWords:
      'Docker networks are virtual Wi-Fi routers inside your computer. Putting two containers on the same custom network allows them to talk to each other using their container names.',
    whyDoYouNeedIt:
      'Isolates backend databases on private internal networks so they cannot be accessed directly from the public internet.',
    realWorldAnalogy:
      'Connecting your laptop and printer to the same private home Wi-Fi network so they can talk securely.',

    syntaxCode: 'docker network create app-net\ndocker network connect app-net web-frontend\ndocker network inspect app-net',
    syntaxTokens: [
      { token: 'docker network create app-net', role: 'Command', explanation: 'Creates isolated virtual bridge network.' },
      { token: 'docker network connect app-net web-frontend', role: 'Command', explanation: 'Attaches existing container to custom network.' },
    ],

    actionStage: {
      before: {
        label: 'Default Bridge Network',
        description: 'Containers connected to default bridge without automatic DNS.',
        stateBadge: 'Default Bridge',
        details: ['Subnet: 172.17.0.0/16', 'DNS resolution by name DISABLED'],
      },
      running: {
        label: 'Custom Network Creation',
        description: 'Creating custom bridge network with built-in DNS server.',
        stateBadge: 'Custom Bridge',
        details: ['Subnet: 172.18.0.0/16', 'DNS resolution ENABLED'],
      },
      after: {
        label: 'Secure Isolated Mesh',
        description: 'Containers on app-net communicate securely using service names.',
        stateBadge: 'DNS Enabled',
        details: ['web-frontend -> db-postgres', 'Private subnets'],
      },
    },

    variations: [
      { title: 'Create Custom Bridge Network', syntax: 'docker network create my-net', whatItDoes: 'Creates custom bridge network with DNS resolution' },
      { title: 'Connect Container to Network', syntax: 'docker network connect my-net my-container', whatItDoes: 'Hot-plugs container into network' },
    ],

    scenarios: [
      {
        title: 'Custom vs Default Bridge Network',
        question: 'Why do custom user-defined bridge networks offer a major advantage over the default "bridge" network?',
        options: [
          { label: 'Custom bridge networks provide automatic DNS resolution by container name between containers', command: 'dns-advantage', isCorrect: true, explanation: 'Default bridge requires legacy --link or manual IPs; custom bridge resolves container names automatically.' },
          { label: 'Custom networks use satellite dishes', command: 'satellite', isCorrect: false, explanation: 'Incorrect.' },
        ],
      },
    ],

    sandbox: {
      initialCommands: ['docker network ls'],
      guidedSteps: [
        { instruction: 'Create a custom bridge network called "custom-net"', command: 'docker network create custom-net', hint: 'Run docker network create custom-net' },
        { instruction: 'List networks to verify custom-net creation', command: 'docker network ls', hint: 'Run docker network ls' },
      ],
      targetTask: 'Create and inspect custom Docker networks.',
      solutionCommands: ['docker network create custom-net', 'docker network ls'],
    },

    reference: {
      syntaxCheatSheet: [
        'docker network create [NAME]',
        'docker network ls',
        'docker network inspect [NAME]',
        'docker network connect [NET] [CONTAINER]',
      ],
    },
  },

  'c-image-security': {
    id: 'c-image-security',
    command: 'trivy image',
    title: 'Image Security & Vulnerability Scanning',
    topicId: 'topic-12',
    topicNumber: '12',
    topicTitle: 'Container Security',
    subtitle: 'Scanning base OS layers for CVE vulnerabilities, using non-root users, and signing images.',
    badges: ['Advanced', 'Security', 'Hardening'],
    quote: '80% of container security vulnerabilities stem from outdated base OS packages in images.',
    difficulty: 'Advanced',

    whatIsIt:
      'Container Image Security involves scanning images for known CVE vulnerabilities using tools like Trivy or Docker Scout, removing unnecessary package utilities, and switching from `root` to a non-root `USER` instruction in Dockerfiles.',
    inSimpleWords:
      'Don\'t run your app as the Super-Admin (root) inside a container! If a hacker exploits a bug in your app, running as non-root prevents them from taking over the container or host server.',
    whyDoYouNeedIt:
      'Essential for enterprise compliance, SOC2 certification, and preventing container break-out attacks.',
    realWorldAnalogy:
      'Installing a security alarm system and hiring a security guard for a retail store.',

    syntaxCode: '# DOCKERFILE HARDENING:\nFROM node:20-alpine\nWORKDIR /app\nCOPY . .\nUSER node              # Non-root user\nCMD ["node", "server.js"]',
    syntaxTokens: [
      { token: 'USER node', role: 'Security Instruction', explanation: 'Switches process execution from root (UID 0) to unprivileged user (UID 1000).' },
    ],

    actionStage: {
      before: {
        label: 'Vulnerable Root Image',
        description: 'Running as root (UID 0) on Ubuntu base with 42 HIGH CVEs.',
        stateBadge: 'Vulnerable Root',
        details: ['Process UID: 0 (root)', 'Contains gcc, curl, netcat', '42 High/Critical CVEs'],
      },
      running: {
        label: 'Trivy Scan & Hardening',
        description: 'Scanning layers and setting non-root USER instruction.',
        stateBadge: 'Scanning Layers',
        details: ['Base swapped to Alpine 3.19', 'Added USER node (UID 1000)', '0 High CVEs'],
      },
      after: {
        label: 'Hardened Secure Image',
        description: 'Minimal, non-root image ready for zero-trust deployment.',
        stateBadge: 'Hardened & Secure',
        details: ['Process UID: 1000', 'No compilers included', 'Passed vulnerability audit'],
      },
    },

    variations: [
      { title: 'Specify Non-root User', syntax: 'USER 10001', whatItDoes: 'Switches Dockerfile execution to unprivileged UID 10001' },
    ],

    scenarios: [
      {
        title: 'Container Root User Risk',
        question: 'Why is running containers as the default "root" user (UID 0) dangerous?',
        options: [
          { label: 'If an attacker breaches the application, running as root increases the risk of container breakout and host compromise', command: 'root-danger', isCorrect: true, explanation: 'Always enforce least privilege with USER non-root instructions.' },
          { label: 'Root user makes the container turn blue', command: 'color-change', isCorrect: false, explanation: 'Incorrect.' },
        ],
      },
    ],

    sandbox: {
      initialCommands: ['docker images'],
      guidedSteps: [
        { instruction: 'Inspect local images for security hardening', command: 'docker images', hint: 'Run docker images' },
      ],
      targetTask: 'Audit image security best practices.',
      solutionCommands: ['docker images'],
    },

    reference: {
      syntaxCheatSheet: [
        'USER node                             # Switch to non-root',
        'trivy image [IMAGE_NAME]              # Scan image for CVEs',
      ],
    },
  },

  'c-runtime-security': {
    id: 'c-runtime-security',
    command: 'docker run --read-only',
    title: 'Runtime Security Hardening',
    topicId: 'topic-12',
    topicNumber: '12',
    topicTitle: 'Container Security',
    subtitle: 'Enforcing read-only root filesystems, dropping Linux capabilities, and applying Seccomp profiles.',
    badges: ['Advanced', 'Security', 'Hardening'],
    quote: 'Drop all Linux kernel capabilities by default and add back only the specific capabilities required by your application.',
    difficulty: 'Advanced',

    whatIsIt:
      'Runtime Hardening restricts what a running container can do on the Linux kernel using flags like `--read-only` (read-only rootfs), `--cap-drop=ALL` (drops Linux kernel capabilities like `CAP_SYS_ADMIN`), and `--security-opt no-new-privileges`.',
    inSimpleWords:
      'Even if a hacker gets inside your container, runtime security locks all drawers. They cannot modify system files (`--read-only`), install malware, or execute privilege escalation attacks.',
    whyDoYouNeedIt:
      'Prevents malware persistence and lateral movement during zero-day vulnerability exploits.',
    realWorldAnalogy:
      'Putting valuable museum art behind bulletproof glass display cases inside a locked room.',

    syntaxCode: 'docker run -d --read-only --tmpfs /tmp --cap-drop=ALL --cap-add=NET_BIND_SERVICE nginx:alpine',
    syntaxTokens: [
      { token: '--read-only', role: 'Security Flag', explanation: 'Makes container root filesystem 100% read-only.' },
      { token: '--tmpfs /tmp', role: 'Security Flag', explanation: 'Provides temporary in-memory storage for ephemeral app scratch files.' },
      { token: '--cap-drop=ALL', role: 'Security Flag', explanation: 'Strips all Linux kernel privileges from container.' },
    ],

    actionStage: {
      before: {
        label: 'Unrestricted Container Runtime',
        description: 'Writeable rootfs, default Linux capabilities enabled.',
        stateBadge: 'Unrestricted',
        details: ['Rootfs writeable', 'All default capabilities enabled'],
      },
      running: {
        label: 'Runtime Hardening Enforcement',
        description: 'Enforcing read-only rootfs and dropping kernel capabilities.',
        stateBadge: 'Hardening Enforced',
        details: ['Rootfs mounted read-only', 'CAP_SYS_ADMIN dropped', 'Seccomp profile default'],
      },
      after: {
        label: 'Zero-Trust Secure Runtime',
        description: 'Attacker cannot write to /usr or execute privilege escalation.',
        stateBadge: 'Zero-Trust Active',
        details: ['Rootfs read-only', 'Malware write attempts fail', 'Maximum isolation'],
      },
    },

    variations: [
      { title: 'Read-only Root Filesystem', syntax: 'docker run --read-only --tmpfs /tmp app', whatItDoes: 'Mounts rootfs read-only with ephemeral in-memory /tmp' },
      { title: 'Drop All Capabilities', syntax: 'docker run --cap-drop=ALL app', whatItDoes: 'Strips all Linux kernel capabilities' },
    ],

    scenarios: [
      {
        title: 'Linux Kernel Capability Hardening',
        question: 'What flag strips all Linux kernel capabilities from a container to prevent privilege escalation?',
        options: [
          { label: '--cap-drop=ALL', command: 'cap-drop-all', isCorrect: true, explanation: '--cap-drop=ALL removes all Linux capabilities, enforcing least privilege.' },
          { label: '--no-security', command: 'no-sec', isCorrect: false, explanation: 'Incorrect.' },
        ],
      },
    ],

    sandbox: {
      initialCommands: ['docker ps'],
      guidedSteps: [
        { instruction: 'Run a hardened Nginx container with read-only rootfs and tmpfs /tmp', command: 'docker run -d --name hardened-nginx --read-only --tmpfs /tmp -p 8082:80 nginx:alpine', hint: 'Run docker run -d --name hardened-nginx --read-only --tmpfs /tmp -p 8082:80 nginx:alpine' },
        { instruction: 'Verify hardened container status', command: 'docker ps', hint: 'Run docker ps' },
      ],
      targetTask: 'Enforce runtime security flags.',
      solutionCommands: ['docker run -d --name hardened-nginx --read-only --tmpfs /tmp -p 8082:80 nginx:alpine'],
    },

    reference: {
      syntaxCheatSheet: [
        '--read-only                      # Read-only root filesystem',
        '--tmpfs /tmp                     # In-memory temporary directory',
        '--cap-drop=ALL                   # Drop all kernel capabilities',
        '--security-opt no-new-privileges # Block privilege escalation',
      ],
    },
  },
};
