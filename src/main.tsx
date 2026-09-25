import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import App from './App.tsx'
import { SuiteErrorBoundary } from './platform/errors/SuiteErrorBoundary'

// Automatically handle stale asset hashes when new versions are deployed to GitHub Pages
window.addEventListener('vite:preloadError', (event) => {
  const reloadKey = 'forgesuite_preload_retry_timestamp';
  let lastReload = 0;
  try {
    lastReload = Number(sessionStorage.getItem(reloadKey) || '0');
  } catch {}
  const now = Date.now();

  if (now - lastReload > 15000) {
    try {
      sessionStorage.setItem(reloadKey, String(now));
    } catch {}
    console.warn('[Vite] Preload error detected for updated assets. Refreshing to latest version...', event);
    window.location.reload();
  }
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SuiteErrorBoundary fallbackTitle="Forge Suite Application Error">
      <App />
    </SuiteErrorBoundary>
  </StrictMode>,
)
