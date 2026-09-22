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
      'A container is a lightweight isolated environment that runs an application and everything it needs (code, runtime, dependencies, system tools).',
    inSimpleWords:
      'Think of a container as a small box for your application. Your application lives inside the box. The box keeps it separated from other applications on your computer. Docker creates and manages these boxes.',
    whyDoYouNeedIt:
      'Without containers, installing different versions of Python, Node.js, or PostgreSQL on host servers causes version conflicts ("works on my laptop but broke on production server"). Containers eliminate this pain entirely.',
    realWorldAnalogy:
      'A hotel guest room. Each guest has their own private bathroom, bed, key card, and TV (isolated environment), but all rooms share the hotel foundation, electrical grid, and plumbing (shared host kernel).',

    withoutVsWith: {
      without: {
        title: 'WITHOUT CONTAINERS',
        items: [
          'Developer A has Node 20, Developer B has Node 18',
          'Global package pollution on host computer',
          'Missing database dependencies on production server',
          'Manual setup instructions per developer machine',
        ],
        outcome: '💥 "Works on my machine" bugs and production downtime',
      },
      with: {
        title: 'WITH CONTAINERS',
        items: [
          'App bundled with exact Node, Python & library versions',
          'Identical execution on Mac, Windows, Linux & Cloud',
          'Instant startup in under a second',
          'Zero pollution of host machine files',
        ],
        outcome: '📦 Guaranteed identical, isolated execution everywhere',
      },
    },

    blockDiagram: {
      title: 'Host Machine & Container Isolation Boundary',
      subtitle: 'Click any block below to inspect Simple vs Technical definitions:',
      nodes: [
        {
          id: 'host-os',
          label: 'Host Operating System (Linux Kernel)',
          simpleDef: 'The underlying computer operating system running Docker.',
          techDef: 'The Linux kernel providing namespaces, cgroups, and syscall interface to containers.',
          badge: 'Host OS',
          color: '#38bdf8',
        },
        {
          id: 'container-box',
          label: 'Container Boundary (Isolated Process)',
          simpleDef: 'An isolated box separating your app from the host OS and other apps.',
          techDef: 'An isolated user-space process environment (PID & Net namespaces) sharing host kernel syscalls.',
          badge: 'Container',
          color: '#4ade80',
        },
        {
          id: 'app-files',
          label: 'Application + Libraries + Config',
          simpleDef: 'Your application source code and required dependencies.',
          techDef: 'Copy-on-write OverlayFS layer stacked on top of immutable image layers.',
          badge: 'App Code',
          color: '#facc15',
        },
      ],
    },

    terms: [
      {
        term: 'Container',
        simple: 'A box-like isolated environment for running an application.',
        technical: 'An isolated user-space process constructed using Linux namespaces (PID, Net, Mnt) and cgroups.',
        analogy: 'A guest room in a hotel with its own key and bathroom.',
        related: ['Image', 'Host Machine', 'Container Runtime'],
      },
      {
        term: 'Host Machine',
        simple: 'The physical or virtual computer running Docker.',
        technical: 'The OS kernel executing the Docker daemon and managing hardware resources.',
        analogy: 'The hotel building containing all guest rooms.',
        related: ['Container', 'Kernel'],
      },
      {
        term: 'Image',
        simple: 'A read-only packaged template used to create containers.',
        technical: 'An immutable bundle of rootfs filesystem layers defined by OCI container specs.',
        analogy: 'A cookie cutter or architectural blueprint.',
        related: ['Container', 'Registry'],
      },
      {
        term: 'Container Runtime',
        simple: 'The engine software responsible for starting and managing containers.',
        technical: 'Low-level component (e.g. runc, containerd) interfacing with Linux syscalls.',
        analogy: 'The hotel management team checking keys and rooms.',
        related: ['Docker Engine', 'runc'],
      },
    ],

    syntaxCode: 'docker run -d -p 8080:80 --name webserver nginx',
    syntaxTokens: [
      { token: 'docker', role: 'CLI Tool', explanation: 'The Docker Command-Line Interface client.' },
      { token: 'run', role: 'Command', explanation: 'Create and start a new container from an image.' },
      { token: '-d', role: 'Flag', explanation: 'Detached mode: runs container in background without locking terminal.' },
      { token: '-p 8080:80', role: 'Flag', explanation: 'Publish port: maps host port 8080 to container internal port 80.' },
      { token: '--name webserver', role: 'Flag', explanation: 'Assigns a predictable human-readable name "webserver".' },
      { token: 'nginx', role: 'Image', explanation: 'The official Nginx web server image from Docker Hub.' },
    ],

    variations: [
      {
        title: 'Base Foregound Execution',
        syntax: 'docker run nginx',
        whatItDoes: 'Runs Nginx in foreground, attaching server logs directly to current terminal.',
        whenToUse: 'Quick manual testing or watching real-time stdout logs.',
        warning: 'Locks current terminal tab until Ctrl+C is pressed.',
      },
      {
        title: 'Detached Background Server',
        syntax: 'docker run -d nginx',
        whatItDoes: 'Runs container silently in background, returning container ID immediately.',
        whenToUse: 'Running web servers, APIs, and background daemons.',
      },
      {
        title: 'Port-Mapped Web Server',
        syntax: 'docker run -d -p 8080:80 nginx',
        whatItDoes: 'Maps host port 8080 to container port 80, making Nginx accessible in browser.',
        whenToUse: 'When you need to access web applications running inside container.',
      },
      {
        title: 'Named & Disposable Container',
        syntax: 'docker run --name my-app --rm -d -p 8080:80 nginx',
        whatItDoes: 'Assigns name "my-app" and automatically deletes container disk files when stopped.',
        whenToUse: 'Clean development runs and CI testing pipelines.',
      },
    ],

    whenToUse: [
      '✓ Running isolated applications without installing local system dependencies',
      '✓ Guaranteeing identical runtime behavior across Mac, Windows, Linux, and Cloud',
      '✓ Running microservices and backend databases (PostgreSQL, Redis, Nginx)',
      '✓ Continuous Integration and Automated Testing pipelines',
    ],

    whenNotToUse: [
      '✕ When persistent data is required without mounting a Docker Volume',
      '✕ When running legacy GUI applications needing direct host GPU display drivers',
      '✕ When you mistake stopping a container for deleting its disk state',
    ],

    developerScenario: {
      title: 'Real Developer Scenario: Eliminating "Works on My Machine"',
      setup: 'Developer A works on macOS with Node.js 20 installed globally. Developer B works on Windows 11 with Node.js 18.',
      problem: 'Developer A commits code using new Node 20 features. Developer B pulls the code and it crashes instantly.',
      solution: 'Instead of forcing everyone to reinstall Node, they package the app into a Docker container. Both run "docker run my-node-app" and execute on 100% identical Node environments.',
    },

    internalFlow: [
      { step: 1, title: 'CLI Receives Command', desc: 'Docker CLI validates flags and sends REST request to Docker Daemon socket.', why: 'Translates terminal command into API payload.', techDetail: 'POST /v1.43/containers/create' },
      { step: 2, title: 'Image Check', desc: 'Daemon checks if "nginx:latest" exists in local image store.', why: 'Avoids redundant network downloads if image is cached.', techDetail: 'Queries local overlay2 storage driver' },
      { step: 3, title: 'Registry Pull (If Missing)', desc: 'If absent locally, Daemon pulls image layers from Docker Hub.', why: 'Downloads immutable filesystem binaries.', techDetail: 'HTTPS GET registry-1.docker.io' },
      { step: 4, title: 'Create Container Layer', desc: 'Daemon creates a read-write thin layer on top of read-only image layers.', why: 'Isolates container disk changes from base image.', techDetail: 'Mounts OverlayFS union filesystem' },
      { step: 5, title: 'Attach Network & Ports', desc: 'Daemon allocates virtual IP (172.17.0.2) and sets up iptables port forwarding (8080->80).', why: 'Connects container to network interface.', techDetail: 'Creates veth pair & iptables DNAT rule' },
      { step: 6, title: 'Start Process (RUNNING)', desc: 'Container runtime (runc) executes PID 1 inside isolated namespaces.', why: 'Nginx is now running and isolated.', techDetail: 'runc start container_id' },
    ],

    commonMistakes: [
      {
        mistake: 'Thinking "docker run" only downloads an image.',
        whyWrong: '"docker run" pulls image, creates container filesystem, configures network, AND starts process.',
        correctWay: 'Use "docker pull" if you only want to download without running.',
      },
      {
        mistake: 'Confusing Image vs Container.',
        whyWrong: 'An Image is a read-only template (like a recipe). A Container is the active running instance (like cooked food).',
        correctWay: 'Build an Image once, spawn many Containers from it.',
      },
      {
        mistake: 'Believing stopping a container deletes its files.',
        whyWrong: 'Stopping a container halts PID 1, but disk layers remain until "docker rm".',
        correctWay: 'Use "docker rm" to permanently delete stopped containers.',
      },
    ],

    recapChecklist: [
      'A container is an isolated user-space process sharing the host OS kernel.',
      'Containers eliminate "works on my machine" bugs by bundling app + dependencies.',
      '"docker run -d -p 8080:80" creates a background container mapped to host port 8080.',
      'Stopping a container (docker stop) halts execution; removing it (docker rm) deletes files.',
    ],

    challenge: {
      question: 'Which flag allows a web application inside a container to be accessed from your computer browser at http://localhost:8080?',
      options: [
        { label: '-p 8080:80', isCorrect: true, explanation: 'Correct! -p 8080:80 publishes host port 8080 to container internal port 80.' },
        { label: '-d', isCorrect: false, explanation: '-d runs the container in detached (background) mode, but does not publish ports.' },
        { label: '--name 8080', isCorrect: false, explanation: '--name sets the container name, not port mapping.' },
      ],
    },

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
      targetTask: 'Launch an isolated Nginx container on port 8080 in background mode.',
      solutionCommands: ['docker run -d -p 8080:80 nginx'],
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
        'Always run background web servers with detached flag -d.',
        'Use explicit port mapping -p host_port:container_port to expose ports.',
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

    
    withoutVsWith: {
      without: {
        title: 'WITHOUT CONTAINERS',
        items: [
          'Code fails on production due to missing libssl library',
          'Team onboarding takes 3 days to install matching dependencies',
          'Database version mismatch between devs causes subtle bugs',
          'Requires manual environment configuration scripts',
        ],
        outcome: '💥 Frustrating "works on my machine" errors and slow deployments',
      },
      with: {
        title: 'WITH CONTAINERS',
        items: [
          'App bundles precise runtime (e.g., Node.js 20.9.0) and all libraries',
          'New developers type "docker compose up" and start coding in 2 minutes',
          'Identical environment on Mac laptop, CI server, and AWS production',
          'Eliminates need for local databases or runtime installations',
        ],
        outcome: '🚀 Predictable, frictionless deployments anywhere',
      },
    },

    blockDiagram: {
      title: 'Container Portability',
      subtitle: 'Click blocks to see how containers solve dependency hell:',
      nodes: [
        {
          id: 'dev-laptop',
          label: 'Developer Laptop',
          simpleDef: 'Your local machine where code is written.',
          techDef: 'Docker engine provides the build context and runtime.',
          badge: 'Source',
          color: '#38bdf8',
        },
        {
          id: 'container-image',
          label: 'Immutable Image',
          simpleDef: 'The packaged code and everything needed to run it.',
          techDef: 'OCI-compliant archive of filesystem layers.',
          badge: 'Artifact',
          color: '#facc15',
        },
        {
          id: 'prod-server',
          label: 'Production Server',
          simpleDef: 'The live server running the application.',
          techDef: 'Docker engine pulls the image and runs the isolated process.',
          badge: 'Destination',
          color: '#4ade80',
        },
      ],
    },

    terms: [
      {
        term: 'Environment Parity',
        simple: 'Keeping your dev, testing, and live servers exactly the same.',
        technical: 'Guaranteeing identical OS libraries and language runtimes.',
        analogy: 'Using exact same soil and water to grow a plant in different places.',
        related: ['Immutable Infrastructure'],
      },
      {
        term: 'Dependency Hell',
        simple: 'When installing one software breaks another because they need different versions.',
        technical: 'Transitive dependency conflicts in shared system library paths.',
        analogy: 'Building two LEGO sets requiring the same unique piece.',
        related: ['Containerization'],
      },
      {
        term: 'Portability',
        simple: 'The ability to run the exact same app anywhere without changes.',
        technical: 'Acoupling the application from host OS by bundling rootfs.',
        analogy: 'Universal power adapter.',
        related: ['OCI', 'Docker Image'],
      }
    ],

    whenToUse: [
      '✓ When deploying microservices to the cloud',
      '✓ When onboarding new developers to a complex project stack',
      '✓ When you need to run multiple versions of the same language locally',
      '✓ In Continuous Integration (CI) systems to ensure isolated test runs',
    ],

    whenNotToUse: [
      '✕ When developing low-level drivers that must interact deeply with host OS',
      '✕ When maximum raw performance is required with zero overhead',
    ],

    developerScenario: {
      title: 'Real Developer Scenario: The Onboarding Nightmare',
      setup: 'New dev joins team using Node 18, Python 3.9, and Postgres 14.',
      problem: 'Dev spends 2 days setting up local env, but apps crash due to wrong versions.',
      solution: 'Team switches to Docker. New dev runs "docker-compose up" and everything boots perfectly in minutes.',
    },

    internalFlow: [
      { step: 1, title: 'Write Dockerfile', desc: 'Dev defines base OS, deps, and code.', why: 'Codifies the environment.', techDetail: 'FROM node:20-alpine' },
      { step: 2, title: 'Build Image', desc: 'Docker builds immutable layers.', why: 'Creates the portable artifact.', techDetail: 'docker build -t app:v1 .' },
      { step: 3, title: 'Push to Registry', desc: 'Image is uploaded to central hub.', why: 'Accessible to other machines.', techDetail: 'POST /v2/app/blobs/' },
      { step: 4, title: 'Pull on Prod', desc: 'Prod server downloads exact image.', why: 'Ensures identical environment.', techDetail: 'GET /v2/app/manifests/v1' },
      { step: 5, title: 'Run Container', desc: 'Docker starts isolated process.', why: 'App goes live without host config.', techDetail: 'docker run -d app:v1' },
    ],

    commonMistakes: [
      {
        mistake: 'Installing dependencies manually inside a running container',
        whyWrong: 'Containers are ephemeral. Manual changes vanish on restart.',
        correctWay: 'Always define dependencies in the Dockerfile.',
      },
      {
        mistake: 'Hardcoding environment-specific configs',
        whyWrong: 'Images should be portable. Hardcoding breaks this.',
        correctWay: 'Pass configs at runtime using environment variables.',
      },
    ],

    recapChecklist: [
      'Containers eliminate "works on my machine" bugs.',
      'Images provide an immutable snapshot of an app environment.',
      'Containers drastically speed up developer onboarding.',
    ],

    challenge: {
      question: 'How do containers solve the "works on my machine" problem?',
      options: [
        { label: 'By installing a full Guest OS to guarantee compatibility.', isCorrect: false, explanation: 'That is what a VM does.' },
        { label: 'By packaging the application code along with its required libraries into an immutable image.', isCorrect: true, explanation: 'Containers bundle everything needed to run the app.' },
        { label: 'By upgrading the host machine software automatically.', isCorrect: false, explanation: 'Containers do not alter the host machine.' },
      ],
    },

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
        { instruction: 'Run an application container in detached mode with port mapping', command: 'docker run -d -p 3000:3000 my-company-app:v1.0', hint: 'Type docker run -d -p 3000:3000 my-company-app:v1.0' },
      ],
      targetTask: 'Deploy a containerized application ensuring environment consistency.',
      solutionCommands: ['docker run -d -p 3000:3000 my-company-app:v1.0'],
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

    
    withoutVsWith: {
      without: {
        title: 'VIRTUAL MACHINES',
        items: [
          'Requires gigabytes of RAM just for the Guest OS',
          'Boot times measured in minutes',
          'Hypervisor tax limits server density',
          'Requires managing multiple separate OS updates',
        ],
        outcome: '🐢 Heavy resource overhead and slow scaling',
      },
      with: {
        title: 'CONTAINERS',
        items: [
          'Megabytes of RAM footprint per application',
          'Boot times measured in milliseconds',
          'High density (hundreds of containers on one host)',
          'Shared kernel means no Guest OS maintenance',
        ],
        outcome: '⚡ Lightning fast scaling and high resource utilization',
      },
    },

    blockDiagram: {
      title: 'VMs vs Containers Architecture',
      subtitle: 'Click blocks to compare architectures:',
      nodes: [
        {
          id: 'hypervisor',
          label: 'Hypervisor',
          simpleDef: 'Software that emulates physical hardware.',
          techDef: 'Type-1 or Type-2 virtualization layer managing CPU ring-privileges.',
          badge: 'Heavy',
          color: '#f87171',
        },
        {
          id: 'guest-os',
          label: 'Guest OS',
          simpleDef: 'Full heavy operating system inside a VM.',
          techDef: 'Complete kernel and init system duplicating host OS functions.',
          badge: 'Heavy',
          color: '#facc15',
        },
        {
          id: 'docker-engine',
          label: 'Container Runtime',
          simpleDef: 'Lightweight software that isolates apps natively.',
          techDef: 'Manages namespaces and cgroups to sandbox processes natively in the kernel.',
          badge: 'Lightweight',
          color: '#4ade80',
        },
      ],
    },

    terms: [
      {
        term: 'Hypervisor',
        simple: 'Software that creates and runs Virtual Machines.',
        technical: 'VMM that traps and emulates privileged CPU instructions.',
        analogy: 'Real estate developer dividing land into separate houses.',
        related: ['Virtual Machine'],
      },
      {
        term: 'Guest OS',
        simple: 'Full operating system installed inside a VM.',
        technical: 'Dedicated kernel stack in a virtualized hardware environment.',
        analogy: 'Hiring a full-time chef for every room.',
        related: ['Hypervisor'],
      },
      {
        term: 'Kernel Sharing',
        simple: 'Containers using the same OS brain.',
        technical: 'Processes making direct syscalls to host Linux kernel.',
        analogy: 'Apps sharing the same electricity grid.',
        related: ['Namespaces'],
      }
    ],

    whenToUse: [
      '✓ Use Containers for microservices and stateless workloads',
      '✓ Use Containers to maximize server density and reduce costs',
      '✓ Use VMs when you need to run a different OS entirely (Windows on Linux)',
      '✓ Use VMs when you require absolute hardware-level security isolation',
    ],

    whenNotToUse: [
      '✕ Do not use Containers if you need a custom kernel version',
      '✕ Do not use VMs for simple background workers where low RAM is critical',
    ],

    developerScenario: {
      title: 'Real Developer Scenario: Cloud Cost Optimization',
      setup: 'Company runs 20 web apps on 20 separate VMs in AWS.',
      problem: 'Each VM uses 2GB of RAM for Guest OS, wasting money on idle OS overhead.',
      solution: 'Migrate to Docker. All 20 apps run on one large EC2 instance, dropping RAM usage by 80%.',
    },

    internalFlow: [
      { step: 1, title: 'VM Boot (Heavy)', desc: 'Hypervisor allocates virtual hardware and boots Guest OS.', why: 'Simulates physical hardware.', techDetail: 'Hardware trap and emulate' },
      { step: 2, title: 'VM Kernel Init', desc: 'Guest OS initializes drivers, starts init system.', why: 'Takes 1-3 minutes.', techDetail: 'dmesg inside guest' },
      { step: 3, title: 'Container Boot (Fast)', desc: 'Docker creates namespace boundaries.', why: 'No hardware emulation required.', techDetail: 'clone() syscall with CLONE_NEWPID' },
      { step: 4, title: 'Container Execution', desc: 'App process starts instantly.', why: 'Boot time is in milliseconds.', techDetail: 'execve("/app/server")' },
    ],

    commonMistakes: [
      {
        mistake: 'Treating a container exactly like a VM',
        whyWrong: 'Running SSHd, cron, and syslog inside one container violates the pattern.',
        correctWay: 'Use "docker exec" for shell access and separate services into multiple containers.',
      },
      {
        mistake: 'Assuming containers are as secure as VMs',
        whyWrong: 'Containers share the host kernel. Severe kernel exploits could allow breakouts.',
        correctWay: 'Use VMs for untrusted multi-tenant workloads.',
      },
    ],

    recapChecklist: [
      'VMs virtualize hardware; Containers virtualize the OS.',
      'VMs require a full Guest OS; Containers share Host Kernel.',
      'Containers offer millisecond startup and high server density.',
    ],

    challenge: {
      question: 'Why do Docker containers start in milliseconds while VMs take minutes?',
      options: [
        { label: 'Containers skip BIOS but boot a lightweight Guest OS.', isCorrect: false, explanation: 'Containers do not boot a Guest OS.' },
        { label: 'Containers do not boot an OS; they start an isolated process.', isCorrect: true, explanation: 'Because there is no OS boot sequence, it starts instantly.' },
        { label: 'Containers pre-allocate RAM at build time.', isCorrect: false, explanation: 'Resource allocation happens at runtime.' },
      ],
    },




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
      initialCommands: ['docker run -d --name test-nginx nginx'],
      guidedSteps: [
        { instruction: 'Compare resource usage using docker stats', command: 'docker stats', hint: 'Type docker stats' },
      ],
      targetTask: 'Observe the low footprint of a container compared to a VM.',
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

    
    withoutVsWith: {
      without: {
        title: 'WITHOUT OCI STANDARDS',
        items: [
          'Vendor lock-in to a single container runtime (e.g., just Docker)',
          'Images built by Tool A cannot run on Kubernetes',
          'Fragmented ecosystem with incompatible toolchains',
        ],
        outcome: '🔒 Proprietary technology silos',
      },
      with: {
        title: 'WITH OCI STANDARDS',
        items: [
          'Build once, run anywhere (Docker, Podman, Kubernetes)',
          'Modular ecosystem (swap containerd for CRI-O)',
          'Guaranteed forward-compatibility for container images',
        ],
        outcome: '🔓 Open ecosystem and vendor neutrality',
      },
    },

    blockDiagram: {
      title: 'Docker to Kernel Architecture',
      subtitle: 'Click blocks to trace a command from CLI to Kernel:',
      nodes: [
        {
          id: 'docker-cli',
          label: 'Docker CLI / API',
          simpleDef: 'The terminal tool you interact with.',
          techDef: 'Sends REST API payloads to the dockerd socket.',
          badge: 'Client',
          color: '#38bdf8',
        },
        {
          id: 'containerd',
          label: 'containerd',
          simpleDef: 'High-level container manager.',
          techDef: 'Manages image pulling, storage, and passes execution to runc via gRPC.',
          badge: 'Manager',
          color: '#facc15',
        },
        {
          id: 'runc',
          label: 'runc',
          simpleDef: 'Low-level OCI runtime that actually creates the container.',
          techDef: 'Interacts with Linux kernel namespaces/cgroups to spawn the isolated process.',
          badge: 'OCI Runtime',
          color: '#4ade80',
        },
      ],
    },

    terms: [
      {
        term: 'OCI (Open Container Initiative)',
        simple: 'The organization that defines how containers should be built and run.',
        technical: 'Governance structure defining the Image Spec and Runtime Spec.',
        analogy: 'The USB standard that ensures any flash drive works on any computer.',
        related: ['runc', 'containerd'],
      },
      {
        term: 'runc',
        simple: 'The low-level tool that actually creates your container.',
        technical: 'The reference implementation of the OCI Runtime Spec.',
        analogy: 'The construction worker actually laying the bricks.',
        related: ['containerd'],
      },
      {
        term: 'containerd',
        simple: 'The middle-manager that downloads images and supervises containers.',
        technical: 'Industry-standard container runtime managing lifecycle and image distribution.',
        analogy: 'The site foreman who organizes materials and tells workers what to do.',
        related: ['Docker Daemon'],
      }
    ],

    whenToUse: [
      '✓ When debugging low-level container startup failures',
      '✓ When choosing runtimes for a Kubernetes cluster (e.g., containerd vs CRI-O)',
      '✓ When evaluating alternative container tools like Podman or Buildah',
    ],

    whenNotToUse: [
      '✕ As a beginner, you rarely need to interact with runc or containerd directly',
    ],

    developerScenario: {
      title: 'Real Developer Scenario: Migrating from Docker to Kubernetes',
      setup: 'A team built hundreds of container images using Docker over the past 3 years.',
      problem: 'They are migrating to a Kubernetes cluster that uses containerd instead of Docker Engine. Management worries about rewriting apps.',
      solution: 'Because Docker builds OCI-compliant images, they deploy perfectly on Kubernetes without modifying a single line of code.',
    },

    internalFlow: [
      { step: 1, title: 'CLI to Daemon', desc: 'Docker CLI sends command to dockerd.', why: 'Translates user intent.', techDetail: 'POST /containers/create' },
      { step: 2, title: 'Daemon to containerd', desc: 'dockerd asks containerd to prepare the container.', why: 'Delegates lifecycle management.', techDetail: 'gRPC call to containerd socket' },
      { step: 3, title: 'containerd to runc', desc: 'containerd launches runc with OCI config.', why: 'Invokes the low-level runtime.', techDetail: 'runc create / runc start' },
      { step: 4, title: 'runc to Kernel', desc: 'runc calls Linux syscalls to create namespaces.', why: 'Actually isolates the process.', techDetail: 'clone() syscall' },
      { step: 5, title: 'runc Exits', desc: 'runc exits while containerd-shim monitors the app.', why: 'Keeps memory overhead low.', techDetail: 'containerd-shim keeps stdin/out open' },
    ],

    commonMistakes: [
      {
        mistake: 'Thinking Docker is the only way to run containers',
        whyWrong: 'Docker is just one toolchain that implements OCI standards.',
        correctWay: 'Understand that Kubernetes, Podman, and containerd are all valid OCI runtimes.',
      },
      {
        mistake: 'Confusing Docker Image with OCI Image',
        whyWrong: 'Modern "Docker Images" are actually OCI Images under the hood.',
        correctWay: 'Use the terms interchangeably in modern contexts, but know OCI is the standard.',
      },
    ],

    recapChecklist: [
      'OCI ensures containers are an open standard, not locked to Docker.',
      'Docker CLI uses dockerd, which uses containerd, which uses runc.',
      'runc is the low-level runtime that actually talks to the Linux kernel.',
    ],

    challenge: {
      question: 'What is the primary role of runc in the container architecture?',
      options: [
        { label: 'It downloads images from Docker Hub.', isCorrect: false, explanation: 'containerd handles image pulling.' },
        { label: 'It is the low-level OCI runtime that interacts with the Linux kernel to create isolated processes.', isCorrect: true, explanation: 'runc performs the actual namespace/cgroup syscalls.' },
        { label: 'It provides a graphical user interface for Docker.', isCorrect: false, explanation: 'Docker Desktop provides the GUI.' },
      ],
    },




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
        { instruction: 'Inspect OCI runtime components (containerd, runc)', command: 'docker version', hint: 'Type docker version' },
      ],
      targetTask: 'Understand the underlying container runtime components.',
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

    
    withoutVsWith: {
      without: {
        title: 'WITHOUT NAMESPACES',
        items: [
          'All processes share the same process ID tree',
          'Any root process can inspect or kill any other process',
          'Ports clash (only one app can listen on port 80)',
        ],
        outcome: '🚨 Zero process isolation or security',
      },
      with: {
        title: 'WITH NAMESPACES',
        items: [
          'App thinks it is PID 1 on a dedicated machine',
          'Cannot see or interact with host processes',
          'Has its own isolated network stack and IP address',
        ],
        outcome: '🛡️ Perfect illusion of a dedicated operating system',
      },
    },

    blockDiagram: {
      title: 'Linux Namespace Isolation',
      subtitle: 'Click blocks to see how namespaces create the container illusion:',
      nodes: [
        {
          id: 'pid-ns',
          label: 'PID Namespace',
          simpleDef: 'Isolates process IDs.',
          techDef: 'Maps host PID (e.g. 15400) to container PID 1.',
          badge: 'Process',
          color: '#38bdf8',
        },
        {
          id: 'net-ns',
          label: 'NET Namespace',
          simpleDef: 'Isolates networking interfaces.',
          techDef: 'Provides independent IPv4 stack, routes, and iptables rules.',
          badge: 'Network',
          color: '#4ade80',
        },
        {
          id: 'mnt-ns',
          label: 'MNT Namespace',
          simpleDef: 'Isolates filesystem mounts.',
          techDef: 'Allows the container to have a unique root filesystem (/) distinct from the host.',
          badge: 'Storage',
          color: '#facc15',
        },
      ],
    },

    terms: [
      {
        term: 'PID Namespace',
        simple: 'Hides host processes from the container.',
        technical: 'Provides an isolated process ID number space where the container init is PID 1.',
        analogy: 'A student who thinks they are the only person in the entire school.',
        related: ['Process Isolation'],
      },
      {
        term: 'NET Namespace',
        simple: 'Gives the container its own network card and IP.',
        technical: 'Isolates system network stacks, routing tables, and firewall rules.',
        analogy: 'A private telephone line that doesn\'t connect to the main switchboard.',
        related: ['veth pairs'],
      },
      {
        term: 'MNT Namespace',
        simple: 'Gives the container its own hard drive structure.',
        technical: 'Isolates mount points so the container perceives a unique root filesystem hierarchy.',
        analogy: 'A virtual file cabinet separate from the main office cabinet.',
        related: ['chroot'],
      }
    ],

    whenToUse: [
      '✓ When you need to isolate untrusted code execution',
      '✓ When you want to run multiple copies of a web server on the same physical host without port conflicts',
      '✓ When debugging container boundaries (e.g., joining a namespace manually via nsenter)',
    ],

    whenNotToUse: [
      '✕ Avoid sharing the host PID or NET namespaces (--net=host) unless absolutely necessary, as it breaks isolation',
    ],

    developerScenario: {
      title: 'Real Developer Scenario: Port Conflict Resolution',
      setup: 'A developer needs to run three different PHP projects locally, all of which hardcode port 80 for their web servers.',
      problem: 'Running them directly on the host fails because only one process can bind to port 80 at a time.',
      solution: 'By using Docker, each app runs in its own NET namespace. They all bind to port 80 internally, and Docker maps them to 8081, 8082, and 8083 on the host.',
    },

    internalFlow: [
      { step: 1, title: 'Syscall clone()', desc: 'Docker uses clone() with CLONE_NEW* flags.', why: 'Instructs kernel to create namespaces.', techDetail: 'CLONE_NEWPID | CLONE_NEWNET' },
      { step: 2, title: 'PID Mapping', desc: 'Kernel maps host PID to container PID 1.', why: 'Creates the PID illusion.', techDetail: '/proc/<pid>/ns/' },
      { step: 3, title: 'Network Veth Pair', desc: 'Kernel connects host bridge to container NET namespace.', why: 'Allows outbound internet access.', techDetail: 'veth interface creation' },
      { step: 4, title: 'Pivot Root', desc: 'Container MNT namespace root is switched to the image rootfs.', why: 'Hides the host filesystem.', techDetail: 'pivot_root() syscall' },
    ],

    commonMistakes: [
      {
        mistake: 'Assuming container root user is safe',
        whyWrong: 'By default, root inside the container is root on the host. If a container breaks out, it has full privileges.',
        correctWay: 'Use USER namespaces to map container root to an unprivileged host user, or run apps as non-root.',
      },
    ],

    recapChecklist: [
      'Namespaces provide isolation (the "blinders" for a container).',
      'PID namespace ensures the container only sees its own processes.',
      'NET namespace provides isolated IP addresses and ports.',
      'MNT namespace provides an isolated filesystem view.',
    ],

    challenge: {
      question: 'Which namespace is responsible for ensuring a container cannot see or kill processes running on the host machine?',
      options: [
        { label: 'NET Namespace', isCorrect: false, explanation: 'NET handles networking, not processes.' },
        { label: 'PID Namespace', isCorrect: true, explanation: 'The Process ID namespace isolates the process tree.' },
        { label: 'MNT Namespace', isCorrect: false, explanation: 'MNT handles the filesystem view.' },
      ],
    },




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
      initialCommands: ['unshare --pid --fork --mount-proc /bin/sh -c "ps aux"'],
      guidedSteps: [
        { instruction: 'Use unshare to simulate a PID namespace and view isolated processes', command: 'unshare --pid --fork --mount-proc /bin/sh -c "ps aux"', hint: 'Type unshare --pid --fork --mount-proc /bin/sh -c "ps aux"' },
      ],
      targetTask: 'Understand how namespaces isolate process visibility.',
      solutionCommands: ['unshare --pid --fork --mount-proc /bin/sh -c "ps aux"'],
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

    
    withoutVsWith: {
      without: {
        title: 'WITHOUT CGROUPS',
        items: [
          'A buggy app with a memory leak crashes the entire server',
          'One CPU-heavy app starves all other applications',
          'Unpredictable performance for co-located services',
        ],
        outcome: '🔥 "Noisy neighbor" problems and host instability',
      },
      with: {
        title: 'WITH CGROUPS',
        items: [
          'App is killed before it can exhaust server memory',
          'CPU usage is hard-capped to specific core quotas',
          'Stable, predictable performance for all containers',
        ],
        outcome: '⚖️ Fair resource distribution and rock-solid stability',
      },
    },

    blockDiagram: {
      title: 'cgroups Resource Limits',
      subtitle: 'Click blocks to see how cgroups throttle resources:',
      nodes: [
        {
          id: 'mem-limit',
          label: 'Memory Controller',
          simpleDef: 'Caps the maximum RAM a container can use.',
          techDef: 'memory.max limit; triggers OOM-killer if exceeded.',
          badge: 'Memory',
          color: '#38bdf8',
        },
        {
          id: 'cpu-limit',
          label: 'CPU Controller',
          simpleDef: 'Limits how much processor time the container gets.',
          techDef: 'cpu.max quota and period scheduling limits.',
          badge: 'CPU',
          color: '#4ade80',
        },
        {
          id: 'io-limit',
          label: 'Block I/O Controller',
          simpleDef: 'Throttles hard drive read/write speeds.',
          techDef: 'blkio throttling limits on specific block devices.',
          badge: 'Disk',
          color: '#facc15',
        },
      ],
    },

    terms: [
      {
        term: 'cgroups (Control Groups)',
        simple: 'Linux feature that limits how much RAM or CPU a process can use.',
        technical: 'Kernel mechanism for hierarchical resource accounting and limiting.',
        analogy: 'A strict budget plan that cuts up your credit card if you overspend.',
        related: ['Namespaces', 'OOM Killer'],
      },
      {
        term: 'OOM Killer',
        simple: 'Kernel assassin that kills apps trying to use too much memory.',
        technical: 'Out Of Memory killer; sends SIGKILL (exit code 137) when memory.max is breached.',
        analogy: 'A bouncer kicking out a guest who ate all the buffet food.',
        related: ['Memory Limit'],
      },
      {
        term: 'CPU Quota',
        simple: 'Limiting a container to a fraction of processing power.',
        technical: 'CFS (Completely Fair Scheduler) quota limiting execution microseconds per period.',
        analogy: 'Allowing a child to only watch 1 hour of TV per day.',
        related: ['CPU Shares'],
      }
    ],

    whenToUse: [
      '✓ ALWAYS set memory limits on containers in production',
      '✓ When hosting multiple tenant applications on a single server',
      '✓ When simulating low-resource environments for performance testing',
    ],

    whenNotToUse: [
      '✕ Avoid aggressive CPU limits on latency-sensitive apps, as CFS throttling can cause micro-stutters',
    ],

    developerScenario: {
      title: 'Real Developer Scenario: The Memory Leak Disaster',
      setup: 'A Node.js backend has a hidden memory leak. It is deployed to a production VM alongside a critical database.',
      problem: 'Over 3 days, the Node app consumes 100% of the VM\'s 16GB RAM. The Linux kernel panics and kills the database process to save itself, causing massive downtime.',
      solution: 'The team containerizes the Node app and sets "--memory=512m". Now, when the app leaks, only the container crashes (and restarts automatically), keeping the database perfectly safe.',
    },

    internalFlow: [
      { step: 1, title: 'Docker Run Parameter', desc: 'User passes --memory=256m flag.', why: 'Defines intended limit.', techDetail: 'CLI parses 256MB to bytes' },
      { step: 2, title: 'cgroup Creation', desc: 'Daemon creates a directory in /sys/fs/cgroup.', why: 'Initializes kernel tracking.', techDetail: 'mkdir /sys/fs/cgroup/memory/docker/<id>' },
      { step: 3, title: 'Write Limits', desc: 'Daemon writes 268435456 to memory.max file.', why: 'Instructs kernel of the hard limit.', techDetail: 'echo 268435456 > memory.max' },
      { step: 4, title: 'Attach Process', desc: 'Container PID is written to cgroup.procs.', why: 'Enforces the limit on the app.', techDetail: 'echo <pid> > cgroup.procs' },
      { step: 5, title: 'OOM Enforcement', desc: 'If app exceeds limit, kernel sends SIGKILL.', why: 'Protects host stability.', techDetail: 'Exit code 137 (OOMKilled)' },
    ],

    commonMistakes: [
      {
        mistake: 'Not setting memory limits in production',
        whyWrong: 'A single rogue container can bring down the entire host machine.',
        correctWay: 'Always specify memory limits (e.g., in docker-compose.yml deploy resources).',
      },
      {
        mistake: 'Confusing JVM/V8 memory limits with cgroup limits',
        whyWrong: 'If Java/Node doesn\'t know about cgroup limits, they will try to allocate host RAM and get instantly OOM-killed.',
        correctWay: 'Use modern runtimes that are cgroup-aware (e.g., Node 12+, Java 10+).',
      },
    ],

    recapChecklist: [
      'cgroups enforce resource limits (the "handcuffs" for a container).',
      'They prevent "noisy neighbors" from starving other apps of CPU/RAM.',
      'Exceeding memory limits results in the container being OOM-killed.',
      'Limits are enforced natively by the Linux kernel via /sys/fs/cgroup.',
    ],

    challenge: {
      question: 'What happens to a Docker container if it tries to use more RAM than its defined cgroup memory limit?',
      options: [
        { label: 'It slows down but continues running.', isCorrect: false, explanation: 'Memory limits are hard ceilings, not throttles.' },
        { label: 'The Linux kernel instantly terminates it via the OOM Killer.', isCorrect: true, explanation: 'The kernel protects the host by sending a SIGKILL (Exit code 137).' },
        { label: 'It dynamically steals memory from other containers.', isCorrect: false, explanation: 'cgroups explicitly prevent this behavior.' },
      ],
    },




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
      initialCommands: ['docker run -d --name capped-app --memory="256m" nginx:alpine'],
      guidedSteps: [
        { instruction: 'Launch an Nginx container capped at 256MB memory', command: 'docker run -d --name capped-app --memory="256m" nginx:alpine', hint: 'Type docker run -d --name capped-app --memory="256m" nginx:alpine' },
      ],
      targetTask: 'Enforce memory limits via cgroups.',
      solutionCommands: ['docker run -d --name capped-app --memory="256m" nginx:alpine'],
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

    
    withoutVsWith: {
      without: {
        title: 'WITHOUT UNIONFS (VMs)',
        items: [
          'Every VM needs a full 10GB copy of the operating system',
          'Creating 10 identical VMs consumes 100GB of disk space',
          'Duplicated effort for disk I/O and caching',
        ],
        outcome: '💾 Massive storage waste and slow provisioning',
      },
      with: {
        title: 'WITH UNIONFS (Overlay2)',
        items: [
          '100 containers share the exact same 50MB base image on disk',
          'Only modified files consume extra disk space',
          'Instant provisioning since no heavy files are copied',
        ],
        outcome: '🪶 Incredible disk efficiency and instant startup',
      },
    },

    blockDiagram: {
      title: 'OverlayFS Layering',
      subtitle: 'Click blocks to understand Copy-on-Write:',
      nodes: [
        {
          id: 'upper-layer',
          label: 'Container Layer (UpperDir)',
          simpleDef: 'The thin read/write layer created when a container starts.',
          techDef: 'Ephemeral OverlayFS upperdir where modified files are copied and saved.',
          badge: 'Read/Write',
          color: '#38bdf8',
        },
        {
          id: 'lower-layer-2',
          label: 'Image Layer 2',
          simpleDef: 'App code and dependencies.',
          techDef: 'Read-only lowerdir containing application artifacts.',
          badge: 'Read-Only',
          color: '#4ade80',
        },
        {
          id: 'lower-layer-1',
          label: 'Image Layer 1',
          simpleDef: 'Base Operating System (e.g., Alpine).',
          techDef: 'Read-only lowerdir containing rootfs base files.',
          badge: 'Read-Only',
          color: '#facc15',
        },
      ],
    },

    terms: [
      {
        term: 'Union Filesystem',
        simple: 'A file system that stacks multiple folders on top of each other seamlessly.',
        technical: 'Mount mechanism that merges multiple directories into a single unified rootfs view.',
        analogy: 'Stacking transparent plastic sheets to form a complete picture.',
        related: ['Overlay2', 'Copy-on-Write'],
      },
      {
        term: 'Copy-on-Write (CoW)',
        simple: 'Only copying a file if you try to change it.',
        technical: 'Strategy where a read-only file is copied to the upperdir only upon the first write operation.',
        analogy: 'Placing tracing paper over a book so you can make notes without ruining the book.',
        related: ['UpperDir'],
      },
      {
        term: 'Overlay2',
        simple: 'The specific, most popular union filesystem used by Docker.',
        technical: 'The default Docker storage driver for Linux merging lowerdir and upperdir.',
        analogy: 'The brand name of the tracing paper.',
        related: ['Union Filesystem'],
      }
    ],

    whenToUse: [
      '✓ Automatically used by Docker to manage image layers efficiently',
      '✓ Explains why you should chain RUN commands in Dockerfiles to minimize layer sizes',
    ],

    whenNotToUse: [
      '✕ NEVER use the container write layer for high-performance database storage (I/O is slow). Use Docker Volumes instead.',
    ],

    developerScenario: {
      title: 'Real Developer Scenario: Disk Space Exhaustion',
      setup: 'A developer runs an active PostgreSQL database inside a container. It writes gigabytes of data directly to /var/lib/postgresql/data inside the container layer.',
      problem: 'OverlayFS Copy-on-Write is heavily optimized for reads, but slow for heavy writes. The database is sluggish, and when the container is deleted, all customer data is permanently lost.',
      solution: 'The developer mounts a Docker Volume. Volumes bypass the Union Filesystem, offering native disk I/O performance and persistent storage even if the container is destroyed.',
    },

    internalFlow: [
      { step: 1, title: 'Mount LowerDirs', desc: 'Docker identifies the read-only image layers.', why: 'Prepares the immutable base.', techDetail: 'lowerdir=/var/lib/docker/overlay2/<layer1>:<layer2>' },
      { step: 2, title: 'Create UpperDir', desc: 'Docker creates an empty directory for container writes.', why: 'Isolates container changes.', techDetail: 'upperdir=/var/lib/docker/overlay2/<container_id>/diff' },
      { step: 3, title: 'Mount OverlayFS', desc: 'Kernel merges them into a single mount point.', why: 'Provides unified view to the app.', techDetail: 'mount -t overlay overlay -o lowerdir=...,upperdir=...' },
      { step: 4, title: 'Read Request', desc: 'App reads a file. Kernel fetches it from the lowest layer.', why: 'Zero overhead for reading.', techDetail: 'VFS traverses lowerdir' },
      { step: 5, title: 'Write Request', desc: 'App edits a file. Kernel copies it to UpperDir first.', why: 'Prevents modifying the base image.', techDetail: 'Copy-up operation triggered' },
    ],

    commonMistakes: [
      {
        mistake: 'Storing permanent data in the container layer',
        whyWrong: 'The writeable layer is tightly coupled to the container lifecycle. Deleting the container deletes the data.',
        correctWay: 'Always use Docker Volumes or Bind Mounts for persistent data.',
      },
      {
        mistake: 'Downloading large temp files in one Dockerfile step and deleting them in another',
        whyWrong: 'Each RUN command creates a layer. Deleting a file in a later layer just hides it using a "whiteout" file; the data is still in the image history.',
        correctWay: 'Download, extract, and delete temp files in a single chained RUN command.',
      },
    ],

    recapChecklist: [
      'OverlayFS stacks read-only image layers under a thin writeable container layer.',
      'Copy-on-Write (CoW) ensures base images are never modified and disk space is saved.',
      'Editing a base file forces it to be copied to the top layer first.',
      'Never use the UnionFS for heavy database writes; use Volumes instead.',
    ],

    challenge: {
      question: 'What happens when an application inside a container modifies a configuration file that originated from the base image?',
      options: [
        { label: 'The file is modified directly in the base image.', isCorrect: false, explanation: 'Base images are immutable (read-only).' },
        { label: 'The file is copied into the container\'s unique writeable layer, and the modification happens there.', isCorrect: true, explanation: 'This is the Copy-on-Write mechanism protecting the base image.' },
        { label: 'The container crashes because files cannot be modified.', isCorrect: false, explanation: 'OverlayFS seamlessly handles the modification via Copy-on-Write.' },
      ],
    },




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
      initialCommands: ['docker pull nginx:alpine', 'docker image inspect nginx:alpine --format "{{.GraphDriver.Data.LowerDir}}"'],
      guidedSteps: [
        { instruction: 'Inspect the Overlay2 layers of an image', command: 'docker image inspect nginx:alpine --format "{{.GraphDriver.Data.LowerDir}}"', hint: 'Type docker image inspect...' },
      ],
      targetTask: 'Inspect the underlying OverlayFS directory structure of an image.',
      solutionCommands: ['docker image inspect nginx:alpine --format "{{.GraphDriver.Data.LowerDir}}"'],
    },

    reference: {
      syntaxCheatSheet: [
        'docker diff [CONTAINER]    # List changed files in write layer',
        'A = Added, C = Changed, D = Deleted',
      ],
    },
  },
};