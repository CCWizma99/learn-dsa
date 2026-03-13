import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import VisualizerPanel, { useVisualizerTimer } from '../VisualizerPanel';

export default function StackViz() {
  const [input, setInput] = useState('10,20,30');
  const [stack, setStack] = useState([10, 20, 30]);
  const [highlight, setHighlight] = useState(-1);
  const [operation, setOperation] = useState('push');
  const [status, setStatus] = useState('Ready.');
  const stepRef = useRef({ done: false });

  function reset() {
    const nums = input.split(',').map(Number).filter((n) => !isNaN(n));
    setStack([...nums]);
    setHighlight(-1);
    stepRef.current = { done: false };
    setStatus(`Stack (bottom→top): [${nums.join(', ')}]. Top = ${nums[nums.length - 1] || 'empty'}`);
    pause();
  }

  const doStep = useCallback(() => {
    const s = stepRef.current;
    if (s.done) { pause(); return; }

    if (operation === 'push') {
      const val = Math.floor(Math.random() * 90) + 10;
      setStack((prev) => [...prev, val]);
      setHighlight(stack.length);
      setStatus(`Pushed ${val}. Stack size: ${stack.length + 1}`);
      s.done = true;
      pause();
    } else if (operation === 'pop') {
      if (stack.length === 0) { setStatus('Stack underflow! Empty.'); s.done = true; pause(); return; }
      const val = stack[stack.length - 1];
      setHighlight(stack.length - 1);
      setTimeout(() => {
        setStack((prev) => prev.slice(0, -1));
        setHighlight(-1);
        setStatus(`Popped ${val}. Stack size: ${stack.length - 1}`);
      }, 400);
      s.done = true;
      pause();
    } else if (operation === 'peek') {
      if (stack.length === 0) { setStatus('Stack is empty.'); s.done = true; pause(); return; }
      setHighlight(stack.length - 1);
      setStatus(`Top of stack: ${stack[stack.length - 1]}`);
      s.done = true;
      pause();
    }
  }, [stack, operation]);

  const { isPlaying, play, pause } = useVisualizerTimer(600, doStep);

  useEffect(() => { reset(); }, []);

  return (
    <VisualizerPanel
      title="Stack (LIFO)"
      inputLabel="Values"
      inputValue={input}
      onInputChange={setInput}
      onPlay={play}
      onPause={pause}
      onStep={doStep}
      onReset={reset}
      isPlaying={isPlaying}
      status={status}
      extraControls={
        <select
          value={operation}
          onChange={(e) => { setOperation(e.target.value); stepRef.current = { done: false }; }}
          className="bg-bg-elevated border border-border-color rounded px-1.5 py-1 text-xs text-text-primary outline-none ml-2"
        >
          <option value="push">Push</option>
          <option value="pop">Pop</option>
          <option value="peek">Peek</option>
        </select>
      }
    >
      <div className="flex flex-col-reverse items-center gap-1 min-h-[160px] justify-start py-2">
        {stack.length === 0 && (
          <div className="text-xs text-text-muted italic">Stack is empty</div>
        )}
        <AnimatePresence>
          {stack.map((val, idx) => (
            <motion.div
              key={`${idx}-${val}`}
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              className={`w-24 px-3 py-2 rounded border text-center text-xs font-code transition-all duration-300 relative
                ${idx === stack.length - 1 ? 'border-accent-primary bg-accent-primary/10' : 'border-border-color bg-bg-elevated'}
                ${idx === highlight ? 'shadow-glow border-accent-amber bg-accent-amber/10' : ''}`}
            >
              {val}
              {idx === stack.length - 1 && (
                <span className="absolute -right-8 text-[8px] text-accent-primary font-code">← TOP</span>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </VisualizerPanel>
  );
}
