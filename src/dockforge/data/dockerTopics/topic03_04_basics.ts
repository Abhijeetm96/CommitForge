import { UniversalDockerConcept } from '../unifiedDockerData';

export const TOPIC_03_04_CONCEPTS: Record<string, UniversalDockerConcept> = {
  'c-docker-desktop': {
    id: 'c-docker-desktop',
    command: 'docker desktop',
    title: 'Docker Desktop (Win/Mac/Linux)',
    topicId: 'topic-03',
    topicNumber: '03',
    topicTitle: 'Installation / Setup',
    subtitle: 'GUI dashboard, WSL2 engine backend, Kubernetes integration, and local developer environment.',
    badges: ['Beginner', 'Setup', 'GUI'],
    quote: 'Docker Desktop provides a seamless GUI experience for managing containers, images, and volumes on desktop operating systems.',
    difficulty: 'Beginner',

    whatIsIt:
      'Docker Desktop is an easy-to-install application for Mac, Windows, and Linux that includes the Docker Engine, Docker CLI, Docker Compose, Docker BuildX, Kubernetes, and a graphical dashboard.',
    inSimpleWords:
      'Docker Desktop is your control center. On Windows and Mac, it runs a lightweight Linux VM in the background (via WSL2 or Hypervisor) so you can run Linux containers seamlessly on your desktop.',
    whyDoYouNeedIt:
      'Because macOS and Windows do not natively have Linux kernel features like namespaces or cgroups, Docker Desktop sets up the lightweight Linux VM automatically.',
    realWorldAnalogy:
      'An electric car dashboard display that lets you tap buttons on a touchscreen while complex electric motors run under the hood.',

    syntaxCode: 'docker info',
    syntaxTokens: [
      { token: 'docker info', role: 'Command', explanation: 'Checks connection to Docker Desktop daemon and lists OS/CPU/RAM resources.' },
    ],

    actionStage: {
      before: {
        label: 'Windows / Mac Host',
        description: 'No native Linux kernel features present.',
        stateBadge: 'Non-Linux OS',
        details: ['macOS / Windows 11 host', 'No native cgroups / namespaces'],
      },
      running: {
        label: 'WSL2 / Hypervisor VM Init',
        description: 'Docker Desktop starts lightweight Linux Kit VM in background.',
        stateBadge: 'WSL2 Helper Active',
        details: ['Allocating 4 CPUs & 8GB RAM', 'Starting dockerd daemon', 'Forwarding Docker socket'],
      },
      after: {
        label: 'Docker Environment Ready',
        description: 'Developer can run "docker run" directly from standard PowerShell or macOS Terminal.',
        stateBadge: 'Ready for Dev',
        details: ['GUI Dashboard running', 'Kubernetes optional toggle', 'Integrated BuildKit'],
      },
    },

    variations: [
      { title: 'Inspect Engine Info', syntax: 'docker info', whatItDoes: 'Displays Docker Desktop memory limits, CPU count, and storage drivers' },
    ],

    scenarios: [
      {
        title: 'Windows Backend Engine',
        question: 'What is the recommended high-performance backend architecture for Docker Desktop on Windows 11?',
        options: [
          { label: 'WSL2 (Windows Subsystem for Linux 2)', command: 'wsl2', isCorrect: true, explanation: 'WSL2 provides a real Linux kernel with fast file I/O and low RAM consumption.' },
          { label: 'VirtualBox Legacy VM', command: 'virtualbox', isCorrect: false, explanation: 'VirtualBox is slow and legacy.' },
        ],
      },
    ],
    withoutVsWith: {
      without: { title: "Native Linux Dependencies", items: ["Complex VM setup on Windows/Mac", "Manual networking configs", "No visual management UI"], outcome: "Hours lost setting up environments" },
      with: { title: "Docker Desktop", items: ["1-click installer for Win/Mac", "Seamless WSL2 integration", "Built-in visual dashboard"], outcome: "Docker ready in minutes" }
    },
    blockDiagram: {
      title: "Docker Desktop Architecture",
      subtitle: "How Docker Desktop runs on Windows/Mac",
      nodes: [
        { id: "gui", label: "Desktop GUI", simpleDef: "Visual dashboard", techDef: "Electron App", color: "#38bdf8" },
        { id: "vm", label: "WSL2 / Hypervisor", simpleDef: "Linux Environment", techDef: "Utility VM", color: "#facc15" },
        { id: "daemon", label: "Docker Daemon", simpleDef: "Engine core", techDef: "dockerd process", color: "#4ade80" }
      ]
    },
    terms: [
      { term: "WSL2", simple: "Windows Subsystem for Linux", technical: "Hyper-V based lightweight utility VM running a real Linux kernel.", analogy: "A tiny Linux computer living inside your Windows PC." },
      { term: "Docker Dashboard", simple: "Visual UI for Docker", technical: "Electron-based GUI for managing Docker Engine API resources.", analogy: "The steering wheel and dashboard of your car." }
    ],
    whenToUse: ["✓ Local development on Windows or macOS", "✓ When you want visual container management", "✓ Testing containers before production"],
    whenNotToUse: ["✕ Running in production servers", "✕ Headless Linux servers", "✕ CI/CD automated pipelines"],
    developerScenario: { title: "Local Dev Setup", setup: "New developer joins a project using Windows 11.", problem: "The project uses Linux-specific dependencies and tools.", solution: "Developer installs Docker Desktop with WSL2 backend, getting native Linux performance and tooling." },
    internalFlow: [
      { step: 1, title: "Launch Application", desc: "User opens Docker Desktop.", why: "Initialize UI and background services.", techDetail: "Starts Desktop frontend and backend services." },
      { step: 2, title: "Start WSL2 VM", desc: "Boots the hidden Linux environment.", why: "Docker requires a Linux kernel.", techDetail: "Uses wsl.exe to start the docker-desktop distros." },
      { step: 3, title: "Start Daemon", desc: "Docker Engine starts inside the VM.", why: "To manage containers.", techDetail: "Executes dockerd inside the utility VM." },
      { step: 4, title: "Expose Socket", desc: "Maps Linux socket to host OS.", why: "So Windows CLI can talk to Linux Docker.", techDetail: "Creates named pipe //./pipe/docker_engine." }
    ],
    commonMistakes: [
      { mistake: "Installing Docker Desktop on a Production Server", whyWrong: "Desktop is designed for local dev, includes unnecessary GUI overhead.", correctWay: "Install native Docker Engine on production Linux servers." },
      { mistake: "Disabling WSL2 integration on Windows", whyWrong: "Falls back to legacy Hyper-V which is slower.", correctWay: "Always use the WSL2 based engine on modern Windows." }
    ],
    recapChecklist: ["Docker Desktop is for local development on Windows/Mac.", "Uses a hidden lightweight VM (WSL2) to provide a Linux kernel.", "Includes a GUI dashboard for easy management.", "Not for use on production servers."],
    challenge: { question: "Why does Docker Desktop on Windows require WSL2 or Hyper-V?", options: [ { label: "To run the GUI dashboard", isCorrect: false, explanation: "The GUI is a native Windows app." }, { label: "Because containers share the host OS kernel, and Linux containers require a Linux kernel", isCorrect: true, explanation: "Windows doesn't have a Linux kernel natively, so a VM provides it." }, { label: "To provide antivirus scanning", isCorrect: false, explanation: "Not the primary reason." } ] },
    sandbox: {
      initialCommands: [],
      targetTask: "Verify Docker Desktop/Engine is running.",
      solutionCommands: ["docker version"],
      guidedSteps: [ { instruction: "Check the version of Docker Client and Server", command: "docker version", hint: "Run docker version" } ]
    },

    reference: {
      officialDocUrl: 'https://docs.docker.com/desktop/',
      syntaxCheatSheet: ['docker info    # Verify system resources allocated to Docker Desktop'],
    },
  },

  'c-docker-engine-linux': {
    id: 'c-docker-engine-linux',
    command: 'systemctl status docker',
    title: 'Docker Engine (Linux)',
    topicId: 'topic-03',
    topicNumber: '03',
    topicTitle: 'Installation / Setup',
    subtitle: 'dockerd service, containerd runtime, and Unix domain socket (/var/run/docker.sock).',
    badges: ['Beginner', 'Linux', 'Daemon'],
    quote: 'On Linux, Docker Engine runs directly on the host kernel without any virtual machine overhead.',
    difficulty: 'Beginner',

    whatIsIt:
      'Docker Engine on Linux is a client-server application consisting of the `dockerd` background daemon, REST API interfaces, and the `docker` command line client. It communicates via the Unix socket `/var/run/docker.sock`.',
    inSimpleWords:
      'On Linux, Docker runs natively without any virtualization layer. It\'s blazingly fast because containers run directly as native Linux processes.',
    whyDoYouNeedIt:
      'Every production cloud server (AWS EC2, Google Cloud Compute, Azure VMs) runs Docker Engine directly on Linux for maximum speed and zero performance overhead.',
    realWorldAnalogy:
      'A native engine inside a sports car vs using a converter adapter.',

    syntaxCode: 'sudo systemctl status docker\nsudo usermod -aG docker $USER',
    syntaxTokens: [
      { token: 'systemctl status docker', role: 'Command', explanation: 'Checks if dockerd service is running on Linux.' },
      { token: 'usermod -aG docker $USER', role: 'Command', explanation: 'Adds current user to docker group to run CLI without sudo.' },
    ],

    actionStage: {
      before: {
        label: 'Unconfigured Linux Server',
        description: 'Fresh Ubuntu 24.04 server without Docker installed.',
        stateBadge: 'No Docker Daemon',
        details: ['dockerd missing', 'No socket file at /var/run/docker.sock'],
      },
      running: {
        label: 'Package Installation & Service Start',
        description: 'Installing docker-ce, containerd, and starting systemd service.',
        stateBadge: 'Starting Service',
        details: ['sudo apt install docker-ce', 'systemctl start docker', 'Creating /var/run/docker.sock'],
      },
      after: {
        label: 'Native Linux Docker Engine',
        description: 'Docker Engine active and listening for CLI commands.',
        stateBadge: 'Native Speed',
        details: ['dockerd running under PID', 'Direct kernel access', 'Zero VM overhead'],
      },
    },

    variations: [
      { title: 'Add Non-Root User', syntax: 'sudo usermod -aG docker $USER', whatItDoes: 'Allows running docker commands without typing sudo every time' },
    ],

    scenarios: [
      {
        title: 'Permission Denied Error',
        question: 'If running "docker ps" gives "Permission Denied while trying to connect to Docker daemon socket", what is the cause?',
        options: [
          { label: 'Your user account is not a member of the "docker" user group on Linux', command: 'group', isCorrect: true, explanation: 'The socket /var/run/docker.sock is owned by root:docker. Users must be added to the docker group.' },
          { label: 'Your computer screen is turned off', command: 'screen', isCorrect: false, explanation: 'Unrelated to OS permissions.' },
        ],
      },
    ],
    withoutVsWith: {
      without: { title: "Manual Processes", items: ["Running apps manually in background", "Handling process crashes", "No isolation"], outcome: "Unstable server environment" },
      with: { title: "Docker Engine", items: ["Automated process management", "Systemd service integration", "Namespaced isolation"], outcome: "Robust container hosting platform" }
    },
    blockDiagram: {
      title: "Docker Engine Architecture",
      subtitle: "How dockerd runs on Linux servers",
      nodes: [
        { id: "cli", label: "Docker CLI", simpleDef: "Terminal commands", techDef: "Client binary", color: "#38bdf8" },
        { id: "socket", label: "docker.sock", simpleDef: "Communication pipe", techDef: "Unix domain socket", color: "#a78bfa" },
        { id: "daemon", label: "dockerd", simpleDef: "Background service", techDef: "Systemd daemon", color: "#4ade80" },
        { id: "containerd", label: "containerd", simpleDef: "Container runtime", techDef: "High-level runtime", color: "#facc15" }
      ]
    },
    terms: [
      { term: "dockerd", simple: "Docker Daemon", technical: "The persistent background process that manages Docker objects.", analogy: "The kitchen manager in a restaurant." },
      { term: "docker.sock", simple: "Docker Socket", technical: "Unix IPC socket where the Docker API listens for commands.", analogy: "The order window where waiters give tickets to the kitchen." },
      { term: "docker group", simple: "Docker User Group", technical: "Linux user group that grants socket access without requiring sudo.", analogy: "A VIP pass to the kitchen." }
    ],
    whenToUse: ["✓ Production Linux servers", "✓ CI/CD build agents", "✓ Headless cloud instances"],
    whenNotToUse: ["✕ Everyday local dev on Windows (use Desktop instead)", "✕ Shared hosting environments without root"],
    developerScenario: { title: "Deploying to Production", setup: "A team needs to host a Node.js app on a bare-metal Ubuntu server.", problem: "Manual deployments are messy and hard to restart on failure.", solution: "Install Docker Engine, enable the systemd service, and run the app as a resilient container." },
    internalFlow: [
      { step: 1, title: "Systemd Starts Daemon", desc: "OS boots up.", why: "Initialize background services.", techDetail: "systemd executes dockerd based on docker.service." },
      { step: 2, title: "Bind to Socket", desc: "Daemon creates communication endpoint.", why: "To listen for CLI commands.", techDetail: "Binds to /var/run/docker.sock with root privileges." },
      { step: 3, title: "Initialize Runtime", desc: "Connects to containerd.", why: "To actually run container processes.", techDetail: "dockerd connects to containerd via gRPC." },
      { step: 4, title: "Accept Commands", desc: "CLI sends REST API calls.", why: "User runs a docker command.", techDetail: "CLI POSTs to /v1.41/containers/create." }
    ],
    commonMistakes: [
      { mistake: "Forgetting to use sudo or add user to docker group", whyWrong: "The docker.sock is owned by root.", correctWay: "Run 'sudo usermod -aG docker $USER' to grant permissions." },
      { mistake: "Directly killing the dockerd process", whyWrong: "Leaves containers in an inconsistent state.", correctWay: "Use 'systemctl stop docker' for clean shutdown." }
    ],
    recapChecklist: ["Docker Engine is the native background service on Linux.", "It listens on docker.sock for API requests.", "You must add your user to the 'docker' group to avoid using sudo.", "It uses systemd for auto-start on boot."],
    challenge: { question: "How does the Docker CLI communicate with the Docker daemon on Linux by default?", options: [ { label: "Via SSH", isCorrect: false, explanation: "SSH is for remote access." }, { label: "Via a Unix socket (docker.sock)", isCorrect: true, explanation: "This is the default local IPC mechanism." }, { label: "Via a local MySQL database", isCorrect: false, explanation: "Docker doesn't use MySQL for this." } ] },
    sandbox: {
      initialCommands: [],
      targetTask: "Check the status of Docker Engine.",
      solutionCommands: ["systemctl status docker"],
      guidedSteps: [ { instruction: "Check systemd service status for Docker", command: "systemctl status docker", hint: "Run systemctl status docker" } ]
    },

    reference: {
      syntaxCheatSheet: [
        'sudo systemctl start docker     # Start daemon',
        'sudo systemctl enable docker    # Auto-start on boot',
        'sudo usermod -aG docker $USER   # Grant non-root access',
      ],
    },
  },

  'c-docker-run-basic': {
    id: 'c-docker-run-basic',
    command: 'docker run -d',
    title: 'Running Containers',
    topicId: 'topic-04',
    topicNumber: '04',
    topicTitle: 'Basics of Docker',
    subtitle: 'Creating, initializing, and starting container instances from images in foreground or background mode.',
    badges: ['Beginner', 'Essential', 'CLI'],
    quote: 'docker run is the most important command in Docker — it pulls, creates, and boots up a container in one step.',
    difficulty: 'Beginner',

    whatIsIt:
      '`docker run` combines `docker create` and `docker start`. It pulls the specified image (if not already local), allocates namespaces, assigns an IP address, sets up port bindings, and executes the default command.',
    inSimpleWords:
      'It\'s the "Play Button" for container images. Give it an image name (like `nginx`), and Docker instantly turns that blueprint into a live running process.',
    whyDoYouNeedIt:
      'It is the primary way developers start web servers, databases, queue workers, and diagnostic apps.',
    realWorldAnalogy:
      'Inserting a game cartridge into a gaming console and pressing the power button.',

    syntaxCode: 'docker run -d --name my-web -p 8080:80 -e ENV=prod nginx:1.25-alpine',
    syntaxTokens: [
      { token: 'docker run', role: 'Command', explanation: 'Creates and starts container.' },
      { token: '-d', role: 'Flag', explanation: 'Detached mode: keeps container running in background.' },
      { token: '--name my-web', role: 'Flag', explanation: 'Assigns friendly name.' },
      { token: '-p 8080:80', role: 'Flag', explanation: 'Maps host port 8080 -> container port 80.' },
      { token: '-e ENV=prod', role: 'Flag', explanation: 'Passes environment variable inside container.' },
      { token: 'nginx:1.25-alpine', role: 'Image', explanation: 'Source image tag.' },
    ],

    actionStage: {
      before: {
        label: 'Image Ready in Registry/Local',
        description: 'Local image nginx:1.25-alpine exists in local cache.',
        stateBadge: 'Image Blueprint',
        details: ['Repository: nginx', 'Tag: 1.25-alpine', 'No container process exists yet'],
      },
      running: {
        label: 'Execution Lifecycle',
        description: 'Allocating container ID, IP address, and binding host port 8080.',
        stateBadge: 'Spawning Process',
        details: ['Allocating IP: 172.17.0.2', 'Port map: 0.0.0.0:8080 -> 80/tcp', 'Executing CMD: nginx -g "daemon off;"'],
      },
      after: {
        label: 'Active Container',
        description: 'Container is live and serving requests on http://localhost:8080.',
        stateBadge: 'Up & Running',
        details: ['Container ID: c-nginx-prod', 'Status: Up 2 hours', 'Logs streaming to stdout'],
      },
    },

    variations: [
      { title: 'Detached Background Mode', syntax: 'docker run -d nginx', whatItDoes: 'Runs in background and outputs container ID' },
      { title: 'Interactive Shell TTY', syntax: 'docker run -it ubuntu bash', whatItDoes: 'Hooks terminal input/output into container bash shell' },
      { title: 'Auto-Remove Container on Exit', syntax: 'docker run --rm alpine echo "Done"', whatItDoes: 'Deletes container metadata instantly upon command exit' },
    ],

    scenarios: [
      {
        title: 'Foreground vs Detached',
        question: 'Why does running "docker run nginx" freeze your terminal window unless you pass "-d"?',
        options: [
          { label: 'Without -d (detached mode), the container runs in foreground mode and streams stdout to your terminal', command: 'foreground', isCorrect: true, explanation: 'Pass -d to run containers quietly in the background.' },
          { label: 'Because Nginx is broken', command: 'broken', isCorrect: false, explanation: 'This is intended behavior for foreground processes.' },
        ],
      },
    ],
    withoutVsWith: {
      without: { title: "Manual App Startup", items: ["Install runtime (Java/Node)", "Download dependencies", "Configure ports manually"], outcome: "Works on my machine, fails elsewhere" },
      with: { title: "docker run", items: ["One command execution", "Self-contained dependencies", "Isolated networking"], outcome: "Consistent startup everywhere" }
    },
    blockDiagram: {
      title: "docker run Execution Flow",
      subtitle: "What happens when you press enter",
      nodes: [
        { id: "cli", label: "CLI", simpleDef: "docker run", techDef: "Sends POST request", color: "#38bdf8" },
        { id: "pull", label: "Pull Image", simpleDef: "Download if needed", techDef: "Fetch from Registry", color: "#a78bfa" },
        { id: "create", label: "Create", simpleDef: "Allocate resources", techDef: "Setup namespaces", color: "#facc15" },
        { id: "start", label: "Start", simpleDef: "Boot process", techDef: "Execute CMD", color: "#4ade80" }
      ]
    },
    terms: [
      { term: "Detached Mode (-d)", simple: "Run in background", technical: "Starts the container process in the background and prints the ID.", analogy: "Starting a washing machine and walking away." },
      { term: "Port Publishing (-p)", simple: "Map network ports", technical: "Creates an iptables DNAT rule forwarding host traffic to the container.", analogy: "A receptionist forwarding outside calls to your office extension." },
      { term: "Container Name (--name)", simple: "Friendly identifier", technical: "Assigns a custom string alias in Docker's internal DNS and metadata.", analogy: "Giving your pet a name instead of calling it 'Dog #42'." }
    ],
    whenToUse: ["✓ Starting a new database instance locally", "✓ Running a quick one-off script", "✓ Booting up a web server for testing"],
    whenNotToUse: ["✕ Restarting an already stopped container (use docker start)", "✕ Running complex multi-container apps (use docker-compose)"],
    developerScenario: { title: "Local Database Setup", setup: "A developer needs PostgreSQL for their backend API.", problem: "Installing Postgres on their OS might conflict with existing tools.", solution: "They use 'docker run -d -p 5432:5432 postgres' to instantly boot an isolated database." },
    internalFlow: [
      { step: 1, title: "Check Local Image", desc: "Daemon checks cache.", why: "To avoid unnecessary downloads.", techDetail: "Looks for image digest locally." },
      { step: 2, title: "Pull Image (if missing)", desc: "Downloads from registry.", why: "Image is required to create container.", techDetail: "API call to Docker Hub." },
      { step: 3, title: "Create Container", desc: "Allocates read/write layer.", why: "Prepare filesystem.", techDetail: "Mounts OverlayFS upperdir and creates config." },
      { step: 4, title: "Allocate Network", desc: "Assigns IP and maps ports.", why: "To allow communication.", techDetail: "Creates veth pair and iptables rules." },
      { step: 5, title: "Start Process", desc: "Executes the main command.", why: "To run the app.", techDetail: "Spawns PID 1 inside namespaces." }
    ],
    commonMistakes: [
      { mistake: "Forgetting the -d flag for web servers", whyWrong: "The terminal becomes locked, and pressing Ctrl+C kills the server.", correctWay: "Use 'docker run -d' for background services." },
      { mistake: "Re-running 'docker run' when a container is stopped", whyWrong: "Creates a brand new container duplicate, throwing a name conflict error.", correctWay: "Use 'docker start <name>' to resume an existing container." }
    ],
    recapChecklist: ["docker run combines 'create' and 'start'.", "Use -d to run in the background.", "Use -p HOST:CONTAINER to expose ports.", "Use --name for easy referencing."],
    challenge: { question: "If you want to run an Nginx web server in the background and map it to your machine's port 8080, what command do you use?", options: [ { label: "docker run nginx -p 8080", isCorrect: false, explanation: "Incorrect syntax and missing detached flag." }, { label: "docker run -d -p 8080:80 nginx", isCorrect: true, explanation: "Correctly specifies detached mode and maps host 8080 to container 80." }, { label: "docker start nginx -p 8080:80", isCorrect: false, explanation: "docker start resumes an existing container; you need docker run." } ] },
    sandbox: {
      initialCommands: [],
      targetTask: "Run a container in the background.",
      solutionCommands: ["docker run -d -p 8080:80 --name webserver nginx"],
      guidedSteps: [ { instruction: "Run an Nginx container named 'webserver' in detached mode mapping port 8080 to 80", command: "docker run -d -p 8080:80 --name webserver nginx", hint: "Run docker run -d -p 8080:80 --name webserver nginx" } ]
    },

    reference: {
      syntaxCheatSheet: [
        'docker run -d -p [HOST]:[CONTAINER] [IMAGE]',
        'docker run -it [IMAGE] [CMD]',
        'docker run --rm [IMAGE]',
      ],
    },
  },

  'c-docker-exec': {
    id: 'c-docker-exec',
    command: 'docker exec -it',
    title: 'Interactive Shells (docker exec)',
    topicId: 'topic-04',
    topicNumber: '04',
    topicTitle: 'Basics of Docker',
    subtitle: 'Executing commands and opening interactive shells inside already running containers.',
    badges: ['Beginner', 'Debugging', 'CLI'],
    quote: 'docker exec allows you to SSH into a running container to inspect files, check environment variables, and run diagnostics.',
    difficulty: 'Beginner',

    whatIsIt:
      '`docker exec` runs a new command inside an already running container instance. Combining `-i` (interactive) and `-t` (pseudo-TTY) allows you to open a live interactive shell (`sh` or `bash`) inside the container.',
    inSimpleWords:
      'It\'s like opening a terminal window directly inside your running container. You can browse files (`ls`), check config files (`cat`), or inspect running processes (`ps aux`).',
    whyDoYouNeedIt:
      'Essential for troubleshooting production issues, verifying database tables, inspecting log files, and checking container environment variables.',
    realWorldAnalogy:
      'Using a master key to walk inside an active bank vault to double-check deposit boxes while the bank is open.',

    syntaxCode: 'docker exec -it web-frontend sh',
    syntaxTokens: [
      { token: 'docker exec', role: 'Command', explanation: 'Executes command in running container.' },
      { token: '-i', role: 'Flag', explanation: 'Interactive: keeps STDIN open.' },
      { token: '-t', role: 'Flag', explanation: 'TTY: allocates a pseudo-terminal.' },
      { token: 'web-frontend', role: 'Target', explanation: 'Target container name or ID.' },
      { token: 'sh', role: 'Command Arg', explanation: 'Shell binary to execute inside container.' },
    ],

    actionStage: {
      before: {
        label: 'Running Container',
        description: 'Container web-frontend running in background.',
        stateBadge: 'Container Live',
        details: ['PID 1: nginx', 'Status: Running'],
      },
      running: {
        label: 'Executing Auxiliary Process',
        description: 'docker exec attaches new process to container namespaces.',
        stateBadge: 'Attaching TTY',
        details: ['Spawning PID 42: sh', 'Attaching STDIN / STDOUT'],
      },
      after: {
        label: 'Interactive Shell Active',
        description: 'User prompt displays inside container: / #',
        stateBadge: 'Shell Open',
        details: ['Can run: ls, cat, env, ping', 'Type "exit" to disconnect without stopping container'],
      },
    },

    variations: [
      { title: 'Open Bash Shell', syntax: 'docker exec -it [CONTAINER] bash', whatItDoes: 'Opens bash shell (for images with bash installed)' },
      { title: 'One-off Non-interactive Command', syntax: 'docker exec web-frontend cat /etc/nginx/nginx.conf', whatItDoes: 'Prints file content directly to host terminal without opening shell' },
    ],

    scenarios: [
      {
        title: 'Exiting docker exec',
        question: 'If you open a shell with "docker exec -it my-app sh" and type "exit", what happens to the container?',
        options: [
          { label: 'The shell session exits, but the container continues running unaffected', command: 'stay-running', isCorrect: true, explanation: 'docker exec spawns a secondary process; exiting it does not terminate PID 1.' },
          { label: 'The entire container stops completely', command: 'stop-app', isCorrect: false, explanation: 'Stopping PID 1 stops the container, but exec processes are non-PID 1.' },
        ],
      },
    ],
    withoutVsWith: {
      without: { title: "Black Box Debugging", items: ["Guessing why app failed", "Relying purely on limited logs", "No direct file access"], outcome: "Frustrating troubleshooting" },
      with: { title: "docker exec", items: ["Interactive shell access", "Live process inspection", "Direct file reading"], outcome: "Fast, accurate debugging" }
    },
    blockDiagram: {
      title: "docker exec Architecture",
      subtitle: "How exec attaches to a running container",
      nodes: [
        { id: "running", label: "Running Container", simpleDef: "PID 1 (Main App)", techDef: "Existing namespaces", color: "#4ade80" },
        { id: "exec", label: "docker exec", simpleDef: "New Command", techDef: "API /exec endpoint", color: "#38bdf8" },
        { id: "shell", label: "New Process", simpleDef: "e.g., bash/sh", techDef: "Child process in namespace", color: "#a78bfa" }
      ]
    },
    terms: [
      { term: "-i (interactive)", simple: "Keep input open", technical: "Keeps STDIN open even if not attached.", analogy: "Leaving the phone line open to talk." },
      { term: "-t (tty)", simple: "Terminal formatting", technical: "Allocates a pseudo-TTY for shell formatting and signals.", analogy: "Using a proper headset instead of a tin can." },
      { term: "Namespace Injection", simple: "Entering the bubble", technical: "Kernel feature allowing a new process to join an existing set of namespaces.", analogy: "Using a master key to walk into a locked vault." }
    ],
    whenToUse: ["✓ Opening a bash/sh shell in a running container", "✓ Running database dump commands (e.g., pg_dump)", "✓ Inspecting live config files without restarting"],
    whenNotToUse: ["✕ Modifying application code directly (it won't persist)", "✕ Trying to start background services inside the container"],
    developerScenario: { title: "Debugging a Config Issue", setup: "A web server container is running but returning 403 Forbidden.", problem: "The developer needs to see if the internal config file is correct.", solution: "They use 'docker exec -it webserver /bin/sh' to explore the container's filesystem and read the config file." },
    internalFlow: [
      { step: 1, title: "API Request", desc: "CLI requests execution.", why: "Initiate command.", techDetail: "POST /containers/{id}/exec" },
      { step: 2, title: "Create Exec Instance", desc: "Daemon prepares command.", why: "Setup environment.", techDetail: "Configures process parameters." },
      { step: 3, title: "Start Exec", desc: "Daemon starts process.", why: "To run the shell.", techDetail: "POST /exec/{id}/start, hijacking connection for IO." },
      { step: 4, title: "Join Namespaces", desc: "Process enters container.", why: "To see container files/network.", techDetail: "Uses setns() syscall to join namespaces." }
    ],
    commonMistakes: [
      { mistake: "Trying to exec into a STOPPED container", whyWrong: "exec requires a running container because it joins active namespaces.", correctWay: "Start the container first, or use docker run for a new one." },
      { mistake: "Forgetting the -it flags for a shell", whyWrong: "The shell will start but immediately exit or hang without taking input.", correctWay: "Always use '-it' when you want an interactive shell like 'sh' or 'bash'." }
    ],
    recapChecklist: ["docker exec runs NEW commands in ALREADY RUNNING containers.", "Use '-it' flags to open an interactive terminal.", "Great for debugging and running admin commands (like DB migrations).", "Changes made this way are lost if the container is destroyed."],
    challenge: { question: "Why do you use the '-it' flags with docker exec when opening a bash shell?", options: [ { label: "To run it in the background", isCorrect: false, explanation: "That's what -d does." }, { label: "To allocate a terminal and keep input open so you can type commands", isCorrect: true, explanation: "Without -it, you can't interact with the shell." }, { label: "To inject the process into the container", isCorrect: false, explanation: "exec handles that inherently." } ] },
    sandbox: {
      initialCommands: [],
      targetTask: "Open an interactive shell in a container.",
      solutionCommands: ["docker exec -it webserver /bin/sh"],
      guidedSteps: [ { instruction: "Execute an interactive sh shell inside 'webserver'", command: "docker exec -it webserver /bin/sh", hint: "Run docker exec -it webserver /bin/sh" } ]
    },

    reference: {
      syntaxCheatSheet: [
        'docker exec -it [CONTAINER] sh     # Open shell',
        'docker exec [CONTAINER] [CMD]     # Run single command',
      ],
    },
  },

  'c-docker-stop-start': {
    id: 'c-docker-stop-start',
    command: 'docker stop',
    title: 'Stopping & Starting Containers',
    topicId: 'topic-04',
    topicNumber: '04',
    topicTitle: 'Basics of Docker',
    subtitle: 'Managing container state lifecycle with SIGTERM graceful shutdown and SIGKILL termination.',
    badges: ['Beginner', 'Lifecycle', 'CLI'],
    quote: 'docker stop sends SIGTERM to give containers time to save state, followed by SIGKILL if they don\'t stop within 10 seconds.',
    difficulty: 'Beginner',

    whatIsIt:
      '`docker stop` gracefully shuts down a running container by sending `SIGTERM` to PID 1. If the container does not exit within a grace period (default 10 seconds), Docker sends `SIGKILL`. `docker start` boots a stopped container back up with its filesystem intact.',
    inSimpleWords:
      '`docker stop` is like shutting down your computer normally (closing apps and saving work). `docker kill` is pulling the power plug out of the wall.',
    whyDoYouNeedIt:
      'Proper graceful shutdown ensures database transactions commit to disk and web connections close cleanly without corrupting files.',
    realWorldAnalogy:
      'Closing a store at night. You lock the register, turn off lights, and lock the front door (SIGTERM), rather than burning the building down (SIGKILL).',

    syntaxCode: 'docker stop web-frontend\ndocker start web-frontend\ndocker restart web-frontend',
    syntaxTokens: [
      { token: 'docker stop web-frontend', role: 'Command', explanation: 'Sends SIGTERM signal and waits 10s before stopping container.' },
      { token: 'docker start web-frontend', role: 'Command', explanation: 'Restarts stopped container using existing container layer.' },
    ],

    actionStage: {
      before: {
        label: 'Active Container',
        description: 'Container web-frontend running under PID 1.',
        stateBadge: 'Running',
        details: ['Status: Up 2 hours', 'CPU usage: Active'],
      },
      running: {
        label: 'SIGTERM Signal Sent',
        description: 'Docker daemon sends SIGTERM signal to PID 1.',
        stateBadge: 'Graceful Stop',
        details: ['Waiting up to 10s for clean exit', 'Closing TCP connections'],
      },
      after: {
        label: 'Stopped Container State',
        description: 'Container status becomes Exited (0). Filesystem state preserved on disk.',
        stateBadge: 'Exited (0)',
        details: ['RAM freed', 'CPU 0%', 'Can be restarted with "docker start"'],
      },
    },

    variations: [
      { title: 'Stop with Custom Timeout', syntax: 'docker stop -t 30 web-frontend', whatItDoes: 'Waits 30 seconds before sending SIGKILL' },
      { title: 'Immediate Force Kill', syntax: 'docker kill web-frontend', whatItDoes: 'Sends immediate SIGKILL bypassing graceful shutdown' },
    ],

    scenarios: [
      {
        title: 'SIGTERM vs SIGKILL',
        question: 'What signal does "docker stop" send FIRST to allow containers to close database connections cleanly?',
        options: [
          { label: 'SIGTERM (Signal 15)', command: 'sigterm', isCorrect: true, explanation: 'SIGTERM signals the application to initiate graceful shutdown.' },
          { label: 'SIGKILL (Signal 9)', command: 'sigkill', isCorrect: false, explanation: 'SIGKILL forcibly terminates the process immediately without cleanup.' },
        ],
      },
    ],
    withoutVsWith: {
      without: { title: "Abrupt Kills", items: ["Data corruption", "Lost database transactions", "Hanging network sockets"], outcome: "Unreliable state on restart" },
      with: { title: "Graceful Stop/Start", items: ["Clean process exit", "Preserved filesystem state", "Safe application teardown"], outcome: "Safe, resumable workloads" }
    },
    blockDiagram: {
      title: "Container Stop Lifecycle",
      subtitle: "The graceful shutdown process",
      nodes: [
        { id: "running", label: "Running", simpleDef: "App is active", techDef: "PID 1 running", color: "#4ade80" },
        { id: "sigterm", label: "docker stop", simpleDef: "Please quit", techDef: "Sends SIGTERM", color: "#facc15" },
        { id: "grace", label: "Wait 10s", simpleDef: "Cleanup time", techDef: "Grace period", color: "#38bdf8" },
        { id: "sigkill", label: "Force Kill", simpleDef: "Die now", techDef: "Sends SIGKILL if still running", color: "#f87171" }
      ]
    },
    terms: [
      { term: "SIGTERM", simple: "Graceful exit signal", technical: "Signal 15: Tells the process to clean up and shut down.", analogy: "A polite 'We are closing in 10 minutes, please leave'." },
      { term: "SIGKILL", simple: "Force exit signal", technical: "Signal 9: Instantly destroys the process. Cannot be intercepted.", analogy: "Pulling the fire alarm and pushing everyone out." },
      { term: "Grace Period", simple: "Waiting time", technical: "The default 10 seconds Docker waits after SIGTERM before sending SIGKILL.", analogy: "The 10 seconds before a time bomb explodes." }
    ],
    whenToUse: ["✓ Temporarily pausing a local development environment", "✓ Updating configuration before restarting", "✓ Safe shutdown of stateful databases"],
    whenNotToUse: ["✕ When a container is frozen and ignoring signals (use docker kill)", "✕ If you want to delete it completely (use rm -f)"],
    developerScenario: { title: "Database Maintenance", setup: "A developer is running a local MongoDB container.", problem: "They need to reboot their computer but want to keep the DB data.", solution: "They use 'docker stop' to let MongoDB cleanly write its logs to disk, and 'docker start' later to resume right where they left off." },
    internalFlow: [
      { step: 1, title: "Send SIGTERM", desc: "Daemon sends polite signal.", why: "Allow app to clean up.", techDetail: "Sends SIGTERM to PID 1." },
      { step: 2, title: "Wait", desc: "Waits up to 10 seconds.", why: "App is closing files.", techDetail: "Timer starts." },
      { step: 3, title: "Send SIGKILL", desc: "Force kill if needed.", why: "Ensure container stops.", techDetail: "Sends SIGKILL if PID 1 still exists." },
      { step: 4, title: "Update State", desc: "Marks container as exited.", why: "Metadata update.", techDetail: "Status becomes Exited (0)." }
    ],
    commonMistakes: [
      { mistake: "Assuming 'stop' deletes the container", whyWrong: "Stop only halts the process. The filesystem and config remain intact on disk.", correctWay: "Use 'docker rm' to delete stopped containers." },
      { mistake: "Always using 'docker kill'", whyWrong: "Force killing can corrupt databases that need to flush data to disk.", correctWay: "Use 'docker stop' for regular operations." }
    ],
    recapChecklist: ["docker stop sends SIGTERM, waits 10s, then sends SIGKILL.", "docker start resumes a stopped container with its data intact.", "Properly written apps should handle SIGTERM to shut down cleanly.", "Use 'docker kill' only for completely frozen containers."],
    challenge: { question: "What happens during the 10-second grace period after you run 'docker stop'?", options: [ { label: "Docker waits to see if the application cleans up and exits on its own (via SIGTERM)", isCorrect: true, explanation: "It gives the app a chance to shut down gracefully." }, { label: "Docker downloads updates", isCorrect: false, explanation: "Stop doesn't involve updates." }, { label: "Docker deletes the container's files", isCorrect: false, explanation: "Files remain intact." } ] },
    sandbox: {
      initialCommands: [],
      targetTask: "Stop a running container.",
      solutionCommands: ["docker stop webserver"],
      guidedSteps: [ { instruction: "Gracefully stop the 'webserver' container", command: "docker stop webserver", hint: "Run docker stop webserver" } ]
    },

    reference: {
      syntaxCheatSheet: [
        'docker stop [CONTAINER]     # Graceful stop (SIGTERM -> SIGKILL)',
        'docker start [CONTAINER]    # Restart stopped container',
        'docker restart [CONTAINER]  # Stop then start',
        'docker kill [CONTAINER]     # Instant SIGKILL',
      ],
    },
  },

  'c-docker-rm': {
    id: 'c-docker-rm',
    command: 'docker rm -f',
    title: 'Removing Containers',
    topicId: 'topic-04',
    topicNumber: '04',
    topicTitle: 'Basics of Docker',
    subtitle: 'Cleaning up stopped and exited container instances and writeable layer metadata.',
    badges: ['Beginner', 'Cleanup', 'CLI'],
    quote: 'docker rm deletes container instances and frees disk space occupied by stopped container write layers.',
    difficulty: 'Beginner',

    whatIsIt:
      '`docker rm` permanently removes one or more stopped containers from the Docker engine database. Passing `-f` (force) stops and removes a running container immediately.',
    inSimpleWords:
      'It\'s the "Trash Can" for containers. Stopping a container leaves its stopped shell on your disk. `docker rm` throws the stopped container away completely.',
    whyDoYouNeedIt:
      'Over time, hundreds of stopped containers clutter your system and waste disk space. `docker container prune` removes all stopped containers at once.',
    realWorldAnalogy:
      'Throwing away disposable food boxes after eating instead of letting them stack up in your kitchen.',

    syntaxCode: 'docker rm web-frontend\ndocker rm -f active-app\ndocker container prune',
    syntaxTokens: [
      { token: 'docker rm web-frontend', role: 'Command', explanation: 'Removes stopped container.' },
      { token: '-f', role: 'Flag', explanation: 'Force option: sends SIGKILL and removes running container immediately.' },
      { token: 'docker container prune', role: 'Command', explanation: 'Deletes ALL stopped containers on the system in bulk.' },
    ],

    actionStage: {
      before: {
        label: 'Stopped Container Metadata',
        description: 'Exited container web-frontend occupies disk space.',
        stateBadge: 'Exited (0)',
        details: ['Container ID: c-nginx-prod', 'Write layer size: 12MB'],
      },
      running: {
        label: 'Removal Execution',
        description: 'Docker daemon deletes container layer directory from disk.',
        stateBadge: 'Deleting Metadata',
        details: ['Unlinking Overlay2 write layer', 'Removing container configuration JSON'],
      },
      after: {
        label: 'Clean System Disk',
        description: 'Container completely removed from system.',
        stateBadge: 'Cleaned',
        details: ['Disk space reclaimed', 'Name "web-frontend" freed for reuse'],
      },
    },

    variations: [
      { title: 'Force Remove Running Container', syntax: 'docker rm -f web-frontend', whatItDoes: 'Kills and removes container in a single step' },
      { title: 'Prune All Stopped Containers', syntax: 'docker container prune -f', whatItDoes: 'Bulk deletes all exited containers without prompt confirmation' },
    ],

    scenarios: [
      {
        title: 'Removing Running Container',
        question: 'What happens if you try to run "docker rm my-app" on a container that is currently RUNNING?',
        options: [
          { label: 'Docker returns an error stating that you cannot remove a running container unless you use -f', command: 'rm-err', isCorrect: true, explanation: 'Pass -f or run docker stop first.' },
          { label: 'The computer turns off', command: 'turn-off', isCorrect: false, explanation: 'Incorrect.' },
        ],
      },
    ],
    withoutVsWith: {
      without: { title: "Dangling Artifacts", items: ["Hundreds of stopped containers", "Wasted disk space", "Naming conflicts"], outcome: "Cluttered host system" },
      with: { title: "docker rm", items: ["Clean host disk", "Freed container names", "Bulk pruning options"], outcome: "Tidy, optimized environment" }
    },
    blockDiagram: {
      title: "docker rm Actions",
      subtitle: "What is actually deleted",
      nodes: [
        { id: "layer", label: "Writeable Layer", simpleDef: "Temp files", techDef: "Overlay2 diff directory", color: "#f87171" },
        { id: "metadata", label: "Container JSON", simpleDef: "Config", techDef: "Config metadata", color: "#f87171" },
        { id: "image", label: "Image / Volumes", simpleDef: "Persisted stuff", techDef: "Read-only layers", color: "#4ade80" }
      ]
    },
    terms: [
      { term: "Force Flag (-f)", simple: "Kill and remove", technical: "Sends SIGKILL and removes the container in one operation.", analogy: "Throwing an appliance in the trash while it's still running." },
      { term: "Prune", simple: "Bulk delete", technical: "Removes all stopped containers across the entire Docker engine.", analogy: "Emptying the system's recycle bin." },
      { term: "Writeable Layer", simple: "Container disk space", technical: "The thin filesystem layer on top of the image where container changes are written.", analogy: "A transparent drawing sheet placed over a map." }
    ],
    whenToUse: ["✓ Freeing up a container name (e.g., 'web') to reuse it", "✓ Reclaiming disk space from old exited containers", "✓ Cleaning up after a finished task"],
    whenNotToUse: ["✕ When you still need the data inside the container (and haven't used volumes)", "✕ For persistent databases you want to restart later"],
    developerScenario: { title: "Cleaning the Environment", setup: "A developer tries to run 'docker run --name my-app redis' but gets an error: 'The name /my-app is already in use'.", problem: "An old, stopped container still owns that name.", solution: "They run 'docker rm my-app' to delete the old container, freeing up the name for the new one." },
    internalFlow: [
      { step: 1, title: "Check State", desc: "Ensure container is stopped.", why: "Safety mechanism.", techDetail: "Fails if state is Running (unless -f)." },
      { step: 2, title: "Unlink Network", desc: "Detaches network interfaces.", why: "Free IP addresses.", techDetail: "Removes veth from docker0 bridge." },
      { step: 3, title: "Delete RW Layer", desc: "Deletes container filesystem.", why: "Reclaim disk space.", techDetail: "Removes directory in /var/lib/docker/containers." },
      { step: 4, title: "Remove Metadata", desc: "Deletes from Docker DB.", why: "Free the name.", techDetail: "Removes from SQLite/daemon memory." }
    ],
    commonMistakes: [
      { mistake: "Trying to remove a running container without -f", whyWrong: "Docker prevents this to avoid accidental data loss.", correctWay: "Use 'docker stop' first, or 'docker rm -f'." },
      { mistake: "Thinking 'docker rm' deletes the image", whyWrong: "Images are separate. 'rm' only deletes the container instance.", correctWay: "Use 'docker rmi' to delete images." }
    ],
    recapChecklist: ["'docker rm' deletes stopped container instances.", "Use '-f' to force delete a running container.", "It frees up disk space and container names.", "'docker container prune' cleans up all stopped containers at once."],
    challenge: { question: "If you have 50 stopped containers taking up space, what is the fastest way to remove all of them?", options: [ { label: "docker rm -all", isCorrect: false, explanation: "Not a valid command." }, { label: "docker container prune", isCorrect: true, explanation: "Safely bulk-removes all stopped containers." }, { label: "docker rmi", isCorrect: false, explanation: "This removes images, not containers." } ] },
    sandbox: {
      initialCommands: [],
      targetTask: "Remove a stopped container.",
      solutionCommands: ["docker rm webserver"],
      guidedSteps: [ { instruction: "Remove the 'webserver' container", command: "docker rm webserver", hint: "Run docker rm webserver" } ]
    },

    reference: {
      syntaxCheatSheet: [
        'docker rm [CONTAINER]         # Remove stopped container',
        'docker rm -f [CONTAINER]      # Force remove running container',
        'docker container prune        # Delete all stopped containers',
      ],
    },
  },
};
