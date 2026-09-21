import { UniversalDockerConcept, WithoutVsWithData, BlockDiagramData, InternalStep, CommonMistake } from './unifiedDockerData';

/**
 * Topic Category Classifier:
 * Maps topic ID to pedagogical category to provide tailored teaching data.
 */
type TopicCategory =
  | 'fundamentals' // Topics 1 & 2
  | 'networking'   // Topics 3 & 4
  | 'storage'      // Topics 5 & 6
  | 'dockerfile'   // Topics 7 & 8
  | 'compose'      // Topics 9 & 10
  | 'security'     // Topics 11 & 12
  | 'production';  // Topics 13 & 14

function getTopicCategory(topicId: string, topicNum: string): TopicCategory {
  const num = parseInt(topicNum, 10) || 1;
  if (num <= 2) return 'fundamentals';
  if (num <= 4) return 'networking';
  if (num <= 6) return 'storage';
  if (num <= 8) return 'dockerfile';
  if (num <= 10) return 'compose';
  if (num <= 12) return 'security';
  return 'production';
}

/**
 * Category-specific enrichers guaranteeing high-fidelity pedagogical data
 */
function getCategoryWithoutVsWith(category: TopicCategory, title: string): WithoutVsWithData {
  switch (category) {
    case 'storage':
      return {
        without: {
          title: `WITHOUT VOLUMES (${title.toUpperCase()})`,
          items: [
            'All database data is written to the ephemeral container layer',
            'Running "docker rm" permanently deletes all customer database records',
            'Cannot share data between multiple containers simultaneously',
            'Disk write speed is slowed down by the copy-on-write overlay storage driver',
          ],
          outcome: '💥 Total catastrophic data loss whenever containers restart or update',
        },
        with: {
          title: `WITH VOLUMES & PERSISTENCE (${title.toUpperCase()})`,
          items: [
            'Data lives independently on host storage, completely outside container lifecycle',
            'Updating or destroying containers preserves 100% of database records',
            'Direct native host disk I/O performance bypassing OverlayFS overhead',
            'Easy automated backup, snapshotting, and volume migration',
          ],
          outcome: '🛡️ Safe, permanent, high-performance data persistence',
        },
      };

    case 'networking':
      return {
        without: {
          title: `WITHOUT CONTAINER NETWORKING (${title.toUpperCase()})`,
          items: [
            'Containers are locked in isolated network sandboxes with no outside access',
            'Web apps inside containers cannot be accessed from host browser',
            'Microservices cannot communicate with each other by service name',
            'Port collisions if multiple services try to bind to the same host port',
          ],
          outcome: '🔒 Unreachable services and broken microservice communication',
        },
        with: {
          title: `WITH CONTAINER NETWORKING (${title.toUpperCase()})`,
          items: [
            'Explicit port mapping (-p host_port:container_port) exposes web apps safely',
            'Custom bridge networks provide automatic internal DNS service discovery',
            'Multiple containers can use port 80 internally without host conflicts',
            'Network isolation: backend databases shielded from public exposure',
          ],
          outcome: '🌐 Seamless, secure, and DNS-discoverable microservice mesh',
        },
      };

    case 'dockerfile':
      return {
        without: {
          title: `WITHOUT DOCKERFILE AUTOMATION (${title.toUpperCase()})`,
          items: [
            'Manually installing packages via terminal inside running containers',
            'No version-controlled record of what packages and tools are installed',
            'Rebuilding environments takes hours of manual, error-prone effort',
            'Massive image bloat from leftover build tools and caches',
          ],
          outcome: '⏳ Fragile, unreproducible images and hours wasted on setup',
        },
        with: {
          title: `WITH DOCKERFILE & BUILDKIT (${title.toUpperCase()})`,
          items: [
            '100% declarative, version-controlled recipe committed to Git',
            'Layer caching ensures rebuilds complete in seconds instead of minutes',
            'Multi-stage builds reduce image size from 1GB down to 15MB Distroless',
            'Automated CI/CD image builds with zero human intervention',
          ],
          outcome: '⚡ Fast, tiny, secure, and 100% reproducible image builds',
        },
      };

    case 'compose':
      return {
        without: {
          title: `WITHOUT DOCKER COMPOSE (${title.toUpperCase()})`,
          items: [
            'Running 6 separate long "docker run" terminal commands manually',
            'Manual linking of container IPs, breaking every time a container restarts',
            'No automated startup order (backend starts before database is ready)',
            'Cleaning up requires hunting down and deleting containers individually',
          ],
          outcome: '🤯 Tedious manual orchestration and broken multi-service stacks',
        },
        with: {
          title: `WITH DOCKER COMPOSE (${title.toUpperCase()})`,
          items: [
            'Entire stack (Frontend, Backend, Redis, Postgres) defined in single YAML file',
            'One command: "docker compose up -d" boots entire multi-tier architecture',
            'Automatic shared network: services communicate seamlessly via "postgres:5432"',
            'One command: "docker compose down" cleanly stops and removes entire stack',
          ],
          outcome: '🚀 Instant full-stack developer environment in 5 seconds',
        },
      };

    case 'security':
      return {
        without: {
          title: `WITHOUT CONTAINER HARDENING (${title.toUpperCase()})`,
          items: [
            'Container processes running as root (UID 0) by default',
            'A compromised web app can exploit Linux kernel vulnerabilities on host',
            'Unbounded CPU/RAM usage allows one buggy container to crash entire host',
            'All Linux kernel capabilities enabled by default',
          ],
          outcome: '⚠️ Severe security breach vulnerability and host crash risk',
        },
        with: {
          title: `WITH HARDENED CONTAINERS (${title.toUpperCase()})`,
          items: [
            'Explicit non-root user (USER 10001) prevents privilege escalation',
            'Read-only root filesystem prevents attackers from writing malicious binaries',
            'cgroup resource limits (--memory=512m --cpus=1.5) prevent host starvation',
            'Dropped capabilities (--cap-drop=ALL) follows principle of least privilege',
          ],
          outcome: '🛡️ Hardened, production-grade defense-in-depth isolation',
        },
      };

    case 'production':
      return {
        without: {
          title: `WITHOUT PRODUCTION PATTERNS (${title.toUpperCase()})`,
          items: [
            'Bloated 1.2GB development images deployed directly to production',
            'Secrets and API tokens baked permanently into image layer history',
            'No container health checks: traffic sent to dead, unresponsive processes',
            'Single host limitations: no automated failover or cluster scaling',
          ],
          outcome: '🐌 Slow deployment, credential leaks, and production downtime',
        },
        with: {
          title: `WITH PRODUCTION PATTERNS & K8S BRIDGE (${title.toUpperCase()})`,
          items: [
            'Minimal Distroless/Alpine runtime images under 25MB for rapid rollout',
            'Build-time secrets mounted safely without leaking into image layers',
            'Docker HEALTHCHECK detects frozen processes and restarts them automatically',
            'Seamless bridge to Kubernetes PodForge for distributed enterprise scaling',
          ],
          outcome: '🏆 Battle-tested, ultra-lightweight, resilient cloud-native systems',
        },
      };

    default: // fundamentals
      return {
        without: {
          title: `WITHOUT CONTAINERS (${title.toUpperCase()})`,
          items: [
            'Developer A has Node 20, Developer B has Node 18',
            'Global package pollution and dependency conflicts on host machine',
            'Missing system libraries on production servers',
            'Manual multi-page setup guides that break every quarter',
          ],
          outcome: '💥 "Works on my machine" bugs and production deployment failures',
        },
        with: {
          title: `WITH DOCKER CONTAINERS (${title.toUpperCase()})`,
          items: [
            'App bundled with exact runtime, dependencies, and OS packages',
            '100% identical execution across macOS, Windows, Linux, and Cloud',
            'Sub-second startup by sharing host Linux kernel without VM bloat',
            'Clean uninstallation: delete container with zero leftover host pollution',
          ],
          outcome: '📦 Guaranteed portable, immutable, and isolated execution anywhere',
        },
      };
  }
}

function getCategoryBlockDiagram(category: TopicCategory, title: string, cmd: string): BlockDiagramData {
  switch (category) {
    case 'storage':
      return {
        title: `${title} Storage Architecture`,
        subtitle: 'Click any storage layer to inspect how data persists outside the container:',
        nodes: [
          { id: 'host-storage', label: 'Host Storage (/var/lib/docker/volumes)', simpleDef: 'The real physical hard drive on your computer where Docker stores persistent data.', techDef: 'Host filesystem directory mounted directly bypassing the OverlayFS storage driver.', badge: 'Host Disk', color: '#f59e0b' },
          { id: 'volume-driver', label: 'Docker Volume Driver', simpleDef: 'The Docker manager that creates, tracks, and manages volume folders.', techDef: 'Docker volume subsystem handling local mounts, NFS, and cloud volume plugins.', badge: 'Volume Manager', color: '#38bdf8' },
          { id: 'container-mount', label: 'Container Mount (/var/lib/data)', simpleDef: 'The directory inside your container linked directly to the host volume.', techDef: 'Mount namespace bind-mount providing native disk write speed with zero copy-on-write latency.', badge: 'Container Mount', color: '#10b981' },
        ],
      };

    case 'networking':
      return {
        title: `${title} Network Flow & Port Mapping`,
        subtitle: 'Click any network component to inspect how traffic flows into the container:',
        nodes: [
          { id: 'host-browser', label: 'Host Machine / Web Browser', simpleDef: 'Your laptop browser connecting to http://localhost:8080.', techDef: 'Client TCP socket connecting to host network interface on published port.', badge: 'Host Client', color: '#38bdf8' },
          { id: 'docker-bridge', label: 'docker0 Bridge & iptables DNAT', simpleDef: 'The virtual network switch and traffic cop created by Docker.', techDef: 'Linux virtual bridge device (172.17.0.1) and iptables PREROUTING DNAT packet forwarding.', badge: 'Bridge Switch', color: '#a855f7' },
          { id: 'container-eth0', label: 'Container eth0 & veth pair', simpleDef: 'The virtual network card and private IP (172.17.0.2) inside the container.', techDef: 'Virtual ethernet peer device inside container network namespace listening on internal port 80.', badge: 'Container eth0', color: '#10b981' },
        ],
      };

    case 'dockerfile':
      return {
        title: `${title} Layered Image Build Pipeline`,
        subtitle: 'Click any build stage to inspect how BuildKit caches and compiles immutable layers:',
        nodes: [
          { id: 'dockerfile-src', label: 'Dockerfile & Build Context', simpleDef: 'Your written recipe and source code files on your computer.', techDef: 'Declarative build instructions and local filesystem context streamed to BuildKit daemon.', badge: 'Recipe Spec', color: '#38bdf8' },
          { id: 'buildkit-engine', label: 'BuildKit Cache & Layer Builder', simpleDef: 'The smart engine that executes steps and skips unchanged cached layers.', techDef: 'BuildKit solver computing dependency graph and parallelizing cache-valid step execution.', badge: 'BuildKit', color: '#60a5fa' },
          { id: 'oci-image', label: 'Immutable OCI Image Layers', simpleDef: 'The final lightweight read-only image ready to run or push to registry.', techDef: 'Tarball layers with SHA256 content digests registered in local Overlay2 store.', badge: 'OCI Artifact', color: '#10b981' },
        ],
      };

    case 'compose':
      return {
        title: `${title} Multi-Container Stack Topology`,
        subtitle: 'Click any service component to inspect multi-container orchestration:',
        nodes: [
          { id: 'compose-spec', label: 'docker-compose.yml', simpleDef: 'The single master blueprint defining your web app, database, and cache.', techDef: 'Declarative Compose v2 spec with service declarations, networks, and volumes.', badge: 'Compose Spec', color: '#38bdf8' },
          { id: 'compose-net', label: 'User-Defined Bridge Network', simpleDef: 'The private network connecting all services together with internal DNS.', techDef: 'Isolated bridge network with embedded 127.0.0.11 DNS service discovery by hostname.', badge: 'DNS Mesh', color: '#a855f7' },
          { id: 'compose-services', label: 'Running Service Containers (Web + DB)', simpleDef: 'Your frontend and backend containers running together seamlessly.', techDef: 'Coordinated container instances with depends_on order and healthcheck validation.', badge: 'Live Services', color: '#10b981' },
        ],
      };

    case 'security':
      return {
        title: `${title} Defense-in-Depth Hardening Boundary`,
        subtitle: 'Click any boundary to inspect Linux kernel isolation layers:',
        nodes: [
          { id: 'sec-kernel', label: 'Linux Host Kernel (cgroups & namespaces)', simpleDef: 'The host operating system enforcing boundaries and resource walls.', techDef: 'Linux kernel providing cgroups v2 (CPU/memory caps) and namespaces (PID, Net, Mount).', badge: 'Host Kernel', color: '#ef4444' },
          { id: 'sec-runtime', label: 'runc & AppArmor / Seccomp', simpleDef: 'The security guards blocking dangerous commands and system calls.', techDef: 'Default seccomp syscall filter blocking 44+ dangerous Linux syscalls.', badge: 'Syscall Filter', color: '#a855f7' },
          { id: 'sec-process', label: 'Non-Root Container Process (USER 10001)', simpleDef: 'Your program running with minimal permissions, unable to touch host files.', techDef: 'Unprivileged process with dropped capabilities (CAP_DROP=ALL) and read-only rootfs.', badge: 'Non-Root App', color: '#10b981' },
        ],
      };

    case 'production':
      return {
        title: `${title} Production & Kubernetes Bridge`,
        subtitle: 'Click any component to inspect the bridge from single container to cluster:',
        nodes: [
          { id: 'prod-image', label: 'Distroless Production Image (<25MB)', simpleDef: 'Ultra-small, secure image containing only your binary and zero attack surface.', techDef: 'Minimal OCI container image stripped of package managers, bash shells, and build tools.', badge: 'Distroless OCI', color: '#38bdf8' },
          { id: 'prod-registry', label: 'Secure Container Registry (ECR / DockerHub)', simpleDef: 'The cloud warehouse storing and vulnerability-scanning your images.', techDef: 'OCI-compliant registry with CVE vulnerability scanning and cryptographic image signing.', badge: 'Registry', color: '#60a5fa' },
          { id: 'prod-k8s', label: 'PodForge Kubernetes Cluster (Pods & Nodes)', simpleDef: 'The enterprise cluster running, scaling, and self-healing your containers.', techDef: 'Kubernetes control plane orchestrating pods across distributed worker nodes.', badge: 'Kubernetes', color: '#10b981' },
        ],
      };

    default: // fundamentals
      return {
        title: `${title} Architecture & System Boundary`,
        subtitle: 'Click any component below to inspect simple and technical definitions:',
        nodes: [
          { id: 'host-layer', label: 'Host OS & Docker Engine', simpleDef: 'The underlying computer operating system and Docker daemon service.', techDef: 'Host Linux kernel providing syscalls, cgroups v2, and Overlay2 storage driver.', badge: 'Host System', color: '#38bdf8' },
          { id: 'concept-boundary', label: `${title} Layer`, simpleDef: `The isolated runtime boundary managed by ${cmd}.`, techDef: `Isolated user-space process primitives configured for ${title}.`, badge: 'Docker Layer', color: '#4ade80' },
          { id: 'app-layer', label: 'Application Runtime & Files', simpleDef: 'Your source code, binaries, configuration, and dependencies.', techDef: 'Mounted rootfs layer stacked on read-only OCI image layers.', badge: 'Application', color: '#facc15' },
        ],
      };
  }
}

function getCategoryInternalFlow(category: TopicCategory, _title: string, _cmd: string): InternalStep[] {
  switch (category) {
    case 'storage':
      return [
        { step: 1, title: 'CLI Parses Volume Flag', desc: 'Docker CLI reads "-v my_vol:/app/data" or "--mount" parameters.', why: 'Identifies source host volume and destination container mount point.', techDetail: 'Validates volume name syntax and access modes (ro/rw)' },
        { step: 2, title: 'Volume Existence Check', desc: 'Daemon queries local volume store in /var/lib/docker/volumes/.', why: 'If volume does not exist, Docker automatically creates it on the host.', techDetail: 'Creates directory with root ownership and 0755 permissions' },
        { step: 3, title: 'Mount Namespace Binding', desc: 'runc prepares container filesystem and bind-mounts host volume directory.', why: 'Links host directory into container rootfs before starting process.', techDetail: 'Calls mount(MS_BIND | MS_REC) system call' },
        { step: 4, title: 'Process Writes Data', desc: 'Application writes database records directly to /app/data.', why: 'Writes bypass copy-on-write overlay, going straight to host disk.', techDetail: 'Direct host block I/O with native disk throughput' },
        { step: 5, title: 'Container Lifecycle Independence', desc: 'Container is stopped and deleted with "docker rm".', why: 'Volume data remains 100% intact on host for the next container.', techDetail: 'Data preserved in /var/lib/docker/volumes/my_vol/_data' },
      ];

    case 'networking':
      return [
        { step: 1, title: 'Port Flag Evaluation', desc: 'CLI parses "-p 8080:80" parameter.', why: 'Determines host binding port (8080) and container listening port (80).', techDetail: 'Validates TCP/UDP protocol and port range availability' },
        { step: 2, title: 'veth Pair Creation', desc: 'Daemon creates a Linux virtual ethernet pair (two connected virtual cables).', why: 'Connects container isolated network namespace to host network.', techDetail: 'Calls ip link add vethX type veth peer name eth0' },
        { step: 3, title: 'Bridge Switch Attachment', desc: 'One end of veth is plugged into the docker0 virtual bridge.', why: 'Allows container to communicate with other containers on the bridge.', techDetail: 'Calls br_add_if(docker0, vethX)' },
        { step: 4, title: 'iptables DNAT Programming', desc: 'Docker Daemon programs host Linux iptables with a port forwarding rule.', why: 'Directs incoming traffic on host port 8080 to container IP:80.', techDetail: 'iptables -t nat -A DOCKER -p tcp --dport 8080 -j DNAT --to-dest 172.17.0.2:80' },
        { step: 5, title: 'Container Network Listening', desc: 'Container process boots and binds to 0.0.0.0:80.', why: 'Web server is now reachable from host at http://localhost:8080.', techDetail: 'Kernel routes packets through veth into container netns' },
      ];

    case 'dockerfile':
      return [
        { step: 1, title: 'Build Context Transfer', desc: 'CLI packages local source files and streams context to BuildKit engine.', why: 'Provides files for COPY instructions.', techDetail: 'Streams tarball over /var/run/docker.sock' },
        { step: 2, title: 'Base Layer Resolution (FROM)', desc: 'BuildKit checks local cache for base image (e.g. alpine:3.19).', why: 'Avoids redownloading OS layers if already cached locally.', techDetail: 'Checks local content-addressable storage digest' },
        { step: 3, title: 'Checksum Cache Lookup (COPY)', desc: 'BuildKit calculates SHA256 checksum of source files.', why: 'If files did not change, BuildKit reuses cached layer instantly.', techDetail: 'Compares cache keys: if match, skips step in 0.01s' },
        { step: 4, title: 'Command Execution (RUN)', desc: 'Spawns temporary container to execute build commands (e.g. npm install).', why: 'Compiles binaries and downloads dependencies into image layer.', techDetail: 'Executes runc inside temporary snapshot namespace' },
        { step: 5, title: 'Immutable Image Snapshot', desc: 'Commits resulting filesystem changes as a read-only OCI layer.', why: 'Image layers are stacked into the final runnable container image.', techDetail: 'Calculates layer DiffID and updates image manifest' },
      ];

    case 'compose':
      return [
        { step: 1, title: 'Compose YAML Validation', desc: 'Compose CLI parses docker-compose.yml and validates service specs.', why: 'Ensures correct syntax, environment variables, and port mappings.', techDetail: 'Parses Compose v2 schema and interpolates .env variables' },
        { step: 2, title: 'Custom Network Creation', desc: 'Creates isolated bridge network named "<project>_default".', why: 'Gives all services in stack a shared private network with DNS discovery.', techDetail: 'Docker network create --driver bridge <project>_default' },
        { step: 3, title: 'Dependency Order Resolution', desc: 'Evaluates "depends_on" and healthcheck conditions.', why: 'Ensures database boots and turns healthy before backend starts.', techDetail: 'Builds directed acyclic graph (DAG) of service startup' },
        { step: 4, title: 'Parallel Container Launch', desc: 'Spawns each service container attached to shared network.', why: 'All microservices boot up in coordinated harmony.', techDetail: 'Injects environment variables and named volume mounts' },
        { step: 5, title: 'Embedded DNS Name Resolution', desc: 'Services communicate using service names (e.g. http://api:3000).', why: 'Zero hardcoded IP addresses needed.', techDetail: 'Docker embedded DNS (127.0.0.11) resolves service hostnames' },
      ];

    case 'security':
      return [
        { step: 1, title: 'Security Flag Evaluation', desc: 'CLI processes "--user", "--read-only", and "--cap-drop" flags.', why: 'Configures least-privilege security envelope for container.', techDetail: 'Validates UID/GID numbers and Linux capability names' },
        { step: 2, title: 'Seccomp Filter Loading', desc: 'Docker loads default BPF filter into Linux kernel for container PID.', why: 'Blocks container from invoking dangerous kernel syscalls.', techDetail: 'Applies seccomp profile restricting 44+ syscalls' },
        { step: 3, title: 'Capability Dropping', desc: 'Drops root capabilities like CAP_SYS_ADMIN and CAP_NET_ADMIN.', why: 'Prevents container from tampering with host network or devices.', techDetail: 'Calls cap_set_proc() before process exec' },
        { step: 4, title: 'cgroup Resource Clamping', desc: 'Sets CPU CFS quota and memory hard limit in Linux cgroups v2.', why: 'Prevents buggy container memory leak from freezing host machine.', techDetail: 'Writes to /sys/fs/cgroup/memory.max and cpu.max' },
        { step: 5, title: 'Unprivileged Process Execution', desc: 'runc spawns application process under non-root UID 10001.', why: 'Even if app has vulnerabilities, attacker cannot gain root on host.', techDetail: 'Executes setuid(10001) and setgid(10001)' },
      ];

    case 'production':
      return [
        { step: 1, title: 'Multi-Stage Build Optimization', desc: 'Separates heavy build environment from lean production runtime.', why: 'Leaves compilers and devDependencies out of production image.', techDetail: 'FROM builder AS build ... FROM alpine:3.19' },
        { step: 2, title: 'CVE Vulnerability Scanning', desc: 'Scans image layers for known Common Vulnerabilities & Exposures (CVEs).', why: 'Ensures zero high-severity security vulnerabilities are pushed.', techDetail: 'Scans OS packages and dependency manifests via Trivy' },
        { step: 3, title: 'Registry Push & Digest Signing', desc: 'Pushes immutable image layers to container registry (ECR/DockerHub).', why: 'Makes image globally available for cloud deployment.', techDetail: 'HTTPS PUT to OCI registry with SHA256 image digest' },
        { step: 4, title: 'Healthcheck Daemon Monitoring', desc: 'Docker daemon executes HEALTHCHECK command every 30 seconds.', why: 'Detects if web server deadlocks even if process is still running.', techDetail: 'Executes health probe command inside container netns' },
        { step: 5, title: 'Kubernetes PodForge Hand-Off', desc: 'Cloud orchestrator pulls image and runs it as an enterprise Pod.', why: 'Enables autoscaling, zero-downtime rollouts, and multi-node resilience.', techDetail: 'Kubelet invokes containerd CRI to spawn pod sandbox' },
      ];

    default: // fundamentals
      return [
        { step: 1, title: 'CLI Command Dispatch', desc: 'Docker CLI validates flags and serializes command into REST payload.', why: 'Translates terminal text into API payload.', techDetail: 'POST /v1.43/containers/create' },
        { step: 2, title: 'Daemon Socket Handshake', desc: 'Docker Daemon (dockerd) receives request via /var/run/docker.sock.', why: 'Verifies authorization and system state.', techDetail: 'UNIX domain socket RPC handshake' },
        { step: 3, title: 'Image Store Verification', desc: 'Daemon checks local Overlay2 store; pulls from registry if missing.', why: 'Ensures immutable base image layers exist locally.', techDetail: 'Queries local content-addressable storage' },
        { step: 4, title: 'Read-Write Layer Mount', desc: 'Daemon creates thin writable container layer on top of image layers.', why: 'Isolates container disk modifications from base image.', techDetail: 'OverlayFS union mount with lowerdir & upperdir' },
        { step: 5, title: 'Kernel Namespace Isolation', desc: 'Linux kernel initializes PID, Net, Mount, and IPC namespaces.', why: 'Isolates container processes from host machine processes.', techDetail: 'Linux clone() syscall with CLONE_NEW* flags' },
        { step: 6, title: 'Process Boot (RUNNING)', desc: 'Container runtime (runc) executes entrypoint command as PID 1.', why: 'Application is active, healthy, and isolated.', techDetail: 'runc start container_id' },
      ];
  }
}

function getCategoryCommonMistakes(category: TopicCategory, _title: string): CommonMistake[] {
  switch (category) {
    case 'storage':
      return [
        { mistake: 'Writing database data to the container filesystem without a Volume.', whyWrong: 'When the container is stopped and deleted, all database files vanish permanently.', correctWay: 'Always use a named volume (-v db_data:/var/lib/postgresql/data) for databases.' },
        { mistake: 'Confusing Bind Mounts with Named Volumes.', whyWrong: 'Bind mounts tie your container to a specific folder on your laptop, breaking in the cloud.', correctWay: 'Use bind mounts for local code hot-reloading; use Named Volumes for permanent data.' },
      ];

    case 'networking':
      return [
        { mistake: 'Reversing port order in the -p flag (e.g. -p 80:8080).', whyWrong: 'Syntax is -p host_port:container_port. Reversing it exposes the wrong port.', correctWay: 'Remember: Outside:Inside. Host machine port comes first, container port second.' },
        { mistake: 'Using "localhost" to talk to another container.', whyWrong: '"localhost" inside a container refers to that container alone, not other containers.', correctWay: 'Connect containers to a custom bridge network and call them by service name.' },
      ];

    case 'dockerfile':
      return [
        { mistake: 'Placing "COPY . ." before package installations.', whyWrong: 'Every code edit busts the cache, forcing slow dependency downloads on every single build.', correctWay: 'Copy package.json first, run npm install, THEN copy source code.' },
        { mistake: 'Confusing RUN with CMD.', whyWrong: 'RUN executes at build time to create layers; CMD sets default command when container boots.', correctWay: 'Use RUN for setup (apt-get install); use CMD for the startup process.' },
      ];

    case 'compose':
      return [
        { mistake: 'Using hardcoded IP addresses between Compose services.', whyWrong: 'Container IP addresses change every time a container restarts.', correctWay: 'Use the service name from docker-compose.yml as the hostname (e.g. db:5432).' },
        { mistake: 'Forgetting to persist Compose database volumes.', whyWrong: 'Omitting the top-level "volumes:" key results in anonymous disposable volumes.', correctWay: 'Declare named volumes under the top-level volumes: section in docker-compose.yml.' },
      ];

    case 'security':
      return [
        { mistake: 'Leaving containers running as default root user (UID 0).', whyWrong: 'If an attacker breaches the application, they have root access inside the container.', correctWay: 'Add "USER 10001" in Dockerfile to run as an unprivileged user.' },
        { mistake: 'Omitting memory limits on production containers.', whyWrong: 'A single memory leak can consume 100% of host RAM and freeze the entire server.', correctWay: 'Always specify --memory (e.g. --memory=512m) to protect the host machine.' },
      ];

    default:
      return [
        { mistake: 'Thinking Docker containers are heavy Virtual Machines.', whyWrong: 'Containers share the host operating system kernel and start in milliseconds.', correctWay: 'Treat containers as isolated processes, not full virtual computers.' },
        { mistake: 'Confusing an Image with a Container.', whyWrong: 'An Image is an immutable blueprint (recipe); a Container is the running instance (food).', correctWay: 'Build an Image once, then launch as many Containers from it as you need.' },
      ];
  }
}

/**
 * Ensures that EVERY concept passed to ConceptTeachingEngine has full, rich, 5-stage teaching data.
 * If static concept data lacks extended fields, this enriches them with concept-specific defaults.
 */
export function ensureFullConceptData(concept: UniversalDockerConcept): UniversalDockerConcept {
  const title = concept.title || 'Docker Concept';
  const cmd = concept.command || 'docker run';
  const topicNum = concept.topicNumber || '01';
  const topicId = concept.topicId || 'topic-01';
  const category = getTopicCategory(topicId, topicNum);

  // 1. Without vs With
  const withoutVsWith = concept.withoutVsWith || getCategoryWithoutVsWith(category, title);

  // 2. Block Diagram
  const blockDiagram = concept.blockDiagram || getCategoryBlockDiagram(category, title, cmd);

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
    setup: 'An engineering team collaborates across Windows, macOS, and Linux laptops.',
    problem: 'Each developer installs different package versions, leading to broken builds and deployment crashes.',
    solution: `The team adopts ${title} via Docker. Now every developer runs identical commands with zero drift.`,
  };

  // 8. Internal Flow Steps
  const internalFlow = concept.internalFlow && concept.internalFlow.length > 0 ? concept.internalFlow : getCategoryInternalFlow(category, title, cmd);

  // 9. Common Mistakes
  const commonMistakes = concept.commonMistakes && concept.commonMistakes.length > 0 ? concept.commonMistakes : getCategoryCommonMistakes(category, title);

  // 10. Recap & Challenge
  const recapChecklist = concept.recapChecklist && concept.recapChecklist.length > 0 ? concept.recapChecklist : [
    `${title} provides an isolated, portable runtime environment.`,
    'Docker CLI communicates with dockerd daemon over unix sockets.',
    'Containers start in milliseconds by sharing the host OS kernel.',
    'Always use explicit flags (-d, -p, --name) for predictable container management.',
  ];

  const challenge = concept.challenge || {
    question: `What is the main architectural advantage of utilizing ${title} in Docker?`,
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
