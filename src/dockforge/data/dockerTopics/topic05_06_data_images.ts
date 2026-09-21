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

    withoutVsWith: {
      without: {
        title: 'WITHOUT UNDERSTANDING EPHEMERALITY',
        items: [
          'Database data vanishes when container restarts',
          'User uploads are lost forever on deployment',
          'Disk fills up with hidden temporary files',
        ],
        outcome: '💥 Catastrophic data loss in production',
      },
      with: {
        title: 'WITH EPHEMERALITY AWARENESS',
        items: [
          'Clean, reproducible container boots',
          'Stateless application design',
          'Using volumes for critical data',
        ],
        outcome: '📦 Predictable, disposable containers',
      },
    },
    blockDiagram: {
      title: 'Container Layer Architecture',
      subtitle: 'How Docker stacks read-only images and writable layers',
      nodes: [
        { id: 'base-image', label: 'Read-Only Image Layers', simpleDef: 'The unchangeable foundation of your container.', techDef: 'Lowerdir in OverlayFS, completely immutable.', badge: 'Immutable', color: '#38bdf8' },
        { id: 'write-layer', label: 'Ephemeral Writable Layer', simpleDef: 'The temporary top layer where new files are written.', techDef: 'Upperdir in OverlayFS, deleted on docker rm.', badge: 'Writable', color: '#facc15' },
        { id: 'merged-view', label: 'Merged Filesystem View', simpleDef: 'What the application actually sees as its hard drive.', techDef: 'Merged directory in OverlayFS combining lower and upper layers.', badge: 'Merged', color: '#4ade80' },
      ],
    },
    terms: [
      { term: 'Ephemeral', simple: 'Temporary and easily destroyed.', technical: 'State that does not persist across the lifecycle of a resource.', analogy: 'Writing on a foggy mirror that evaporates.', related: ['Stateless', 'Writable Layer'] },
      { term: 'Writable Layer', simple: 'The blank space where a running container can save files.', technical: 'A thin read-write OverlayFS layer (upperdir) created when a container starts.', analogy: 'A transparent sheet over a blueprint where you can draw modifications.', related: ['OverlayFS', 'Image'] },
      { term: 'OverlayFS', simple: 'The system Docker uses to stack file layers on top of each other.', technical: 'A union mount filesystem that combines multiple directories into a single view.', analogy: 'Stacking clear overhead projector slides to form a complete picture.', related: ['Storage Driver', 'Copy-on-Write'] },
    ],
    whenToUse: [
      '✓ Running stateless web servers and APIs',
      '✓ Storing temporary caches or session data that can be regenerated',
      '✓ Executing CI/CD build steps that produce disposable artifacts',
    ],
    whenNotToUse: [
      '✕ When storing a database schema or records (PostgreSQL, MySQL)',
      '✕ When accepting user uploads like profile pictures or documents',
      '✕ When saving audit logs that must survive a container crash',
    ],
    developerScenario: {
      title: 'The Missing Database Records',
      setup: 'A developer runs a MySQL container and works for 3 days adding product records. They stop and remove the container to update the image.',
      problem: 'Upon starting a new container, the database is completely empty. Three days of work is gone forever.',
      solution: 'The developer realizes container storage is ephemeral. Next time, they use a Docker Volume to ensure database files are stored safely outside the writable layer.',
    },
    internalFlow: [
      { step: 1, title: 'Container Started', desc: 'Docker mounts the read-only image and attaches an empty writable layer.', why: 'Creates an isolated space for this specific container.', techDetail: 'OverlayFS lowerdir (image) and upperdir (empty) mounted.' },
      { step: 2, title: 'App Writes File', desc: 'The application writes a log file to /app/logs.txt.', why: 'Standard application behavior.', techDetail: 'File is written directly to the OverlayFS upperdir on the host.' },
      { step: 3, title: 'Check Differences', desc: 'Running docker diff shows the new file.', why: 'Allows inspection of the writable layer.', techDetail: 'Docker compares upperdir against lowerdir.' },
      { step: 4, title: 'Container Stopped', desc: 'The container halts, but the writable layer remains on disk.', why: 'State is preserved in case of a restart.', techDetail: 'SIGTERM sent to PID 1, upperdir intact.' },
      { step: 5, title: 'Container Removed', desc: 'Running docker rm destroys the container.', why: 'Frees up disk space and resets environment.', techDetail: 'Docker daemon deletes the upperdir from /var/lib/docker/overlay2/ permanently.' },
    ],
    commonMistakes: [
      { mistake: 'Assuming stopping a container deletes its files.', whyWrong: 'Stopping only kills the process. The files in the writable layer are still there until you run docker rm.', correctWay: 'Use docker rm or run with --rm if you want immediate cleanup.' },
      { mistake: 'Storing important logs inside the container.', whyWrong: 'If the container crashes and is recreated by an orchestrator, the logs are lost forever.', correctWay: 'Stream logs to stdout/stderr or mount a volume for log files.' },
    ],
    recapChecklist: [
      'Container storage is temporary (ephemeral) by default.',
      'Files are written to a thin writable layer on top of the image.',
      'When a container is removed (docker rm), the writable layer is permanently deleted.',
      'Use docker diff to see what files have been changed inside a running container.',
    ],
    challenge: {
      question: 'Where are files stored when an application writes to a default container filesystem?',
      options: [
        { label: 'In the read-only image layers', isCorrect: false, explanation: 'Image layers are immutable and cannot be written to.' },
        { label: 'In a temporary writable layer (upperdir) that is destroyed on container removal', isCorrect: true, explanation: 'Correct! Docker creates a thin writable layer that is tied to the lifecycle of the container instance.' },
        { label: 'Directly in the host machine\'s Documents folder', isCorrect: false, explanation: 'Files are stored in Docker\'s internal storage directories (/var/lib/docker), not user folders.' },
      ],
    },

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
      initialCommands: ['docker run -d --name my-container nginx', 'docker exec my-container touch /tmp/newfile.txt'],
      guidedSteps: [
        { instruction: 'Inspect modified ephemeral files inside container my-container', command: 'docker diff my-container', hint: 'Run docker diff my-container' },
      ],
      targetTask: 'Understand container ephemerality.',
      solutionCommands: ['docker diff my-container'],
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

    withoutVsWith: {
      without: {
        title: 'WITHOUT VOLUMES',
        items: [
          'Database records lost when container is deleted',
          'Painful database upgrades',
          'Heavy disk I/O performance overhead',
        ],
        outcome: '💥 Unreliable databases and lost data',
      },
      with: {
        title: 'WITH VOLUMES',
        items: [
          'Data persists independently of containers',
          'Fast, direct disk I/O',
          'Easy backups and migrations',
        ],
        outcome: '📦 Safe, persistent data storage',
      },
    },
    blockDiagram: {
      title: 'Docker Volume Architecture',
      subtitle: 'How Docker manages persistent data safely on the host',
      nodes: [
        { id: 'container', label: 'Running Container', simpleDef: 'Your application (e.g., PostgreSQL).', techDef: 'Process running in isolated namespaces.', badge: 'Process', color: '#38bdf8' },
        { id: 'mount-point', label: 'Mount Point', simpleDef: 'The folder inside the container where data is saved.', techDef: 'A mount namespace mapping to a host directory.', badge: 'Bridge', color: '#facc15' },
        { id: 'host-volume', label: 'Managed Volume on Host', simpleDef: 'A secure, Docker-managed folder on your computer.', techDef: '/var/lib/docker/volumes/<name>/_data on the host Linux kernel.', badge: 'Persistent', color: '#4ade80' },
      ],
    },
    terms: [
      { term: 'Volume', simple: 'A persistent storage folder managed by Docker.', technical: 'A directory on the host machine (/var/lib/docker/volumes) bypassing the union filesystem.', analogy: 'A safety deposit box managed by the bank (Docker).', related: ['Bind Mount', 'Storage Driver'] },
      { term: 'Mount', simple: 'Attaching a storage folder into a container.', technical: 'Using Linux mount namespaces to map a host directory into the container filesystem.', analogy: 'Plugging a USB drive into a specific port.', related: ['Volume', 'Path'] },
      { term: 'Volume Driver', simple: 'A plugin that handles where the volume is stored.', technical: 'Software component enabling volumes to be stored on local disk, NFS, or cloud block storage.', analogy: 'The delivery service that routes your package to local or international storage.', related: ['Plugin', 'Cloud Storage'] },
    ],
    whenToUse: [
      '✓ Persisting database files (PostgreSQL, MySQL, MongoDB)',
      '✓ Storing application state that must survive container restarts',
      '✓ Sharing persistent data between multiple containers',
    ],
    whenNotToUse: [
      '✕ When you need to edit source code live on your host machine (use Bind Mounts instead)',
      '✕ When data is strictly temporary and disposable (use ephemeral layer or tmpfs)',
    ],
    developerScenario: {
      title: 'Upgrading the Database Engine',
      setup: 'A developer needs to upgrade a PostgreSQL container from version 15 to version 16.',
      problem: 'If they just delete the v15 container and start a v16 container, the database will be completely empty.',
      solution: 'Because the data is stored in a Docker Volume (pgdata), they simply stop v15, start v16, and mount the exact same volume. The new database engine reads the old data instantly.',
    },
    internalFlow: [
      { step: 1, title: 'Create Volume', desc: 'User runs docker volume create mydata.', why: 'Initializes the storage space.', techDetail: 'Docker creates a directory at /var/lib/docker/volumes/mydata/_data.' },
      { step: 2, title: 'Start Container', desc: 'User starts a container with -v mydata:/app/data.', why: 'Links the container to the volume.', techDetail: 'Docker maps the host path into the container mount namespace.' },
      { step: 3, title: 'App Writes Data', desc: 'Application writes data to /app/data.', why: 'Saving application state.', techDetail: 'Writes bypass the OverlayFS driver, writing directly to the host ext4/xfs filesystem.' },
      { step: 4, title: 'Container Destroyed', desc: 'User runs docker rm -f container.', why: 'Simulating a crash or upgrade.', techDetail: 'Container process killed, upperdir deleted, but volume directory remains untouched.' },
      { step: 5, title: 'Data Preserved', desc: 'Volume mydata is ready to be attached to a new container.', why: 'Ensures data persistence.', techDetail: 'Volume metadata persists in Docker daemon state.' },
    ],
    commonMistakes: [
      { mistake: 'Using absolute host paths instead of named volumes for databases.', whyWrong: 'Host paths (-v /Users/me/data:/data) often suffer from permission issues and poor performance on Mac/Windows.', correctWay: 'Use named volumes (-v mydata:/data) to let Docker optimize performance and permissions.' },
      { mistake: 'Forgetting to clean up unused volumes.', whyWrong: 'Volumes are never deleted automatically, leading to disk space exhaustion over time.', correctWay: 'Run docker volume prune periodically to delete unattached volumes.' },
    ],
    recapChecklist: [
      'Volumes are managed directly by Docker in a safe host directory.',
      'Volumes bypass the container filesystem for high performance.',
      'Data inside a volume survives container deletion.',
      'Volumes are the recommended way to persist database data in production.',
    ],
    challenge: {
      question: 'Why are Docker Volumes faster than writing to the default container filesystem?',
      options: [
        { label: 'Because they are stored in RAM', isCorrect: false, explanation: 'Volumes are stored on disk. (tmpfs mounts are stored in RAM).' },
        { label: 'Because they bypass the Copy-on-Write (OverlayFS) layer entirely', isCorrect: true, explanation: 'Correct! Volumes map directly to the host filesystem, skipping the performance overhead of the union filesystem.' },
        { label: 'Because they compress data automatically', isCorrect: false, explanation: 'Volumes do not compress data by default.' },
      ],
    },

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
      initialCommands: [],
      guidedSteps: [
        { instruction: 'Create a new named volume called "mydata"', command: 'docker volume create mydata', hint: 'Run docker volume create mydata' },
        { instruction: 'Start an nginx container with volume "mydata" mounted to "/app/data"', command: 'docker run -d -v mydata:/app/data nginx', hint: 'Run docker run -d -v mydata:/app/data nginx' },
      ],
      targetTask: 'Create a volume and mount it to a container.',
      solutionCommands: ['docker volume create mydata', 'docker run -d -v mydata:/app/data nginx'],
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

    withoutVsWith: {
      without: {
        title: 'WITHOUT BIND MOUNTS',
        items: [
          'Edit code in text editor',
          'Run docker build -t app . (takes 30 seconds)',
          'Restart container to see one typo fix',
        ],
        outcome: '🐌 Agonizingly slow developer loop',
      },
      with: {
        title: 'WITH BIND MOUNTS',
        items: [
          'Edit code in text editor',
          'Hit Save',
          'Container auto-reloads and shows changes instantly',
        ],
        outcome: '⚡ Lightning fast real-time feedback',
      },
    },
    blockDiagram: {
      title: 'Bind Mount Architecture',
      subtitle: 'Mapping a developer\'s workspace directly into the container',
      nodes: [
        { id: 'host-folder', label: 'Host Directory (Your Laptop)', simpleDef: 'The folder containing your source code.', techDef: 'A directory on the host filesystem like /Users/dev/app.', badge: 'Source', color: '#38bdf8' },
        { id: 'sync-bridge', label: 'Bind Mount Bridge', simpleDef: 'The invisible link syncing the folders.', techDef: 'Linux bind mount directly linking inode pointers.', badge: 'Sync', color: '#facc15' },
        { id: 'container-folder', label: 'Container Directory', simpleDef: 'The folder inside the container where the app runs.', techDef: 'A mount point inside the container overlay filesystem.', badge: 'Target', color: '#4ade80' },
      ],
    },
    terms: [
      { term: 'Bind Mount', simple: 'A shared folder between host and container.', technical: 'A mechanism to mount a file or directory from the host machine into a container.', analogy: 'A two-way walkie-talkie channel.', related: ['Volume', 'Host Path'] },
      { term: 'Hot Reloading', simple: 'Updating the app instantly when code changes.', technical: 'A development tool feature that watches for file system changes and restarts the application process.', analogy: 'A live television broadcast.', related: ['Development', 'Nodemon'] },
      { term: 'Absolute Path', simple: 'The full address of a folder on your computer.', technical: 'A path that starts from the root of the filesystem (e.g., /home/user/app).', analogy: 'A complete mailing address including zip code.', related: ['pwd', 'Host Path'] },
    ],
    whenToUse: [
      '✓ Local development requiring live code reloading',
      '✓ Sharing configuration files (e.g., nginx.conf) from the host into a container',
      '✓ Injecting temporary secrets or credentials during local testing',
    ],
    whenNotToUse: [
      '✕ Production environments (build code into the image instead)',
      '✕ Databases (use Volumes for better performance and safety)',
    ],
    developerScenario: {
      title: 'The Slow React Developer',
      setup: 'A developer is building a React app in Docker. Every time they change a CSS color, they rebuild the Docker image and restart the container.',
      problem: 'The feedback loop takes 45 seconds just to see a color change, destroying their productivity.',
      solution: 'They use a bind mount (-v $(pwd):/app) to map their local source code into the container. Now, saving the CSS file instantly triggers React\'s hot reload in 100 milliseconds.',
    },
    internalFlow: [
      { step: 1, title: 'Developer Runs Command', desc: 'Runs docker run -v $(pwd):/app.', why: 'Instructs Docker to map the folder.', techDetail: 'Docker API receives the bind mount request.' },
      { step: 2, title: 'Filesystem Linking', desc: 'Docker mounts the host directory into the container.', why: 'Creates the shared bridge.', techDetail: 'Uses the mount() syscall with MS_BIND flag.' },
      { step: 3, title: 'Code Edited', desc: 'Developer saves a change to index.js on their laptop.', why: 'Standard development action.', techDetail: 'Host filesystem writes to the file inode.' },
      { step: 4, title: 'Container Detects Change', desc: 'The app inside the container sees the file change instantly.', why: 'Because they are the exact same files.', techDetail: 'inotify events fire inside the container mount namespace.' },
      { step: 5, title: 'App Reloads', desc: 'The development server reloads the application.', why: 'Applies the new code.', techDetail: 'Node.js or Python process restarts based on file system events.' },
    ],
    commonMistakes: [
      { mistake: 'Using relative paths instead of absolute paths.', whyWrong: 'Docker requires absolute paths for bind mounts (e.g., /app, not ./app).', correctWay: 'Use $(pwd) or %cd% to dynamically inject the absolute path of the current directory.' },
      { mistake: 'Overwriting container dependencies.', whyWrong: 'Mounting your local folder might overwrite the node_modules installed inside the container.', correctWay: 'Use an anonymous volume for dependencies to protect them (e.g., -v /app/node_modules).' },
    ],
    recapChecklist: [
      'Bind mounts link a specific host folder to a container folder.',
      'Changes are instantaneous and bi-directional.',
      'They are perfect for local development and hot reloading.',
      'Always use absolute paths like $(pwd) when specifying the host directory.',
    ],
    challenge: {
      question: 'What is the primary use case for Bind Mounts in Docker?',
      options: [
        { label: 'Storing production database files safely', isCorrect: false, explanation: 'Volumes are best for database storage, not Bind Mounts.' },
        { label: 'Live source code editing and hot reloading during development', isCorrect: true, explanation: 'Correct! Bind mounts map your local source code directly into the container.' },
        { label: 'Sharing images across multiple host computers', isCorrect: false, explanation: 'Docker Registries are used to share images.' },
      ],
    },

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
      initialCommands: [],
      guidedSteps: [
        { instruction: 'Start a Node.js container with a bind mount mapping the current directory to /app and exposing port 3000', command: 'docker run -d -v $(pwd):/app -p 3000:3000 node:20', hint: 'Run docker run -d -v $(pwd):/app -p 3000:3000 node:20' },
      ],
      targetTask: 'Use a bind mount for local development.',
      solutionCommands: ['docker run -d -v $(pwd):/app -p 3000:3000 node:20'],
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

    withoutVsWith: {
      without: {
        title: 'WITHOUT DATABASE CONTAINERS',
        items: [
          'Running bulky installers that pollute your OS',
          'Conflicts between Postgres 14 and Postgres 16',
          'Manual setup of admin passwords and users',
        ],
        outcome: '💥 Messy local environment and setup headaches',
      },
      with: {
        title: 'WITH DATABASE CONTAINERS',
        items: [
          'Spin up any DB in 2 seconds',
          'Run multiple versions simultaneously on different ports',
          'Automated setup via Environment Variables',
        ],
        outcome: '📦 Clean, disposable, instant databases',
      },
    },
    blockDiagram: {
      title: 'Database Container Lifecycle',
      subtitle: 'How Docker initializes and runs a standard database',
      nodes: [
        { id: 'image', label: 'Official DB Image', simpleDef: 'The pre-packaged database software (e.g., Postgres).', techDef: 'Pulled from Docker Hub, contains database binaries and entrypoint scripts.', badge: 'Template', color: '#38bdf8' },
        { id: 'env-vars', label: 'Environment Variables', simpleDef: 'Configuration passed at startup (passwords, usernames).', techDef: 'Injected into the container process space via -e flags.', badge: 'Config', color: '#facc15' },
        { id: 'running-db', label: 'Active Database Server', simpleDef: 'The running database accepting connections.', techDef: 'Process bound to a specific port (e.g., 5432) and mounted volume.', badge: 'Service', color: '#4ade80' },
      ],
    },
    terms: [
      { term: 'Environment Variable', simple: 'A configuration setting passed to the container.', technical: 'Key-value pairs injected into the container\'s runtime environment.', analogy: 'Providing specific instructions to a chef before they start cooking.', related: ['Configuration', 'Secrets'] },
      { term: 'Entrypoint Script', simple: 'The startup script that prepares the database.', technical: 'A shell script (docker-entrypoint.sh) that runs before the main database process to handle initialization.', analogy: 'The pre-flight checklist a pilot completes before takeoff.', related: ['Initialization', 'Boot'] },
      { term: 'Port Mapping', simple: 'Connecting your computer\'s port to the database container.', technical: 'Using iptables to route host traffic to the container\'s internal port.', analogy: 'Connecting an extension cord from the generator to your house.', related: ['Network', 'Expose'] },
    ],
    whenToUse: [
      '✓ Local development requiring a specific database version',
      '✓ Automated testing environments needing fresh, clean databases',
      '✓ Running lightweight cache servers like Redis',
    ],
    whenNotToUse: [
      '✕ When you need a fully managed, highly available database cluster in production (use AWS RDS or similar instead)',
    ],
    developerScenario: {
      title: 'The Multi-Project Developer',
      setup: 'A developer works on two projects: Project A requires PostgreSQL 12, and Project B requires PostgreSQL 16.',
      problem: 'Installing two different versions of PostgreSQL natively on a Mac causes severe port conflicts and service crashes.',
      solution: 'They uninstall local Postgres entirely. They run Project A on port 5432 using a postgres:12 container, and Project B on port 5433 using a postgres:16 container. Perfect isolation.',
    },
    internalFlow: [
      { step: 1, title: 'Command Executed', desc: 'User runs docker run with -e POSTGRES_PASSWORD=secret.', why: 'Provides necessary credentials.', techDetail: 'Docker passes the environment variable to the container.' },
      { step: 2, title: 'Entrypoint Runs', desc: 'The postgres entrypoint script executes.', why: 'Checks if initialization is needed.', techDetail: 'Executes docker-entrypoint.sh.' },
      { step: 3, title: 'Database Initialization', desc: 'The script creates the default database and user.', why: 'First-time setup.', techDetail: 'Runs initdb and sets up the postgres user.' },
      { step: 4, title: 'Server Starts', desc: 'The PostgreSQL server process starts.', why: 'Ready to accept connections.', techDetail: 'Process binds to 0.0.0.0:5432.' },
      { step: 5, title: 'Connections Accepted', desc: 'Developer connects using a tool like DBeaver on localhost.', why: 'Database is fully operational.', techDetail: 'Docker routes host port 5432 traffic to container port 5432.' },
    ],
    commonMistakes: [
      { mistake: 'Forgetting required environment variables.', whyWrong: 'Many official DB images will crash immediately if required variables (like POSTGRES_PASSWORD or MYSQL_ROOT_PASSWORD) are missing.', correctWay: 'Always check the Docker Hub documentation for required -e flags.' },
      { mistake: 'Running databases without volumes.', whyWrong: 'If the container crashes or is removed, all database data is lost permanently.', correctWay: 'Always use a named volume (-v my-db-data:/var/lib/postgresql/data) for database storage.' },
    ],
    recapChecklist: [
      'Official database images are the fastest way to run databases locally.',
      'Use environment variables (-e) to configure passwords and default databases.',
      'Map ports (-p) to access the database from your host machine.',
      'Always use Volumes (-v) to persist the database data.',
    ],
    challenge: {
      question: 'What happens if you run an official PostgreSQL container without setting the POSTGRES_PASSWORD environment variable?',
      options: [
        { label: 'It sets a default password of "admin"', isCorrect: false, explanation: 'The official image does not set insecure default passwords.' },
        { label: 'The container will crash and exit immediately with an error message', isCorrect: true, explanation: 'Correct! The entrypoint script requires a password for security and will intentionally fail if it is missing.' },
        { label: 'It starts securely but without a password', isCorrect: false, explanation: 'PostgreSQL requires a password for external connections.' },
      ],
    },

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
      initialCommands: [],
      guidedSteps: [
        { instruction: 'Start a postgres database with password "secret", mapping port 5432, and mounting volume "pgdata"', command: 'docker run -d -e POSTGRES_PASSWORD=secret -v pgdata:/var/lib/postgresql/data -p 5432:5432 postgres:16', hint: 'Run docker run -d -e POSTGRES_PASSWORD=secret -v pgdata:/var/lib/postgresql/data -p 5432:5432 postgres:16' },
      ],
      targetTask: 'Run a persistent PostgreSQL database container.',
      solutionCommands: ['docker run -d -e POSTGRES_PASSWORD=secret -v pgdata:/var/lib/postgresql/data -p 5432:5432 postgres:16'],
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

    withoutVsWith: {
      without: {
        title: 'WITHOUT UTILITY CONTAINERS',
        items: [
          'Installing Homebrew/apt packages for every minor tool',
          'Messy system path configurations',
          'Leftover orphaned binaries consuming disk space',
        ],
        outcome: '💥 Bloated, cluttered host operating system',
      },
      with: {
        title: 'WITH UTILITY CONTAINERS',
        items: [
          'Run tools without installing them natively',
          'Container self-destructs after the command finishes',
          'Pristine, clean host system',
        ],
        outcome: '📦 Clean system and ephemeral tool usage',
      },
    },
    blockDiagram: {
      title: 'Disposable Utility Execution',
      subtitle: 'How the --rm flag enables clean one-off tasks',
      nodes: [
        { id: 'start', label: 'Command Initiated', simpleDef: 'You run docker run --rm curl.', techDef: 'Docker allocates terminal and pulls image if needed.', badge: 'Start', color: '#38bdf8' },
        { id: 'execute', label: 'Utility Execution', simpleDef: 'The tool runs and shows output.', techDef: 'Process executes inside container namespaces.', badge: 'Running', color: '#facc15' },
        { id: 'cleanup', label: 'Automatic Cleanup', simpleDef: 'The container deletes itself.', techDef: 'Daemon catches process exit and triggers container removal.', badge: 'Deleted', color: '#4ade80' },
      ],
    },
    terms: [
      { term: '--rm flag', simple: 'A command flag that tells Docker to delete the container when it stops.', technical: 'Instructs the Docker daemon to clean up the container filesystem and metadata immediately upon process exit.', analogy: 'A self-destructing message that disappears after reading.', related: ['Disposable', 'Cleanup'] },
      { term: 'Alpine Linux', simple: 'A very small operating system often used for quick tools.', technical: 'A minimal Linux distribution (usually < 5MB) based on musl libc and busybox.', analogy: 'A stripped-down racing car with no heavy luxuries.', related: ['Base Image', 'Minimal'] },
      { term: 'Interactive mode (-it)', simple: 'Allows you to type into the container and see its output.', technical: 'Allocates a pseudo-TTY and keeps STDIN open even if not attached.', analogy: 'Connecting a keyboard and monitor to the container.', related: ['Terminal', 'TTY'] },
    ],
    whenToUse: [
      '✓ Running network diagnostics (curl, ping, nmap)',
      '✓ Executing cloud CLI commands (aws-cli, gcloud)',
      '✓ One-off file conversions (ffmpeg, ImageMagick)',
    ],
    whenNotToUse: [
      '✕ Long-running background services (use -d instead of --rm)',
      '✕ When you need to preserve the tool\'s state or downloaded files without a volume mount',
    ],
    developerScenario: {
      title: 'The Clean Laptop',
      setup: 'A developer needs to convert a single video file to MP4 format using FFmpeg.',
      problem: 'Installing FFmpeg directly requires downloading dozens of libraries and modifying system paths, cluttering their pristine laptop.',
      solution: 'They run a one-off FFmpeg container, bind-mounting their current directory: docker run --rm -v $(pwd):/data jrottenberg/ffmpeg -i /data/input.avi /data/output.mp4. The file converts, and the container vanishes instantly, leaving zero trace on the laptop.',
    },
    internalFlow: [
      { step: 1, title: 'Command Sent', desc: 'Developer runs docker run --rm -it alpine sh.', why: 'Starts an interactive shell session.', techDetail: 'API requests container creation with AutoRemove: true.' },
      { step: 2, title: 'Container Boots', desc: 'Docker starts the Alpine container in milliseconds.', why: 'Provides the execution environment.', techDetail: 'Allocates TTY and starts /bin/sh.' },
      { step: 3, title: 'User Interacts', desc: 'Developer runs commands inside the shell.', why: 'Performing the necessary tasks.', techDetail: 'STDIN/STDOUT are piped between the host terminal and container process.' },
      { step: 4, title: 'User Exits', desc: 'Developer types "exit" or presses Ctrl+D.', why: 'Finishing the session.', techDetail: 'The shell process (PID 1) exits with status code 0.' },
      { step: 5, title: 'Automatic Removal', desc: 'Docker immediately deletes the container.', why: 'Triggered by the --rm flag.', techDetail: 'Daemon removes the container filesystem and frees resources.' },
    ],
    commonMistakes: [
      { mistake: 'Forgetting the --rm flag.', whyWrong: 'Without --rm, every one-off command leaves a stopped container on your system, quickly consuming gigabytes of disk space.', correctWay: 'Always include --rm for temporary tasks.' },
      { mistake: 'Forgetting -it when running interactive shells.', whyWrong: 'If you run an Alpine shell without -it, the container will instantly exit because it has no input terminal attached.', correctWay: 'Always use -it when you need to type commands (like sh or bash).' },
    ],
    recapChecklist: [
      'Use containers for one-off CLI tools instead of installing them globally.',
      'The --rm flag ensures the container deletes itself after finishing.',
      'Combine with bind mounts to process local files easily.',
      'Use the -it flags to interact with command-line prompts inside the container.',
    ],
    challenge: {
      question: 'Why is the --rm flag highly recommended when running utility containers like curl or aws-cli?',
      options: [
        { label: 'It prevents the container from leaving a stopped instance on your disk after it finishes', isCorrect: true, explanation: 'Correct! The --rm flag ensures the container is automatically deleted, keeping your system clean.' },
        { label: 'It makes the container run as the root user', isCorrect: false, explanation: 'Containers run as root by default unless specified otherwise. --rm has nothing to do with users.' },
        { label: 'It downloads the image faster', isCorrect: false, explanation: '--rm controls removal, not download speed.' },
      ],
    },

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
      initialCommands: [],
      guidedSteps: [
        { instruction: 'Run an interactive Alpine shell that is automatically removed when you exit', command: 'docker run --rm -it alpine sh', hint: 'Run docker run --rm -it alpine sh' },
      ],
      targetTask: 'Use a command line utility container.',
      solutionCommands: ['docker run --rm -it alpine sh'],
    },

    reference: {
      syntaxCheatSheet: ['docker run --rm -it [UTILITY_IMAGE] [COMMAND]'],
    },
  },
};
