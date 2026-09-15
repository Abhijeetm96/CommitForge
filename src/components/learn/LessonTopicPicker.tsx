import React from 'react';
import { FOCUS_LESSONS, FocusLesson } from '../../data/focusLessonScenes';
import { useApp } from '../../context/AppContext';
import { Package, Camera, Cloud, ArrowRight, ArrowLeft, CheckCircle2, Lock, Sparkles, BookOpen } from 'lucide-react';

interface LessonTopicPickerProps {
  onSelectLesson: (lessonId: 'add' | 'commit' | 'push') => void;
  completedLessons: string[];
}

export const LessonTopicPicker: React.FC<LessonTopicPickerProps> = ({
  onSelectLesson,
  completedLessons,
}) => {
  const { setMode } = useApp();
  const topics: {
    id: 'add' | 'commit' | 'push';
    concept: string;
    command: string;
    icon: string;
    description: string;
    isLocked?: boolean;
  }[] = [
    {
      id: 'add',
      concept: '📦 Staging Box',
      command: 'git add',
      icon: '📦',
      description: 'Choose which modified files go into the next snapshot.',
    },
    {
      id: 'commit',
      concept: '📸 Snapshot Camera',
      command: 'git commit',
      icon: '📸',
      description: 'Capture and seal a permanent milestone of staged changes.',
    },
    {
      id: 'push',
      concept: '☁ Remote Transfer',
      command: 'git push',
      icon: '☁️',
      description: 'Send local commits across the fiber highway to GitHub.',
    },
  ];

  return (
    <div
      style={{
        maxWidth: '960px',
        width: '100%',
        margin: '0 auto',
        padding: '2rem 1.5rem',
        textAlign: 'center',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '1rem' }}>
        <button
          onClick={() => setMode('learn')}
          style={{
            background: 'none',
            border: 'none',
            color: '#94a3b8',
            fontSize: '0.85rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            cursor: 'pointer',
            padding: '0.35rem 0.6rem',
            borderRadius: '6px',
          }}
        >
          <ArrowLeft size={16} />
          <span>Back to Git Journey</span>
        </button>
      </div>

      <div style={{ marginBottom: '2.5rem' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.3rem 0.85rem',
            borderRadius: '999px',
            background: 'rgba(56, 189, 248, 0.1)',
            border: '1px solid rgba(56, 189, 248, 0.25)',
            color: '#38bdf8',
            fontSize: '0.78rem',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            marginBottom: '0.75rem',
          }}
        >
          <Sparkles size={13} />
          <span>Interactive Git Simulator</span>
        </div>

        <h1
          style={{
            fontSize: 'clamp(2rem, 4vw, 2.75rem)',
            fontWeight: 900,
            color: '#f8fafc',
            letterSpacing: '-0.03em',
            margin: 0,
            lineHeight: 1.15,
          }}
        >
          What do you want to learn?
        </h1>
        <p
          style={{
            color: '#94a3b8',
            fontSize: '1.05rem',
            marginTop: '0.5rem',
          }}
        >
          Learn Git by manipulating objects in a physical world, not by reading textbooks.
        </p>
      </div>

      {/* Visual Shelf of Focus Lessons */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.5rem',
          alignItems: 'stretch',
        }}
      >
        {topics.map(topic => {
          const isCompleted = completedLessons.includes(topic.id);

          return (
            <div
              key={topic.id}
              onClick={() => onSelectLesson(topic.id)}
              style={{
                background: 'rgba(15, 23, 42, 0.7)',
                border: isCompleted
                  ? '1.5px solid rgba(34, 197, 94, 0.5)'
                  : '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '16px',
                padding: '1.75rem 1.5rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
                position: 'relative',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.borderColor = '#38bdf8';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.borderColor = isCompleted
                  ? 'rgba(34, 197, 94, 0.5)'
                  : 'rgba(255, 255, 255, 0.1)';
              }}
            >
              {isCompleted && (
                <div
                  style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                    color: '#22c55e',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                  }}
                >
                  <CheckCircle2 size={16} />
                  <span>Mastered</span>
                </div>
              )}

              <div>
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{topic.icon}</div>
                <div
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    color: '#38bdf8',
                    marginBottom: '0.25rem',
                  }}
                >
                  {topic.concept}
                </div>
                <h3
                  style={{
                    fontSize: '1.4rem',
                    fontWeight: 800,
                    color: '#f8fafc',
                    margin: '0 0 0.5rem 0',
                    fontFamily: 'monospace',
                  }}
                >
                  {topic.command}
                </h3>
                <p
                  style={{
                    fontSize: '0.88rem',
                    color: '#94a3b8',
                    lineHeight: 1.5,
                    margin: 0,
                  }}
                >
                  {topic.description}
                </p>
              </div>

              <div
                style={{
                  marginTop: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  color: '#38bdf8',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                }}
              >
                <span>Enter Simulator</span>
                <ArrowRight size={14} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Simple Mental Roadmap */}
      <div
        style={{
          marginTop: '3.5rem',
          padding: '1.25rem',
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid rgba(255, 255, 255, 0.06)',
          borderRadius: '14px',
        }}
      >
        <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '1rem', letterSpacing: '0.08em' }}>
          Visual Mental Roadmap
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1.5rem',
            flexWrap: 'wrap',
            fontSize: '0.88rem',
            fontWeight: 700,
            color: '#cbd5e1',
          }}
        >
          <span>1 📄 Files</span>
          <ArrowRight size={14} color="#64748b" />
          <span style={{ color: '#4ade80' }}>2 📦 Staging</span>
          <ArrowRight size={14} color="#64748b" />
          <span style={{ color: '#38bdf8' }}>3 📸 Commits</span>
          <ArrowRight size={14} color="#64748b" />
          <span style={{ color: '#a855f7' }}>4 🏷 Branches</span>
          <ArrowRight size={14} color="#64748b" />
          <span>5 🔀 Merge</span>
          <ArrowRight size={14} color="#64748b" />
          <span style={{ color: '#c084fc' }}>6 ☁ Remote</span>
        </div>
      </div>
    </div>
  );
};
