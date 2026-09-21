import React, { useState, useMemo } from 'react';
import { useDocker } from '../../context/DockerContext';
import { DOCKER_14_TOPICS } from '../../data/unifiedDockerData';
import { UniversalTeachingShell } from '../simulators/UniversalTeachingShell';
import {
  Search,
  CheckCircle2,
  ChevronRight,
  Sparkles,
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
    executeCommand,
  } = useDocker();

  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage((curr) => (curr === msg ? null : curr)), 2500);
  };

  // Flattened concepts array for Previous / Next navigation
  const allConceptsFlat = useMemo(() => {
    return DOCKER_14_TOPICS.flatMap((t) => t.concepts.map((c) => ({ ...c, topicId: t.id })));
  }, []);

  const currentConceptIdx = allConceptsFlat.findIndex((c) => c.id === activeConceptId);
  const prevConcept = currentConceptIdx > 0 ? allConceptsFlat[currentConceptIdx - 1] : null;
  const nextConcept = currentConceptIdx < allConceptsFlat.length - 1 ? allConceptsFlat[currentConceptIdx + 1] : null;

  const totalConceptsCount = allConceptsFlat.length;
  const progressPct = Math.round((completedConceptIds.length / totalConceptsCount) * 100);

  return (
    <div style={{ display: 'flex', flex: 1, height: '100%', width: '100%', overflow: 'hidden' }}>
      {/* ==================================================================== */}
      {/* LEFT SIDEBAR: 14 DOCKER TOPICS & SUBTOPICS ACCORDION */}
      {/* ==================================================================== */}
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
              Docker Topics ({DOCKER_14_TOPICS.length})
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

        {/* Bottom Motivation Banner */}
        <div style={{ padding: '0.85rem 1rem', margin: '0.5rem 0.75rem 0.75rem', borderRadius: '10px', background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.15) 0%, rgba(2, 132, 199, 0.08) 100%)', border: '1px solid var(--docker-border-active)', display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div>
            <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#fff' }}>Keep Going!</div>
            <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Hands-on learning makes it stick. 🚀</div>
          </div>
        </div>
      </aside>

      {/* ==================================================================== */}
      {/* RIGHT MAIN STAGE AREA: UNIVERSAL TEACHING SHELL */}
      {/* ==================================================================== */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', overflowY: 'auto', background: '#090d16', padding: 0 }}>
        <UniversalTeachingShell
          concept={currentConcept}
          completedConceptIds={completedConceptIds}
          markConceptComplete={markConceptComplete}
          executeCommand={executeCommand}
          showToast={showToast}
          prevConcept={prevConcept}
          nextConcept={nextConcept}
          onSelectConcept={(id) => {
            setActiveConceptId(id);
            const targetTopic = DOCKER_14_TOPICS.find((t) => t.concepts.some((c) => c.id === id));
            if (targetTopic) setActiveTopicId(targetTopic.id);
          }}
        />

        {/* Floating Toast Notification Banner */}
        {toastMessage && (
          <div
            style={{
              position: 'fixed',
              bottom: '28px',
              right: '28px',
              background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
              color: '#fff',
              padding: '0.65rem 1.25rem',
              borderRadius: '12px',
              boxShadow: '0 12px 30px rgba(14, 165, 233, 0.45)',
              fontWeight: 800,
              fontSize: '0.84rem',
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              gap: '0.55rem',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <Sparkles size={16} color="#fff" />
            <span>{toastMessage}</span>
          </div>
        )}
      </main>
    </div>
  );
};
