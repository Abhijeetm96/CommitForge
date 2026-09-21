import { UniversalDockerConcept } from './unifiedDockerData';

/**
 * Ensures that EVERY concept passed to ConceptTeachingEngine has full, rich, 18-step teaching data.
 * If static concept data lacks extended fields, this enriches them with concept-specific defaults.
 */
export function ensureFullConceptData(concept: UniversalDockerConcept): UniversalDockerConcept {
  const title = concept.title || 'Docker Concept';
  const cmd = concept.command || 'docker run';

  // 1. Without vs With
  const withoutVsWith = concept.withoutVsWith || {
    without: {
      title: `WITHOUT ${title.toUpperCase()}`,
      items: [
        'Manual setup and version conflicts across team machines',
        'Global system file pollution and dependency drift',
        'Inconsistent execution environments between local dev and cloud',
        'Difficult troubleshooting when production crashes',
      ],
      outcome: '💥 Environment bugs, deployment delays, and "works on my machine" errors',
    },
    with: {
      title: `WITH ${title.toUpperCase()}`,
      items: [
        'Standardized declarative configuration and portable execution',
        'Complete isolation of binaries, packages, and network ports',
        'Instant startup and 100% reproducible builds everywhere',
        'Clean uninstallation with zero host residue',
      ],
      outcome: `📦 Reliable, scalable, and isolated ${title} workflow`,
    },
  };

  // 2. Block Diagram
  const blockDiagram = concept.blockDiagram || {
    title: `${title} Architecture & System Boundary`,
    subtitle: 'Click any component below to inspect simple and technical definitions:',
    nodes: [
      {
        id: 'host-layer',
        label: 'Host OS & Docker Engine',
        simpleDef: 'The underlying computer operating system and Docker daemon service.',
        techDef: 'Host Linux kernel providing syscalls, cgroups v2, and Overlay2 storage driver.',
        badge: 'Host System',
        color: '#38bdf8',
      },
      {
        id: 'concept-boundary',
        label: `${title} Layer`,
        simpleDef: `The isolated runtime boundary managed by ${cmd}.`,
        techDef: `Isolated user-space process primitives configured for ${title}.`,
        badge: 'Docker Layer',
        color: '#4ade80',
      },
      {
        id: 'app-layer',
        label: 'Application Runtime & Files',
        simpleDef: 'Your source code, binaries, configuration, and dependencies.',
        techDef: 'Mounted rootfs layer stacked on read-only OCI image layers.',
        badge: 'Application',
        color: '#facc15',
      },
    ],
  };

  // 3. Terminology
  const terms = concept.terms && concept.terms.length > 0 ? concept.terms : [
    {
      term: title,
      simple: concept.whatIsIt || `A core Docker feature enabling ${title.toLowerCase()}.`,
      technical: concept.quote || `Technical implementation of ${title} within the Docker Engine architecture.`,
      analogy: concept.realWorldAnalogy || 'A modular building block in a standardized system.',
      related: ['Docker Daemon', 'Container', 'Image'],
    },
    {
      term: 'Docker CLI',
      simple: 'The command-line tool you use to talk to Docker.',
      technical: 'The REST API client issuing requests over unix socket /var/run/docker.sock.',
      analogy: 'The remote control for your TV.',
      related: ['dockerd', 'socket'],
    },
    {
      term: 'Docker Engine',
      simple: 'The background service running on your computer that does the actual work.',
      technical: 'The daemon (dockerd) managing container lifecycles, images, networks, and volumes.',
      analogy: 'The engine under the hood of a car.',
      related: ['containerd', 'runc'],
    },
  ];

  // 4. Syntax Tokens
  const syntaxTokens = concept.syntaxTokens && concept.syntaxTokens.length > 0 ? concept.syntaxTokens : [
    { token: 'docker', role: 'CLI Tool', explanation: 'The Docker Command-Line Interface binary.' },
    { token: cmd.split(' ')[1] || 'run', role: 'Command', explanation: `The primary subcommand to perform ${title}.` },
    { token: '-d', role: 'Flag', explanation: 'Runs the process in background (detached) mode.' },
    { token: 'target:latest', role: 'Target', explanation: 'The image or resource targeted by this command.' },
  ];

  // 5. Syntax Variations
  const variations = concept.variations && concept.variations.length > 0 ? concept.variations : [
    {
      title: 'Standard Execution',
      syntax: cmd,
      whatItDoes: `Executes ${title} with default runtime parameters.`,
      whenToUse: 'General development and standard command execution.',
    },
    {
      title: 'Detached Background Run',
      syntax: `${cmd} -d`,
      whatItDoes: 'Runs the process silently in the background.',
      whenToUse: 'Running background servers and long-running tasks.',
    },
    {
      title: 'Explicit Named Target',
      syntax: `${cmd} --name active-${concept.topicNumber || '01'}`,
      whatItDoes: 'Assigns a predictable human-readable identifier.',
      whenToUse: 'Automation scripts and container references.',
    },
  ];

  // 6. When / When Not To Use
  const whenToUse = concept.whenToUse && concept.whenToUse.length > 0 ? concept.whenToUse : [
    `✓ When implementing ${title} in isolated development workflows`,
    '✓ When ensuring 100% reproducible application behavior across environments',
    '✓ When running microservices and background services without host pollution',
    '✓ Continuous Integration (CI) and build automation pipelines',
  ];

  const whenNotToUse = concept.whenNotToUse && concept.whenNotToUse.length > 0 ? concept.whenNotToUse : [
    '✕ When you attempt to persist data without mounting a dedicated Docker Volume',
    '✕ When running legacy GUI applications requiring direct bare-metal GPU access',
    '✕ When confusing stopping a process with removing its disk state',
  ];

  // 7. Developer Scenario
  const developerScenario = concept.developerScenario || {
    title: `Developer Scenario: Harnessing ${title}`,
    setup: 'A engineering team collaborates across Windows, macOS, and Linux laptops.',
    problem: 'Each developer installs different package versions, leading to broken builds and deployment crashes.',
    solution: `The team adopts ${title} via Docker. Now every developer runs identical commands with zero drift.`,
  };

  // 8. Internal Flow Steps
  const internalFlow = concept.internalFlow && concept.internalFlow.length > 0 ? concept.internalFlow : [
    {
      step: 1,
      title: 'CLI Command Dispatch',
      desc: 'Docker CLI validates flags and serializes command into REST payload.',
      why: 'Translates terminal text into API payload.',
      techDetail: 'POST /v1.43/containers/create or engine endpoint',
    },
    {
      step: 2,
      title: 'Daemon socket Authentication',
      desc: 'Docker Daemon (dockerd) receives request via /var/run/docker.sock.',
      why: 'Verifies authorization and system state.',
      techDetail: 'UNIX domain socket RPC handshake',
    },
    {
      step: 3,
      title: 'Resource Allocation',
      desc: 'Daemon checks local image store and allocates container memory/PID limits.',
      why: 'Prepares isolated execution boundary.',
      techDetail: 'Overlay2 rootfs mount & cgroup allocation',
    },
    {
      step: 4,
      title: 'Namespace Isolation',
      desc: 'Kernel initializes PID, Net, Mount, and IPC namespaces.',
      why: 'Isolates container process from host machine processes.',
      techDetail: 'Linux unshare() and clone() syscall flags',
    },
    {
      step: 5,
      title: 'Network & Port Binding',
      desc: 'Daemon creates virtual eth interface and attaches iptables rules.',
      why: 'Enables network connectivity.',
      techDetail: 'veth pair creation & DNAT rules',
    },
    {
      step: 6,
      title: 'Process Execution (ACTIVE)',
      desc: 'Container runtime (runc) executes entrypoint command.',
      why: 'Application is active and running isolated.',
      techDetail: 'runc start container_id',
    },
  ];

  // 9. Common Mistakes
  const commonMistakes = concept.commonMistakes && concept.commonMistakes.length > 0 ? concept.commonMistakes : [
    {
      mistake: `Misunderstanding the scope of ${title}.`,
      whyWrong: 'Assuming Docker containers behave like heavy Virtual Machines with separate kernels.',
      correctWay: 'Remember containers share the host Linux kernel for instant execution.',
    },
    {
      mistake: 'Forgetting to publish ports or detach background runs.',
      whyWrong: 'Running web apps in foreground locks the terminal and leaves ports inaccessible.',
      correctWay: 'Use -d to detach and -p host_port:container_port to expose services.',
    },
  ];

  // 10. Recap & Challenge
  const recapChecklist = concept.recapChecklist && concept.recapChecklist.length > 0 ? concept.recapChecklist : [
    `${title} provides an isolated, portable runtime environment.`,
    'Docker CLI communicates with dockerd daemon over unix sockets.',
    'Containers start in milliseconds by sharing the host OS kernel.',
    'Always use explicit flags (-d, -p, --name) for predictable container management.',
  ];

  const challenge = concept.challenge || {
    question: `What is the main advantage of utilizing ${title} in Docker?`,
    options: [
      { label: 'Guaranteed identical and isolated execution across all environments', isCorrect: true, explanation: 'Correct! Docker guarantees consistent behavior across Mac, Windows, Linux, and Cloud.' },
      { label: 'Requires installing full operating system kernels inside each container', isCorrect: false, explanation: 'Incorrect. Containers share the host kernel, making them lightweight.' },
      { label: 'Deletes all application code when stopped', isCorrect: false, explanation: 'Incorrect. Code remains intact inside image and volume layers.' },
    ],
  };

  return {
    ...concept,
    whatIsIt: concept.whatIsIt || `A core Docker capability allowing developers to master ${title}.`,
    inSimpleWords: concept.inSimpleWords || `Think of ${title} as an easy way to bundle and manage your app isolated on your computer.`,
    whyDoYouNeedIt: concept.whyDoYouNeedIt || `Without ${title}, software development suffers from version conflicts and deployment bugs.`,
    realWorldAnalogy: concept.realWorldAnalogy || 'A standardized plug and socket system that works anywhere in the world.',
    syntaxCode: concept.syntaxCode || `${cmd} -d`,
    syntaxTokens,
    withoutVsWith,
    blockDiagram,
    terms,
    variations,
    whenToUse,
    whenNotToUse,
    developerScenario,
    internalFlow,
    commonMistakes,
    recapChecklist,
    challenge,
  };
}
