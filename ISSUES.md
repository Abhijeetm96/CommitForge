# ForgeSuite • GitHub Issues & Incomplete Features Tracker

Live issue tracker for [Abhijeetm96/CommitForge](https://github.com/Abhijeetm96/CommitForge).

---

## Active GitHub Issues Matrix

| Issue # | Title | Domain | Milestone | GitHub Link |
| :--- | :--- | :--- | :--- | :--- |
| **#1** | **[Roadmap] Build Simulator Engine for Helm & Kustomize Academy** | Package Management | Q4 2026 | [#1](https://github.com/Abhijeetm96/CommitForge/issues/1) |
| **#2** | **[Roadmap] Implement Ansible & OpenTofu Configuration Engine** | Config Management | Q4 2026 | [#2](https://github.com/Abhijeetm96/CommitForge/issues/2) |
| **#3** | **[Roadmap] Develop Terraform & OpenTofu Infrastructure as Code Simulator** | IaC & Drift | Q1 2027 | [#3](https://github.com/Abhijeetm96/CommitForge/issues/3) |
| **#4** | **[Roadmap] Build Prometheus, Grafana & OpenTelemetry Observability Engine** | SRE & Telemetry | Q1 2027 | [#4](https://github.com/Abhijeetm96/CommitForge/issues/4) |
| **#5** | **[Platform] Wire UniversalLessonRuntime & UniversalTerminal into All Academies** | Architecture & DX | Immediate | [#5](https://github.com/Abhijeetm96/CommitForge/issues/5) |
| **#6** | **[Progress] Implement IndexedDB Provider & Remote Cloud Sync API Adapter** | Persistence | High Priority | [#6](https://github.com/Abhijeetm96/CommitForge/issues/6) |
| **#7** | **[UI/Theme] Complete Light Theme Support Across All Canvas & Terminal Visualizers** | Design / Theming | Polish | [#7](https://github.com/Abhijeetm96/CommitForge/issues/7) |
| **#8** | **[Code Quality] Resolve Remaining 370 ESLint & Oxlint Warnings Across Lab Components** | Hygiene | Clean Code | [#8](https://github.com/Abhijeetm96/CommitForge/issues/8) |

---

## Detailed Issue Breakdown

### Issue #1: [Roadmap] Build Simulator Engine for Helm & Kustomize Academy (Q4 2026)
* **URL:** https://github.com/Abhijeetm96/CommitForge/issues/1
* **Scope:**
  - In-browser Helm chart manifest templating engine (`Chart.yaml`, `values.yaml`, templates)
  - Kustomize overlay & patch resolution (`kustomization.yaml`)
  - Interactive release rollback & history state visualizer
  - Subchart dependency resolution simulator

---

### Issue #2: [Roadmap] Implement Ansible & OpenTofu Configuration Engine (Q4 2026)
* **URL:** https://github.com/Abhijeetm96/CommitForge/issues/2
* **Scope:**
  - In-browser YAML playbook runner with step-by-step task execution
  - Dynamic inventory & group variable resolution
  - Idempotency verification and handler dispatching
  - Ansible Vault secret encryption/decryption simulator

---

### Issue #3: [Roadmap] Develop Terraform & OpenTofu Infrastructure as Code Simulator (Q1 2027)
* **URL:** https://github.com/Abhijeetm96/CommitForge/issues/3
* **Scope:**
  - HCL parser and virtual resource DAG execution graph
  - Remote state locking & backend state drift forensics
  - Multi-cloud provider simulations (AWS, GCP, Azure mock targets)
  - Reusable enterprise module composition and OPA policy-as-code audits

---

### Issue #4: [Roadmap] Build Prometheus, Grafana & OpenTelemetry Observability Engine (Q1 2027)
* **URL:** https://github.com/Abhijeetm96/CommitForge/issues/4
* **Scope:**
  - PromQL query editor and virtual time-series metric engine
  - Alertmanager alert rule evaluation and notification routing
  - Distributed trace timeline visualizer with OpenTelemetry spans
  - Loki log stream aggregation and SRE incident pager triage clinics

---

### Issue #5: [Platform] Wire UniversalLessonRuntime & UniversalTerminal into All Academies
* **URL:** https://github.com/Abhijeetm96/CommitForge/issues/5
* **Scope:**
  - Wire `UniversalLessonRuntime` into `CommitForgeApp.tsx`, `PodForgeApp.tsx`, and `DockForgeApp.tsx`
  - Standardize terminal execution using `UniversalTerminal.tsx`
  - Replace bespoke SVG diagrams with `BlockDiagramRenderer.tsx`

---

### Issue #6: [Progress] Implement IndexedDB Provider & Remote Cloud Sync API Adapter
* **URL:** https://github.com/Abhijeetm96/CommitForge/issues/6
* **Scope:**
  - Implement `IndexedDBProgressStorage` class conforming to `ProgressStorage` interface
  - Support large telemetry dumps, challenge replay logs, and terminal recordings
  - Design optional remote sync API adapter for authenticated cloud backup

---

### Issue #7: [UI/Theme] Complete Light Theme Support Across All Canvas & Terminal Visualizers
* **URL:** https://github.com/Abhijeetm96/CommitForge/issues/7
* **Scope:**
  - Audit all visualizer stages in CommitForge, PodForge, and DockForge
  - Connect canvas background fills to CSS theme variables (`var(--bg-card)`, `var(--terminal-bg)`)
  - Test high contrast in both Dark and Light themes

---

### Issue #8: [Code Quality] Resolve Remaining 370 ESLint & Oxlint Warnings Across Lab Components
* **URL:** https://github.com/Abhijeetm96/CommitForge/issues/8
* **Scope:**
  - Clean up unreferenced variables/parameters in `LabsHubView.tsx` and `ConceptTeachingEngine.tsx`
  - Prune unused Lucide icon imports across components
  - Target zero warnings on `npm run lint`
