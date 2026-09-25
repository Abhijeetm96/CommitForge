import React, { useState, useRef, useEffect, ChangeEvent, KeyboardEvent } from 'react';
import { useDocker } from '../../context/DockerContext';

interface IdeSyntaxEditorProps {
  filePath: string;
  content: string;
  language: string;
  editable: boolean;
  onChange?: (content: string) => void;
}

const DOCKER_KEYWORDS = /\b(FROM|RUN|COPY|ADD|WORKDIR|ENV|EXPOSE|CMD|ENTRYPOINT|USER|HEALTHCHECK|ARG|VOLUME|LABEL|SHELL)\b/g;
const TS_KEYWORDS = /\b(import|export|from|const|let|var|async|await|function|return|if|else|try|catch|new|interface|type)\b/g;
const SQL_KEYWORDS = /\b(CREATE|TABLE|INSERT|INTO|VALUES|SELECT|FROM|WHERE|IF|NOT|EXISTS|PRIMARY|KEY|DEFAULT|REFERENCES|INDEX|ON|SERIAL|VARCHAR|INT|TIMESTAMPTZ|JSONB|UNIQUE|FOREIGN)\b/g;

export const IdeSyntaxEditor: React.FC<IdeSyntaxEditorProps> = ({
  filePath,
  content,
  language,
  editable,
  onChange,
}) => {
  useDocker(); // Keep import as requested
  const [internalContent, setInternalContent] = useState(content);
  const [scrollTop, setScrollTop] = useState(0);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const preRef = useRef<HTMLPreElement>(null);

  useEffect(() => {
    setInternalContent(content);
  }, [content]);

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setInternalContent(e.target.value);
    if (onChange) {
      onChange(e.target.value);
    }
  };

  const handleScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
    if (preRef.current) {
      preRef.current.scrollTop = e.currentTarget.scrollTop;
      preRef.current.scrollLeft = e.currentTarget.scrollLeft;
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const target = e.target as HTMLTextAreaElement;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      const value = target.value;
      const newValue = value.substring(0, start) + '  ' + value.substring(end);
      setInternalContent(newValue);
      if (onChange) onChange(newValue);
      
      requestAnimationFrame(() => {
        target.selectionStart = target.selectionEnd = start + 2;
      });
    }
  };

  const escapeHtml = (unsafe: string) => {
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  };

  const tokenizeLine = (line: string, language: string) => {
    if (!line.trim()) return <span style={{ minHeight: '1.6em', display: 'inline-block' }}></span>;

    const lowerLang = language.toLowerCase();
    let html = escapeHtml(line);
    
    if (lowerLang === 'dockerfile') {
      if (line.trim().startsWith('#')) {
        html = `<span style="color: #475569; font-style: italic">${html}</span>`;
      } else {
        html = html.replace(DOCKER_KEYWORDS, '<span style="color: #38bdf8; font-weight: bold">$1</span>');
        html = html.replace(/\b(AS)\b/g, '<span style="color: #fbbf24">$1</span>');
        html = html.replace(/(--[a-zA-Z0-9-]+|-[a-zA-Z0-9])/g, '<span style="color: #a78bfa">$1</span>');
        html = html.replace(/("[^"]*"|'[^']*')/g, '<span style="color: #4ade80">$1</span>');
      }
    } else if (lowerLang === 'yaml' || lowerLang === 'yml') {
      if (line.trim().startsWith('#')) {
        html = `<span style="color: #475569; font-style: italic">${html}</span>`;
      } else {
        const colonIdx = html.indexOf(':');
        if (colonIdx !== -1) {
          const key = html.substring(0, colonIdx);
          const val = html.substring(colonIdx + 1);
          let newVal = val.replace(/("[^"]*"|'[^']*')/g, '<span style="color: #fbbf24">$1</span>');
          if (!/("[^"]*"|'[^']*')/.test(val) && val.trim().length > 0) {
            newVal = `<span style="color: #4ade80">${val}</span>`;
          }
          html = `<span style="color: #38bdf8">${key}</span>:${newVal}`;
        }
      }
    } else if (lowerLang === 'typescript' || lowerLang === 'ts' || lowerLang === 'json') {
      if (line.trim().startsWith('//')) {
        html = `<span style="color: #475569">${html}</span>`;
      } else {
        html = html.replace(TS_KEYWORDS, '<span style="color: #a78bfa">$1</span>');
        html = html.replace(/("[^"]*"|'[^']*')/g, '<span style="color: #4ade80">$1</span>');
        html = html.replace(/\b(\d+)\b/g, '<span style="color: #fbbf24">$1</span>');
      }
    } else if (lowerLang === 'sql') {
      if (line.trim().startsWith('--')) {
        html = `<span style="color: #475569">${html}</span>`;
      } else {
        html = html.replace(SQL_KEYWORDS, '<span style="color: #38bdf8">$1</span>');
        html = html.replace(/("[^"]*"|'[^']*')/g, '<span style="color: #4ade80">$1</span>');
      }
    } else {
      if (line.trim().startsWith('#') || line.trim().startsWith('//')) {
        html = `<span style="color: #475569">${html}</span>`;
      }
    }
    
    return <span dangerouslySetInnerHTML={{ __html: html }} />;
  };

  const lines = internalContent.split('\n');
  const lineCount = lines.length || 1;
  const paddingLeft = '3.5rem';

  const fileName = filePath.split('/').pop() || filePath.split('\\').pop() || 'Untitled';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#070b14', color: '#e2e8f0', fontFamily: '"JetBrains Mono", monospace' }}>
      {/* Tab Header */}
      <div style={{ display: 'flex', alignItems: 'center', padding: '8px 16px', background: '#0f1724', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <span style={{ fontSize: '0.875rem', fontWeight: 500, marginRight: '12px' }}>{fileName}</span>
        <span style={{ fontSize: '0.7rem', background: 'rgba(255,255,255,0.1)', padding: '2px 6px', borderRadius: '4px', color: '#94a3b8' }}>
          {language}
        </span>
      </div>

      <div style={{ position: 'relative', flexGrow: 1, overflow: 'hidden' }}>
        {/* Line numbers gutter */}
        <div style={{ 
          position: 'absolute', 
          left: 0, 
          top: 0, 
          bottom: 0, 
          width: '3rem', 
          background: '#070b14', 
          borderRight: '1px solid rgba(255,255,255,0.08)',
          color: '#475569',
          textAlign: 'right',
          paddingTop: '16px',
          paddingRight: '8px',
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: '0.84rem',
          lineHeight: 1.6,
          userSelect: 'none',
          overflow: 'hidden',
          zIndex: 1,
        }}>
          <div style={{ transform: `translateY(-${scrollTop}px)` }}>
            {Array.from({ length: lineCount }).map((_, i) => (
              <div key={i}>{i + 1}</div>
            ))}
          </div>
        </div>

        {/* Highlighted Pre */}
        <pre 
          ref={preRef}
          aria-hidden="true"
          style={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0, 
            margin: 0,
            padding: `16px 16px 16px ${paddingLeft}`,
            pointerEvents: 'none',
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: '0.84rem',
            lineHeight: 1.6,
            whiteSpace: 'pre', // Use pre so horizontal scrolling works
            overflow: 'hidden',
            zIndex: 0
          }}
        >
          {lines.map((line, i) => (
            <div key={i} style={{ minHeight: '1.6em' }}>
              {tokenizeLine(line, language)}
            </div>
          ))}
        </pre>

        {/* Editable Textarea */}
        <textarea
          ref={textAreaRef}
          value={internalContent}
          onChange={handleChange}
          onScroll={handleScroll}
          onKeyDown={handleKeyDown}
          readOnly={!editable}
          spellCheck={false}
          style={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0, 
            width: '100%',
            height: '100%',
            margin: 0,
            padding: `16px 16px 16px ${paddingLeft}`,
            border: 'none',
            background: 'transparent',
            color: 'transparent',
            caretColor: '#fff',
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: '0.84rem',
            lineHeight: 1.6,
            resize: 'none',
            outline: 'none',
            whiteSpace: 'pre',
            overflow: 'auto',
            zIndex: 2
          }}
        />
      </div>
    </div>
  );
};
