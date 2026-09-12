# COMMITFORGE

> **Build. Break. Fix. Commit.**  
> The Interactive Git & Developer Learning Academy

CommitForge is an interactive, browser-native learning academy engineered to take developers from **Zero Knowledge ➔ Beginner ➔ Intermediate ➔ Advanced ➔ Professional ➔ Expert**.

Rather than passive documentation reading or mock command buttons, CommitForge places learners inside an authentic software development environment combining **VS Code, Git CLI, GitHub, an interactive Commit DAG Graph, an emergency troubleshooting laboratory (Git Hospital), and coding challenges**.

---

## 🌟 Key Features

### 1. In-Memory Deterministic Git Engine
- **Single Source of Truth**: The terminal, code editor, file explorer, visualizers, and state inspector all derive state from the exact same in-memory Git model.
- **Three-Area State Lifecycle**: Working Directory ➔ Staging Area (Index) ➔ Local Repository (HEAD) ➔ Remote (GitHub).
- **Commit DAG Graph**: Interactive SVG DAG with branch pointers, HEAD badge, tags, and clickable commit nodes.
- **Git Internals Object Database**: Inspect raw `.git/objects` (`Commit`, `Tree`, `Blob`) with SHA-1 fingerprints and raw payloads.

### 2. Live Runnable Application Sandboxes
- Every major project is more than static files—it runs live inside a sandboxed iframe.
- Test changes in real-time before committing (e.g. adding items to the Coffee Shop cart or fixing checkout promo codes in the E-Commerce store).

### 3. Progressive Training-Wheel Removal & Developer Missions
- 4 Progression Modes:
  - **Beginner**: Detailed step-by-step guidance.
  - **Intermediate**: Clear objective with helpful clues.
  - **Advanced**: Objective only.
  - **Expert**: Real-world problem description without command sequences.
- **Predict Before Execute**: Mental model challenge prior to running critical commands, tracking prediction accuracy.
- **"What's Git Thinking?" HUD**: Persistent natural-language status bar explaining repository state in plain English.
- **"Why Did This Happen?" Explanations**: Interactive state transition breakdown after important operations (e.g. comparing `git reset --soft` vs `--mixed` vs `--hard`).

### 4. Specialized Interactive Laboratories
- **Undo Lab**: 6 practical scenarios covering accidental edits, wrong staging, early commits, and public branch recovery.
- **Conflict Arena**: Merge conflict battleground with visual conflict marker breakdowns (`<<<<<<< HEAD`, `=======`, `>>>>>>>`) and in-editor conflict resolution buttons.
- **Git Hospital**: 16 emergency patient cases (Detached HEAD, lost commits, non-fast-forward push rejections, leaked secrets) where learners diagnose symptoms and administer cures.
- **Team Sim (Two-Developer Collaboration)**: Split-screen simulation of Developer A (Abhijeet) and Developer B (Rahul) demonstrating race conditions, push rejections, and `git fetch` vs `git pull`.
- **Capstone ("Your First Day as a Developer")**: 5-phase team assignment (Ticket #184) on a production bug with colleagues Abhijeet, Rahul, Priya, Sarah, and David, generating **"YOUR GIT PROFILE"** scorecard across 10 competency dimensions.
- **Searchable Command Reference & Comparisons**: Encyclopedia with risk levels (SAFE, LOW, MEDIUM, HIGH, VERY HIGH) and side-by-side interactive comparisons.

---

## 🚀 Getting Started

### Prerequisites
- Node.js >= 18.0.0
- npm >= 9.0.0

### Installation
```bash
git clone https://github.com/your-username/commitforge.git
cd commitforge
npm install
```

### Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### Automated Testing
Run the 15-point automated test suite validating the Git engine:
```bash
npm test
```

### Production Build
```bash
npm run build
npm run preview
```

---

## 🏗️ Architecture

```
/src
  /git-engine           # In-memory deterministic Git engine
    /commands           # Modular CLI command handlers (init, status, add, commit, branch, merge, reset, etc.)
    engine.ts           # GitEngine core orchestrator & snapshot manager
    types.ts            # Complete Git repository & state interfaces
    parser.ts           # Tokenizer & command-line parser
    diff.ts             # Unified line-by-line diff engine
    danger.ts           # Risk rating system (SAFE, LOW, MEDIUM, HIGH, VERY HIGH)
    stateInspector.ts   # Plain-English repository status generator
    internals.ts        # Git Object DB extractor (Commit, Tree, Blob)
    hash.ts             # Git SHA-1 fingerprint generator
  /components
    /layout             # HeaderNav, project switcher, instruction mode toggles
    /visualizer         # ThreeAreaVisualizer, GitGraph, GitStateInspector, InternalsModal
    /editor             # CodeEditor, FileExplorer, AppPreview sandbox
    /terminal           # Monospace CLI terminal with danger confirmation modals
    /panels             # LessonPanel (Predict, Task, Hints, Validation)
    /labs               # UndoLab, ConflictArena, GitHospital, TwoDev, Capstone, CommandReference
    /dashboard          # DashboardView with progress metrics and mastery breakdown
  /context              # AppContext provider managing global state
  /data                 # Curriculum (Levels 0-12), 10 Projects, Undo & Hospital scenarios, Capstone
  /tests                # Vitest automated test suite
```

---

## 📖 Curriculum Progression (Levels 0 to 12)

- **Level 0**: Computer & Terminal Fundamentals (`pwd`, `ls`, `cd`, `mkdir`, `touch`, `cat`)
- **Level 1**: Git Fundamentals (`init`, `status`, `add`, `commit`, `log`, `diff`, `show`)
- **Level 2**: Everyday Git & Quality (`.gitignore`, secret detection, selective staging, commit quality)
- **Level 3**: History & Recovery (`restore`, `reset --soft/mixed/hard`, `revert`, Undo Lab)
- **Level 4**: Branches & Exploration (`branch`, `switch`, `checkout`, movable pointers)
- **Level 5**: Merging & Conflict Arena (Fast-forward, 3-way merge, conflict resolution)
- **Level 6**: GitHub & Remotes (`remote`, `fetch`, `pull`, `push`, Two-Developer simulation)
- **Level 7**: Pull Requests & Team Workflow (PR reviews, simulated teammate feedback)
- **Level 8**: Professional Git (`stash`, `tag`, `cherry-pick`, `clean`, `blame`, `bisect`)
- **Level 9**: Rebase & Clean History (`rebase`, `rebase -i` squash/reword/drop)
- **Level 10**: Troubleshooting & Git Hospital (Detached HEAD, Reflog rescue, 16 ER cases)
- **Level 11**: Advanced Git (Worktrees, submodules, git hooks, config)
- **Level 12**: Git Internals (Object DB, Blobs, Trees, Commits, SHA-1)

---

## 🛠️ Extending CommitForge

### How to Add a New Lesson
1. Open `src/data/curriculum.ts`.
2. Add a new `Lesson` object into the `LESSONS` array:
   - Provide `id`, `level`, `title`, `mission`, `whyItMatters`, `concept`, `task`, `predict`, `hints`, `solution`, and a `validate: (repo) => { passed: boolean; message: string }` function.
3. The lesson will automatically appear in the Learning Path progression.

### How to Add a New Project
1. Open `src/data/projects.ts`.
2. Add a new project definition to `PROJECTS`:
   - Include `id`, `name`, `category`, `description`, `files` (with `index.html`, `style.css`, etc.), and `previewEntryPoint`.
3. The project will automatically populate in the top-bar project switcher and render in the Live App Sandbox.

### How to Add a New Git Command
1. Create or open the relevant module in `src/git-engine/commands/`.
2. Implement the command function receiving `(cmd: ParsedCommand, repo: GitRepo): CommandResult`.
3. Register the subcommand in `src/git-engine/engine.ts`.
4. Add automated test coverage in `src/tests/git-engine.test.ts`.

---

## 📄 License
MIT License. Built for interactive developer education.
