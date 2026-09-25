import { UniversalDockerConcept } from '../unifiedDockerData';

export const TOPIC_13_14_CONCEPTS: Record<string, UniversalDockerConcept> = {
  'c-hot-reloading': {
    id: 'c-hot-reloading',
    command: 'docker compose watch',
    title: 'Hot Reloading in Containers',
    topicId: 'topic-13',
    topicNumber: '13',
    topicTitle: 'Developer Experience',
    subtitle: 'Syncing local host source code edits with live container processes via bind mounts and file watchers.',
    badges: ['Intermediate', 'DevExp', 'HotReload'],
    quote: 'Hot reloading combines bind mounts with dev servers (Nodemon, Next.js, Vite) so code edits trigger instant updates.',
    difficulty: 'Intermediate',

    whatIsIt:
      'Hot Reloading in Docker mirrors local source code files on your host machine directly into a running dev container. Tools like `docker compose watch` or volume bind mounts automatically trigger live page reloads without rebuilding images.',
    inSimpleWords:
      'Save a file in VS Code on your laptop, and your web app inside the Docker container updates on screen in 100 milliseconds!',
    whyDoYouNeedIt:
      'Eliminates developer frustration caused by slow build cycles during local feature development.',
    realWorldAnalogy:
      'Editing a document in Google Docs where changes show up instantly across all connected screens.',

    syntaxCode: 'services:\n  web:\n    build: .\n    volumes:\n      - .:/app\n      - /app/node_modules',
    syntaxTokens: [
      { token: '- .:/app', role: 'Bind Mount', explanation: 'Syncs current host folder to /app inside container.' },
      { token: '- /app/node_modules', role: 'Anonymous Volume', explanation: 'Preserves container-installed node_modules from being overwritten by host.' },
    ],

    actionStage: {
      before: {
        label: 'Local File Edit',
        description: 'Developer edits App.tsx on host laptop.',
        stateBadge: 'File Edited',
        details: ['Host file changed'],
      },
      running: {
        label: 'Kernel Inotify Event',
        description: 'Bind mount propagates file system event into container.',
        stateBadge: 'Syncing Code',
        details: ['Inotify triggered', 'Nodemon / Vite detects change'],
      },
      after: {
        label: 'Instant Hot Reload',
        description: 'Dev server updates application state instantly.',
        stateBadge: 'Hot Reload Complete',
        details: ['Browser reloads in 100ms', 'Zero container rebuild needed'],
      },
    },

    variations: [
      { title: 'Docker Compose Watch', syntax: 'docker compose watch', whatItDoes: 'Automatically syncs files and rebuilds services when files change' },
    ],

    scenarios: [
      {
        title: 'Preserving node_modules in Bind Mounts',
        question: 'Why is "- /app/node_modules" added as an anonymous volume alongside "- .:/app" in dev Compose files?',
        options: [
          { label: 'To prevent host node_modules from overwriting Linux-compiled node_modules binaries inside the container', command: 'anon-vol-nodemodules', isCorrect: true, explanation: 'Anonymous volume masks container node_modules directory.' },
          { label: 'To turn on dark mode', command: 'dark-mode-myth', isCorrect: false, explanation: 'Incorrect.' },
        ],
      },
    ],

    
    withoutVsWith: {
      without: {
        title: 'WITHOUT HOT RELOADING',
        items: [
          'Rebuild the entire container image for every code change',
          'Wait 30-60 seconds to see a simple CSS color update',
          'Manually stop and restart containers',
          'Context switching destroys developer flow'
        ],
        outcome: '🐌 Agonizingly slow iteration cycles'
      },
      with: {
        title: 'WITH HOT RELOADING',
        items: [
          'Save a file and see changes instantly (100ms)',
          'No image rebuilds required during development',
          'State is preserved across code edits',
          'Uses nodemon or Vite dev server internally'
        ],
        outcome: '⚡ Instant feedback loop like native development'
      }
    },
    blockDiagram: {
      title: 'Hot Reloading Architecture',
      subtitle: 'How file changes sync from host to container',
      nodes: [
        {
          id: 'host-editor',
          label: 'Host OS (VS Code)',
          simpleDef: 'Your laptop where you write code.',
          techDef: 'Host filesystem triggering Inotify/FSEvents on file save.',
          badge: 'Host',
          color: '#38bdf8'
        },
        {
          id: 'bind-mount',
          label: 'Bind Mount / Watcher',
          simpleDef: 'The bridge connecting your folder to the container.',
          techDef: 'Docker Compose watch syncing files to container without rebuilding.',
          badge: 'Sync',
          color: '#4ade80'
        },
        {
          id: 'dev-server',
          label: 'Container Dev Server',
          simpleDef: 'Nodemon or Vite running inside the container.',
          techDef: 'Process watching the mounted directory and restarting the node process.',
          badge: 'Container',
          color: '#facc15'
        }
      ]
    },
    terms: [
      {
        term: 'Hot Reloading',
        simple: 'Updating running code without restarting the whole system.',
        technical: 'Hot Module Replacement (HMR) replacing modules in a running application.',
        analogy: 'Swapping out a car tire while the car is still moving.',
        related: ['HMR', 'Live Reload']
      },
      {
        term: 'Bind Mount',
        simple: 'Sharing a folder from your laptop directly into the container.',
        technical: 'Mounting a host filesystem path directly into the container namespace.',
        analogy: 'A two-way mirror between your laptop and the container.',
        related: ['Volume', 'Sync']
      },
      {
        term: 'Docker Compose Watch',
        simple: 'A tool that watches your files and updates containers automatically.',
        technical: 'Compose feature that syncs files and triggers rebuilds or restarts based on rules.',
        analogy: 'A security camera watching your code and pressing the update button for you.',
        related: ['Sync', 'Rebuild']
      }
    ],
    whenToUse: [
      '✓ Local frontend development (React, Vue, Next.js)',
      '✓ Local backend API development (Node.js, Python Flask)',
      '✓ Whenever you are actively modifying source code'
    ],
    whenNotToUse: [
      '✕ Production environments (code should be baked into immutable images)',
      '✕ CI/CD pipelines',
      '✕ When testing the final production build'
    ],
    developerScenario: {
      title: 'Fixing a Typo in a React App',
      setup: 'Developer is working on a React frontend running in a Docker container.',
      problem: 'Developer notices a typo on the homepage. Without hot reloading, they fix it, run "docker build...", wait 2 minutes, and refresh. They find they misspelled it again.',
      solution: 'With "docker compose watch", they fix the typo, save the file, and the browser updates instantly. They fix the second typo 5 seconds later.'
    },
    internalFlow: [
      { step: 1, title: 'File Save', desc: 'Developer saves App.tsx in VS Code.', why: 'Triggers host OS filesystem event.', techDetail: 'macOS FSEvents or Linux inotify' },
      { step: 2, title: 'Watcher Detects Change', desc: 'Docker Compose watch detects the file change.', why: 'Monitors configured directories.', techDetail: 'docker-compose.yml watch config' },
      { step: 3, title: 'File Sync', desc: 'Changed file is copied into the running container.', why: 'Updates the code without rebuilding the image.', techDetail: 'docker exec tar stream' },
      { step: 4, title: 'Dev Server Reacts', desc: 'Vite inside container detects the synced file.', why: 'HMR triggers the update.', techDetail: 'Vite HMR websocket event' },
      { step: 5, title: 'Browser Update', desc: 'Browser receives new module and updates UI.', why: 'Developer sees the change.', techDetail: 'DOM patch applied' }
    ],
    commonMistakes: [
      {
        mistake: 'Overwriting node_modules with host folder.',
        whyWrong: 'Host node_modules (e.g., Mac/Windows) might contain incompatible binaries for the Linux container.',
        correctWay: 'Use an anonymous volume for node_modules in docker-compose.yml (- /app/node_modules).'
      },
      {
        mistake: 'Running dev servers in production.',
        whyWrong: 'Nodemon and Vite dev servers are slow, unoptimized, and insecure for public traffic.',
        correctWay: 'Build static files and serve with Nginx in production images.'
      }
    ],
    recapChecklist: [
      'Hot reloading skips image rebuilds by syncing files directly into containers.',
      'Bind mounts or "docker compose watch" are essential for local development.',
      'Always mask container node_modules with an anonymous volume.',
      'Never use hot-reloading dev servers in production.'
    ],
    challenge: {
      question: 'Which tool natively monitors source code files and syncs them directly into running containers without requiring manual bind mount configuration?',
      options: [
        { label: 'docker compose watch', isCorrect: true, explanation: 'Correct! "docker compose watch" is a built-in feature designed specifically for live file synchronization.' },
        { label: 'docker build --watch', isCorrect: false, explanation: 'Incorrect. There is no --watch flag for docker build.' },
        { label: 'docker run -v', isCorrect: false, explanation: 'Incorrect. While -v sets up a bind mount, it requires manual configuration and relies on the container dev server for watching.' }
      ]
    },
    sandbox: {
      initialCommands: ['docker compose up -d'],
      guidedSteps: [
        { instruction: 'Start the services with watch mode', command: 'docker compose watch', hint: 'Run docker compose watch' },
      ],
      targetTask: 'Sync local edits with container via compose watch.',
      solutionCommands: ['docker compose watch'],
    },

    reference: {
      syntaxCheatSheet: ['docker compose watch    # Live file sync and rebuilds'],
    },
  },

  'c-container-debuggers': {
    id: 'c-container-debuggers',
    command: 'docker exec -it sh',
    title: 'Debuggers & Interactive Exec',
    topicId: 'topic-13',
    topicNumber: '13',
    topicTitle: 'Developer Experience',
    subtitle: 'Connecting Node.js / Python debuggers and interactive breakpoints inside running containers.',
    badges: ['Intermediate', 'Debugging', 'Tools'],
    quote: 'Expose inspect debugging ports (--inspect=0.0.0.0:9229) to attach VS Code debuggers to containers.',
    difficulty: 'Intermediate',

    whatIsIt:
      'Container debugging involves exposing debugger ports (e.g. Node.js `--inspect=0.0.0.0:9229` or Python `debugpy`) so IDEs like VS Code can attach breakpoints to live code executing inside containers.',
    inSimpleWords:
      'You can pause code execution line-by-line inside a running Docker container and inspect variable values directly from your IDE debug console.',
    whyDoYouNeedIt:
      'Solves complex bugs that only happen inside Linux container environments.',
    realWorldAnalogy:
      'Plugging a mechanic\'s diagnostic OBD-II scanner into a running car engine.',

    syntaxCode: 'docker run -d -p 9229:9229 -p 3000:3000 my-app node --inspect=0.0.0.0:9229 server.js',
    syntaxTokens: [
      { token: '-p 9229:9229', role: 'Port Flag', explanation: 'Exposes Node.js V8 debugger inspector port.' },
      { token: '--inspect=0.0.0.0:9229', role: 'Node Flag', explanation: 'Listens for remote IDE debugger attachments.' },
    ],

    actionStage: {
      before: {
        label: 'Bug Occurs in Container',
        description: 'API returns HTTP 500 error inside container environment.',
        stateBadge: 'Uncaught Exception',
        details: ['Stack trace logged'],
      },
      running: {
        label: 'IDE Debugger Attached',
        description: 'VS Code connects to ws://localhost:9229.',
        stateBadge: 'Breakpoint Hit',
        details: ['Execution paused at server.js:42', 'Inspecting req.body'],
      },
      after: {
        label: 'Bug Resolved',
        description: 'Developer fixes logic and resumes execution.',
        stateBadge: 'Resolved',
        details: ['Variable values verified', 'Zero guess-work'],
      },
    },

    variations: [
      { title: 'Expose Node Inspector Port', syntax: 'docker run -p 9229:9229 node --inspect=0.0.0.0:9229 app.js', whatItDoes: 'Enables VS Code remote debugger attachment' },
    ],

    scenarios: [
      {
        title: 'Debugger Binding IP',
        question: 'Why must Node.js inspect flag specify "--inspect=0.0.0.0:9229" instead of "--inspect=127.0.0.1:9229" inside Docker?',
        options: [
          { label: 'Because 127.0.0.1 binds only to container loopback; 0.0.0.0 allows host IDE to connect through port forwarding', command: 'bind-0000', isCorrect: true, explanation: 'Containers require 0.0.0.0 to accept connections forwarded from host ports.' },
          { label: 'Because 0.0.0.0 is faster', command: 'fast-myth', isCorrect: false, explanation: 'Incorrect.' },
        ],
      },
    ],

    
    withoutVsWith: {
      without: {
        title: 'WITHOUT DEBUGGERS',
        items: [
          'Relying purely on console.log() statements',
          'Rebuilding containers to add more print statements',
          'Guessing variable states at runtime',
          'Blindly trying to understand Linux network issues'
        ],
        outcome: '🕵️ Endless guesswork and frustration'
      },
      with: {
        title: 'WITH DEBUGGERS & EXEC',
        items: [
          'Pause execution exactly where the bug happens',
          'Inspect variable values interactively in VS Code',
          'Drop into a live shell (docker exec -it)',
          'Run diagnostics (curl, ping, strace) live'
        ],
        outcome: '🎯 Precision surgical debugging'
      }
    },
    blockDiagram: {
      title: 'Remote Debugging Architecture',
      subtitle: 'Connecting IDEs to containerized processes',
      nodes: [
        {
          id: 'ide',
          label: 'VS Code (Host)',
          simpleDef: 'Your IDE where you set breakpoints.',
          techDef: 'Debugger client connecting via WebSocket to the debug port.',
          badge: 'Client',
          color: '#38bdf8'
        },
        {
          id: 'port-forward',
          label: 'Port Mapping',
          simpleDef: 'The tunnel through the container wall.',
          techDef: 'Docker NAT translating localhost:9229 to container:9229.',
          badge: 'Network',
          color: '#4ade80'
        },
        {
          id: 'node-inspector',
          label: 'Node V8 Inspector',
          simpleDef: 'The debugger listening inside the container.',
          techDef: 'Node.js started with --inspect=0.0.0.0:9229 listening for clients.',
          badge: 'Process',
          color: '#facc15'
        }
      ]
    },
    terms: [
      {
        term: 'docker exec',
        simple: 'Running a new command inside an already running container.',
        technical: 'Spawning a new process inside the existing namespaces of a target container.',
        analogy: 'Opening the door to an already running engine room.',
        related: ['Interactive', 'Shell']
      },
      {
        term: 'Interactive Shell',
        simple: 'A command line terminal where you can type commands live.',
        technical: 'Allocating a TTY and keeping STDIN open (-it flags).',
        analogy: 'A direct phone line to the container.',
        related: ['TTY', 'STDIN']
      },
      {
        term: 'Debugger Port',
        simple: 'A special network port used by IDEs to pause code.',
        technical: 'A WebSocket endpoint exposed by runtimes (like Node V8 or Python debugpy).',
        analogy: 'A diagnostic port on a car engine.',
        related: ['Inspect', 'VS Code']
      }
    ],
    whenToUse: [
      '✓ Stepping through complex logic bugs',
      '✓ Inspecting the state of a running application in development',
      '✓ Exploring container filesystems using docker exec',
      '✓ Troubleshooting container network connectivity (curl, ping)'
    ],
    whenNotToUse: [
      '✕ In production environments (debuggers expose critical security risks)',
      '✕ When simple logs provide enough context',
      '✕ Exposing debug ports to the public internet'
    ],
    developerScenario: {
      title: 'The Ghost Bug in the Container',
      setup: 'A Node.js API works locally but fails inside a Docker container with an obscure "ECONNREFUSED" error.',
      problem: 'The developer adds console.log statements, rebuilds, and runs it 10 times, wasting hours trying to guess the issue.',
      solution: 'They expose port 9229, attach the VS Code debugger, pause execution right before the crash, and immediately see the database connection string is missing an environment variable.'
    },
    internalFlow: [
      { step: 1, title: 'Start with Inspect', desc: 'Container starts Node with --inspect=0.0.0.0:9229.', why: 'Opens the V8 inspector protocol on all interfaces.', techDetail: 'Listening on 0.0.0.0:9229' },
      { step: 2, title: 'Port Published', desc: 'Docker maps host port 9229 to container port 9229.', why: 'Allows the host IDE to reach the container network.', techDetail: 'iptables DNAT rule applied' },
      { step: 3, title: 'IDE Attaches', desc: 'VS Code connects to localhost:9229.', why: 'Establishes the debugging session.', techDetail: 'WebSocket connection upgrades' },
      { step: 4, title: 'Breakpoint Hit', desc: 'Code execution pauses at the specified line.', why: 'Debugger intercepts the execution thread.', techDetail: 'V8 engine suspends main thread' },
      { step: 5, title: 'Variables Inspected', desc: 'Developer hovers over variables in VS Code.', why: 'To identify the bug.', techDetail: 'JSON-RPC request for stack frame locals' }
    ],
    commonMistakes: [
      {
        mistake: 'Binding debugger to 127.0.0.1 inside container.',
        whyWrong: '127.0.0.1 inside the container is isolated. The host IDE cannot reach it.',
        correctWay: 'Always bind debuggers to 0.0.0.0 (all interfaces) inside containers.'
      },
      {
        mistake: 'Forgetting to publish the debug port.',
        whyWrong: 'Even if the process listening on 0.0.0.0:9229, Docker blocks access unless explicitly mapped.',
        correctWay: 'Add -p 9229:9229 to your docker run or compose file.'
      }
    ],
    recapChecklist: [
      'Use "docker exec -it <container> sh" to explore running containers.',
      'Debuggers require both process-level binding (0.0.0.0) and Docker port mapping (-p).',
      'VS Code can attach directly to containers using Remote Containers / Dev Containers.',
      'Never leave debug ports open in production deployments.'
    ],
    challenge: {
      question: 'Which combination of flags is required to open an interactive terminal shell inside an already running container?',
      options: [
        { label: '-it', isCorrect: true, explanation: 'Correct! -i keeps STDIN open, and -t allocates a pseudo-TTY.' },
        { label: '-d', isCorrect: false, explanation: 'Incorrect. -d runs the container in detached background mode.' },
        { label: '--rm', isCorrect: false, explanation: 'Incorrect. --rm automatically removes the container when it stops.' }
      ]
    },
    sandbox: {
      initialCommands: ['docker run -d --name myapp alpine sleep 3600'],
      guidedSteps: [
        { instruction: 'Open an interactive shell inside the container', command: 'docker exec -it myapp /bin/sh', hint: 'Run docker exec -it myapp /bin/sh' },
      ],
      targetTask: 'Attach an interactive shell for debugging.',
      solutionCommands: ['docker exec -it myapp /bin/sh'],
    },

    reference: {
      syntaxCheatSheet: ['docker run -p 9229:9229 [IMAGE] node --inspect=0.0.0.0:9229 [FILE]'],
    },
  },

  'c-container-tests': {
    id: 'c-container-tests',
    command: 'docker run --rm app npm test',
    title: 'Running Automated Tests',
    topicId: 'topic-13',
    topicNumber: '13',
    topicTitle: 'Developer Experience',
    subtitle: 'Executing unit, integration, and end-to-end tests inside isolated disposable container environments.',
    badges: ['Intermediate', 'Testing', 'CI'],
    quote: 'Running unit tests inside containerized environments guarantees zero test flakiness due to host system state.',
    difficulty: 'Intermediate',

    whatIsIt:
      'Containerized Testing involves executing unit, integration, and E2E test suites (`npm test`, `pytest`, `go test`) inside temporary container instances (`docker run --rm`).',
    inSimpleWords:
      'Run your automated tests inside a clean, fresh container. Once tests pass or fail, the container deletes itself.',
    whyDoYouNeedIt:
      'Guarantees test reproducibility across developer laptops and CI server agents.',
    realWorldAnalogy:
      'Crash-testing a prototype vehicle inside an isolated test facility before mass manufacturing.',

    syntaxCode: 'docker run --rm my-app:test npm test',
    syntaxTokens: [
      { token: '--rm', role: 'Flag', explanation: 'Auto-deletes test container upon completion.' },
      { token: 'npm test', role: 'Test Runner', explanation: 'Executes Jest / Mocha test suite inside container.' },
    ],

    actionStage: {
      before: {
        label: 'Source Code & Tests Ready',
        description: 'Test files ready inside image build.',
        stateBadge: 'Tests Ready',
        details: ['Jest unit tests', 'Supertest API integration tests'],
      },
      running: {
        label: 'Isolated Test Runner Execution',
        description: 'Disposable container executes test suite.',
        stateBadge: 'Running Suite',
        details: ['PASS tests/user.test.js', 'PASS tests/auth.test.js', 'Exit code 0'],
      },
      after: {
        label: 'Clean System Exit',
        description: 'Test results outputted; container automatically deleted.',
        stateBadge: 'Suite Passed (0)',
        details: ['Test result: 42 passed, 0 failed', 'Container purged'],
      },
    },

    variations: [
      { title: 'Run Pytest in Container', syntax: 'docker run --rm python-app pytest', whatItDoes: 'Executes Python pytest suite' },
    ],

    scenarios: [
      {
        title: 'CI Exit Code Verification',
        question: 'How do CI/CD build pipelines detect if automated tests passed or failed inside a container?',
        options: [
          { label: 'By inspecting the process exit code returned by "docker run" (0 = success, non-zero = failure)', command: 'exit-code-test', isCorrect: true, explanation: 'Exit code 0 indicates all tests passed; non-zero indicates failure.' },
          { label: 'By taking a photo of the monitor', command: 'photo-monitor', isCorrect: false, explanation: 'Incorrect.' },
        ],
      },
    ],

    
    withoutVsWith: {
      without: {
        title: 'WITHOUT CONTAINERIZED TESTS',
        items: [
          'Tests pass on developer laptop but fail in CI',
          'Flaky tests due to leftover state in databases',
          'Mocking external services poorly',
          'Dependency conflicts on the build server'
        ],
        outcome: '🎲 "It works on my machine" test failures'
      },
      with: {
        title: 'WITH CONTAINERIZED TESTS',
        items: [
          'Identical test environment locally and in CI',
          'Fresh, disposable databases for every test run',
          'Testcontainers spin up real services programmatically',
          'Guaranteed clean state with --rm flag'
        ],
        outcome: '✅ 100% reproducible and reliable tests'
      }
    },
    blockDiagram: {
      title: 'Containerized Testing Flow',
      subtitle: 'Isolated execution and teardown',
      nodes: [
        {
          id: 'test-code',
          label: 'Test Suite Code',
          simpleDef: 'Your unit and integration tests.',
          techDef: 'Test runner (Jest, Pytest) executed within the container entrypoint.',
          badge: 'Tests',
          color: '#38bdf8'
        },
        {
          id: 'test-container',
          label: 'Ephemeral Container',
          simpleDef: 'A temporary box where tests run.',
          techDef: 'A container run with --rm to ensure automatic filesystem teardown.',
          badge: 'Isolated',
          color: '#4ade80'
        },
        {
          id: 'exit-code',
          label: 'Exit Code Status',
          simpleDef: 'Pass (0) or Fail (1).',
          techDef: 'Process exit code propagated back to the CI pipeline runner.',
          badge: 'Result',
          color: '#facc15'
        }
      ]
    },
    terms: [
      {
        term: 'Ephemeral Container',
        simple: 'A temporary container that deletes itself when done.',
        technical: 'A container executed with the --rm flag, instructing the daemon to reap the filesystem.',
        analogy: 'A self-destructing message from Mission Impossible.',
        related: ['--rm', 'Disposable']
      },
      {
        term: 'Testcontainers',
        simple: 'A library that lets code start real databases in Docker for tests.',
        technical: 'An open-source library that provides lightweight, throwaway instances of common databases via Docker API.',
        analogy: 'Ordering a rental car just for the day, then returning it.',
        related: ['Integration Testing', 'Docker API']
      },
      {
        term: 'Exit Code',
        simple: 'A number a program returns when it finishes (0 means success).',
        technical: 'The OS-level return code from the primary container process used by CI to determine pipeline status.',
        analogy: 'A pass/fail grade on an exam.',
        related: ['CI/CD', 'Pipeline']
      }
    ],
    whenToUse: [
      '✓ Running unit tests in CI/CD pipelines',
      '✓ Integration testing against real databases (Postgres, Redis)',
      '✓ End-to-End (E2E) browser testing (Cypress, Playwright)',
      '✓ Verifying exact OS compatibility (e.g., Ubuntu vs Alpine)'
    ],
    whenNotToUse: [
      '✕ When tests require intense manual UI interaction',
      '✕ When extremely fast sub-second TDD iteration is needed (use local tools instead)',
      '✕ If the host environment is strictly required for hardware testing'
    ],
    developerScenario: {
      title: 'The Flaky Database Test',
      setup: 'A developer writes an integration test that creates a user. It passes locally.',
      problem: 'In CI, the test sometimes fails because another test runs concurrently and creates a user with the same ID in the shared testing database.',
      solution: 'They use Docker and Testcontainers to spin up a completely fresh, isolated PostgreSQL container for *every* test suite run. The flakiness disappears forever.'
    },
    internalFlow: [
      { step: 1, title: 'CI Triggers Job', desc: 'GitHub Actions runs "docker run --rm test-image".', why: 'Initiates the automated test suite.', techDetail: 'GHA runner executes Docker CLI' },
      { step: 2, title: 'Container Starts', desc: 'Docker provisions an isolated filesystem and network.', why: 'Ensures a clean state environment.', techDetail: 'Namespaces and cgroups allocated' },
      { step: 3, title: 'Test Runner Executes', desc: 'Jest or Pytest runs the assertions.', why: 'Validates application logic.', techDetail: 'Executes PID 1 entrypoint' },
      { step: 4, title: 'Results Output', desc: 'Test results print to STDOUT.', why: 'Provides logs to the developer.', techDetail: 'docker logs captures stdout/stderr' },
      { step: 5, title: 'Container Destroyed', desc: 'Process exits and Docker removes the container.', why: 'Cleans up disk space and state automatically.', techDetail: 'Daemon intercepts exit and deletes rootfs' }
    ],
    commonMistakes: [
      {
        mistake: 'Forgetting the --rm flag in CI.',
        whyWrong: 'Without --rm, every test run leaves a stopped container on disk, eventually crashing the CI server due to disk space exhaustion.',
        correctWay: 'Always use docker run --rm for automated tests.'
      },
      {
        mistake: 'Mocking everything instead of using real containers.',
        whyWrong: 'Heavy mocking leads to tests that pass but fail in production because the mock behaved differently than the real database.',
        correctWay: 'Use Docker to spin up real instances of Postgres, Redis, etc., for integration tests.'
      }
    ],
    recapChecklist: [
      'Containerized tests guarantee the environment matches production.',
      'Always use the --rm flag to clean up disposable test containers.',
      'CI pipelines rely on the container exit code (0 for success, >0 for failure).',
      'Testcontainers library is the industry standard for integration testing.'
    ],
    challenge: {
      question: 'In a CI/CD pipeline, how does the CI platform (like GitHub Actions) know if a "docker run" test suite passed or failed?',
      options: [
        { label: 'By the process exit code returned by the container', isCorrect: true, explanation: 'Correct! An exit code of 0 means success, while non-zero means failure.' },
        { label: 'By parsing the standard output for the word "PASS"', isCorrect: false, explanation: 'Incorrect. Parsing logs is unreliable; exit codes are the standard mechanism.' },
        { label: 'Docker automatically sends an email to the developer', isCorrect: false, explanation: 'Incorrect. Docker does not have native email capabilities.' }
      ]
    },
    sandbox: {
      initialCommands: ['echo "const test = () => true;" > test.js'],
      guidedSteps: [
        { instruction: 'Run a disposable test container', command: 'docker run --rm node:18-alpine node -e "console.log(\'Tests Pass\')"', hint: 'Run docker run --rm node:18-alpine node -e "console.log(\'Tests Pass\')"' },
      ],
      targetTask: 'Execute an automated test in a temporary container.',
      solutionCommands: ['docker run --rm node:18-alpine node -e "console.log(\'Tests Pass\')"'],
    },

    reference: {
      syntaxCheatSheet: ['docker run --rm [IMAGE] [TEST_COMMAND]'],
    },
  },

  'c-continuous-integration': {
    id: 'c-continuous-integration',
    command: 'docker buildx build',
    title: 'Continuous Integration (CI/CD)',
    topicId: 'topic-13',
    topicNumber: '13',
    topicTitle: 'Developer Experience',
    subtitle: 'Automating multi-architecture container builds, layer caching, and registry pushes in GitHub Actions.',
    badges: ['Advanced', 'CI/CD', 'Automation'],
    quote: 'Automate Docker builds in GitHub Actions using docker/build-push-action with GHA layer caching.',
    difficulty: 'Advanced',

    whatIsIt:
      'Continuous Integration (CI/CD) pipelines use build agents (e.g. GitHub Actions, GitLab CI) to automatically build, test, scan, and push Docker images to container registries on every git push.',
    inSimpleWords:
      'When you git push code to GitHub, an automated robot builds your Docker container, runs tests, scans for security bugs, and publishes the image to Docker Hub.',
    whyDoYouNeedIt:
      'Eliminates manual image builds on developer laptops and guarantees that only tested, scanned images reach production.',
    realWorldAnalogy:
      'An automated quality control conveyor belt in a factory that inspects, packages, and ships products automatically.',

    syntaxCode: '- name: Build and push Docker image\n  uses: docker/build-push-action@v5\n  with:\n    push: true\n    tags: user/app:${{ github.sha }}\n    cache-from: type=gha\n    cache-to: type=gha,mode=max',
    syntaxTokens: [
      { token: 'docker/build-push-action@v5', role: 'GHA Action', explanation: 'Official Docker GitHub Action for automated BuildKit builds.' },
      { token: 'cache-from: type=gha', role: 'CI Cache', explanation: 'Reuses layer caches stored in GitHub Actions cache storage.' },
    ],

    actionStage: {
      before: {
        label: 'Git Push Event',
        description: 'Developer pushes commit to main branch.',
        stateBadge: 'git push',
        details: ['Commit: 7f3a9b'],
      },
      running: {
        label: 'GitHub Actions Build Pipeline',
        description: 'BuildKit builds image, reuses GHA layer cache, and runs Trivy CVE scan.',
        stateBadge: 'Building in CI',
        details: ['Restoring GHA layer cache', 'Building multi-arch (amd64/arm64)', 'Passed security scan'],
      },
      after: {
        label: 'Published Image Artifact',
        description: 'Tagged image user/app:git-7f3a9b published to registry.',
        stateBadge: 'Pushed to Registry',
        details: ['Image live on GHCR/DockerHub', 'Ready for deployment'],
      },
    },

    variations: [
      { title: 'Build Multi-Architecture Image', syntax: 'docker buildx build --platform linux/amd64,linux/arm64 -t app .', whatItDoes: 'Builds image compatible with both Intel/AMD and ARM (Apple Silicon/Graviton) servers' },
    ],

    scenarios: [
      {
        title: 'CI Layer Cache Acceleration',
        question: 'Why is "cache-from: type=gha" essential in GitHub Actions Docker build workflows?',
        options: [
          { label: 'It stores Docker layer caches in GitHub Actions cache, reducing CI build times from minutes to seconds', command: 'gha-cache-speed', isCorrect: true, explanation: 'CI runners start fresh on every job; caching layers speeds up pipelines.' },
          { label: 'It sends text messages to developers', command: 'text-msg', isCorrect: false, explanation: 'Incorrect.' },
        ],
      },
    ],

    
    withoutVsWith: {
      without: {
        title: 'WITHOUT CI/CD',
        items: [
          'Developers manually building images on laptops',
          'Deploying untested code directly to production',
          'Forgetting to tag images properly',
          'Pushing bloated, insecure images containing secrets'
        ],
        outcome: '💣 High risk, slow, and error-prone deployments'
      },
      with: {
        title: 'WITH CI/CD pipelines',
        items: [
          'Automated builds on every git push',
          'Mandatory test suites and security vulnerability scans',
          'Multi-architecture builds (AMD64 & ARM64)',
          'Automated pushing to Docker Hub or ECR'
        ],
        outcome: '🚀 Fast, secure, and reliable shipping'
      }
    },
    blockDiagram: {
      title: 'CI/CD Pipeline Architecture',
      subtitle: 'From Git Push to Registry Push',
      nodes: [
        {
          id: 'git-repo',
          label: 'Source Code',
          simpleDef: 'Your GitHub repository.',
          techDef: 'Triggers webhook on push event to start pipeline.',
          badge: 'Code',
          color: '#38bdf8'
        },
        {
          id: 'ci-runner',
          label: 'CI Runner',
          simpleDef: 'The robot that builds your code.',
          techDef: 'GitHub Actions agent executing BuildKit / Docker Buildx.',
          badge: 'Build',
          color: '#4ade80'
        },
        {
          id: 'registry',
          label: 'Container Registry',
          simpleDef: 'The warehouse storing your images.',
          techDef: 'Docker Hub or GHCR receiving the pushed image layers.',
          badge: 'Store',
          color: '#facc15'
        }
      ]
    },
    terms: [
      {
        term: 'Continuous Integration (CI)',
        simple: 'Automating the building and testing of code.',
        technical: 'A practice of frequently merging code into a shared repository, triggering automated build and test pipelines.',
        analogy: 'An automated assembly line that inspects every part.',
        related: ['GitHub Actions', 'Pipeline']
      },
      {
        term: 'docker buildx',
        simple: 'An advanced tool for building Docker images.',
        technical: 'A Docker CLI plugin that extends the build command with full support for the BuildKit engine.',
        analogy: 'A high-tech industrial 3D printer.',
        related: ['BuildKit', 'Multi-arch']
      },
      {
        term: 'Multi-architecture Build',
        simple: 'Building an image that works on different types of computers.',
        technical: 'Compiling an OCI image index that contains manifests for multiple CPU architectures (e.g., linux/amd64, linux/arm64).',
        analogy: 'Translating a book into multiple languages simultaneously.',
        related: ['ARM64', 'AMD64']
      }
    ],
    whenToUse: [
      '✓ For all production container deployments',
      '✓ When working in teams with multiple developers',
      '✓ To automate security scanning of container images',
      '✓ When deploying to ARM-based cloud instances (AWS Graviton)'
    ],
    whenNotToUse: [
      '✕ For quick local prototyping and testing',
      '✕ If the project is a simple script run manually',
      '✕ When internet access is completely restricted (air-gapped)'
    ],
    developerScenario: {
      title: 'The Apple Silicon M1 Problem',
      setup: 'A developer builds a Docker image on their new Apple M1 laptop (ARM architecture) and manually pushes it to production.',
      problem: 'The production servers run on Intel (AMD64). The container crashes immediately with an "exec user process caused: exec format error".',
      solution: 'They set up GitHub Actions CI/CD using "docker buildx". The CI server automatically cross-compiles the image for both linux/amd64 and linux/arm64, ensuring it runs everywhere.'
    },
    internalFlow: [
      { step: 1, title: 'Code Push', desc: 'Developer pushes code to GitHub.', why: 'Initiates the process.', techDetail: 'GitHub Webhook triggered' },
      { step: 2, title: 'Runner Starts', desc: 'GitHub Actions provisions a fresh VM runner.', why: 'Provides a clean build environment.', techDetail: 'Ubuntu-latest VM booted' },
      { step: 3, title: 'Cache Restored', desc: 'Docker layers from previous builds are downloaded.', why: 'Speeds up the build process significantly.', techDetail: 'GHA cache API used' },
      { step: 4, title: 'BuildKit Executes', desc: 'Image is built using Buildx.', why: 'Compiles the application into a container.', techDetail: 'BuildKit builds graph' },
      { step: 5, title: 'Image Pushed', desc: 'Final image is pushed to Docker Hub.', why: 'Makes it available for deployment.', techDetail: 'Registry API PUT request' }
    ],
    commonMistakes: [
      {
        mistake: 'Not caching Docker layers in CI.',
        whyWrong: 'CI runners are fresh every time. Without caching, a 5-minute build takes 5 minutes every single time, slowing down development.',
        correctWay: 'Use "cache-from" and "cache-to" in your build-push-action configuration.'
      },
      {
        mistake: 'Baking secrets into the image during CI.',
        whyWrong: 'Using ARG for passwords bakes them into the image layers, exposing them to anyone who downloads the image.',
        correctWay: 'Use Docker BuildKit secrets (--secret id=mysecret) during the build.'
      }
    ],
    recapChecklist: [
      'CI/CD pipelines automate building, testing, and pushing images.',
      'Use GitHub Actions with docker/build-push-action for modern workflows.',
      'Always configure layer caching to speed up CI builds.',
      'Buildx enables building multi-architecture images easily.'
    ],
    challenge: {
      question: 'Which Docker technology is the underlying engine utilized by "docker buildx" to perform concurrent, multi-architecture builds?',
      options: [
        { label: 'BuildKit', isCorrect: true, explanation: 'Correct! BuildKit is the modern, concurrent build engine under the hood of buildx.' },
        { label: 'Docker Compose', isCorrect: false, explanation: 'Incorrect. Compose is for running multiple containers, not the build engine.' },
        { label: 'Docker Swarm', isCorrect: false, explanation: 'Incorrect. Swarm is for orchestration and clustering.' }
      ]
    },
    sandbox: {
      initialCommands: ['docker version'],
      guidedSteps: [
        { instruction: 'Use buildx to build multi-platform', command: 'docker buildx build --platform linux/amd64,linux/arm64 -t myapp .', hint: 'Run docker buildx build --platform linux/amd64,linux/arm64 -t myapp .' },
      ],
      targetTask: 'Initialize a Buildx builder for CI/CD pipelines.',
      solutionCommands: ['docker buildx build --platform linux/amd64,linux/arm64 -t myapp .'],
    },

    reference: {
      officialDocUrl: 'https://github.com/docker/build-push-action',
      syntaxCheatSheet: ['docker buildx build --platform linux/amd64,linux/arm64 --push -t [TAG] .'],
    },
  },

  'c-paas-options': {
    id: 'c-paas-options',
    command: 'deploy container',
    title: 'PaaS Options (Render/Fly.io/AWS ECS)',
    topicId: 'topic-14',
    topicNumber: '14',
    topicTitle: 'Deploying Containers',
    subtitle: 'Deploying containers to Managed Platform-as-a-Service platforms without managing Kubernetes clusters.',
    badges: ['Intermediate', 'PaaS', 'Cloud'],
    quote: 'PaaS platforms allow you to deploy production containers with automatic SSL, custom domains, and zero cluster maintenance.',
    difficulty: 'Intermediate',

    whatIsIt:
      'Container Platform-as-a-Service (PaaS) platforms (Render, Fly.io, Railway, AWS ECS, Google Cloud Run) allow developers to deploy Docker containers by simply connecting a git repository or pushing a container image.',
    inSimpleWords:
      'PaaS is cloud hosting on easy mode. You push your Docker container, and Render or AWS ECS handles server provisioning, load balancing, HTTPS SSL certificates, and auto-scaling for you.',
    whyDoYouNeedIt:
      'Avoids the high complexity and maintenance overhead of operating Kubernetes clusters for small to medium applications.',
    realWorldAnalogy:
      'Renting an apartment with utilities and maid service included vs building a house from scratch.',

    syntaxCode: 'fly launch\naws ecs run-task --task-definition my-app',
    syntaxTokens: [
      { token: 'fly launch', role: 'CLI Tool', explanation: 'Automatically detects Dockerfile and deploys container globally.' },
    ],

    actionStage: {
      before: {
        label: 'Built Docker Image',
        description: 'Image user/my-app:v1.0 pushed to container registry.',
        stateBadge: 'Image Ready',
        details: ['Pushed to Docker Hub'],
      },
      running: {
        label: 'PaaS Automated Deployment',
        description: 'PaaS pulls image, attaches HTTPS SSL certificate, and sets up health checks.',
        stateBadge: 'Provisioning PaaS',
        details: ['Assigning public domain', 'Provisioning SSL certificate', 'Starting container instance'],
      },
      after: {
        label: 'Live Production Web App',
        description: 'Application live on https://my-app.onrender.com with auto-scaling.',
        stateBadge: 'Live HTTPS',
        details: ['HTTPS active', 'Auto-restart enabled', 'Zero server administration'],
      },
    },

    variations: [
      { title: 'Serverless Container (Cloud Run)', syntax: 'gcloud run deploy my-app --image user/app:v1', whatItDoes: 'Deploys container that scales to 0 when idle' },
    ],

    scenarios: [
      {
        title: 'Serverless Container Scaling',
        question: 'What is a major financial benefit of deploying containers to serverless platforms like Google Cloud Run or AWS Fargate?',
        options: [
          { label: 'Containers scale down to 0 when there is no traffic, so you pay $0 when nobody is using the app', command: 'scale-zero', isCorrect: true, explanation: 'Serverless containers bill per second of active CPU execution.' },
          { label: 'Free coffee', command: 'free-coffee', isCorrect: false, explanation: 'Incorrect.' },
        ],
      },
    ],

    
    withoutVsWith: {
      without: {
        title: 'WITHOUT PAAS (Bare Metal)',
        items: [
          'Manually provisioning Linux servers',
          'Configuring Nginx reverse proxies and SSH keys',
          'Managing Let\'s Encrypt SSL certificate renewals',
          'Waking up at 3 AM when the server crashes'
        ],
        outcome: '😫 High operational burden and stress'
      },
      with: {
        title: 'WITH PAAS (Render, Fly.io)',
        items: [
          'Connect GitHub repo or push Docker image',
          'Automatic SSL certificates and custom domains',
          'Automated load balancing and zero-downtime deploys',
          'Built-in logs and metrics dashboards'
        ],
        outcome: '😎 Focus entirely on writing application code'
      }
    },
    blockDiagram: {
      title: 'PaaS Deployment Architecture',
      subtitle: 'Abstracting infrastructure away',
      nodes: [
        {
          id: 'registry',
          label: 'Container Registry',
          simpleDef: 'Where your built image is stored.',
          techDef: 'OCI compliant image registry accessed by PaaS control plane.',
          badge: 'Source',
          color: '#38bdf8'
        },
        {
          id: 'paas-proxy',
          label: 'PaaS Load Balancer',
          simpleDef: 'The front door handling web traffic.',
          techDef: 'Managed L7 ingress proxy terminating TLS/SSL connections.',
          badge: 'Network',
          color: '#4ade80'
        },
        {
          id: 'managed-container',
          label: 'Managed Container',
          simpleDef: 'Your app running on managed servers.',
          techDef: 'Firecracker MicroVM or managed K8s pod running the workload.',
          badge: 'Compute',
          color: '#facc15'
        }
      ]
    },
    terms: [
      {
        term: 'Platform-as-a-Service (PaaS)',
        simple: 'Cloud hosting that manages the servers for you.',
        technical: 'A cloud computing model delivering managed hardware and software tools for application deployment.',
        analogy: 'Renting a fully furnished apartment with a property manager.',
        related: ['Serverless', 'Managed Hosting']
      },
      {
        term: 'Serverless Container',
        simple: 'A container that only runs (and costs money) when someone visits the site.',
        technical: 'Scale-to-zero container compute platforms (like Google Cloud Run) billing by the millisecond of execution.',
        analogy: 'A taxi meter that only runs when the car is moving.',
        related: ['Cloud Run', 'Fargate']
      },
      {
        term: 'Zero-Downtime Deployment',
        simple: 'Updating a website without it ever going offline.',
        technical: 'Starting new container instances, waiting for health checks to pass, and gracefully shifting load balancer traffic.',
        analogy: 'Changing lanes on the highway smoothly without stopping.',
        related: ['Rolling Update', 'Health Check']
      }
    ],
    whenToUse: [
      '✓ Startups and small teams without dedicated DevOps engineers',
      '✓ Web applications, APIs, and background worker processes',
      '✓ Projects where speed to market is critical',
      '✓ Serverless compute for unpredictable traffic spikes'
    ],
    whenNotToUse: [
      '✕ Extreme scale applications where cloud costs become prohibitive',
      '✕ Highly regulated industries requiring complex custom networking (VPNs, specific firewalls)',
      '✕ Applications requiring raw hardware access (custom GPUs, special kernel modules)'
    ],
    developerScenario: {
      title: 'The Viral Traffic Spike',
      setup: 'A developer deploys their Dockerized app to a single $5 DigitalOcean droplet.',
      problem: 'Their app goes viral on Reddit. The traffic overwhelms the single server, crashing the site for 12 hours while they scramble to manually configure load balancers.',
      solution: 'If they had used a Serverless PaaS like Google Cloud Run, the platform would have automatically scaled from 1 container to 100 containers instantly to handle the traffic, then scaled back to 1 when traffic dropped.'
    },
    internalFlow: [
      { step: 1, title: 'Image Provided', desc: 'PaaS detects a new image push or GitHub commit.', why: 'Triggers the deployment pipeline.', techDetail: 'Webhook or Registry event' },
      { step: 2, title: 'Provisioning', desc: 'Platform allocates CPU and Memory resources.', why: 'Prepares the environment.', techDetail: 'Schedules workload on fleet' },
      { step: 3, title: 'Startup & Health', desc: 'Container starts and PaaS pings the /health endpoint.', why: 'Ensures the app isn\'t broken before sending traffic.', techDetail: 'HTTP GET readiness probe' },
      { step: 4, title: 'Traffic Shift', desc: 'Load balancer routes incoming web traffic to the new container.', why: 'Makes the app live.', techDetail: 'Envoy proxy route update' },
      { step: 5, title: 'Old Teardown', desc: 'Previous version container is shut down.', why: 'Completes the zero-downtime rollout.', techDetail: 'SIGTERM sent to old container' }
    ],
    commonMistakes: [
      {
        mistake: 'Storing uploaded files inside the container.',
        whyWrong: 'PaaS containers are ephemeral. If the platform restarts your container, all local files are lost permanently.',
        correctWay: 'Use external cloud storage like AWS S3 for user uploads.'
      },
      {
        mistake: 'Hardcoding environment variables.',
        whyWrong: 'Baking API keys into the image means they are visible to anyone. Also requires a rebuild to change environments.',
        correctWay: 'Use the PaaS dashboard to set runtime Environment Variables/Secrets.'
      }
    ],
    recapChecklist: [
      'PaaS platforms handle servers, scaling, and SSL certificates automatically.',
      'Serverless containers (Cloud Run) can scale to zero, saving money.',
      'Never store persistent data directly on a PaaS container filesystem.',
      'Always configure health check endpoints (/health) for zero-downtime deploys.'
    ],
    challenge: {
      question: 'Why is it a bad practice to save user-uploaded profile pictures directly to the local filesystem of a container deployed on a PaaS?',
      options: [
        { label: 'Because PaaS containers are ephemeral and data is lost upon automatic restarts or scaling', isCorrect: true, explanation: 'Correct! You must use external object storage like S3 for persistent files.' },
        { label: 'Because the files will be too large and slow down the website', isCorrect: false, explanation: 'Incorrect. While size is a factor, the primary issue is data loss due to ephemerality.' },
        { label: 'Because Docker prohibits writing files at runtime', isCorrect: false, explanation: 'Incorrect. Containers can write files, but they disappear when the container is destroyed.' }
      ]
    },
    sandbox: {
      initialCommands: ['docker pull nginx:alpine'],
      guidedSteps: [
        { instruction: 'Simulate PaaS deploy by tagging', command: 'fly deploy', hint: 'Run fly deploy' },
      ],
      targetTask: 'Prepare a container image for PaaS deployment.',
      solutionCommands: ['fly deploy'],
    },

    reference: {
      syntaxCheatSheet: ['gcloud run deploy --image [IMAGE]'],
    },
  },

  'c-docker-swarm': {
    id: 'c-docker-swarm',
    command: 'docker swarm init',
    title: 'Docker Swarm',
    topicId: 'topic-14',
    topicNumber: '14',
    topicTitle: 'Deploying Containers',
    subtitle: 'Native built-in Docker cluster management, manager nodes, worker nodes, and overlay networking.',
    badges: ['Advanced', 'Clustering', 'Swarm'],
    quote: 'Docker Swarm is Docker\'s native built-in clustering engine that turns a fleet of Docker hosts into a single virtual daemon.',
    difficulty: 'Advanced',

    whatIsIt:
      'Docker Swarm is the native clustering and container orchestration engine built directly into the Docker CLI (`docker swarm init`, `docker service create`, `docker stack deploy`). It manages manager/worker node pools, rolling updates, and self-healing tasks.',
    inSimpleWords:
      'Docker Swarm connects multiple Linux servers into one super-computer. If you create a service with 5 replicas, Swarm spreads them across your servers. If one server dies, Swarm moves the containers to healthy servers automatically.',
    whyDoYouNeedIt:
      'Provides multi-node container clustering using the standard Docker CLI without needing to learn complex Kubernetes manifests.',
    realWorldAnalogy:
      'A team of delivery drivers managed by a central dispatcher who routes orders to whoever is available.',

    syntaxCode: 'docker swarm init\ndocker service create --name web-api --replicas 5 -p 80:80 nginx:alpine',
    syntaxTokens: [
      { token: 'docker swarm init', role: 'Command', explanation: 'Initializes current node as Swarm Manager.' },
      { token: '--replicas 5', role: 'Flag', explanation: 'Maintains exactly 5 running container instances across node pool.' },
    ],

    actionStage: {
      before: {
        label: 'Single Standalone Node',
        description: 'Docker running on single host machine.',
        stateBadge: 'Standalone Engine',
        details: ['Single host failure risk'],
      },
      running: {
        label: 'Swarm Cluster Initialization',
        description: 'Swarm Manager initializes Raft consensus database and Overlay network.',
        stateBadge: 'Swarm Active',
        details: ['Manager Node initialized', 'Overlay network created', 'Worker tokens generated'],
      },
      after: {
        label: 'Multi-Replica Swarm Service',
        description: '5 container replicas running with ingress load balancing.',
        stateBadge: 'Swarm Cluster Live',
        details: ['5 replicas active', 'Self-healing enabled', 'Rolling updates supported'],
      },
    },

    variations: [
      { title: 'Deploy Compose File to Swarm', syntax: 'docker stack deploy -c docker-compose.yml my-stack', whatItDoes: 'Deploys Compose file as Swarm services across cluster' },
    ],

    scenarios: [
      {
        title: 'Swarm Self-Healing',
        question: 'What happens in a Docker Swarm cluster if a worker node holding 2 container replicas crashes?',
        options: [
          { label: 'The Swarm Manager automatically reschedules and starts 2 new container replicas on remaining healthy worker nodes', command: 'swarm-self-heal', isCorrect: true, explanation: 'Docker Swarm continuously reconciles actual state to match desired replica count.' },
          { label: 'The whole cluster turns off', command: 'cluster-off', isCorrect: false, explanation: 'Incorrect.' },
        ],
      },
    ],

    
    withoutVsWith: {
      without: {
        title: 'WITHOUT ORCHESTRATION',
        items: [
          'Manually SSHing into servers to run docker commands',
          'Containers dying and staying dead',
          'No native load balancing across multiple servers',
          'Downtime during application updates'
        ],
        outcome: '🚧 Fragile, manual, and unscalable infrastructure'
      },
      with: {
        title: 'WITH DOCKER SWARM',
        items: [
          'Manage hundreds of servers from one CLI',
          'Self-healing (crashed containers automatically restart)',
          'Built-in overlay networking and load balancing',
          'Native rolling updates with zero downtime'
        ],
        outcome: '🕸️ Resilient, automated, multi-node clustering'
      }
    },
    blockDiagram: {
      title: 'Docker Swarm Architecture',
      subtitle: 'Manager and Worker Nodes',
      nodes: [
        {
          id: 'manager-node',
          label: 'Manager Node',
          simpleDef: 'The boss server making decisions.',
          techDef: 'Maintains cluster state via Raft consensus and schedules tasks.',
          badge: 'Control',
          color: '#38bdf8'
        },
        {
          id: 'worker-node',
          label: 'Worker Node',
          simpleDef: 'The worker bee running the containers.',
          techDef: 'Executes containers (tasks) dispatched by the manager.',
          badge: 'Compute',
          color: '#4ade80'
        },
        {
          id: 'overlay-network',
          label: 'Overlay Network',
          simpleDef: 'A magical private network connecting all servers.',
          techDef: 'VXLAN-based multi-host network encrypting traffic between nodes.',
          badge: 'Network',
          color: '#facc15'
        }
      ]
    },
    terms: [
      {
        term: 'Manager Node',
        simple: 'The leader server that manages the cluster.',
        technical: 'A node that performs orchestration and cluster management functions using the Raft consensus algorithm.',
        analogy: 'The air traffic controller.',
        related: ['Raft', 'Worker Node']
      },
      {
        term: 'Service',
        simple: 'The Swarm equivalent of a container, but scalable.',
        technical: 'The definition of a desired state for a microservice, including image, ports, and replica count.',
        analogy: 'A franchise blueprint used to open multiple restaurant locations.',
        related: ['Task', 'Replica']
      },
      {
        term: 'Routing Mesh',
        simple: 'A feature that routes traffic to your app no matter which server receives the request.',
        technical: 'An ingress network that publishes a port on every node and load balances requests to active containers.',
        analogy: 'A hotel front desk that routes your call to the right room, no matter which entrance you used.',
        related: ['Ingress', 'Load Balancing']
      }
    ],
    whenToUse: [
      '✓ When you need multi-server redundancy without Kubernetes complexity',
      '✓ Managing small to medium on-premise deployments',
      '✓ When your team already knows Docker Compose (Swarm uses similar YAML)',
      '✓ Edge computing environments with limited resources'
    ],
    whenNotToUse: [
      '✕ Large enterprise cloud deployments (Kubernetes is the industry standard)',
      '✕ When you need advanced service mesh features (Istio/Linkerd)',
      '✕ If you rely heavily on massive cloud-provider managed ecosystems'
    ],
    developerScenario: {
      title: 'The Midnight Server Crash',
      setup: 'A company runs an API on 3 standalone Docker servers. At 2 AM, the primary server experiences a catastrophic hardware failure.',
      problem: 'Without Swarm, the 33% of traffic routed to that server drops completely. The engineer gets woken up and has to manually start containers on the backup servers.',
      solution: 'With Docker Swarm, the Manager Node detects the server loss in seconds. It automatically reschedules the dead containers onto the remaining 2 healthy servers. The engineer sleeps through the night.'
    },
    internalFlow: [
      { step: 1, title: 'Service Creation', desc: 'Admin runs "docker service create --replicas 3".', why: 'Declares the desired state.', techDetail: 'API request to Manager Node' },
      { step: 2, title: 'Scheduling', desc: 'Manager determines which nodes have capacity.', why: 'Distributes workload efficiently.', techDetail: 'Swarm scheduler algorithm' },
      { step: 3, title: 'Task Dispatch', desc: 'Manager sends tasks to 3 Worker nodes.', why: 'Instructs workers to start containers.', techDetail: 'gRPC communication' },
      { step: 4, title: 'Container Execution', desc: 'Workers pull the image and start the containers.', why: 'Fulfills the desired state.', techDetail: 'containerd executes runc' },
      { step: 5, title: 'State Reconciliation', desc: 'Manager continuously monitors the cluster.', why: 'Ensures 3 replicas are ALWAYS running.', techDetail: 'Raft state comparison loop' }
    ],
    commonMistakes: [
      {
        mistake: 'Using basic "docker run" on a Swarm node.',
        whyWrong: '"docker run" creates a standalone container that Swarm does NOT manage, monitor, or heal.',
        correctWay: 'Always use "docker service create" or "docker stack deploy" to utilize Swarm orchestration.'
      },
      {
        mistake: 'Only having one Manager Node.',
        whyWrong: 'If the single Manager Node crashes, the cluster loses its brain and cannot update or recover services.',
        correctWay: 'Deploy 3 or 5 Manager Nodes for high availability (fault tolerance).'
      }
    ],
    recapChecklist: [
      'Docker Swarm turns multiple servers into a single cohesive cluster.',
      'Manager nodes make decisions; Worker nodes run the workloads.',
      'Swarm provides self-healing, scaling, and rolling updates out of the box.',
      'The Routing Mesh ensures traffic reaches your app regardless of which node receives the request.'
    ],
    challenge: {
      question: 'In a Docker Swarm cluster, what feature allows a user to access a web service by hitting the IP address of a node that is NOT currently running a container for that service?',
      options: [
        { label: 'The Ingress Routing Mesh', isCorrect: true, explanation: 'Correct! The Routing Mesh intercepts the request and internally load balances it to a node that IS running the container.' },
        { label: 'Docker Compose', isCorrect: false, explanation: 'Incorrect. Compose is for local multi-container development.' },
        { label: 'The Raft Consensus Algorithm', isCorrect: false, explanation: 'Incorrect. Raft is used for manager node database synchronization, not network routing.' }
      ]
    },
    sandbox: {
      initialCommands: ['docker info'],
      guidedSteps: [
        { instruction: 'Initialize Docker Swarm on this node', command: 'docker swarm init', hint: 'Run docker swarm init' },
      ],
      targetTask: 'Initialize a single-node Docker Swarm cluster.',
      solutionCommands: ['docker swarm init'],
    },

    reference: {
      syntaxCheatSheet: [
        'docker swarm init                      # Initialize Swarm',
        'docker service create --replicas [N]   # Create service',
        'docker service ls                      # List services',
        'docker stack deploy -c [FILE] [NAME]   # Deploy stack',
      ],
    },
  },

  'c-kubernetes-intro': {
    id: 'c-kubernetes-intro',
    command: 'kubectl apply -f',
    title: 'Kubernetes Integration',
    topicId: 'topic-14',
    topicNumber: '14',
    topicTitle: 'Deploying Containers',
    subtitle: 'Transitioning from Docker containers to Kubernetes Pods, Deployments, and Services.',
    badges: ['Advanced', 'Kubernetes', 'Orchestration'],
    quote: 'Kubernetes is the industry-standard container orchestrator for large-scale enterprise cloud applications.',
    difficulty: 'Advanced',

    whatIsIt:
      'Kubernetes (K8s) is an open-source container orchestration system for automating application deployment, scaling, and management. Docker containers run inside Kubernetes abstractions called **Pods**.',
    inSimpleWords:
      'If Docker builds the containers, Kubernetes is the airport air traffic control tower that manages thousands of container planes landing, taking off, and routing traffic globally.',
    whyDoYouNeedIt:
      'Industry standard for enterprise container orchestration, multi-cloud deployments, automated horizontal pod autoscaling (HPA), and complex service meshes.',
    realWorldAnalogy:
      'An automated megacity traffic management system controlling thousands of autonomous vehicles.',

    syntaxCode: 'kubectl apply -f deployment.yaml\nkubectl get pods',
    syntaxTokens: [
      { token: 'kubectl apply -f', role: 'Command', explanation: 'Applies declarative YAML manifest to Kubernetes API control plane.' },
      { token: 'kubectl get pods', role: 'Command', explanation: 'Lists active Pod container instances in cluster.' },
    ],

    actionStage: {
      before: {
        label: 'Docker Container Image',
        description: 'Docker image built and stored in registry.',
        stateBadge: 'Image Blueprint',
        details: ['Image: user/app:v1.0'],
      },
      running: {
        label: 'Kubernetes Control Plane Deployment',
        description: 'Kube-scheduler assigns Pod to Node; Kubelet uses containerd runtime to pull and run container.',
        stateBadge: 'K8s Scheduling',
        details: ['Deployment manifest submitted', 'Kubelet pulling image', 'Pod running'],
      },
      after: {
        label: 'Self-Healing K8s Deployment',
        description: 'Pods running under ReplicaSet control with ClusterIP service routing.',
        stateBadge: 'K8s Operational',
        details: ['Autoscaling active', 'Self-healing Pods', 'Ingress routing live'],
      },
    },

    variations: [
      { title: 'Check Pod Status', syntax: 'kubectl get pods -A', whatItDoes: 'Lists all pods across all namespaces' },
    ],

    scenarios: [
      {
        title: 'Pod Concept in K8s',
        question: 'What is the smallest deployable computing unit in Kubernetes that encapsulates one or more Docker containers?',
        options: [
          { label: 'A Pod', command: 'pod-unit', isCorrect: true, explanation: 'Pods enclose one or more containers that share network IP and storage volumes.' },
          { label: 'A Virtual Machine', command: 'vm-unit', isCorrect: false, explanation: 'Incorrect.' },
        ],
      },
    ],

    
    withoutVsWith: {
      without: {
        title: 'WITHOUT KUBERNETES',
        items: [
          'Scripting complex deployment logic by hand',
          'Manual integration with cloud load balancers',
          'Struggling to scale massive multi-cloud architectures',
          'Vendor lock-in to specific PaaS providers'
        ],
        outcome: '🧱 Hitting the ceiling of infrastructure scale'
      },
      with: {
        title: 'WITH KUBERNETES (K8s)',
        items: [
          'Declarative YAML configuration for everything',
          'Autoscaling based on CPU, Memory, or custom metrics',
          'Rich ecosystem of Operators and Helm charts',
          'The ultimate industry standard API for cloud infrastructure'
        ],
        outcome: '🌌 Infinite scale and extreme flexibility'
      }
    },
    blockDiagram: {
      title: 'Kubernetes Architecture',
      subtitle: 'The Control Plane and Data Plane',
      nodes: [
        {
          id: 'control-plane',
          label: 'Control Plane (API)',
          simpleDef: 'The brain of Kubernetes.',
          techDef: 'API Server, Scheduler, and Controller Manager running on master nodes.',
          badge: 'Brain',
          color: '#38bdf8'
        },
        {
          id: 'kubelet',
          label: 'Kubelet (Node Agent)',
          simpleDef: 'The manager on each server.',
          techDef: 'Node agent communicating with API and managing containerd runtime.',
          badge: 'Agent',
          color: '#4ade80'
        },
        {
          id: 'pod',
          label: 'Pod (Workload)',
          simpleDef: 'The K8s wrapper around your containers.',
          techDef: 'Smallest deployable unit containing one or more tightly coupled containers.',
          badge: 'App',
          color: '#facc15'
        }
      ]
    },
    terms: [
      {
        term: 'Pod',
        simple: 'A wrapper around one or more containers.',
        technical: 'The smallest execution unit in K8s, representing a shared network/storage namespace for containers.',
        analogy: 'A pea pod containing one or more peas (containers).',
        related: ['Container', 'Deployment']
      },
      {
        term: 'Deployment',
        simple: 'A rule stating how many Pods should be running.',
        technical: 'A controller that manages declarative updates and scaling for Pods and ReplicaSets.',
        analogy: 'A thermostat keeping a room at exactly 72 degrees.',
        related: ['ReplicaSet', 'Rolling Update']
      },
      {
        term: 'kubectl',
        simple: 'The command-line tool used to control Kubernetes.',
        technical: 'The CLI client that interacts with the Kubernetes API Server via REST over HTTP.',
        analogy: 'The remote control for your infrastructure television.',
        related: ['Manifest', 'API Server']
      }
    ],
    whenToUse: [
      '✓ Large-scale enterprise microservice architectures',
      '✓ When you need cloud-agnostic portability (AWS, GCP, Azure)',
      '✓ Heavy requirements for horizontal pod autoscaling',
      '✓ When utilizing the vast ecosystem of Helm charts (Prometheus, Grafana)'
    ],
    whenNotToUse: [
      '✕ Simple web apps or side projects (massive overkill)',
      '✕ Startups with no dedicated DevOps/SRE team',
      '✕ When managed PaaS options (Render/Cloud Run) easily cover requirements'
    ],
    developerScenario: {
      title: 'Black Friday Traffic Tsunami',
      setup: 'An e-commerce platform prepares for a massive, unpredictable spike in Black Friday traffic.',
      problem: 'Statically provisioning enough servers to handle the peak wastes thousands of dollars, and if traffic exceeds estimates, the site crashes.',
      solution: 'Using Kubernetes Horizontal Pod Autoscaler (HPA), the system detects rising CPU usage and automatically scales the web frontend from 10 Pods to 500 Pods across auto-scaling cloud nodes, then scales back to 10 when the sale ends.'
    },
    internalFlow: [
      { step: 1, title: 'Apply YAML', desc: 'Developer runs "kubectl apply -f deployment.yaml".', why: 'Submits desired state.', techDetail: 'POST request to K8s API Server' },
      { step: 2, title: 'State Stored', desc: 'API Server saves configuration to etcd.', why: 'Persists cluster state.', techDetail: 'etcd distributed key-value store' },
      { step: 3, title: 'Scheduler Assigns', desc: 'Kube-scheduler assigns the new Pods to suitable Nodes.', why: 'Finds nodes with enough CPU/RAM.', techDetail: 'Scheduler filtering and scoring' },
      { step: 4, title: 'Kubelet Reacts', desc: 'Kubelet on the target Node notices the assignment.', why: 'Prepares to run the workload.', techDetail: 'Kubelet API watch event' },
      { step: 5, title: 'Container Starts', desc: 'Kubelet instructs Docker/containerd to pull image and run Pod.', why: 'Workload is now active.', techDetail: 'CRI (Container Runtime Interface)' }
    ],
    commonMistakes: [
      {
        mistake: 'Running simple Docker CLI commands on a K8s node.',
        whyWrong: 'Kubernetes does not know about containers started manually via "docker run". They will bypass all K8s networking, scaling, and management.',
        correctWay: 'Always deploy workloads using Kubernetes YAML manifests and kubectl.'
      },
      {
        mistake: 'Assuming Pods are permanent.',
        whyWrong: 'Pods are ephemeral. They can be killed, evicted, or rescheduled at any moment by the orchestrator.',
        correctWay: 'Build stateless applications and use K8s PersistentVolumes if data must survive Pod death.'
      }
    ],
    recapChecklist: [
      'Kubernetes is the industry standard for large-scale container orchestration.',
      'Pods are the smallest unit in K8s and wrap around your Docker containers.',
      'Deployments manage Pods, ensuring the correct number are always running.',
      'Kubectl is the CLI tool used to apply YAML configurations to the cluster.'
    ],
    challenge: {
      question: 'In Kubernetes, what is the primary purpose of a "Deployment" controller?',
      options: [
        { label: 'To manage a set of identical Pods, ensuring a specific number are running and enabling rolling updates', isCorrect: true, explanation: 'Correct! Deployments manage ReplicaSets, which in turn manage the Pods.' },
        { label: 'To route external internet traffic into the cluster', isCorrect: false, explanation: 'Incorrect. Ingress controllers and Services handle network routing.' },
        { label: 'To build Docker images from source code', isCorrect: false, explanation: 'Incorrect. K8s runs images; tools like Docker or Buildah build them.' }
      ]
    },
    sandbox: {
      initialCommands: ['echo "apiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: nginx\nspec:\n  selector:\n    matchLabels:\n      app: nginx\n  template:\n    metadata:\n      labels:\n        app: nginx\n    spec:\n      containers:\n      - name: nginx\n        image: nginx:alpine" > deployment.yaml'],
      guidedSteps: [
        { instruction: 'Apply the Kubernetes Pod manifest', command: 'kubectl apply -f deployment.yaml', hint: 'Run kubectl apply -f deployment.yaml' },
      ],
      targetTask: 'Deploy a basic Pod using Kubernetes manifests.',
      solutionCommands: ['kubectl apply -f deployment.yaml'],
    },

    reference: {
      officialDocUrl: 'https://kubernetes.io/docs/',
      syntaxCheatSheet: [
        'kubectl apply -f [MANIFEST.YAML]    # Apply config',
        'kubectl get pods                    # List pods',
        'kubectl logs [POD_NAME]             # View pod logs',
      ],
    },
  },

  'c-nomad-options': {
    id: 'c-nomad-options',
    command: 'nomad job run',
    title: 'HashiCorp Nomad',
    topicId: 'topic-14',
    topicNumber: '14',
    topicTitle: 'Deploying Containers',
    subtitle: 'Flexible, lightweight workload orchestrator for containers, non-containerized legacy apps, and microservices.',
    badges: ['Advanced', 'Orchestration', 'Nomad'],
    quote: 'Nomad provides a lightweight alternative to Kubernetes that orchestrates both Docker containers and raw executables.',
    difficulty: 'Advanced',

    whatIsIt:
      'HashiCorp Nomad is a simple and flexible workload orchestrator that enables organizations to deploy and manage containerized (`docker`) and non-containerized applications (Java JARs, raw binaries) across on-prem and cloud infrastructure.',
    inSimpleWords:
      'Nomad is like a lighter, simpler version of Kubernetes. It can orchestrate Docker containers alongside old legacy applications that aren\'t in containers yet.',
    whyDoYouNeedIt:
      'Offers a single binary orchestrator with low operational complexity compared to Kubernetes.',
    realWorldAnalogy:
      'A universal logistics broker that delivers both modern standardized shipping containers and vintage loose cargo.',

    syntaxCode: 'nomad job run app.nomad\nnomad status app',
    syntaxTokens: [
      { token: 'nomad job run app.nomad', role: 'Command', explanation: 'Submits HCL job specification to Nomad cluster.' },
    ],

    actionStage: {
      before: {
        label: 'Nomad Job HCL Manifest',
        description: 'HCL file declaring Docker task driver and resource allocations.',
        stateBadge: 'Nomad HCL',
        details: ['driver = "docker"', 'config { image = "nginx:alpine" }'],
      },
      running: {
        label: 'Nomad Client Allocation',
        description: 'Nomad server schedules allocation on client node.',
        stateBadge: 'Scheduling Task',
        details: ['Evaluating job', 'Allocating resources', 'Starting task'],
      },
      after: {
        label: 'Nomad Managed Workload',
        description: 'Task running with health monitoring.',
        stateBadge: 'Nomad Task Active',
        details: ['Allocation running', 'Zero-downtime rolling updates'],
      },
    },

    variations: [
      { title: 'Check Nomad Job Status', syntax: 'nomad status', whatItDoes: 'Lists running Nomad jobs' },
    ],

    scenarios: [
      {
        title: 'Nomad Workload Flexibility',
        question: 'What is a unique capability of HashiCorp Nomad compared to Kubernetes?',
        options: [
          { label: 'Nomad can orchestrate non-containerized legacy binaries and Java JARs alongside Docker containers', command: 'nomad-flexibility', isCorrect: true, explanation: 'Nomad supports raw exec, java, and docker task drivers out of the box.' },
          { label: 'Nomad runs on Mars', command: 'mars-myth', isCorrect: false, explanation: 'Incorrect.' },
        ],
      },
    ],

    
    withoutVsWith: {
      without: {
        title: 'WITHOUT NOMAD (K8s only)',
        items: [
          'Forced to containerize every legacy application',
          'Managing complex Kubernetes control planes (etcd, API)',
          'Steep learning curve for small operational teams',
          'High resource overhead just to run the cluster'
        ],
        outcome: '🐘 Heavy, complex, and rigid architecture'
      },
      with: {
        title: 'WITH HASHICORP NOMAD',
        items: [
          'Run Docker, Java, and raw binaries on the same cluster',
          'Single static binary deployment (no complex control plane)',
          'Incredibly fast scheduling (thousands of containers/sec)',
          'Simpler operational model and lower overhead'
        ],
        outcome: '🪶 Lightweight, flexible, and blazing fast'
      }
    },
    blockDiagram: {
      title: 'Nomad Architecture',
      subtitle: 'Flexible Task Drivers',
      nodes: [
        {
          id: 'nomad-server',
          label: 'Nomad Server',
          simpleDef: 'The orchestrator making decisions.',
          techDef: 'Maintains state and performs high-speed bin-packing scheduling.',
          badge: 'Brain',
          color: '#38bdf8'
        },
        {
          id: 'nomad-client',
          label: 'Nomad Client',
          simpleDef: 'The worker node.',
          techDef: 'Executes allocations using various task drivers.',
          badge: 'Worker',
          color: '#4ade80'
        },
        {
          id: 'task-drivers',
          label: 'Task Drivers',
          simpleDef: 'Docker, Java, Raw Exec.',
          techDef: 'Pluggable execution environments for heterogeneous workloads.',
          badge: 'Runtime',
          color: '#facc15'
        }
      ]
    },
    terms: [
      {
        term: 'Job Specification',
        simple: 'A file describing what you want to run.',
        technical: 'An HCL (HashiCorp Configuration Language) file defining jobs, groups, and tasks.',
        analogy: 'A blueprint for a construction project.',
        related: ['HCL', 'Manifest']
      },
      {
        term: 'Task Driver',
        simple: 'The engine that runs a specific type of app.',
        technical: 'Plugins that execute workloads (e.g., Docker, exec, Java, QEMU).',
        analogy: 'Different types of electrical outlets for different plugs.',
        related: ['Docker', 'Exec']
      },
      {
        term: 'Allocation',
        simple: 'A specific instance of your app running on a server.',
        technical: 'The mapping of a task group to a specific Nomad client node (similar to a K8s Pod).',
        analogy: 'A specific assigned seat on an airplane.',
        related: ['Pod', 'Instance']
      }
    ],
    whenToUse: [
      '✓ When you need to orchestrate mixed workloads (Containers + Legacy Binaries)',
      '✓ Edge computing with constrained resource environments',
      '✓ Teams who prefer HashiCorp tools (Terraform, Consul, Vault)',
      '✓ When Kubernetes is too operationally complex for your team size'
    ],
    whenNotToUse: [
      '✕ If you require the massive vendor-supported ecosystem of Kubernetes',
      '✕ When relying on off-the-shelf Helm charts for complex third-party software',
      '✕ If "cloud native standard" compliance is a strict corporate requirement'
    ],
    developerScenario: {
      title: 'The Legacy Migration',
      setup: 'A company has 50 modern Docker microservices and 1 massive, fragile 15-year-old Java application that cannot be containerized without breaking.',
      problem: 'Migrating to Kubernetes means they must somehow force the Java app into a container, delaying the project by 8 months.',
      solution: 'They deploy HashiCorp Nomad. Nomad seamlessly orchestrates the 50 Docker containers using the "docker" driver, and natively manages the raw Java application alongside them using the "java" driver. Project completed in 2 weeks.'
    },
    internalFlow: [
      { step: 1, title: 'Submit Job', desc: 'User runs "nomad job run".', why: 'Sends HCL specification to server.', techDetail: 'CLI parses HCL to JSON API call' },
      { step: 2, title: 'Evaluation', desc: 'Nomad server evaluates cluster state.', why: 'Determines what needs to change.', techDetail: 'Evaluation broker creates plan' },
      { step: 3, title: 'Scheduling', desc: 'Scheduler performs bin-packing.', why: 'Finds optimal nodes for workloads.', techDetail: 'Optimistic concurrency scheduling' },
      { step: 4, title: 'Allocation', desc: 'Server sends allocation to Client.', why: 'Assigns the work.', techDetail: 'Client agent receives mandate' },
      { step: 5, title: 'Execution', desc: 'Client uses Task Driver (Docker) to start workload.', why: 'Application runs.', techDetail: 'Nomad Client calls Docker API' }
    ],
    commonMistakes: [
      {
        mistake: 'Assuming Nomad is just for Docker.',
        whyWrong: 'Nomad\'s superpower is its heterogeneous task drivers. Limiting it to only Docker ignores its massive advantage over K8s for legacy apps.',
        correctWay: 'Use Nomad to orchestrate raw binaries (exec), Java, and VMs alongside containers.'
      },
      {
        mistake: 'Using JSON instead of HCL.',
        whyWrong: 'While Nomad supports JSON, HashiCorp Configuration Language (HCL) is much easier to read, write, and template.',
        correctWay: 'Always write Nomad jobs in standard HCL (.nomad files).'
      }
    ],
    recapChecklist: [
      'Nomad is a lightweight, single-binary alternative to Kubernetes.',
      'Nomad can orchestrate Docker containers AND non-containerized legacy apps.',
      'Jobs are written in HCL (HashiCorp Configuration Language).',
      'Nomad integrates perfectly with Consul (networking) and Vault (secrets).'
    ],
    challenge: {
      question: 'What is a major architectural capability that HashiCorp Nomad possesses that Kubernetes natively lacks?',
      options: [
        { label: 'The ability to natively orchestrate non-containerized legacy binaries and Java applications via Task Drivers', isCorrect: true, explanation: 'Correct! Nomad uses pluggable task drivers to manage raw execs, Java, and QEMU alongside Docker.' },
        { label: 'The ability to run containers across multiple servers', isCorrect: false, explanation: 'Incorrect. Both Nomad and K8s can run containers across multiple servers.' },
        { label: 'The ability to use YAML files', isCorrect: false, explanation: 'Incorrect. K8s heavily uses YAML; Nomad typically uses HCL.' }
      ]
    },
    sandbox: {
      initialCommands: ['echo \'job "web" { datacenters = ["dc1"] group "api" { task "server" { driver = "docker" config { image = "nginx:alpine" } } } }\' > webapp.nomad'],
      guidedSteps: [
        { instruction: 'Submit the job to HashiCorp Nomad', command: 'nomad job run webapp.nomad', hint: 'Run nomad job run webapp.nomad' },
      ],
      targetTask: 'Deploy a Docker container using a Nomad job specification.',
      solutionCommands: ['nomad job run webapp.nomad'],
    },

    reference: {
      officialDocUrl: 'https://www.nomadproject.io/',
      syntaxCheatSheet: [
        'nomad job run [JOB.NOMAD]    # Run Nomad job',
        'nomad status                # View cluster jobs',
      ],
    },
  },
};
