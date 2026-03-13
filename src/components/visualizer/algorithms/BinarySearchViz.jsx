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
  const stateRef = useRef({ low: 0, high: 9, done: false });

  function reset() {
    const nums = input.split(',').map(Number).filter((n) => !isNaN(n)).sort((a, b) => a - b);
    setArr(nums);
    setLow(0);
    setHigh(nums.length - 1);
    setMid(-1);
    setEliminated(new Set());
    setFound(-1);
    stateRef.current = { low: 0, high: nums.length - 1, done: false };
    setStatus(`Searching for ${target} in [${nums.join(', ')}]`);
    pause();
  }

  const doStep = useCallback(() => {
    const s = stateRef.current;
    if (s.done) { pause(); return; }

    const t = Number(target);
    if (s.low > s.high) {
      setStatus(`${target} not found in the array.`);
      s.done = true;
      pause();
      return;
    }

    const m = Math.floor((s.low + s.high) / 2);
    setMid(m);
    setLow(s.low);
    setHigh(s.high);

    if (arr[m] === t) {
      setFound(m);
      setStatus(`Found ${target} at index ${m}!`);
      s.done = true;
      pause();
    } else if (arr[m] < t) {
      setStatus(`arr[${m}] = ${arr[m]} < ${target}. Eliminate left half.`);
      const newElim = new Set(eliminated);
      for (let i = s.low; i <= m; i++) newElim.add(i);
      setEliminated(newElim);
      s.low = m + 1;
    } else {
      setStatus(`arr[${m}] = ${arr[m]} > ${target}. Eliminate right half.`);
      const newElim = new Set(eliminated);
      for (let i = m; i <= s.high; i++) newElim.add(i);
      setEliminated(newElim);
      s.high = m - 1;
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
      <div className="flex gap-1 justify-center items-end h-32">
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
            <div key={idx} className="flex flex-col items-center gap-1 flex-1 max-w-[50px]">
              {label && <span className="text-[8px] font-code text-text-muted">{label}</span>}
              <div
                className={`w-full h-10 rounded flex items-center justify-center text-xs font-code transition-all duration-300
                  ${eliminated.has(idx) ? 'line-through opacity-30' : ''}
                  ${found === idx ? 'text-bg-base font-bold' : 'text-text-primary'}`}
                style={{
                  backgroundColor: bg,
                  border: `2px solid ${borderColor}`,
                }}
              >
                {val}
              </div>
              <span className="text-[8px] text-text-muted">{idx}</span>
            </div>
          );
        })}
      </div>
    </VisualizerPanel>
  );
}
