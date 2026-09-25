import React from 'react';

/**
 * Wraps dynamic React.lazy imports with automated recovery against stale chunk 404s
 * caused by subsequent GitHub Pages builds/deployments.
 *
 * If a chunk fails to load due to 'Failed to fetch dynamically imported module':
 * 1. Checks if a reload was attempted recently in the last 15 seconds (avoids infinite loops).
 * 2. If not reloaded recently, immediately reloads window to fetch latest asset manifest.
 * 3. Returns a pending promise during reload to prevent error flashes.
 */
export function lazyWithRetry<T extends React.ComponentType<any>>(
  factory: () => Promise<{ default: T } | T>
): T {
  return React.lazy(async () => {
    const reloadKey = 'forgesuite_chunk_retry_timestamp';
    try {
      const component = await factory();
      if (typeof sessionStorage !== 'undefined') {
        try {
          sessionStorage.removeItem(reloadKey);
        } catch {}
      }
      return 'default' in component ? component : { default: component };
    } catch (error: any) {
      const errorMessage = String(error?.message || error || '');
      const isChunkError =
        errorMessage.includes('Failed to fetch dynamically imported module') ||
        errorMessage.includes('error loading dynamically imported module') ||
        error?.name === 'ChunkLoadError' ||
        /dynamically imported module/i.test(errorMessage);

      if (isChunkError && typeof window !== 'undefined') {
        let lastReload = 0;
        if (typeof sessionStorage !== 'undefined') {
          try {
            lastReload = Number(sessionStorage.getItem(reloadKey) || '0');
          } catch {}
        }
        const now = Date.now();

        // Allow one auto-reload every 15 seconds to fetch latest deployed index.html and chunks
        if (now - lastReload > 15000) {
          if (typeof sessionStorage !== 'undefined') {
            try {
              sessionStorage.setItem(reloadKey, String(now));
            } catch {}
          }
          console.warn('[lazyWithRetry] Stale chunk detected after deployment. Reloading latest app version...', error);
          window.location.reload();
          // Return pending promise so React Suspense keeps showing fallback while browser refreshes
          return new Promise<{ default: T }>(() => {});
        }
      }

      throw error;
    }
  }) as unknown as T;
}
