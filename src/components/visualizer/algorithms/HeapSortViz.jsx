import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SortWalkthroughPanel from './SortWalkthroughPanel';
import { useVisualizerTimer } from '../VisualizerPanel';

const LEGEND = [
  { color: 'var(--accent-amber)', label: 'Heap Root' },
  { color: 'var(--accent-primary)', label: 'Active Heap' },
  { color: 'var(--accent-glow)', label: 'Comparing / Swapping' },
  { color: 'var(--accent-green)', label: 'Sorted' }
];

export default function HeapSortViz() {
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
      ptrs: { },
      title: "Initial Array",
      description: "Heap Sort works by visualizing the array as a Complete Binary Tree. We first build a Max-Heap.",
      status: "Ready"
    });

    const hArr = [...arr];

    // Build max heap
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
      heapify(hArr, n, i, result, "Building Max-Heap");
    }

    // Extract elements one by one
    for (let i = n - 1; i > 0; i--) {
      result.push({
        arr: [...hArr],
        colors: hArr.map((_, idx) => idx === 0 ? 'swapped' : (idx === i ? 'swapped' : (idx < i ? 'default' : 'sorted'))),
        ptrs: { root: 0, last: i },
        title: `Extract Max: Swap ${hArr[0]} with ${hArr[i]}`,
        description: `Moving the largest element ${hArr[0]} to the end of the array.`,
        status: `Root to end`
      });

      [hArr[0], hArr[i]] = [hArr[i], hArr[0]];
      
      heapify(hArr, i, 0, result, "Re-heapifying");
    }

    function heapify(array, size, rootIdx, stepsArr, phase) {
      let largest = rootIdx;
      let l = 2 * rootIdx + 1;
      let r = 2 * rootIdx + 2;

      const baseColors = array.map((_, idx) => idx < size ? 'default' : 'sorted');
      baseColors[rootIdx] = 'comparing';
      if (l < size) baseColors[l] = 'comparing';
      if (r < size) baseColors[r] = 'comparing';

      stepsArr.push({
        arr: [...array],
        colors: baseColors,
        ptrs: { root: rootIdx, l, r },
        title: `${phase}: Heapifying index ${rootIdx}`,
        description: `Comparing parent ${array[rootIdx]} with children ${l < size ? array[l] : 'N/A'} and ${r < size ? array[r] : 'N/A'}.`,
        status: `Max-heap property check`
      });

      if (l < size && array[l] > array[largest]) largest = l;
      if (r < size && array[r] > array[largest]) largest = r;

      if (largest !== rootIdx) {
        [array[rootIdx], array[largest]] = [array[largest], array[rootIdx]];
        
        const swapColors = array.map((_, idx) => idx < size ? 'default' : 'sorted');
        swapColors[rootIdx] = 'swapped';
        swapColors[largest] = 'swapped';

        stepsArr.push({
          arr: [...array],
          colors: swapColors,
          ptrs: { root: rootIdx, swapped: largest },
          title: `Swap ${array[largest]} ↔ ${array[rootIdx]}`,
          description: `Element ${array[largest]} was larger than its parent. Swapping to maintain Max-Heap property.`,
          status: `Swapping values`
        });

        heapify(array, size, largest, stepsArr, phase);
      }
    }

    result.push({
      arr: [...hArr],
      colors: new Array(n).fill('sorted'),
      ptrs: { },
      title: "Heap Sort Complete!",
      description: "All elements have been extracted from the heap in descending order.",
      status: "COMPLETED"
    });

    return result;
  }, [input]);

  const next = () => setCurrentStep(s => Math.min(steps.length - 1, s + 1));
  const prev = () => setCurrentStep(s => Math.max(0, s - 1));
  const reset = () => { setCurrentStep(0); setIsPlaying(false); };

  const { play, pause } = useVisualizerTimer(1000, () => {
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
      title="Heap Sort"
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
                stepData.colors[idx] === 'comparing' ? 'bg-accent-glow/20 border-accent-glow text-accent-glow' :
                stepData.colors[idx] === 'swapped' ? 'bg-accent-glow/40 border-accent-glow text-accent-glow scale-105' :
                stepData.colors[idx] === 'sorted' ? 'bg-accent-green/20 border-accent-green text-accent-green' :
                'bg-bg-elevated border-border-color text-text-primary'
              }`}
            >
              {val}
              
              <AnimatePresence>
                {stepData.ptrs.root === idx && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                    className="absolute -top-7 text-accent-amber font-bold text-[8px] uppercase tracking-tighter"
                  >
                    Root
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
