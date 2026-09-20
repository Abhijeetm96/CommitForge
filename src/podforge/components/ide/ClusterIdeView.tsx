import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ClusterCanvas } from '../visualizer/ClusterCanvas';
import { KubeTerminal } from '../terminal/KubeTerminal';
import { FileCode, Play, CheckCircle2 } from 'lucide-react';

const SAMPLE_MANIFESTS: Record<string, string> = {
  'frontend-deploy.yaml': `apiVersion: apps/v1
kind: Deployment
metadata:
  name: frontend-web
  namespace: default
spec:
  replicas: 3
  selector:
    matchLabels:
      app: frontend-web
  template:
    metadata:
      labels:
        app: frontend-web
    spec:
      containers:
      - name: nginx
        image: nginx:1.25-alpine
        ports:
        - containerPort: 80
        resources:
          requests:
            cpu: 100m
            memory: 128Mi
          limits:
            cpu: 250m
            memory: 256Mi`,

  'frontend-service.yaml': `apiVersion: v1
kind: Service
metadata:
  name: frontend-svc
  namespace: default
spec:
  type: ClusterIP
  selector:
    app: frontend-web
  ports:
  - port: 80
    targetPort: 80
    protocol: TCP`,

  'database-secret.yaml': `apiVersion: v1
kind: Secret
metadata:
  name: db-credentials
  namespace: default
type: Opaque
data:
  username: cG9kZm9yZ2U=
  password: c3VwZXJzZWNyZXQ=`,
};

export const ClusterIdeView: React.FC = () => {
  const { executeCommand } = useApp();
  const [selectedFile, setSelectedFile] = useState<string>('frontend-deploy.yaml');
  const [manifestContent, setManifestContent] = useState<string>(SAMPLE_MANIFESTS['frontend-deploy.yaml']);
  const [appliedFeedback, setAppliedFeedback] = useState<string | null>(null);

  const handleSelectFile = (fileName: string) => {
    setSelectedFile(fileName);
    setManifestContent(SAMPLE_MANIFESTS[fileName]);
    setAppliedFeedback(null);
  };

  const handleApply = () => {
    executeCommand(`kubectl apply -f ${selectedFile}`);
    setAppliedFeedback(`✓ Applied ${selectedFile} successfully.`);
    setTimeout(() => setAppliedFeedback(null), 3000);
  };

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '440px 1fr',
        height: '100%',
        width: '100%',
        boxSizing: 'border-box',
        overflow: 'hidden',
      }}
    >
      {/* LEFT COLUMN: YAML MANIFEST EDITOR */}
      <div
        style={{
          background: 'var(--bg-surface)',
          borderRight: '1px solid var(--border-color)',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          overflow: 'hidden',
        }}
      >
        {/* File Tabs Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--bg-app)',
            borderBottom: '1px solid var(--border-color)',
            padding: '0.4rem 0.65rem',
          }}
        >
          <div style={{ display: 'flex', gap: '0.35rem', overflowX: 'auto' }}>
            {Object.keys(SAMPLE_MANIFESTS).map((fileName) => {
              const isActive = selectedFile === fileName;
              return (
                <button
                  key={fileName}
                  onClick={() => handleSelectFile(fileName)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    padding: '0.35rem 0.65rem',
                    borderRadius: '6px',
                    fontSize: '0.74rem',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? '#fff' : 'var(--text-muted)',
                    background: isActive ? 'var(--bg-card)' : 'transparent',
                    border: isActive ? '1px solid var(--border-color)' : '1px solid transparent',
                    cursor: 'pointer',
                  }}
                >
                  <FileCode size={13} color={isActive ? 'var(--k8s-cyan)' : 'var(--text-muted)'} />
                  <span>{fileName}</span>
                </button>
              );
            })}
          </div>

          <button
            onClick={handleApply}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              background: 'var(--k8s-blue)',
              color: '#fff',
              border: 'none',
              padding: '0.35rem 0.75rem',
              borderRadius: '6px',
              fontSize: '0.74rem',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            <Play size={12} /> Apply Manifest
          </button>
        </div>

        {/* Textarea Editor */}
        <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
          <textarea
            value={manifestContent}
            onChange={(e) => setManifestContent(e.target.value)}
            spellCheck={false}
            style={{
              width: '100%',
              height: '100%',
              background: '#040711',
              color: 'var(--k8s-cyan)',
              border: 'none',
              outline: 'none',
              padding: '1rem',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.82rem',
              lineHeight: 1.55,
              resize: 'none',
              boxSizing: 'border-box',
            }}
          />

          {appliedFeedback && (
            <div
              style={{
                position: 'absolute',
                bottom: '1rem',
                right: '1rem',
                background: 'rgba(16, 185, 129, 0.95)',
                color: '#fff',
                padding: '0.45rem 0.85rem',
                borderRadius: '6px',
                fontSize: '0.76rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
              }}
            >
              <CheckCircle2 size={14} />
              <span>{appliedFeedback}</span>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT COLUMN: SPLIT VIEW (LIVE CANVAS + TERMINAL) */}
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
        <div style={{ height: '55%', borderBottom: '1px solid var(--border-color)', overflow: 'hidden' }}>
          <ClusterCanvas />
        </div>
        <div style={{ height: '45%', overflow: 'hidden' }}>
          <KubeTerminal autoFocus={false} />
        </div>
      </div>
    </div>
  );
};
