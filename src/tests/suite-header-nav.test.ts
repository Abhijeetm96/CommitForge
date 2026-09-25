import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('SuiteHeaderNav Responsiveness & CSS Rules (Issue #8)', () => {
  const cssPath = path.resolve(__dirname, '../components/layout/suiteHeaderNav.css');
  const cssContent = fs.readFileSync(cssPath, 'utf-8');

  it('contains media query for tablet viewports (< 880px) to hide button text', () => {
    expect(cssContent).toContain('@media (max-width: 880px)');
    expect(cssContent).toContain('.suite-nav-text');
    expect(cssContent).toContain('.suite-brand-badge');
  });

  it('contains media query for mobile viewports (< 640px) to enable mobile menu toggle', () => {
    expect(cssContent).toContain('@media (max-width: 640px)');
    expect(cssContent).toContain('.suite-mobile-toggle-btn');
    expect(cssContent).toContain('.suite-mobile-drawer');
  });
});
