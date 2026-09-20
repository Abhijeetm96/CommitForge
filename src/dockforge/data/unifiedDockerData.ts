export type ConceptDifficulty = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';

export interface SyntaxToken {
  token: string;
  role: string;
  explanation: string;
}

export interface ConceptVariation {
  syntax?: string;
  title: string;
  whatItDoes?: string;
  whenToUse?: string;
  whenNotToUse?: string;
  example?: string;
  warning?: string;
  flag?: string;
  desc?: string;
  snippet?: string;
}

export interface ScenarioQuestion {
  id?: string;
  title: string;
  context?: string;
  question?: string;
  options?: {
    label: string;
    command: string;
    isCorrect: boolean;
    explanation: string;
  }[];
  whenToUse?: string;
  commandExample?: string;
  note?: string;
}

export interface UniversalDockerConcept {
  id: string;
  command: string;
  title: string;
  topicId: string;
  topicNumber: string;
  topicTitle: string;
  subtitle: string;
  badges: string[];
  quote: string;
  difficulty: ConceptDifficulty;

  // Level 1: Understand
  whatIsIt: string;
  inSimpleWords: string;
  whyDoYouNeedIt: string;
  realWorldAnalogy: string;

  // Level 2: Syntax
  syntaxCode: string;
  syntaxTokens: SyntaxToken[];

  // Level 3: See it in action
  actionStage: {
    before: {
      label: string;
      description: string;
      stateBadge: string;
      details: string[];
    };
    running: {
      label: string;
      description: string;
      stateBadge: string;
      details: string[];
    };
    after: {
      label: string;
      description: string;
      stateBadge: string;
      details: string[];
    };
  };

  // Level 4: Explore
  variations: ConceptVariation[];
  scenarios: ScenarioQuestion[];

  // Level 5: Practice & Sandbox
  sandbox: {
    initialCommands: string[];
    guidedSteps: {
      instruction: string;
      command: string;
      hint: string;
    }[];
    targetTask?: string;
    solutionCommands?: string[];
  };

  // Level 6: Reference
  reference: {
    officialDocUrl?: string;
    syntaxCheatSheet?: string[];
    commonErrors?: { error: string; remedy: string }[];
    options?: { flag: string; description: string }[];
    bestPractices?: string[];
  };
}

export interface DockerTopic {
  id: string;
  number: string;
  title: string;
  description: string;
  iconName: string;
  conceptCount: number;
  concepts: {
    id: string;
    command: string;
    title: string;
    shortDesc: string;
    difficulty: ConceptDifficulty;
  }[];
}

// ============================================================================
// DOCKER ROADMAP 14 TOPICS SYLLABUS
// ============================================================================
export const DOCKER_14_TOPICS: DockerTopic[] = [
  {
    id: 'topic-01',
    number: '01',
    title: 'Introduction to Containers',
    description: 'Understand containerization fundamentals, VM comparisons, and the OCI standard.',
    iconName: 'Box',
    conceptCount: 4,
    concepts: [
      { id: 'c-what-are-containers', command: 'docker info', title: 'What are Containers?', shortDesc: 'Isolated user-space processes', difficulty: 'Beginner' },
      { id: 'c-why-need-containers', command: 'docker run', title: 'Why do we need Containers?', shortDesc: 'Eliminating "works on my machine" syndrome', difficulty: 'Beginner' },
      { id: 'c-baremetal-vm-containers', command: 'docker stats', title: 'Bare Metal vs VMs vs Containers', shortDesc: 'Hypervisors vs OS-level virtualization', difficulty: 'Beginner' },
      { id: 'c-docker-and-oci', command: 'docker version', title: 'Docker and OCI', shortDesc: 'Open Container Initiative & runc specifications', difficulty: 'Beginner' },
    ],
  },
  {
    id: 'topic-02',
    number: '02',
    title: 'Underlying Linux Technologies',
    description: 'Kernel building blocks: Linux Namespaces, cgroups v1/v2, and Copy-on-Write UnionFS.',
    iconName: 'Cpu',
    conceptCount: 3,
    concepts: [
      { id: 'c-linux-namespaces', command: 'unshare --pid', title: 'Namespaces', shortDesc: 'Process, Network, Mount & IPC isolation', difficulty: 'Intermediate' },
      { id: 'c-cgroups', command: 'cgget -r memory', title: 'cgroups (Control Groups)', shortDesc: 'CPU, Memory, and I/O resource quota control', difficulty: 'Intermediate' },
      { id: 'c-union-filesystems', command: 'mount -t overlay', title: 'Union Filesystems (Overlay2)', shortDesc: 'Read-only image layers + writeable container layer', difficulty: 'Intermediate' },
    ],
  },
  {
    id: 'topic-03',
    number: '03',
    title: 'Installation / Setup',
    description: 'Installing Docker Desktop on Windows/Mac/Linux and configuring Linux Docker Engine.',
    iconName: 'Download',
    conceptCount: 2,
    concepts: [
      { id: 'c-docker-desktop', command: 'docker desktop', title: 'Docker Desktop (Win/Mac/Linux)', shortDesc: 'GUI dashboard, WSL2 engine, & VM helper', difficulty: 'Beginner' },
      { id: 'c-docker-engine-linux', command: 'systemctl status docker', title: 'Docker Engine (Linux)', shortDesc: 'dockerd, containerd, and socket permissions', difficulty: 'Beginner' },
    ],
  },
  {
    id: 'topic-04',
    number: '04',
    title: 'Basics of Docker',
    description: 'Master container execution, interactive TTY sessions, detached runs, and process termination.',
    iconName: 'Play',
    conceptCount: 4,
    concepts: [
      { id: 'c-docker-run-basic', command: 'docker run -d', title: 'Running Containers', shortDesc: 'Create & start containers in detached mode', difficulty: 'Beginner' },
      { id: 'c-docker-exec', command: 'docker exec -it', title: 'Interactive Shells (docker exec)', shortDesc: 'Inspect live container shell environments', difficulty: 'Beginner' },
      { id: 'c-docker-stop-start', command: 'docker stop', title: 'Stopping & Starting Containers', shortDesc: 'SIGTERM vs SIGKILL container lifecycle', difficulty: 'Beginner' },
      { id: 'c-docker-rm', command: 'docker rm -f', title: 'Removing Containers', shortDesc: 'Cleaning up exited and dead container instances', difficulty: 'Beginner' },
    ],
  },
  {
    id: 'topic-05',
    number: '05',
    title: 'Data Persistence',
    description: 'Persisting data beyond container lifecycles using Docker Volumes and Bind Mounts.',
    iconName: 'Database',
    conceptCount: 3,
    concepts: [
      { id: 'c-ephemeral-filesystem', command: 'docker diff', title: 'Ephemeral Container Filesystem', shortDesc: 'Why changes die when containers exit', difficulty: 'Beginner' },
      { id: 'c-volume-mounts', command: 'docker volume create', title: 'Volume Mounts', shortDesc: 'Managed persistence in Docker storage directory', difficulty: 'Intermediate' },
      { id: 'c-bind-mounts', command: 'docker run -v $(pwd):/app', title: 'Bind Mounts', shortDesc: 'Mapping host directory to container path', difficulty: 'Intermediate' },
    ],
  },
  {
    id: 'topic-06',
    number: '06',
    title: 'Using 3rd Party Container Images',
    description: 'Spinning up official databases, web servers, and CLI utilities from Docker Hub.',
    iconName: 'Package',
    conceptCount: 2,
    concepts: [
      { id: 'c-running-databases', command: 'docker run -e POSTGRES_PASSWORD=...', title: 'Database Containers', shortDesc: 'PostgreSQL, Redis, and Mongo containerization', difficulty: 'Beginner' },
      { id: 'c-cli-utilities', command: 'docker run --rm -it alpine', title: 'Command Line Utilities', shortDesc: 'One-off diagnostic scripts in disposable containers', difficulty: 'Beginner' },
    ],
  },
  {
    id: 'topic-07',
    number: '07',
    title: 'Building Container Images',
    description: 'Writing optimal Dockerfiles, multi-stage builds, layer caching, and slim base images.',
    iconName: 'Hammer',
    conceptCount: 3,
    concepts: [
      { id: 'c-dockerfiles', command: 'docker build -t app .', title: 'Dockerfiles & Instructions', shortDesc: 'FROM, RUN, COPY, WORKDIR, CMD, ENTRYPOINT', difficulty: 'Intermediate' },
      { id: 'c-layer-caching', command: 'docker build --build-arg', title: 'Efficient Layer Caching', shortDesc: 'Ordering Dockerfile steps to minimize build times', difficulty: 'Intermediate' },
      { id: 'c-image-size-security', command: 'FROM scratch', title: 'Image Size & Multi-Stage Builds', shortDesc: 'Distroless, Alpine & production artifacts', difficulty: 'Advanced' },
    ],
  },
  {
    id: 'topic-08',
    number: '08',
    title: 'Container Registries',
    description: 'Pushing, pulling, tagging, and managing image distribution across registries.',
    iconName: 'Cloud',
    conceptCount: 3,
    concepts: [
      { id: 'c-dockerhub', command: 'docker push', title: 'Docker Hub & Login', shortDesc: 'Authentication and image publishing', difficulty: 'Beginner' },
      { id: 'c-image-tagging', command: 'docker tag app:v1.0', title: 'Image Tagging Best Practices', shortDesc: 'Semantic versioning vs latest vs git SHA', difficulty: 'Intermediate' },
      { id: 'c-cloud-registries', command: 'docker login ghcr.io', title: 'Private & Cloud Registries', shortDesc: 'GHCR, AWS ECR, GCP GCR, and Azure ACR', difficulty: 'Intermediate' },
    ],
  },
  {
    id: 'topic-09',
    number: '09',
    title: 'Runtime Configuration & Compose',
    description: 'Managing complex container options and orchestrating multi-container services with Docker Compose.',
    iconName: 'Sliders',
    conceptCount: 2,
    concepts: [
      { id: 'c-docker-run-flags', command: 'docker run --restart=always', title: 'docker run Configuration Options', shortDesc: 'Port mapping, env files, and restart policies', difficulty: 'Intermediate' },
      { id: 'c-docker-compose', command: 'docker compose up -d', title: 'docker compose Orchestration', shortDesc: 'Multi-service YAML manifest & service linking', difficulty: 'Intermediate' },
    ],
  },
  {
    id: 'topic-10',
    number: '10',
    title: 'Running & Managing Containers',
    description: 'Monitoring real-time container metrics, logs, process trees, and inspection JSON.',
    iconName: 'Activity',
    conceptCount: 2,
    concepts: [
      { id: 'c-container-logs', command: 'docker logs -f --tail 100', title: 'Container Logs & Streaming', shortDesc: 'stdout/stderr capture & logging drivers', difficulty: 'Beginner' },
      { id: 'c-container-inspect-stats', command: 'docker inspect', title: 'Inspection & Process Stats', shortDesc: 'docker inspect JSON and docker stats live stream', difficulty: 'Intermediate' },
    ],
  },
  {
    id: 'topic-11',
    number: '11',
    title: 'Docker CLI Mastery',
    description: 'Complete breakdown of Images, Containers, Volumes, and Bridge Networks.',
    iconName: 'Terminal',
    conceptCount: 4,
    concepts: [
      { id: 'c-cli-images', command: 'docker image prune', title: 'Docker CLI: Images', shortDesc: 'Listing, inspecting, pruning & tag management', difficulty: 'Beginner' },
      { id: 'c-cli-containers', command: 'docker ps -a', title: 'Docker CLI: Containers', shortDesc: 'Lifecycle status, stop, start, kill, & prune', difficulty: 'Beginner' },
      { id: 'c-cli-volumes', command: 'docker volume prune', title: 'Docker CLI: Volumes', shortDesc: 'Named volume creation, inspect, and storage cleanup', difficulty: 'Intermediate' },
      { id: 'c-cli-networks', command: 'docker network connect', title: 'Docker CLI: Networks', shortDesc: 'Bridge, host, overlay networks & DNS resolution', difficulty: 'Intermediate' },
    ],
  },
  {
    id: 'topic-12',
    number: '12',
    title: 'Container Security',
    description: 'Hardening images, non-root users, CVE vulnerability scanning, and security profiles.',
    iconName: 'ShieldCheck',
    conceptCount: 2,
    concepts: [
      { id: 'c-image-security', command: 'trivy image', title: 'Image Security & Vulnerability Scanning', shortDesc: 'Scanning base OS layers for CVE vulnerabilities', difficulty: 'Advanced' },
      { id: 'c-runtime-security', command: 'docker run --read-only', title: 'Runtime Security Hardening', shortDesc: 'Non-root USER, read-only rootfs & drop capabilities', difficulty: 'Advanced' },
    ],
  },
  {
    id: 'topic-13',
    number: '13',
    title: 'Developer Experience',
    description: 'Improving feedback loops: hot reloading, remote debugging, containerized unit tests, and CI/CD.',
    iconName: 'Zap',
    conceptCount: 4,
    concepts: [
      { id: 'c-hot-reloading', command: 'docker compose watch', title: 'Hot Reloading in Containers', shortDesc: 'Syncing local source code with live containers', difficulty: 'Intermediate' },
      { id: 'c-container-debuggers', command: 'docker exec -it sh', title: 'Debuggers & Interactive Exec', shortDesc: 'Attaching node/python debuggers inside containers', difficulty: 'Intermediate' },
      { id: 'c-container-tests', command: 'docker run --rm app npm test', title: 'Running Automated Tests', shortDesc: 'Isolated test runners in disposable containers', difficulty: 'Intermediate' },
      { id: 'c-continuous-integration', command: 'docker buildx build', title: 'Continuous Integration (CI/CD)', shortDesc: 'GitHub Actions container build & cache pipelines', difficulty: 'Advanced' },
    ],
  },
  {
    id: 'topic-14',
    number: '14',
    title: 'Deploying Containers',
    description: 'From single containers to production orchestrators: PaaS, Swarm, Kubernetes & Nomad.',
    iconName: 'Server',
    conceptCount: 4,
    concepts: [
      { id: 'c-paas-options', command: 'deploy container', title: 'PaaS Options (Render/Fly.io/AWS ECS)', shortDesc: 'Simple cloud container deployment platforms', difficulty: 'Intermediate' },
      { id: 'c-docker-swarm', command: 'docker swarm init', title: 'Docker Swarm', shortDesc: 'Built-in Docker native clustering & services', difficulty: 'Advanced' },
      { id: 'c-kubernetes-intro', command: 'kubectl apply -f', title: 'Kubernetes Integration', shortDesc: 'Transitioning from Docker Compose to K8s Pods', difficulty: 'Advanced' },
      { id: 'c-nomad-options', command: 'nomad job run', title: 'HashiCorp Nomad', shortDesc: 'Flexible workload orchestrator for containers', difficulty: 'Advanced' },
    ],
  },
];

import { ALL_DOCKER_CONCEPTS } from './dockerTopics';

// ============================================================================
// DETAILED UNIVERSAL CONCEPTS MAP
// ============================================================================
export const DOCKER_UNIVERSAL_CONCEPTS: Record<string, UniversalDockerConcept> = ALL_DOCKER_CONCEPTS;
