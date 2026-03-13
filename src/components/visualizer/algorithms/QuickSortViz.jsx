import { useState, useCallback, useRef, useEffect } from 'react';
import VisualizerPanel, { useVisualizerTimer } from '../VisualizerPanel';

const COLORS = {
  default: 'var(--accent-primary)',
  comparing: 'var(--accent-amber)',
  swapped: 'var(--accent-glow)',
  sorted: 'var(--accent-green)',
  pivot: 'var(--accent-red)', // Special color for the chosen pivot
};

export default function QuickSortViz() {
  const [input, setInput] = useState('38,27,43,3,9,82,10');
  const [arr, setArr] = useState([38, 27, 43, 3, 9, 82, 10]);
  const [colors, setColors] = useState([]);
  const [status, setStatus] = useState('Ready. Press Play to start.');
  
  // Like Merge Sort, we pre-compute the Quick Sort steps so the player can step through them
  const [animations, setAnimations] = useState([]);
  const [stepIdx, setStepIdx] = useState(0);
  
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
      newColors[anim.index] = 'pivot';
      setStatus(`Selected pivot: ${anim.value} at index ${anim.index}`);
      setColors(newColors);
    } else if (anim.type === 'compare') {
      const [i, j] = anim.indices;
      newColors[i] = 'comparing';
      setStatus(`Comparing ${currentArr[i]} with pivot ${currentArr[j]}`);
      setColors(newColors);
    } else if (anim.type === 'no_swap') {
         setStatus(`No swap needed, element is greater than pivot.`);
         setColors(newColors);
    } else if (anim.type === 'swap') {
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
        setStatus(`Element at index ${anim.index} is now in its sorted position.`);
        setColors(newColors);
    }

    stepIdxRef.current = idx + 1;
    setStepIdx(idx + 1);
    return false; // Return false to indicate sorting is NOT complete
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
    >
      <div className="flex items-end gap-1 h-40 justify-center">
        {arr.map((val, idx) => (
          <div key={idx} className="flex flex-col items-center gap-1 flex-1 max-w-[40px]">
             <span className="text-[9px] font-code text-text-muted">{val}</span>
            <div
              className="w-full rounded-t transition-all duration-250"
              style={{
                height: `${(val / maxVal) * 120}px`,
                backgroundColor: COLORS[colors[idx]] || COLORS.default,
                minHeight: '8px',
              }}
            />
          </div>
        ))}
      </div>
    </VisualizerPanel>
  );
}
