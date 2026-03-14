import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SortWalkthroughPanel from './SortWalkthroughPanel';
import { useVisualizerTimer } from '../VisualizerPanel';

const LEGEND = [
  { color: 'var(--accent-primary)', label: 'Unsorted' },
  { color: 'var(--accent-amber)', label: 'Key / Current' },
  { color: 'var(--accent-glow)', label: 'Shifting' },
  { color: 'var(--accent-green)', label: 'Sorted Sub-array' }
];

export default function InsertionSortViz() {
  const [input] = useState('38,27,43,3,9,82,10');
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const steps = useMemo(() => {
    const arr = input.split(',').map(Number).filter(n => !isNaN(n));
    const result = [];
    const n = arr.length;
    
    // Initial state
    result.push({
      arr: [...arr],
      colors: new Array(n).fill('default'),
      ptrs: { i: -1, j: -1, keyIdx: -1 },
      title: "Initial Array",
      description: "Insertion Sort builds the final sorted array one item at a time. The first element is always consider 'sorted' as a sub-array of 1.",
      status: "Ready to start"
    });

    const iArr = [...arr];
    for (let i = 1; i < n; i++) {
      let key = iArr[i];
      let j = i - 1;
      
      // Step 1: Pick Key
      const pickColors = new Array(n).fill('default');
      for (let k = 0; k < i; k++) pickColors[k] = 'sorted';
      pickColors[i] = 'comparing';
      
      result.push({
        arr: [...iArr],
        colors: pickColors,
        ptrs: { i, j, keyIdx: i },
        title: `Pick Key: arr[${i}] = ${key}`,
        description: `We take the element at index ${i} as our 'key'. We will look for its correct position in the sorted sub-array to its left.`,
        status: `i = ${i}, key = ${key}`
      });

      while (j >= 0 && iArr[j] > key) {
        // Step 2: Shift
        const shiftColors = new Array(n).fill('default');
        for (let k = 0; k < i + 1; k++) {
            if (k < j) shiftColors[k] = 'sorted';
            else if (k === j) shiftColors[k] = 'swapped';
            else if (k > j && k <= i) shiftColors[k] = 'comparing';
        }
        shiftColors[j+1] = 'swapped'; // Target of shift

        result.push({
          arr: [...iArr],
          colors: shiftColors,
          ptrs: { i, j, keyIdx: -1 }, // key is "floating"
          title: `Shift: ${iArr[j]} > ${key}`,
          description: `Since ${iArr[j]} is larger than our key ${key}, we shift ${iArr[j]} one position to the right.`,
          status: `Shifting index ${j} to ${j+1}`
        });

        iArr[j + 1] = iArr[j];
        j = j - 1;
      }
      
      // Step 3: Insert
      iArr[j + 1] = key;
      const insertColors = new Array(n).fill('default');
      for (let k = 0; k <= i; k++) insertColors[k] = 'sorted';
      
      result.push({
        arr: [...iArr],
        colors: insertColors,
        ptrs: { i, j: j + 1, keyIdx: j + 1 },
        title: `Insert: Key ${key} placed at index ${j + 1}`,
        description: `We've found the correct spot! Either we hit the beginning of the array or found an element smaller than the key.`,
        status: `Insertion complete at index ${j+1}`
      });
    }

    result.push({
      arr: [...iArr],
      colors: new Array(n).fill('sorted'),
      ptrs: { i: -1, j: -1 },
      title: "Insertion Sort Complete!",
      description: "Every element has been picked as a key and inserted into its proper relative position.",
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
      title="Insertion Sort"
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
       <div className="flex flex-col items-center gap-8 w-full">
        <div className="flex gap-2 justify-center flex-wrap">
          {stepData.arr.map((val, idx) => (
            <motion.div
              key={idx}
              layout
              className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center font-mono font-bold text-sm shadow-sm transition-colors duration-300 relative ${
                stepData.colors[idx] === 'comparing' ? 'bg-accent-amber/20 border-accent-amber text-accent-amber' :
                stepData.colors[idx] === 'swapped' ? 'bg-accent-glow/20 border-accent-glow text-accent-glow' :
                stepData.colors[idx] === 'sorted' ? 'bg-accent-green/20 border-accent-green text-accent-green' :
                'bg-bg-elevated border-border-color text-text-primary'
              }`}
            >
              {val}
              
              <AnimatePresence>
                {stepData.ptrs.keyIdx === idx && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.5 }} 
                    animate={{ opacity: 1, scale: 1 }} 
                    exit={{ opacity: 0 }}
                    className="absolute -top-7 text-[9px] font-bold text-accent-amber bg-accent-amber/10 border border-accent-amber/30 px-1 rounded uppercase"
                  >
                    Key
                  </motion.div>
                )}
                {stepData.ptrs.j === idx && stepData.ptrs.keyIdx !== idx && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} 
                    className="absolute -top-6 text-[9px] font-bold text-accent-glow uppercase"
                  >
                    j
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
