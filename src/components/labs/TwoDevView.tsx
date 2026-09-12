import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Users, ArrowRight, GitPullRequest, ArrowDownCircle, ArrowUpCircle, RefreshCw } from 'lucide-react';

export const TwoDevView: React.FC = () => {
  const { executeCommand, repo } = useApp();

  const [step, setStep] = useState<number>(1);
  const [rahulPushed, setRahulPushed] = useState<boolean>(false);
  const [abhijeetFetched, setAbhijeetFetched] = useState<boolean>(false);
  const [abhijeetPulled, setAbhijeetPulled] = useState<boolean>(false);

  const handleRahulPush = () => {
    // Simulate Rahul pushing a commit to origin/main
    const currentRepo = repo;
    const origin = currentRepo.remotes['origin'] || {
      name: 'origin',
      url: 'https://github.com/company/coffee-shop.git',
      branches: {},
    };

    origin.branches['main'] = {
      remote: 'origin',
      branch: 'main',
      targetCommitHash: 'r9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0',
    };

    setRahulPushed(true);
    setStep(2);
  };

  const handleAbhijeetFetch = () => {
    executeCommand('git fetch origin');
    setAbhijeetFetched(true);
    setStep(3);
  };

  const handleAbhijeetPull = () => {
    executeCommand('git pull origin main');
    setAbhijeetPulled(true);
    setStep(4);
  };

  return (
    <div style={{ padding: '1.5rem', maxWidth: '1100px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--git-cyan)', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase' }}>
          <Users size={16} /> Multi-Developer Collaboration Sandbox
        </div>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '0.2rem' }}>
          Two-Developer Simulation: Abhijeet & Rahul 👥
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '0.3rem' }}>
          Watch what happens when two developers work on the same repository simultaneously. Learn why pushes get rejected and observe the precise difference between <code>git fetch</code> and <code>git pull</code>.
        </p>
      </div>

      {/* Step Banner */}
      <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '1.2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--git-orange)', textTransform: 'uppercase' }}>Step {step} of 4</span>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginTop: '0.2rem' }}>
            {step === 1 && 'Rahul makes changes to the Coffee Shop menu and pushes to GitHub'}
            {step === 2 && 'Abhijeet is working locally and doesn’t have Rahul’s changes yet'}
            {step === 3 && 'Abhijeet runs git fetch: origin/main moves forward, but local files stay untouched'}
            {step === 4 && 'Abhijeet runs git pull: Rahul’s commits are integrated into Abhijeet’s local branch'}
          </h3>
        </div>
        <div>
          {step === 1 && (
            <button
              style={{ background: 'var(--git-orange)', color: 'white', border: 'none', padding: '0.6rem 1.2rem', borderRadius: 'var(--radius-sm)', fontWeight: 700, cursor: 'pointer' }}
              onClick={handleRahulPush}
            >
              Simulate: Rahul Pushes Commit
            </button>
          )}
          {step === 2 && (
            <button
              style={{ background: 'var(--git-cyan)', color: 'white', border: 'none', padding: '0.6rem 1.2rem', borderRadius: 'var(--radius-sm)', fontWeight: 700, cursor: 'pointer' }}
              onClick={handleAbhijeetFetch}
            >
              Run: git fetch origin
            </button>
          )}
          {step === 3 && (
            <button
              style={{ background: 'var(--success)', color: 'white', border: 'none', padding: '0.6rem 1.2rem', borderRadius: 'var(--radius-sm)', fontWeight: 700, cursor: 'pointer' }}
              onClick={handleAbhijeetPull}
            >
              Run: git pull origin main
            </button>
          )}
        </div>
      </div>

      {/* Split Screens */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        {/* Developer A: Abhijeet */}
        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.6rem' }}>
            <span style={{ fontSize: '1.4rem' }}>👨‍💻</span>
            <div>
              <div style={{ fontWeight: 800, color: 'var(--text-primary)' }}>Developer A: Abhijeet</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Local Machine (Laptop)</div>
            </div>
          </div>

          <div style={{ background: 'var(--bg-app)', padding: '0.8rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', marginBottom: '1rem', fontSize: '0.85rem' }}>
            <div><strong>Local branch:</strong> <code style={{ color: 'var(--git-orange)' }}>main</code></div>
            <div><strong>Tracking branch:</strong> <code style={{ color: 'var(--git-cyan)' }}>origin/main</code></div>
            <div><strong>Status:</strong> {step < 3 ? 'Up to date with origin (so he thinks)' : step === 3 ? '1 commit BEHIND origin/main' : 'Synchronized with Rahul'}</div>
          </div>

          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', background: 'var(--terminal-bg)', padding: '0.8rem', borderRadius: 'var(--radius-sm)', color: 'var(--terminal-text)' }}>
            <div>$ git status</div>
            {step === 1 && <div>On branch main. Your branch is up to date with 'origin/main'.</div>}
            {step === 2 && <div>On branch main. (Unaware that Rahul pushed)</div>}
            {step === 3 && (
              <div style={{ color: 'var(--warning)' }}>
                Your branch is behind 'origin/main' by 1 commit, and can be fast-forwarded.<br />
                (use "git pull" to update your local branch)
              </div>
            )}
            {step === 4 && <div style={{ color: 'var(--success)' }}>Updating a1b2c3d..r9a8b7c Fast-forward!</div>}
          </div>
        </div>

        {/* Developer B: Rahul */}
        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.6rem' }}>
            <span style={{ fontSize: '1.4rem' }}>🧑‍💼</span>
            <div>
              <div style={{ fontWeight: 800, color: 'var(--text-primary)' }}>Developer B: Rahul</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Local Machine (Desktop)</div>
            </div>
          </div>

          <div style={{ background: 'var(--bg-app)', padding: '0.8rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', marginBottom: '1rem', fontSize: '0.85rem' }}>
            <div><strong>Recent Work:</strong> Add "Caramel Macchiato" to coffee menu</div>
            <div><strong>Remote Push:</strong> {rahulPushed ? '✅ Pushed to GitHub' : '⏳ Not yet pushed'}</div>
          </div>

          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', background: 'var(--terminal-bg)', padding: '0.8rem', borderRadius: 'var(--radius-sm)', color: 'var(--terminal-text)' }}>
            <div>$ git commit -m "Add Caramel Macchiato special"</div>
            <div>[main r9a8b7c] Add Caramel Macchiato special</div>
            <div>$ git push origin main</div>
            {rahulPushed ? (
              <div style={{ color: 'var(--success)' }}>
                To https://github.com/company/coffee-shop.git<br />
                a1b2c3d..r9a8b7c main -&gt; main
              </div>
            ) : (
              <div style={{ color: 'var(--text-muted)' }}>(Waiting to push...)</div>
            )}
          </div>
        </div>
      </div>

      {/* Fetch vs Pull Educational Box */}
      <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.8rem', color: 'var(--git-cyan)' }}>
          Critical Insight: FETCH vs PULL
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.9rem', lineHeight: '1.5' }}>
          <div style={{ background: 'var(--bg-app)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <strong style={{ color: 'var(--git-cyan)' }}>git fetch origin</strong>
            <p style={{ marginTop: '0.4rem', color: 'var(--text-secondary)' }}>
              Downloads new objects and updates <code>origin/main</code>. It NEVER touches your working tree, staging area, or local <code>main</code> branch. It is 100% risk-free.
            </p>
          </div>
          <div style={{ background: 'var(--bg-app)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <strong style={{ color: 'var(--success)' }}>git pull origin main</strong>
            <p style={{ marginTop: '0.4rem', color: 'var(--text-secondary)' }}>
              Runs <code>git fetch</code> + <code>git merge</code> in a single command. It moves your local branch forward and updates your files on disk.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
