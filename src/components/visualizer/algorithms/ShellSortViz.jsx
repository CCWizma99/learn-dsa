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
  'void shellSort(int arr[], int n) {',
  '  for (int gap = n/2; gap > 0; gap /= 2) {',
  '    for (int i = gap; i < n; i++) {',
  '      int temp = arr[i];',
  '      int j;',
  '      for (j = i; j >= gap && arr[j - gap] > temp; j -= gap)',
  '        arr[j] = arr[j - gap];',
  '      arr[j] = temp;',
  '    }',
  '  }',
  '}'
];

export default function ShellSortViz() {
  const [input, setInput] = useState('38,27,43,3,9,82,10');
  const [arr, setArr] = useState([38, 27, 43, 3, 9, 82, 10]);
  const [colors, setColors] = useState([]);
  const [status, setStatus] = useState('Ready.');
  const [activeLine, setActiveLine] = useState(-1);
  const [step, setStep] = useState({ gap: 0, i: 0, j: 0, subStep: 'start' });
  const stepRef = useRef({ gap: 0, i: 0, j: 0, subStep: 'start' });
  const arrRef = useRef([...arr]);

  function reset() {
    const nums = input.split(',').map(Number).filter((n) => !isNaN(n));
    setArr([...nums]);
    arrRef.current = [...nums];
    setColors(new Array(nums.length).fill('default'));
    const n = nums.length;
    stepRef.current = { gap: Math.floor(n / 2), i: Math.floor(n / 2), j: Math.floor(n / 2), subStep: 'init' };
    setActiveLine(-1);
    setStatus(`Shell Sort: n=${n}, gap=${stepRef.current.gap}`);
    pause();
  }

  const doStep = useCallback(() => {
    const s = stepRef.current;
    const a = arrRef.current;
    const n = a.length;

    if (s.gap <= 0) {
      setColors(new Array(n).fill('sorted'));
      setStatus('Shell Sort complete!');
      pause();
      return;
    }

    if (s.i >= n) {
      const nextGap = Math.floor(s.gap / 2);
      stepRef.current = { gap: nextGap, i: nextGap, j: nextGap, subStep: 'init' };
      setStatus(`Gap reduced to ${nextGap}`);
      setActiveLine(1);
      return;
    }

    if (s.subStep === 'init') {
      setActiveLine(3); // int temp = arr[i];
      s.temp = a[s.i];
      s.j = s.i;
      s.subStep = 'compare';
      setColors(new Array(n).fill('default'));
      const newC = new Array(n).fill('default');
      newC[s.i] = 'comparing';
      if (s.j >= s.gap) newC[s.j - s.gap] = 'comparing';
      setColors(newC);
      return;
    }

    if (s.subStep === 'compare') {
      setActiveLine(6); // for (j = i; j >= gap && arr[j - gap] > temp; ...)
      if (s.j >= s.gap && a[s.j - s.gap] > s.temp) {
        setStatus(`arr[${s.j - s.gap}] > ${s.temp}. Shifting...`);
        setActiveLine(7); // arr[j] = arr[j - gap]
        a[s.j] = a[s.j - s.gap];
        const newC = new Array(n).fill('default');
        newC[s.j] = 'swapped';
        setColors(newC);
        setArr([...a]);
        s.j -= s.gap;
      } else {
        setStatus(`Insertion point found at index ${s.j}.`);
        setActiveLine(8); // arr[j] = temp
        a[s.j] = s.temp;
        setArr([...a]);
        const newC = new Array(n).fill('default');
        newC[s.j] = 'sorted';
        setColors(newC);
        s.i++;
        s.subStep = 'init';
      }
    }
  }, [arr]);

  const { isPlaying, play, pause } = useVisualizerTimer(600, doStep);
  useEffect(() => { reset(); }, []);
  const maxVal = Math.max(...arr, 1);

  return (
    <VisualizerPanel
      title="Shell Sort"
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
