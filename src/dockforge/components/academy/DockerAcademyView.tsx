import React, { useState, useMemo } from 'react';
import { useDocker } from '../../context/DockerContext';
import { DOCKER_14_TOPICS } from '../../data/unifiedDockerData';
import { DockerTerminal } from '../terminal/DockerTerminal';
import { UniversalTeachingShell } from '../simulators/UniversalTeachingShell';
import {
  BookOpen,
  Search,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
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
  Pause,
  Square,
  Trash2,
  Copy,
  Check,
  Cpu,
  Database,
  ShieldCheck,
  HardDrive,
  Activity,
  ArrowRight,
  RefreshCw,
  Lightbulb,
  Globe,
  Server,
  Box,
  Monitor,
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
  const [activeTab, setActiveTab] = useState<'understand' | 'syntax' | 'action' | 'explore' | 'practice' | 'reference'>('understand');
  const [simpleMode, setSimpleMode] = useState(true); // Default to intuitive Simple ELI5 mode!

  // Interactive Architecture Canvas Node Selection (Tab 1)
  const [selectedCanvasNode, setSelectedCanvasNode] = useState<'laptop' | 'port' | 'bridge' | 'container' | 'volume'>('container');

  // Interactive Flag Tinkerer State (Tab 2)
  const [flagDetached, setFlagDetached] = useState(true);
  const [flagPort, setFlagPort] = useState(true);
  const [flagVolume, setFlagVolume] = useState(false);
  const [flagEnv, setFlagEnv] = useState(false);
  const [flagRestart, setFlagRestart] = useState(false);
  const [flagReadOnly, setFlagReadOnly] = useState(false);
  const [copiedCommand, setCopiedCommand] = useState(false);

  // Interactive Lifecycle Simulator State (Tab 3)
  const [simState, setSimState] = useState<'created' | 'running' | 'paused' | 'stopped' | 'removed'>('running');
  const [simLogs, setSimLogs] = useState<string[]>([
    '🟢 [START] Container process spawned as PID 1',
    '🌐 [NET] Listening on 0.0.0.0:8080 -> 172.17.0.2:80',
    '✅ [OK] Ready to receive HTTP traffic',
  ]);

  // Interactive Quiz State (Tab 4)
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});

  // Interactive Card Expansion States & Toast Feedback
  const [expandedCard, setExpandedCard] = useState<'tech' | 'why' | 'before' | 'running' | 'after' | null>(null);
  const [activeTokenHighlight, setActiveTokenHighlight] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Concept-Specific Visual Simulator Widget States (Tab 3)
  const [buildLayerStep, setBuildLayerStep] = useState<number>(4);
  const [volumeFiles, setVolumeFiles] = useState<string[]>(['db.sqlite', 'app.log']);
  const [packetStep, setPacketStep] = useState<number>(0);
  const [composeServicesRunning, setComposeServicesRunning] = useState<boolean>(true);
  const [composeScale, setComposeScale] = useState<number>(2);
  const [secReadonly, setSecReadonly] = useState<boolean>(true);
  const [secNonRoot, setSecNonRoot] = useState<boolean>(true);
  const [secNoCaps, setSecNoCaps] = useState<boolean>(true);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage((curr) => (curr === msg ? null : curr)), 2500);
  };

  // Concept-specific visual simulator mode
  const simulatorType = useMemo(() => {
    const id = activeConceptId.toLowerCase();
    const topicNum = Number(currentConcept.topicNumber);
    if (id.includes('compose') || topicNum === 9 || topicNum === 10) return 'compose';
    if (id.includes('volume') || id.includes('bind') || id.includes('mount') || id.includes('tmpfs') || topicNum === 5) return 'volume';
    if (id.includes('network') || id.includes('port') || id.includes('bridge') || id.includes('host-net') || id.includes('overlay') || topicNum === 4) return 'network';
    if (id.includes('image') || id.includes('build') || id.includes('dockerfile') || id.includes('layer') || id.includes('multistage') || topicNum === 7 || topicNum === 8) return 'image';
    if (id.includes('security') || id.includes('rootless') || id.includes('seccomp') || id.includes('scan') || topicNum === 12) return 'security';
    return 'lifecycle';
  }, [activeConceptId, currentConcept]);

  // Flattened concepts array for Previous / Next navigation
  const allConceptsFlat = useMemo(() => {
    return DOCKER_14_TOPICS.flatMap((t) => t.concepts.map((c) => ({ ...c, topicId: t.id })));
  }, []);

  const currentConceptIdx = allConceptsFlat.findIndex((c) => c.id === activeConceptId);
  const prevConcept = currentConceptIdx > 0 ? allConceptsFlat[currentConceptIdx - 1] : null;
  const nextConcept = currentConceptIdx < allConceptsFlat.length - 1 ? allConceptsFlat[currentConceptIdx + 1] : null;

  const totalConceptsCount = allConceptsFlat.length;
  const progressPct = Math.round((completedConceptIds.length / totalConceptsCount) * 100);

  // Preset Applicator for Flag Tinkerer
  const applyPreset = (preset: 'web' | 'db' | 'redis' | 'dev') => {
    if (preset === 'web') {
      setFlagDetached(true);
      setFlagPort(true);
      setFlagVolume(false);
      setFlagEnv(false);
      setFlagRestart(true);
      setFlagReadOnly(false);
    } else if (preset === 'db') {
      setFlagDetached(true);
      setFlagPort(true);
      setFlagVolume(true);
      setFlagEnv(true);
      setFlagRestart(true);
      setFlagReadOnly(false);
    } else if (preset === 'redis') {
      setFlagDetached(true);
      setFlagPort(true);
      setFlagVolume(false);
      setFlagEnv(false);
      setFlagRestart(false);
      setFlagReadOnly(false);
    } else if (preset === 'dev') {
      setFlagDetached(true);
      setFlagPort(true);
      setFlagVolume(true);
      setFlagEnv(true);
      setFlagRestart(false);
      setFlagReadOnly(false);
    }
  };

  // Constructed command from Flag Tinkerer
  const generatedCommand = useMemo(() => {
    let cmd = 'docker run';
    if (flagDetached) cmd += ' -d';
    cmd += ' --name my-web-app';
    if (flagPort) cmd += ' -p 8080:80';
    if (flagVolume) cmd += ' -v app-data:/usr/share/nginx/html';
    if (flagEnv) cmd += ' -e NODE_ENV=production';
    if (flagRestart) cmd += ' --restart=always';
    if (flagReadOnly) cmd += ' --read-only --tmpfs /tmp';
    cmd += ' nginx:1.25-alpine';
    return cmd;
  }, [flagDetached, flagPort, flagVolume, flagEnv, flagRestart, flagReadOnly]);

  const handleCopyCommand = () => {
    navigator.clipboard.writeText(generatedCommand);
    setCopiedCommand(true);
    setTimeout(() => setCopiedCommand(false), 2000);
  };

  const handleExecuteGenerated = () => {
    executeCommand(generatedCommand);
    setActiveTab('practice');
  };

  const isCurrentMastered = completedConceptIds.includes(activeConceptId);

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
        {/* Concept Top Hero & Intuitive Mode Toggle */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--docker-blue)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Topic {currentConcept.topicNumber} &bull; {currentConcept.topicTitle}
              </span>
              {currentConcept.badges.map((b) => (
                <span key={b} style={{ fontSize: '0.68rem', fontWeight: 700, padding: '0.15rem 0.5rem', borderRadius: '999px', background: 'var(--docker-blue-light)', color: 'var(--docker-blue)', border: '1px solid var(--docker-border-active)' }}>
                  {b}
                </span>
              ))}
            </div>

            {/* Navigation, Intuitive Toggle & Mastery Controls */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              {/* Simple ELI5 Mode Toggle */}
              <button
                onClick={() => setSimpleMode(!simpleMode)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.35rem 0.75rem',
                  borderRadius: '999px',
                  background: simpleMode ? 'rgba(234, 179, 8, 0.16)' : 'rgba(255,255,255,0.05)',
                  border: simpleMode ? '1px solid rgba(234, 179, 8, 0.45)' : '1px solid var(--docker-border)',
                  color: simpleMode ? '#facc15' : 'var(--docker-text-secondary)',
                  fontSize: '0.76rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  boxShadow: simpleMode ? '0 0 12px rgba(234, 179, 8, 0.2)' : 'none',
                }}
              >
                <Lightbulb size={14} color={simpleMode ? '#facc15' : 'var(--docker-text-muted)'} />
                <span>{simpleMode ? '💡 Simple Explanation ON' : '💡 Enable Simple Explanation'}</span>
              </button>

              <button
                onClick={() => markConceptComplete(activeConceptId)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.35rem 0.75rem',
                  borderRadius: '8px',
                  background: isCurrentMastered ? 'rgba(34, 197, 94, 0.15)' : 'rgba(255,255,255,0.06)',
                  border: isCurrentMastered ? '1px solid rgba(34, 197, 94, 0.4)' : '1px solid var(--docker-border)',
                  color: isCurrentMastered ? '#4ade80' : 'var(--docker-text-secondary)',
                  fontSize: '0.76rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                <CheckCircle2 size={14} color={isCurrentMastered ? '#22c55e' : 'var(--docker-text-muted)'} />
                <span>{isCurrentMastered ? 'Learned ✓' : 'Mark as Learned'}</span>
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <button
                  disabled={!prevConcept}
                  onClick={() => {
                    if (prevConcept) {
                      setActiveConceptId(prevConcept.id);
                      setActiveTopicId(prevConcept.topicId);
                    }
                  }}
                  style={{
                    padding: '0.35rem 0.6rem',
                    borderRadius: '6px',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid var(--docker-border)',
                    color: prevConcept ? '#fff' : 'var(--docker-text-muted)',
                    cursor: prevConcept ? 'pointer' : 'not-allowed',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.2rem',
                    fontSize: '0.75rem',
                  }}
                >
                  <ChevronLeft size={14} />
                  Prev
                </button>

                <button
                  disabled={!nextConcept}
                  onClick={() => {
                    if (nextConcept) {
                      setActiveConceptId(nextConcept.id);
                      setActiveTopicId(nextConcept.topicId);
                    }
                  }}
                  style={{
                    padding: '0.35rem 0.6rem',
                    borderRadius: '6px',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid var(--docker-border)',
                    color: nextConcept ? '#fff' : 'var(--docker-text-muted)',
                    cursor: nextConcept ? 'pointer' : 'not-allowed',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.2rem',
                    fontSize: '0.75rem',
                  }}
                >
                  Next
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </div>

          <h1 style={{ fontSize: '2rem', fontWeight: 900, color: '#fff', margin: '0 0 0.4rem', letterSpacing: '-0.025em' }}>
            {currentConcept.title}
          </h1>

          <p style={{ fontSize: '0.96rem', color: 'var(--docker-text-secondary)', margin: '0 0 1.25rem', lineHeight: 1.5 }}>
            {currentConcept.subtitle}
          </p>

          {/* 6-Level Learning Tabs Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid var(--docker-border)', paddingBottom: '0.75rem', overflowX: 'auto' }}>
            <button className={`dock-level-tab ${activeTab === 'understand' ? 'active' : ''}`} onClick={() => setActiveTab('understand')}>
              <BookOpen size={15} />
              1. Understand &amp; Visual Map
            </button>
            <button className={`dock-level-tab ${activeTab === 'syntax' ? 'active' : ''}`} onClick={() => setActiveTab('syntax')}>
              <Code size={15} />
              2. Command Builder
            </button>
            <button className={`dock-level-tab ${activeTab === 'action' ? 'active' : ''}`} onClick={() => setActiveTab('action')}>
              <Eye size={15} />
              3. Visual Simulator
            </button>
            <button className={`dock-level-tab ${activeTab === 'explore' ? 'active' : ''}`} onClick={() => setActiveTab('explore')}>
              <Compass size={15} />
              4. Quiz Arena
            </button>
            <button className={`dock-level-tab ${activeTab === 'practice' ? 'active' : ''}`} onClick={() => setActiveTab('practice')}>
              <Terminal size={15} />
              5. Live Terminal
            </button>
            <button className={`dock-level-tab ${activeTab === 'reference' ? 'active' : ''}`} onClick={() => setActiveTab('reference')}>
              <FileText size={15} />
              6. Reference Cheat Sheet
            </button>
          </div>
        </div>

        {/* TAB 1: UNDERSTAND & INTUITIVE VISUAL ARCHITECTURE MAP */}
        {activeTab === 'understand' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Simple ELI5 Summary Hero Box when Simple Mode is enabled */}
            {simpleMode && (
              <div
                style={{
                  background: 'linear-gradient(135deg, rgba(234, 179, 8, 0.12) 0%, rgba(14, 165, 233, 0.12) 100%)',
                  border: '1px solid rgba(234, 179, 8, 0.35)',
                  borderRadius: '16px',
                  padding: '1.25rem 1.5rem',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '1rem',
                  boxShadow: '0 8px 24px -10px rgba(234, 179, 8, 0.15)',
                }}
              >
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(234, 179, 8, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#facc15', flexShrink: 0 }}>
                  <Lightbulb size={22} />
                </div>
                <div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#facc15', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.25rem' }}>
                    Super-Simple Takeaway (Explain Like I'm 5)
                  </div>
                  <div style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', lineHeight: 1.5, marginBottom: '0.35rem' }}>
                    {currentConcept.inSimpleWords}
                  </div>
                  <div style={{ fontSize: '0.84rem', color: '#cbd5e1', fontStyle: 'italic' }}>
                    💡 <strong>Real World Analogy:</strong> "{currentConcept.realWorldAnalogy}"
                  </div>
                </div>
              </div>
            )}

            {/* Interactive Visual Architecture Flow Canvas */}
            <div className="docker-card" style={{ padding: '1.5rem', borderColor: 'var(--docker-border-active)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Layers size={16} color="var(--docker-blue)" />
                  <span>Interactive Architecture Mesh (Click Any Block to Inspect)</span>
                </div>
                <span style={{ fontSize: '0.72rem', color: 'var(--docker-blue)', fontWeight: 700 }}>
                  Selected: {selectedCanvasNode.toUpperCase()}
                </span>
              </div>

              {/* Visual Architecture Mesh Diagram */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.75rem', marginBottom: '1.25rem' }}>
                {/* Node 1: Laptop Browser */}
                <button
                  onClick={() => {
                    setSelectedCanvasNode('laptop');
                    showToast('Inspecting Node 1: Laptop Chrome Browser flow');
                  }}
                  style={{
                    padding: '1rem 0.75rem',
                    borderRadius: '12px',
                    background: selectedCanvasNode === 'laptop' ? 'rgba(14, 165, 233, 0.2)' : 'rgba(255,255,255,0.03)',
                    border: selectedCanvasNode === 'laptop' ? '2px solid var(--docker-blue)' : '1px solid var(--docker-border)',
                    color: '#fff',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <Monitor size={22} style={{ margin: '0 auto 0.4rem', color: selectedCanvasNode === 'laptop' ? 'var(--docker-blue)' : '#94a3b8' }} />
                  <div style={{ fontWeight: 800, fontSize: '0.8rem' }}>1. Your Laptop</div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--docker-text-muted)' }}>Chrome Browser</div>
                </button>

                {/* Node 2: Port Binding */}
                <button
                  onClick={() => {
                    setSelectedCanvasNode('port');
                    showToast('Inspecting Node 2: Host Port Binding (-p 8080:80)');
                  }}
                  style={{
                    padding: '1rem 0.75rem',
                    borderRadius: '12px',
                    background: selectedCanvasNode === 'port' ? 'rgba(234, 179, 8, 0.2)' : 'rgba(255,255,255,0.03)',
                    border: selectedCanvasNode === 'port' ? '2px solid #eab308' : '1px solid var(--docker-border)',
                    color: '#fff',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <Globe size={22} style={{ margin: '0 auto 0.4rem', color: selectedCanvasNode === 'port' ? '#facc15' : '#94a3b8' }} />
                  <div style={{ fontWeight: 800, fontSize: '0.8rem' }}>2. Port 8080</div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--docker-text-muted)' }}>Host Port Binding</div>
                </button>

                {/* Node 3: Docker Engine Switch */}
                <button
                  onClick={() => {
                    setSelectedCanvasNode('bridge');
                    showToast('Inspecting Node 3: Docker Daemon Bridge Switch');
                  }}
                  style={{
                    padding: '1rem 0.75rem',
                    borderRadius: '12px',
                    background: selectedCanvasNode === 'bridge' ? 'rgba(56, 189, 248, 0.2)' : 'rgba(255,255,255,0.03)',
                    border: selectedCanvasNode === 'bridge' ? '2px solid #38bdf8' : '1px solid var(--docker-border)',
                    color: '#fff',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <Server size={22} style={{ margin: '0 auto 0.4rem', color: selectedCanvasNode === 'bridge' ? '#38bdf8' : '#94a3b8' }} />
                  <div style={{ fontWeight: 800, fontSize: '0.8rem' }}>3. Docker Engine</div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--docker-text-muted)' }}>Bridge Switch</div>
                </button>

                {/* Node 4: Isolated Container */}
                <button
                  onClick={() => {
                    setSelectedCanvasNode('container');
                    showToast('Inspecting Node 4: Isolated Container PID 1 Process');
                  }}
                  style={{
                    padding: '1rem 0.75rem',
                    borderRadius: '12px',
                    background: selectedCanvasNode === 'container' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(255,255,255,0.03)',
                    border: selectedCanvasNode === 'container' ? '2px solid #22c55e' : '1px solid var(--docker-border)',
                    color: '#fff',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <Box size={22} style={{ margin: '0 auto 0.4rem', color: selectedCanvasNode === 'container' ? '#4ade80' : '#94a3b8' }} />
                  <div style={{ fontWeight: 800, fontSize: '0.8rem' }}>4. Container</div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--docker-text-muted)' }}>IP: 172.17.0.2</div>
                </button>

                {/* Node 5: Storage Volume */}
                <button
                  onClick={() => {
                    setSelectedCanvasNode('volume');
                    showToast('Inspecting Node 5: Persistent Volume Mount');
                  }}
                  style={{
                    padding: '1rem 0.75rem',
                    borderRadius: '12px',
                    background: selectedCanvasNode === 'volume' ? 'rgba(168, 85, 247, 0.2)' : 'rgba(255,255,255,0.03)',
                    border: selectedCanvasNode === 'volume' ? '2px solid #a855f7' : '1px solid var(--docker-border)',
                    color: '#fff',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <Database size={22} style={{ margin: '0 auto 0.4rem', color: selectedCanvasNode === 'volume' ? '#c084fc' : '#94a3b8' }} />
                  <div style={{ fontWeight: 800, fontSize: '0.8rem' }}>5. Volume Mount</div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--docker-text-muted)' }}>Persisted Data</div>
                </button>
              </div>

              {/* Node Inspector Popover Card */}
              <div style={{ background: '#090d16', padding: '1rem 1.25rem', borderRadius: '10px', border: '1px solid var(--docker-border)', fontSize: '0.86rem', color: '#cbd5e1', lineHeight: 1.5 }}>
                {selectedCanvasNode === 'laptop' && (
                  <div>
                    <strong style={{ color: 'var(--docker-blue)' }}>1. Your Computer / Browser:</strong> You type <code>http://localhost:8080</code> in Chrome. Your laptop sends a standard network HTTP request to local port 8080.
                  </div>
                )}
                {selectedCanvasNode === 'port' && (
                  <div>
                    <strong style={{ color: '#facc15' }}>2. Host Port Binding (8080):</strong> Port 8080 acts as the front door on your host computer. The <code>-p 8080:80</code> flag catches traffic on port 8080 and forwards it inside Docker.
                  </div>
                )}
                {selectedCanvasNode === 'bridge' && (
                  <div>
                    <strong style={{ color: '#38bdf8' }}>3. Docker Daemon &amp; Bridge Switch:</strong> The Docker daemon routes traffic over the virtual bridge network (subnet 172.17.0.0/16) directly to the target container.
                  </div>
                )}
                {selectedCanvasNode === 'container' && (
                  <div>
                    <strong style={{ color: '#4ade80' }}>4. Isolated Container Process:</strong> Inside the container, PID 1 (Nginx or Node) receives the request on internal Port 80 and serves the response back to your laptop instantly.
                  </div>
                )}
                {selectedCanvasNode === 'volume' && (
                  <div>
                    <strong style={{ color: '#c084fc' }}>5. Persistent Volume Mount:</strong> Any data written to <code>/var/lib/postgresql/data</code> bypasses the container and saves safely directly on host disk volume <code>pgdata</code>.
                  </div>
                )}
              </div>
            </div>

            {/* Standard Detailed Cards (Interactive) */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div
                className="docker-card"
                onClick={() => {
                  setExpandedCard(expandedCard === 'tech' ? null : 'tech');
                  showToast(expandedCard === 'tech' ? 'Collapsed Technical Definition Card' : 'Expanded Technical Architecture Breakdown!');
                }}
                style={{
                  padding: '1.5rem',
                  cursor: 'pointer',
                  borderColor: expandedCard === 'tech' ? 'var(--docker-blue)' : 'var(--docker-border)',
                  background: expandedCard === 'tech' ? 'rgba(14, 165, 233, 0.08)' : 'var(--docker-surface)',
                  transition: 'all 0.2s ease',
                  boxShadow: expandedCard === 'tech' ? '0 0 20px rgba(14, 165, 233, 0.2)' : 'none',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--docker-blue)', fontWeight: 800, fontSize: '0.9rem' }}>
                    <Sparkles size={16} />
                    <span>Technical Definition</span>
                  </div>
                  <span style={{ fontSize: '0.7rem', color: 'var(--docker-blue)', fontWeight: 700, padding: '0.15rem 0.5rem', borderRadius: '4px', background: 'rgba(14, 165, 233, 0.12)' }}>
                    {expandedCard === 'tech' ? 'Click to Collapse ▲' : 'Click to Expand Deep-Dive ▼'}
                  </span>
                </div>
                <p style={{ fontSize: '0.92rem', color: '#cbd5e1', lineHeight: 1.6, margin: 0 }}>
                  {currentConcept.whatIsIt}
                </p>

                {expandedCard === 'tech' && (
                  <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--docker-border)', fontSize: '0.84rem', color: '#94a3b8' }}>
                    <div style={{ fontWeight: 800, color: '#fff', marginBottom: '0.4rem' }}>⚙️ Underlying Kernel Primitives:</div>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                      <span style={{ padding: '0.2rem 0.6rem', borderRadius: '6px', background: 'rgba(255,255,255,0.06)', color: '#38bdf8', fontSize: '0.75rem', fontWeight: 700 }}>Linux Namespaces</span>
                      <span style={{ padding: '0.2rem 0.6rem', borderRadius: '6px', background: 'rgba(255,255,255,0.06)', color: '#4ade80', fontSize: '0.75rem', fontWeight: 700 }}>cgroups CPU/RAM limits</span>
                      <span style={{ padding: '0.2rem 0.6rem', borderRadius: '6px', background: 'rgba(255,255,255,0.06)', color: '#facc15', fontSize: '0.75rem', fontWeight: 700 }}>OverlayFS Storage</span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveTab('practice');
                        showToast('Switched to Live Terminal practice!');
                      }}
                      style={{ padding: '0.35rem 0.75rem', borderRadius: '6px', background: 'var(--docker-blue)', color: '#fff', border: 'none', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
                    >
                      Test in Terminal &rarr;
                    </button>
                  </div>
                )}
              </div>

              <div
                className="docker-card"
                onClick={() => {
                  setExpandedCard(expandedCard === 'why' ? null : 'why');
                  showToast(expandedCard === 'why' ? 'Collapsed Impact Card' : 'Expanded Production Impact Breakdown!');
                }}
                style={{
                  padding: '1.5rem',
                  cursor: 'pointer',
                  borderColor: expandedCard === 'why' ? '#38bdf8' : 'var(--docker-border)',
                  background: expandedCard === 'why' ? 'rgba(56, 189, 248, 0.08)' : 'var(--docker-surface)',
                  transition: 'all 0.2s ease',
                  boxShadow: expandedCard === 'why' ? '0 0 20px rgba(56, 189, 248, 0.2)' : 'none',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#38bdf8', fontWeight: 800, fontSize: '0.9rem' }}>
                    <Zap size={16} />
                    <span>Why do you need it?</span>
                  </div>
                  <span style={{ fontSize: '0.7rem', color: '#38bdf8', fontWeight: 700, padding: '0.15rem 0.5rem', borderRadius: '4px', background: 'rgba(56, 189, 248, 0.12)' }}>
                    {expandedCard === 'why' ? 'Click to Collapse ▲' : 'Click to Expand Matrix ▼'}
                  </span>
                </div>
                <p style={{ fontSize: '0.92rem', color: '#cbd5e1', lineHeight: 1.6, margin: 0 }}>
                  {currentConcept.whyDoYouNeedIt}
                </p>

                {expandedCard === 'why' && (
                  <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--docker-border)', fontSize: '0.82rem', color: '#cbd5e1' }}>
                    <div style={{ fontWeight: 800, color: '#fff', marginBottom: '0.5rem' }}>📊 VM vs Container Comparison:</div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', background: '#090d16', padding: '0.75rem', borderRadius: '8px', fontSize: '0.76rem' }}>
                      <div>❌ <strong>Legacy VMs:</strong> Gigabyte OS images, 2-minute boot, 4GB RAM overhead.</div>
                      <div>✅ <strong>Docker Containers:</strong> Megabyte OCI images, 200ms boot, shared OS kernel.</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: INTERACTIVE COMMAND BUILDER & PRESET WIDGETS */}
        {activeTab === 'syntax' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Quick Presets Cards */}
            <div className="docker-card" style={{ padding: '1.25rem' }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--docker-blue)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.75rem' }}>
                Quick 1-Click Command Presets (Click to Auto-Configure):
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
                <button
                  onClick={() => applyPreset('web')}
                  style={{
                    padding: '0.65rem 0.85rem',
                    borderRadius: '10px',
                    background: 'rgba(14, 165, 233, 0.12)',
                    border: '1px solid var(--docker-border-active)',
                    color: '#fff',
                    textAlign: 'left',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                >
                  <Globe size={18} color="var(--docker-blue)" />
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '0.8rem' }}>Web Server (Nginx)</div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--docker-text-muted)' }}>Port 8080 + Auto-restart</div>
                  </div>
                </button>

                <button
                  onClick={() => applyPreset('db')}
                  style={{
                    padding: '0.65rem 0.85rem',
                    borderRadius: '10px',
                    background: 'rgba(34, 197, 94, 0.12)',
                    border: '1px solid rgba(34, 197, 94, 0.3)',
                    color: '#fff',
                    textAlign: 'left',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                >
                  <Database size={18} color="#4ade80" />
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '0.8rem' }}>Database (Postgres)</div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--docker-text-muted)' }}>Volume Mount + Secrets</div>
                  </div>
                </button>

                <button
                  onClick={() => applyPreset('redis')}
                  style={{
                    padding: '0.65rem 0.85rem',
                    borderRadius: '10px',
                    background: 'rgba(239, 68, 68, 0.12)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    color: '#fff',
                    textAlign: 'left',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                >
                  <Zap size={18} color="#ef4444" />
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '0.8rem' }}>In-Memory Cache (Redis)</div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--docker-text-muted)' }}>Fast Port 6379</div>
                  </div>
                </button>

                <button
                  onClick={() => applyPreset('dev')}
                  style={{
                    padding: '0.65rem 0.85rem',
                    borderRadius: '10px',
                    background: 'rgba(168, 85, 247, 0.12)',
                    border: '1px solid rgba(168, 85, 247, 0.3)',
                    color: '#fff',
                    textAlign: 'left',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                >
                  <Code size={18} color="#c084fc" />
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '0.8rem' }}>Live Dev Code (Bind Mount)</div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--docker-text-muted)' }}>Host sync + Hot reload</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Live Interactive Flag Tinkerer */}
            <div className="docker-card" style={{ padding: '1.5rem', borderColor: 'var(--docker-border-active)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Code size={16} color="var(--docker-blue)" />
                  <span>Interactive Command Flag Tinkerer</span>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={handleCopyCommand}
                    style={{
                      padding: '0.35rem 0.75rem',
                      borderRadius: '6px',
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid var(--docker-border)',
                      color: '#fff',
                      fontSize: '0.76rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                    }}
                  >
                    {copiedCommand ? <Check size={13} color="#22c55e" /> : <Copy size={13} />}
                    {copiedCommand ? 'Copied!' : 'Copy'}
                  </button>

                  <button
                    onClick={handleExecuteGenerated}
                    style={{
                      padding: '0.35rem 0.85rem',
                      borderRadius: '6px',
                      background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
                      color: '#fff',
                      border: 'none',
                      fontSize: '0.76rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      boxShadow: '0 2px 8px rgba(14, 165, 233, 0.4)',
                    }}
                  >
                    <Play size={13} fill="#fff" />
                    Run in Terminal
                  </button>
                </div>
              </div>

              {/* Dynamic Command Box */}
              <div style={{ background: '#070b14', padding: '1rem 1.25rem', borderRadius: '10px', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.92rem', color: '#38bdf8', border: '1px solid var(--docker-border)', marginBottom: '1.25rem', overflowX: 'auto' }}>
                {generatedCommand}
              </div>

              {/* Flag Checkbox Toggles */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.03)', padding: '0.55rem 0.75rem', borderRadius: '8px', border: '1px solid var(--docker-border)', cursor: 'pointer', fontSize: '0.8rem', color: '#cbd5e1' }}>
                  <input type="checkbox" checked={flagDetached} onChange={(e) => setFlagDetached(e.target.checked)} />
                  <span><strong>-d</strong> (Detached Mode)</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.03)', padding: '0.55rem 0.75rem', borderRadius: '8px', border: '1px solid var(--docker-border)', cursor: 'pointer', fontSize: '0.8rem', color: '#cbd5e1' }}>
                  <input type="checkbox" checked={flagPort} onChange={(e) => setFlagPort(e.target.checked)} />
                  <span><strong>-p 8080:80</strong> (Port Forwarding)</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.03)', padding: '0.55rem 0.75rem', borderRadius: '8px', border: '1px solid var(--docker-border)', cursor: 'pointer', fontSize: '0.8rem', color: '#cbd5e1' }}>
                  <input type="checkbox" checked={flagVolume} onChange={(e) => setFlagVolume(e.target.checked)} />
                  <span><strong>-v app-data:...</strong> (Named Volume)</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.03)', padding: '0.55rem 0.75rem', borderRadius: '8px', border: '1px solid var(--docker-border)', cursor: 'pointer', fontSize: '0.8rem', color: '#cbd5e1' }}>
                  <input type="checkbox" checked={flagEnv} onChange={(e) => setFlagEnv(e.target.checked)} />
                  <span><strong>-e ENV=prod</strong> (Environment Var)</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.03)', padding: '0.55rem 0.75rem', borderRadius: '8px', border: '1px solid var(--docker-border)', cursor: 'pointer', fontSize: '0.8rem', color: '#cbd5e1' }}>
                  <input type="checkbox" checked={flagRestart} onChange={(e) => setFlagRestart(e.target.checked)} />
                  <span><strong>--restart=always</strong> (Self-Heal)</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.03)', padding: '0.55rem 0.75rem', borderRadius: '8px', border: '1px solid var(--docker-border)', cursor: 'pointer', fontSize: '0.8rem', color: '#cbd5e1' }}>
                  <input type="checkbox" checked={flagReadOnly} onChange={(e) => setFlagReadOnly(e.target.checked)} />
                  <span><strong>--read-only</strong> (Security Lock)</span>
                </label>
              </div>
            </div>

            {/* Static Syntax Tokens Breakdown */}
            <div className="docker-card" style={{ padding: '1.5rem' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#fff', marginBottom: '1rem' }}>
                Syntax Breakdown &amp; Token Inspector
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

        {/* TAB 3: VISUAL LIFECYCLE & UNIVERSAL SIMULATOR */}
        {activeTab === 'action' && (
          <UniversalTeachingShell
            concept={currentConcept}
            completedConceptIds={completedConceptIds}
            markConceptComplete={markConceptComplete}
            executeCommand={executeCommand}
            showToast={showToast}
          />
        )}

        {/* TAB 4: INTERACTIVE QUIZ ARENA */}
        {activeTab === 'explore' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="docker-card" style={{ padding: '1.5rem' }}>
              <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#fff', marginBottom: '1rem' }}>
                Command Variations
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {currentConcept.variations.map((v, i) => (
                  <div key={i} style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '10px', border: '1px solid var(--docker-border)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                      <div style={{ fontWeight: 700, color: '#38bdf8', fontSize: '0.86rem' }}>{v.title}</div>
                      {v.syntax && (
                        <button
                          onClick={() => executeCommand(v.syntax!)}
                          style={{
                            padding: '0.2rem 0.55rem',
                            borderRadius: '4px',
                            background: 'rgba(14, 165, 233, 0.15)',
                            border: '1px solid var(--docker-border-active)',
                            color: 'var(--docker-blue)',
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                          }}
                        >
                          Test in Terminal
                        </button>
                      )}
                    </div>
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

            {/* Interactive Scenario Quiz */}
            {currentConcept.scenarios.length > 0 && (
              <div className="docker-card" style={{ padding: '1.5rem', borderColor: 'var(--docker-border-active)' }}>
                <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#fff', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <HelpCircle size={16} color="var(--docker-blue)" />
                  <span>Interactive Architecture Scenario Quiz</span>
                </div>

                {currentConcept.scenarios.map((sc, i) => {
                  const selectedOptIdx = quizAnswers[sc.title || i];

                  return (
                    <div key={i} style={{ background: 'rgba(14, 165, 233, 0.08)', padding: '1.25rem', borderRadius: '10px', border: '1px solid var(--docker-border-active)' }}>
                      <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.9rem', marginBottom: '0.85rem' }}>{sc.question}</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
                        {sc.options?.map((opt, oIdx) => {
                          const isSelected = selectedOptIdx === oIdx;

                          return (
                            <button
                              key={oIdx}
                              onClick={() => {
                                setQuizAnswers({ ...quizAnswers, [sc.title || i]: oIdx });
                                if (opt.isCorrect) markConceptComplete(activeConceptId);
                              }}
                              style={{
                                width: '100%',
                                textAlign: 'left',
                                padding: '0.75rem 1rem',
                                borderRadius: '8px',
                                background: isSelected ? (opt.isCorrect ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)') : 'rgba(255,255,255,0.04)',
                                border: isSelected ? (opt.isCorrect ? '1px solid #22c55e' : '1px solid #ef4444') : '1px solid transparent',
                                cursor: 'pointer',
                                transition: 'all 0.15s ease',
                              }}
                            >
                              <div style={{ fontWeight: 600, color: isSelected ? (opt.isCorrect ? '#4ade80' : '#f87171') : '#cbd5e1', fontSize: '0.84rem' }}>
                                {opt.label}
                              </div>
                              {isSelected && (
                                <div style={{ fontSize: '0.76rem', color: opt.isCorrect ? '#86efac' : '#fca5a5', marginTop: '0.3rem', lineHeight: 1.4 }}>
                                  {opt.explanation}
                                </div>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 5: LIVE TERMINAL PRACTICE WITH QUICK RUN ACTION PILLS */}
        {activeTab === 'practice' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="docker-card" style={{ padding: '1.25rem' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--docker-blue)', marginBottom: '0.4rem' }}>
                Guided Task Objective:
              </div>
              <div style={{ fontSize: '0.92rem', color: '#fff', fontWeight: 700, marginBottom: '1rem' }}>
                {currentConcept.sandbox.targetTask || 'Practice running Docker CLI commands in the interactive terminal below.'}
              </div>

              {currentConcept.sandbox.guidedSteps.length > 0 && (
                <div style={{ paddingTop: '0.75rem', borderTop: '1px solid var(--docker-border)' }}>
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--docker-text-secondary)', marginBottom: '0.6rem' }}>Interactive Step Quick-Run Pills:</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                    {currentConcept.sandbox.guidedSteps.map((s, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,255,0.03)', padding: '0.6rem 0.85rem', borderRadius: '8px', border: '1px solid var(--docker-border)' }}>
                        <div style={{ fontSize: '0.82rem', color: '#cbd5e1' }}>
                          <strong>Step {idx + 1}:</strong> {s.instruction}
                        </div>
                        <button
                          onClick={() => executeCommand(s.command)}
                          style={{
                            padding: '0.3rem 0.65rem',
                            borderRadius: '6px',
                            background: 'var(--docker-blue)',
                            color: '#fff',
                            border: 'none',
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            boxShadow: '0 2px 6px rgba(14, 165, 233, 0.4)',
                          }}
                        >
                          <Play size={12} fill="#fff" />
                          <span>Run Step</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Embedded Terminal Container */}
            <div style={{ height: '380px' }}>
              <DockerTerminal />
            </div>
          </div>
        )}

        {/* TAB 6: REFERENCE CHEAT SHEET */}
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

        {/* Floating Interactive Toast Feedback Banner */}
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
