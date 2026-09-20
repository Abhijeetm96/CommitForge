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

    sandbox: {
      initialCommands: ['docker info'],
      guidedSteps: [
        { instruction: 'Verify Docker daemon system information', command: 'docker info', hint: 'Run docker info' },
      ],
      targetTask: 'Check Docker Desktop daemon readiness.',
      solutionCommands: ['docker info'],
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

    sandbox: {
      initialCommands: ['docker version'],
      guidedSteps: [
        { instruction: 'Check Docker engine server details', command: 'docker version', hint: 'Run docker version' },
      ],
      targetTask: 'Check Linux engine socket status.',
      solutionCommands: ['docker version'],
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

    sandbox: {
      initialCommands: ['docker ps'],
      guidedSteps: [
        { instruction: 'Run an Nginx container in detached mode named "custom-web" on port 8080', command: 'docker run -d --name custom-web -p 8080:80 nginx:1.25-alpine', hint: 'Run docker run -d --name custom-web -p 8080:80 nginx:1.25-alpine' },
        { instruction: 'Verify container is active using docker ps', command: 'docker ps', hint: 'Run docker ps' },
      ],
      targetTask: 'Master docker run options.',
      solutionCommands: ['docker run -d --name custom-web -p 8080:80 nginx:1.25-alpine', 'docker ps'],
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

    sandbox: {
      initialCommands: ['docker exec web-frontend ls -la'],
      guidedSteps: [
        { instruction: 'Run ls -la inside container web-frontend using docker exec', command: 'docker exec web-frontend ls -la', hint: 'Run docker exec web-frontend ls -la' },
        { instruction: 'Print environment variables inside container', command: 'docker exec web-frontend env', hint: 'Run docker exec web-frontend env' },
      ],
      targetTask: 'Inspect container internal files with docker exec.',
      solutionCommands: ['docker exec web-frontend ls -la', 'docker exec web-frontend env'],
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

    sandbox: {
      initialCommands: ['docker ps'],
      guidedSteps: [
        { instruction: 'Stop the running container web-frontend', command: 'docker stop web-frontend', hint: 'Run docker stop web-frontend' },
        { instruction: 'Verify container is stopped using docker ps -a', command: 'docker ps -a', hint: 'Run docker ps -a' },
        { instruction: 'Start the container back up', command: 'docker start web-frontend', hint: 'Run docker start web-frontend' },
      ],
      targetTask: 'Manage container lifecycle with stop and start.',
      solutionCommands: ['docker stop web-frontend', 'docker start web-frontend'],
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

    sandbox: {
      initialCommands: ['docker ps -a'],
      guidedSteps: [
        { instruction: 'Force remove the container cache-redis', command: 'docker rm -f cache-redis', hint: 'Run docker rm -f cache-redis' },
        { instruction: 'Verify container is removed using docker ps -a', command: 'docker ps -a', hint: 'Run docker ps -a' },
      ],
      targetTask: 'Clean up stopped container instances.',
      solutionCommands: ['docker rm -f cache-redis'],
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
