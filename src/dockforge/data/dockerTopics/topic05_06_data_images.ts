import { UniversalDockerConcept } from '../unifiedDockerData';

export const TOPIC_05_06_CONCEPTS: Record<string, UniversalDockerConcept> = {
  'c-ephemeral-filesystem': {
    id: 'c-ephemeral-filesystem',
    command: 'docker diff',
    title: 'Ephemeral Container Filesystem',
    topicId: 'topic-05',
    topicNumber: '05',
    topicTitle: 'Data Persistence',
    subtitle: 'Understanding why files written inside containers are destroyed when containers are deleted.',
    badges: ['Beginner', 'Storage', 'Architecture'],
    quote: 'Containers are meant to be ephemeral — disposable, stateless execution units.',
    difficulty: 'Beginner',

    whatIsIt:
      'By default, all files created inside a container are stored on a writeable container layer tied directly to that container instance. When the container is deleted (`docker rm`), that writeable layer is permanently destroyed.',
    inSimpleWords:
      'Container storage is temporary by default. It\'s like writing notes on a dry-erase whiteboard. When you wipe the whiteboard (delete container), all your notes vanish forever.',
    whyDoYouNeedIt:
      'Understanding ephemerality prevents catastrophic production data loss (e.g. storing database files inside a container without volumes).',
    realWorldAnalogy:
      'Saving a document on a public library computer desktop without putting it on a USB thumb drive. As soon as you log out, the computer resets to factory defaults.',

    syntaxCode: 'docker diff web-frontend',
    syntaxTokens: [
      { token: 'docker diff', role: 'Command', explanation: 'Lists all files created, modified, or deleted inside the ephemeral container layer.' },
    ],

    actionStage: {
      before: {
        label: 'Clean Container Layer',
        description: 'New container spawned from read-only image.',
        stateBadge: 'Empty Write Layer',
        details: ['Image layers: Read-only', 'Write layer: 0 bytes'],
      },
      running: {
        label: 'Writing Files Inside Container',
        description: 'App writes logs to /var/log/app.log inside container layer.',
        stateBadge: 'Ephemeral Writes',
        details: ['File written to Overlay2 upperdir', 'Not backed up on host'],
      },
      after: {
        label: 'Container Removal ("docker rm")',
        description: 'Container deleted; upperdir write layer deleted permanently.',
        stateBadge: 'Data Lost',
        details: ['Write layer purged', 'File /var/log/app.log gone forever'],
      },
    },

    variations: [
      { title: 'Check Ephemeral File Modifications', syntax: 'docker diff [CONTAINER]', whatItDoes: 'Shows temporary file edits' },
    ],

    scenarios: [
      {
        title: 'Stateless vs Stateful Containers',
        question: 'What happens to a file created inside /tmp of a container if that container is stopped and then deleted with docker rm?',
        options: [
          { label: 'The file is deleted permanently along with the container write layer', command: 'deleted-perm', isCorrect: true, explanation: 'Containers are ephemeral by default.' },
          { label: 'The file moves to your Documents folder', command: 'docs-folder', isCorrect: false, explanation: 'Incorrect.' },
        ],
      },
    ],

    sandbox: {
      initialCommands: ['docker diff web-frontend'],
      guidedSteps: [
        { instruction: 'Inspect modified ephemeral files inside container web-frontend', command: 'docker diff web-frontend', hint: 'Run docker diff web-frontend' },
      ],
      targetTask: 'Understand container ephemerality.',
      solutionCommands: ['docker diff web-frontend'],
    },

    reference: {
      syntaxCheatSheet: ['docker diff [CONTAINER]    # Inspect ephemeral changes'],
      bestPractices: ['Never store persistent database data or user uploads inside container write layers.'],
    },
  },

  'c-volume-mounts': {
    id: 'c-volume-mounts',
    command: 'docker volume create',
    title: 'Volume Mounts',
    topicId: 'topic-05',
    topicNumber: '05',
    topicTitle: 'Data Persistence',
    subtitle: 'Managed persistent storage directories fully controlled by the Docker daemon on the host filesystem.',
    badges: ['Intermediate', 'Storage', 'Persistence'],
    quote: 'Volumes are the preferred mechanism for persisting data in production Docker environments.',
    difficulty: 'Intermediate',

    whatIsIt:
      'Docker Volumes are storage locations managed exclusively by Docker on the host machine (`/var/lib/docker/volumes/`). They bypass the Overlay2 write layer for high-speed disk I/O and persist data across container lifecycles.',
    inSimpleWords:
      'Volumes are like external USB hard drives managed by Docker. You can unplug them from one container and plug them into another without losing any data.',
    whyDoYouNeedIt:
      'Essential for databases (PostgreSQL, MySQL, Redis) and persistent application state. When upgrading a database container, you attach the existing volume to the new container.',
    realWorldAnalogy:
      'Plugging a high-speed external SSD drive into a laptop. Even if you upgrade or replace the laptop, all your files remain on the SSD.',

    syntaxCode: 'docker volume create pgdata\ndocker run -d -v pgdata:/var/lib/postgresql/data postgres:16-alpine',
    syntaxTokens: [
      { token: 'docker volume create pgdata', role: 'Command', explanation: 'Creates named volume managed by Docker.' },
      { token: '-v pgdata:/var/lib/postgresql/data', role: 'Flag', explanation: 'Mounts named volume "pgdata" to container directory.' },
    ],

    actionStage: {
      before: {
        label: 'Volume Created on Host',
        description: 'Docker allocates /var/lib/docker/volumes/pgdata/_data.',
        stateBadge: 'Volume Ready',
        details: ['Driver: local', 'Scope: local'],
      },
      running: {
        label: 'Container Attached to Volume',
        description: 'Database writes directly to mounted volume bypassing CoW overhead.',
        stateBadge: 'High-speed Storage',
        details: ['Direct host I/O speed', 'Bypassing OverlayFS'],
      },
      after: {
        label: 'Container Destroyed / Volume Persisted',
        description: 'Container deleted, but pgdata volume remains safely intact.',
        stateBadge: 'Data Safe',
        details: ['Data retained on disk', 'Can attach to Postgres 17 container'],
      },
    },

    variations: [
      { title: 'Create Volume', syntax: 'docker volume create my-vol', whatItDoes: 'Pre-creates named volume' },
      { title: 'List Volumes', syntax: 'docker volume ls', whatItDoes: 'Lists all volumes managed by Docker' },
      { title: 'Inspect Volume', syntax: 'docker volume inspect my-vol', whatItDoes: 'Displays host mount point path and creation date' },
    ],

    scenarios: [
      {
        title: 'Database Upgrade with Volume',
        question: 'How do you safely upgrade a PostgreSQL container from v15 to v16 without losing data?',
        options: [
          { label: 'Stop the old container, start the new v16 container mounting the existing named volume', command: 'upgrade-vol', isCorrect: true, explanation: 'The data resides safely inside the volume.' },
          { label: 'Export all tables to PDF manually', command: 'export-pdf', isCorrect: false, explanation: 'Incorrect.' },
        ],
      },
    ],

    sandbox: {
      initialCommands: ['docker volume ls'],
      guidedSteps: [
        { instruction: 'Create a new named volume called "my-db-store"', command: 'docker volume create my-db-store', hint: 'Run docker volume create my-db-store' },
        { instruction: 'Inspect metadata for volume my-db-store', command: 'docker volume inspect my-db-store', hint: 'Run docker volume inspect my-db-store' },
      ],
      targetTask: 'Create and inspect Docker volumes.',
      solutionCommands: ['docker volume create my-db-store', 'docker volume inspect my-db-store'],
    },

    reference: {
      syntaxCheatSheet: [
        'docker volume create [NAME]    # Create volume',
        'docker volume ls               # List volumes',
        'docker volume inspect [NAME]  # Inspect metadata',
        'docker volume prune            # Delete unused volumes',
      ],
      bestPractices: ['Use named volumes for production database storage.'],
    },
  },

  'c-bind-mounts': {
    id: 'c-bind-mounts',
    command: 'docker run -v $(pwd):/app',
    title: 'Bind Mounts',
    topicId: 'topic-05',
    topicNumber: '05',
    topicTitle: 'Data Persistence',
    subtitle: 'Mapping specific host directories directly into a container for hot reloading and live development.',
    badges: ['Intermediate', 'Development', 'Storage'],
    quote: 'Bind mounts tie a host directory to a container path, allowing instant source code hot reloading during development.',
    difficulty: 'Intermediate',

    whatIsIt:
      'Bind Mounts map an exact file or directory path on the host machine (e.g. `/Users/dev/project`) directly to a target path inside a container (e.g. `/app`). Changes on the host reflect instantly inside the container.',
    inSimpleWords:
      'It\'s a shared folder link between your computer and the container. Edit code in your favorite text editor on your laptop, and the container inside Docker sees your edits instantly.',
    whyDoYouNeedIt:
      'Essential for local development feedback loops. Without bind mounts, you would have to rebuild your container image every single time you edit a line of code.',
    realWorldAnalogy:
      'A mirror window between two adjacent rooms. Move an object in room A, and it moves simultaneously in room B.',

    syntaxCode: 'docker run -d -v $(pwd):/usr/share/nginx/html -p 8080:80 nginx:alpine',
    syntaxTokens: [
      { token: '-v $(pwd):/usr/share/nginx/html', role: 'Flag', explanation: 'Bind mounts current host directory $(pwd) to container target path.' },
    ],

    actionStage: {
      before: {
        label: 'Host Source Directory',
        description: 'Developer workspace on host machine: /Users/dev/website.',
        stateBadge: 'Host Workspace',
        details: ['index.html', 'styles.css'],
      },
      running: {
        label: 'Bind Mount Active',
        description: 'Host path mounted directly into container /usr/share/nginx/html.',
        stateBadge: 'Shared Mount',
        details: ['Bi-directional file sync', 'Instant live edits'],
      },
      after: {
        label: 'Live Hot Reloading',
        description: 'Edit index.html on host -> Web server serves updated page instantly.',
        stateBadge: 'Hot Reload Active',
        details: ['No image rebuild needed', 'Fast developer experience'],
      },
    },

    variations: [
      { title: 'Read-only Bind Mount', syntax: 'docker run -v $(pwd):/app:ro node', whatItDoes: 'Prevents container from modifying host files' },
    ],

    scenarios: [
      {
        title: 'Bind Mount Use Case',
        question: 'Why are bind mounts preferred over named volumes during local frontend development?',
        options: [
          { label: 'Bind mounts map host source code directly into the container so local code changes reflect instantly without rebuilding images', command: 'hot-reload', isCorrect: true, explanation: 'Bind mounts facilitate real-time hot reloading.' },
          { label: 'Bind mounts make containers run 10x faster', command: 'speed-myth', isCorrect: false, explanation: 'Performance is similar.' },
        ],
      },
    ],

    sandbox: {
      initialCommands: ['docker ps'],
      guidedSteps: [
        { instruction: 'Inspect running web container bind mounts', command: 'docker inspect web-frontend', hint: 'Run docker inspect web-frontend' },
      ],
      targetTask: 'Inspect container bind mount configurations.',
      solutionCommands: ['docker inspect web-frontend'],
    },

    reference: {
      syntaxCheatSheet: [
        'docker run -v [HOST_PATH]:[CONTAINER_PATH] [IMAGE]',
        'docker run -v $(pwd):/app:ro [IMAGE]  # Read-only mount',
      ],
    },
  },

  'c-running-databases': {
    id: 'c-running-databases',
    command: 'docker run -e POSTGRES_PASSWORD=...',
    title: 'Database Containers',
    topicId: 'topic-06',
    topicNumber: '06',
    topicTitle: 'Using 3rd Party Container Images',
    subtitle: 'Containerizing official PostgreSQL, Redis, MongoDB, and MySQL database engines.',
    badges: ['Beginner', 'Databases', 'Services'],
    quote: 'Containerizing databases allows developers to spin up isolated, throwaway database instances in seconds.',
    difficulty: 'Beginner',

    whatIsIt:
      'Official database container images (PostgreSQL, Redis, MongoDB, MariaDB) on Docker Hub allow developers to run database servers using standardized environment variables (`POSTGRES_PASSWORD`, `REDIS_ARGS`) and volume mounts.',
    inSimpleWords:
      'Instead of downloading a 500MB PostgreSQL installer on Windows/Mac and running background installer wizards, `docker run postgres` boots a clean, production-ready database in 2 seconds.',
    whyDoYouNeedIt:
      'Allows team members to run identical database engines locally without installing database software on their personal computers.',
    realWorldAnalogy:
      'Renting a self-contained portable generator rather than wiring custom power lines to a building.',

    syntaxCode: 'docker run -d --name db-postgres -p 5432:5432 -v pgdata:/var/lib/postgresql/data -e POSTGRES_PASSWORD=secret postgres:16-alpine',
    syntaxTokens: [
      { token: '-e POSTGRES_PASSWORD=secret', role: 'Flag', explanation: 'Passes required database initialization password.' },
      { token: '-v pgdata:/var/lib/postgresql/data', role: 'Flag', explanation: 'Persists database tables in named volume.' },
    ],

    actionStage: {
      before: {
        label: 'No Database Installed',
        description: 'Host system has no local PostgreSQL service installed.',
        stateBadge: 'Clean Host',
        details: ['Port 5432 free'],
      },
      running: {
        label: 'Postgres Container Initialization',
        description: 'Postgres entrypoint script initializes database tables and sets passwords.',
        stateBadge: 'Initializing DB',
        details: ['Executing initdb', 'Creating default DB "postgres"', 'Listening on 0.0.0.0:5432'],
      },
      after: {
        label: 'Database Ready for Connections',
        description: 'PostgreSQL ready to accept client connections on localhost:5432.',
        stateBadge: 'Accepting Connections',
        details: ['User: postgres', 'Port 5432 live', 'Data saved in pgdata volume'],
      },
    },

    variations: [
      { title: 'Run Redis Cache', syntax: 'docker run -d -p 6379:6379 redis:7-alpine', whatItDoes: 'Launches in-memory Redis cache server' },
    ],

    scenarios: [
      {
        title: 'Database Initialization Env Vars',
        question: 'What happens if you run "docker run postgres" WITHOUT supplying the POSTGRES_PASSWORD environment variable?',
        options: [
          { label: 'The container exits with an error stating that POSTGRES_PASSWORD must be set', command: 'pg-env-err', isCorrect: true, explanation: 'The official Postgres container entrypoint requires a password for security.' },
          { label: 'It installs Windows 98', command: 'win98', isCorrect: false, explanation: 'Incorrect.' },
        ],
      },
    ],

    sandbox: {
      initialCommands: ['docker ps'],
      guidedSteps: [
        { instruction: 'Inspect running database containers', command: 'docker ps', hint: 'Run docker ps' },
        { instruction: 'Inspect logs of running db-postgres container', command: 'docker logs db-postgres', hint: 'Run docker logs db-postgres' },
      ],
      targetTask: 'Manage containerized databases.',
      solutionCommands: ['docker logs db-postgres'],
    },

    reference: {
      syntaxCheatSheet: [
        'docker run -d -e POSTGRES_PASSWORD=secret -p 5432:5432 postgres:16-alpine',
        'docker run -d -p 6379:6379 redis:7-alpine',
      ],
    },
  },

  'c-cli-utilities': {
    id: 'c-cli-utilities',
    command: 'docker run --rm -it alpine',
    title: 'Command Line Utilities',
    topicId: 'topic-06',
    topicNumber: '06',
    topicTitle: 'Using 3rd Party Container Images',
    subtitle: 'Executing one-off diagnostic tools, CLI scripts, and utility tools in disposable containers.',
    badges: ['Beginner', 'CLI', 'Utilities'],
    quote: 'Run any CLI tool (curl, aws-cli, ffmpeg, terraform) without installing it on your host operating system.',
    difficulty: 'Beginner',

    whatIsIt:
      'Container images can package single CLI utilities (e.g. `alpine`, `curl`, `aws-cli`, `ffmpeg`). Using `docker run --rm -it`, developers can run one-off tasks in clean disposable environments.',
    inSimpleWords:
      'Instead of installing 20 different CLI tools on your laptop, you run them inside a temporary container that deletes itself the moment the command finishes.',
    whyDoYouNeedIt:
      'Keeps your host operating system clean and free of leftover binary tools.',
    realWorldAnalogy:
      'Renting a specialty tool (like a pressure washer) for 30 minutes instead of buying and storing it in your garage forever.',

    syntaxCode: 'docker run --rm -it alpine curl https://api.github.com',
    syntaxTokens: [
      { token: '--rm', role: 'Flag', explanation: 'Automatically deletes container container metadata upon exit.' },
      { token: 'alpine', role: 'Image', explanation: 'Lightweight 7MB Linux base image.' },
      { token: 'curl https://api.github.com', role: 'Command', explanation: 'Utility command executed inside container.' },
    ],

    actionStage: {
      before: {
        label: 'Clean Host Machine',
        description: 'Host does not have curl installed.',
        stateBadge: 'Host Clean',
        details: ['No local curl package'],
      },
      running: {
        label: 'Disposable Container Execution',
        description: 'Container boots, executes curl request, and streams output.',
        stateBadge: 'Executing Utility',
        details: ['Container boots in 50ms', 'HTTP GET https://api.github.com'],
      },
      after: {
        label: 'Automatic Self-Cleanup (--rm)',
        description: 'Command finishes; container is deleted automatically.',
        stateBadge: 'Clean Exit',
        details: ['Container purged', 'Zero leftover state'],
      },
    },

    variations: [
      { title: 'Run One-off Curl', syntax: 'docker run --rm alpine/curl https://httpbin.org/ip', whatItDoes: 'Fetches web request and cleans up container' },
    ],

    scenarios: [
      {
        title: 'Disposable Execution Flag',
        question: 'Which flag ensures a container is automatically deleted immediately when its process finishes?',
        options: [
          { label: '--rm', command: 'rm-flag', isCorrect: true, explanation: '--rm instructs Docker daemon to clean up container metadata on exit.' },
          { label: '-d', command: 'detach-flag', isCorrect: false, explanation: '-d keeps it running in background.' },
        ],
      },
    ],

    sandbox: {
      initialCommands: ['docker run --rm alpine echo "One-off task completed"'],
      guidedSteps: [
        { instruction: 'Run a one-off disposable Alpine container that echoes a string', command: 'docker run --rm alpine echo "One-off task completed"', hint: 'Run docker run --rm alpine echo "One-off task completed"' },
      ],
      targetTask: 'Execute CLI utility containers.',
      solutionCommands: ['docker run --rm alpine echo "One-off task completed"'],
    },

    reference: {
      syntaxCheatSheet: ['docker run --rm -it [UTILITY_IMAGE] [COMMAND]'],
    },
  },
};
