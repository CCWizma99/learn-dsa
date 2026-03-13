import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import VisualizerPanel, { useVisualizerTimer } from '../VisualizerPanel';

export default function QueueViz() {
  const [input, setInput] = useState('10,20,30,40');
  const [queue, setQueue] = useState([10, 20, 30, 40]);
  const [highlight, setHighlight] = useState(-1);
  const [operation, setOperation] = useState('enqueue');
  const [status, setStatus] = useState('Ready.');
  const stepRef = useRef({ done: false });

  function reset() {
    const nums = input.split(',').map(Number).filter((n) => !isNaN(n));
    setQueue([...nums]);
    setHighlight(-1);
    stepRef.current = { done: false };
    setStatus(`Queue: [${nums.join(', ')}]. Front=${nums[0] || '-'}, Rear=${nums[nums.length - 1] || '-'}`);
    pause();
  }

  const doStep = useCallback(() => {
    const s = stepRef.current;
    if (s.done) { pause(); return; }

    if (operation === 'enqueue') {
      const val = Math.floor(Math.random() * 90) + 10;
      setQueue((prev) => [...prev, val]);
      setHighlight(queue.length);
      setStatus(`Enqueued ${val} at rear. Queue size: ${queue.length + 1}`);
      s.done = true;
      pause();
    } else if (operation === 'dequeue') {
      if (queue.length === 0) { setStatus('Queue underflow!'); s.done = true; pause(); return; }
      const val = queue[0];
      setHighlight(0);
      setTimeout(() => {
        setQueue((prev) => prev.slice(1));
        setHighlight(-1);
        setStatus(`Dequeued ${val} from front. Queue size: ${queue.length - 1}`);
      }, 400);
      s.done = true;
      pause();
    }
  }, [queue, operation]);

  const { isPlaying, play, pause } = useVisualizerTimer(600, doStep);

  useEffect(() => { reset(); }, []);

  return (
    <VisualizerPanel
      title="Queue (FIFO)"
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
          <option value="enqueue">Enqueue</option>
          <option value="dequeue">Dequeue</option>
        </select>
      }
    >
      <div className="flex items-center gap-1 overflow-x-auto py-4 px-2 min-h-[80px]">
        <div className="text-[8px] text-accent-green font-code shrink-0 mr-1">FRONT →</div>
        <AnimatePresence>
          {queue.map((val, idx) => (
            <motion.div
              key={`${idx}-${val}`}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              className={`w-12 h-12 rounded border flex items-center justify-center text-xs font-code shrink-0 transition-all duration-300
                ${idx === 0 ? 'border-accent-green bg-accent-green/10' : ''}
                ${idx === queue.length - 1 ? 'border-accent-amber bg-accent-amber/10' : ''}
                ${idx !== 0 && idx !== queue.length - 1 ? 'border-border-color bg-bg-elevated' : ''}
                ${idx === highlight ? 'shadow-glow border-accent-primary' : ''}`}
            >
              {val}
            </motion.div>
          ))}
        </AnimatePresence>
        <div className="text-[8px] text-accent-amber font-code shrink-0 ml-1">← REAR</div>
        {queue.length === 0 && (
          <div className="text-xs text-text-muted italic">Queue is empty</div>
        )}
      </div>
    </VisualizerPanel>
  );
}
