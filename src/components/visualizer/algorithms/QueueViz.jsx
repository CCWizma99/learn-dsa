import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import VisualizerPanel, { useVisualizerTimer } from '../VisualizerPanel';

const PSEUDO_CODE = [
  'void enqueue(int val) {',
  '  if (isFull()) return;',
  '  queue[++rear] = val;',
  '}',
  '',
  'int dequeue() {',
  '  if (isEmpty()) return -1;',
  '  return queue[front++];',
  '}'
];

export default function QueueViz() {
  const [input, setInput] = useState('10,20,30,40');
  const [queue, setQueue] = useState([10, 20, 30, 40]);
  const [highlight, setHighlight] = useState(-1);
  const [operation, setOperation] = useState('enqueue');
  const [status, setStatus] = useState('Ready.');
  const [activeLine, setActiveLine] = useState(-1);
  const stepRef = useRef({ done: false, subStep: 'start' });

  function reset() {
    const nums = input.split(',').map(Number).filter((n) => !isNaN(n));
    setQueue([...nums]);
    setHighlight(-1);
    setActiveLine(-1);
    stepRef.current = { done: false, subStep: 'start' };
    setStatus(`Queue: [${nums.join(', ')}]. Front=${nums[0] || '-'}, Rear=${nums[nums.length - 1] || '-'}`);
    pause();
  }

  const doStep = useCallback(() => {
    const s = stepRef.current;
    if (s.done) { pause(); return; }

    if (operation === 'enqueue') {
      if (s.subStep === 'start') {
        setActiveLine(1); // if (isFull())
        setStatus('Checking if queue is full...');
        s.subStep = 'execute';
      } else {
        const val = Math.floor(Math.random() * 90) + 10;
        setActiveLine(2); // queue[++rear] = val
        setQueue((prev) => [...prev, val]);
        setHighlight(queue.length);
        setStatus(`Enqueued ${val} at rear. Queue size: ${queue.length + 1}`);
        s.done = true;
        pause();
      }
    } else if (operation === 'dequeue') {
      if (s.subStep === 'start') {
        setActiveLine(6); // if (isEmpty())
        setStatus('Checking if queue is empty...');
        s.subStep = 'execute';
      } else {
        if (queue.length === 0) { setStatus('Queue underflow!'); s.done = true; pause(); return; }
        const val = queue[0];
        setActiveLine(7); // return queue[front++]
        setHighlight(0);
        setTimeout(() => {
          setQueue((prev) => prev.slice(1));
          setHighlight(-1);
          setStatus(`Dequeued ${val} from front. Queue size: ${queue.length - 1}`);
        }, 400);
        s.done = true;
        pause();
      }
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
      codeLines={PSEUDO_CODE}
      activeLineIdx={activeLine}
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
      <div className="flex items-center gap-4 overflow-x-auto py-10 px-6 min-h-[150px] w-full justify-center">
        <div className="flex flex-col items-center gap-1 shrink-0">
          <span className="text-[10px] font-bold text-accent-green uppercase tracking-widest">Front</span>
          <div className="text-accent-green animate-bounce-horizontal">→</div>
        </div>
        
        <AnimatePresence>
          {queue.map((val, idx) => (
            <motion.div
              key={`${idx}-${val}`}
              initial={{ opacity: 0, x: 50, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -50, scale: 0.5 }}
              className={`w-20 h-20 rounded-2xl border-2 flex items-center justify-center text-base font-bold font-code shrink-0 transition-all duration-300 shadow-xl
                ${idx === 0 ? 'border-accent-green bg-accent-green/20' : ''}
                ${idx === queue.length - 1 ? 'border-accent-amber bg-accent-amber/20' : ''}
                ${idx !== 0 && idx !== queue.length - 1 ? 'border-border-color bg-bg-elevated' : ''}
                ${idx === highlight ? 'border-accent-primary bg-accent-primary/10 ring-4 ring-accent-primary/20' : ''}`}
            >
              {val}
            </motion.div>
          ))}
        </AnimatePresence>
 
        <div className="flex flex-col items-center gap-1 shrink-0">
          <span className="text-[10px] font-bold text-accent-amber uppercase tracking-widest">Rear</span>
          <div className="text-accent-amber animate-bounce-horizontal-reverse">←</div>
        </div>
 
        {queue.length === 0 && (
          <div className="text-sm text-text-muted italic bg-bg-elevated/50 px-6 py-3 rounded-xl border border-dashed border-border-color">
            Queue is empty
          </div>
        )}
      </div>
    </VisualizerPanel>
  );
}
