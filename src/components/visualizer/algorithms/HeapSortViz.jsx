import { useState, useCallback, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import VisualizerPanel, { useVisualizerTimer } from '../VisualizerPanel';

const COLORS = {
  default: 'var(--accent-primary)',
  comparing: 'var(--accent-amber)',
  swapped: 'var(--accent-glow)',
  sorted: 'var(--accent-green)',
  heap: 'var(--accent-blue)',
};

const PSEUDO_CODE = [
  'void heapSort(int arr[], int n) {',
  '  buildMaxHeap(arr, n);',
  '  for (int i = n - 1; i > 0; i--) {',
  '    swap(&arr[0], &arr[i]);',
  '    heapify(arr, i, 0);',
  '  }',
  '}',
  '// heapify() ensures max heap property...'
];

export default function HeapSortViz() {
  const [input, setInput] = useState('38,27,43,3,9,82,10');
  const [arr, setArr] = useState([38, 27, 43, 3, 9, 82, 10]);
  const [colors, setColors] = useState([]);
  const [status, setStatus] = useState('Ready.');
  const [activeLine, setActiveLine] = useState(-1);
  
  // High-level steps for Heap Sort
  const [animations, setAnimations] = useState([]);
  const [stepIdx, setStepIdx] = useState(0);
  const stepIdxRef = useRef(0);
  const animsRef = useRef([]);
  const arrRef = useRef([...arr]);

  const generateAnimations = (a) => {
    const anims = [];
    const n = a.length;
    
    const swap = (i, j) => {
      anims.push({ type: 'swap', indices: [i, j], values: [a[i], a[j]] });
      [a[i], a[j]] = [a[j], a[i]];
    };

    const heapify = (size, i) => {
      let largest = i;
      let left = 2 * i + 1;
      let right = 2 * i + 2;

      if (left < size) {
        anims.push({ type: 'compare', indices: [largest, left] });
        if (a[left] > a[largest]) largest = left;
      }
      if (right < size) {
        anims.push({ type: 'compare', indices: [largest, right] });
        if (a[right] > a[largest]) largest = right;
      }

      if (largest !== i) {
        swap(i, largest);
        heapify(size, largest);
      }
    };

    // Build max heap
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) heapify(n, i);

    // Extract elements
    for (let i = n - 1; i > 0; i--) {
      swap(0, i);
      anims.push({ type: 'sorted', index: i });
      heapify(i, 0);
    }
    anims.push({ type: 'sorted', index: 0 });
    return anims;
  };

  function reset() {
    const nums = input.split(',').map(Number).filter((n) => !isNaN(n));
    setArr([...nums]);
    arrRef.current = [...nums];
    setColors(new Array(nums.length).fill('heap'));
    
    const anims = generateAnimations([...nums]);
    animsRef.current = anims;
    setStepIdx(0);
    stepIdxRef.current = 0;
    setActiveLine(-1);
    setStatus(`Heap built. Ready to extract.`);
    pause();
  }

  const doStep = useCallback(() => {
    const idx = stepIdxRef.current;
    const anims = animsRef.current;
    const currentArr = arrRef.current;

    if (idx >= anims.length) {
      setColors(new Array(currentArr.length).fill('sorted'));
      setStatus('Heap Sort complete!');
      pause();
      return;
    }

    const anim = anims[idx];
    const newColors = [...colors];
    // Reset transient colors
    for (let k = 0; k < newColors.length; k++) {
        if (newColors[k] === 'comparing' || newColors[k] === 'swapped') newColors[k] = 'heap';
    }

    if (anim.type === 'compare') {
      setActiveLine(4); // heapify
      newColors[anim.indices[0]] = 'comparing';
      newColors[anim.indices[1]] = 'comparing';
      setStatus(`Heapifying: comparing ${currentArr[anim.indices[0]]} and ${currentArr[anim.indices[1]]}`);
    } else if (anim.type === 'swap') {
      setActiveLine(3); // swap(0, i)
      const [i, j] = anim.indices;
      [currentArr[i], currentArr[j]] = [currentArr[j], currentArr[i]];
      setArr([...currentArr]);
      newColors[i] = 'swapped';
      newColors[j] = 'swapped';
      setStatus(`Swapped root with element at index ${j}`);
    } else if (anim.type === 'sorted') {
      newColors[anim.index] = 'sorted';
      setStatus(`Index ${anim.index} is sorted.`);
    }

    setColors(newColors);
    stepIdxRef.current = idx + 1;
    setStepIdx(idx + 1);
  }, [colors]);

  const { isPlaying, play, pause } = useVisualizerTimer(500, doStep);
  useEffect(() => { reset(); }, []);
  const maxVal = Math.max(...arr, 1);

  return (
    <VisualizerPanel
      title="Heap Sort"
      inputLabel="Array"
      inputValue={input}
      onInputChange={setInput}
      onPlay={play}
      onPause={pause}
      onStep={doStep}
      onReset={reset}
      isPlaying={isPlaying}
      status={status}
      codeLines={PSEUDO_CODE}
      activeLineIdx={activeLine}
    >
      <div className="flex items-end gap-2 h-64 justify-center w-full max-w-4xl mx-auto px-4 overflow-hidden">
        {arr.map((val, idx) => (
          <motion.div 
            key={`${idx}-${val}`}
            layout
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="flex flex-col items-center gap-2 flex-1 max-w-[60px]"
          >
             <span className="text-[11px] font-bold font-code text-text-primary">{val}</span>
            <motion.div
              layout
              className={`w-full rounded-t-lg transition-colors duration-200 shadow-lg ${
                colors[idx] === 'heap' ? 'shadow-accent-blue/20' : 'shadow-accent-primary/10'
              }`}
              style={{
                height: `${(val / maxVal) * 200}px`,
                backgroundColor: COLORS[colors[idx]] || COLORS.default,
                minHeight: '12px',
              }}
            />
          </motion.div>
        ))}
      </div>
    </VisualizerPanel>
  );
}
