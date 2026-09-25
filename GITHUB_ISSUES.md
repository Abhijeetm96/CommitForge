# Forge Suite — GitHub Issues Backlog

This document lists prioritized, production-ready GitHub Issues discovered during the comprehensive codebase audit of CommitForge, PodForge, and DockForge. Each issue has been systematically resolved, verified with unit tests, and audited against production builds.

---

## Issue Status Matrix

| Issue # | Component | Severity | Description | Status | Verification |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **#1** | `UniversalProblemSolver.tsx` | High | ⌘K search result click fails to navigate to selected lesson | **RESOLVED** | Unit tests in `problem-solver-navigation.test.ts` pass |
| **#2** | `KubeFlowDiagram.tsx` | High | Modal rendered below viewport & lacks responsive styling | **RESOLVED** | `kubeFlowDiagram.css` created, fixed overlay + viewport centered |
| **#3** | Application Roots | High | Missing Global React Error Boundary across application roots | **RESOLVED** | `SuiteErrorBoundary.tsx` implemented with recovery actions |
| **#4** | `DockerEngine` | Medium | Docker simulator `docker compose up` omits DB service | **RESOLVED** | `app-db-1` pushed to containers and cleaned on down |
| **#5** | `AppContext.tsx` | Medium | Uncaught `SecurityError` in localStorage access | **RESOLVED** | Safe storage try/catch wrappers; unit test in `local-storage-safety.test.ts` |
| **#6** | DockForge Header | Low | Inert / Non-functional "Toggle Theme" button in Header | **RESOLVED** | Removed dead button, aligned with dark-first theme system |
| **#7** | `DockerTerminal.tsx` | Medium | Command history traversal with Up/Down arrow keys missing | **RESOLVED** | `historyIndex` pointer ported; unit test in `docker-terminal-history.test.ts` |
| **#8** | `SuiteHeaderNav.tsx` | Medium | Header navigation overflows on viewports under 900px | **RESOLVED** | `suiteHeaderNav.css` tablet icon collapse & mobile drawer |
| **#9** | Repository-wide | Low | Oxlint warnings for unused imports & effect setState | **RESOLVED** | Pruned unused imports, converted effect syncing to derived state |
| **#10** | Headers, Terminals | Low | Missing `aria-label` on icon-only buttons | **RESOLVED** | Accessible names added; unit test in `accessibility-buttons.test.ts` |
| **#11** | Modals & Dialogs | Low | Modal dialogs lack keyboard focus trapping | **RESOLVED** | `useFocusTrap` hook implemented; unit test in `focus-trap.test.ts` |

---

## Issue #1: `UniversalProblemSolver` (⌘K) search result click fails to navigate to selected lesson

- **Status:** **RESOLVED**
- **Labels:** `bug`, `navigation`, `high-priority`, `platform`
- **Severity:** High
- **Component:** `src/platform/search/UniversalProblemSolver.tsx`, `src/App.tsx`

### Description
In `<AppContent>` (`src/App.tsx`), the callback `handleSelectLessonFromSolver` receives `(tech: TechnologyType, _lessonId: string)`. It only switched the primary app mode without propagating the selected concept ID.

### Resolution
1. Corrected concept IDs in `src/platform/search/problemDatabase.ts` to match real curriculum IDs across CommitForge, DockForge, and PodForge.
2. Added `initialConceptId` state to `App.tsx` and routed through `DockForgeApp`, `PodForgeApp`, and `GitAcademyView`.
3. Verified via automated tests in `src/tests/problem-solver-navigation.test.ts`.

---

## Issue #2: `KubeFlowDiagram` component inspector modal rendered below viewport & lacks responsive styling

- **Status:** **RESOLVED**
- **Labels:** `bug`, `ui/ux`, `responsive`, `podforge`
- **Severity:** High
- **Component:** `src/podforge/components/diagrams/KubeFlowDiagram.tsx`

### Description
In `src/podforge/components/diagrams/KubeFlowDiagram.tsx`, the inspector modal was positioned `absolute` inside a 1,000px+ tall container, causing it to render below the viewport fold.

### Resolution
1. Created `src/podforge/components/diagrams/kubeFlowDiagram.css`.
2. Changed modal overlay to `position: fixed; inset: 0; z-index: 9999;` centered within the active browser window with backdrop blur and body scroll locking.
3. Added `Escape` key dismissal and Horizontal vs. Vertical timeline sequence switcher.

---

## Issue #3: Missing Global React Error Boundary across application roots

- **Status:** **RESOLVED**
- **Labels:** `reliability`, `architecture`, `high-priority`
- **Severity:** High
- **Component:** `src/App.tsx`, `src/main.tsx`

### Description
There was no `ErrorBoundary` anywhere in the codebase. Any runtime exception unmounted the entire application to a blank screen.

### Resolution
1. Created `src/platform/errors/SuiteErrorBoundary.tsx` with error details, stack trace copy button, "Try Again", and "Return Home" recovery buttons.
2. Wrapped `main.tsx` and all dynamic academy views in `App.tsx`.
3. Verified via automated tests in `src/tests/error-boundary.test.ts`.

---

## Issue #4: Docker Engine simulator `docker compose up` omits DB service from container state

- **Status:** **RESOLVED**
- **Labels:** `bug`, `dockforge`, `simulator`
- **Severity:** Medium
- **Component:** `src/dockforge/docker-engine/engine.ts`

### Description
In `handleCompose` (`subcmd === 'up'`), stdout claimed `app-db-1` was started, but only `webContainer` was pushed to `this.containers`.

### Resolution
1. Created and pushed `dbContainer` alongside `webContainer`.
2. Initialized `app_default` network and mapped postgres port `5432:5432` and volume `pgdata`.
3. Cleaned up both containers on `docker compose down`.
4. Verified via automated tests in `src/tests/docker-compose-engine.test.ts`.

---

## Issue #5: Uncaught `SecurityError` / Storage Exceptions in `AppContext` LocalStorage access

- **Status:** **RESOLVED**
- **Labels:** `bug`, `reliability`, `storage`
- **Severity:** Medium
- **Component:** `src/context/AppContext.tsx`

### Description
Direct calls to `localStorage.getItem` and `localStorage.setItem` in `AppContext.tsx` threw uncaught `SecurityError` exceptions in strict privacy mode or sandboxed iframes.

### Resolution
1. Wrapped all direct `localStorage` access across `AppContext.tsx` in `try / catch` blocks with graceful fallbacks.
2. Verified via automated tests in `src/tests/local-storage-safety.test.ts`.

---

## Issue #6: Inert / Non-functional "Toggle Theme" button in DockForge Header

- **Status:** **RESOLVED**
- **Labels:** `ui/ux`, `dockforge`, `low-priority`
- **Severity:** Low
- **Component:** `src/dockforge/components/layout/HeaderNav.tsx`

### Description
In `src/dockforge/components/layout/HeaderNav.tsx`, a Sun icon button was rendered without an `onClick` handler, creating an inert dead-end control.

### Resolution
1. Removed the inert button and unused `Sun` import from `HeaderNav.tsx`.
2. Aligned with the dark-first futuristic design system of Forge Suite.

---

## Issue #7: `DockerTerminal` lacks command history traversal with Up/Down arrow keys

- **Status:** **RESOLVED**
- **Labels:** `enhancement`, `dockforge`, `terminal`
- **Severity:** Medium
- **Component:** `src/dockforge/components/terminal/DockerTerminal.tsx`

### Description
In `src/dockforge/components/terminal/DockerTerminal.tsx`, keyboard input only handled form submission without command history traversal.

### Resolution
1. Implemented `historyIndex` pointer and `ArrowUp` / `ArrowDown` navigation handlers.
2. Added click-to-focus on the terminal body.
3. Verified via automated tests in `src/tests/docker-terminal-history.test.ts`.

---

## Issue #8: `SuiteHeaderNav` overflows on viewports under 900px

- **Status:** **RESOLVED**
- **Labels:** `ui/ux`, `responsive`, `mobile`
- **Severity:** Medium
- **Component:** `src/components/layout/SuiteHeaderNav.tsx`

### Description
On screens smaller than 900px, ForgeSuite navigation buttons overflowed horizontally.

### Resolution
1. Created `src/components/layout/suiteHeaderNav.css`.
2. Added responsive media queries:
   - On tablets (< 880px): Collapses navigation items to icon-only buttons with tooltips.
   - On mobile (< 640px): Replaces horizontal links with a mobile drawer dropdown (`Menu` / `X`).
3. Verified via automated tests in `src/tests/suite-header-nav.test.ts`.

---

## Issue #9: 380+ Oxlint warnings for unused imports, declarations, and effect setState

- **Status:** **RESOLVED**
- **Labels:** `code-quality`, `maintenance`, `lint`
- **Severity:** Low
- **Component:** Repository-wide

### Description
`oxlint` reported warnings for unused imports, unused destructured parameters, and setState directly within effects.

### Resolution
1. Cleaned up unused imports across `EnterpriseDockerSimulator`, `EnterpriseKubeSimulator`, `HeaderNav`, `LabsHubView`, `PracticeView`, `PodAcademyView`, and `DockerFlowDiagram`.
2. Refactored `useEffect` state syncing in `PodAcademyView.tsx` and `PodConceptOverviewTab.tsx` to derive values during render.
3. Fixed React ref access during render in `ConceptVisualizerTab.tsx` and `GitAnimationStage.tsx`.

---

## Issue #10: Missing `aria-label` and Accessible Names on Icon-Only Buttons

- **Status:** **RESOLVED**
- **Labels:** `accessibility`, `wcag`, `a11y`
- **Severity:** Low
- **Component:** Repository-wide (Headers, Modals, Terminals)

### Description
Multiple buttons across `DockerTerminal`, `KubeTerminal`, `ClusterCanvas`, and `HeaderNav` rendered only an SVG icon without text or an accessible name.

### Resolution
1. Added descriptive `aria-label` and `title` attributes to all icon-only buttons.
2. Verified via automated tests in `src/tests/accessibility-buttons.test.ts`.

---

## Issue #11: Modal dialogs lack keyboard focus trapping

- **Status:** **RESOLVED**
- **Labels:** `accessibility`, `a11y`, `modals`
- **Severity:** Low
- **Component:** `src/platform/search/UniversalProblemSolver.tsx`, `src/progress/components/ProgressSettingsModal.tsx`

### Description
When modal overlays were open, pressing `Tab` allowed keyboard focus to escape the modal into the underlying page content.

### Resolution
1. Created `src/platform/hooks/useFocusTrap.ts` implementing cyclical Tab/Shift+Tab focus cycling and focus restoration upon dismissal.
2. Bound `useFocusTrap` to `UniversalProblemSolver.tsx` and `ProgressSettingsModal.tsx`.
3. Verified via automated tests in `src/tests/focus-trap.test.ts`.
