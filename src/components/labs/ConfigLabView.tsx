import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Settings, Save, CheckCircle2, Terminal, HelpCircle, Code, Plus, Trash2 } from 'lucide-react';

export const ConfigLabView: React.FC = () => {
  const { repo, engine, executeCommand } = useApp();

  const [userName, setUserName] = useState(repo.config['user.name'] || 'Alex Developer');
  const [userEmail, setUserEmail] = useState(repo.config['user.email'] || 'alex@example.com');
  const [defaultBranch, setDefaultBranch] = useState(repo.config['init.defaultBranch'] || 'main');
  const [editor, setEditor] = useState(repo.config['core.editor'] || 'code --wait');
  const [autocrlf, setAutocrlf] = useState(repo.config['core.autocrlf'] || 'input');

  const [customAliasKey, setCustomAliasKey] = useState('');
  const [customAliasValue, setCustomAliasValue] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Extract all aliases
  const aliases = Object.entries(repo.config)
    .filter(([k]) => k.startsWith('alias.'))
    .map(([k, v]) => ({ key: k.replace('alias.', ''), command: v }));

  const handleSaveStandard = () => {
    executeCommand(`git config user.name "${userName}"`);
    executeCommand(`git config user.email "${userEmail}"`);
    executeCommand(`git config init.defaultBranch "${defaultBranch}"`);
    executeCommand(`git config core.editor "${editor}"`);
    executeCommand(`git config core.autocrlf "${autocrlf}"`);

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleAddAlias = (e: React.FormEvent) => {
    e.preventDefault();
    if (customAliasKey && customAliasValue) {
      executeCommand(`git config alias.${customAliasKey} "${customAliasValue}"`);
      setCustomAliasKey('');
      setCustomAliasValue('');
    }
  };

  const handleDeleteAlias = (aliasName: string) => {
    executeCommand(`git config --unset alias.${aliasName}`);
  };

  // Generate simulated .git/config text
  const configText = [
    '[user]',
    `\tname = ${repo.config['user.name'] || userName}`,
    `\temail = ${repo.config['user.email'] || userEmail}`,
    '[init]',
    `\tdefaultBranch = ${repo.config['init.defaultBranch'] || defaultBranch}`,
    '[core]',
    `\teditor = ${repo.config['core.editor'] || editor}`,
    `\tautocrlf = ${repo.config['core.autocrlf'] || autocrlf}`,
    '[alias]',
    ...aliases.map(a => `\t${a.key} = ${a.command}`),
  ].join('\n');

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, rgba(240, 80, 51, 0.12) 0%, rgba(6, 182, 212, 0.08) 100%)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '1.75rem' }}>
        <div style={{ display: 'inline-flex', padding: '0.25rem 0.75rem', background: 'rgba(240, 80, 51, 0.2)', border: '1px solid var(--git-orange)', borderRadius: '999px', color: 'var(--git-orange)', fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '0.6rem' }}>
          Interactive Laboratory
        </div>
        <h1 style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>
          Git Configuration Laboratory
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '0.4rem', maxWidth: '700px', lineHeight: 1.5 }}>
          Master Git's 3 configuration scopes (System, Global <code>~/.gitconfig</code>, Local <code>.git/config</code>) and supercharge your developer productivity with custom aliases.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1.5rem' }}>
        {/* Form Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Identity & Core Settings */}
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Settings size={18} color="var(--git-orange)" /> Author Identity & Defaults
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                  user.name (Author Name stamped on commits)
                </label>
                <input
                  type="text"
                  value={userName}
                  onChange={e => setUserName(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem 0.8rem', background: 'var(--bg-app)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)', fontSize: '0.9rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                  user.email (Author Email matching your GitHub account)
                </label>
                <input
                  type="email"
                  value={userEmail}
                  onChange={e => setUserEmail(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem 0.8rem', background: 'var(--bg-app)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)', fontSize: '0.9rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                    init.defaultBranch
                  </label>
                  <select
                    value={defaultBranch}
                    onChange={e => setDefaultBranch(e.target.value)}
                    style={{ width: '100%', padding: '0.6rem', background: 'var(--bg-app)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)', fontSize: '0.9rem' }}
                  >
                    <option value="main">main (Modern Default)</option>
                    <option value="master">master (Legacy)</option>
                    <option value="trunk">trunk</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                    core.autocrlf (Line Endings)
                  </label>
                  <select
                    value={autocrlf}
                    onChange={e => setAutocrlf(e.target.value)}
                    style={{ width: '100%', padding: '0.6rem', background: 'var(--bg-app)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)', fontSize: '0.9rem' }}
                  >
                    <option value="input">input (macOS / Linux)</option>
                    <option value="true">true (Windows)</option>
                    <option value="false">false (Off)</option>
                  </select>
                </div>
              </div>

              <button
                onClick={handleSaveStandard}
                style={{
                  marginTop: '0.5rem',
                  background: savedSuccess ? 'var(--terminal-green)' : 'var(--git-orange)',
                  color: 'white',
                  border: 'none',
                  padding: '0.6rem 1.2rem',
                  borderRadius: 'var(--radius-sm)',
                  fontWeight: 800,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem',
                }}
              >
                {savedSuccess ? <CheckCircle2 size={16} /> : <Save size={16} />}
                {savedSuccess ? 'Saved to .git/config!' : 'Save Configurations'}
              </button>
            </div>
          </div>

          {/* Alias Builder */}
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Code size={18} color="var(--cyan)" /> Custom Aliases Builder
            </h2>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: '0 0 1rem' }}>
              Aliases create short command shortcuts (e.g. <code>git st</code> instead of <code>git status</code>).
            </p>

            <form onSubmit={handleAddAlias} style={{ display: 'grid', gridTemplateColumns: '120px 1fr 90px', gap: '0.6rem', marginBottom: '1rem' }}>
              <input
                type="text"
                placeholder="st"
                value={customAliasKey}
                onChange={e => setCustomAliasKey(e.target.value)}
                style={{ padding: '0.5rem', background: 'var(--bg-app)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)', fontSize: '0.85rem', fontFamily: 'monospace' }}
              />
              <input
                type="text"
                placeholder="status --short"
                value={customAliasValue}
                onChange={e => setCustomAliasValue(e.target.value)}
                style={{ padding: '0.5rem', background: 'var(--bg-app)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)', fontSize: '0.85rem', fontFamily: 'monospace' }}
              />
              <button
                type="submit"
                style={{ background: 'var(--cyan)', color: '#000', border: 'none', borderRadius: 'var(--radius-sm)', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem' }}
              >
                <Plus size={14} /> Add
              </button>
            </form>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {aliases.length === 0 ? (
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>No custom aliases configured yet.</div>
              ) : (
                aliases.map(a => (
                  <div key={a.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-app)', padding: '0.5rem 0.8rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                    <div style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>
                      <strong style={{ color: 'var(--cyan)' }}>git {a.key}</strong> ➔ <span style={{ color: 'var(--text-secondary)' }}>git {a.command}</span>
                    </div>
                    <button
                      onClick={() => handleDeleteAlias(a.key)}
                      style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.2rem' }}
                      title="Delete alias"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Live .git/config file preview */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.25rem', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Live File: .git/config
              </span>
              <span style={{ fontSize: '0.7rem', color: 'var(--terminal-green)', fontWeight: 700 }}>
                ● Synchronized
              </span>
            </div>

            <pre
              style={{
                flex: 1,
                background: 'var(--bg-terminal)',
                color: 'var(--terminal-green)',
                padding: '1rem',
                borderRadius: 'var(--radius-sm)',
                fontFamily: 'monospace',
                fontSize: '0.85rem',
                lineHeight: 1.6,
                margin: 0,
                overflowY: 'auto',
              }}
            >
              {configText}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
