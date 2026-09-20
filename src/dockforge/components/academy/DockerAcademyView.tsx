import React, { useState } from 'react';
import { useDocker } from '../../context/DockerContext';
import { DOCKER_14_TOPICS } from '../../data/unifiedDockerData';
import { DockerTerminal } from '../terminal/DockerTerminal';
import {
  BookOpen,
  Search,
  CheckCircle2,
  ChevronRight,
  Code,
  Eye,
  Compass,
  Terminal,
  FileText,
  Sparkles,
  Zap,
  HelpCircle,
  AlertCircle,
  Play,
  Layers,
} from 'lucide-react';

export const DockerAcademyView: React.FC = () => {
  const {
    activeTopicId,
    setActiveTopicId,
    activeConceptId,
    setActiveConceptId,
    currentConcept,
    completedConceptIds,
    markConceptComplete,
  } = useDocker();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'understand' | 'syntax' | 'action' | 'explore' | 'practice' | 'reference'>('understand');

  const activeTopic = DOCKER_14_TOPICS.find((t) => t.id === activeTopicId) || DOCKER_14_TOPICS[0];

  const totalConceptsCount = DOCKER_14_TOPICS.reduce((acc, t) => acc + t.concepts.length, 0);
  const progressPct = Math.round((completedConceptIds.length / totalConceptsCount) * 100);

  return (
    <div style={{ display: 'flex', flex: 1, height: '100%', width: '100%', overflow: 'hidden' }}>
      {/* LEFT SIDEBAR: 14 TOPICS & SUBTOPICS */}
      <aside
        style={{
          width: '320px',
          flexShrink: 0,
          background: 'var(--docker-surface)',
          borderRight: '1px solid var(--docker-border)',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          overflow: 'hidden',
        }}
      >
        {/* Search & Progress Header */}
        <div style={{ padding: '1.25rem 1rem 0.85rem', borderBottom: '1px solid var(--docker-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--docker-text-secondary)' }}>
              Docker Syllabus
            </span>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--docker-blue)' }}>
              {progressPct}% Completed
            </span>
          </div>

          {/* Progress Bar */}
          <div style={{ width: '100%', height: '6px', borderRadius: '999px', background: 'rgba(255,255,255,0.08)', marginBottom: '1rem', overflow: 'hidden' }}>
            <div style={{ width: `${progressPct}%`, height: '100%', background: 'linear-gradient(90deg, #0ea5e9, #38bdf8)', transition: 'width 0.3s ease' }} />
          </div>

          {/* Search Box */}
          <div style={{ position: 'relative' }}>
            <Search size={14} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--docker-text-muted)' }} />
            <input
              type="text"
              placeholder="Search concepts, commands..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '0.45rem 0.75rem 0.45rem 2.2rem',
                borderRadius: '8px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid var(--docker-border)',
                color: '#fff',
                fontSize: '0.8rem',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>
        </div>

        {/* Topic Accordions */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '0.75rem' }}>
          {DOCKER_14_TOPICS.map((topic) => {
            const isTopicActive = topic.id === activeTopicId;
            const topicCompletedCount = topic.concepts.filter((c) => completedConceptIds.includes(c.id)).length;

            const filteredConcepts = topic.concepts.filter(
              (c) =>
                c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                c.command.toLowerCase().includes(searchQuery.toLowerCase()) ||
                c.shortDesc.toLowerCase().includes(searchQuery.toLowerCase())
            );

            if (searchQuery && filteredConcepts.length === 0) return null;

            return (
              <div key={topic.id} style={{ marginBottom: '0.5rem' }}>
                <div
                  className={`dock-topic-item ${isTopicActive ? 'active' : ''}`}
                  onClick={() => setActiveTopicId(topic.id)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <div
                      style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '6px',
                        background: isTopicActive ? 'var(--docker-blue)' : 'rgba(255,255,255,0.08)',
                        color: isTopicActive ? '#fff' : 'var(--docker-text-secondary)',
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {topic.number}
                    </div>
                    <div>
                      <div style={{ fontSize: '0.84rem', fontWeight: 700, color: isTopicActive ? '#fff' : 'var(--docker-text-primary)' }}>
                        {topic.title}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--docker-text-muted)' }}>
                        {topicCompletedCount}/{topic.concepts.length} completed
                      </div>
                    </div>
                  </div>
                  <ChevronRight size={14} style={{ color: 'var(--docker-text-muted)', transform: isTopicActive ? 'rotate(90deg)' : 'none', transition: 'transform 0.15s ease' }} />
                </div>

                {/* Subtopic Concepts List */}
                {isTopicActive && (
                  <div style={{ paddingLeft: '1.25rem', marginTop: '0.25rem', borderLeft: '2px solid rgba(14, 165, 233, 0.2)', marginLeft: '0.75rem' }}>
                    {filteredConcepts.map((c) => {
                      const isConceptActive = c.id === activeConceptId;
                      const isDone = completedConceptIds.includes(c.id);

                      return (
                        <button
                          key={c.id}
                          onClick={() => {
                            setActiveConceptId(c.id);
                            markConceptComplete(c.id);
                          }}
                          style={{
                            width: '100%',
                            textAlign: 'left',
                            padding: '0.45rem 0.65rem',
                            borderRadius: '6px',
                            background: isConceptActive ? 'rgba(14, 165, 233, 0.18)' : 'transparent',
                            border: 'none',
                            color: isConceptActive ? '#fff' : isDone ? 'var(--docker-text-secondary)' : '#cbd5e1',
                            fontSize: '0.78rem',
                            fontWeight: isConceptActive ? 700 : 500,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginBottom: '0.2rem',
                            transition: 'all 0.15s ease',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', overflow: 'hidden' }}>
                            {isDone ? <CheckCircle2 size={13} color="#22c55e" /> : <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: isConceptActive ? 'var(--docker-blue)' : '#64748b' }} />}
                            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.title}</span>
                          </div>
                          <span style={{ fontSize: '0.65rem', padding: '0.1rem 0.35rem', borderRadius: '4px', background: 'rgba(255,255,255,0.06)', color: 'var(--docker-text-muted)' }}>
                            {c.difficulty[0]}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </aside>

      {/* RIGHT MAIN CONTENT AREA: CONCEPT MASTERY VIEW */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', overflowY: 'auto', background: 'var(--docker-dark-bg)', padding: '1.75rem 2rem 3rem' }}>
        {/* Concept Top Hero */}
        <div style={{ marginBottom: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--docker-blue)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Topic {currentConcept.topicNumber} &bull; {currentConcept.topicTitle}
            </span>
            {currentConcept.badges.map((b) => (
              <span key={b} style={{ fontSize: '0.68rem', fontWeight: 700, padding: '0.15rem 0.5rem', borderRadius: '999px', background: 'var(--docker-blue-light)', color: 'var(--docker-blue)', border: '1px solid var(--docker-border-active)' }}>
                {b}
              </span>
            ))}
          </div>

          <h1 style={{ fontSize: '2rem', fontWeight: 900, color: '#fff', margin: '0 0 0.4rem', letterSpacing: '-0.025em' }}>
            {currentConcept.title}
          </h1>

          <p style={{ fontSize: '1rem', color: 'var(--docker-text-secondary)', margin: '0 0 1.25rem', lineHeight: 1.5 }}>
            {currentConcept.subtitle}
          </p>

          {/* 6-Level Learning Tabs Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid var(--docker-border)', paddingBottom: '0.75rem', overflowX: 'auto' }}>
            <button className={`dock-level-tab ${activeTab === 'understand' ? 'active' : ''}`} onClick={() => setActiveTab('understand')}>
              <BookOpen size={15} />
              1. Understand
            </button>
            <button className={`dock-level-tab ${activeTab === 'syntax' ? 'active' : ''}`} onClick={() => setActiveTab('syntax')}>
              <Code size={15} />
              2. Syntax
            </button>
            <button className={`dock-level-tab ${activeTab === 'action' ? 'active' : ''}`} onClick={() => setActiveTab('action')}>
              <Eye size={15} />
              3. Visual Action
            </button>
            <button className={`dock-level-tab ${activeTab === 'explore' ? 'active' : ''}`} onClick={() => setActiveTab('explore')}>
              <Compass size={15} />
              4. Explore
            </button>
            <button className={`dock-level-tab ${activeTab === 'practice' ? 'active' : ''}`} onClick={() => setActiveTab('practice')}>
              <Terminal size={15} />
              5. Terminal Practice
            </button>
            <button className={`dock-level-tab ${activeTab === 'reference' ? 'active' : ''}`} onClick={() => setActiveTab('reference')}>
              <FileText size={15} />
              6. Reference
            </button>
          </div>
        </div>

        {/* TAB 1: UNDERSTAND */}
        {activeTab === 'understand' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div className="docker-card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--docker-blue)', fontWeight: 800, fontSize: '0.9rem', marginBottom: '0.85rem' }}>
                <Sparkles size={16} />
                <span>What is it?</span>
              </div>
              <p style={{ fontSize: '0.92rem', color: '#cbd5e1', lineHeight: 1.6, margin: 0 }}>
                {currentConcept.whatIsIt}
              </p>

              <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--docker-border)' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--docker-warning)', marginBottom: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  In Simple Words:
                </div>
                <p style={{ fontSize: '0.88rem', color: '#94a3b8', lineHeight: 1.5, margin: 0 }}>
                  {currentConcept.inSimpleWords}
                </p>
              </div>
            </div>

            <div className="docker-card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#38bdf8', fontWeight: 800, fontSize: '0.9rem', marginBottom: '0.85rem' }}>
                <Zap size={16} />
                <span>Why do you need it?</span>
              </div>
              <p style={{ fontSize: '0.92rem', color: '#cbd5e1', lineHeight: 1.6, margin: 0 }}>
                {currentConcept.whyDoYouNeedIt}
              </p>

              <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--docker-border)' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#a855f7', marginBottom: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Real World Analogy:
                </div>
                <p style={{ fontSize: '0.88rem', color: '#94a3b8', lineHeight: 1.5, margin: 0, fontStyle: 'italic' }}>
                  "{currentConcept.realWorldAnalogy}"
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SYNTAX */}
        {activeTab === 'syntax' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="docker-card" style={{ padding: '1.5rem' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--docker-blue)', marginBottom: '0.75rem' }}>
                Command Syntax Template
              </div>
              <div style={{ background: '#090d16', padding: '1.25rem', borderRadius: '10px', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.95rem', color: '#38bdf8', border: '1px solid var(--docker-border)' }}>
                {currentConcept.syntaxCode}
              </div>
            </div>

            <div className="docker-card" style={{ padding: '1.5rem' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#fff', marginBottom: '1rem' }}>
                Syntax Breakdown &amp; Flags
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {currentConcept.syntaxTokens.map((t, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(255,255,255,0.03)', padding: '0.65rem 1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <code style={{ fontFamily: 'JetBrains Mono, monospace', color: 'var(--docker-blue)', fontWeight: 700, fontSize: '0.85rem', minWidth: '160px' }}>
                      {t.token}
                    </code>
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '0.15rem 0.5rem', borderRadius: '4px', background: 'rgba(14, 165, 233, 0.1)', color: '#38bdf8' }}>
                      {t.role}
                    </span>
                    <span style={{ fontSize: '0.84rem', color: '#cbd5e1' }}>{t.explanation}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: VISUAL ACTION */}
        {activeTab === 'action' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem' }}>
            {/* Before */}
            <div className="docker-card" style={{ padding: '1.25rem', borderColor: 'rgba(234, 179, 8, 0.3)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#facc15' }}>1. BEFORE</span>
                <span style={{ fontSize: '0.68rem', fontWeight: 700, padding: '0.15rem 0.5rem', borderRadius: '999px', background: 'rgba(234,179,8,0.15)', color: '#facc15' }}>
                  {currentConcept.actionStage.before.stateBadge}
                </span>
              </div>
              <p style={{ fontSize: '0.84rem', color: '#cbd5e1', marginBottom: '1rem' }}>{currentConcept.actionStage.before.description}</p>
              <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.78rem', color: '#94a3b8' }}>
                {currentConcept.actionStage.before.details.map((d, i) => (
                  <li key={i} style={{ marginBottom: '0.3rem' }}>{d}</li>
                ))}
              </ul>
            </div>

            {/* Running */}
            <div className="docker-card" style={{ padding: '1.25rem', borderColor: 'rgba(14, 165, 233, 0.4)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--docker-blue)' }}>2. RUNNING</span>
                <span style={{ fontSize: '0.68rem', fontWeight: 700, padding: '0.15rem 0.5rem', borderRadius: '999px', background: 'var(--docker-blue-light)', color: 'var(--docker-blue)' }}>
                  {currentConcept.actionStage.running.stateBadge}
                </span>
              </div>
              <p style={{ fontSize: '0.84rem', color: '#cbd5e1', marginBottom: '1rem' }}>{currentConcept.actionStage.running.description}</p>
              <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.78rem', color: '#94a3b8' }}>
                {currentConcept.actionStage.running.details.map((d, i) => (
                  <li key={i} style={{ marginBottom: '0.3rem' }}>{d}</li>
                ))}
              </ul>
            </div>

            {/* After */}
            <div className="docker-card" style={{ padding: '1.25rem', borderColor: 'rgba(34, 197, 94, 0.4)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#4ade80' }}>3. AFTER</span>
                <span style={{ fontSize: '0.68rem', fontWeight: 700, padding: '0.15rem 0.5rem', borderRadius: '999px', background: 'rgba(34,197,94,0.15)', color: '#4ade80' }}>
                  {currentConcept.actionStage.after.stateBadge}
                </span>
              </div>
              <p style={{ fontSize: '0.84rem', color: '#cbd5e1', marginBottom: '1rem' }}>{currentConcept.actionStage.after.description}</p>
              <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.78rem', color: '#94a3b8' }}>
                {currentConcept.actionStage.after.details.map((d, i) => (
                  <li key={i} style={{ marginBottom: '0.3rem' }}>{d}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* TAB 4: EXPLORE */}
        {activeTab === 'explore' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="docker-card" style={{ padding: '1.5rem' }}>
              <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#fff', marginBottom: '1rem' }}>
                Command Variations
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {currentConcept.variations.map((v, i) => (
                  <div key={i} style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '10px', border: '1px solid var(--docker-border)' }}>
                    <div style={{ fontWeight: 700, color: '#38bdf8', fontSize: '0.86rem', marginBottom: '0.35rem' }}>{v.title}</div>
                    {v.syntax && (
                      <code style={{ display: 'block', background: '#090d16', padding: '0.45rem 0.75rem', borderRadius: '6px', color: '#facc15', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.8rem', marginBottom: '0.5rem' }}>
                        {v.syntax}
                      </code>
                    )}
                    <div style={{ fontSize: '0.82rem', color: '#cbd5e1' }}>{v.whatItDoes}</div>
                  </div>
                ))}
              </div>
            </div>

            {currentConcept.scenarios.length > 0 && (
              <div className="docker-card" style={{ padding: '1.5rem' }}>
                <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#fff', marginBottom: '1rem' }}>
                  Architecture Scenario Quiz
                </div>
                {currentConcept.scenarios.map((sc, i) => (
                  <div key={i} style={{ background: 'rgba(14, 165, 233, 0.08)', padding: '1.25rem', borderRadius: '10px', border: '1px solid var(--docker-border-active)' }}>
                    <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.9rem', marginBottom: '0.75rem' }}>{sc.question}</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {sc.options?.map((opt, oIdx) => (
                        <div key={oIdx} style={{ padding: '0.65rem 0.85rem', borderRadius: '8px', background: opt.isCorrect ? 'rgba(34,197,94,0.15)' : 'rgba(255,255,255,0.04)', border: opt.isCorrect ? '1px solid rgba(34,197,94,0.4)' : '1px solid transparent' }}>
                          <div style={{ fontWeight: 600, color: opt.isCorrect ? '#4ade80' : '#cbd5e1', fontSize: '0.84rem' }}>
                            {opt.label}
                          </div>
                          <div style={{ fontSize: '0.76rem', color: '#94a3b8', marginTop: '0.2rem' }}>
                            {opt.explanation}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 5: TERMINAL PRACTICE */}
        {activeTab === 'practice' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="docker-card" style={{ padding: '1.25rem' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--docker-blue)', marginBottom: '0.4rem' }}>
                Guided Task Objective:
              </div>
              <div style={{ fontSize: '0.92rem', color: '#fff', fontWeight: 700 }}>
                {currentConcept.sandbox.targetTask || 'Practice running Docker CLI commands in the interactive terminal below.'}
              </div>

              {currentConcept.sandbox.guidedSteps.length > 0 && (
                <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--docker-border)' }}>
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--docker-text-secondary)', marginBottom: '0.4rem' }}>Recommended Steps:</div>
                  <ol style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.82rem', color: '#cbd5e1' }}>
                    {currentConcept.sandbox.guidedSteps.map((s, idx) => (
                      <li key={idx} style={{ marginBottom: '0.3rem' }}>
                        {s.instruction} &mdash; <code style={{ color: '#38bdf8', fontFamily: 'JetBrains Mono, monospace' }}>{s.command}</code>
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </div>

            {/* Terminal Container */}
            <div style={{ height: '360px' }}>
              <DockerTerminal />
            </div>
          </div>
        )}

        {/* TAB 6: REFERENCE */}
        {activeTab === 'reference' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div className="docker-card" style={{ padding: '1.5rem' }}>
              <div style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--docker-blue)', marginBottom: '1rem' }}>
                Quick Cheat Sheet
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {currentConcept.reference.syntaxCheatSheet?.map((item, idx) => (
                  <code key={idx} style={{ background: '#090d16', padding: '0.5rem 0.75rem', borderRadius: '6px', color: '#38bdf8', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.8rem', border: '1px solid var(--docker-border)' }}>
                    {item}
                  </code>
                ))}
              </div>
            </div>

            <div className="docker-card" style={{ padding: '1.5rem' }}>
              <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#4ade80', marginBottom: '1rem' }}>
                Best Practices &amp; Production Tips
              </div>
              <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.84rem', color: '#cbd5e1', lineHeight: 1.6 }}>
                {currentConcept.reference.bestPractices?.map((bp, idx) => (
                  <li key={idx} style={{ marginBottom: '0.5rem' }}>{bp}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
