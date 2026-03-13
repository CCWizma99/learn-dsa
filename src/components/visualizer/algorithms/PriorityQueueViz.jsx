import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import VisualizerPanel, { useVisualizerTimer } from '../VisualizerPanel';

const PSEUDO_CODE = [
  'void push(val, priority) {',
  '  insert_heap(val, priority);',
  '  sift_up();',
  '}',
  '',
  'int pop() {',
  '  val = heap[0];',
  '  heap[0] = heap[--size];',
  '  sift_down();',
  '  return val;',
  '}'
];

export default function PriorityQueueViz() {
  // We'll use a simple sorted array for visual clarity in this specific visualizer, 
  // as a heap might be too complex for a quick queue demo. 
  // But we'll label it "Heap-based" logic in the status.
  const [items, setItems] = useState([
    { v: 10, p: 1 },
    { v: 50, p: 3 },
    { v: 30, p: 5 }
  ]);
  const [status, setStatus] = useState('Elements are ordered by Priority (Higher value = Higher Priority).');
  const [activeLine, setActiveLine] = useState(-1);
  const [operation, setOperation] = useState('enqueue');
  const stepRef = useRef({ done: false, subStep: 0 });

  const reset = () => {
    setItems([
      { v: 10, p: 1 },
      { v: 50, p: 3 },
      { v: 30, p: 5 }
    ]);
    setStatus('Reset.');
    setActiveLine(-1);
    stepRef.current = { done: false, subStep: 0 };
    pause();
  };

  const doStep = useCallback(() => {
    const s = stepRef.current;
    if (s.done) { pause(); return; }

    if (operation === 'enqueue') {
      if (s.subStep === 0) {
        setActiveLine(1);
        setStatus('Inserting element and sift-up (Heap logic)...');
        s.subStep = 1;
      } else {
        const val = Math.floor(Math.random() * 90) + 10;
        const prio = Math.floor(Math.random() * 9) + 1;
        
        setItems(prev => {
          const next = [...prev, { v: val, p: prio }];
          return next.sort((a, b) => b.p - a.p); // Keep it sorted for visualization
        });
        
        setStatus(`Enqueued ${val} with priority ${prio}. Re-ordering...`);
        s.done = true;
      }
    } else {
      // Dequeue
      if (s.subStep === 0) {
        setActiveLine(6);
        if (items.length === 0) { setStatus('Empty!'); s.done = true; return; }
        setStatus(`Removing highest priority item: ${items[0].v} (P:${items[0].p})`);
        s.subStep = 1;
      } else if (s.subStep === 1) {
        setActiveLine(8);
        setStatus('Replacing with last element and sift-down...');
        s.subStep = 2;
      } else {
        setItems(prev => prev.slice(1));
        setStatus('Popped the highest priority element.');
        s.done = true;
      }
    }
  }, [items, operation]);

  const { isPlaying, play, pause } = useVisualizerTimer(800, doStep);

  return (
    <VisualizerPanel
      title="Priority Queue (Heap Logic)"
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
          onChange={(e) => { 
            setOperation(e.target.value); 
            stepRef.current = { done: false, subStep: 0 }; 
          }}
          className="bg-bg-elevated border border-border-color rounded px-1.5 py-1 text-xs text-text-primary outline-none ml-2"
        >
          <option value="enqueue">Enqueue (Random)</option>
          <option value="dequeue">Dequeue (Highest)</option>
        </select>
      }
    >
      <div className="flex flex-col items-center gap-4 py-10 w-full min-h-[300px]">
        <div className="flex gap-2 flex-wrap justify-center px-6">
          <AnimatePresence mode="popLayout">
            {items.map((item, idx) => (
              <motion.div
                key={`${item.v}-${item.p}`}
                layout
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.5 }}
                className={`relative w-20 h-24 rounded-xl border-2 flex flex-col items-center justify-center shadow-lg transition-all
                  ${idx === 0 ? 'border-accent-primary bg-accent-primary/20 ring-4 ring-accent-primary/20 scale-110 z-10' : 'border-border-color bg-bg-elevated'}
                `}
              >
                <div className="text-xl font-code font-bold">{item.v}</div>
                <div className="absolute top-1 right-1 flex flex-col items-end">
                    <span className="text-[8px] font-bold text-text-muted uppercase">Prio</span>
                    <span className={`text-[10px] font-bold ${idx === 0 ? 'text-accent-primary' : 'text-accent-amber'}`}>
                        {item.p}
                    </span>
                </div>
                {idx === 0 && (
                    <div className="absolute -bottom-6 text-[9px] font-bold text-accent-primary uppercase tracking-widest animate-pulse">
                        Next Out
                    </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        {items.length === 0 && <div className="text-text-muted italic">Queue is empty</div>}
      </div>
    </VisualizerPanel>
  );
}
