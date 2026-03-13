const TYPE_STYLES = {
  concept: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20' },
  algorithm: { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/20' },
  example: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20' },
  exercise: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20' },
  solution: { bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500/20' },
  title: { bg: 'bg-indigo-500/10', text: 'text-indigo-400', border: 'border-indigo-500/20' },
};

export default function Badge({ children, variant = 'default', className = '' }) {
  if (variant === 'topic') {
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-accent-primary/10 text-accent-glow border border-accent-primary/20 ${className}`}>
        {children}
      </span>
    );
  }

  const styles = TYPE_STYLES[children?.toLowerCase()] || TYPE_STYLES.concept;

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium uppercase tracking-wider ${styles.bg} ${styles.text} border ${styles.border} ${className}`}>
      {children}
    </span>
  );
}
