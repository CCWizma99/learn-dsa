import { ChevronLeft, ChevronRight, RotateCcw, Play, Pause } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SortWalkthroughPanel({
  title,
  steps = [],
  currentStep = 0,
  onNext,
  onPrev,
  onReset,
  onPlay,
  onPause,
  isPlaying = false,
  status = "",
  legend = [],
  children // This is where the array visualization goes
}) {
  const step = steps[currentStep] || {};

  return (
    <div className="bg-bg-elevated/30 border border-border-color rounded-2xl p-6 overflow-hidden">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-text-primary flex items-center gap-2">
            <span className="w-2 h-6 bg-accent-primary rounded-full"></span>
            {title} Walkthrough
          </h2>
          <p className="text-[10px] text-text-muted uppercase tracking-widest mt-1">Interactive Step-by-Step Learning</p>
        </div>
        
        <div className="flex items-center gap-2 bg-bg-base/40 p-1 rounded-xl border border-border-color/30">
          <button 
            onClick={onPrev} 
            disabled={currentStep === 0 || isPlaying}
            className="p-2 rounded-lg hover:bg-bg-elevated text-text-muted disabled:opacity-30 transition-colors"
            title="Previous Step"
          >
            <ChevronLeft size={18} />
          </button>
          
          <div className="px-3 border-x border-border-color/30 text-xs font-mono text-text-primary min-w-[80px] text-center">
            {currentStep + 1} / {steps.length || 1}
          </div>

          <button 
            onClick={onNext} 
            disabled={currentStep === steps.length - 1 || isPlaying}
            className="p-2 rounded-lg hover:bg-bg-elevated text-text-muted disabled:opacity-30 transition-colors"
            title="Next Step"
          >
            <ChevronRight size={18} />
          </button>

          <button 
            onClick={isPlaying ? onPause : onPlay}
            className={`p-2 rounded-lg transition-colors ${isPlaying ? 'bg-accent-amber/10 text-accent-amber' : 'hover:bg-bg-elevated text-text-muted'}`}
            title={isPlaying ? "Pause Autoplay" : "Start Autoplay"}
          >
            {isPlaying ? <Pause size={18} /> : <Play size={18} />}
          </button>

          <button 
            onClick={onReset}
            className="p-2 rounded-lg hover:bg-bg-elevated text-text-muted transition-colors"
            title="Reset to Start"
          >
            <RotateCcw size={18} />
          </button>
        </div>
      </div>

      {/* Legend & Call Stack Info */}
      <div className="flex flex-wrap items-center gap-4 mb-6 pb-4 border-b border-border-color/20">
        {legend.map((item, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm border" style={{ backgroundColor: item.color, borderColor: 'rgba(255,255,255,0.1)' }}></div>
            <span className="text-[10px] text-text-muted font-medium">{item.label}</span>
          </div>
        ))}
        {step.callStack && (
          <div className="ml-auto px-2 py-0.5 rounded bg-bg-base/50 border border-border-color/30 text-[9px] font-mono text-accent-primary">
            📞 {step.callStack}
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-6">
        {/* Left/Middle: Visualization */}
        <div className="lg:col-span-2 bg-bg-base/20 rounded-2xl border border-border-color/30 p-8 min-h-[300px] flex flex-col justify-center items-center relative overflow-hidden">
          <div className="absolute top-4 left-6 py-1 px-3 bg-bg-elevated/50 backdrop-blur-sm border border-border-color/40 rounded-full">
             <span className="text-[10px] font-bold text-accent-primary tracking-widest uppercase">Current State</span>
          </div>
          {children}
        </div>

        {/* Right: Narration & Status */}
        <div className="flex flex-col gap-4">
          <div className="flex-1 bg-bg-base/40 rounded-2xl border border-border-color/30 p-5 flex flex-col">
            <div className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-3">Narration</div>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex-1"
              >
                <h4 className="text-sm font-bold text-text-primary mb-2 leading-tight">
                  {step.title || "Ready to begin"}
                </h4>
                <p className="text-xs text-text-muted leading-relaxed">
                  {step.description || "Press Play or Next to see the algorithm in action."}
                </p>
                
                {step.pivotInfo && (
                  <div className="mt-4 p-3 rounded-xl bg-accent-amber/5 border border-accent-amber/20 text-[10px] font-mono text-accent-amber">
                    {step.pivotInfo}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="bg-bg-elevated/50 rounded-2xl border border-border-color/40 p-4">
            <div className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-2">Step Status</div>
            <div className="text-[11px] font-mono text-accent-green leading-snug">
              {status || "Waiting for user..."}
            </div>
          </div>
        </div>
      </div>

      {/* Pro Tip / Learning Note */}
      <div className="p-3 bg-accent-primary/5 border border-accent-primary/20 rounded-xl">
        <p className="text-[10px] text-accent-primary leading-relaxed text-center italic">
          Tip: Pay close attention to how the "i" and "j" pointers interact with the values during the sorting process.
        </p>
      </div>
    </div>
  );
}
