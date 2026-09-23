// src/platform/search/problemDatabase.ts
import { ProblemDiagnosis } from './types';

export const UNIVERSAL_PROBLEM_DIAGNOSES: ProblemDiagnosis[] = [
  // --- GIT PROBLEMS ---
  {
    id: 'git-undo-commit',
    title: 'I want to undo my last commit without losing my edits',
    symptom: 'Committed premature changes or misspelled commit message.',
    technology: 'git',
    category: 'History Recovery',
    frequency: 'critical',
    whyItHappened:
      'Git records commits as immutable snapshots. Moving forward created a new commit object, but the working files remain safe.',
    mentalModelExplanation:
      'A commit is just a pointer advanced forward. Soft reset moves the HEAD pointer back to the previous commit while leaving your staging area and working files completely untouched.',
    remedyCommand: 'git reset --soft HEAD~1',
    explanationOfFix:
      'HEAD is rewritten to point to HEAD~1. Your uncommitted work remains staged in the index, allowing you to re-commit cleanly.',
    preventativeTip: 'Use git status before committing to verify staged files.',
    relatedLessonId: 'topic-01-c3',
    relatedLessonTitle: 'git commit (Snapshots)',
  },
  {
    id: 'git-deleted-branch',
    title: 'I accidentally deleted a branch with unmerged work',
    symptom: 'Deleted branch via git branch -D and fear changes are gone forever.',
    technology: 'git',
    category: 'Branch Management',
    frequency: 'common',
    whyItHappened:
      'Deleting a branch only removes the human-readable pointer in .git/refs/heads. The underlying commit objects remain in the database for days.',
    mentalModelExplanation:
      'The reflog records every position of HEAD. Finding the SHA where the branch was deleted allows resurrecting it instantly.',
    remedyCommand: 'git reflog\ngit checkout -b restored-branch <commit-sha>',
    explanationOfFix:
      'Locate the commit right before the deletion in the reflog, then recreate a branch pointer at that exact commit SHA.',
    preventativeTip: 'Never use -D (force delete) unless you are 100% sure you want to discard the branch.',
    relatedLessonId: 'topic-03-c1',
    relatedLessonTitle: 'git branch & reflog',
  },
  {
    id: 'git-push-rejected',
    title: 'Git push rejected: non-fast-forward / remote contains work you do not have',
    symptom: 'Error: failed to push some refs to remote origin. Updates were rejected.',
    technology: 'git',
    category: 'Collaboration',
    frequency: 'critical',
    whyItHappened:
      'A teammate pushed commits to the remote branch while you were working locally. Remote history has diverged.',
    mentalModelExplanation:
      'Git rejects pushes that would overwrite someone else\'s commits. You must pull remote commits first and replay your local commits on top.',
    remedyCommand: 'git pull --rebase origin main',
    explanationOfFix:
      'Rebase fetches remote commits, rewinds your local commits, applies remote commits, and then replays your commits sequentially.',
    preventativeTip: 'Always pull before starting work or pushing new commits.',
    relatedLessonId: 'topic-04-c2',
    relatedLessonTitle: 'git pull & rebase',
  },

  // --- DOCKER PROBLEMS ---
  {
    id: 'docker-oom-killed',
    title: 'Docker container exited with code 137 (OOMKilled)',
    symptom: 'Container died abruptly; docker inspect shows ExitCode 137 and OOMKilled: true.',
    technology: 'docker',
    category: 'Resource Limits',
    frequency: 'critical',
    whyItHappened:
      'The process inside the container tried to allocate more RAM than allowed by cgroups or available on the host.',
    mentalModelExplanation:
      'Linux cgroups monitor memory consumption. When a container exceeds its memory ceiling, the Linux kernel Out-Of-Memory (OOM) killer sends SIGKILL (exit code 128 + 9 = 137) to prevent host exhaustion.',
    remedyCommand: 'docker run -d --memory="1g" --memory-swap="2g" -p 8080:80 my-app:latest',
    explanationOfFix:
      'Increase the container memory limit using --memory flag or optimize the internal application heap settings (e.g. NODE_OPTIONS="--max-old-space-size=...").',
    preventativeTip: 'Profile container memory consumption in staging with docker stats before deploying to production.',
    relatedLessonId: 'c-docker-run-flags',
    relatedLessonTitle: 'docker run Resource Limits & cgroups',
  },
  {
    id: 'docker-port-conflict',
    title: 'Port is already allocated / address already in use',
    symptom: 'Error response from daemon: driver failed programming external connectivity on endpoint: Bind for 0.0.0.0:8080 failed.',
    technology: 'docker',
    category: 'Networking',
    frequency: 'critical',
    whyItHappened:
      'Another container or a host process (e.g. local Apache or Node.js) is already listening on host port 8080.',
    mentalModelExplanation:
      'The host network stack can only bind one process per port per interface. The container internal port (80) can stay the same, but the host port must be unique.',
    remedyCommand: 'docker ps --filter "publish=8080"\n# Or map to another host port:\ndocker run -d -p 8081:80 nginx',
    explanationOfFix:
      'Either stop the conflicting container with docker stop, or map the container port to a free host port like 8081.',
    preventativeTip: 'Avoid hardcoding port 8080 across multiple microservices; use reverse proxies or dynamic ports.',
    relatedLessonId: 'c-running-containers',
    relatedLessonTitle: 'docker run -p (Port Mapping)',
  },
  {
    id: 'docker-db-connection',
    title: 'Application container cannot connect to database container (connection refused)',
    symptom: 'Web app container crashes with ECONNREFUSED when trying to connect to localhost:5432.',
    technology: 'docker',
    category: 'Container Networks',
    frequency: 'critical',
    whyItHappened:
      'localhost inside a container refers to the container itself (its own isolated network namespace), not the host or database container.',
    mentalModelExplanation:
      'Each container has its own private loopback interface (lo). To communicate, containers must join a shared user-defined Docker bridge network where Docker provides automatic DNS resolution by container name.',
    remedyCommand: 'docker network create app-net\ndocker run -d --name db --network app-net postgres\ndocker run -d --name web --network app-net -e DB_HOST=db my-web-app',
    explanationOfFix:
      'Connecting both containers to app-net enables the web app to connect to hostname "db:5432" using Docker internal DNS.',
    preventativeTip: 'Never use the default bridge network in production; user-defined bridge networks provide container DNS resolution.',
    relatedLessonId: 'c-cli-networks',
    relatedLessonTitle: 'Docker User-Defined Bridge Networks',
  },

  // --- KUBERNETES PROBLEMS ---
  {
    id: 'k8s-crashloop-backoff',
    title: 'Pod stuck in CrashLoopBackOff status',
    symptom: 'Pod restarts repeatedly; status shows CrashLoopBackOff with restart count increasing.',
    technology: 'kubernetes',
    category: 'Workload Health',
    frequency: 'critical',
    whyItHappened:
      'The container starts, but its main process exits with an error code (missing environment variable, failed DB connection, or syntax error). Kubelet restarts it with exponential backoff delay.',
    mentalModelExplanation:
      'Kubernetes enforces desired state by restarting failing pods. Inspecting the previous crash logs reveals the fatal stack trace.',
    remedyCommand: 'kubectl logs <pod-name> --previous\nkubectl describe pod <pod-name>',
    explanationOfFix:
      'Run kubectl logs with --previous to view stderr right before the crash, then correct the container configuration or manifest.',
    preventativeTip: 'Add readiness and liveness probes with appropriate initialDelaySeconds to avoid premature kills.',
    relatedLessonId: 'k8s-pods',
    relatedLessonTitle: 'Kubernetes Pod Lifecycle & Diagnostics',
  },
  {
    id: 'k8s-pending-nodes',
    title: 'Pod stuck in Pending state (0/3 nodes available)',
    symptom: 'Pod stays Pending indefinitely; kubectl describe shows "0/3 nodes available: insufficient cpu/memory".',
    technology: 'kubernetes',
    category: 'Scheduling',
    frequency: 'critical',
    whyItHappened:
      'The kube-scheduler evaluated all cluster worker nodes, but none met the requested resources, node affinity, or taint tolerations.',
    mentalModelExplanation:
      'Pods only get scheduled on nodes with sufficient allocatable capacity matching spec.containers[*].resources.requests.',
    remedyCommand: 'kubectl describe pod <pod-name>\nkubectl top nodes\nkubectl scale deployment <name> --replicas=1',
    explanationOfFix:
      'Check the Events section of kubectl describe pod to see the exact constraint. Reduce resource requests in the deployment YAML or add more cluster nodes.',
    preventativeTip: 'Set realistic resource requests and limits; over-requesting causes artificial cluster exhaustion.',
    relatedLessonId: 'k8s-deployments',
    relatedLessonTitle: 'Kubernetes Scheduler & Resource Requests',
  },
  {
    id: 'k8s-service-no-endpoints',
    title: 'Kubernetes Service returns 404 or connection refused (Endpoints empty)',
    symptom: 'Traffic to Service ClusterIP times out; kubectl get endpoints shows <none>.',
    technology: 'kubernetes',
    category: 'Networking',
    frequency: 'critical',
    whyItHappened:
      'The Service selector labels (spec.selector) do not match the labels in the Pod manifest (spec.template.metadata.labels).',
    mentalModelExplanation:
      'Services are virtual IP load balancers. They dynamically discover pods using label selectors. If there is a label typo, zero endpoints are registered.',
    remedyCommand: 'kubectl get service <service-name> -o yaml\nkubectl get pods --show-labels',
    explanationOfFix:
      'Compare service spec.selector with pod labels. Ensure key-value pairs match exactly.',
    preventativeTip: 'Standardize label conventions across your Helm charts and manifests.',
    relatedLessonId: 'k8s-services',
    relatedLessonTitle: 'Kubernetes Services & Endpoint Discovery',
  },
];
