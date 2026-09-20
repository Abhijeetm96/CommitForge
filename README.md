# FORGE SUITE

> **Master the Modern Cloud & DevOps Stack.**  
> Interactive, browser-native engineering simulators. Real command engines, visual DAGs, live cluster topologies, emergency triage laboratories, and professional developer sandboxes. Zero slides. Zero fluff.

[![Tests](https://img.shields.io/badge/Tests-84%2F84%20Passing-success?style=for-the-badge&logo=vitest)](file:///c:/Users/abhis/OneDrive/Desktop/CommitForge)
[![Build](https://img.shields.io/badge/Vite%20Build-Passing-blue?style=for-the-badge&logo=vite)](file:///c:/Users/abhis/OneDrive/Desktop/CommitForge)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue?style=for-the-badge&logo=typescript)](file:///c:/Users/abhis/OneDrive/Desktop/CommitForge)
[![React](https://img.shields.io/badge/React-19.x-61dafb?style=for-the-badge&logo=react)](file:///c:/Users/abhis/OneDrive/Desktop/CommitForge)
[![Agentation MCP](https://img.shields.io/badge/Agentation%20MCP-v1.2.0-8a2be2?style=for-the-badge)](https://www.agentation.com/mcp)

---

## 🌟 Table of Contents

1. [Overview & Vision](#-overview--vision)
2. [Live Academies in Forge Suite](#-live-academies-in-forge-suite)
   - [CommitForge (Git & Version Control)](#1-commitforge--git--version-control-academy)
   - [PodForge (Kubernetes & Cloud Orchestration)](#2-podforge--kubernetes--cloud-orchestration-academy)
   - [Upcoming Cloud & DevOps Roadmap](#3-upcoming-cloud--devops-roadmap)
3. [Architecture & Folder Structure](#-architecture--folder-structure)
4. [Two-Tier Styling Architecture](#-two-tier-styling-architecture)
5. [Granular Installation & Setup Guide](#-granular-installation--setup-guide)
   - [System Requirements & Prerequisites](#prerequisites)
   - [Step 1: Clone Repository](#step-1-clone-the-repository)
   - [Step 2: Environment & Version Checks](#step-2-verify-runtime-environment)
   - [Step 3: Install Node Dependencies](#step-3-install-dependencies)
   - [Step 4: Launch Development Server](#step-4-launch-the-development-server)
   - [Step 5: (Optional) Set Up Agentation MCP](#step-5-optional-set-up-agentation-mcp-server)
6. [Available NPM Scripts](#-available-npm-scripts)
7. [Automated Testing Suite (84/84 Tests)](#-automated-testing-suite)
8. [Production Build & Deployment](#-production-build--deployment)
9. [Extending the Platform (Developer Guide)](#-extending-the-platform-developer-guide)
10. [Troubleshooting & FAQ](#-troubleshooting--faq)
11. [License](#-license)

---

## 🧭 Overview & Vision

**Forge Suite** is a unified multi-academy learning ecosystem for engineers, SREs, and cloud architects. Rather than watching passive tutorials or clicking mock buttons, learners practice directly inside **high-fidelity in-browser simulation engines**:

* **Authentic Command-Line Interfaces**: Real command parsing, subcommands, flags, arguments, pipes, and realistic error responses.
* **Deterministic Visual Physics**: Live SVG DAG commit trees, cluster node and pod mesh topographies, stage transition animations, and diff viewers.
* **Emergency Triage Laboratories**: Diagnose real-world catastrophic failure modes (detached HEADs, corrupted indexes, merge conflicts, `CrashLoopBackOff`, OOMKills, DNS resolution failures) with interactive step-by-step resolution.
* **Single Source of Truth**: The terminal, code editor, file explorer, visualizer, and state inspector all derive state from the same in-memory virtual state engine.

---

## 🎓 Live Academies in Forge Suite

### 1. CommitForge — Git & Version Control Academy
* **Core Curriculum**: 18 canonical topics, 71 interactive concepts structured from fundamentals to advanced plumbing.
* **Virtual Git Engine**: Deterministic in-browser Git simulation tracking the Three-Area Lifecycle (Working Directory ➔ Staging Tree ➔ Commit Graph ➔ Remotes).
* **Interactive Visualizers**:
  * Three-Area Live State Visualizer
  * Animated SVG Commit DAG Graph with branch pointers and tags
  * `.git/objects` Internals Inspector (`Commit`, `Tree`, `Blob` objects with SHA-1 hashing)
* **Specialized Laboratories**:
  * **Undo Lab**: 6 practical scenarios covering accidental edits, index resets, commit amend, and public branch rollback.
  * **Conflict Arena**: Merge conflict battleground featuring visual conflict markers (`<<<<<<< HEAD`, `=======`, `>>>>>>>`) and in-editor resolution.
  * **Git Hospital**: 16 emergency patient cases with triage symptoms, diagnostic commands, and surgical remedies.
  * **Team Sim (Two-Developer Collaboration)**: Split-screen simulation of Developer A and Developer B demonstrating race conditions and upstream push rejections.
  * **Capstone ("Your First Day as a Developer")**: 5-phase production bug triage producing a personalized **Git Competency Profile**.

### 2. PodForge — Kubernetes & Cloud Orchestration Academy
* **Core Curriculum**: 16 chapters, 56 interactive concepts covering containers, Pods, Deployments, Services, Ingress, NetworkPolicies, StatefulSets, Gateway API, and CRDs.
* **Virtual K8s Control Plane**: High-fidelity Kubernetes engine with a simulated reconciliation loop, etcd state store, controller manager, and scheduler.
* **Interactive Visualizers**:
  * Dynamic cluster topology canvas rendering master nodes, worker nodes, pods, replica sets, and namespaces.
  * Real-time pod lifecycle state transitions (`Pending` ➔ `ContainerCreating` ➔ `Running` ➔ `CrashLoopBackOff` ➔ `Terminated`).
* **Kubernetes Laboratories**:
  * **Cluster IDE**: Full YAML manifest editor with live validation and `kubectl apply -f` execution.
  * **Triage Labs**: Break-and-fix incident response for failing liveness probes, missing Service selectors, and RBAC permission denials.
  * **Live Mesh**: Real-time network topology visualizer mapping Services, CoreDNS, and Ingress routing.

### 3. Upcoming Cloud & DevOps Roadmap
Forge Suite is actively expanding with specialized academies marked for upcoming releases:
* 🐳 **Dockernaut** (`Docker & OCI Runtimes`): Multi-stage Dockerfiles, distroless builds, BuildKit caching, and bridge networking.
* 🚀 **PipelinePilot** (`GitHub Actions & ArgoCD`): CI/CD matrix pipelines, declarative GitOps reconciliation, and progressive canary delivery.
* ☁️ **TerraStack** (`Terraform & OpenTofu`): Infrastructure as Code (IaC), remote state locking, drift forensics, and reusable modules.
* 📈 **ObserveIQ** (`Prometheus & Grafana`): Full-stack telemetry, PromQL queries, OpenTelemetry distributed tracing, and incident triage.
* 🛡️ **DevSecShield** (`Vault & Trivy Security`): Container CVE scanning, dynamic secrets leasing with Vault, and zero-trust policies.
* 🐧 **LinuxCore** (`Linux Kernel & eBPF`): Linux namespaces, cgroups v2, socket forensics, and eBPF kernel instrumentation.

---

## 🏗️ Architecture & Folder Structure

```
CommitForge/
├── .gemini/                       # IDE & agent configurations
├── dist/                          # Production bundle output
├── node_modules/                  # Installed dependencies
├── public/                        # Static public assets
├── src/
│   ├── commitforge/               # 📦 CommitForge Academy (Git & Version Control)
│   │   ├── components/            # Academy UI (Academy, IDE, Labs, Visualizer, Animation, Tutor)
│   │   │   └── layout/HeaderNav.tsx # CommitForge sub-navigation bar (Learn, Practice, Labs, IDE, Reference)
│   │   ├── context/AppContext.tsx # CommitForge local context integration
│   │   ├── data/                  # 18 Topics, 71 Concepts, Challenges, Hospital Cases, Projects
│   │   ├── git-engine/            # Virtual Git DAG engine, staging tree, diff, danger analyzer
│   │   ├── styles/                # 🎨 Academy-specific styles
│   │   │   └── commitforge.css    # Scoped overrides & custom rules for CommitForge
│   │   ├── CommitForgeApp.tsx     # Top-level CommitForge academy container
│   │   ├── index.ts               # Barrel export for CommitForge
│   │   └── README.md              # CommitForge architecture documentation
│   │
│   ├── podforge/                  # 📦 PodForge Academy (Kubernetes & Cloud Orchestration)
│   │   ├── components/            # Pod Academy, Triage Labs, Cluster IDE, Live Mesh
│   │   │   └── layout/HeaderNav.tsx # PodForge sub-navigation bar (Academy, Labs, IDE, Cluster)
│   │   ├── context/AppContext.tsx # PodForge local context & virtual control plane state
│   │   ├── data/                  # 16 Chapters, 56 K8s concepts, scenarios, quiz data
│   │   ├── kube-engine/           # Virtual K8s control plane & reconciliation engine
│   │   ├── styles/                # 🎨 Academy-specific styles
│   │   │   └── podforge.css       # Scoped overrides & custom rules for PodForge
│   │   ├── PodForgeApp.tsx        # Top-level PodForge academy container
│   │   └── index.ts               # Barrel export for PodForge
│   │
│   ├── styles/                    # 🌐 Global Shared Styles (Tier 1 Foundation)
│   │   ├── index.css              # Single global stylesheet (tokens, dark/light themes, typography, utilities)
│   │   └── README.md              # Global styling documentation
│   │
│   ├── components/                # 🌐 Suite-Level Shared Components
│   │   ├── home/                  # ForgeSuiteHomeView.tsx (Suite portal homepage on `/`)
│   │   └── layout/                # SuiteHeaderNav.tsx (Suite portal top navbar on `/`)
│   │
│   ├── context/                   # AppContext.tsx (Global Suite state & active academy routing)
│   ├── services/                  # Shared sound effects & audio feedback
│   ├── tests/                     # 12 Vitest automated test suites (84 tests)
│   ├── App.tsx                    # Root router between ForgeSuiteHome, CommitForge, PodForge
│   ├── index.css                  # Re-export from src/styles/index.css
│   └── main.tsx                   # Vite application entry point importing src/styles/index.css
│
├── .gitignore                     # Git ignore rules
├── index.html                     # HTML entry point with title and meta headers
├── package.json                   # Project metadata, dependencies, scripts
├── tsconfig.json                  # TypeScript compiler configuration
├── tsconfig.app.json              # Application TS configuration
├── tsconfig.node.json             # Vite/Node TS configuration
├── vite.config.ts                 # Vite bundler configuration
└── README.md                      # Complete project documentation
```

---

## 🎨 Two-Tier Styling Architecture

Forge Suite enforces a strict **two-tier styling model**:

```
┌─────────────────────────────────────────────────────────────────┐
│            Tier 1: Global Shared Styles (src/styles/)           │
│  - Fonts: Inter (sans-serif) & Fira Code (monospace)           │
│  - Design Tokens: --bg-app, --git-orange, --k8s-blue, --border  │
│  - Dark / Light Theme System & Variables                       │
│  - Shared Terminal, Button, Card, Badge & Modal Utilities       │
│  - Shared Animations: keyframe pulses, glows, floating elements │
└────────────────────────────────┬────────────────────────────────┘
                                 │
                 ┌───────────────┴───────────────┐
                 ▼                               ▼
┌────────────────────────────────┐ ┌────────────────────────────────┐
│ Tier 2: CommitForge Scoped     │ │ Tier 2: PodForge Scoped        │
│ (src/commitforge/styles/)      │ │ (src/podforge/styles/)         │
│ - commitforge.css              │ │ - podforge.css                 │
│ - Git visualizer overrides     │ │ - Cluster canvas overrides     │
│ - DAG graph node theme         │ │ - Pod mesh node theme          │
└────────────────────────────────┘ └────────────────────────────────┘
```

1. **Global Styles (`src/styles/index.css`)**:
   - Imported globally at `src/main.tsx`.
   - Accessible by every component, view, and academy.
   - Contains all design tokens, resets, light/dark themes, and common utility classes.
2. **Academy-Scoped Styles (`src/<academy>/styles/<academy>.css`)**:
   - Imported directly by the respective academy's top-level container (`CommitForgeApp.tsx` or `PodForgeApp.tsx`).
   - Encapsulates academy-specific styling without creating CSS collisions.

---

## 🚀 Granular Installation & Setup Guide

### Prerequisites

Ensure your system meets the following baseline requirements:

| Tool | Minimum Version | Recommended Version | Verification Command |
| :--- | :--- | :--- | :--- |
| **Node.js** | `v18.0.0` | `v20.x LTS` or `v22.x LTS` | `node -v` |
| **npm** | `v9.0.0` | `v10.x` or higher | `npm -v` |
| **Git** | `v2.30.0` | Latest | `git --version` |
| **OS** | Windows 10/11, macOS 12+, Ubuntu 20.04+ | Any 64-bit OS | `uname -a` or `systeminfo` |

---

### Step 1: Clone the Repository

Open your preferred terminal (PowerShell, Command Prompt, or Bash/Zsh) and clone the repository:

#### Using HTTPS:
```bash
git clone https://github.com/Abhijeetm96/CommitForge.git
cd CommitForge
```

#### Using SSH:
```bash
git clone git@github.com:Abhijeetm96/CommitForge.git
cd CommitForge
```

---

### Step 2: Verify Runtime Environment

Check that Node.js and npm are properly registered in your system's `PATH`:

```bash
# Verify Node.js version (must be >= 18.0.0)
node -v

# Verify npm version (must be >= 9.0.0)
npm -v
```

> [!TIP]
> If you manage multiple Node.js versions, use **NVM** (Node Version Manager):
> ```bash
> nvm install 20
> nvm use 20
> ```

---

### Step 3: Install Dependencies

Run a clean installation of all project dependencies:

```bash
npm install
```

For strict CI-compatible deterministic builds, you can also use:
```bash
npm ci
```

---

### Step 4: Launch the Development Server

Start the local Vite development server with Hot Module Replacement (HMR):

```bash
npm run dev
```

You should see output similar to:
```text
  VITE v8.3.0  ready in 284 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

Open your browser and navigate to:
👉 **[http://localhost:5173/](http://localhost:5173/)**

#### Custom Port or Host Binding:
To bind to a custom port or expose to your local network:
```bash
# Run on port 3000
npm run dev -- --port 3000

# Expose to local network (useful for mobile/tablet testing)
npm run dev -- --host
```

---

### Step 5: (Optional) Set Up Agentation MCP Server

CommitForge includes native integration with **Agentation** (`agentation-mcp`), allowing AI coding assistants (Claude Desktop, Antigravity IDE, Cursor) to inspect active user sessions, capture annotations, and provide real-time pair-programming feedback.

#### 1. Test Agentation MCP Server Doctor:
```bash
npx agentation-mcp doctor
```

#### 2. Start Agentation MCP Server in Background (Port 4747):
```bash
npx agentation-mcp server
```

#### 3. Configure in AI Client:
Add the following configuration to your MCP configuration file (`mcp_config.json` or `claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "agentation": {
      "command": "npx",
      "args": ["agentation-mcp", "server"]
    }
  }
}
```

---

## 💻 Available NPM Scripts

All commands are defined in `package.json`:

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts Vite local development server with instant Hot Module Replacement. |
| `npm test` | Runs the full Vitest automated test suite once (`vitest run`). |
| `npm run build` | Compiles TypeScript types (`tsc -b`) and bundles production assets with Vite. |
| `npm run preview` | Locally serves the compiled production bundle (`dist/`) for verification. |
| `npm run lint` | Runs `oxlint` high-performance linter across all source files. |

---

## 🧪 Automated Testing Suite

CommitForge features **84 automated tests across 12 test suites** validating the virtual Git engine, Kubernetes engine, and curriculum coverage.

### Run All Tests:
```bash
npm test
```

### Run Tests in Watch Mode (During Active Development):
```bash
npx vitest
```

### Run a Specific Test Suite:
```bash
# Test the virtual Git engine
npx vitest run src/tests/git-engine.test.ts

# Test complete Git command coverage
npx vitest run src/tests/command-coverage.test.ts

# Test Git physics and animation system
npx vitest run src/tests/animation-system.test.ts

# Test Kubernetes control plane curriculum
npx vitest run src/podforge/kube-engine/curriculum.test.ts

# Test all 18 topics curriculum integrity
npx vitest run src/tests/all-topics-curriculum.test.ts
```

### Test Suite Coverage Breakdown:
1. `git-engine.test.ts` (15 tests) — Validates virtual commits, staging index, branch switching, merge DAGs, and object DB extraction.
2. `command-coverage.test.ts` (10 tests) — Validates subcommands across `git init`, `git add`, `git commit`, `git status`, `git branch`, `git checkout`, `git merge`, `git log`, `git diff`, and `git reset`.
3. `animation-system.test.ts` (10 tests) — Validates state diffing, node velocity physics, and causal "Why Did Git Do That?" stories.
4. `academy-unified.test.ts` (7 tests) — Validates structure of the 18 canonical topics and 71 interactive concepts.
5. `learning-ux.test.ts` (5 tests) — Validates pedagogical mastery tracking and training-wheel levels.
6. `forge-suite-portal.test.ts` (4 tests) — Validates cross-academy routing and suite portal state.
7. `all-topics-curriculum.test.ts` (4 tests) — Audits that all 71 concepts contain complete analogies, syntax breakdowns, and 3-step visual stages.
8. `curriculum.test.ts` (4 tests) — Audits 16 Kubernetes chapters and 56 Kubernetes concepts.
9. `visualization-all-topics.test.ts` (3 tests) — Ensures 100% visualization coverage across all concepts.
10. `references-all-topics.test.ts` (2 tests) — Ensures 100% reference coverage, official docs, and CLI options.
11. `practice-all-topics.test.ts` (2 tests) — Ensures 100% practice lab challenges with seeds and expected commands.

---

## 📦 Production Build & Deployment

### Build the Static Bundle:
```bash
npm run build
```

This command runs TypeScript type checking (`tsc -b`) followed by Vite optimization. Output is generated in the `dist/` directory:
```
dist/
├── index.html                   # HTML entry point
├── assets/
│   ├── index-[hash].css         # Bundled and minified styles
│   └── index-[hash].js          # Minified JavaScript bundle
```

### Preview the Production Build Locally:
```bash
npm run preview
```
Open the provided local URL (typically `http://localhost:4173/`) to inspect the production build before deployment.

### Deployment Targets:
The contents of `dist/` are 100% static client assets and can be deployed anywhere:
* **Vercel**: Run `vercel` in root.
* **Netlify**: Set build command `npm run build` and publish directory `dist`.
* **Cloudflare Pages**: Set build command `npm run build` and output folder `dist`.
* **GitHub Pages**: Build and push `dist` to a `gh-pages` branch.
* **Docker / Nginx**: Copy `dist/` into `/usr/share/nginx/html`.

---

## 🛠️ Extending the Platform (Developer Guide)

### 1. Adding a New Concept to CommitForge
1. Open or create a topic file in `src/commitforge/data/academyTopics/` (e.g. `topic01_basics.ts`).
2. Define the concept with:
   - `id`: Unique identifier (e.g. `c-git-restore`).
   - `title`, `command`, `difficulty`: Metadata.
   - `inSimpleWords`, `whyDoYouNeedIt`, `realWorldAnalogy`: Conceptual foundations.
   - `syntaxCode`, `syntaxTokens`: Interactive tokenized syntax explorer.
   - `actionStage`: Three-phase state (`before`, `running`, `after`).
   - `challenge`: Practical coding lab with `seedCommands` and `expectedCommands`.
3. Register the topic in `src/commitforge/data/unifiedAcademyData.ts`.
4. Run `npm test` to verify automatic curriculum audit tests pass!

### 2. Adding a New Chapter to PodForge
1. Open `src/podforge/data/topics.ts`.
2. Add a new `KubeChapter` definition to `KUBE_CHAPTERS`.
3. Provide concepts with `conceptId`, `title`, `summary`, `realWorldScenario`, `yamlExample`, and `kubectlCommand`.
4. Run `npm test` to ensure `curriculum.test.ts` passes.

### 3. Adding Academy-Specific Custom Styling
* For CommitForge: Add styles in `src/commitforge/styles/commitforge.css`.
* For PodForge: Add styles in `src/podforge/styles/podforge.css`.
* For Global Tokens/Theme: Add styles in `src/styles/index.css`.

---

## ❓ Troubleshooting & FAQ

### Port `5173` is already in use
If another application is running on port `5173`, Vite will automatically pick the next available port (e.g. `5174`). If you want to force a specific port:
```bash
npm run dev -- --port 5200
```

### Node.js version incompatibility
If you see errors related to modern JavaScript features or unsupported engine warnings:
```bash
# Check your version
node -v

# Update to Node 20 LTS using nvm
nvm install 20
nvm use 20
```

### Windows PowerShell Execution Policy Error
If you encounter `File ...\npm.ps1 cannot be loaded because running scripts is disabled on this system`:
```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
```

### TypeScript build error (`tsc -b`)
To view verbose TypeScript compiler errors without bundling:
```bash
npx tsc --noEmit
```

---

## 📄 License

This project is licensed under the **MIT License**.  
Built with ❤️ for developer education, cloud-native engineering, and open-source mastery.
