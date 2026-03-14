import { useState, useRef, useEffect, useCallback } from 'react';
import { Play, Pause, SkipForward, RotateCcw } from 'lucide-react';

export default function VisualizerPanel({ 
  children, 
  title, 
  onPlay, 
  onPause, 
  onStep, 
  onReset, 
  isPlaying, 
  status, 
  inputLabel = 'Input', 
  inputValue, 
  onInputChange, 
  extraControls,
  codeLines = [],
  activeLineIdx = -1
}) {
  const [speed, setSpeed] = useState(500);

  return (
    <div className="bg-bg-base border border-border-color rounded-xl overflow-hidden shadow-2xl shadow-accent-primary/5">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border-color bg-bg-surface flex items-center justify-between">
        <h4 className="text-[13px] font-bold text-text-primary uppercase tracking-wider opacity-90">{title}</h4>
      </div>

      {/* Input */}
      <div className="px-4 py-3 border-b border-border-color flex items-center gap-4 bg-bg-surface/30">
        <label className="text-[11px] text-text-muted shrink-0 font-semibold uppercase tracking-tighter">{inputLabel}:</label>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => onInputChange(e.target.value)}
          className="flex-1 bg-bg-elevated border border-border-color rounded-lg px-3 py-2 text-sm text-text-primary outline-none focus:border-accent-primary/50 transition-all font-code"
          placeholder="e.g. 5,3,8,1,9"
        />
        {extraControls}
      </div>

      {/* Main Content Area: Visualizer + Optional Pseudo Code */}
      <div className={`flex flex-col lg:flex-row min-h-[450px] divide-y lg:divide-y-0 lg:divide-x divide-border-color`}>
        {/* Canvas / Visualizer */}
        <div className="flex-1 p-8 flex flex-col items-center justify-center relative overflow-hidden group min-h-[400px]">
           {children}
        </div>
 
        {/* Pseudo Code Panel */}
        {codeLines.length > 0 && (
          <div className="w-full lg:w-[320px] bg-bg-elevated/40 p-5 font-code text-[13px] leading-relaxed overflow-y-auto">
            <h5 className="text-[10px] uppercase font-bold text-text-primary mb-4 tracking-widest border-b border-border-color/50 pb-2">Algorithm Trace</h5>
            <div className="space-y-1.5">
              {codeLines.map((line, idx) => (
                <div 
                  key={idx} 
                  className={`px-3 py-1 rounded-md transition-all duration-200 border-l-4 ${
                    activeLineIdx === idx 
                      ? 'bg-accent-primary text-white border-accent-primary shadow-[0_4px_20px_-5px_rgba(var(--accent-primary-rgb),0.5)] scale-[1.02] z-10' 
                      : 'border-transparent text-text-primary/70 opacity-80'
                  }`}
                >
                  <span className={`mr-3 inline-block w-4 text-right ${activeLineIdx === idx ? 'text-white/50' : 'opacity-30'}`}>{idx + 1}</span>
                  {line}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Status Line */}
      {status && (
        <div className="px-4 py-2 border-t border-border-color bg-bg-surface/50">
          <p className="text-[10px] text-accent-glow font-code italic opacity-90">{status}</p>
        </div>
      )}

      {/* Controls */}
      <div className="px-4 py-3 border-t border-border-color flex items-center gap-3 bg-bg-surface/50">
        <button
          onClick={isPlaying ? onPause : onPlay}
          className="p-2 rounded-lg bg-accent-primary text-white hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-accent-primary/20"
          title={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? <Pause size={18} /> : <Play size={18} />}
        </button>
        <button
          onClick={onStep}
          disabled={isPlaying}
          className="p-2 rounded-lg bg-bg-elevated text-text-primary hover:bg-accent-primary/10 transition-all disabled:opacity-30 active:scale-95 border border-border-color"
          title="Step"
        >
          <SkipForward size={18} />
        </button>
        <button
          onClick={onReset}
          className="p-2 rounded-lg bg-bg-elevated text-text-primary hover:bg-accent-primary/10 transition-all active:scale-95 border border-border-color"
          title="Reset"
        >
          <RotateCcw size={18} />
        </button>
        <div className="flex-1" />
        <div className="flex items-center gap-3 bg-bg-elevated/50 px-3 py-1.5 rounded-full border border-border-color">
          <label className="text-[11px] font-bold text-text-primary/70 uppercase tracking-wider">Speed</label>
          <input
            type="range"
            min="100"
            max="1500"
            step="100"
            value={1600 - speed}
            onChange={(e) => {
              const newSpeed = 1600 - Number(e.target.value);
              setSpeed(newSpeed);
              if (onPlay && isPlaying) {
                onPause();
                setTimeout(() => onPlay(newSpeed), 50);
              }
            }}
            className="w-24 accent-accent-primary h-1.5 bg-bg-base rounded-full appearance-none cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}

export function useVisualizerTimer(speed = 500, callback) {
  const timerRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  const play = useCallback(
    (spd) => {
      setIsPlaying(true);
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        callbackRef.current();
      }, spd || speed);
    },
    [speed]
  );

  const pause = useCallback(() => {
    setIsPlaying(false);
    clearInterval(timerRef.current);
  }, []);

  useEffect(() => {
    return () => clearInterval(timerRef.current);
  }, []);

  return { isPlaying, play, pause };
}
