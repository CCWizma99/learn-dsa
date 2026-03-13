export default function ProgressBar({ value = 0, size = 'md', showLabel = false, className = '' }) {
  const heights = { sm: 'h-1', md: 'h-1.5', lg: 'h-2' };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className={`flex-1 ${heights[size]} bg-bg-base rounded-full overflow-hidden`}>
        <div
          className="h-full bg-gradient-to-r from-accent-primary to-accent-glow rounded-full transition-all duration-700 ease-out"
          style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-xs font-code text-accent-primary shrink-0">{value}%</span>
      )}
    </div>
  );
}
