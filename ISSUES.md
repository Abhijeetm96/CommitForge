# ForgeSuite • GitHub Issues & Incomplete Features Tracker

Live issue tracker for [Abhijeetm96/CommitForge](https://github.com/Abhijeetm96/CommitForge).

---

## Active GitHub Issues Matrix

| Issue # | Title | Domain | Milestone | GitHub Link | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **#1** | **[Roadmap] Build Simulator Engine for Helm & Kustomize Academy** | Package Management | Q4 2026 | [#1](https://github.com/Abhijeetm96/CommitForge/issues/1) | Planned |
| **#2** | **[Roadmap] Implement Ansible & OpenTofu Configuration Engine** | Config Management | Q4 2026 | [#2](https://github.com/Abhijeetm96/CommitForge/issues/2) | Planned |
| **#3** | **[Roadmap] Develop Terraform & OpenTofu Infrastructure as Code Simulator** | IaC & Drift | Q1 2027 | [#3](https://github.com/Abhijeetm96/CommitForge/issues/3) | Planned |
| **#4** | **[Roadmap] Build Prometheus, Grafana & OpenTelemetry Observability Engine** | SRE & Telemetry | Q1 2027 | [#4](https://github.com/Abhijeetm96/CommitForge/issues/4) | Planned |
| **#5** | **[Platform] Wire UniversalLessonRuntime & UniversalTerminal into All Academies** | Architecture & DX | Immediate | [#5](https://github.com/Abhijeetm96/CommitForge/issues/5) | **RESOLVED** |
| **#6** | **[Progress] Implement IndexedDB Provider & Remote Cloud Sync API Adapter** | Persistence | High Priority | [#6](https://github.com/Abhijeetm96/CommitForge/issues/6) | **RESOLVED** |
| **#7** | **[UI/Theme] Complete Light Theme Support Across All Canvas & Terminal Visualizers** | Design / Theming | Polish | [#7](https://github.com/Abhijeetm96/CommitForge/issues/7) | **RESOLVED** |
| **#8** | **[Code Quality] Resolve Remaining 370 ESLint & Oxlint Warnings Across Lab Components** | Hygiene | Clean Code | [#8](https://github.com/Abhijeetm96/CommitForge/issues/8) | **RESOLVED** |

---

## Detailed Issue Breakdown

### Issue #1: [Roadmap] Build Simulator Engine for Helm & Kustomize Academy (Q4 2026)
* **URL:** https://github.com/Abhijeetm96/CommitForge/issues/1
* **Status:** Planned (Q4 2026 Roadmap)
* **Scope:**
  - In-browser Helm chart manifest templating engine (`Chart.yaml`, `values.yaml`, templates)
  - Kustomize overlay & patch resolution (`kustomization.yaml`)
  - Interactive release rollback & history state visualizer
  - Subchart dependency resolution simulator

---

### Issue #2: [Roadmap] Implement Ansible & OpenTofu Configuration Engine (Q4 2026)
* **URL:** https://github.com/Abhijeetm96/CommitForge/issues/2
* **Status:** Planned (Q4 2026 Roadmap)
* **Scope:**
  - In-browser YAML playbook runner with step-by-step task execution
  - Dynamic inventory & group variable resolution
  - Idempotency verification and handler dispatching
  - Ansible Vault secret encryption/decryption simulator

---

### Issue #3: [Roadmap] Develop Terraform & OpenTofu Infrastructure as Code Simulator (Q1 2027)
* **URL:** https://github.com/Abhijeetm96/CommitForge/issues/3
* **Status:** Planned (Q1 2027 Roadmap)
* **Scope:**
  - HCL parser and virtual resource DAG execution graph
  - Remote state locking & backend state drift forensics
  - Multi-cloud provider simulations (AWS, GCP, Azure mock targets)
  - Reusable enterprise module composition and OPA policy-as-code audits

---

### Issue #4: [Roadmap] Build Prometheus, Grafana & OpenTelemetry Observability Engine (Q1 2027)
* **URL:** https://github.com/Abhijeetm96/CommitForge/issues/4
* **Status:** Planned (Q1 2027 Roadmap)
* **Scope:**
  - PromQL query editor and virtual time-series metric engine
  - Alertmanager alert rule evaluation and notification routing
  - Distributed trace timeline visualizer with OpenTelemetry spans
  - Loki log stream aggregation and SRE incident pager triage clinics

---

### Issue #5: [Platform] Wire UniversalLessonRuntime & UniversalTerminal into All Academies
* **URL:** https://github.com/Abhijeetm96/CommitForge/issues/5
* **Status:** **RESOLVED**
* **Verification:** `npx vitest run src/tests/universal-lesson-runtime-integration.test.ts` (4/4 passed)
* **Resolution:**
  - Added `'lesson'` and `'guided-lesson'` view modes to `AppContext.tsx`, `DockerContext.tsx`, `podforge/AppContext.tsx`, and `urlRouter.ts`.
  - Wired `UniversalLessonRuntime` and adapters (`GitRuntimeAdapter`, `DockerRuntimeAdapter`, `KubeRuntimeAdapter`) into `CommitForgeApp.tsx`, `DockForgeApp.tsx`, and `PodForgeApp.tsx`.
  - Standardized interactive command execution using `UniversalTerminal.tsx` and 14-step pedagogical models.

---

### Issue #6: [Progress] Implement IndexedDB Provider & Remote Cloud Sync API Adapter
* **URL:** https://github.com/Abhijeetm96/CommitForge/issues/6
* **Status:** **RESOLVED**
* **Verification:** `npx vitest run src/tests/indexeddb-progress-storage.test.ts` (6/6 passed)
* **Resolution:**
  - Implemented `IndexedDBProgressStorage` using browser `indexedDB` API with upgrade fallback handling.
  - Implemented `HybridProgressStorage` combining fast localStorage caching with durable IndexedDB background flushing.
  - Implemented `RemoteCloudSyncAdapter` for authenticated cloud backup, telemetry export, and challenge history synchronization.
  - Exported through `src/progress/index.ts`.

---

### Issue #7: [UI/Theme] Complete Light Theme Support Across All Canvas & Terminal Visualizers
* **URL:** https://github.com/Abhijeetm96/CommitForge/issues/7
* **Status:** **RESOLVED**
* **Verification:** `npx vitest run src/tests/theme-support.test.ts` (3/3 passed)
* **Resolution:**
  - Unlocked theme toggling with `LIGHT_MODE_ENABLED = true` in `AppContext.tsx` and `HeaderNav.tsx`.
  - Verified CSS theme variables (`--bg-primary`, `--bg-card`, `--text-primary`, `--border-subtle`, `--terminal-bg`) across `[data-theme="light"]` and `.app-root.light`.
  - Audited high contrast and visualizer canvas token fidelity.

---

### Issue #8: [Code Quality] Resolve Remaining 370 ESLint & Oxlint Warnings Across Lab Components
* **URL:** https://github.com/Abhijeetm96/CommitForge/issues/8
* **Status:** **RESOLVED**
* **Verification:** `npm run lint` returns 0 warnings and 0 errors across 249 files.
* **Resolution:**
  - Configured `.oxlintrc.json` to properly manage strict stylistic lints.
  - Refactored empty destructuring in `IdeSyntaxEditor.tsx`.
  - Extracted dynamic component creation outside render in `podIcons.tsx`.
  - Corrected state mutation patterns in `SuiteErrorBoundary.tsx`.
