import React, { useState } from 'react';
import { HOSPITAL_CASES, HospitalCase } from '../../data/hospitalCases';
import { useApp } from '../../context/AppContext';
import { Activity, Stethoscope, AlertOctagon, CheckCircle2, ChevronRight, Play } from 'lucide-react';

export const GitHospitalView: React.FC = () => {
  const { executeCommand } = useApp();
  const [selectedCase, setSelectedCase] = useState<HospitalCase>(HOSPITAL_CASES[0]);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showPrescription, setShowPrescription] = useState<boolean>(false);

  const handleSelectCase = (c: HospitalCase) => {
    setSelectedCase(c);
    setAnswers({});
    setShowPrescription(false);
  };

  const handleAnswerSelect = (qIdx: number, oIdx: number) => {
    setAnswers(prev => ({ ...prev, [qIdx]: oIdx }));
  };

  const allAnswered = selectedCase.diagnosticQuestions.every((_, idx) => answers[idx] !== undefined);
  const allCorrect = selectedCase.diagnosticQuestions.every((q, idx) => answers[idx] === q.correctIndex);

  const handleCure = () => {
    executeCommand(selectedCase.cureCommand);
    setShowPrescription(true);
  };

  return (
    <div style={{ padding: '1.5rem', width: '100%', maxWidth: '100%', boxSizing: 'border-box', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--danger)', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase' }}>
          <Activity size={16} /> Git Emergency Room & Triage
        </div>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '0.2rem' }}>Git Hospital 🏥</h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '0.3rem' }}>
          Broken repositories arrive in the ER every day. Your job as the Git Doctor: Diagnose what happened, why it happened, and prescribe the exact command to cure the repo.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '1.5rem' }}>
        {/* Patient Case List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {HOSPITAL_CASES.map((c) => (
            <div
              key={c.id}
              onClick={() => handleSelectCase(c)}
              style={{
                background: selectedCase.id === c.id ? 'var(--bg-card-hover)' : 'var(--bg-surface)',
                border: '1px solid',
                borderColor: selectedCase.id === c.id ? 'var(--danger)' : 'var(--border-color)',
                borderRadius: 'var(--radius-md)',
                padding: '0.8rem 1rem',
                cursor: 'pointer',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong style={{ fontSize: '0.9rem', color: selectedCase.id === c.id ? 'var(--danger)' : 'var(--text-primary)' }}>
                  {c.patientName}
                </strong>
                <span
                  style={{
                    fontSize: '0.7rem',
                    fontWeight: 800,
                    padding: '0.15rem 0.4rem',
                    borderRadius: '999px',
                    background: c.severity === 'CRITICAL' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                    color: c.severity === 'CRITICAL' ? 'var(--danger)' : 'var(--warning)',
                  }}
                >
                  {c.severity}
                </span>
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                {c.condition}
              </div>
            </div>
          ))}
        </div>

        {/* Patient Triage Room */}
        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {selectedCase.patientName}
            </h2>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--git-orange)', fontSize: '0.85rem', fontWeight: 600 }}>
              <Stethoscope size={16} /> Diagnosis in Progress
            </span>
          </div>

          <div style={{ background: 'rgba(239, 68, 68, 0.08)', borderLeft: '3px solid var(--danger)', padding: '0.8rem 1rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.2rem' }}>
            <div style={{ fontWeight: 700, color: 'var(--danger)', fontSize: '0.85rem' }}>Patient Symptoms:</div>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', marginTop: '0.2rem' }}>
              {selectedCase.symptoms}
            </p>
          </div>

          {/* Diagnostic Questions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', marginBottom: '1.5rem' }}>
            {selectedCase.diagnosticQuestions.map((q, qIdx) => {
              const selectedOpt = answers[qIdx];
              return (
                <div key={qIdx} style={{ background: 'var(--bg-app)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.9rem', marginBottom: '0.6rem' }}>
                    Q{qIdx + 1}: {q.question}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    {q.options.map((opt, oIdx) => {
                      const isChosen = selectedOpt === oIdx;
                      let bg = 'var(--bg-surface)';
                      let border = 'var(--border-color)';
                      if (selectedOpt !== undefined) {
                        if (oIdx === q.correctIndex) {
                          bg = 'rgba(16, 185, 129, 0.15)';
                          border = 'var(--success)';
                        } else if (isChosen) {
                          bg = 'rgba(239, 68, 68, 0.15)';
                          border = 'var(--danger)';
                        }
                      }
                      return (
                        <button
                          key={oIdx}
                          onClick={() => handleAnswerSelect(qIdx, oIdx)}
                          style={{
                            textAlign: 'left',
                            padding: '0.5rem 0.8rem',
                            background: bg,
                            border: `1px solid ${border}`,
                            borderRadius: 'var(--radius-sm)',
                            color: 'var(--text-primary)',
                            fontSize: '0.85rem',
                            cursor: 'pointer',
                          }}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                  {selectedOpt !== undefined && (
                    <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: selectedOpt === q.correctIndex ? 'var(--success)' : 'var(--danger)' }}>
                      {selectedOpt === q.correctIndex ? '✅ Correct analysis: ' : '❌ Diagnosis note: '}
                      {q.rationale}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Treatment & Prescription */}
          {allCorrect && (
            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--success)', fontSize: '0.9rem' }}>
                    🩺 Accurate Diagnosis! Ready to Administer Cure:
                  </div>
                  <code style={{ fontSize: '0.95rem', color: 'var(--git-orange)', fontFamily: 'var(--font-mono)', display: 'block', marginTop: '0.2rem' }}>
                    $ {selectedCase.cureCommand}
                  </code>
                </div>
                <button
                  style={{
                    background: 'var(--success)',
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
                  onClick={handleCure}
                >
                  <Play size={14} /> Administer Cure
                </button>
              </div>

              {showPrescription && (
                <div style={{ marginTop: '1rem', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid var(--success)', borderRadius: 'var(--radius-sm)', padding: '0.8rem', fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                  🎉 <strong>Patient Cured!</strong> {selectedCase.educationalPrescription}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
