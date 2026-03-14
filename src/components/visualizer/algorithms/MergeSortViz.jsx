import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SortWalkthroughPanel from './SortWalkthroughPanel';
import { useVisualizerTimer } from '../VisualizerPanel';

const LEGEND = [
  { color: 'var(--accent-primary)', label: 'Unsorted' },
  { color: 'var(--accent-amber)', label: 'Dividing' },
  { color: 'var(--accent-glow)', label: 'Comparing for Merge' },
  { color: 'var(--accent-green)', label: 'Sorted Range' }
];

export default function MergeSortViz() {
  const [input] = useState('38,27,43,3,9,82,10');
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const steps = useMemo(() => {
    const arr = input.split(',').map(Number).filter(n => !isNaN(n));
    const result = [];
    const n = arr.length;
    
    // Helper to generate steps
    const generate = (main, l, r, call) => {
      if (l >= r) return;
      
      const m = Math.floor(l + (r - l) / 2);
      
      // Step: Divide
      result.push({
        arr: [...main],
        colors: main.map((_, idx) => (idx >= l && idx <= r) ? (idx <= m ? 'comparing' : 'large') : 'dimmed'),
        ptrs: { l, m, r },
        title: `Divide: [${l}...${r}]`,
        description: `Splitting the current range into two halves: [${l}...${m}] and [${m+1}...${r}].`,
        callStack: call,
        status: `m = ${m}`
      });

      generate(main, l, m, `mergeSort(${l}, ${m})`);
      generate(main, m + 1, r, `mergeSort(${m+1}, ${r})`);
      
      // Step: Merge Logic
      merge(main, l, m, r, call);
    };

    const merge = (main, l, m, r, call) => {
      const n1 = m - l + 1;
      const n2 = r - m;
      const L = main.slice(l, m + 1);
      const R = main.slice(m + 1, r + 1);
      
      result.push({
        arr: [...main],
        colors: main.map((_, idx) => (idx >= l && idx <= r) ? 'swapped' : 'dimmed'),
        ptrs: { l, m, r },
        title: `Merge Prep: Combining [${l}...${m}] and [${m+1}...${r}]`,
        description: `We will now merge the two sorted halves back into the main array.`,
        callStack: call,
        status: `Comparing Left and Right halves`
      });

      let i = 0, j = 0, k = l;
      while (i < n1 && j < n2) {
        result.push({
          arr: [...main],
          colors: main.map((_, idx) => {
             if (idx === k) return 'comparing';
             if (idx >= l && idx <= r) return 'swapped';
             return 'dimmed';
          }),
          ptrs: { k, i: l + i, j: m + 1 + j },
          title: `Comparing L[${i}]=${L[i]} and R[${j}]=${R[j]}`,
          description: L[i] <= R[j] 
            ? `${L[i]} ≤ ${R[j]}: Place ${L[i]} from Left half into main array.`
            : `${R[j]} < ${L[i]}: Place ${R[j]} from Right half into main array.`,
          callStack: call,
          status: `k = ${k}`
        });

        if (L[i] <= R[j]) {
          main[k] = L[i];
          i++;
        } else {
          main[k] = R[j];
          j++;
        }
        k++;
      }

      while (i < n1) { main[k] = L[i]; i++; k++; }
      while (j < n2) { main[k] = R[j]; j++; k++; }

      result.push({
        arr: [...main],
        colors: main.map((_, idx) => (idx >= l && idx <= r) ? 'sorted' : 'dimmed'),
        ptrs: { l, r },
        title: `Merged Result for [${l}...${r}]`,
        description: `Sub-array is now fully sorted. Moving back up the recursion tree.`,
        callStack: call,
        status: `Range [${l}...${r}] sorted`
      });
    };

    generate([...arr], 0, n - 1, `mergeSort(0, ${n-1})`);
    
    result.push({
      arr: [...arr].sort((a,b) => a - b),
      colors: new Array(n).fill('sorted'),
      ptrs: { },
      title: "Merge Sort Complete!",
      description: "Divide and Conquer achieved perfect order.",
      status: "COMPLETED"
    });

    return result;
  }, [input]);

  const next = () => setCurrentStep(s => Math.min(steps.length - 1, s + 1));
  const prev = () => setCurrentStep(s => Math.max(0, s - 1));
  const reset = () => { setCurrentStep(0); setIsPlaying(false); };

  const { play, pause } = useVisualizerTimer(1200, () => {
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
      title="Merge Sort"
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
                stepData.colors[idx] === 'large' ? 'bg-accent-primary/20 border-accent-primary text-accent-primary' :
                stepData.colors[idx] === 'sorted' ? 'bg-accent-green/20 border-accent-green text-accent-green' :
                stepData.colors[idx] === 'dimmed' ? 'opacity-20 grayscale-[0.5]' :
                'bg-bg-elevated border-border-color text-text-primary'
              }`}
            >
              {val}
              
              <AnimatePresence>
                {stepData.ptrs.k === idx && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className="absolute -bottom-8 text-accent-glow font-bold text-[10px]"
                  >
                    ↑ k
                  </motion.div>
                )}
                {stepData.ptrs.i === idx && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                    className="absolute -top-7 text-accent-amber font-bold text-[9px] uppercase"
                  >
                    Left[i]
                  </motion.div>
                )}
                {stepData.ptrs.j === idx && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                    className="absolute -top-7 text-accent-primary font-bold text-[9px] uppercase"
                  >
                    Right[j]
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
