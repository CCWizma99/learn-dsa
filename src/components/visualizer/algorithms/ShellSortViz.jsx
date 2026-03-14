import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SortWalkthroughPanel from './SortWalkthroughPanel';
import { useVisualizerTimer } from '../VisualizerPanel';

const LEGEND = [
  { color: 'var(--accent-primary)', label: 'Unsorted' },
  { color: 'var(--accent-amber)', label: 'Gap Comparing' },
  { color: 'var(--accent-glow)', label: 'Swapping' },
  { color: 'var(--accent-green)', label: 'Sorted' }
];

export default function ShellSortViz() {
  const [input] = useState('38,27,43,3,9,82,10');
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const steps = useMemo(() => {
    const arr = input.split(',').map(Number).filter(n => !isNaN(n));
    const result = [];
    const n = arr.length;
    
    result.push({
      arr: [...arr],
      colors: new Array(n).fill('default'),
      ptrs: { gap: -1 },
      title: "Initial Array",
      description: "Shell Sort is a generalized version of Insertion Sort. It starts by sorting pairs of elements far apart from each other, then progressively reducing the gap.",
      status: "Ready"
    });

    const sArr = [...arr];
    for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
      result.push({
        arr: [...sArr],
        colors: sArr.map(() => 'default'),
        ptrs: { gap },
        title: `Gap Size: ${gap}`,
        description: `Currently comparing elements that are ${gap} positions apart.`,
        status: `Current Gap = ${gap}`
      });

      for (let i = gap; i < n; i++) {
        let temp = sArr[i];
        let j = i;

        while (j >= gap && sArr[j - gap] > temp) {
          result.push({
            arr: [...sArr],
            colors: sArr.map((_, idx) => (idx === j || idx === j - gap) ? 'comparing' : 'default'),
            ptrs: { gap, i, j },
            title: `Check: arr[${j-gap}] vs ${temp}`,
            description: `${sArr[j-gap]} > ${temp}, so we move it forward by ${gap} positions.`,
            status: `Gap comparing...`
          });

          sArr[j] = sArr[j - gap];
          j -= gap;

          result.push({
            arr: [...sArr],
            colors: sArr.map((_, idx) => (idx === j) ? 'swapped' : 'default'),
            ptrs: { gap, i, j },
            title: `Shifted arr[${j+gap}] to arr[${j}]`,
            description: `Shifted larger value over. This reduces the number of small shifts needed later.`,
            status: `Shifting...`
          });
        }
        sArr[j] = temp;
      }
    }

    result.push({
      arr: [...sArr],
      colors: new Array(n).fill('sorted'),
      ptrs: { },
      title: "Shell Sort Complete!",
      description: "As the gap reduced to 1, the final insertion sort pass became extremely fast.",
      status: "COMPLETED"
    });

    return result;
  }, [input]);

  const next = () => setCurrentStep(s => Math.min(steps.length - 1, s + 1));
  const prev = () => setCurrentStep(s => Math.max(0, s - 1));
  const reset = () => { setCurrentStep(0); setIsPlaying(false); };

  const { play, pause } = useVisualizerTimer(900, () => {
    if (currentStep < steps.length - 1) {
      next();
    } else {
      setIsPlaying(false);
      pause();
    }
  });

  const togglePlay = () => {
    if (isPlaying) {
      pause();
      setIsPlaying(false);
    } else {
      if (currentStep === steps.length - 1) setCurrentStep(0);
      play();
      setIsPlaying(true);
    }
  };

  const stepData = steps[currentStep];

  return (
    <SortWalkthroughPanel
      title="Shell Sort"
      steps={steps}
      currentStep={currentStep}
      isPlaying={isPlaying}
      status={stepData.status}
      legend={LEGEND}
      onNext={next}
      onPrev={prev}
      onReset={reset}
      onPlay={togglePlay}
      onPause={togglePlay}
    >
       <div className="flex flex-col items-center gap-10 w-full overflow-hidden">
        <div className="flex gap-2 justify-center flex-wrap px-4">
          {stepData.arr.map((val, idx) => (
            <motion.div
              key={idx}
              layout
              className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center font-mono font-bold text-sm shadow-sm transition-all duration-300 relative ${
                stepData.colors[idx] === 'comparing' ? 'bg-accent-amber/20 border-accent-amber text-accent-amber' :
                stepData.colors[idx] === 'swapped' ? 'bg-accent-glow/20 border-accent-glow text-accent-glow' :
                stepData.colors[idx] === 'sorted' ? 'bg-accent-green/20 border-accent-green text-accent-green' :
                'bg-bg-elevated border-border-color text-text-primary'
              }`}
            >
              {val}
              
              <AnimatePresence>
                {stepData.ptrs.j === idx && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                    className="absolute -top-7 text-accent-amber font-bold text-[9px] uppercase"
                  >
                    j
                  </motion.div>
                )}
                {stepData.ptrs.j - stepData.ptrs.gap === idx && stepData.ptrs.gap > 0 && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                    className="absolute -top-7 text-accent-amber font-bold text-[9px] uppercase"
                  >
                    j-gap
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        <div className="flex gap-2 min-h-[20px]">
          {stepData.arr.map((_, idx) => (
              <div key={idx} className="w-12 flex justify-center">
                 <span className="text-[10px] text-text-muted font-mono italic">[{idx}]</span>
              </div>
          ))}
        </div>
      </div>
    </SortWalkthroughPanel>
  );
}
