import { useState, useCallback, useRef, useEffect } from 'react';
import VisualizerPanel, { useVisualizerTimer } from '../VisualizerPanel';

const COLORS = {
  default: 'var(--accent-primary)',
  comparing: 'var(--accent-amber)',
  swapped: 'var(--accent-glow)',
  sorted: 'var(--accent-green)',
};

export default function BubbleSortViz() {
  const [input, setInput] = useState('38,27,43,3,9,82,10');
  const [arr, setArr] = useState([38, 27, 43, 3, 9, 82, 10]);
  const [colors, setColors] = useState([]);
  const [status, setStatus] = useState('Ready. Press Play to start.');
  const [step, setStep] = useState({ i: 0, j: 0, pass: 0, comparisons: 0, done: false });
  const stepRef = useRef(step);
  const arrRef = useRef([...arr]);

  function reset() {
    const nums = input.split(',').map(Number).filter((n) => !isNaN(n));
    setArr([...nums]);
    arrRef.current = [...nums];
    setColors(new Array(nums.length).fill('default'));
    const s = { i: 0, j: 0, pass: 0, comparisons: 0, done: false };
    setStep(s);
    stepRef.current = s;
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
      pause();
      return;
    }

    const i = s.i;
    const j = s.j;

    if (i >= n - 1) {
      setColors(new Array(n).fill('sorted'));
      setStatus(`Done! ${s.comparisons} comparisons, ${s.pass} passes.`);
      const newS = { ...s, done: true };
      setStep(newS);
      stepRef.current = newS;
      pause();
      return;
    }

    if (j >= n - 1 - i) {
      // Next pass
      const newC = [...colors];
      newC[n - 1 - i] = 'sorted';
      setColors(newC);
      const newS = { ...s, j: 0, i: i + 1, pass: s.pass + 1 };
      setStep(newS);
      stepRef.current = newS;
      setStatus(`Pass ${newS.pass + 1} starting...`);
      return;
    }

    // Compare
    const newColors = new Array(n).fill('default');
    for (let k = n - 1; k >= n - i; k--) newColors[k] = 'sorted';
    newColors[j] = 'comparing';
    newColors[j + 1] = 'comparing';

    const comps = s.comparisons + 1;

    if (a[j] > a[j + 1]) {
      [a[j], a[j + 1]] = [a[j + 1], a[j]];
      newColors[j] = 'swapped';
      newColors[j + 1] = 'swapped';
      setStatus(`Pass ${i + 1}: Swapped ${a[j + 1]} ↔ ${a[j]} (comparison #${comps})`);
    } else {
      setStatus(`Pass ${i + 1}: ${a[j]} ≤ ${a[j + 1]}, no swap (comparison #${comps})`);
    }

    setArr([...a]);
    setColors(newColors);
    const newS = { ...s, j: j + 1, comparisons: comps };
    setStep(newS);
    stepRef.current = newS;
  }, []);

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
    >
      <div className="flex items-end gap-1 h-40 justify-center">
        {arr.map((val, idx) => (
          <div key={idx} className="flex flex-col items-center gap-1 flex-1 max-w-[40px]">
            <span className="text-[9px] font-code text-text-muted">{val}</span>
            <div
              className="w-full rounded-t transition-all duration-200"
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
