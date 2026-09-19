import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldAlert, Swords, CheckCircle2, Play, Flame, AlertTriangle } from 'lucide-react';

export const ConflictArenaView: React.FC = () => {
  const { engine, repo, executeCommand, setMode } = useApp();
  const [conflictType, setConflictType] = useState<'single-line' | 'multi-file' | 'delete-modify'>('single-line');

  const triggerConflict = (type: string) => {
    // Inject realistic conflict into working tree & index
    engine.execute('git init');
    engine.execute('git add .');
    engine.execute('git commit -m "Base before conflict"');

    if (type === 'single-line') {
      engine.updateFileContent('index.html', `<!DOCTYPE html>
<html>
<body>
<<<<<<< HEAD
  <h1>Welcome to Local Store</h1>
=======
  <h1>Welcome to Global CommitForge Store</h1>
>>>>>>> feature/storefront
</body>
</html>`);
    } else if (type === 'multi-file') {
      engine.updateFileContent('index.html', `<<<<<<< HEAD\n<title>Store Alpha</title>\n=======\n<title>Store Beta</title>\n>>>>>>> feature/storefront`);
      engine.updateFileContent('style.css', `<<<<<<< HEAD\nbody { background: #111; color: #fff; }\n=======\nbody { background: #0b0f19; color: #38bdf8; }\n>>>>>>> feature/storefront`);
    }

    setMode('ide');
  };

  return (
    <div style={{ padding: '1.5rem', width: '100%', maxWidth: '100%', boxSizing: 'border-box', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--danger)', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase' }}>
          <Swords size={16} /> Conflict Resolution Battleground
        </div>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '0.2rem' }}>
          Conflict Arena ⚔️
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '0.3rem' }}>
          Merge conflicts frighten beginners, but they are just two different sets of changes that Git needs a human to decide between. Train yourself to resolve conflicts with confidence.
        </p>
      </div>

      {/* Anatomical Marker Anatomy Card */}
      <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.8rem' }}>
          Anatomy of a Merge Conflict
        </h3>
        <div style={{ background: 'var(--terminal-bg)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1rem', fontFamily: 'var(--font-mono)', fontSize: '0.85rem', lineHeight: '1.6' }}>
          <div style={{ color: 'var(--git-orange)', fontWeight: 700 }}>&lt;&lt;&lt;&lt;&lt;&lt;&lt; HEAD</div>
          <div style={{ color: 'var(--text-primary)', paddingLeft: '1rem' }}>Your current branch's version of the code (what you had locally).</div>
          <div style={{ color: 'var(--warning)', fontWeight: 700 }}>=======</div>
          <div style={{ color: 'var(--git-cyan)', paddingLeft: '1rem' }}>The incoming branch's version of the code (what they wrote).</div>
          <div style={{ color: 'var(--git-purple)', fontWeight: 700 }}>&gt;&gt;&gt;&gt;&gt;&gt;&gt; feature/branch-name</div>
        </div>
      </div>

      {/* Battle Scenarios */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--git-cyan)', textTransform: 'uppercase' }}>Battle #1</span>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginTop: '0.3rem', color: 'var(--text-primary)' }}>
              Same Line Heading Conflict
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.4rem', lineHeight: '1.5' }}>
              Two developers edited the main <code>&lt;h1&gt;</code> title in <code>index.html</code> with different marketing taglines.
            </p>
          </div>
          <button
            style={{
              background: 'var(--git-orange)',
              color: 'white',
              border: 'none',
              padding: '0.6rem 1.2rem',
              borderRadius: 'var(--radius-sm)',
              fontWeight: 700,
              cursor: 'pointer',
              marginTop: '1.2rem',
            }}
            onClick={() => triggerConflict('single-line')}
          >
            Spawn Conflict in IDE ➔
          </button>
        </div>

        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--git-purple)', textTransform: 'uppercase' }}>Battle #2</span>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginTop: '0.3rem', color: 'var(--text-primary)' }}>
              Multi-File Cascade Conflict
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.4rem', lineHeight: '1.5' }}>
              Conflicts in both HTML and CSS simultaneously. Requires resolving both files before Git allows completing the merge commit.
            </p>
          </div>
          <button
            style={{
              background: 'var(--danger)',
              color: 'white',
              border: 'none',
              padding: '0.6rem 1.2rem',
              borderRadius: 'var(--radius-sm)',
              fontWeight: 700,
              cursor: 'pointer',
              marginTop: '1.2rem',
            }}
            onClick={() => triggerConflict('multi-file')}
          >
            Spawn Multi-File Conflict ➔
          </button>
        </div>
      </div>
    </div>
  );
};
