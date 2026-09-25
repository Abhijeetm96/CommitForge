import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Theme Support & Light Theme Integration (Issue #7)', () => {
  it('ensures LIGHT_MODE_ENABLED is true across AppContext and HeaderNav', () => {
    const appContextPath = path.resolve(__dirname, '../context/AppContext.tsx');
    const appContextContent = fs.readFileSync(appContextPath, 'utf-8');
    expect(appContextContent).toContain('const LIGHT_MODE_ENABLED = true;');

    const headerNavPath = path.resolve(__dirname, '../commitforge/components/layout/HeaderNav.tsx');
    const headerNavContent = fs.readFileSync(headerNavPath, 'utf-8');
    expect(headerNavContent).toContain('const LIGHT_MODE_ENABLED = true;');
  });

  it('ensures CSS tokens for light theme are complete and high-contrast in index.css', () => {
    const indexCssPath = path.resolve(__dirname, '../styles/index.css');
    const cssContent = fs.readFileSync(indexCssPath, 'utf-8');

    expect(cssContent).toContain('[data-theme="light"]');
    expect(cssContent).toContain('.app-root.light');
    expect(cssContent).toContain('--bg-app: #f8fafc;');
    expect(cssContent).toContain('--bg-surface: #ffffff;');
    expect(cssContent).toContain('--bg-card: #ffffff;');
    expect(cssContent).toContain('--text-primary: #0f172a;');
    expect(cssContent).toContain('--border-color: #e2e8f0;');
  });

  it('ensures visualizer and academy containers have light theme overrides', () => {
    const indexCssPath = path.resolve(__dirname, '../styles/index.css');
    const cssContent = fs.readFileSync(indexCssPath, 'utf-8');

    expect(cssContent).toContain('.academy-concept-container');
    expect(cssContent).toContain('.academy-hero-card');
    expect(cssContent).toContain('.academy-subtabs-bar');
    expect(cssContent).toContain('.academy-bottom-bar');
  });
});
