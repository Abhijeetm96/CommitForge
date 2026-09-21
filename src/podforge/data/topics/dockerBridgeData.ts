import type { KubeConcept, KubeDockerBridge } from './types';

export const DOCKER_BRIDGE_MAP: Record<string, KubeDockerBridge> = {
  'c-k8s-overview': {
    dockerEquivalent: 'Running containers on a single host with `docker run` or Docker Compose.',
    dockerCommand: 'docker run -d --name web -p 80:80 nginx',
    k8sEquivalent: 'A Deployment managing Pods across a multi-node cluster with a ClusterIP Service.',
    keyDifference: 'Docker runs containers on one machine; Kubernetes orchestrates hundreds of containers across dozens of physical or cloud servers.',
    whyK8sApproach: 'Provides automated self-healing, multi-node load balancing, rolling zero-downtime updates, and declarative desired-state management.',
  },

  'c-k8s-why-use': {
    dockerEquivalent: 'Manual bash scripts or Docker Swarm managing single-host container lifecycles.',
    dockerCommand: 'docker restart myapp',
    k8sEquivalent: 'Kubelet and Controller Manager continuously reconciling cluster state against desired YAML.',
    keyDifference: 'If a host crashes in Docker, your containers die until manually restarted. In Kubernetes, pods are instantly rescheduled onto healthy nodes.',
    whyK8sApproach: 'Ensures 99.99% high availability without manual human intervention or on-call midnight alerts.',
  },

  'c-k8s-architecture': {
    dockerEquivalent: 'Single monolithic Docker Daemon (`dockerd`) communicating with containerd and runc on one OS.',
    dockerCommand: 'systemctl status docker',
    k8sEquivalent: 'Distributed Control Plane (kube-apiserver, etcd, scheduler, controller-manager) coordinating distributed Worker Nodes (kubelet, kube-proxy, CRI).',
    keyDifference: 'Docker couples API, storage, and runtime into one process. Kubernetes splits responsibilities into independent micro-services for resilience.',
    whyK8sApproach: 'Eliminates single points of failure: the control plane can survive node failures, API surges, and network partitions.',
  },

  'c-k8s-containers-vs-pods': {
    dockerEquivalent: 'Single container running an isolated user process with its own network namespace.',
    dockerCommand: 'docker run -d --name web nginx',
    k8sEquivalent: 'A Pod wrapping one or more containers sharing a network namespace (`localhost`), IPC, and storage volumes.',
    keyDifference: 'Kubernetes never runs standalone containers directly. It creates a `pause` container that holds the network namespace, allowing multiple helper containers (sidecars) to collaborate over localhost.',
    whyK8sApproach: 'Enables powerful sidecar patterns (e.g., Envoy proxy, log forwarders) that enhance main application containers without polluting their image code.',
  },

  'c-k8s-declarative-vs-imperative': {
    dockerEquivalent: 'Imperative CLI commands executed in terminal: `docker run`, `docker stop`, `docker exec`.',
    dockerCommand: 'docker run -d -p 80:80 -m 512m --restart=always nginx',
    k8sEquivalent: 'Declarative YAML manifests stored in Git, applied via `kubectl apply -f manifest.yaml`.',
    keyDifference: 'Imperative tells the machine *how* to do something step-by-step; declarative tells the cluster *what state you want*, and Kubernetes figures out how to get there.',
    whyK8sApproach: 'Enables GitOps, reproducible staging/production environments, and automated drift correction.',
  },

  'c-pod-intro': {
    dockerEquivalent: '`docker run` executing a single container instance.',
    dockerCommand: 'docker run -d --name my-app my-image:1.0',
    k8sEquivalent: 'A Pod specification (`kind: Pod`) with containers, resources, volumes, and metadata.',
    keyDifference: 'A Docker container is a single isolated process; a Pod is the smallest deployable scheduling unit in Kubernetes, co-locating shared resources.',
    whyK8sApproach: 'Allows containers to share storage volumes and communicate via `localhost:PORT` without external routing.',
  },

  'c-pod-multi-container': {
    dockerEquivalent: 'Running two separate containers on a shared Docker bridge network communicating via container name.',
    dockerCommand: 'docker run --network mynet --name app myapp && docker run --network mynet --name agent agent',
    k8sEquivalent: 'Multi-container Pod with Main Container and Sidecar Container in the same `spec.containers` array.',
    keyDifference: 'In Docker, inter-container communication goes through a virtual bridge network. In a K8s multi-container Pod, they share the exact same network stack and communicate over `localhost`.',
    whyK8sApproach: 'Enables zero-latency telemetry proxies, log shippers, and configuration reloaders without opening external ports.',
  },

  'c-pod-lifecycle': {
    dockerEquivalent: 'Container statuses: `created`, `running`, `paused`, `restarting`, `exited`, `dead`.',
    dockerCommand: 'docker ps -a',
    k8sEquivalent: 'Pod phases: `Pending` -> `Running` -> `Succeeded`/`Failed`, plus container states (`Waiting`, `Running`, `Terminated`).',
    keyDifference: 'Kubernetes tracks both high-level Pod phase and individual container states, with built-in restart backoffs and probe conditions.',
    whyK8sApproach: 'Provides deep observability into initialization failures, image pull errors, and crash loops before routing user traffic.',
  },

  'c-deployments': {
    dockerEquivalent: 'Docker Compose with `docker compose up -d` or `docker compose up --scale web=3`.',
    dockerCommand: 'docker compose up -d --scale web=3',
    k8sEquivalent: 'Deployment controller managing a ReplicaSet with `replicas: 3` and rolling update strategy.',
    keyDifference: 'Docker Compose scales on a single machine and stops containers abruptly during updates. Kubernetes Deployments orchestrate zero-downtime rolling updates with surge and health verification.',
    whyK8sApproach: 'Delivers continuous deployment with automated rollbacks if newly deployed versions fail readiness probes.',
  },

  'c-services-overview': {
    dockerEquivalent: 'Docker host port mapping: `docker run -p 8080:80 nginx`.',
    dockerCommand: 'docker run -p 8080:80 nginx',
    k8sEquivalent: 'Kubernetes Service (`kind: Service`, `type: ClusterIP` or `NodePort`) fronting pods with dynamic label selectors.',
    keyDifference: 'In Docker, if a container restarts with a new IP, you must update configs manually. A Kubernetes Service assigns a persistent virtual IP (ClusterIP) that automatically load-balances across all healthy pods matching the selector.',
    whyK8sApproach: 'Decouples dynamic, ephemeral Pod IP addresses from persistent internal and external endpoints.',
  },

  'c-ingress-controllers': {
    dockerEquivalent: 'Reverse proxy container (e.g. Nginx, Traefik) configured with custom upstream conf files.',
    dockerCommand: 'docker run -p 80:80 -p 443:443 -v ./nginx.conf:/etc/nginx/nginx.conf nginx',
    k8sEquivalent: 'Ingress resource (`kind: Ingress`) programmed dynamically into Ingress Controllers (NGINX, Traefik, ALB).',
    keyDifference: 'In Docker, adding a new route requires editing proxy conf files and reloading NGINX. In K8s, creating an Ingress manifest automatically configures routing rules, SSL termination, and hostnames in real-time.',
    whyK8sApproach: 'Standardizes L7 routing across cloud providers and eliminates manual reverse-proxy maintenance.',
  },

  'c-configmaps': {
    dockerEquivalent: 'Passing environment variables via `-e KEY=VALUE` or `--env-file .env`.',
    dockerCommand: 'docker run -e DB_HOST=postgres --env-file .env myapp',
    k8sEquivalent: 'ConfigMap (`kind: ConfigMap`) decoupled from Pod manifests, mounted as environment variables or filesystem volumes.',
    keyDifference: 'In Docker, changing an env var requires recreating the container. In K8s, ConfigMaps mounted as volumes can update running apps live without container restarts.',
    whyK8sApproach: 'Implements 12-Factor App config separation, allowing identical container images across Dev, Staging, and Production.',
  },

  'c-secrets': {
    dockerEquivalent: 'Docker secrets (Swarm) or insecure environment variables and mounted files.',
    dockerCommand: 'docker run -e API_KEY=secret123 myapp',
    k8sEquivalent: 'Secret (`kind: Secret`) encrypted at rest in etcd, mounted as tmpfs in-memory volumes or environment variables.',
    keyDifference: 'Docker env vars are visible in `docker inspect` to anyone with docker access. Kubernetes Secrets can be RBAC-restricted and never touch the node disk.',
    whyK8sApproach: 'Protects database passwords, TLS certificates, and API tokens with strict least-privilege governance.',
  },

  'c-resource-limits': {
    dockerEquivalent: 'Docker flags: `docker run -m 512m --cpus=1.5 myapp`.',
    dockerCommand: 'docker run -m 512m --cpus=1.5 myapp',
    k8sEquivalent: 'Declarative `resources.requests` (for scheduling guarantees) and `resources.limits` (for cgroup throttling/OOMKill protection).',
    keyDifference: 'Docker only sets limits. Kubernetes differentiates between what an app *requests* (used by the scheduler to pick nodes) and the maximum *limit* it can consume before throttling.',
    whyK8sApproach: 'Prevents "noisy neighbor" problems and ensures optimal node packing without over-committing physical server resources.',
  },

  'c-volumes-storage': {
    dockerEquivalent: 'Named volumes (`docker volume create`) or bind mounts (`-v /host:/container`).',
    dockerCommand: 'docker run -v mydata:/var/lib/mysql mysql',
    k8sEquivalent: 'PersistentVolumeClaim (PVC) requesting persistent storage backed by cloud block storage via CSI drivers.',
    keyDifference: 'Docker volumes reside on the local host disk. If the container moves to another machine, the data is left behind. Kubernetes CSI attaches network block storage (AWS EBS, GCP PD) to whichever node runs the pod.',
    whyK8sApproach: 'Ensures database and stateful application data persists seamlessly even when worker nodes are destroyed or scaled down.',
  },

  'c-monitoring-probes': {
    dockerEquivalent: 'Dockerfile `HEALTHCHECK CMD curl -f http://localhost/ || exit 1`.',
    dockerCommand: 'HEALTHCHECK --interval=30s --timeout=3s CMD curl -f http://localhost/ || exit 1',
    k8sEquivalent: 'Three distinct probes: `startupProbe` (for slow boots), `livenessProbe` (for deadlock restarts), and `readinessProbe` (for traffic gating).',
    keyDifference: 'Docker healthchecks only tell you healthy/unhealthy. Kubernetes `readinessProbe` temporarily cuts traffic without restarting the container, preventing cascade failures during warmup.',
    whyK8sApproach: 'Eliminates dropped user requests during deployments by ensuring pods only receive traffic when ready.',
  },
};

export function getDockerBridgeForConcept(concept: KubeConcept): KubeDockerBridge {
  if (concept.dockerBridge) {
    return concept.dockerBridge;
  }

  if (DOCKER_BRIDGE_MAP[concept.id]) {
    return DOCKER_BRIDGE_MAP[concept.id];
  }

  const titleLower = concept.title.toLowerCase();

  if (titleLower.includes('network') || titleLower.includes('service') || titleLower.includes('dns')) {
    return {
      dockerEquivalent: 'Docker bridge networks (`docker network create`) and container-to-container DNS resolution.',
      dockerCommand: 'docker network create mynet && docker run --network mynet ...',
      k8sEquivalent: `Kubernetes ${concept.title}: cluster-wide CNI networking with CoreDNS service discovery.`,
      keyDifference: 'Docker networks are isolated to a single host. Kubernetes CNI provides an overlay network where every Pod across every node has a routable IP without NAT.',
      whyK8sApproach: 'Enables flat, seamless multi-node communication without port conflicts or manual host proxying.',
    };
  }

  if (titleLower.includes('storage') || titleLower.includes('volume') || titleLower.includes('pvc')) {
    return {
      dockerEquivalent: 'Docker volume (`docker volume create`) or bind mount (`-v`).',
      dockerCommand: 'docker run -v /data:/app/data myapp',
      k8sEquivalent: `Kubernetes ${concept.title}: decoupled persistent volume claims orchestrated by CSI storage drivers.`,
      keyDifference: 'Docker volumes are node-local. Kubernetes persistent storage detaches and reattaches dynamically to whichever node hosts the pod.',
      whyK8sApproach: 'Guarantees enterprise data durability across cloud availability zones and hardware maintenance.',
    };
  }

  if (titleLower.includes('security') || titleLower.includes('rbac') || titleLower.includes('policy')) {
    return {
      dockerEquivalent: 'Docker daemon security flags (`--user`, `--cap-drop`, `--security-opt`).',
      dockerCommand: 'docker run --user 1000:1000 --cap-drop=ALL myapp',
      k8sEquivalent: `Kubernetes ${concept.title}: cluster-wide RBAC, PodSecurityStandards, and SecurityContexts.`,
      keyDifference: 'Docker security is configured per command. Kubernetes enforces policies cluster-wide at the API admission controller layer before pods can even start.',
      whyK8sApproach: 'Enforces zero-trust defense-in-depth across multi-tenant production clusters.',
    };
  }

  if (titleLower.includes('autoscale') || titleLower.includes('hpa') || titleLower.includes('scale')) {
    return {
      dockerEquivalent: 'Manually executing `docker compose up --scale web=N` or writing custom bash monitoring scripts.',
      dockerCommand: 'docker compose up --scale web=5 -d',
      k8sEquivalent: `Kubernetes ${concept.title}: automated metric-driven scaling controller.`,
      keyDifference: 'Docker cannot scale autonomously based on real-time traffic. Kubernetes HPA observes CPU/memory/custom metrics and dynamically scales pods up and down.',
      whyK8sApproach: 'Saves cloud compute costs during quiet periods and automatically survives massive user traffic spikes.',
    };
  }

  return {
    dockerEquivalent: `Standalone Docker equivalent for ${concept.title}: host-level container command or Docker Compose service setting.`,
    dockerCommand: `docker run ${concept.commandPill || 'myapp'}`,
    k8sEquivalent: `Kubernetes ${concept.title}: cluster-orchestrated declarative controller resource.`,
    keyDifference: 'Docker manages local host processes; Kubernetes manages declarative desired state across an elastic multi-node cluster.',
    whyK8sApproach: 'Empowers engineering teams to manage thousands of containerized services with automated self-healing and zero manual toil.',
  };
}
