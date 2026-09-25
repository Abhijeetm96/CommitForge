# Forge Suite — GitHub Issues Backlog

This document lists prioritized, production-ready GitHub Issues discovered during the comprehensive codebase audit of CommitForge, PodForge, and DockForge. Each issue is formatted with standard GitHub Issue metadata (Labels, Severity, Expected vs. Actual Behavior, Reproducible Code References, and Proposed Fixes) for direct copy-paste into GitHub Issues.

---

## Issue #1: `UniversalProblemSolver` (⌘K) search result click fails to navigate to selected lesson

- **Labels:** `bug`, `navigation`, `high-priority`, `platform`
- **Severity:** High
- **Component:** `src/platform/search/UniversalProblemSolver.tsx`, `src/App.tsx`

### Description
In `<AppContent>` (`src/App.tsx`), the callback `handleSelectLessonFromSolver` receives `(tech: TechnologyType, _lessonId: string)`. It only switches the primary app mode:
```tsx
const handleSelectLessonFromSolver = (tech: TechnologyType, _lessonId: string) => {
  if (tech === 'git') setMode('learn');
  else if (tech === 'docker') setMode('dockforge');
  else if (tech === 'kubernetes') setMode('podforge');
};
```
The parameter `_lessonId` is ignored. When a user searches for an error or concept in the Universal Problem Solver (via ⌘K / Ctrl+K) and clicks **"Open Lesson: [Title] ➜"**, the app switches to the academy but fails to activate the selected lesson/concept, leaving the user on whichever concept was already active.

### Expected Behavior
Clicking "Open Lesson" should navigate directly to the specific concept ID matching `_lessonId` in CommitForge, DockForge, or PodForge.

### Proposed Fix
Pass `lessonId` through to the appropriate context:
1. For Git: Call `setActiveLessonConcept(lessonId)` in `AppContext`.
2. For Docker: Update `activeConceptId` and `activeTopicId` in `DockerContext`.
3. For Kubernetes: Update `activeConceptId` in PodForge's `AppContext`.

---

## Issue #2: `KubeFlowDiagram` component inspector modal rendered below viewport & lacks responsive styling

- **Labels:** `bug`, `ui/ux`, `responsive`, `podforge`
- **Severity:** High
- **Component:** `src/podforge/components/diagrams/KubeFlowDiagram.tsx`

### Description
In `src/podforge/components/diagrams/KubeFlowDiagram.tsx` (lines 1170–1200), the Component Inspector modal is positioned with `position: 'absolute'; inset: 0;` inside the diagram container card:
```tsx
<div
  style={{
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(5, 10, 24, 0.88)',
    ...
```
Because the diagram card can be 1,000px+ tall, when a user clicks any architectural block to inspect it, the modal dialog renders far below the user's viewport fold. Users must scroll down the page to find it. Additionally:
- The component relies entirely on inline styles with fixed pixel widths (`270px`).
- In pipeline mode, blocks wrap into multiple rows, causing horizontal arrows to point into blank space.
- There is no mobile timeline / vertical sequence toggle.

### Expected Behavior
- The modal overlay should be `position: 'fixed'; inset: 0; z-index: 9999;` centered within the active browser window with backdrop blur and scroll locking.
- Responsive breakpoints and layout direction controls should support narrow viewports.

### Proposed Fix
Mirror the responsive refactor implemented in `DockerFlowDiagram`:
1. Create `src/podforge/components/diagrams/kubeFlowDiagram.css`.
2. Switch modal overlay to `position: fixed`.
3. Add a canvas display toggle (`Horizontal Track` vs. `Vertical Sequence`).
4. Support `Escape` key dismissal.

---

## Issue #3: Missing Global React Error Boundary across application roots

- **Labels:** `reliability`, `architecture`, `high-priority`
- **Severity:** High
- **Component:** `src/App.tsx`, `src/main.tsx`

### Description
There is no `ErrorBoundary` or `componentDidCatch` anywhere in the codebase. If any runtime error or unhandled exception occurs (such as an unexpected SVG coordinate calculation, malformed JSON in localStorage, or an edge-case syntax error in a simulator), the entire React root unmounts and leaves the user with a completely blank screen.

### Expected Behavior
If an unexpected rendering error occurs in an academy module or visualizer, an `<ErrorBoundary>` should capture the error and display an informative error card with a "Reset State" or "Return Home" action.

### Proposed Fix
Create a reusable `<SuiteErrorBoundary>` component:
```tsx
export class SuiteErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean; error: Error | null }> {
  ...
}
```
Wrap root views in `App.tsx` and each academy module (`CommitForgeApp`, `PodForgeApp`, `DockForgeApp`).

---

## Issue #4: Docker Engine simulator `docker compose up` omits DB service from container state

- **Labels:** `bug`, `dockforge`, `simulator`
- **Severity:** Medium
- **Component:** `src/dockforge/docker-engine/engine.ts`

### Description
In `src/dockforge/docker-engine/engine.ts` (`handleCompose`), when handling `subcmd === 'up'`:
```tsx
this.containers.push(webContainer);

return {
  rawCommand,
  stdout: [
    '[-] Creating 2/2',
    ' ✔ Network app_default     Created',
    ' ✔ Container app-db-1      Started',
    ' ✔ Container app-web-1     Started',
  ],
  whatHappened: 'Started Docker Compose stack (services: app-web-1, app-db-1).',
};
```
Although stdout claims `app-db-1` was started, only `webContainer` is pushed to `this.containers`. If the user executes `docker compose up` followed by `docker ps` or `docker inspect app-db-1`, `app-db-1` is missing.

### Expected Behavior
Both `app-web-1` and `app-db-1` should be added to `this.containers` upon `docker compose up`, and removed upon `docker compose down`.

### Proposed Fix
Create and push `dbContainer` into `this.containers` in `handleCompose` alongside `webContainer`.

---

## Issue #5: Uncaught `SecurityError` / Storage Exceptions in `AppContext` LocalStorage access

- **Labels:** `bug`, `reliability`, `storage`
- **Severity:** Medium
- **Component:** `src/context/AppContext.tsx`

### Description
In `src/context/AppContext.tsx` (lines 181–203):
```tsx
const [instructionMode, setInstructionModeState] = useState<InstructionMode>(() => {
  return (localStorage.getItem('commitforge_instruction_mode') as InstructionMode) || 'beginner';
});
```
Direct calls to `localStorage.getItem` and `localStorage.setItem` are executed outside of `try / catch` blocks. In strict privacy environments (e.g., private browsing mode with third-party storage restrictions or embedded sandboxed iframes), reading `window.localStorage` throws a fatal `SecurityError`, halting JavaScript execution.

### Expected Behavior
All `localStorage` operations should fail gracefully and fall back to in-memory defaults.

### Proposed Fix
Wrap all `localStorage` reads and writes in `try / catch` blocks or reuse the `safeStorage` helper from `src/progress/progressStorage.ts`.

---

## Issue #6: Inert / Non-functional "Toggle Theme" button in DockForge Header

- **Labels:** `ui/ux`, `dockforge`, `low-priority`
- **Severity:** Low
- **Component:** `src/dockforge/components/layout/HeaderNav.tsx`

### Description
In `src/dockforge/components/layout/HeaderNav.tsx` (line 303), a theme toggle button with a `Sun` icon is rendered:
```tsx
<button
  style={{ ... }}
  title="Toggle Theme"
>
  <Sun size={15} />
</button>
```
The button has no `onClick` handler. Clicking it produces no visual change or state update. Furthermore, `LIGHT_MODE_ENABLED` in `AppContext.tsx` is hardcoded to `false`.

### Expected Behavior
Interactive controls should either perform their designated action or be omitted until the feature is implemented.

### Proposed Fix
Either wire the button to the global theme switcher or hide it until light mode is fully supported across all DockForge components.

---

## Issue #7: `DockerTerminal` lacks command history traversal with Up/Down arrow keys

- **Labels:** `enhancement`, `dockforge`, `terminal`
- **Severity:** Medium
- **Component:** `src/dockforge/components/terminal/DockerTerminal.tsx`

### Description
In `src/dockforge/components/terminal/DockerTerminal.tsx`, keyboard input only handles form submission. Pressing `ArrowUp` or `ArrowDown` does not navigate through previously executed commands. In contrast, `src/podforge/components/terminal/KubeTerminal.tsx` implements a full `historyIndex` pointer allowing quick command recall.

### Expected Behavior
Pressing the Up arrow should recall previously executed Docker commands, and the Down arrow should move forward in history.

### Proposed Fix
Port the `historyIndex` and `onKeyDown` navigation logic from `KubeTerminal.tsx` into `DockerTerminal.tsx`.

---

## Issue #8: `SuiteHeaderNav` overflows on viewports under 900px

- **Labels:** `ui/ux`, `responsive`, `mobile`
- **Severity:** Medium
- **Component:** `src/components/layout/SuiteHeaderNav.tsx`

### Description
`src/components/layout/SuiteHeaderNav.tsx` renders the ForgeSuite logo, 4 full academy buttons (`CommitForge`, `DockForge`, `PodForge`, `Roadmap`), and right utility buttons (`Progress`, `Search ⌘K`) in a single horizontal flex line with `height: 60px` and no media queries. On screens smaller than ~900px, the navigation items overflow the viewport, clipping the rightmost actions or overlapping the center items.

### Expected Behavior
On tablets and mobile screens (< 850px), the navbar should collapse buttons into icons or offer a mobile hamburger menu.

### Proposed Fix
Add responsive media queries in CSS:
- Hide button text and show only icons on screens between 640px and 850px.
- Collapse into a mobile dropdown drawer on screens < 640px.

---

## Issue #9: 380+ Oxlint warnings for unused imports, declarations, and effect setState

- **Labels:** `code-quality`, `maintenance`, `lint`
- **Severity:** Low
- **Component:** Repository-wide

### Description
Running `npm run lint` (`oxlint`) reports 382 warnings across 231 files:
- Unused imports (e.g., `Zap`, `TerminalIcon`, `HelpCircle`, `Layers`, `Film`).
- Unused destructured state variables (e.g., `setMode`, `setActiveLab` in `LabsHubView.tsx`).
- React Compiler warnings (`Avoid calling setState() directly within an effect` in `PodAcademyView.tsx:61`).

### Proposed Fix
Run `oxlint --fix` to prune unused imports, prefix unused variables with `_`, and refactor `useEffect` state syncing to derive state directly during rendering.

---

## Issue #10: Missing `aria-label` and Accessible Names on Icon-Only Buttons

- **Labels:** `accessibility`, `wcag`, `a11y`
- **Severity:** Low
- **Component:** Repository-wide (Headers, Modals, Terminals)

### Description
Multiple buttons in `HeaderNav.tsx`, `DockerTerminal.tsx`, and `ClusterCanvas.tsx` render only an SVG icon (e.g., trash icon for Clear Terminal, close icon `X` in modals) without text or an `aria-label`. Screen reader users cannot determine the function of these controls.

### Expected Behavior
All interactive buttons without visible text should have a descriptive `aria-label`.

### Proposed Fix
Add `aria-label` attributes to all icon-only buttons across all components.

---

## Issue #11: Modal dialogs lack keyboard focus trapping

- **Labels:** `accessibility`, `a11y`, `modals`
- **Severity:** Low
- **Component:** `src/platform/search/UniversalProblemSolver.tsx`, `src/progress/components/ProgressSettingsModal.tsx`

### Description
When modal overlays (`UniversalProblemSolver`, `ProgressSettingsModal`, `InternalsModal`) are open, pressing the `Tab` key allows keyboard focus to escape the modal into the underlying page content.

### Expected Behavior
Focus should cycle exclusively through focusable elements within the active modal until dismissed.

### Proposed Fix
Implement a standard `useFocusTrap` hook and bind it to modal container elements.
