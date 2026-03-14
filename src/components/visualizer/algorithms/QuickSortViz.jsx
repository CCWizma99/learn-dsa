import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SortWalkthroughPanel from './SortWalkthroughPanel';
import { useVisualizerTimer } from '../VisualizerPanel';

const LEGEND = [
  { color: 'var(--accent-red)', label: 'Pivot' },
  { color: 'var(--accent-green)', label: '≤ Pivot (Left)' },
  { color: 'var(--accent-amber)', label: '> Pivot (Right)' },
  { color: 'var(--accent-primary)', label: 'Active Range' },
  { color: 'var(--accent-glow)', label: 'Sorted' }
];

export default function QuickSortViz() {
  const [input] = useState('38,27,43,3,9,82,10');
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const steps = useMemo(() => {
    const arr = input.split(',').map(Number).filter(n => !isNaN(n));
    const result = [];
    const n = arr.length;
    const sortedIndices = new Set();
    
    const generate = (main, low, high, call) => {
      if (low < high) {
        // Step: Partition Call
        result.push({
          arr: [...main],
          colors: main.map((_, idx) => idx >= low && idx <= high ? (sortedIndices.has(idx) ? 'sorted' : 'default') : (sortedIndices.has(idx) ? 'sorted' : 'dimmed')),
          ptrs: { p: high, i: low - 1, j: low },
          title: `Partitioning [${low}...${high}]`,
          description: `Selecting arr[${high}] = ${main[high]} as pivot. i starts before boundaries. j will scan.`,
          callStack: call,
          status: `low=${low}, high=${high}, pivot=${main[high]}`,
          pivotValue: main[high]
        });

        let pivot = main[high];
        let i = low - 1;

        for (let j = low; j < high; j++) {
          const compColors = main.map((_, idx) => {
             if (sortedIndices.has(idx)) return 'sorted';
             if (idx < low || idx > high) return 'dimmed';
             if (idx === high) return 'pivot';
             if (idx <= i) return 'small';
             if (idx > i && idx < j) return 'large';
             if (idx === j) return 'comparing';
             return 'default';
          });

          result.push({
            arr: [...main],
            colors: compColors,
            ptrs: { p: high, i, j },
            title: `j=${j}: arr[j]=${main[j]} vs Pivot=${pivot}`,
            description: main[j] <= pivot 
              ? `${main[j]} ≤ ${pivot}: Increment i and swap arr[i] with arr[j].` 
              : `${main[j]} > ${pivot}: Leave in place, move j.`,
            callStack: call,
            status: `Scanning...`
          });

          if (main[j] <= pivot) {
            i++;
            [main[i], main[j]] = [main[j], main[i]];
            
            const swapColors = main.map((_, idx) => {
                if (sortedIndices.has(idx)) return 'sorted';
                if (idx < low || idx > high) return 'dimmed';
                if (idx === high) return 'pivot';
                if (idx === i || idx === j) return 'swapped';
                if (idx < i) return 'small';
                if (idx > i && idx < j) return 'large';
                return 'default';
             });

            result.push({
              arr: [...main],
              colors: swapColors,
              ptrs: { p: high, i, j },
              title: `Swapped arr[${i}] and arr[${j}]`,
              description: `Moved the smaller element ${main[i]} to the left part of our range.`,
              callStack: call,
              status: `j=${j}, i=${i}`
            });
          }
        }

        // Place pivot
        [main[i + 1], main[high]] = [main[high], main[i + 1]];
        const pi = i + 1;
        sortedIndices.add(pi);

        const placeColors = main.map((_, idx) => {
            if (sortedIndices.has(idx)) return 'sorted';
            if (idx < low || idx > high) return 'dimmed';
            if (idx < pi) return 'small';
            if (idx > pi) return 'large';
            return 'default';
        });

        result.push({
          arr: [...main],
          colors: placeColors,
          ptrs: { p: pi, i: -1, j: -1 },
          title: `Pivot ${pivot} placed at index ${pi}`,
          description: `All elements to the left are ≤ ${pivot}, and all to the right are > ${pivot}. Pivot is now fully sorted.`,
          callStack: call,
          status: `Partition point pi = ${pi}`
        });

        generate(main, low, pi - 1, `quickSort(${low}, ${pi-1})`);
        generate(main, pi + 1, high, `quickSort(${pi+1}, ${high})`);
      } else if (low === high) {
        sortedIndices.add(low);
        result.push({
          arr: [...main],
          colors: main.map((_, idx) => sortedIndices.has(idx) ? 'sorted' : 'dimmed'),
          ptrs: { p: -1, i: -1, j: -1 },
          title: `Base Case: Array of size 1`,
          description: `Element ${main[low]} is sorted by definition.`,
          callStack: call,
          status: `Index ${low} finalized`
        });
      }
    };

    generate([...arr], 0, n - 1, `quickSort(0, ${n-1})`);
    
    result.push({
      arr: [...arr].sort((a,b) => a - b),
      colors: new Array(n).fill('sorted'),
      ptrs: { p: -1, i: -1, j: -1 },
      title: "QuickSort Complete!",
      description: "The recursive partitioning has fully ordered the array.",
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
      title="Quick Sort"
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
                stepData.colors[idx] === 'pivot' ? 'bg-accent-red/20 border-accent-red text-accent-red scale-110 z-10' :
                stepData.colors[idx] === 'small' ? 'bg-accent-green/20 border-accent-green text-accent-green' :
                stepData.colors[idx] === 'large' ? 'bg-accent-amber/20 border-accent-amber text-accent-amber' :
                stepData.colors[idx] === 'comparing' ? 'bg-accent-primary border-white text-white' :
                stepData.colors[idx] === 'sorted' ? 'bg-accent-primary/20 border-accent-primary text-accent-primary grayscale-[0.5]' :
                stepData.colors[idx] === 'swapped' ? 'bg-accent-glow/30 border-accent-glow text-accent-glow scale-105' :
                stepData.colors[idx] === 'dimmed' ? 'opacity-20 blur-[0.5px]' :
                'bg-bg-elevated border-border-color text-text-primary'
              }`}
            >
              {val}
              
              <AnimatePresence>
                {stepData.ptrs.p === idx && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                    className="absolute -top-7 px-1.5 py-0.5 rounded bg-accent-red text-white text-[8px] font-bold uppercase tracking-tighter"
                  >
                    Pivot
                  </motion.div>
                )}
                {stepData.ptrs.i === idx && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className="absolute -bottom-6 text-accent-green font-bold text-[10px]"
                  >
                    ↑ i
                  </motion.div>
                )}
                {stepData.ptrs.i === idx - 1 && idx === 0 && ( /* Special case for i=-1 indicator */
                  <div className="absolute -left-4 -bottom-6 text-accent-green font-bold text-[10px]">
                    i →
                  </div>
                )}
                {stepData.ptrs.j === idx && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className="absolute -bottom-8 text-accent-amber font-bold text-[10px]"
                  >
                    ↑ j
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
