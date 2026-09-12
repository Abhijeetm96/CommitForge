import React, { useState } from 'react';
import { CAPSTONE_MISSION, calculateGitProfile, SkillScore } from '../../data/capstone';
import { useApp } from '../../context/AppContext';
import { Award, CheckCircle2, AlertTriangle, ArrowRight, ShieldCheck, UserCheck, Star, FileText } from 'lucide-react';

export const CapstoneView: React.FC = () => {
  const { repo, executeCommand, setProjectKey } = useApp();
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [showReport, setShowReport] = useState<boolean>(false);
  const [profileScores, setProfileScores] = useState<SkillScore[]>([]);

  const step = CAPSTONE_MISSION.steps[currentStepIdx];

  const handleCompleteStep = () => {
    if (!completedSteps.includes(step.id)) {
      setCompletedSteps(prev => [...prev, step.id]);
    }
    if (currentStepIdx < CAPSTONE_MISSION.steps.length - 1) {
      setCurrentStepIdx(currentStepIdx + 1);
    } else {
      // Calculate final profile scorecard!
      const scores = calculateGitProfile(15, 1, 92);
      setProfileScores(scores);
      setShowReport(true);
    }
  };

  return (
    <div style={{ padding: '1.5rem', maxWidth: '1100px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--git-orange)', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase' }}>
          <Award size={16} /> Final Capstone Developer Assessment
        </div>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '0.2rem' }}>
          Your First Day as a Developer 🏢
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '0.3rem' }}>
          No tutorials. No given commands. Step into the shoes of a newly hired engineer on an active software development team and ship a production bug fix independently.
        </p>
      </div>

      {/* Ticket Briefing Header */}
      <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <span style={{ background: 'var(--git-orange)', color: 'white', fontWeight: 800, fontSize: '0.75rem', padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-sm)' }}>
                TICKET {CAPSTONE_MISSION.ticketId}
              </span>
              <span style={{ background: 'rgba(239, 68, 68, 0.2)', color: 'var(--danger)', fontWeight: 700, fontSize: '0.75rem', padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-sm)' }}>
                PRIORITY: {CAPSTONE_MISSION.priority}
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{CAPSTONE_MISSION.time}</span>
            </div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginTop: '0.6rem', color: 'var(--text-primary)' }}>
              {CAPSTONE_MISSION.title}
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.4rem', lineHeight: '1.5' }}>
              {CAPSTONE_MISSION.description}
            </p>
          </div>

          <div style={{ background: 'var(--bg-app)', padding: '0.8rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
              Your Engineering Team:
            </div>
            <div style={{ display: 'flex', gap: '0.8rem' }}>
              {CAPSTONE_MISSION.team.map((m, i) => (
                <div key={i} title={`${m.name} - ${m.role}`} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.3rem' }}>{m.avatar}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{m.name}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {!showReport ? (
        /* Active Mission Step */
        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--git-orange)', textTransform: 'uppercase' }}>
              {step.phase} • {step.timeLabel}
            </span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Step {currentStepIdx + 1} of {CAPSTONE_MISSION.steps.length}
            </span>
          </div>

          {/* Teammate Dialogue */}
          {step.speaker && (
            <div style={{ background: 'var(--bg-app)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1rem', display: 'flex', gap: '0.8rem', alignItems: 'flex-start', marginBottom: '1.2rem' }}>
              <span style={{ fontSize: '2rem' }}>{step.speaker.avatar}</span>
              <div>
                <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                  {step.speaker.name} <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>({step.speaker.role})</span>
                </div>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.3rem', fontStyle: 'italic', lineHeight: '1.5' }}>
                  "{step.speaker.message}"
                </p>
              </div>
            </div>
          )}

          <div style={{ background: 'rgba(240, 80, 51, 0.08)', borderLeft: '3px solid var(--git-orange)', padding: '1rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.5rem' }}>
            <strong style={{ color: 'var(--git-orange)' }}>Objective:</strong>
            <p style={{ color: 'var(--text-primary)', fontSize: '0.95rem', marginTop: '0.3rem' }}>
              {step.objective}
            </p>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Use the terminal and editor in the IDE tab to complete your objective.
            </div>
            <button
              style={{
                background: 'var(--git-orange)',
                color: 'white',
                border: 'none',
                padding: '0.6rem 1.4rem',
                borderRadius: 'var(--radius-sm)',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
              }}
              onClick={handleCompleteStep}
            >
              Verify Objective & Proceed <ArrowRight size={15} />
            </button>
          </div>
        </div>
      ) : (
        /* Final Skills Report: YOUR GIT PROFILE (Section 66) */
        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '2rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ display: 'inline-flex', padding: '0.5rem 1rem', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid var(--success)', borderRadius: '999px', color: 'var(--success)', fontWeight: 800, fontSize: '0.85rem', marginBottom: '0.8rem' }}>
              🎉 CAPSTONE ACCOMPLISHED: MISSION SHIPPED TO PRODUCTION
            </div>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--text-primary)' }}>
              YOUR GIT PROFILE 🎓
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginTop: '0.4rem' }}>
              Overall Rank: <strong style={{ color: 'var(--git-orange)' }}>Git Professional (Production Certified)</strong>
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
            {profileScores.map((s, idx) => (
              <div key={idx} style={{ background: 'var(--bg-app)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <strong style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>{s.name}</strong>
                  <span style={{ fontWeight: 800, color: 'var(--git-cyan)', fontSize: '0.85rem' }}>{s.score}% ({s.grade})</span>
                </div>
                <div style={{ width: '100%', height: '6px', background: 'var(--bg-surface)', borderRadius: '3px', overflow: 'hidden', marginBottom: '0.6rem' }}>
                  <div style={{ width: `${s.score}%`, height: '100%', background: 'linear-gradient(90deg, #f05033, #06b6d4)' }} />
                </div>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                  {s.feedback}
                </p>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center' }}>
            <button
              style={{
                background: 'var(--git-orange)',
                color: 'white',
                border: 'none',
                padding: '0.7rem 1.8rem',
                borderRadius: 'var(--radius-sm)',
                fontWeight: 700,
                fontSize: '0.95rem',
                cursor: 'pointer',
              }}
              onClick={() => setShowReport(false)}
            >
              Review Capstone Steps Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
