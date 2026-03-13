import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import VisualizerPanel, { useVisualizerTimer } from '../VisualizerPanel';

const PSEUDO_CODE = [
  'void push(int val) {',
  '  if (top >= MAX - 1) return;',
  '  stack[++top] = val;',
  '}',
  '',
  'int pop() {',
  '  if (top < 0) return -1;',
  '  return stack[top--];',
  '}'
];

export default function StackViz() {
  const [input, setInput] = useState('10,20,30');
  const [stack, setStack] = useState([10, 20, 30]);
  const [highlight, setHighlight] = useState(-1);
  const [operation, setOperation] = useState('push');
  const [status, setStatus] = useState('Ready.');
  const [activeLine, setActiveLine] = useState(-1);
  const stepRef = useRef({ done: false, subStep: 'start' });

  function reset() {
    const nums = input.split(',').map(Number).filter((n) => !isNaN(n));
    setStack([...nums]);
    setHighlight(-1);
    setActiveLine(-1);
    stepRef.current = { done: false, subStep: 'start' };
    setStatus(`Stack (bottom→top): [${nums.join(', ')}]. Top = ${nums[nums.length - 1] || 'empty'}`);
    pause();
  }

  const doStep = useCallback(() => {
    const s = stepRef.current;
    if (s.done) { pause(); return; }

    if (operation === 'push') {
      if (s.subStep === 'start') {
        setActiveLine(1); // if (top >= MAX - 1)
        setStatus('Checking if stack is full...');
        s.subStep = 'execute';
      } else {
        const val = Math.floor(Math.random() * 90) + 10;
        setActiveLine(2); // stack[++top] = val
        setStack((prev) => [...prev, val]);
        setHighlight(stack.length);
        setStatus(`Pushed ${val}. Stack size: ${stack.length + 1}`);
        s.done = true;
        pause();
      }
    } else if (operation === 'pop') {
      if (s.subStep === 'start') {
        setActiveLine(6); // if (top < 0)
        setStatus('Checking if stack is empty...');
        s.subStep = 'execute';
      } else {
        if (stack.length === 0) { 
          setStatus('Stack underflow! Empty.'); 
          s.done = true; 
          pause(); 
          return; 
        }
        const val = stack[stack.length - 1];
        setActiveLine(7); // return stack[top--]
        setHighlight(stack.length - 1);
        setTimeout(() => {
          setStack((prev) => prev.slice(0, -1));
          setHighlight(-1);
          setStatus(`Popped ${val}. Stack size: ${stack.length - 1}`);
        }, 400);
        s.done = true;
        pause();
      }
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
      codeLines={PSEUDO_CODE}
      activeLineIdx={activeLine}
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
      <div className="flex flex-col-reverse items-center gap-3 min-h-[300px] justify-start py-6 w-full max-w-xs mx-auto">
        {stack.length === 0 && (
          <div className="text-sm text-text-muted italic bg-bg-elevated/50 px-4 py-2 rounded-lg border border-dashed border-border-color">
            Stack is empty
          </div>
        )}
        <AnimatePresence>
          {stack.map((val, idx) => (
            <motion.div
              key={`${idx}-${val}`}
              initial={{ opacity: 0, y: -50, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5, y: -20 }}
              className={`w-40 px-6 py-4 rounded-xl border-2 text-center text-sm font-bold font-code transition-all duration-300 relative shadow-lg
                ${idx === stack.length - 1 
                  ? 'border-accent-primary bg-accent-primary/20 text-text-primary shadow-accent-primary/20 scale-105' 
                  : 'border-border-color bg-bg-elevated text-text-primary/80'}
                ${idx === highlight ? 'border-accent-amber bg-accent-amber/20 shadow-accent-amber/30' : ''}`}
            >
              {val}
              {idx === stack.length - 1 && (
                <div className="absolute -right-24 top-1/2 -translate-y-1/2 flex items-center gap-2">
                  <span className="text-accent-primary animate-bounce-horizontal">←</span>
                  <span className="bg-accent-primary text-white text-[10px] px-2 py-0.5 rounded-full font-bold tracking-widest">TOP</span>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </VisualizerPanel>
  );
}
