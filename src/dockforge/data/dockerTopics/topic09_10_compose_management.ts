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

    withoutVsWith: {
      without: {
        title: "Default Defaults",
        items: [
          "Containers crash and never come back up",
          "Hardcoded variables inside images mean rebuilding for every environment",
          "Root user runs the process (security risk)",
          "Container consumes 100% of host CPU if a memory leak occurs"
        ],
        outcome: "Fragile, insecure applications that need manual baby-sitting."
      },
      with: {
        title: "Runtime Configurations",
        items: [
          "Auto-restarts when crashes occur (--restart=unless-stopped)",
          "Injects variables per environment (-e DB_PASS=secret)",
          "Runs as a non-privileged user (--user 1000:1000)",
          "Caps resource usage (--memory=512m --cpus=1.5)"
        ],
        outcome: "Self-healing, secure, and resource-capped microservices."
      }
    },

    blockDiagram: {
      title: "Docker Run Flags Execution",
      subtitle: "How CLI arguments translate to cgroup and namespace configuration",
      nodes: [
        { id: "docker-cli", label: "Docker CLI", simpleDef: "Sends config flags", techDef: "docker run -d --memory=512m", color: "#38bdf8" },
        { id: "docker-api", label: "Docker API", simpleDef: "Receives JSON spec", techDef: "POST /v1.43/containers/create", badge: "Daemon", color: "#4ade80" },
        { id: "cgroups", label: "cgroups (Resources)", simpleDef: "Limits RAM/CPU", techDef: "/sys/fs/cgroup/memory.max = 512m", color: "#facc15" },
        { id: "namespaces", label: "Namespaces", simpleDef: "Applies user isolation", techDef: "CLONE_NEWUSER syscall", color: "#f87171" }
      ]
    },

    terms: [
      { term: "Restart Policy", simple: "Rules for when a container should automatically turn back on", technical: "Daemon-level supervisory loop checking container exit codes.", analogy: "A thermostat automatically turning the heat back on when temperature drops." },
      { term: "cgroups", simple: "Limits how much CPU and RAM a container can use", technical: "Linux Control Groups controlling and accounting for process resource isolation.", analogy: "A budget limit on a corporate credit card." },
      { term: "Read-only Root Filesystem", simple: "Makes the container's hard drive un-editable", technical: "--read-only flag mounts the container's overlayfs upperdir as ro.", analogy: "Flipping the write-protect switch on an SD card." }
    ],

    whenToUse: [
      "✓ Use `--restart=unless-stopped` for web servers so they survive server reboots.",
      "✓ Use `--memory` and `--cpus` to prevent a single container from crashing the entire host.",
      "✓ Use `--user` in production to prevent privilege escalation if the app is compromised.",
      "✓ Use `--env-file` to pass multiple database credentials securely."
    ],

    whenNotToUse: [
      "✕ Don't use `--restart=always` on one-off maintenance scripts (they'll run in an infinite loop).",
      "✕ Avoid passing highly sensitive production passwords directly via `-e PASSWORD=...` in CLI history."
    ],

    developerScenario: {
      title: "The Out-of-Memory Outage",
      setup: "A Node.js backend occasionally suffers from a memory leak, consuming 100% of the host RAM and crashing other apps.",
      problem: "Running simply `docker run -d node-api` gives the container unlimited access to the host's RAM.",
      solution: "Running `docker run -d --memory=512m --restart=on-failure:3 node-api` restricts the app to 512MB. If it leaks and gets OOM-killed, Docker automatically restarts it up to 3 times while developers patch the leak."
    },

    internalFlow: [
      { step: 1, title: "CLI Parsing", desc: "User types docker run with flags.", why: "Client translates flags into a HostConfig JSON object.", techDetail: "Parsed arguments map to HostConfig fields like RestartPolicy, Resources." },
      { step: 2, title: "API Request", desc: "Sends request to Daemon.", why: "Docker daemon needs the full specification.", techDetail: "POST /containers/create with JSON payload containing both Config and HostConfig." },
      { step: 3, title: "Resource Setup", desc: "Daemon creates cgroups.", why: "Enforces memory/CPU limits.", techDetail: "Containerd creates cgroup limits via runc (e.g., setting memory.max in cgroups v2)." },
      { step: 4, title: "Network Setup", desc: "Daemon attaches network.", why: "Connects container to virtual bridge.", techDetail: "Creates veth pairs and applies iptables rules for published ports." },
      { step: 5, title: "Process Launch", desc: "runc starts process with given user.", why: "Executes the main PID 1.", techDetail: "setuid/setgid to the user specified by --user flag inside the isolated namespaces." }
    ],

    commonMistakes: [
      { mistake: "Putting flags AFTER the image name", whyWrong: "Anything after the image name is treated as the command to run inside the container.", correctWay: "docker run -p 80:80 nginx (Correct) vs docker run nginx -p 80:80 (Incorrect)" },
      { mistake: "Typing --restart always", whyWrong: "It requires an equals sign or space, but equals is standard syntax, and missing the -- prefix causes errors.", correctWay: "Use --restart=always" }
    ],

    recapChecklist: [
      "Flags go BEFORE the image name: docker run [FLAGS] [IMAGE] [COMMAND].",
      "--restart=unless-stopped is the safest default for continuous services.",
      "Always set memory limits (--memory) to prevent host-wide outages.",
      "Use environment variables (-e or --env-file) to make containers portable."
    ],

    challenge: {
      question: "You want a background worker to automatically restart if it crashes with an error, but completely give up after 5 failed attempts. Which restart policy should you use?",
      options: [
        { label: "--restart=on-failure:5", isCorrect: true, explanation: "on-failure accepts an optional maximum retry count. If it fails 5 times, Docker stops trying." },
        { label: "--restart=always:5", isCorrect: false, explanation: "The 'always' policy does not accept a retry count and will loop infinitely." },
        { label: "--restart=unless-stopped", isCorrect: false, explanation: "unless-stopped will restart indefinitely on crashes." }
      ]
    },

    sandbox: {
      initialCommands: [],
      guidedSteps: [
        { instruction: 'Launch an application container with specific restart policies, memory/CPU limits, environment variables, and port mappings.', command: 'docker run -d --restart=unless-stopped --memory=512m --cpus=1.5 -e NODE_ENV=production -p 3000:3000 myapp', hint: 'Follow the exact flag specification provided in the prompt' }
      ],
      targetTask: 'Launch a container with robust resource limits and configurations.',
      solutionCommands: ['docker run -d --restart=unless-stopped --memory=512m --cpus=1.5 -e NODE_ENV=production -p 3000:3000 myapp'],
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

    withoutVsWith: {
      without: {
        title: "Manual CLI Hell",
        items: [
          "Running 5 separate `docker run` commands with complex flags",
          "Manually creating bridge networks so containers can talk",
          "Guessing which container to start first (DB before API)",
          "Writing 10-line bash scripts just to boot the dev environment"
        ],
        outcome: "New developer onboarding takes 3 days of configuring local environments."
      },
      with: {
        title: "Docker Compose",
        items: [
          "One `docker-compose.yml` file defines the entire architecture",
          "Automatic internal DNS and isolated networking",
          "`depends_on` ensures proper startup order",
          "One command (`docker compose up -d`) boots everything"
        ],
        outcome: "New developer onboarding takes 5 minutes and 1 command."
      }
    },

    blockDiagram: {
      title: "Docker Compose Architecture",
      subtitle: "How Compose translates YAML to a running stack",
      nodes: [
        { id: "yaml", label: "docker-compose.yml", simpleDef: "Declarative config", techDef: "Parses YAML via compose-go", color: "#38bdf8" },
        { id: "network", label: "Stack Network", simpleDef: "Isolated bridge", techDef: "docker network create myapp_default", badge: "Auto-created", color: "#4ade80" },
        { id: "db", label: "DB Service", simpleDef: "Starts first", techDef: "PostgreSQL container attached to network", color: "#facc15" },
        { id: "web", label: "Web Service", simpleDef: "Starts after DB", techDef: "Node.js container with DNS resolution to 'db'", color: "#f87171" }
      ]
    },

    terms: [
      { term: "Service", simple: "A logical component of your app, like a database or backend", technical: "A definition in YAML that maps to one or more container replicas from the same image.", analogy: "A specific department in a company (e.g., Accounting)." },
      { term: "depends_on", simple: "Tells Docker 'start this before that'", technical: "Explicitly declares startup dependency ordering between services.", analogy: "Putting on your socks before your shoes." },
      { term: "Compose Project", simple: "The entire application stack", technical: "Group of associated containers, volumes, and networks, usually isolated by the directory name.", analogy: "The whole company building housing all departments." }
    ],

    whenToUse: [
      "✓ Use Compose for local development to spin up your DB, cache, and API easily.",
      "✓ Use Compose for single-server production deployments.",
      "✓ Use Compose to run CI/CD integration tests requiring a database."
    ],

    whenNotToUse: [
      "✕ Don't use Compose for massive multi-server clustering (use Kubernetes or Swarm).",
      "✕ Don't use Compose to just run a single isolated container if `docker run` is simpler."
    ],

    developerScenario: {
      title: "The Full-Stack Boot",
      setup: "A developer clones a React/Node/PostgreSQL repository. They need to run it locally.",
      problem: "They must install Node, PostgreSQL, configure DB users, run migrations, and start both dev servers on different ports.",
      solution: "By writing a docker-compose.yml, the developer just runs `docker compose up -d`. Compose pulls the Postgres image, builds the Node API, links them on a private network, and exposes the React frontend on localhost:3000."
    },

    internalFlow: [
      { step: 1, title: "YAML Parsing", desc: "Compose CLI reads docker-compose.yml.", why: "To validate syntax and merge overrides.", techDetail: "Validates against Compose Specification schema, interpolates .env variables." },
      { step: 2, title: "Network Creation", desc: "Creates a default bridge network.", why: "So containers can communicate securely.", techDetail: "Executes equivalent of 'docker network create <project>_default'." },
      { step: 3, title: "Volume Provisioning", desc: "Creates named volumes.", why: "To persist database data.", techDetail: "Checks if volumes exist, creates 'docker volume create <project>_dbdata' if not." },
      { step: 4, title: "Dependency Resolution", desc: "Calculates startup order.", why: "Ensures DB is up before API connects.", techDetail: "Builds a Directed Acyclic Graph (DAG) based on depends_on directives." },
      { step: 5, title: "Service Launch", desc: "Starts containers via Docker API.", why: "Executes the actual runtime.", techDetail: "POST /v1.43/containers/create for each service with labels (com.docker.compose.project)." }
    ],

    commonMistakes: [
      { mistake: "Assuming depends_on waits for the DB to be 'ready'", whyWrong: "depends_on only waits for the container to START, not for the database inside to actually accept connections.", correctWay: "Use depends_on with a 'condition: service_healthy' and define a healthcheck in the DB service." },
      { mistake: "Losing database data when running docker compose down", whyWrong: "Using 'docker compose down -v' deletes the named volumes along with containers.", correctWay: "Just use 'docker compose down' to keep volumes, or 'docker compose stop' to just halt containers." }
    ],

    recapChecklist: [
      "A docker-compose.yml defines services, networks, and volumes in one file.",
      "Service names automatically become DNS hostnames (e.g., 'db' translates to the DB container's IP).",
      "Use 'docker compose up -d' to start everything in the background.",
      "Use 'docker compose down' to stop and clean up the entire stack."
    ],

    challenge: {
      question: "In a docker-compose.yml file, you have a service named 'redis-cache'. How should your 'api' service connect to it?",
      options: [
        { label: "Connect to the hostname 'redis-cache'", isCorrect: true, explanation: "Docker Compose automatically sets up DNS resolution so service names resolve to their respective container IPs." },
        { label: "Connect to localhost:6379", isCorrect: false, explanation: "localhost inside the 'api' container points to itself, not the redis container." },
        { label: "Hardcode the IP address (e.g., 172.18.0.5)", isCorrect: false, explanation: "Container IPs change dynamically upon recreation, so hardcoding them will break." }
      ]
    },

    sandbox: {
      initialCommands: [],
      guidedSteps: [
        { instruction: 'Start the entire application stack in the background using Docker Compose.', command: 'docker compose up -d', hint: 'Use the up command with the detached flag.' }
      ],
      targetTask: 'Deploy a multi-service application stack using Compose.',
      solutionCommands: ['docker compose up -d'],
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

    withoutVsWith: {
      without: {
        title: "Blind Operations",
        items: [
          "SSHing into a container just to read a text file log",
          "Losing all error logs when a container crashes and gets deleted",
          "Trying to correlate timestamps manually across 5 different terminal windows",
          "Running out of disk space because log files grow infinitely inside the container"
        ],
        outcome: "Troubleshooting errors takes hours of blind guessing."
      },
      with: {
        title: "Docker Logging Drivers",
        items: [
          "All logs stream instantly via `docker logs`",
          "Logs are stored externally on the host, surviving container deletion",
          "Built-in log rotation (max-size) prevents disk full errors",
          "Centralized timestamping with the `-t` flag"
        ],
        outcome: "Instant observability and root-cause analysis."
      }
    },

    blockDiagram: {
      title: "Docker Logging Architecture",
      subtitle: "How stdout/stderr reaches your terminal",
      nodes: [
        { id: "app", label: "App (PID 1)", simpleDef: "Prints to console", techDef: "console.log() writes to FD 1 (stdout)", color: "#facc15" },
        { id: "daemon", label: "Docker Daemon", simpleDef: "Captures output", techDef: "dockerd reads pipes from containerd", badge: "Engine", color: "#38bdf8" },
        { id: "driver", label: "Log Driver", simpleDef: "Stores the logs", techDef: "json-file (default), syslog, or fluentd", color: "#4ade80" },
        { id: "cli", label: "docker logs", simpleDef: "Reads from driver", techDef: "API GET /containers/{id}/logs", color: "#f87171" }
      ]
    },

    terms: [
      { term: "stdout / stderr", simple: "Standard output and standard error streams", technical: "File descriptors 1 and 2 where processes send normal text and error text.", analogy: "A regular loudspeaker (stdout) and an emergency alarm siren (stderr)." },
      { term: "Logging Driver", simple: "The plugin Docker uses to save logs", technical: "Daemon-level mechanism that handles log persistence (json-file, local, syslog, journald).", analogy: "Choosing whether to write meeting minutes in a notebook, Google Doc, or an email." },
      { term: "Log Rotation", simple: "Automatically deleting old logs so the disk doesn't fill up", technical: "Configuring max-size and max-file daemon options for the json-file driver.", analogy: "A security camera that records over the oldest footage when the tape is full." }
    ],

    whenToUse: [
      "✓ Use `docker logs -f` to watch a web server's incoming traffic in real-time.",
      "✓ Use `docker logs --tail 50` to quickly check the most recent error before a crash.",
      "✓ Use `docker logs --since 10m` to view logs from the last 10 minutes when an alert fired."
    ],

    whenNotToUse: [
      "✕ Don't run `docker logs` without `--tail` on a container that has been running for months (it will print millions of lines and freeze your terminal).",
      "✕ Don't write log files to the local container filesystem (e.g., `/app/logs/app.log`); always log to stdout."
    ],

    developerScenario: {
      title: "The Silent Crash",
      setup: "A background worker container keeps restarting every 5 minutes. The developer has no idea why.",
      problem: "The container exits too fast to `docker exec` into it and check.",
      solution: "The developer runs `docker logs --tail 100 worker`. They immediately see a Python stack trace indicating a 'Database Connection Timeout' just before the crash."
    },

    internalFlow: [
      { step: 1, title: "Process Output", desc: "Application writes to stdout.", why: "Standard 12-factor app behavior.", techDetail: "Process PID 1 writes to standard file descriptor 1." },
      { step: 2, title: "Daemon Capture", desc: "Docker engine intercepts the stream.", why: "To manage the logs externally.", techDetail: "containerd relays the IO streams via FIFOs to dockerd." },
      { step: 3, title: "Driver Processing", desc: "Log driver formats the data.", why: "To structure the log for later querying.", techDetail: "json-file driver wraps the text in a JSON object with a timestamp." },
      { step: 4, title: "Disk Persistence", desc: "Logs are saved to the host disk.", why: "So they survive container restarts.", techDetail: "Written to /var/lib/docker/containers/<id>/<id>-json.log." },
      { step: 5, title: "CLI Retrieval", desc: "User runs docker logs.", why: "To view the history.", techDetail: "Docker CLI requests logs via Docker API, applying --tail and --since filters." }
    ],

    commonMistakes: [
      { mistake: "Freezing the terminal with infinite logs", whyWrong: "Running docker logs without --tail on a long-running app prints gigabytes of text.", correctWay: "Always use --tail 100 or --tail 500." },
      { mistake: "App writes to a local file instead of stdout", whyWrong: "If your app logs to /var/log/app.log, docker logs will show nothing.", correctWay: "Configure your app framework to log to console/stdout instead of a file." }
    ],

    recapChecklist: [
      "Docker automatically captures stdout and stderr from the main container process.",
      "Use `docker logs -f` to follow logs live.",
      "Use `--tail 100` to limit output and avoid terminal flooding.",
      "Log files are stored on the Docker host disk, usually as JSON."
    ],

    challenge: {
      question: "Your container crashed 5 minutes ago. When you run `docker logs myapp`, the output is blank. What is the most likely reason?",
      options: [
        { label: "The application is writing logs to a file inside the container instead of stdout.", isCorrect: true, explanation: "Docker logs only captures stdout and stderr. If the app writes to a custom file (e.g., app.log), docker logs won't see it." },
        { label: "Docker automatically deletes logs when a container crashes.", isCorrect: false, explanation: "Logs persist on the host even if the container stops or crashes." },
        { label: "You need to add the -f flag to see past logs.", isCorrect: false, explanation: "-f is for following future live logs; past logs print automatically without it." }
      ]
    },

    sandbox: {
      initialCommands: [],
      guidedSteps: [
        { instruction: 'Stream the last 100 lines of logs for the webserver container.', command: 'docker logs -f --tail 100 webserver', hint: 'Use the logs command with -f and --tail flags.' }
      ],
      targetTask: 'Stream live logs from a running container.',
      solutionCommands: ['docker logs -f --tail 100 webserver'],
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

    withoutVsWith: {
      without: {
        title: "Guessing Container State",
        items: [
          "Guessing what IP address was assigned to the container",
          "Wondering if the environment variables actually injected properly",
          "Not knowing if a container is consuming 100% CPU",
          "Executing `ps aux` inside the container to see running apps"
        ],
        outcome: "Blind operations leading to misconfigured networks and crashed hosts."
      },
      with: {
        title: "Docker Inspection Tools",
        items: [
          "`docker inspect` reveals the exact JSON state of the container",
          "`docker top` shows container processes from the host's perspective",
          "`docker stats` acts like `htop` for all running containers",
          "Go templates extract exactly the data you need"
        ],
        outcome: "Total visibility into container internals, resources, and metadata."
      }
    },

    blockDiagram: {
      title: "Docker Inspection Mechanisms",
      subtitle: "How Docker provides visibility into container internals",
      nodes: [
        { id: "inspect", label: "docker inspect", simpleDef: "Metadata JSON", techDef: "Reads daemon state store (sqlite/boltdb)", color: "#38bdf8" },
        { id: "top", label: "docker top", simpleDef: "Process list", techDef: "Scans host /proc for namespace PIDs", color: "#4ade80" },
        { id: "stats", label: "docker stats", simpleDef: "Resource metrics", techDef: "Reads /sys/fs/cgroup/ metrics", color: "#facc15" },
        { id: "health", label: "Health Checks", simpleDef: "Liveness probes", techDef: "Daemon periodically execs CMD inside namespace", color: "#f87171" }
      ]
    },

    terms: [
      { term: "JSON Metadata", simple: "A structured text file containing every detail about a container", technical: "The internal state representation maintained by the Docker Daemon.", analogy: "A car's complete manufacturing spec sheet and registration document." },
      { term: "Go Templates", simple: "A way to format the messy JSON output into a clean string", technical: "Using the `--format` flag with Go text/template syntax to query specific JSON paths.", analogy: "Using a magnifying glass to look at exactly one line on a document." },
      { term: "docker stats", simple: "A live dashboard of CPU and RAM usage", technical: "Aggregates real-time metrics exposed by the Linux cgroups filesystem.", analogy: "The task manager or activity monitor on your laptop." }
    ],

    whenToUse: [
      "✓ Use `docker inspect` to verify that a volume mount path is exactly what you expect.",
      "✓ Use `docker inspect` to troubleshoot why a container is unhealthy (check the Health status).",
      "✓ Use `docker top` to see if a background worker process actually spawned child processes.",
      "✓ Use `docker stats` when your server is running slow to find the container hogging the RAM."
    ],

    whenNotToUse: [
      "✕ Don't use `docker inspect` to read application logs (use `docker logs`).",
      "✕ Don't manually parse the massive JSON output if you only need one value—use `--format` instead."
    ],

    developerScenario: {
      title: "The Missing Environment Variable",
      setup: "A Python app keeps connecting to the 'dev' database instead of the 'prod' database.",
      problem: "The developer claims they passed `-e DB_ENV=prod`, but the app behaves differently.",
      solution: "By running `docker inspect python-app`, the developer checks the 'Config.Env' array and realizes they actually typed `DB_EN=prod` (a typo). They destroy and recreate the container with the correct variable."
    },

    internalFlow: [
      { step: 1, title: "Command Execution", desc: "User runs docker inspect <id>.", why: "To fetch configuration.", techDetail: "CLI sends GET /containers/{id}/json." },
      { step: 2, title: "Daemon Lookup", desc: "Daemon queries internal memory.", why: "Retrieves the active state object.", techDetail: "Reads container metadata from daemon's active memory and disk state." },
      { step: 3, title: "Network Resolution", desc: "Resolves active IP addresses.", why: "Network details are dynamic.", techDetail: "Queries the network sandbox for current IP and MAC addresses." },
      { step: 4, title: "Template Processing", desc: "Filters via --format if provided.", why: "To narrow down output.", techDetail: "Executes Go text/template engine against the JSON payload." },
      { step: 5, title: "Output Rendering", desc: "Prints JSON or formatted string.", why: "Returns results to terminal.", techDetail: "Renders pretty-printed JSON to stdout." }
    ],

    commonMistakes: [
      { mistake: "Trying to find application logs in inspect", whyWrong: "docker inspect only shows metadata and configuration, not stdout.", correctWay: "Use docker logs." },
      { mistake: "Struggling to read the massive JSON output", whyWrong: "Scrolling through 200 lines of JSON to find the IP address is inefficient.", correctWay: "Use `docker inspect --format='{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' my-container` or pipe to `grep`." }
    ],

    recapChecklist: [
      "`docker inspect` returns the ultimate source of truth for container configuration.",
      "Use `docker stats` for a live, real-time dashboard of CPU and Memory usage.",
      "`docker top` shows the host-level PIDs of processes running inside the container.",
      "The `--format` flag uses Go templates to extract specific JSON fields cleanly."
    ],

    challenge: {
      question: "Which command would you use to see a live, continuously updating stream of CPU and Memory usage for all running containers?",
      options: [
        { label: "docker stats", isCorrect: true, explanation: "docker stats provides a live, interactive resource usage stream similar to 'top' in Linux." },
        { label: "docker inspect --metrics", isCorrect: false, explanation: "docker inspect provides static metadata configuration, not live resource metrics." },
        { label: "docker top", isCorrect: false, explanation: "docker top lists the running processes and their PIDs, but not continuous CPU/RAM percentages." }
      ]
    },

    sandbox: {
      initialCommands: [],
      guidedSteps: [
        { instruction: 'Inspect the metadata for the webserver container to gather diagnostic information.', command: 'docker inspect webserver', hint: 'Use the inspect command.' }
      ],
      targetTask: 'Inspect detailed container metadata.',
      solutionCommands: ['docker inspect webserver'],
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
