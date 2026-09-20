# CommitForge — Interactive Git & Version Control Academy

CommitForge is the flagship Git engineering academy of **Forge Suite**, running alongside **PodForge** (`src/podforge/`).

## Architecture & Encapsulation

* **`CommitForgeApp.tsx`**: Top-level academy container and view router.
* **`git-engine/`**: High-fidelity in-browser Git simulation engine (DAG commit graphs, object database, staging tree, merge & rebase forensics).
* **`data/`**: 18 canonical topics, 71 interactive concepts, practice challenges, hospital cases, and capstone projects.
* **`components/`**:
  * `academy/`: Canonical curriculum, syntax explorer, universal concept view, sandbox.
  * `ide/`: Developer IDE with integrated virtual terminal, editor, and live file tree.
  * `labs/`: Recovery & diagnosis simulations (Break-it, Conflict Arena, Undo Lab, Hospital).
  * `visualizer/`: Three-area visualizer, Git DAG graph, internals inspector.
  * `animation/`: Git movie visualizer & physics engine.
  * `layout/`: CommitForge HeaderNav sub-navigation and suite switcher.
  * `navigation/`: Command Atlas modal (`Cmd+K`).
  * `practice/`: Practice missions and interactive exercises.
  * `terminal/`: High-performance terminal emulator.
  * `tutor/`: Interactive Forge Tutor, onboarding, and "I'm Lost" drawers.
* **`context/`**: Local academy state integration.
