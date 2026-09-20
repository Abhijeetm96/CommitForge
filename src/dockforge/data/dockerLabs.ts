export interface DockerLabScenario {
  id: string;
  title: string;
  category: 'Networking' | 'Storage' | 'Build Optimization' | 'SRE Triage';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  summary: string;
  symptom: string;
  initialTerminalLogs: string[];
  initialStateDescription: string;
  guidedSteps: {
    instruction: string;
    expectedCommand: string;
    hint: string;
    explanation: string;
  }[];
  solutionExplanation: string;
}

export const DOCKER_LAB_SCENARIOS: DockerLabScenario[] = [
  {
    id: 'lab-port-conflict',
    title: 'Incident 101: Port 8080 Bind Failure',
    category: 'Networking',
    difficulty: 'Beginner',
    summary: 'A new Nginx container fails to boot with exit code 125 because host port 8080 is already bound by an existing running container.',
    symptom: 'docker: Error response from daemon: driver failed programming external connectivity on endpoint web-service: Bind for 0.0.0.0:8080 failed: port is already allocated.',
    initialTerminalLogs: [
      '[ERROR] Failed to start container web-service',
      'docker: Error response from daemon: driver failed programming external connectivity on endpoint web-service (c-9810a7b): Bind for 0.0.0.0:8080 failed: port is already allocated.',
    ],
    initialStateDescription: 'Host port 8080 is currently occupied by container "web-frontend".',
    guidedSteps: [
      {
        instruction: 'Inspect active containers to identify which container is consuming port 8080',
        expectedCommand: 'docker ps',
        hint: 'Execute docker ps to list running containers and port mappings',
        explanation: 'docker ps displays all active containers along with host:container port bindings.',
      },
      {
        instruction: 'Stop the conflicting container "web-frontend"',
        expectedCommand: 'docker stop web-frontend',
        hint: 'Execute docker stop web-frontend',
        explanation: 'Stopping the conflicting container releases host port 8080.',
      },
      {
        instruction: 'Run your new web container on host port 8080',
        expectedCommand: 'docker run -d -p 8080:80 nginx:1.25-alpine',
        hint: 'Execute docker run -d -p 8080:80 nginx:1.25-alpine',
        explanation: 'With port 8080 freed, the new container binds cleanly.',
      },
    ],
    solutionExplanation: 'Only one process or container on a host machine can bind to a specific TCP port (0.0.0.0:8080). Always check port bindings using docker ps or use alternative host port mappings like -p 8081:80.',
  },
  {
    id: 'lab-volume-data-loss',
    title: 'Incident 102: Missing PostgreSQL Data Persistence',
    category: 'Storage',
    difficulty: 'Intermediate',
    summary: 'A developer restarted a PostgreSQL container, but all user tables disappeared because no named volume or bind mount was attached.',
    symptom: 'psql: error: FATAL: database "production_db" does not exist after container replacement.',
    initialTerminalLogs: [
      '[WARN] Container c-postgres-db replaced without attached volume!',
      'Database directory initialized from scratch in container read-write layer.',
      'Previous records deleted upon container removal.',
    ],
    initialStateDescription: 'No persistent volume attached to database container.',
    guidedSteps: [
      {
        instruction: 'Create a dedicated persistent Docker volume named "pgdata"',
        expectedCommand: 'docker volume create pgdata',
        hint: 'Execute docker volume create pgdata',
        explanation: 'Creating a volume ensures data persists independently of container lifecycles.',
      },
      {
        instruction: 'Launch a PostgreSQL container mounting the "pgdata" volume to /var/lib/postgresql/data',
        expectedCommand: 'docker run -d -v pgdata:/var/lib/postgresql/data -e POSTGRES_PASSWORD=secret postgres:16-alpine',
        hint: 'Execute docker run -d -v pgdata:/var/lib/postgresql/data -e POSTGRES_PASSWORD=secret postgres:16-alpine',
        explanation: 'Mounting the volume guarantees that database writes persist across container restarts.',
      },
    ],
    solutionExplanation: 'Container write layers are ephemeral and destroyed when containers are removed (`docker rm`). Database containers must always mount named volumes or host bind mounts for durability.',
  },
  {
    id: 'lab-dockerfile-cache',
    title: 'Incident 103: Broken Dockerfile Build Cache',
    category: 'Build Optimization',
    difficulty: 'Intermediate',
    summary: 'A CI pipeline build is taking 15 minutes because COPY . . is placed before RUN npm install, invalidating the dependency layer cache on every single line change.',
    symptom: 'CI Build Step 4/6: RUN npm install running from scratch on every commit (Cache Miss).',
    initialTerminalLogs: [
      '[BUILD ENGINE] Cache miss at Step 3/6: COPY . .',
      '[BUILD ENGINE] Re-running Step 4/6: RUN npm install (downloading 850 MB node_modules...)',
      '[TIMING] Build duration: 14m 32s',
    ],
    initialStateDescription: 'Dockerfile instruction ordering invalidates layer caching.',
    guidedSteps: [
      {
        instruction: 'Trigger build using optimized layer ordering (COPY package*.json first, then RUN npm install, then COPY . .)',
        expectedCommand: 'docker build -t app:latest .',
        hint: 'Execute docker build -t app:latest .',
        explanation: 'By copying dependency manifests first, npm install stays cached unless dependencies change.',
      },
    ],
    solutionExplanation: 'Docker executes Dockerfiles from top to bottom. If a layer changes, all subsequent layers are invalidated. Placing frequently changing source files (COPY . .) after slow dependency installations (RUN npm install) keeps build times under 10 seconds.',
  },
];
