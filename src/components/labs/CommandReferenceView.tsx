import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { COMMANDS_DOCS, COMPARISONS, CommandDoc, InteractiveComparison } from '../../data/commandsRef';
import { GIT_COMMAND_COVERAGE, calculateCommandCoverage, CommandTier } from '../../data/gitCommandCoverage';
import {
  Search,
  BookMarked,
  ShieldCheck,
  AlertTriangle,
  ShieldAlert,
  ArrowRight,
  Database,
  CheckCircle2,
  Terminal,
  Layers,
  Filter,
} from 'lucide-react';

export const CommandReferenceView: React.FC = () => {
  const { executeCommand } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'docs' | 'comparisons' | 'coverage'>('docs');
  const [selectedCommand, setSelectedCommand] = useState<CommandDoc>(COMMANDS_DOCS[0]);
  const [selectedComparison, setSelectedComparison] = useState<InteractiveComparison>(COMPARISONS[0]);

  // Coverage filter states
  const [selectedTier, setSelectedTier] = useState<string>('ALL');
  const [selectedLevel, setSelectedLevel] = useState<string>('ALL');

  const coverageStats = calculateCommandCoverage();

  const filteredDocs = COMMANDS_DOCS.filter(c =>
    c.command.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.purpose.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCoverage = GIT_COMMAND_COVERAGE.filter(item => {
    const matchesSearch =
      item.command.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTier = selectedTier === 'ALL' || item.tier === selectedTier;
    const matchesLevel = selectedLevel === 'ALL' || item.level.toString() === selectedLevel;
    return matchesSearch && matchesTier && matchesLevel;
  });

  return (
    <div style={{ padding: '1.5rem', maxWidth: '1150px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--git-orange)', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase' }}>
          <BookMarked size={16} /> Knowledge Base & Command Encyclopedia
        </div>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '0.2rem' }}>
          Git Command Reference, Comparisons & Coverage Matrix
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '0.3rem' }}>
          Search commands by risk rating, examine what changes vs what stays untouched, and verify curriculum coverage across Levels 0 to 12.
        </p>
      </div>

      {/* Tabs & Search */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', gap: '0.4rem', background: 'var(--bg-surface)', padding: '0.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
          <button
            className={`nav-btn ${activeTab === 'docs' ? 'active' : ''}`}
            onClick={() => setActiveTab('docs')}
          >
            Command Encyclopedia
          </button>
          <button
            className={`nav-btn ${activeTab === 'comparisons' ? 'active' : ''}`}
            onClick={() => setActiveTab('comparisons')}
          >
            Interactive Comparisons
          </button>
          <button
            className={`nav-btn ${activeTab === 'coverage' ? 'active' : ''}`}
            onClick={() => setActiveTab('coverage')}
            style={{ fontWeight: 800 }}
          >
            📊 Coverage Matrix ({coverageStats.coveragePercentage}%)
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', padding: '0.4rem 0.8rem', width: '300px' }}>
          <Search size={15} color="var(--text-muted)" style={{ marginRight: '0.4rem' }} />
          <input
            type="text"
            placeholder="Search commands, flags, topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ background: 'transparent', border: 'none', outline: 'none', color: 'var(--text-primary)', fontSize: '0.85rem', width: '100%' }}
          />
        </div>
      </div>

      {/* TAB 1: Command Encyclopedia */}
      {activeTab === 'docs' && (
        <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '1.5rem' }}>
          {/* List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', maxHeight: '550px', overflowY: 'auto' }}>
            {filteredDocs.map((cmd) => (
              <div
                key={cmd.command}
                onClick={() => setSelectedCommand(cmd)}
                style={{
                  padding: '0.7rem 0.9rem',
                  background: selectedCommand.command === cmd.command ? 'var(--bg-card-hover)' : 'var(--bg-surface)',
                  border: '1px solid',
                  borderColor: selectedCommand.command === cmd.command ? 'var(--git-orange)' : 'var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '0.85rem', color: selectedCommand.command === cmd.command ? 'var(--git-orange)' : 'var(--text-primary)' }}>
                    {cmd.command}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{cmd.category}</div>
                </div>
                <span
                  style={{
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    padding: '0.15rem 0.4rem',
                    borderRadius: '999px',
                    background: cmd.riskLevel === 'HIGH' ? 'rgba(239, 68, 68, 0.2)' : cmd.riskLevel === 'MEDIUM' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                    color: cmd.riskLevel === 'HIGH' ? 'var(--danger)' : cmd.riskLevel === 'MEDIUM' ? 'var(--warning)' : 'var(--success)',
                  }}
                >
                  {cmd.riskLevel}
                </span>
              </div>
            ))}
          </div>

          {/* Detailed View */}
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h2 style={{ fontFamily: 'var(--font-mono)', fontSize: '1.5rem', color: 'var(--git-orange)' }}>
                  {selectedCommand.command}
                </h2>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                  {selectedCommand.category} • Syntax: <code>{selectedCommand.syntax}</code>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    padding: '0.3rem 0.7rem',
                    borderRadius: '999px',
                    background: selectedCommand.riskLevel === 'HIGH' ? 'rgba(239, 68, 68, 0.2)' : selectedCommand.riskLevel === 'MEDIUM' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                    color: selectedCommand.riskLevel === 'HIGH' ? 'var(--danger)' : selectedCommand.riskLevel === 'MEDIUM' ? 'var(--warning)' : 'var(--success)',
                  }}
                >
                  RISK: {selectedCommand.riskLevel}
                </span>
                <button
                  onClick={() => executeCommand(selectedCommand.example)}
                  style={{
                    background: 'var(--git-orange)',
                    color: 'white',
                    border: 'none',
                    padding: '0.35rem 0.8rem',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                  }}
                >
                  <Terminal size={14} /> Try Example
                </button>
              </div>
            </div>

            <div>
              <strong style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Purpose:</strong>
              <p style={{ marginTop: '0.2rem', lineHeight: '1.5' }}>{selectedCommand.purpose}</p>
            </div>

            <div style={{ background: 'var(--bg-app)', padding: '0.8rem', borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '0.2rem' }}>EXAMPLE:</div>
              <code style={{ color: 'var(--git-cyan)' }}>{selectedCommand.example}</code>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div style={{ background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: 'var(--radius-sm)', padding: '0.8rem' }}>
                <strong style={{ color: 'var(--success)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <ShieldCheck size={14} /> WHAT CHANGES:
                </strong>
                <p style={{ fontSize: '0.85rem', marginTop: '0.3rem', color: 'var(--text-primary)' }}>
                  {selectedCommand.whatChanges}
                </p>
              </div>

              <div style={{ background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: 'var(--radius-sm)', padding: '0.8rem' }}>
                <strong style={{ color: 'var(--danger)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <AlertTriangle size={14} /> WHAT STAYS UNTOUCHED:
                </strong>
                <p style={{ fontSize: '0.85rem', marginTop: '0.3rem', color: 'var(--text-primary)' }}>
                  {selectedCommand.whatDoesNotChange}
                </p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.85rem' }}>
              <div>
                <strong style={{ color: 'var(--success)' }}>WHEN TO USE:</strong>
                <p style={{ color: 'var(--text-secondary)', marginTop: '0.2rem' }}>{selectedCommand.whenToUse}</p>
              </div>
              <div>
                <strong style={{ color: 'var(--danger)' }}>WHEN NOT TO USE:</strong>
                <p style={{ color: 'var(--text-secondary)', marginTop: '0.2rem' }}>{selectedCommand.whenNotToUse}</p>
              </div>
            </div>

            {selectedCommand.beginnerDefinition && (
              <div style={{ background: 'rgba(56, 189, 248, 0.08)', borderLeft: '3px solid #38bdf8', padding: '0.75rem', borderRadius: '0 6px 6px 0', fontSize: '0.85rem' }}>
                <strong style={{ color: '#38bdf8', textTransform: 'uppercase', fontSize: '0.75rem' }}>In Plain English:</strong>
                <p style={{ margin: '0.2rem 0 0 0', color: '#f8fafc' }}>{selectedCommand.beginnerDefinition}</p>
              </div>
            )}

            {selectedCommand.syntaxVariants && selectedCommand.syntaxVariants.length > 0 && (
              <div style={{ marginTop: '0.5rem' }}>
                <strong style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Command Variations:</strong>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginTop: '0.4rem' }}>
                  {selectedCommand.syntaxVariants.map((v, i) => (
                    <div key={i} style={{ background: 'var(--bg-app)', border: '1px solid var(--border-color)', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <code style={{ color: '#38bdf8', fontWeight: 700 }}>{v.syntax}</code>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{v.description}</span>
                      </div>
                      <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', marginTop: '0.15rem' }}>{v.whenToUse}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedCommand.commonMistakes && selectedCommand.commonMistakes.length > 0 && (
              <div style={{ marginTop: '0.5rem' }}>
                <strong style={{ fontSize: '0.8rem', color: 'var(--danger)', textTransform: 'uppercase' }}>Common Misconceptions & Mistakes:</strong>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginTop: '0.4rem' }}>
                  {selectedCommand.commonMistakes.map((m, i) => (
                    <div key={i} style={{ background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem' }}>
                      <div style={{ color: '#fca5a5', fontWeight: 700 }}>❌ {m.mistake}</div>
                      <div style={{ color: '#86efac', marginTop: '0.15rem' }}>💡 {m.correction}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: Interactive Comparisons */}
      {activeTab === 'comparisons' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
            {COMPARISONS.map((comp) => (
              <button
                key={comp.id}
                onClick={() => setSelectedComparison(comp)}
                style={{
                  padding: '0.6rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid',
                  borderColor: selectedComparison.id === comp.id ? 'var(--git-orange)' : 'var(--border-color)',
                  background: selectedComparison.id === comp.id ? 'var(--bg-card-hover)' : 'var(--bg-surface)',
                  color: selectedComparison.id === comp.id ? 'var(--git-orange)' : 'var(--text-secondary)',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                {comp.title}
              </button>
            ))}
          </div>

          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.5rem' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.3rem' }}>
              {selectedComparison.title}
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              {selectedComparison.description}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${selectedComparison.columns.length}, 1fr)`, gap: '1rem' }}>
              {selectedComparison.columns.map((col, idx) => (
                <div key={idx} style={{ background: 'var(--bg-app)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, color: 'var(--git-orange)', fontSize: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                    {col.command}
                  </div>
                  <div>
                    <strong style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Core Concept:</strong>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-primary)', marginTop: '0.2rem' }}>{col.concept}</p>
                  </div>
                  <div>
                    <strong style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>What It Changes:</strong>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>{col.whatItChanges}</p>
                  </div>
                  <div>
                    <strong style={{ fontSize: '0.75rem', color: 'var(--success)', textTransform: 'uppercase' }}>Best Scenario:</strong>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-primary)', marginTop: '0.2rem' }}>{col.bestScenario}</p>
                  </div>
                  <div>
                    <strong style={{ fontSize: '0.75rem', color: 'var(--warning)', textTransform: 'uppercase' }}>Safety Rule:</strong>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>{col.safetyRule}</p>
                  </div>
                  <div>
                    <strong style={{ fontSize: '0.75rem', color: 'var(--danger)', textTransform: 'uppercase' }}>Drawback:</strong>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>{col.drawback}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Complete Command Coverage Matrix */}
      {activeTab === 'coverage' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Exact Coverage Denominator Disclaimer (Point 24) */}
          <div
            style={{
              padding: '0.75rem 1rem',
              background: 'rgba(6, 182, 212, 0.08)',
              border: '1px solid rgba(6, 182, 212, 0.3)',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.85rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.5,
            }}
          >
            <strong style={{ color: 'var(--cyan)' }}>Documented Curriculum Coverage:</strong>{' '}
            CommitForge covers <strong>62 command families</strong> and <strong>120+ command variants and utilities</strong> across 6 progressive tiers.
            Coverage measures documented curriculum coverage and interactive simulation, not full low-level reimplementation of the C Git binary itself.
          </div>

          {/* Metrics Summary Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1rem' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                OVERALL COVERAGE
              </div>
              <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--git-orange)', marginTop: '0.2rem' }}>
                {coverageStats.coveragePercentage}%
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                {coverageStats.engineSupportedCount} of {coverageStats.totalCommands} commands active
              </div>
            </div>

            <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1rem' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                TIER 1: FULL ENGINE
              </div>
              <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--terminal-green)', marginTop: '0.2rem' }}>
                {coverageStats.tier1Count}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                Direct in-memory repo execution
              </div>
            </div>

            <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1rem' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                TIER 2: SIMULATED
              </div>
              <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--cyan)', marginTop: '0.2rem' }}>
                {coverageStats.tier2Count}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                Submodules, worktrees, bisect
              </div>
            </div>

            <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1rem' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                TIER 3: VISUAL & DIAGNOSTIC
              </div>
              <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--warning-amber)', marginTop: '0.2rem' }}>
                {coverageStats.tier3Count}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                Maintenance, GC, Pruning
              </div>
            </div>
          </div>

          {/* Filters Bar */}
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap', background: 'var(--bg-surface)', padding: '0.8rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
              <Filter size={15} /> Filter by Tier:
            </div>
            {['ALL', 'Tier 1', 'Tier 2', 'Tier 3', 'Tier 4'].map(t => (
              <button
                key={t}
                onClick={() => setSelectedTier(t)}
                style={{
                  background: selectedTier === t ? 'var(--git-orange)' : 'var(--bg-app)',
                  color: selectedTier === t ? 'white' : 'var(--text-secondary)',
                  border: '1px solid var(--border-color)',
                  padding: '0.25rem 0.6rem',
                  borderRadius: '999px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                {t}
              </button>
            ))}

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginLeft: 'auto', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
              Level:
              <select
                value={selectedLevel}
                onChange={e => setSelectedLevel(e.target.value)}
                style={{
                  background: 'var(--bg-app)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '4px',
                  padding: '0.25rem 0.5rem',
                  color: 'var(--text-primary)',
                  fontSize: '0.8rem',
                }}
              >
                <option value="ALL">All Levels (0-12)</option>
                {Array.from({ length: 13 }).map((_, idx) => (
                  <option key={idx} value={idx.toString()}>Level {idx}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Coverage Table */}
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ background: 'var(--bg-app)', borderBottom: '1px solid var(--border-color)', textAlign: 'left' }}>
                  <th style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)' }}>Command</th>
                  <th style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)' }}>Level & Category</th>
                  <th style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)' }}>Support Tier</th>
                  <th style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)' }}>Engine</th>
                  <th style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)' }}>Description</th>
                  <th style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredCoverage.map((item, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '0.75rem 1rem', fontFamily: 'monospace', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {item.command}
                    </td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--git-orange)' }}>L{item.level}</span> • {item.category}
                    </td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <span
                        style={{
                          fontSize: '0.72rem',
                          fontWeight: 800,
                          padding: '0.2rem 0.5rem',
                          borderRadius: '4px',
                          background: item.tier === 'Tier 1' ? 'rgba(16, 185, 129, 0.15)' : item.tier === 'Tier 2' ? 'rgba(6, 182, 212, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                          color: item.tier === 'Tier 1' ? 'var(--terminal-green)' : item.tier === 'Tier 2' ? 'var(--cyan)' : 'var(--warning-amber)',
                        }}
                      >
                        {item.tier}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      {item.supportedByEngine ? (
                        <span style={{ color: 'var(--terminal-green)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                          <CheckCircle2 size={14} /> Active
                        </span>
                      ) : (
                        <span style={{ color: 'var(--text-muted)' }}>Reference</span>
                      )}
                    </td>
                    <td style={{ padding: '0.75rem 1rem', color: 'var(--text-secondary)', fontSize: '0.8rem', maxWidth: '350px' }}>
                      {item.description}
                    </td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <button
                        onClick={() => executeCommand(item.variants[0] || item.command)}
                        style={{
                          background: 'var(--bg-app)',
                          border: '1px solid var(--border-color)',
                          color: 'var(--text-primary)',
                          padding: '0.25rem 0.6rem',
                          borderRadius: '4px',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.3rem',
                        }}
                      >
                        <Terminal size={12} /> Try
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
