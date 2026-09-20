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

    sandbox: {
      initialCommands: ['docker ps'],
      guidedSteps: [
        { instruction: 'Inspect running web container bind mounts', command: 'docker inspect web-frontend', hint: 'Run docker inspect web-frontend' },
      ],
      targetTask: 'Understand developer hot reloading.',
      solutionCommands: ['docker inspect web-frontend'],
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

    sandbox: {
      initialCommands: ['docker ps'],
      guidedSteps: [
        { instruction: 'Inspect exposed ports of running web containers', command: 'docker ps', hint: 'Run docker ps' },
      ],
      targetTask: 'Configure container debuggers.',
      solutionCommands: ['docker ps'],
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

    sandbox: {
      initialCommands: ['docker run --rm alpine echo "Unit Tests: PASS"'],
      guidedSteps: [
        { instruction: 'Run automated test verification inside disposable Alpine container', command: 'docker run --rm alpine echo "Unit Tests: PASS"', hint: 'Run docker run --rm alpine echo "Unit Tests: PASS"' },
      ],
      targetTask: 'Execute automated tests in containers.',
      solutionCommands: ['docker run --rm alpine echo "Unit Tests: PASS"'],
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

    sandbox: {
      initialCommands: ['docker version'],
      guidedSteps: [
        { instruction: 'Verify Buildx capability in local Docker engine', command: 'docker version', hint: 'Run docker version' },
      ],
      targetTask: 'Understand Docker CI/CD pipelines.',
      solutionCommands: ['docker version'],
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

    sandbox: {
      initialCommands: ['docker ps'],
      guidedSteps: [
        { instruction: 'Inspect running containers ready for PaaS deployment', command: 'docker ps', hint: 'Run docker ps' },
      ],
      targetTask: 'Understand PaaS deployment options.',
      solutionCommands: ['docker ps'],
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

    sandbox: {
      initialCommands: ['docker info'],
      guidedSteps: [
        { instruction: 'Inspect Docker info for Swarm state', command: 'docker info', hint: 'Run docker info' },
      ],
      targetTask: 'Understand Docker Swarm clustering.',
      solutionCommands: ['docker info'],
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

    sandbox: {
      initialCommands: ['docker version'],
      guidedSteps: [
        { instruction: 'Verify container runtime version for Kubernetes integration', command: 'docker version', hint: 'Run docker version' },
      ],
      targetTask: 'Understand Kubernetes container integration.',
      solutionCommands: ['docker version'],
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

    sandbox: {
      initialCommands: ['docker ps'],
      guidedSteps: [
        { instruction: 'Inspect running containers ready for Nomad job scheduling', command: 'docker ps', hint: 'Run docker ps' },
      ],
      targetTask: 'Understand Nomad workload orchestration.',
      solutionCommands: ['docker ps'],
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
