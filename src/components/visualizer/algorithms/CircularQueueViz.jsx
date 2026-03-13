import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import VisualizerPanel, { useVisualizerTimer } from '../VisualizerPanel';

const SIZE = 6;
const PSEUDO_CODE = [
  'void enqueue(int val) {',
  '  if ((rear + 1) % SIZE == front)',
  '    return; // Full',
  '  if (front == -1) front = 0;',
  '  rear = (rear + 1) % SIZE;',
  '  items[rear] = val;',
  '}',
  '',
  'int dequeue() {',
  '  if (front == -1) return -1;',
  '  val = items[front];',
  '  if (front == rear) front = rear = -1;',
  '  else front = (front + 1) % SIZE;',
  '  return val;',
  '}'
];

export default function CircularQueueViz() {
  const [queue, setQueue] = useState(new Array(SIZE).fill(null));
  const [front, setFront] = useState(-1);
  const [rear, setRear] = useState(-1);
  const [status, setStatus] = useState('Front = -1, Rear = -1');
  const [activeLine, setActiveLine] = useState(-1);
  const [operation, setOperation] = useState('enqueue');
  const stepRef = useRef({ done: false, subStep: 0 });

  const reset = () => {
    setQueue(new Array(SIZE).fill(null));
    setFront(-1);
    setRear(-1);
    setStatus('Reset. Front = -1, Rear = -1');
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
        setStatus('Checking if full: (rear + 1) % SIZE == front?');
        if (front !== -1 && (rear + 1) % SIZE === front) {
          setStatus('Queue Overflow! Full.');
          s.done = true;
          return;
        }
        s.subStep = 1;
      } else if (s.subStep === 1) {
        setActiveLine(3);
        if (front === -1) {
            setStatus('Empty queue, initializing front = 0');
            setFront(0);
        }
        s.subStep = 2;
      } else {
        setActiveLine(4);
        const nextRear = (rear + 1) % SIZE;
        const val = Math.floor(Math.random() * 90) + 10;
        setRear(nextRear);
        setQueue(prev => {
          const next = [...prev];
          next[nextRear] = val;
          return next;
        });
        setStatus(`Enqueued ${val} at index ${nextRear}. REAR = (${rear} + 1) % ${SIZE} = ${nextRear}`);
        s.done = true;
      }
    } else {
      // Dequeue
      if (s.subStep === 0) {
        setActiveLine(9);
        if (front === -1) {
          setStatus('Queue Underflow! Empty.');
          s.done = true;
          return;
        }
        setActiveLine(11);
        setStatus(`Dequeuing ${queue[front]} from index ${front}`);
        s.subStep = 1;
      } else {
        setActiveLine(12);
        if (front === rear) {
          setStatus('Last element removed, resetting pointers.');
          setFront(-1);
          setRear(-1);
        } else {
          const nextFront = (front + 1) % SIZE;
          setFront(nextFront);
          setStatus(`Moved Front to (${front} + 1) % ${SIZE} = ${nextFront}`);
        }
        setQueue(prev => {
          const next = [...prev];
          next[front === -1 ? 0 : front] = null; // Clean up visuals for the slot
          return next;
        });
        s.done = true;
      }
    }
  }, [queue, front, rear, operation]);

  const { isPlaying, play, pause } = useVisualizerTimer(800, doStep);

  return (
    <VisualizerPanel
      title="Circular Queue (Array Wraparound)"
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
          <option value="enqueue">Enqueue</option>
          <option value="dequeue">Dequeue</option>
        </select>
      }
    >
      <div className="relative w-full h-[300px] flex items-center justify-center p-4">
        {/* Circular Layout */}
        <div className="relative w-48 h-48 border-8 border-bg-elevated rounded-full">
          {queue.map((val, idx) => {
            const angle = (idx / SIZE) * 360 - 90;
            const x = Math.cos((angle * Math.PI) / 180) * 100;
            const y = Math.sin((angle * Math.PI) / 180) * 100;
            
            const isFront = idx === front;
            const isRear = idx === rear;

            return (
              <div
                key={idx}
                className="absolute"
                style={{
                  left: `calc(50% + ${x}px)`,
                  top: `calc(50% + ${y}px)`,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                {/* Pointer Indicators */}
                <div className="absolute -inset-12 pointer-events-none flex flex-col items-center justify-center gap-1">
                    {isFront && (
                        <div className="bg-accent-green text-white text-[8px] px-1.5 py-0.5 rounded-full font-bold animate-bounce">FRONT</div>
                    )}
                    {isRear && (
                        <div className="bg-accent-amber text-white text-[8px] px-1.5 py-0.5 rounded-full font-bold animate-bounce-reverse">REAR</div>
                    )}
                </div>

                {/* Node Box */}
                <motion.div
                  layout
                  className={`w-14 h-14 rounded-xl border-2 flex items-center justify-center font-code font-bold text-sm shadow-lg transition-colors
                    ${val === null ? 'border-border-color/30 bg-bg-base/20 text-text-muted/30' : 'border-accent-primary bg-accent-primary/10 text-text-primary'}
                    ${isFront ? 'ring-2 ring-accent-green' : ''}
                    ${isRear ? 'ring-2 ring-accent-amber' : ''}
                  `}
                >
                  {val !== null ? val : idx}
                </motion.div>
                <div className="text-[8px] text-center mt-1 text-text-muted font-bold opacity-30">[{idx}]</div>
              </div>
            );
          })}
        </div>
      </div>
    </VisualizerPanel>
  );
}
