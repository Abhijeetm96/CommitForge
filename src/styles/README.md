# Forge Suite — Styling Architecture

Forge Suite uses a clean **two-tier styling architecture**:

### 1. Global Shared Foundation (`src/styles/index.css`)
Imported globally at application root (`src/main.tsx`):
- **Shared Typography**: Google Fonts `Inter` (sans-serif) and `Fira Code` (monospace).
- **Shared Design Tokens**: CSS custom properties for dark/light themes, color scales (`--git-orange`, `--k8s-blue`, `--dockernaut-blue`, `--pipeline-purple`, etc.).
- **Shared Layout & Suite Navigation**: Header nav, breadcrumbs, suite-switcher popovers, status bars.
- **Shared Component Styles**: Terminal emulator, code editors, badges, cards, buttons, diff inspectors, modals, drawers.
- **Shared Micro-Animations & Responsive Breakpoints**: Keyframes for status pulses, glows, floating elements, and mobile media queries.

---

### 2. Academy-Scoped Custom Styles (Within Respective Academy Folders)
Each academy can maintain its own custom stylesheets, animations, or overrides strictly within its own folder:
- **CommitForge**: `src/commitforge/styles/commitforge.css` (imported by `CommitForgeApp.tsx`)
- **PodForge**: `src/podforge/styles/podforge.css` (imported by `PodForgeApp.tsx`)
- **Future Academies**: `src/<academy>/styles/<academy>.css` (imported by `<Academy>App.tsx`)

This structure ensures:
1. All core design tokens and themes remain shared and consistent across the whole suite.
2. Any academy-specific styling or component-level overrides remain encapsulated within that academy's folder.
