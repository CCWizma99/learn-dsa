import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import VisualizerPanel, { useVisualizerTimer } from '../VisualizerPanel';

const COLORS = {
  default: 'var(--accent-primary)',
  comparing: 'var(--accent-amber)',
  swapped: 'var(--accent-glow)',
  sorted: 'var(--accent-green)',
  active: 'var(--accent-blue)',
};

const PSEUDO_CODE = [
  'void mergeSort(int arr[], int l, int r) {',
  '  if (l < r) {',
  '    int m = l + (r - l) / 2;',
  '    mergeSort(arr, l, m);',
  '    mergeSort(arr, m + 1, r);',
  '    merge(arr, l, m, r);',
  '  }',
  '}',
  'void merge(int arr[], int l, int m, int r) {',
  '  while (i < n1 && j < n2) {',
  '    if (L[i] <= R[j]) {',
  '       arr[k++] = L[i++];',
  '    } else {',
  '       arr[k++] = R[j++];',
  '    }',
  '  }',
  '}'
];

export default function MergeSortViz() {
  const [input, setInput] = useState('38,27,43,3,9,82,10');
  const [arr, setArr] = useState([38, 27, 43, 3, 9, 82, 10]);
  const [colors, setColors] = useState([]);
  const [status, setStatus] = useState('Ready. Press Play to start.');
  
  // We need to pre-compute the merge sort steps so the player can just step through them
  // Writing an iterative merge sort that pauses mid-merge is too complex for a simple state machine.
  const [animations, setAnimations] = useState([]);
  const [stepIdx, setStepIdx] = useState(0);
  const [activeLine, setActiveLine] = useState(-1);
  
  const arrRef = useRef([...arr]);
  const stepIdxRef = useRef(0);
  const animsRef = useRef([]);

  // --- Merge Sort Algorithm to generate animation frames ---
  const generateAnimations = (initialArray) => {
    const anims = [];
    const auxiliaryArray = [...initialArray];
    const mainArray = [...initialArray];

    const mergeSortHelper = (main, startIdx, endIdx, auxiliary) => {
      if (startIdx === endIdx) return;
      const middleIdx = Math.floor((startIdx + endIdx) / 2);
      
      // Sort left half
      mergeSortHelper(auxiliary, startIdx, middleIdx, main);
      // Sort right half
      mergeSortHelper(auxiliary, middleIdx + 1, endIdx, main);
      // Merge them
      doMerge(main, startIdx, middleIdx, endIdx, auxiliary);
    };

    const doMerge = (main, startIdx, middleIdx, endIdx, auxiliary) => {
      let k = startIdx;
      let i = startIdx;
      let j = middleIdx + 1;

      while (i <= middleIdx && j <= endIdx) {
        // Compare values
        anims.push({ type: 'compare', indices: [i, j] });
        // Revert colors
        anims.push({ type: 'revert', indices: [i, j] });

        if (auxiliary[i] <= auxiliary[j]) {
          // Overwrite value at index k in main array with value at index i in auxiliary
          anims.push({ type: 'overwrite', index: k, value: auxiliary[i] });
          main[k] = auxiliary[i];
          i++;
        } else {
          // Overwrite value at index k in main array with value at index j in auxiliary
          anims.push({ type: 'overwrite', index: k, value: auxiliary[j] });
          main[k] = auxiliary[j];
          j++;
        }
        k++;
      }

      while (i <= middleIdx) {
        anims.push({ type: 'compare', indices: [i, i] });
        anims.push({ type: 'revert', indices: [i, i] });
        anims.push({ type: 'overwrite', index: k, value: auxiliary[i] });
        main[k] = auxiliary[i];
        i++;
        k++;
      }

      while (j <= endIdx) {
        anims.push({ type: 'compare', indices: [j, j] });
        anims.push({ type: 'revert', indices: [j, j] });
        anims.push({ type: 'overwrite', index: k, value: auxiliary[j] });
        main[k] = auxiliary[j];
        j++;
        k++;
      }
    };

    mergeSortHelper(mainArray, 0, mainArray.length - 1, auxiliaryArray);
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

    if (anim.type === 'compare') {
      setActiveLine(10); // while(...)
      const [i, j] = anim.indices;
      newColors[i] = 'comparing';
      newColors[j] = 'comparing';
      setStatus(`Comparing indices ${i} and ${j}`);
      setColors(newColors);
    } else if (anim.type === 'revert') {
      const [i, j] = anim.indices;
      newColors[i] = 'default';
      newColors[j] = 'default';
      setColors(newColors);
    } else if (anim.type === 'overwrite') {
      setActiveLine(11); // arr[k] = ...
      const currentArrClone = [...currentArr];
      currentArrClone[anim.index] = anim.value;
      arrRef.current = currentArrClone;
      setArr(currentArrClone);
      
      newColors[anim.index] = 'swapped';
      setColors(newColors);
      
      setStatus(`Moving value ${anim.value} to sorted position ${anim.index}`);
    }

    stepIdxRef.current = idx + 1;
    setStepIdx(idx + 1);
    return false;
  }, [colors]);

  const { isPlaying, play, pause } = useVisualizerTimer(100, () => {
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
    
    const anims = generateAnimations(nums);
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
      title="Merge Sort"
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
                 colors[idx] === 'swapped' ? 'shadow-accent-glow/20' : 'shadow-accent-primary/10'
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
