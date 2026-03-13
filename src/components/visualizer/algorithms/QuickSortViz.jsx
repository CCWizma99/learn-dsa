import { useState, useCallback, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import VisualizerPanel, { useVisualizerTimer } from '../VisualizerPanel';

const COLORS = {
  default: 'var(--accent-primary)',
  comparing: 'var(--accent-amber)',
  swapped: 'var(--accent-glow)',
  sorted: 'var(--accent-green)',
  pivot: 'var(--accent-red)',
};

const PSEUDO_CODE = [
  'void quickSort(int arr[], int low, int high) {',
  '  if (low < high) {',
  '    int pi = partition(arr, low, high);',
  '    quickSort(arr, low, pi - 1);',
  '    quickSort(arr, pi + 1, high);',
  '  }',
  '}',
  'int partition(int arr[], int low, int high) {',
  '  int pivot = arr[high];',
  '  for (int j = low; j < high; j++) {',
  '    if (arr[j] < pivot) {',
  '      i++; swap(&arr[i], &arr[j]);',
  '    }',
  '  }',
  '  swap(&arr[i + 1], &arr[high]);',
  '  return (i + 1);',
  '}'
];

export default function QuickSortViz() {
  const [input, setInput] = useState('38,27,43,3,9,82,10');
  const [arr, setArr] = useState([38, 27, 43, 3, 9, 82, 10]);
  const [colors, setColors] = useState([]);
  const [status, setStatus] = useState('Ready. Press Play to start.');
  
  // Like Merge Sort, we pre-compute the Quick Sort steps so the player can step through them
  const [animations, setAnimations] = useState([]);
  const [stepIdx, setStepIdx] = useState(0);
  const [activeLine, setActiveLine] = useState(-1);
  
  const arrRef = useRef([...arr]);
  const stepIdxRef = useRef(0);
  const animsRef = useRef([]);

  // --- Quick Sort Algorithm to generate animation frames ---
  const generateAnimations = (initialArray) => {
    const anims = [];
    const auxiliaryArray = [...initialArray];

    const quickSortHelper = (main, low, high) => {
      if (low < high) {
        const pi = partition(main, low, high);
        
        quickSortHelper(main, low, pi - 1);
        quickSortHelper(main, pi + 1, high);
      } else if (low === high) {
          anims.push({ type: 'sorted', index: low });
      }
    };

    const partition = (main, low, high) => {
      const pivot = main[high];
      anims.push({ type: 'pivot', index: high, value: pivot });
      
      let i = low - 1;

      for (let j = low; j <= high - 1; j++) {
        anims.push({ type: 'compare', indices: [j, high] });
        
        if (main[j] < pivot) {
          i++;
          anims.push({ type: 'swap', indices: [i, j], values: [main[i], main[j]] });
          // Perform swap in our recording array
          let temp = main[i];
          main[i] = main[j];
          main[j] = temp;
        } else {
             anims.push({ type: 'no_swap', indices: [j, high] });
        }
      }
      
      anims.push({ type: 'swap', indices: [i + 1, high], values: [main[i + 1], main[high]] });
      let temp = main[i + 1];
      main[i + 1] = main[high];
      main[high] = temp;
      
      anims.push({ type: 'sorted', index: i + 1});

      return i + 1;
    };

    quickSortHelper(auxiliaryArray, 0, auxiliaryArray.length - 1);
    return anims;
  };

  const doStep = useCallback(() => {
    const idx = stepIdxRef.current;
    const anims = animsRef.current;
    const currentArr = arrRef.current;
    
    if (idx >= anims.length) {
      setColors(new Array(currentArr.length).fill('sorted'));
      setStatus('Sorting complete!');
      return true; // Return true to indicate sorting is complete
    }

    const anim = anims[idx];
    const newColors = [...colors]; 
    
    for (let k = 0; k < newColors.length; k++) {
        if (newColors[k] !== 'sorted' && newColors[k] !== 'pivot') {
            newColors[k] = 'default';
        }
    }

    if (anim.type === 'pivot') {
      setActiveLine(9); // pivot = arr[high]
      newColors[anim.index] = 'pivot';
      setStatus(`Selected pivot: ${anim.value} at index ${anim.index}`);
      setColors(newColors);
    } else if (anim.type === 'compare') {
      setActiveLine(11); // if (arr[j] < pivot)
      const [i, j] = anim.indices;
      newColors[i] = 'comparing';
      setStatus(`Comparing ${currentArr[i]} with pivot ${currentArr[j]}`);
      setColors(newColors);
    } else if (anim.type === 'no_swap') {
         setStatus(`No swap needed.`);
         setColors(newColors);
    } else if (anim.type === 'swap') {
      setActiveLine(12); // swap(...)
      const [i, j] = anim.indices;
      const currentArrClone = [...currentArr];
      
      let temp = currentArrClone[i];
      currentArrClone[i] = currentArrClone[j];
      currentArrClone[j] = temp;
      
      arrRef.current = currentArrClone;
      setArr(currentArrClone);
      
      newColors[i] = 'swapped';
      newColors[j] = 'swapped';
      setColors(newColors);
      
      setStatus(`Swapped ${anim.values[0]} and ${anim.values[1]}`);
    } else if (anim.type === 'sorted') {
        newColors[anim.index] = 'sorted';
        setActiveLine(15); // return pi
        setStatus(`Index ${anim.index} sorted.`);
        setColors(newColors);
    }

    stepIdxRef.current = idx + 1;
    setStepIdx(idx + 1);
    return false;
  }, [colors]);

  const { isPlaying, play, pause } = useVisualizerTimer(250, () => {
      const isDone = doStep();
      if (isDone) {
          pause();
      }
  });

  function reset() {
    const nums = input.split(',').map(Number).filter((n) => !isNaN(n));
    setArr([...nums]);
    arrRef.current = [...nums];
    setColors(new Array(nums.length).fill('default'));
    
    const anims = generateAnimations([...nums]);
    setAnimations(anims);
    animsRef.current = anims;
    
    setStepIdx(0);
    stepIdxRef.current = 0;
    
    setStatus(`Array: [${nums.join(', ')}]. Ready.`);
    
    if (pause) {
      pause();
    }
  }

  useEffect(() => { reset(); }, []);

  const maxVal = Math.max(...arr, 1);

  return (
    <VisualizerPanel
      title="Quick Sort"
      inputLabel="Array"
      inputValue={input}
      onInputChange={(v) => { setInput(v); }}
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
                colors[idx] === 'pivot' ? 'shadow-accent-red/20' : 'shadow-accent-primary/10'
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
