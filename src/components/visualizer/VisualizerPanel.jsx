import { useState, useRef, useEffect, useCallback } from 'react';
import { Play, Pause, SkipForward, RotateCcw } from 'lucide-react';

export default function VisualizerPanel({ children, title, onPlay, onPause, onStep, onReset, isPlaying, status, inputLabel = 'Input', inputValue, onInputChange, extraControls }) {
  const [speed, setSpeed] = useState(500);

  return (
    <div className="bg-bg-base border border-border-color rounded-xl overflow-hidden">
      {/* Header */}
      <div className="px-3 py-2 border-b border-border-color flex items-center justify-between">
        <h4 className="text-xs font-medium text-text-primary">{title}</h4>
      </div>

      {/* Input */}
      <div className="px-3 py-2 border-b border-border-color flex items-center gap-2">
        <label className="text-[10px] text-text-muted shrink-0">{inputLabel}:</label>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => onInputChange(e.target.value)}
          className="flex-1 bg-bg-elevated border border-border-color rounded px-2 py-1 text-xs text-text-primary outline-none focus:border-accent-primary/50"
          placeholder="e.g. 5,3,8,1,9"
        />
        {extraControls}
      </div>

      {/* Canvas */}
      <div className="p-3 min-h-[200px]">
        {children}
      </div>

      {/* Status Line */}
      {status && (
        <div className="px-3 py-1.5 border-t border-border-color">
          <p className="text-[10px] text-accent-glow font-code">{status}</p>
        </div>
      )}

      {/* Controls */}
      <div className="px-3 py-2 border-t border-border-color flex items-center gap-2">
        <button
          onClick={isPlaying ? onPause : onPlay}
          className="p-1.5 rounded bg-accent-primary/10 text-accent-primary hover:bg-accent-primary/20 transition-colors"
          title={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? <Pause size={14} /> : <Play size={14} />}
        </button>
        <button
          onClick={onStep}
          disabled={isPlaying}
          className="p-1.5 rounded bg-bg-elevated text-text-primary hover:bg-accent-primary/10 transition-colors disabled:opacity-30"
          title="Step"
        >
          <SkipForward size={14} />
        </button>
        <button
          onClick={onReset}
          className="p-1.5 rounded bg-bg-elevated text-text-primary hover:bg-accent-primary/10 transition-colors"
          title="Reset"
        >
          <RotateCcw size={14} />
        </button>
        <div className="flex-1" />
        <label className="text-[10px] text-text-muted">Speed:</label>
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
          className="w-20 accent-[var(--accent-primary)]"
        />
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
