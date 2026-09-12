import React, { useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Play, Sparkles } from 'lucide-react';

export const AppPreview: React.FC = () => {
  const { repo, currentProject } = useApp();

  const renderedDoc = useMemo(() => {
    let html = repo.workingDirectory['index.html'] || '<div style="padding: 1rem; color: #fff;">index.html not found</div>';
    const css = repo.workingDirectory['style.css'] || '';
    const js =
      repo.workingDirectory['script.js'] ||
      repo.workingDirectory['cart.js'] ||
      repo.workingDirectory['app.js'] ||
      '';

    // Inject CSS into HTML
    if (css) {
      if (html.includes('</head>')) {
        html = html.replace('</head>', `<style>${css}</style></head>`);
      } else {
        html = `<style>${css}</style>${html}`;
      }
    }

    // Inject JS into HTML
    if (js) {
      if (html.includes('</body>')) {
        html = html.replace('</body>', `<script>${js}</script></body>`);
      } else {
        html = `${html}<script>${js}</script>`;
      }
    }

    return html;
  }, [repo.workingDirectory]);

  return (
    <div className="live-preview-box">
      <div className="preview-badge">
        <Sparkles size={11} color="#38bdf8" />
        Live App Sandbox
      </div>
      <iframe
        className="preview-frame"
        srcDoc={renderedDoc}
        title="Live Application Preview"
        sandbox="allow-scripts allow-modals allow-same-origin"
      />
    </div>
  );
};
