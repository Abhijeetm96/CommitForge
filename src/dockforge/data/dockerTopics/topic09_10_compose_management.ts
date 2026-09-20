import { UniversalDockerConcept } from '../unifiedDockerData';

export const TOPIC_09_10_CONCEPTS: Record<string, UniversalDockerConcept> = {
  'c-docker-run-flags': {
    id: 'c-docker-run-flags',
    command: 'docker run --restart=always',
    title: 'docker run Configuration Options',
    topicId: 'topic-09',
    topicNumber: '09',
    topicTitle: 'Runtime Configuration & Compose',
    subtitle: 'Mastering runtime parameters: restart policies, environment files, network attachments, and user IDs.',
    badges: ['Intermediate', 'Configuration', 'CLI'],
    quote: 'Configuring containers properly at runtime ensures self-healing restart behavior and secure execution.',
    difficulty: 'Intermediate',

    whatIsIt:
      '`docker run` supports flags like `--restart` (`no`, `on-failure`, `always`, `unless-stopped`), `--env-file`, `--network`, `--cpu-shares`, and `--user` to configure container runtime environment policies.',
    inSimpleWords:
      'Flags are control dials for your container. You can tell Docker: "If this container crashes, automatically restart it (`--restart=always`), load password secrets from a file (`--env-file`), and run as a non-root user (`--user`)."',
    whyDoYouNeedIt:
      'Configuring restart policies keeps web applications self-healing if a server reboots or a container crashes.',
    realWorldAnalogy:
      'Setting auto-restart preferences on a home security system so it turns back on automatically if the power flickers.',

    syntaxCode: 'docker run -d --name web-api --restart=unless-stopped --env-file=.env --network=app-net -p 8080:80 nginx:alpine',
    syntaxTokens: [
      { token: '--restart=unless-stopped', role: 'Restart Policy', explanation: 'Automatically restarts container on failure or host reboot unless explicitly stopped.' },
      { token: '--env-file=.env', role: 'Secret File', explanation: 'Loads key=value environment variables from file.' },
      { token: '--network=app-net', role: 'Network Flag', explanation: 'Attaches container to custom virtual network.' },
    ],

    actionStage: {
      before: {
        label: 'Unconfigured Container',
        description: 'Container crashes and stays dead forever.',
        stateBadge: 'Manual Recovery Needed',
        details: ['Restart policy: no', 'Crash -> Container remains Exited'],
      },
      running: {
        label: 'Crash Event Triggered',
        description: 'Process crashes with unhandled exception.',
        stateBadge: 'Restarting Policy Active',
        details: ['Daemon detects process exit', 'Triggering auto-restart backoff'],
      },
      after: {
        label: 'Self-Healed Container',
        description: 'Docker daemon restarts container automatically.',
        stateBadge: 'Self-Healed',
        details: ['Status: Up 5 seconds (restarted)', 'Zero human intervention required'],
      },
    },

    variations: [
      { title: 'Restart Always', syntax: 'docker run -d --restart=always nginx', whatItDoes: 'Restarts container regardless of exit code or host reboot' },
      { title: 'Restart On Failure', syntax: 'docker run -d --restart=on-failure:5 app', whatItDoes: 'Restarts up to 5 times only if container exits with non-zero error code' },
    ],

    scenarios: [
      {
        title: 'Restart Policy Options',
        question: 'Which restart policy automatically boots the container whenever the host server reboots UNLESS a developer explicitly ran "docker stop"?',
        options: [
          { label: '--restart=unless-stopped', command: 'unless-stopped', isCorrect: true, explanation: '--restart=unless-stopped preserves manual stop states across host reboots.' },
          { label: '--restart=never', command: 'never', isCorrect: false, explanation: 'Incorrect.' },
        ],
      },
    ],

    sandbox: {
      initialCommands: ['docker ps'],
      guidedSteps: [
        { instruction: 'Run a self-healing Nginx container with --restart=always flag', command: 'docker run -d --name self-healing-web --restart=always -p 8081:80 nginx:alpine', hint: 'Run docker run -d --name self-healing-web --restart=always -p 8081:80 nginx:alpine' },
        { instruction: 'Inspect container inspect JSON to confirm restart policy', command: 'docker inspect self-healing-web', hint: 'Run docker inspect self-healing-web' },
      ],
      targetTask: 'Configure container restart policies.',
      solutionCommands: ['docker run -d --name self-healing-web --restart=always -p 8081:80 nginx:alpine', 'docker inspect self-healing-web'],
    },

    reference: {
      syntaxCheatSheet: [
        '--restart=always          # Always restart on crash/reboot',
        '--restart=unless-stopped  # Restart unless stopped manually',
        '--restart=on-failure:3    # Retry 3 times on non-zero exit',
      ],
    },
  },

  'c-docker-compose': {
    id: 'c-docker-compose',
    command: 'docker compose up -d',
    title: 'docker compose Orchestration',
    topicId: 'topic-09',
    topicNumber: '09',
    topicTitle: 'Runtime Configuration & Compose',
    subtitle: 'Declarative multi-container application orchestration using docker-compose.yml files.',
    badges: ['Intermediate', 'Orchestration', 'Compose'],
    quote: 'Docker Compose orchestrates multi-container full-stack applications with a single declarative configuration file.',
    difficulty: 'Intermediate',

    whatIsIt:
      'Docker Compose is a tool for defining and running multi-container application stacks. A single `docker-compose.yml` manifest declares services (web, database, cache), networks, volumes, environment variables, and dependencies.',
    inSimpleWords:
      'Instead of opening 4 terminal tabs and running long `docker run` commands for your frontend, backend, database, and Redis cache, `docker compose up` starts your entire company stack with 1 command.',
    whyDoYouNeedIt:
      'Simplifies local developer onboarding, standardizes stack configurations across team members, and coordinates service dependency startup order.',
    realWorldAnalogy:
      'A master conductor directing an orchestra. With one wave of the baton (`docker compose up`), all instruments (containers) begin playing together in harmony.',

    syntaxCode: 'version: "3.8"\nservices:\n  web:\n    build: .\n    ports:\n      - "3000:3000"\n    environment:\n      - DB_HOST=db\n  db:\n    image: postgres:16-alpine\n    volumes:\n      - pgdata:/var/lib/postgresql/data\nvolumes:\n  pgdata:',
    syntaxTokens: [
      { token: 'services:', role: 'YAML Section', explanation: 'Declares application services.' },
      { token: 'DB_HOST=db', role: 'DNS Link', explanation: 'Service name "db" acts as automatic internal network DNS hostname.' },
      { token: 'docker compose up -d', role: 'CLI Command', explanation: 'Builds, creates, and launches stack in background.' },
    ],

    actionStage: {
      before: {
        label: 'Multiple Disjointed Services',
        description: 'Frontend, API, and DB require manual commands.',
        stateBadge: 'Manual Execution',
        details: ['No unified networking', 'Manual port management'],
      },
      running: {
        label: 'docker compose up Execution',
        description: 'Compose creates dedicated bridge network and launches services.',
        stateBadge: 'Stack Launching',
        details: ['Network app_default created', 'Container app-db-1 started', 'Container app-web-1 started'],
      },
      after: {
        label: 'Unified Full-Stack App',
        description: 'All services linked with automatic DNS resolution.',
        stateBadge: 'Stack Operational',
        details: ['web connects to db:5432', 'Single teardown: docker compose down'],
      },
    },

    variations: [
      { title: 'Launch Stack Detached', syntax: 'docker compose up -d', whatItDoes: 'Launches all services in background' },
      { title: 'Stop & Clean Stack', syntax: 'docker compose down -v', whatItDoes: 'Stops containers and deletes attached networks & volumes' },
      { title: 'Stream Stack Logs', syntax: 'docker compose logs -f web', whatItDoes: 'Streams real-time logs for web service' },
    ],

    scenarios: [
      {
        title: 'Compose Automatic DNS',
        question: 'Inside a Compose stack with services named "api" and "postgres-db", how does the "api" service connect to the database container?',
        options: [
          { label: 'Using the hostname "postgres-db" (e.g. postgresql://postgres-db:5432)', command: 'service-dns', isCorrect: true, explanation: 'Docker Compose creates a shared bridge network where service names act as DNS hostnames.' },
          { label: 'Using 127.0.0.1', command: 'localhost-err', isCorrect: false, explanation: '127.0.0.1 inside a container refers to itself, not the database container.' },
        ],
      },
    ],

    sandbox: {
      initialCommands: ['docker compose ps'],
      guidedSteps: [
        { instruction: 'Launch application stack using Docker Compose in detached mode', command: 'docker compose up -d', hint: 'Run docker compose up -d' },
        { instruction: 'Inspect running compose stack services', command: 'docker compose ps', hint: 'Run docker compose ps' },
        { instruction: 'Tear down stack', command: 'docker compose down', hint: 'Run docker compose down' },
      ],
      targetTask: 'Orchestrate multi-container application stacks.',
      solutionCommands: ['docker compose up -d', 'docker compose ps', 'docker compose down'],
    },

    reference: {
      officialDocUrl: 'https://docs.docker.com/compose/',
      syntaxCheatSheet: [
        'docker compose up -d        # Start stack',
        'docker compose down         # Stop & remove stack',
        'docker compose ps           # List stack containers',
        'docker compose logs -f      # Stream stack logs',
      ],
    },
  },

  'c-container-logs': {
    id: 'c-container-logs',
    command: 'docker logs -f --tail 100',
    title: 'Container Logs & Streaming',
    topicId: 'topic-10',
    topicNumber: '10',
    topicTitle: 'Running & Managing Containers',
    subtitle: 'Capturing, filtering, and streaming stdout/stderr outputs from containerized applications.',
    badges: ['Beginner', 'Observability', 'Logs'],
    quote: 'Docker automatically captures stdout and stderr output from PID 1 processes into structured JSON logging drivers.',
    difficulty: 'Beginner',

    whatIsIt:
      'Docker captures all standard output (`stdout`) and standard error (`stderr`) streams emitted by a container\'s main process (PID 1). `docker logs` displays or streams these log messages.',
    inSimpleWords:
      '`docker logs` is like opening the console log inspector for your container. If your app prints a log line (`console.log()` or `print()`), `docker logs` captures it instantly.',
    whyDoYouNeedIt:
      'Essential for diagnosing application crashes, HTTP request errors, database query failures, and background worker exceptions.',
    realWorldAnalogy:
      'A black box flight recorder on an airplane that records every pilot transmission and system message during flight.',

    syntaxCode: 'docker logs web-frontend\ndocker logs -f web-frontend\ndocker logs --tail 50 -t web-frontend',
    syntaxTokens: [
      { token: 'docker logs', role: 'Command', explanation: 'Retrieves stdout/stderr logs.' },
      { token: '-f', role: 'Flag', explanation: 'Follow mode: streams live logs in real-time (like tail -f).' },
      { token: '--tail 50', role: 'Flag', explanation: 'Shows only the last 50 log entries.' },
      { token: '-t', role: 'Flag', explanation: 'Includes ISO timestamps on log lines.' },
    ],

    actionStage: {
      before: {
        label: 'Application Writes to stdout',
        description: 'App inside container calls console.log("User logged in").',
        stateBadge: 'Writing stdout',
        details: ['stdout descriptor captured by Docker daemon'],
      },
      running: {
        label: 'Logging Driver Storage',
        description: 'dockerd writes log line to /var/lib/docker/containers/<id>/<id>-json.log.',
        stateBadge: 'Log Stored',
        details: ['JSON logging driver', 'Timestamp attached'],
      },
      after: {
        label: 'Terminal Output Stream',
        description: 'Developer runs "docker logs -f" to inspect live application log stream.',
        stateBadge: 'Streaming Live',
        details: ['Real-time streaming', 'Errors highlighted in stderr'],
      },
    },

    variations: [
      { title: 'Follow Live Stream', syntax: 'docker logs -f web-frontend', whatItDoes: 'Streams log output in real-time' },
      { title: 'Tail Last 100 Lines', syntax: 'docker logs --tail 100 web-frontend', whatItDoes: 'Displays last 100 lines only' },
    ],

    scenarios: [
      {
        title: 'Where Containers Should Write Logs',
        question: 'In accordance with 12-Factor App best practices, where should a containerized application write its log outputs?',
        options: [
          { label: 'Directly to standard output (stdout) and standard error (stderr)', command: 'stdout-logs', isCorrect: true, explanation: 'Docker automatically captures stdout/stderr. Writing to local disk log files inside containers is bad practice.' },
          { label: 'To a Word Document', command: 'word-doc', isCorrect: false, explanation: 'Incorrect.' },
        ],
      },
    ],

    sandbox: {
      initialCommands: ['docker logs web-frontend'],
      guidedSteps: [
        { instruction: 'Inspect container logs for web-frontend', command: 'docker logs web-frontend', hint: 'Run docker logs web-frontend' },
      ],
      targetTask: 'Inspect container stdout logs.',
      solutionCommands: ['docker logs web-frontend'],
    },

    reference: {
      syntaxCheatSheet: [
        'docker logs [CONTAINER]            # View all logs',
        'docker logs -f [CONTAINER]         # Stream live logs',
        'docker logs --tail 100 [CONTAINER] # Last 100 lines',
        'docker logs -t [CONTAINER]         # Show timestamps',
      ],
    },
  },

  'c-container-inspect-stats': {
    id: 'c-container-inspect-stats',
    command: 'docker inspect',
    title: 'Inspection & Process Stats',
    topicId: 'topic-10',
    topicNumber: '10',
    topicTitle: 'Running & Managing Containers',
    subtitle: 'Deep metadata inspection with JSON formatting, process tree analysis with docker top, and resource stats.',
    badges: ['Intermediate', 'Forensics', 'Inspection'],
    quote: 'docker inspect displays low-level metadata including IP addresses, mount points, environment variables, and network configurations.',
    difficulty: 'Intermediate',

    whatIsIt:
      '`docker inspect` returns detailed JSON metadata for containers, images, volumes, or networks. `docker top` lists running processes inside a container, and `docker stats` streams real-time CPU, RAM, and I/O metrics.',
    inSimpleWords:
      '`docker inspect` is an X-ray machine for your container. It shows its exact IP address, environment variables, mounted volumes, and status details.',
    whyDoYouNeedIt:
      'Essential for troubleshooting container IP address resolution, verifying environment variable injection, and debugging volume mount target paths.',
    realWorldAnalogy:
      'Reading a patient\'s full medical chart containing blood pressure, X-rays, and heart rate history.',

    syntaxCode: 'docker inspect web-frontend\ndocker top web-frontend\ndocker stats --no-stream',
    syntaxTokens: [
      { token: 'docker inspect', role: 'Command', explanation: 'Outputs low-level JSON configuration array.' },
      { token: 'docker top', role: 'Command', explanation: 'Lists host PIDs for processes inside container.' },
      { token: 'docker stats', role: 'Command', explanation: 'Streams live CPU/RAM/NET usage.' },
    ],

    actionStage: {
      before: {
        label: 'Active Container Instance',
        description: 'Container web-frontend running in cluster.',
        stateBadge: 'Live Container',
        details: ['IP unknown', 'Status: Running'],
      },
      running: {
        label: 'Daemon Query',
        description: 'Querying Docker daemon state engine for container metadata.',
        stateBadge: 'Querying Metadata',
        details: ['Fetching NetworkSettings', 'Fetching Mounts array', 'Fetching Config.Env'],
      },
      after: {
        label: 'Detailed JSON Output',
        description: 'Formatted JSON displayed displaying IP, ports, environment, and mounts.',
        stateBadge: 'X-Ray Inspected',
        details: ['IP: 172.17.0.2', 'State: Running', 'Pid: 49201'],
      },
    },

    variations: [
      { title: 'Format Inspect Output', syntax: "docker inspect --format='{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' web-frontend", whatItDoes: 'Extracts ONLY the container IP address string using Go templates' },
    ],

    scenarios: [
      {
        title: 'Extracting IP Address',
        question: 'Which command displays the full low-level JSON configuration object for a container including its internal IP address?',
        options: [
          { label: 'docker inspect [CONTAINER]', command: 'inspect-cmd', isCorrect: true, explanation: 'docker inspect outputs detailed JSON configuration metadata.' },
          { label: 'docker ps', command: 'ps-cmd', isCorrect: false, explanation: 'docker ps displays summary information only.' },
        ],
      },
    ],

    sandbox: {
      initialCommands: ['docker inspect web-frontend'],
      guidedSteps: [
        { instruction: 'Inspect full JSON metadata for container web-frontend', command: 'docker inspect web-frontend', hint: 'Run docker inspect web-frontend' },
        { instruction: 'View process table inside web-frontend container', command: 'docker top web-frontend', hint: 'Run docker top web-frontend' },
      ],
      targetTask: 'Inspect container internals with docker inspect.',
      solutionCommands: ['docker inspect web-frontend', 'docker top web-frontend'],
    },

    reference: {
      syntaxCheatSheet: [
        'docker inspect [CONTAINER]    # View JSON metadata',
        'docker top [CONTAINER]        # View container processes',
        'docker stats                  # Stream CPU/RAM metrics',
      ],
    },
  },
};
