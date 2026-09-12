import React from 'react';
import { useApp } from '../../context/AppContext';
import { LESSONS } from '../../data/curriculum';
import { calculateCommandCoverage } from '../../data/gitCommandCoverage';
import {
  Play,
  Award,
  CheckCircle2,
  TrendingUp,
  ShieldCheck,
  Terminal,
  Activity,
  Layers,
  ArrowRight,
  BookOpen,
  LifeBuoy,
  Compass,
  Flame,
  Sparkles,
  Settings,
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const {
    currentLesson,
    completedLessonIds,
    setMode,
    mastery,
    predictionRecord,
    setShowLostDrawer,
    setShowOnboarding,
  } = useApp();

  const totalLessons = LESSONS.length;
  const completedCount = completedLessonIds.length;
  const progressPercent = Math.round((completedCount / totalLessons) * 100);

  const coverageStats = calculateCommandCoverage();

  return (
    <div style={{ padding: '2rem 1.5rem', maxWidth: '1100px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Welcome Hero / Mentor Greeting */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(240, 80, 51, 0.14) 0%, rgba(6, 182, 212, 0.09) 100%)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-lg)',
          padding: '2.25rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.5rem',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.15)',
        }}
      >
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.25rem 0.75rem', background: 'rgba(240, 80, 51, 0.2)', border: '1px solid var(--git-orange)', borderRadius: '999px', color: 'var(--git-orange)', fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '0.8rem' }}>
            <span>👋</span> Welcome back, Developer
          </div>
          <h1 style={{ fontSize: '2.3rem', fontWeight: 900, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.02em' }}>
            Build. Break. Fix. Commit.
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginTop: '0.5rem', maxWidth: '600px', lineHeight: 1.6 }}>
            You're currently working through <strong>Level {currentLesson.level}: {currentLesson.levelTitle}</strong>. Remember: Git is about building intuition, not memorizing syntax.
          </p>

          <div style={{ display: 'flex', gap: '0.8rem', marginTop: '1.25rem', flexWrap: 'wrap' }}>
            <button
              style={{
                background: 'var(--git-orange)',
                color: 'white',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: 'var(--radius-md)',
                fontWeight: 800,
                fontSize: '0.95rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                boxShadow: '0 4px 14px var(--git-orange-glow)',
              }}
              onClick={() => setMode('learn')}
            >
              <Play size={18} fill="white" /> Continue Mission: {currentLesson.title}
            </button>

            <button
              style={{
                background: 'rgba(6, 182, 212, 0.15)',
                color: 'var(--cyan)',
                border: '1px solid rgba(6, 182, 212, 0.4)',
                padding: '0.75rem 1.25rem',
                borderRadius: 'var(--radius-md)',
                fontWeight: 700,
                fontSize: '0.95rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
              onClick={() => setMode('first10')}
            >
              <Sparkles size={16} /> Beginner 10-Minute Walkthrough
            </button>
          </div>
        </div>

        {/* Quick Help Card */}
        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.25rem', minWidth: '240px', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Need Guidance?
          </div>
          <button
            onClick={() => setShowLostDrawer(true)}
            style={{
              background: 'rgba(239, 68, 68, 0.12)',
              color: 'var(--danger-red)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              padding: '0.5rem 0.8rem',
              borderRadius: 'var(--radius-sm)',
              fontWeight: 800,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem',
            }}
          >
            <LifeBuoy size={16} /> 🆘 I'm Lost
          </button>
          <button
            onClick={() => setShowOnboarding(true)}
            style={{
              background: 'var(--bg-app)',
              color: 'var(--text-secondary)',
              border: '1px solid var(--border-color)',
              padding: '0.45rem 0.8rem',
              borderRadius: 'var(--radius-sm)',
              fontWeight: 600,
              fontSize: '0.8rem',
              cursor: 'pointer',
              textAlign: 'center',
            }}
          >
            Change Experience Level
          </button>
        </div>
      </div>

      {/* Skills Mastery Breakdown */}
      <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
              Your Git Skill Breakdown
            </h2>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
              Tracks your intuitive understanding across core engineering disciplines.
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-app)', padding: '0.35rem 0.8rem', borderRadius: '999px', border: '1px solid var(--border-color)', fontSize: '0.8rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Curriculum Coverage:</span>
            <strong style={{ color: 'var(--git-orange)' }}>{coverageStats.coveragePercentage}% ({coverageStats.engineSupportedCount}/{coverageStats.totalCommands} commands)</strong>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
          {[
            { label: 'Git Foundations', score: mastery.status, color: 'var(--git-orange)' },
            { label: 'Staging & Commits', score: mastery.commits, color: 'var(--terminal-green)' },
            { label: 'Branching & Switch', score: mastery.branches, color: 'var(--cyan)' },
            { label: 'Merging & Conflicts', score: mastery.merging, color: 'var(--warning-amber)' },
            { label: 'Mistake Recovery', score: mastery.recovery, color: 'var(--danger-red)' },
            { label: 'Remotes & GitHub', score: mastery.remotes, color: '#a855f7' },
          ].map((s, idx) => (
            <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: 700 }}>
                <span style={{ color: 'var(--text-primary)' }}>{s.label}</span>
                <span style={{ color: s.color }}>{s.score}%</span>
              </div>
              <div style={{ height: '7px', background: 'var(--bg-app)', borderRadius: '4px', overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    width: `${s.score}%`,
                    background: s.color,
                    borderRadius: '4px',
                    transition: 'width 0.4s ease',
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Quick Launch Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
        <div
          onClick={() => setMode('discover')}
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem',
            cursor: 'pointer',
            transition: 'transform 0.2s ease, border-color 0.2s ease',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--cyan)', fontWeight: 800, fontSize: '0.82rem', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
            <Compass size={16} /> Command Discovery
          </div>
          <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            What Should I Do?
          </div>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '0.3rem', lineHeight: 1.4 }}>
            Learn how to choose the right command based on real developer situations.
          </div>
        </div>

        <div
          onClick={() => setMode('break-it')}
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem',
            cursor: 'pointer',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--danger-red)', fontWeight: 800, fontSize: '0.82rem', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
            <Flame size={16} /> Chaos Sandbox
          </div>
          <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            Break It & Fix It
          </div>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '0.3rem', lineHeight: 1.4 }}>
            Safely trigger repository disasters and practice surgical recovery with senior dev guidance.
          </div>
        </div>

        <div
          onClick={() => setMode('config-lab')}
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem',
            cursor: 'pointer',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--warning-amber)', fontWeight: 800, fontSize: '0.82rem', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
            <Settings size={16} /> Configuration Lab
          </div>
          <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            Git Config & Aliases
          </div>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '0.3rem', lineHeight: 1.4 }}>
            Configure author identity, default branch, line endings, and custom shortcuts.
          </div>
        </div>

        <div
          onClick={() => setMode('reference')}
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem',
            cursor: 'pointer',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--terminal-green)', fontWeight: 800, fontSize: '0.82rem', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
            <BookOpen size={16} /> Git Encyclopedia
          </div>
          <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            Command Taxonomy Matrix
          </div>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '0.3rem', lineHeight: 1.4 }}>
            Browse all 120+ commands and variants across Tiers 1-4 with interactive live trials.
          </div>
        </div>
      </div>
    </div>
  );
};
