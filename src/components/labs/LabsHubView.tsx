import React from 'react';
import { useApp } from '../../context/AppContext';
import { BreakItView } from './BreakItView';
import { UndoLabView } from './UndoLabView';
import { ConflictArenaView } from './ConflictArenaView';
import { GitHospitalView } from './GitHospitalView';
import { TwoDevView } from './TwoDevView';
import { CapstoneView } from './CapstoneView';
import { ConfigLabView } from './ConfigLabView';
import { CommandDiscoveryView } from './CommandDiscoveryView';
import {
  Flame,
  RotateCcw,
  GitMerge,
  HeartPulse,
  Users,
  Award,
  Settings,
  Compass,
} from 'lucide-react';

export const LabsHubView: React.FC = () => {
  const { activeLab, setActiveLab } = useApp();

  const LABS = [
    { id: 'break-it' as const, name: 'Break It', icon: Flame, badge: 'Diagnostic Cycle', desc: 'Simulate Git disasters and recover step-by-step' },
    { id: 'undo-lab' as const, name: 'Undo Lab', icon: RotateCcw, badge: 'Decision Matrix', desc: 'Restore vs Reset vs Revert vs Stash scenarios' },
    { id: 'conflict-arena' as const, name: 'Conflict Arena', icon: GitMerge, badge: 'Interactive Merge', desc: 'Real-time 3-way merge conflict resolution' },
    { id: 'hospital' as const, name: 'Git Hospital', icon: HeartPulse, badge: 'Triage & Diagnose', desc: 'Diagnose broken repo states from cryptic error symptoms' },
    { id: 'two-dev' as const, name: 'Team Sim', icon: Users, badge: 'Collaboration', desc: 'Simulate push, pull, divergence and team workflows' },
    { id: 'capstone' as const, name: 'Capstone Mission', icon: Award, badge: 'Scored Project', desc: 'Real developer e-commerce feature integration' },
    { id: 'config-lab' as const, name: 'Config Lab', icon: Settings, badge: 'Environment', desc: 'Gitconfig, aliases, .gitignore and safety settings' },
    { id: 'discover' as const, name: 'Decision Lab', icon: Compass, badge: 'What Should I Do?', desc: 'Progressive reasoning: match scenarios to the right Git tool' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
      {/* Sub-navigation Tab Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          padding: '0.5rem 1rem',
          background: 'var(--bg-surface)',
          borderBottom: '1px solid var(--border-color)',
          overflowX: 'auto',
          whiteSpace: 'nowrap',
        }}
      >
        <div style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--git-orange)', marginRight: '0.6rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          <Flame size={15} /> LABS:
        </div>
        {LABS.map((lab) => {
          const Icon = lab.icon;
          const isActive = activeLab === lab.id;
          return (
            <button
              key={lab.id}
              onClick={() => setActiveLab(lab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.4rem 0.8rem',
                borderRadius: 'var(--radius-sm)',
                border: isActive ? '1px solid var(--git-orange)' : '1px solid transparent',
                background: isActive ? 'rgba(240, 80, 51, 0.12)' : 'transparent',
                color: isActive ? 'var(--git-orange)' : 'var(--text-secondary)',
                fontSize: '0.8rem',
                fontWeight: isActive ? 800 : 600,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              title={lab.desc}
            >
              <Icon size={14} />
              <span>{lab.name}</span>
            </button>
          );
        })}
      </div>

      {/* Active Lab Component */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {activeLab === 'break-it' && <BreakItView />}
        {activeLab === 'undo-lab' && <UndoLabView />}
        {activeLab === 'conflict-arena' && <ConflictArenaView />}
        {activeLab === 'hospital' && <GitHospitalView />}
        {activeLab === 'two-dev' && <TwoDevView />}
        {activeLab === 'capstone' && <CapstoneView />}
        {activeLab === 'config-lab' && <ConfigLabView />}
        {activeLab === 'discover' && <CommandDiscoveryView />}
      </div>
    </div>
  );
};
