import { useState, useCallback, useRef, useEffect } from 'react';
import VisualizerPanel, { useVisualizerTimer } from '../VisualizerPanel';

const COLORS = {
  default: 'var(--bg-elevated)',
  low: 'var(--accent-primary)',
  mid: 'var(--accent-amber)',
  high: 'var(--accent-glow)',
  found: 'var(--accent-green)',
  eliminated: 'var(--border)',
};

const PSEUDO_CODE = [
  'int binarySearch(int arr[], int low, int high, int x) {',
  '  while (low <= high) {',
  '    int mid = low + (high - low) / 2;',
  '    if (arr[mid] == x)',
  '      return mid;',
  '    if (arr[mid] < x)',
  '      low = mid + 1;',
  '    else',
  '      high = mid - 1;',
  '  }',
  '  return -1;',
  '}'
];

export default function BinarySearchViz() {
  const [input, setInput] = useState('2,5,8,12,16,23,38,56,72,91');
  const [target, setTarget] = useState('23');
  const [arr, setArr] = useState([2, 5, 8, 12, 16, 23, 38, 56, 72, 91]);
  const [low, setLow] = useState(0);
  const [high, setHigh] = useState(9);
  const [mid, setMid] = useState(-1);
  const [eliminated, setEliminated] = useState(new Set());
  const [found, setFound] = useState(-1);
  const [status, setStatus] = useState('Ready. Press Play.');
  const [activeLine, setActiveLine] = useState(-1);
  const stateRef = useRef({ low: 0, high: 9, done: false, subStep: 'mid' });

  function reset() {
    const nums = input.split(',').map(Number).filter((n) => !isNaN(n)).sort((a, b) => a - b);
    setArr(nums);
    setLow(0);
    setHigh(nums.length - 1);
    setMid(-1);
    setEliminated(new Set());
    setFound(-1);
    setActiveLine(-1);
    stateRef.current = { low: 0, high: nums.length - 1, done: false, subStep: 'mid' };
    setStatus(`Searching for ${target} in [${nums.join(', ')}]`);
    pause();
  }

  const doStep = useCallback(() => {
    const s = stateRef.current;
    if (s.done) { pause(); return; }

    const t = Number(target);
    const m = Math.floor((s.low + s.high) / 2);

    if (s.low > s.high) {
      setActiveLine(10); // return -1
      setStatus(`${target} not found in the array.`);
      s.done = true;
      pause();
      return;
    }

    if (s.subStep === 'mid') {
      setActiveLine(2); // int mid = low + ...
      setMid(m);
      setLow(s.low);
      setHigh(s.high);
      setStatus(`Calculating mid: (low + high) / 2 = ${m}`);
      s.subStep = 'check';
    } else if (s.subStep === 'check') {
      setActiveLine(3); // if (arr[mid] == x)
      if (arr[m] === t) {
        setActiveLine(4); // return mid
        setFound(m);
        setStatus(`Found ${target} at index ${m}!`);
        s.done = true;
        pause();
      } else {
        s.subStep = 'compare';
        doStep(); // Cascade to next check immediately for better flow or keep separate? 
        // Let's keep separate for clear stepping.
      }
    } else if (s.subStep === 'compare') {
      setActiveLine(5); // if (arr[mid] < x)
      if (arr[m] < t) {
        setActiveLine(6); // low = mid + 1
        setStatus(`arr[${m}] = ${arr[m]} < ${target}. Eliminate left half.`);
        const newElim = new Set(eliminated);
        for (let i = s.low; i <= m; i++) newElim.add(i);
        setEliminated(newElim);
        s.low = m + 1;
      } else {
        setActiveLine(8); // high = mid - 1
        setStatus(`arr[${m}] = ${arr[m]} > ${target}. Eliminate right half.`);
        const newElim = new Set(eliminated);
        for (let i = m; i <= s.high; i++) newElim.add(i);
        setEliminated(newElim);
        s.high = m - 1;
      }
      s.subStep = 'mid';
    }
  }, [arr, target, eliminated]);

  const { isPlaying, play, pause } = useVisualizerTimer(700, doStep);

  useEffect(() => { reset(); }, []);

  return (
    <VisualizerPanel
      title="Binary Search"
      inputLabel="Sorted Array"
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
      extraControls={
        <div className="flex items-center gap-1 ml-2">
          <label className="text-[10px] text-text-muted">Target:</label>
          <input
            type="number"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            className="w-14 bg-bg-elevated border border-border-color rounded px-1.5 py-1 text-xs text-text-primary outline-none focus:border-accent-primary/50"
          />
        </div>
      }
    >
      <div className="flex gap-2 justify-center items-end h-40 w-full max-w-4xl mx-auto px-4">
        {arr.map((val, idx) => {
          let bg = COLORS.default;
          let borderColor = 'transparent';
          let label = '';
 
          if (found === idx) {
            bg = COLORS.found;
          } else if (eliminated.has(idx)) {
            bg = COLORS.eliminated;
          } else if (idx === mid) {
            bg = COLORS.mid;
            label = 'mid';
          }
 
          if (idx === low && !eliminated.has(idx)) { borderColor = COLORS.low; if (!label) label = 'low'; }
          if (idx === high && !eliminated.has(idx)) { borderColor = COLORS.high; if (!label) label = 'high'; }
 
          return (
            <div key={idx} className="flex flex-col items-center gap-2 flex-1 max-w-[64px]">
              {label && (
                <span className="text-[10px] font-bold font-code text-white bg-accent-primary px-1.5 py-0.5 rounded uppercase tracking-tighter animate-pulse">
                  {label}
                </span>
              )}
              <div
                className={`w-full h-14 rounded-xl flex items-center justify-center text-sm font-bold font-code transition-all duration-300 shadow-lg
                  ${eliminated.has(idx) ? 'opacity-20 grayscale' : 'shadow-accent-primary/5'}
                  ${found === idx ? 'text-white border-2 border-accent-green' : 'text-text-primary'}`}
                style={{
                  backgroundColor: bg,
                  border: borderColor !== 'transparent' ? `3px solid ${borderColor}` : undefined,
                }}
              >
                {val}
              </div>
              <span className="text-[10px] text-text-muted font-bold">{idx}</span>
            </div>
          );
        })}
      </div>
    </VisualizerPanel>
  );
}
