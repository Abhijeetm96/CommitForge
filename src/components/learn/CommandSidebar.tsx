import React, { useState, useMemo } from 'react';
import { COMMANDS_DOCS, CommandDoc } from '../../data/commandsRef';
import {
  Search,
  Terminal,
  ShieldAlert,
  ChevronDown,
  ChevronRight,
  Sparkles,
  Info,
  X,
  Layers,
  CheckCircle2,
} from 'lucide-react';

interface CommandSidebarProps {
  currentCommand?: string;
  onInsertCommand?: (cmdText: string) => void;
  onSelectCommand?: (cmd: CommandDoc) => void;
}

export const CommandSidebar: React.FC<CommandSidebarProps> = ({
  currentCommand,
  onInsertCommand,
  onSelectCommand,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>('All');
  const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>({});
  const [inspectingCommand, setInspectingCommand] = useState<CommandDoc | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Group commands by category
  const categories = useMemo(() => {
    const map: Record<string, CommandDoc[]> = {};
    for (const doc of COMMANDS_DOCS) {
      const cat = doc.category || 'General';
      if (!map[cat]) map[cat] = [];
      map[cat].push(doc);
    }
    return map;
  }, []);

  // Filter commands
  const filteredCategories = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const result: Record<string, CommandDoc[]> = {};

    for (const [cat, docs] of Object.entries(categories)) {
      // Tier / Group filtering
      if (selectedFilter === 'Beginner' && !['Terminal Foundations', 'Setup', 'Inspection', 'Staging', 'History', 'Recovery'].includes(cat)) {
        continue;
      }
      if (selectedFilter === 'Branching' && !['Branching', 'Remotes', 'Work in Progress', 'Patches'].includes(cat)) {
        continue;
      }
      if (selectedFilter === 'Internals' && !['Plumbing', 'Maintenance', 'Diagnostics', 'Large Repositories'].includes(cat)) {
        continue;
      }

      const matching = docs.filter(
        d =>
          d.command.toLowerCase().includes(q) ||
          d.purpose.toLowerCase().includes(q) ||
          d.category.toLowerCase().includes(q) ||
          (d.beginnerDefinition && d.beginnerDefinition.toLowerCase().includes(q))
      );

      if (matching.length > 0) {
        result[cat] = matching;
      }
    }

    return result;
  }, [categories, searchQuery, selectedFilter]);

  const totalFilteredCount = useMemo(() => {
    return Object.values(filteredCategories).reduce((acc, list) => acc + list.length, 0);
  }, [filteredCategories]);

  const toggleCategory = (cat: string) => {
    setCollapsedCategories(prev => ({
      ...prev,
      [cat]: !prev[cat],
    }));
  };

  const getRiskColor = (risk: CommandDoc['riskLevel']) => {
    switch (risk) {
      case 'SAFE':
        return '#4ade80';
      case 'LOW':
        return '#38bdf8';
      case 'MEDIUM':
        return '#fbbf24';
      case 'HIGH':
        return '#f87171';
      case 'VERY_HIGH':
        return '#ef4444';
      default:
        return '#94a3b8';
    }
  };

  if (!isSidebarOpen) {
    return (
      <div
        style={{
          width: '40px',
          background: '#070b16',
          borderRight: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          paddingTop: '1rem',
          flexShrink: 0,
        }}
      >
        <button
          onClick={() => setIsSidebarOpen(true)}
          style={{
            background: 'rgba(56, 189, 248, 0.1)',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            color: '#38bdf8',
            borderRadius: '6px',
            width: '28px',
            height: '28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
          title="Expand Commands Sidebar"
        >
          <ChevronRight size={16} />
        </button>
        <div
          style={{
            writingMode: 'vertical-rl',
            transform: 'rotate(180deg)',
            marginTop: '1.5rem',
            color: '#64748b',
            fontSize: '0.75rem',
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}
        >
          Commands Universe ({COMMANDS_DOCS.length})
        </div>
      </div>
    );
  }

  return (
    <aside
      style={{
        width: '280px',
        minWidth: '280px',
        maxWidth: '280px',
        background: '#070b16',
        borderRight: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden',
        flexShrink: 0,
        position: 'relative',
      }}
    >
      {/* SIDEBAR HEADER */}
      <div
        style={{
          padding: '0.85rem 1rem 0.6rem 1rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.6rem',
          background: 'rgba(10, 15, 29, 0.95)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <Terminal size={15} color="#38bdf8" />
            <span style={{ fontWeight: 800, fontSize: '0.82rem', color: '#f8fafc', letterSpacing: '0.02em' }}>
              Git Commands
            </span>
            <span
              style={{
                fontSize: '0.68rem',
                background: 'rgba(56, 189, 248, 0.15)',
                color: '#38bdf8',
                padding: '0.1rem 0.35rem',
                borderRadius: '999px',
                fontWeight: 700,
              }}
            >
              {totalFilteredCount}
            </span>
          </div>

          <button
            onClick={() => setIsSidebarOpen(false)}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#64748b',
              cursor: 'pointer',
              padding: '0.2rem',
              display: 'flex',
              alignItems: 'center',
            }}
            title="Collapse Sidebar"
          >
            <ChevronDown size={15} style={{ transform: 'rotate(90deg)' }} />
          </button>
        </div>

        {/* SEARCH INPUT */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            background: 'rgba(15, 23, 42, 0.8)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '6px',
            padding: '0.35rem 0.6rem',
          }}
        >
          <Search size={13} color="#64748b" />
          <input
            type="text"
            placeholder="Search all commands..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: '#f8fafc',
              fontSize: '0.78rem',
              width: '100%',
            }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#64748b',
                cursor: 'pointer',
                padding: 0,
                display: 'flex',
              }}
            >
              <X size={12} />
            </button>
          )}
        </div>

        {/* FILTER CHIPS */}
        <div style={{ display: 'flex', gap: '0.25rem', overflowX: 'auto', paddingBottom: '0.1rem' }}>
          {(['All', 'Beginner', 'Branching', 'Internals'] as const).map(filter => {
            const isSelected = selectedFilter === filter;
            return (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                style={{
                  background: isSelected ? 'rgba(56, 189, 248, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                  border: isSelected ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.08)',
                  color: isSelected ? '#38bdf8' : '#94a3b8',
                  fontSize: '0.68rem',
                  fontWeight: isSelected ? 700 : 500,
                  padding: '0.2rem 0.45rem',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                {filter}
              </button>
            );
          })}
        </div>
      </div>

      {/* COMMAND CATEGORIES LIST */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '0.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.35rem',
        }}
      >
        {Object.keys(filteredCategories).length === 0 ? (
          <div style={{ padding: '2rem 1rem', textAlign: 'center', color: '#64748b', fontSize: '0.8rem' }}>
            No commands found matching "{searchQuery}"
          </div>
        ) : (
          Object.entries(filteredCategories).map(([category, docs]) => {
            const isCollapsed = collapsedCategories[category];
            const hasActiveCommand = docs.some(
              d => currentCommand && currentCommand.toLowerCase().startsWith(d.command.toLowerCase())
            );

            return (
              <div
                key={category}
                style={{
                  borderRadius: '6px',
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: hasActiveCommand
                    ? '1px solid rgba(56, 189, 248, 0.3)'
                    : '1px solid rgba(255, 255, 255, 0.04)',
                  overflow: 'hidden',
                }}
              >
                {/* CATEGORY ACCORDION HEADER */}
                <button
                  onClick={() => toggleCategory(category)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.45rem 0.6rem',
                    background: hasActiveCommand
                      ? 'rgba(56, 189, 248, 0.08)'
                      : 'rgba(255, 255, 255, 0.03)',
                    border: 'none',
                    color: hasActiveCommand ? '#38bdf8' : '#cbd5e1',
                    fontSize: '0.74rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    {isCollapsed ? <ChevronRight size={13} /> : <ChevronDown size={13} />}
                    <span>{category}</span>
                  </div>
                  <span style={{ fontSize: '0.65rem', color: '#64748b' }}>{docs.length}</span>
                </button>

                {/* COMMAND LIST UNDER THIS CATEGORY */}
                {!isCollapsed && (
                  <div style={{ display: 'flex', flexDirection: 'column', padding: '0.2rem' }}>
                    {docs.map(doc => {
                      const isCurrentTask =
                        currentCommand && currentCommand.toLowerCase().startsWith(doc.command.toLowerCase());
                      const isInspected = inspectingCommand?.command === doc.command;

                      return (
                        <div
                          key={doc.command}
                          onClick={() => {
                            setInspectingCommand(doc);
                            onSelectCommand?.(doc);
                          }}
                          style={{
                            padding: '0.4rem 0.5rem',
                            borderRadius: '4px',
                            background: isInspected
                              ? 'rgba(56, 189, 248, 0.16)'
                              : isCurrentTask
                              ? 'rgba(56, 189, 248, 0.08)'
                              : 'transparent',
                            border: isInspected
                              ? '1px solid rgba(56, 189, 248, 0.4)'
                              : isCurrentTask
                              ? '1px dashed rgba(56, 189, 248, 0.4)'
                              : '1px solid transparent',
                            cursor: 'pointer',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.15rem',
                            transition: 'all 0.15s ease',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                              <code
                                style={{
                                  fontSize: '0.76rem',
                                  fontWeight: 700,
                                  color: isCurrentTask ? '#38bdf8' : '#f1f5f9',
                                  fontFamily: 'monospace',
                                }}
                              >
                                {doc.command}
                              </code>
                              {isCurrentTask && (
                                <span
                                  style={{
                                    fontSize: '0.58rem',
                                    background: '#0284c7',
                                    color: 'white',
                                    padding: '0.05rem 0.3rem',
                                    borderRadius: '3px',
                                    fontWeight: 700,
                                    textTransform: 'uppercase',
                                  }}
                                >
                                  Active Task
                                </span>
                              )}
                            </div>

                            <span
                              style={{
                                width: '6px',
                                height: '6px',
                                borderRadius: '50%',
                                background: getRiskColor(doc.riskLevel),
                              }}
                              title={`Risk: ${doc.riskLevel}`}
                            />
                          </div>

                          <div
                            style={{
                              fontSize: '0.68rem',
                              color: '#94a3b8',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {doc.purpose}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* QUICK COMMAND INSPECTION DRAWER (EXPANDED AT BOTTOM OF SIDEBAR) */}
      {inspectingCommand && (
        <div
          style={{
            borderTop: '1px solid rgba(56, 189, 248, 0.3)',
            background: 'rgba(11, 19, 43, 0.98)',
            padding: '0.85rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
            maxHeight: '260px',
            overflowY: 'auto',
            boxShadow: '0 -4px 15px rgba(0,0,0,0.5)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <code style={{ fontSize: '0.85rem', fontWeight: 800, color: '#38bdf8' }}>
                {inspectingCommand.command}
              </code>
              <span
                style={{
                  fontSize: '0.62rem',
                  padding: '0.1rem 0.3rem',
                  borderRadius: '3px',
                  fontWeight: 700,
                  background: 'rgba(255, 255, 255, 0.08)',
                  color: getRiskColor(inspectingCommand.riskLevel),
                  border: `1px solid ${getRiskColor(inspectingCommand.riskLevel)}44`,
                }}
              >
                {inspectingCommand.riskLevel}
              </span>
            </div>
            <button
              onClick={() => setInspectingCommand(null)}
              style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', padding: 0 }}
            >
              <X size={14} />
            </button>
          </div>

          <div style={{ fontSize: '0.72rem', color: '#cbd5e1', lineHeight: 1.4 }}>
            {inspectingCommand.beginnerDefinition || inspectingCommand.purpose}
          </div>

          <div
            style={{
              background: 'rgba(0,0,0,0.4)',
              padding: '0.35rem 0.5rem',
              borderRadius: '4px',
              fontFamily: 'monospace',
              fontSize: '0.72rem',
              color: '#a5f3fc',
            }}
          >
            {inspectingCommand.syntax}
          </div>

          <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>
            <strong style={{ color: '#64748b', textTransform: 'uppercase' }}>When to use: </strong>
            {inspectingCommand.whenToUse}
          </div>

          {onInsertCommand && (
            <button
              onClick={() => onInsertCommand(inspectingCommand.example || inspectingCommand.command)}
              style={{
                background: 'rgba(56, 189, 248, 0.15)',
                border: '1px solid #38bdf8',
                color: '#38bdf8',
                borderRadius: '4px',
                padding: '0.35rem',
                fontSize: '0.72rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.35rem',
                marginTop: '0.2rem',
              }}
            >
              <Terminal size={12} />
              <span>Insert in Terminal</span>
            </button>
          )}
        </div>
      )}
    </aside>
  );
};
