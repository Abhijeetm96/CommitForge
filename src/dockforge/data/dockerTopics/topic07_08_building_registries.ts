import { UniversalDockerConcept } from '../unifiedDockerData';

export const TOPIC_07_08_CONCEPTS: Record<string, UniversalDockerConcept> = {
  'c-dockerfiles': {
    id: 'c-dockerfiles',
    command: 'docker build -t app .',
    title: 'Dockerfiles & Instructions',
    topicId: 'topic-07',
    topicNumber: '07',
    topicTitle: 'Building Container Images',
    subtitle: 'Text manifest specifying instructions for assembling an immutable container image.',
    badges: ['Intermediate', 'Build', 'Dockerfiles'],
    quote: 'A Dockerfile is an automated build blueprint specifying every layer needed to construct a container image.',
    difficulty: 'Intermediate',

    whatIsIt:
      'A Dockerfile is a plain text file containing sequential instructions (`FROM`, `WORKDIR`, `COPY`, `RUN`, `ENV`, `EXPOSE`, `CMD`, `ENTRYPOINT`) that the Docker BuildKit engine executes to build an immutable image.',
    inSimpleWords:
      'A Dockerfile is a recipe card for your app. Step 1: Start with Node.js base. Step 2: Create `/app` directory. Step 3: Copy code. Step 4: Install dependencies. Step 5: Start app.',
    whyDoYouNeedIt:
      'It makes application image builds automated, reproducible, and version-controlled inside your git repository.',
    realWorldAnalogy:
      'An automated factory blueprint that tells robotic arms how to assemble a vehicle step by step.',

    syntaxCode: 'FROM node:20-alpine\nWORKDIR /app\nCOPY package*.json ./\nRUN npm install\nCOPY . .\nEXPOSE 3000\nCMD ["node", "server.js"]',
    syntaxTokens: [
      { token: 'FROM node:20-alpine', role: 'Instruction', explanation: 'Sets starting base image layer.' },
      { token: 'WORKDIR /app', role: 'Instruction', explanation: 'Sets current working directory inside container.' },
      { token: 'COPY package*.json ./', role: 'Instruction', explanation: 'Copies dependency manifests from host to container.' },
      { token: 'RUN npm install', role: 'Instruction', explanation: 'Executes build step layer.' },
      { token: 'COPY . .', role: 'Instruction', explanation: 'Copies application source code.' },
      { token: 'CMD ["node", "server.js"]', role: 'Instruction', explanation: 'Default execution command when container runs.' },
    ],

    actionStage: {
      before: {
        label: 'Local Source Files',
        description: 'Directory containing server.js, package.json, and Dockerfile.',
        stateBadge: 'Uncompiled Source',
        details: ['server.js', 'package.json', 'Dockerfile'],
      },
      running: {
        label: 'BuildKit Engine Execution',
        description: 'Building image layers line by line.',
        stateBadge: 'Building Image',
        details: ['[1/5] FROM node:20-alpine', '[2/5] WORKDIR /app', '[3/5] RUN npm install'],
      },
      after: {
        label: 'Tagged Image Blueprint',
        description: 'Immutable image stored in local Docker daemon.',
        stateBadge: 'Image Ready',
        details: ['Image Tag: my-app:latest', 'Size: 124MB', 'Ready for deployment'],
      },
    },

    variations: [
      { title: 'Build with Custom Tag', syntax: 'docker build -t my-app:v1.0 .', whatItDoes: 'Builds image and tags it as my-app:v1.0' },
      { title: 'Build with Build Args', syntax: 'docker build --build-arg NODE_ENV=production .', whatItDoes: 'Passes build-time arguments to Dockerfile' },
    ],

    scenarios: [
      {
        title: 'RUN vs CMD Instruction',
        question: 'What is the key difference between RUN and CMD instructions in a Dockerfile?',
        options: [
          { label: 'RUN executes during image build time to create layers; CMD sets default runtime command when container boots', command: 'run-vs-cmd', isCorrect: true, explanation: 'RUN bakes changes into the image layer; CMD executes when container starts.' },
          { label: 'RUN is only for Windows', command: 'win-only', isCorrect: false, explanation: 'Incorrect.' },
        ],
      },
    ],

    sandbox: {
      initialCommands: ['docker images'],
      guidedSteps: [
        { instruction: 'Build a container image tagged "my-custom-app:latest" from local Dockerfile', command: 'docker build -t my-custom-app:latest .', hint: 'Run docker build -t my-custom-app:latest .' },
        { instruction: 'Verify image is registered', command: 'docker images', hint: 'Run docker images' },
      ],
      targetTask: 'Build custom image from Dockerfile.',
      solutionCommands: ['docker build -t my-custom-app:latest .', 'docker images'],
    },

    reference: {
      officialDocUrl: 'https://docs.docker.com/engine/reference/builder/',
      syntaxCheatSheet: [
        'FROM [IMAGE]         # Base image',
        'WORKDIR [PATH]       # Set working directory',
        'COPY [SRC] [DEST]    # Copy files',
        'RUN [CMD]            # Build layer command',
        'ENV [KEY]=[VAL]      # Environment variable',
        'EXPOSE [PORT]        # Document port',
        'CMD ["EXEC"]         # Default container command',
      ],
    },
  },

  'c-layer-caching': {
    id: 'c-layer-caching',
    command: 'docker build --build-arg',
    title: 'Efficient Layer Caching',
    topicId: 'topic-07',
    topicNumber: '07',
    topicTitle: 'Building Container Images',
    subtitle: 'Structuring Dockerfile instructions to maximize layer cache hits and speed up build times.',
    badges: ['Intermediate', 'Performance', 'Build'],
    quote: 'Order Dockerfile instructions from least frequently changed to most frequently changed to maximize layer caching.',
    difficulty: 'Intermediate',

    whatIsIt:
      'Docker caches the result of each Dockerfile instruction as an immutable layer. When rebuilding an image, Docker reuses cached layers unless files involved in that step have changed. If a layer cache misses, all subsequent layers are invalidated.',
    inSimpleWords:
      'If you place `COPY package.json` and `RUN npm install` BEFORE `COPY . .`, Docker reuses your `npm install` cache on every code edit. Your builds drop from 10 minutes to 2 seconds!',
    whyDoYouNeedIt:
      'Massively speeds up local developer iterations and CI/CD pipeline build times.',
    realWorldAnalogy:
      'Baking a pizza. You pre-bake the crust and cheese once (cached layers). When a customer orders a different topping (source code change), you only add toppings and bake for 30 seconds instead of making dough from scratch.',

    syntaxCode: '# OPTIMAL LAYER CACHING:\nFROM node:20-alpine\nWORKDIR /app\nCOPY package*.json ./   # Layer 1 (Cached)\nRUN npm install         # Layer 2 (Cached)\nCOPY . .                # Layer 3 (Invalidated on code edit)',
    syntaxTokens: [
      { token: 'COPY package*.json ./', role: 'Cached Step', explanation: 'Only invalidates if dependencies in package.json change.' },
      { token: 'RUN npm install', role: 'Cached Step', explanation: 'Stays 100% cached as long as package.json is untouched.' },
      { token: 'COPY . .', role: 'Dynamic Step', explanation: 'Re-runs quickly because dependencies are already installed.' },
    ],

    actionStage: {
      before: {
        label: 'Un-optimized Dockerfile',
        description: 'COPY . . placed before RUN npm install.',
        stateBadge: 'Slow Build (Cache Miss)',
        details: ['Editing 1 line of CSS triggers 10 minute npm install', 'Build time: 10m 15s'],
      },
      running: {
        label: 'Re-ordering Instructions',
        description: 'Separating package.json copy from source code copy.',
        stateBadge: 'Layer Re-order',
        details: ['[1/4] USING CACHE', '[2/4] USING CACHE npm install', '[3/4] COPY . . (0.2s)'],
      },
      after: {
        label: 'Optimized Cache Hits',
        description: 'Subsequent builds execute in seconds.',
        stateBadge: 'Fast Build (2s)',
        details: ['Build time: 2.1 seconds', 'Developer productivity restored'],
      },
    },

    variations: [
      { title: 'Build without Cache', syntax: 'docker build --no-cache -t app .', whatItDoes: 'Forces clean rebuild from scratch ignoring layer caches' },
    ],

    scenarios: [
      {
        title: 'Cache Invalidation Rule',
        question: 'If step 3 in a Dockerfile suffers a cache miss, what happens to steps 4, 5, and 6?',
        options: [
          { label: 'All subsequent steps (4, 5, and 6) suffer cache misses and must be re-executed', command: 'sub-miss', isCorrect: true, explanation: 'Cache invalidation cascades downwards.' },
          { label: 'Steps 4, 5, and 6 stay cached', command: 'sub-cached', isCorrect: false, explanation: 'Incorrect.' },
        ],
      },
    ],

    sandbox: {
      initialCommands: ['docker build -t my-custom-app:latest .'],
      guidedSteps: [
        { instruction: 'Rebuild image to observe layer cache hits', command: 'docker build -t my-custom-app:latest .', hint: 'Run docker build -t my-custom-app:latest .' },
      ],
      targetTask: 'Observe BuildKit layer caching.',
      solutionCommands: ['docker build -t my-custom-app:latest .'],
    },

    reference: {
      syntaxCheatSheet: ['docker build --no-cache -t [TAG] .    # Force no-cache build'],
      bestPractices: ['Copy dependency manifests (package.json, requirements.txt, go.mod) before source files.'],
    },
  },

  'c-image-size-security': {
    id: 'c-image-size-security',
    command: 'FROM scratch',
    title: 'Image Size & Multi-Stage Builds',
    topicId: 'topic-07',
    topicNumber: '07',
    topicTitle: 'Building Container Images',
    subtitle: 'Using multi-stage Dockerfiles, Alpine, Distroless, and scratch base images to minimize image footprint.',
    badges: ['Advanced', 'Security', 'Optimization'],
    quote: 'Multi-stage builds allow you to compile code in a heavy build stage and copy ONLY final binaries to a tiny production image.',
    difficulty: 'Advanced',

    whatIsIt:
      'Multi-Stage Builds use multiple `FROM` instructions in a single Dockerfile. You can compile source code in a heavy builder stage (with compilers and SDKs) and copy only the final compiled artifact into a minimal production stage (Alpine, Distroless, or scratch).',
    inSimpleWords:
      'Don\'t ship your entire kitchen to the customer — just ship the finished plate of food! Multi-stage builds shrink image sizes from 1GB down to 15MB.',
    whyDoYouNeedIt:
      'Smaller images download faster in cloud deployments, reduce cloud storage costs, and dramatically shrink attack surfaces by removing compilers and debug tools.',
    realWorldAnalogy:
      'Building a wooden table in a workshop (heavy build stage) and delivering only the finished table (production image) to the customer\'s living room.',

    syntaxCode: '# STAGE 1: Build Stage\nFROM node:20-alpine AS builder\nWORKDIR /app\nCOPY . .\nRUN npm run build\n\n# STAGE 2: Production Stage\nFROM nginx:alpine\nCOPY --from=builder /app/dist /usr/share/nginx/html',
    syntaxTokens: [
      { token: 'FROM node:20-alpine AS builder', role: 'Stage 1', explanation: 'Heavy build stage named "builder".' },
      { token: 'FROM nginx:alpine', role: 'Stage 2', explanation: 'Tiny minimal production stage.' },
      { token: 'COPY --from=builder /app/dist ...', role: 'Artifact Copy', explanation: 'Copies ONLY compiled dist files into production image.' },
    ],

    actionStage: {
      before: {
        label: 'Single-Stage Heavy Image',
        description: 'Includes Node SDK, npm, compilers, and source code.',
        stateBadge: '1.2 GB Image',
        details: ['Contains 4,000 extra files', 'High CVE attack surface', 'Slow cloud pull times'],
      },
      running: {
        label: 'Multi-Stage Build Pipeline',
        description: 'Builder stage compiles dist artifact; Stage 2 discards builder environment.',
        stateBadge: 'Multi-Stage Active',
        details: ['Compiling bundle.js', 'Discarding node_modules', 'Preparing nginx:alpine'],
      },
      after: {
        label: 'Ultra-slim Production Image',
        description: 'Final production image contains ONLY compiled static assets.',
        stateBadge: '22 MB Image',
        details: ['98% size reduction', 'Zero compiler tools in production', 'Secure & fast deployment'],
      },
    },

    variations: [
      { title: 'Distroless Production Base', syntax: 'FROM gcr.io/distroless/static-debian12', whatItDoes: 'Uses base image containing ONLY app binary without shell' },
    ],

    scenarios: [
      {
        title: 'Multi-Stage COPY syntax',
        question: 'What flag is used in a multi-stage Dockerfile to copy compiled artifacts from a previous build stage?',
        options: [
          { label: 'COPY --from=builder /source/path /dest/path', command: 'copy-from', isCorrect: true, explanation: '--from=stage_name selects artifacts from named build stages.' },
          { label: 'COPY --all', command: 'copy-all', isCorrect: false, explanation: 'Incorrect.' },
        ],
      },
    ],

    sandbox: {
      initialCommands: ['docker images'],
      guidedSteps: [
        { instruction: 'Inspect sizes of local container images', command: 'docker images', hint: 'Run docker images' },
      ],
      targetTask: 'Understand multi-stage build image optimization.',
      solutionCommands: ['docker images'],
    },

    reference: {
      syntaxCheatSheet: ['COPY --from=[STAGE_NAME] [SRC] [DEST]    # Copy build artifacts'],
      bestPractices: ['Use multi-stage builds for Go, Rust, Java, and Node.js frontend apps.'],
    },
  },

  'c-dockerhub': {
    id: 'c-dockerhub',
    command: 'docker push',
    title: 'Docker Hub & Login',
    topicId: 'topic-08',
    topicNumber: '08',
    topicTitle: 'Container Registries',
    subtitle: 'Authenticating, pulling, and pushing container images to Docker Hub registry.',
    badges: ['Beginner', 'Registries', 'Distribution'],
    quote: 'Docker Hub is the central public repository for discovering and sharing container images worldwide.',
    difficulty: 'Beginner',

    whatIsIt:
      'Docker Hub is a cloud-based registry service hosted by Docker. Developers use `docker login` to authenticate, `docker pull` to download official images, and `docker push` to publish custom images.',
    inSimpleWords:
      'Docker Hub is GitHub for container images. You push built images to Docker Hub so cloud servers can pull and run them anywhere.',
    whyDoYouNeedIt:
      'Essential for team distribution and cloud deployments. Servers pull images directly from registries.',
    realWorldAnalogy:
      'Publishing an app on the Apple App Store or Google Play Store so users can download it.',

    syntaxCode: 'docker login\ndocker tag my-app:latest myusername/my-app:v1.0\ndocker push myusername/my-app:v1.0',
    syntaxTokens: [
      { token: 'docker login', role: 'Command', explanation: 'Authenticates with Docker Hub registry.' },
      { token: 'docker tag', role: 'Command', explanation: 'Tags image with your registry username.' },
      { token: 'docker push', role: 'Command', explanation: 'Uploads image layers to Docker Hub.' },
    ],

    actionStage: {
      before: {
        label: 'Local Image On Laptop',
        description: 'Image my-app:v1.0 exists only on developer laptop.',
        stateBadge: 'Local Only',
        details: ['Not accessible to cloud servers'],
      },
      running: {
        label: 'Layer Uploading ("docker push")',
        description: 'Pushing image layers to docker.io registry.',
        stateBadge: 'Uploading Layers',
        details: ['Layer 1: Pushed', 'Layer 2: Pushed', 'Digest: sha256:8f2a1b...'],
      },
      after: {
        label: 'Published on Docker Hub',
        description: 'Image is globally available for deployment.',
        stateBadge: 'Globally Accessible',
        details: ['URL: docker.io/myusername/my-app:v1.0', 'Any server can "docker pull"'],
      },
    },

    variations: [
      { title: 'Pull Image', syntax: 'docker pull postgres:16-alpine', whatItDoes: 'Downloads image from Docker Hub without running it' },
    ],

    scenarios: [
      {
        title: 'Registry Image Tagging Requirement',
        question: 'Before pushing an image to Docker Hub, how must the image be tagged?',
        options: [
          { label: 'It must be tagged with your Docker Hub username prefix (e.g. username/image-name:tag)', command: 'tag-user', isCorrect: true, explanation: 'Docker Hub routes pushes based on the repository username prefix.' },
          { label: 'It must be tagged with your phone number', command: 'tag-phone', isCorrect: false, explanation: 'Incorrect.' },
        ],
      },
    ],

    sandbox: {
      initialCommands: ['docker pull alpine:3.19'],
      guidedSteps: [
        { instruction: 'Pull lightweight Alpine 3.19 image from Docker Hub', command: 'docker pull alpine:3.19', hint: 'Run docker pull alpine:3.19' },
      ],
      targetTask: 'Pull images from Docker Hub.',
      solutionCommands: ['docker pull alpine:3.19'],
    },

    reference: {
      syntaxCheatSheet: [
        'docker login                    # Authenticate',
        'docker pull [USER]/[REPO]:[TAG]# Download image',
        'docker push [USER]/[REPO]:[TAG]# Upload image',
      ],
    },
  },

  'c-image-tagging': {
    id: 'c-image-tagging',
    command: 'docker tag app:v1.0',
    title: 'Image Tagging Best Practices',
    topicId: 'topic-08',
    topicNumber: '08',
    topicTitle: 'Container Registries',
    subtitle: 'Using Semantic Versioning, git commit SHAs, and avoiding mutable :latest tags in production.',
    badges: ['Intermediate', 'DevOps', 'Tagging'],
    quote: 'Never use :latest in production — always tag image releases with explicit version numbers or git commit SHAs.',
    difficulty: 'Intermediate',

    whatIsIt:
      'Image tagging creates pointer references to image digests. Best practices dictate using Semantic Versioning (`v1.2.3`), git commit hashes (`commit-7f3a9b`), and environment tags (`staging`).',
    inSimpleWords:
      'Tagging is labeling your boxes. If you label everything "latest", you never know which version of code is running on your server when bugs happen.',
    whyDoYouNeedIt:
      'Prevents accidental production deployment rollbacks and enables deterministic infrastructure auditing.',
    realWorldAnalogy:
      'Labeling moving boxes with exact room names and contents instead of marking every box "Stuff".',

    syntaxCode: 'docker tag my-app:latest myrepo/my-app:v1.2.0\ndocker tag my-app:latest myrepo/my-app:git-7f3a9b',
    syntaxTokens: [
      { token: 'docker tag', role: 'Command', explanation: 'Creates target tag alias pointing to same image digest.' },
    ],

    actionStage: {
      before: {
        label: 'Untagged Local Image',
        description: 'Built image with generic ID: sha256:4b19c2...',
        stateBadge: 'Generic ID',
        details: ['ID: 4b19c2810a9f'],
      },
      running: {
        label: 'Tagging Execution',
        description: 'Creating semver and git SHA aliases.',
        stateBadge: 'Tagging Aliases',
        details: ['Tag: v1.2.0', 'Tag: git-7f3a9b'],
      },
      after: {
        label: 'Traceable Release Tag',
        description: 'Image can be safely deployed and audited.',
        stateBadge: 'Traceable Tag',
        details: ['Deterministic deployment', 'Easy rollbacks'],
      },
    },

    variations: [
      { title: 'Tag Image Alias', syntax: 'docker tag app:latest app:v1.0', whatItDoes: 'Creates v1.0 alias for app:latest image' },
    ],

    scenarios: [
      {
        title: 'The Danger of :latest',
        question: 'Why is using the ":latest" tag considered bad practice for production deployments?',
        options: [
          { label: 'Because :latest is mutable and can overwrite image content unpredictably, breaking reproducibility', command: 'latest-danger', isCorrect: true, explanation: ':latest is not a version guarantee; explicit tags or git SHAs ensure reproducible builds.' },
          { label: 'Because :latest is illegal', command: 'illegal', isCorrect: false, explanation: 'Incorrect.' },
        ],
      },
    ],

    sandbox: {
      initialCommands: ['docker images'],
      guidedSteps: [
        { instruction: 'Tag local image nginx:1.25-alpine as custom-nginx:v1.0.0', command: 'docker tag nginx:1.25-alpine custom-nginx:v1.0.0', hint: 'Run docker tag nginx:1.25-alpine custom-nginx:v1.0.0' },
        { instruction: 'Verify new tag alias', command: 'docker images', hint: 'Run docker images' },
      ],
      targetTask: 'Tag images with version numbers.',
      solutionCommands: ['docker tag nginx:1.25-alpine custom-nginx:v1.0.0', 'docker images'],
    },

    reference: {
      syntaxCheatSheet: ['docker tag [SRC_IMAGE]:[SRC_TAG] [TARGET_REPO]:[TARGET_TAG]'],
    },
  },

  'c-cloud-registries': {
    id: 'c-cloud-registries',
    command: 'docker login ghcr.io',
    title: 'Private & Cloud Registries',
    topicId: 'topic-08',
    topicNumber: '08',
    topicTitle: 'Container Registries',
    subtitle: 'Authenticating and deploying to GitHub Container Registry (GHCR), AWS ECR, GCP Artifact Registry, and Azure ACR.',
    badges: ['Intermediate', 'Cloud', 'Registries'],
    quote: 'Cloud registries provide secure, private container image hosting integrated into cloud provider IAM security.',
    difficulty: 'Intermediate',

    whatIsIt:
      'Cloud Container Registries (GitHub GHCR, AWS ECR, GCP GCR/AR, Azure ACR) host proprietary private container images protected by enterprise IAM authentication tokens.',
    inSimpleWords:
      'Private cloud registries are private vaults for your company\'s confidential app images, keeping competitors from downloading your proprietary source code.',
    whyDoYouNeedIt:
      'Enterprise applications contain proprietary intellectual property and business logic that must never be pushed to public registries.',
    realWorldAnalogy:
      'Storing confidential company blueprints inside a secure safe in your corporate headquarters rather than a public library.',

    syntaxCode: 'echo $PAT | docker login ghcr.io -u USERNAME --password-stdin\ndocker tag app:v1 ghcr.io/org/app:v1\ndocker push ghcr.io/org/app:v1',
    syntaxTokens: [
      { token: 'ghcr.io', role: 'Registry Host', explanation: 'GitHub Container Registry domain name.' },
      { token: '--password-stdin', role: 'Flag', explanation: 'Securely passes access token without exposing it in shell history.' },
    ],

    actionStage: {
      before: {
        label: 'Unauthenticated CLI',
        description: 'Attempting to push to private cloud registry.',
        stateBadge: 'Unauthorized (401)',
        details: ['push denied: unauthenticated access'],
      },
      running: {
        label: 'Cloud IAM Authentication',
        description: 'Authenticating via OAuth token or cloud CLI credential helper.',
        stateBadge: 'Authenticating',
        details: ['Login Succeeded', 'Config saved to ~/.docker/config.json'],
      },
      after: {
        label: 'Private Cloud Storage',
        description: 'Image safely stored in private cloud container registry.',
        stateBadge: 'Private & Secure',
        details: ['URL: ghcr.io/org/app:v1', 'Access restricted by IAM policy'],
      },
    },

    variations: [
      { title: 'Login to GHCR', syntax: 'docker login ghcr.io', whatItDoes: 'Authenticates CLI with GitHub Container Registry' },
    ],

    scenarios: [
      {
        title: 'Private Registry Domain Prefix',
        question: 'When pushing an image to AWS ECR or GHCR, how does Docker know to send image layers to that specific cloud provider?',
        options: [
          { label: 'By including the domain host prefix in the image tag (e.g. ghcr.io/... or 123456.dkr.ecr.aws...)', command: 'registry-domain', isCorrect: true, explanation: 'The first component of the tag dictates the destination registry domain.' },
          { label: 'By sending emails to AWS support', command: 'email-aws', isCorrect: false, explanation: 'Incorrect.' },
        ],
      },
    ],

    sandbox: {
      initialCommands: ['docker images'],
      guidedSteps: [
        { instruction: 'Inspect local images ready for cloud registry tagging', command: 'docker images', hint: 'Run docker images' },
      ],
      targetTask: 'Understand cloud registry distribution.',
      solutionCommands: ['docker images'],
    },

    reference: {
      syntaxCheatSheet: [
        'docker login ghcr.io                         # GitHub GHCR',
        'aws ecr get-login-password | docker login    # AWS ECR',
      ],
    },
  },
};
