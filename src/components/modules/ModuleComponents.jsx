import hljs from 'highlight.js/lib/core';
import c from 'highlight.js/lib/languages/c';
import python from 'highlight.js/lib/languages/python';
import javascript from 'highlight.js/lib/languages/javascript';
import { Code, CheckCircle, Info } from 'lucide-react';

// Register languages for syntax highlighting
hljs.registerLanguage('c', c);
hljs.registerLanguage('python', python);
hljs.registerLanguage('javascript', javascript);

export function highlightCode(code) {
  try {
    return hljs.highlightAuto(code, ['c', 'python', 'javascript']).value;
  } catch {
    return code;
  }
}

// Reusable components for authoring rich modules
export function Section({ id, title, children }) {
  return (
    <section id={id} className="scroll-mt-6">
      <h2 className="text-2xl font-display font-bold text-text-primary mb-6 flex items-center gap-2 group">
        <span className="text-text-muted/30 font-light group-hover:text-accent-primary transition-colors">#</span>
        {title}
      </h2>
      <div className="space-y-6">{children}</div>
    </section>
  );
}

export function P({ children }) {
  return (
    <p className="text-base text-text-secondary leading-[1.8] font-body">
      {typeof children === 'string' ? <FormattedText text={children} /> : children}
    </p>
  );
}

export function FormattedText({ text }) {
  if (typeof text !== 'string') return text;
  
  // Simple regex for bold **text** and code `text`
  const parts = text.split(/(\*\*.*?\*\*|`.*?`)/g);
  
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={i} className="font-bold text-text-primary">{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith('`') && part.endsWith('`')) {
          return <code key={i} className="px-1.5 py-0.5 rounded bg-bg-elevated font-code text-[0.9em] text-accent-primary">{part.slice(1, -1)}</code>;
        }
        return part;
      })}
    </>
  );
}

export function BulletList({ items, plain = false }) {
  return (
    <ul className={`space-y-3 rounded-xl ${plain ? 'p-0 border-none bg-transparent' : 'bg-bg-surface/50 p-5 border border-border-color/50'}`}>
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-3">
          <span className="w-1.5 h-1.5 rounded-full bg-accent-primary mt-2.5 shrink-0 shadow-glow" />
          <span className="text-base text-text-secondary leading-relaxed">
            <FormattedText text={item} />
          </span>
        </li>
      ))}
    </ul>
  );
}

export function CodeBlock({ code, title = 'Implementation snippet' }) {
  return (
    <div className="my-6 rounded-xl overflow-hidden border border-border-color bg-bg-surface shadow-sm">
      <div className="bg-bg-elevated px-4 py-2 flex items-center gap-2 border-b border-border-color">
        <Code size={14} className="text-text-muted" />
        <span className="text-[10px] font-code text-text-muted">{title}</span>
      </div>
      <pre className="p-4 overflow-x-auto text-[13px] leading-relaxed">
        <code
          className="font-code text-text-primary"
          dangerouslySetInnerHTML={{ __html: highlightCode(code) }}
        />
      </pre>
    </div>
  );
}

export function Callout({ type = 'info', title, children }) {
  const isSuccess = type === 'success';
  const isWarning = type === 'warning';
  
  const colors = isSuccess 
    ? 'bg-accent-green/10 border-accent-green/20 text-accent-green' 
    : isWarning
      ? 'bg-accent-amber/10 border-accent-amber/20 text-accent-amber'
      : 'bg-accent-primary/10 border-accent-primary/20 text-accent-primary';

  return (
    <div className={`p-4 rounded-xl border flex gap-3 ${colors}`}>
      <div className="mt-0.5 shrink-0">
        {isSuccess ? <CheckCircle size={18} /> : <Info size={18} />}
      </div>
      <div>
        <h4 className="text-sm font-bold mb-1 opacity-90">
          <FormattedText text={title} />
        </h4>
        <div className="text-sm opacity-80 leading-relaxed font-body">
          {typeof children === 'string' ? <FormattedText text={children} /> : children}
        </div>
      </div>
    </div>
  );
}

export function InteractiveConcept({ title, description, children }) {
  return (
    <div className="bg-bg-elevated border border-border-color rounded-xl p-5 mb-6 group hover:border-accent-primary/50 transition-colors">
      <h3 className="text-lg font-display font-semibold text-text-primary mb-2 flex items-center gap-2">
         <span className="w-2 h-2 rounded-full bg-accent-glow shadow-[0_0_8px_var(--accent-glow)]" />
        <FormattedText text={title} />
      </h3>
      <p className="text-sm text-text-muted mb-4 leading-relaxed">
        <FormattedText text={description} />
      </p>
      <div className="mt-4">
        {children}
      </div>
    </div>
  );
}
export function ComparisonTable({ headers, rows }) {
  return (
    <div className="my-6 overflow-hidden rounded-xl border border-border-color bg-bg-surface/30 backdrop-blur-sm shadow-sm">
      <table className="w-full text-left border-collapse">
        <thead className="bg-bg-elevated/50">
          <tr>
            {headers.map((h, i) => (
              <th key={i} className="px-5 py-3 text-[11px] font-bold text-text-muted uppercase tracking-wider border-b border-border-color/50">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border-color/30">
          {rows.map((row, i) => (
            <tr key={i} className="hover:bg-bg-elevated/20 transition-colors">
              {row.map((cell, j) => (
                <td key={j} className="px-5 py-4 text-sm text-text-secondary leading-relaxed">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
