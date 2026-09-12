import React from 'react';
import { useApp } from '../../context/AppContext';
import { LESSONS } from '../../data/curriculum';
import {
  Play,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  LifeBuoy,
  Lock,
  Flame,
  Terminal,
  Compass,
  Settings,
  BookOpen,
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const {
    currentLesson,
    completedLessonIds,
    setMode,
    instructionMode,
    setInstructionMode,
    evidenceMastery,
    setShowLostDrawer,
    setShowOnboarding,
  } = useApp();

  // If in Beginner mode, show the ultra-simple Learning Home
  if (instructionMode === 'beginner') {
    return (
      <div
        style={{
          padding: '2.5rem 1.5rem',
          maxWidth: '780px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '2rem',
        }}
      >
        {/* Welcome Header */}
        <div style={{ textAlign: 'center', marginBottom: '0.5rem' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.25rem 0.8rem',
              background: 'rgba(240, 80, 51, 0.12)',
              border: '1px solid var(--git-orange)',
              borderRadius: '999px',
              color: 'var(--git-orange)',
              fontWeight: 800,
              fontSize: '0.75rem',
              textTransform: 'uppercase',
              marginBottom: '0.8rem',
            }}
          >
            <span>👋</span> Welcome to CommitForge
          </div>
          <h1
            style={{
              fontSize: '2.4rem',
              fontWeight: 900,
              color: 'var(--text-primary)',
              margin: '0 0 0.4rem 0',
              letterSpacing: '-0.02em',
            }}
          >
            Your Git Journey Starts Here
          </h1>
          <div
            style={{
              fontSize: '1rem',
              fontWeight: 700,
              color: 'var(--text-secondary)',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
            }}
          >
            ZERO KNOWLEDGE ➔ GIT DEVELOPER
          </div>
        </div>

        {/* Primary Action Card (Point 3) */}
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(240, 80, 51, 0.14) 0%, rgba(240, 80, 51, 0.04) 100%)',
            border: '2px solid var(--git-orange)',
            borderRadius: 'var(--radius-lg)',
            padding: '2.5rem',
            textAlign: 'center',
            boxShadow: '0 12px 36px rgba(240, 80, 51, 0.15)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem',
          }}
        >
          <div
            style={{
              fontSize: '0.8rem',
              fontWeight: 800,
              color: 'var(--git-orange)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
            }}
          >
            MISSION 1
          </div>
          <h2
            style={{
              fontSize: '1.8rem',
              fontWeight: 900,
              color: 'var(--text-primary)',
              margin: 0,
            }}
          >
            Meet Git
          </h2>
          <p
            style={{
              fontSize: '1.05rem',
              color: 'var(--text-secondary)',
              maxWidth: '480px',
              margin: 0,
              lineHeight: 1.6,
            }}
          >
            Learn how Git remembers your work, step-by-step. No prior terminal or coding experience needed.
          </p>

          <button
            onClick={() => setMode('learn')}
            style={{
              background: 'var(--git-orange)',
              color: 'white',
              border: 'none',
              padding: '1rem 2.5rem',
              borderRadius: 'var(--radius-md)',
              fontWeight: 900,
              fontSize: '1.1rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              boxShadow: '0 6px 20px var(--git-orange-glow)',
              marginTop: '0.5rem',
              transition: 'transform 0.2s ease',
            }}
          >
            <Play size={20} fill="white" /> START MISSION
          </button>
        </div>

        {/* Your Progress (Point 3: Clean Evidence Bars Starting at 0%) */}
        <div
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            padding: '1.5rem',
          }}
        >
          <div
            style={{
              fontSize: '0.78rem',
              fontWeight: 800,
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '1rem',
            }}
          >
            Your Progress
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[
              {
                label: 'Git Foundations',
                score: evidenceMastery.foundations.score,
                level: evidenceMastery.foundations.level,
              },
              {
                label: 'Files & Changes',
                score: evidenceMastery.filesAndChanges.score,
                level: evidenceMastery.filesAndChanges.level,
              },
              {
                label: 'Commits',
                score: evidenceMastery.commits.score,
                level: evidenceMastery.commits.level,
              },
            ].map((item, idx) => (
              <div key={idx}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '0.88rem',
                    fontWeight: 700,
                    marginBottom: '0.35rem',
                  }}
                >
                  <span style={{ color: 'var(--text-primary)' }}>{item.label}</span>
                  <span style={{ color: item.score > 0 ? 'var(--git-orange)' : 'var(--text-muted)' }}>
                    {item.score}% {item.score === 0 ? '(Not Assessed)' : ''}
                  </span>
                </div>
                <div
                  style={{
                    height: '8px',
                    background: 'var(--bg-app)',
                    borderRadius: '4px',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: `${item.score}%`,
                      background: 'var(--git-orange)',
                      borderRadius: '4px',
                      transition: 'width 0.4s ease',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* What Happens Next? (Point 3: 7-Step Roadmap) */}
        <div
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            padding: '1.5rem',
          }}
        >
          <div
            style={{
              fontSize: '0.78rem',
              fontWeight: 800,
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '1rem',
            }}
          >
            What happens next?
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[
              { num: 1, text: 'Understand Git' },
              { num: 2, text: 'Create your first repository' },
              { num: 3, text: 'Make your first commit' },
              { num: 4, text: 'Learn branches' },
              { num: 5, text: 'Collaborate' },
              { num: 6, text: 'Fix mistakes' },
              { num: 7, text: 'Become a Git expert' },
            ].map((step) => (
              <div
                key={step.num}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.8rem',
                  fontSize: '0.92rem',
                  color: step.num === 1 ? 'var(--text-primary)' : 'var(--text-muted)',
                  fontWeight: step.num === 1 ? 700 : 500,
                }}
              >
                <div
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: step.num === 1 ? 'var(--git-orange)' : 'var(--bg-app)',
                    color: step.num === 1 ? 'white' : 'var(--text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    border: '1px solid var(--border-color)',
                  }}
                >
                  {step.num}
                </div>
                <span>{step.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Subordinate Options */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: '0.5rem',
            flexWrap: 'wrap',
            gap: '0.8rem',
          }}
        >
          <button
            onClick={() => setShowOnboarding(true)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              fontSize: '0.82rem',
              cursor: 'pointer',
              textDecoration: 'underline',
            }}
          >
            Change experience level (Currently: 🐣 Beginner)
          </button>

          <button
            onClick={() => setShowLostDrawer(true)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--danger-red)',
              fontSize: '0.82rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
              fontWeight: 700,
            }}
          >
            <LifeBuoy size={14} /> 🆘 I'm Lost
          </button>
        </div>
      </div>
    );
  }

  // Intermediate / Advanced / Expert Dashboard
  return (
    <div
      style={{
        padding: '2rem 1.5rem',
        maxWidth: '1000px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.8rem',
      }}
    >
      {/* Header Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(240, 80, 51, 0.12) 0%, rgba(6, 182, 212, 0.08) 100%)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-lg)',
          padding: '2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.5rem',
        }}
      >
        <div>
          <div
            style={{
              display: 'inline-flex',
              padding: '0.2rem 0.6rem',
              background: 'rgba(240, 80, 51, 0.2)',
              border: '1px solid var(--git-orange)',
              borderRadius: '999px',
              color: 'var(--git-orange)',
              fontWeight: 800,
              fontSize: '0.72rem',
              textTransform: 'uppercase',
              marginBottom: '0.6rem',
            }}
          >
            {instructionMode.toUpperCase()} DEVELOPER MODE
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>
            Welcome Back, Developer
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '0.4rem', maxWidth: '520px' }}>
            Current Mission: <strong>Level {currentLesson.level}: {currentLesson.title}</strong>. Practice with guided developer missions or test your diagnostic skills in the Labs.
          </p>

          <div style={{ display: 'flex', gap: '0.8rem', marginTop: '1.2rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => setMode('practice')}
              style={{
                background: 'var(--git-orange)',
                color: 'white',
                border: 'none',
                padding: '0.65rem 1.4rem',
                borderRadius: 'var(--radius-sm)',
                fontWeight: 800,
                fontSize: '0.9rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <Play size={16} fill="white" /> Continue Practice Mission
            </button>
            <button
              onClick={() => setMode('ide')}
              style={{
                background: 'var(--bg-app)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-color)',
                padding: '0.65rem 1.2rem',
                borderRadius: 'var(--radius-sm)',
                fontWeight: 700,
                fontSize: '0.9rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <Terminal size={16} /> Open Developer IDE
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <button
            onClick={() => setShowLostDrawer(true)}
            style={{
              background: 'rgba(239, 68, 68, 0.12)',
              color: 'var(--danger-red)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              padding: '0.5rem 0.8rem',
              borderRadius: 'var(--radius-sm)',
              fontWeight: 800,
              fontSize: '0.82rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}
          >
            <LifeBuoy size={15} /> 🆘 I'm Lost
          </button>
          <button
            onClick={() => setShowOnboarding(true)}
            style={{
              background: 'var(--bg-app)',
              color: 'var(--text-secondary)',
              border: '1px solid var(--border-color)',
              padding: '0.4rem 0.8rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.78rem',
              cursor: 'pointer',
            }}
          >
            Change Level
          </button>
        </div>
      </div>

      {/* Skills Mastery Grid */}
      <div
        style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-md)',
          padding: '1.5rem',
        }}
      >
        <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1rem' }}>
          Demonstrated Skill Mastery
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          {[
            { label: 'Foundations', ...evidenceMastery.foundations },
            { label: 'Files & Staging', ...evidenceMastery.staging },
            { label: 'Commits & Snapshots', ...evidenceMastery.commits },
            { label: 'Branches', ...evidenceMastery.branches },
            { label: 'Merging & LCA', ...evidenceMastery.merging },
            { label: 'Mistake Recovery', ...evidenceMastery.recovery },
          ].map((s, idx) => (
            <div key={idx}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.3rem' }}>
                <span style={{ color: 'var(--text-primary)' }}>{s.label}</span>
                <span style={{ color: s.score > 0 ? 'var(--git-orange)' : 'var(--text-muted)' }}>
                  {s.score}%
                </span>
              </div>
              <div style={{ height: '6px', background: 'var(--bg-app)', borderRadius: '3px', overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    width: `${s.score}%`,
                    background: s.score > 50 ? 'var(--terminal-green)' : 'var(--git-orange)',
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* The 4 Experiences Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
        <div
          onClick={() => setMode('learn')}
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem',
            cursor: 'pointer',
          }}
        >
          <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--git-orange)', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
            🎓 LEARN
          </div>
          <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            Core Concepts
          </div>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '0.3rem' }}>
            Physical metaphors & the 12-step guided mental model.
          </div>
        </div>

        <div
          onClick={() => setMode('practice')}
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem',
            cursor: 'pointer',
          }}
        >
          <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--cyan)', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
            🛠️ PRACTICE
          </div>
          <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            Developer Missions
          </div>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '0.3rem' }}>
            Hands-on problem solving across Levels 0 to 12.
          </div>
        </div>

        <div
          onClick={() => setMode('labs')}
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem',
            cursor: 'pointer',
          }}
        >
          <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--danger-red)', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
            🔬 LABS
          </div>
          <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            Break & Recover
          </div>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '0.3rem' }}>
            Chaos sandbox, Git Hospital, Undo Lab, & Team Sim.
          </div>
        </div>

        <div
          onClick={() => setMode('ide')}
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem',
            cursor: 'pointer',
          }}
        >
          <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--terminal-green)', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
            💻 DEVELOPER IDE
          </div>
          <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            Professional Workspace
          </div>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '0.3rem' }}>
            Multi-file editor, live sandbox, DAG, & raw Git internals.
          </div>
        </div>
      </div>
    </div>
  );
};
