import { useState, useCallback, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import VisualizerPanel, { useVisualizerTimer } from '../VisualizerPanel';

const COLORS = {
  default: 'var(--accent-primary)',
  comparing: 'var(--accent-amber)',
  swapped: 'var(--accent-glow)',
  sorted: 'var(--accent-green)',
};

const PSEUDO_CODE = [
  'void bubbleSort(int arr[], int n) {',
  '  for (int i = 0; i < n - 1; i++) {',
  '    for (int j = 0; j < n - i - 1; j++) {',
  '      if (arr[j] > arr[j + 1]) {',
  '        swap(&arr[j], &arr[j + 1]);',
  '      }',
  '    }',
  '  }',
  '}'
];

export default function BubbleSortViz() {
  const [input, setInput] = useState('38,27,43,3,9,82,10');
  const [arr, setArr] = useState([38, 27, 43, 3, 9, 82, 10]);
  const [colors, setColors] = useState([]);
  const [status, setStatus] = useState('Ready. Press Play to start.');
  const [step, setStep] = useState({ i: 0, j: 0, pass: 0, comparisons: 0, done: false, subStep: 'compare' });
  const [activeLine, setActiveLine] = useState(-1);
  const stepRef = useRef(step);
  const arrRef = useRef([...arr]);

  function reset() {
    const nums = input.split(',').map(Number).filter((n) => !isNaN(n));
    setArr([...nums]);
    arrRef.current = [...nums];
    setColors(new Array(nums.length).fill('default'));
    const s = { i: 0, j: 0, pass: 0, comparisons: 0, done: false, subStep: 'compare' };
    setStep(s);
    stepRef.current = s;
    setActiveLine(-1);
    setStatus(`Array: [${nums.join(', ')}]. Ready.`);
    pause();
  }

  const doStep = useCallback(() => {
    const s = stepRef.current;
    const a = arrRef.current;
    const n = a.length;

    if (s.done || n <= 1) {
      setColors(new Array(n).fill('sorted'));
      setStatus('Sorting complete!');
      setActiveLine(-1);
      pause();
      return;
    }

    const { i, j, subStep } = s;

    if (i >= n - 1) {
      setColors(new Array(n).fill('sorted'));
      setStatus(`Done! ${s.comparisons} comparisons, ${s.pass} passes.`);
      const newS = { ...s, done: true };
      setStep(newS);
      stepRef.current = newS;
      setActiveLine(-1);
      pause();
      return;
    }

    if (j >= n - 1 - i) {
      const newC = [...colors];
      if (n - 1 - i >= 0) newC[n - 1 - i] = 'sorted';
      setColors(newC);
      const newS = { ...s, j: 0, i: i + 1, pass: s.pass + 1, subStep: 'compare' };
      setStep(newS);
      stepRef.current = newS;
      setActiveLine(1); // Back to outer loop
      setStatus(`Pass ${newS.pass + 1} starting...`);
      return;
    }

    if (subStep === 'compare') {
      setActiveLine(3); // if (arr[j] > arr[j + 1])
      const newColors = new Array(n).fill('default');
      for (let k = n - 1; k >= n - i; k--) newColors[k] = 'sorted';
      newColors[j] = 'comparing';
      newColors[j + 1] = 'comparing';
      setColors(newColors);
      
      const comps = s.comparisons + 1;
      if (a[j] > a[j + 1]) {
        setStatus(`Pass ${i + 1}: ${a[j]} > ${a[j + 1]}. Preparing to swap...`);
        const newS = { ...s, subStep: 'swap', comparisons: comps };
        setStep(newS);
        stepRef.current = newS;
      } else {
        setStatus(`Pass ${i + 1}: ${a[j]} ≤ ${a[j + 1]}. No swap needed.`);
        const newS = { ...s, j: j + 1, subStep: 'compare', comparisons: comps };
        setStep(newS);
        stepRef.current = newS;
      }
    } else if (subStep === 'swap') {
      setActiveLine(4); // swap(&arr[j], &arr[j + 1])
      [a[j], a[j + 1]] = [a[j + 1], a[j]];
      const newColors = new Array(n).fill('default');
      for (let k = n - 1; k >= n - i; k--) newColors[k] = 'sorted';
      newColors[j] = 'swapped';
      newColors[j + 1] = 'swapped';
      
      setArr([...a]);
      setColors(newColors);
      setStatus(`Pass ${i + 1}: Swapped ${a[j+1]} ↔ ${a[j]}`);
      const newS = { ...s, j: j + 1, subStep: 'compare' };
      setStep(newS);
      stepRef.current = newS;
    }
  }, [colors]);

  const { isPlaying, play, pause } = useVisualizerTimer(500, doStep);

  useEffect(() => { reset(); }, []);

  const maxVal = Math.max(...arr, 1);

  return (
    <VisualizerPanel
      title="Bubble Sort"
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
              className="w-full rounded-t-lg transition-colors duration-200 shadow-lg shadow-accent-primary/10"
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
