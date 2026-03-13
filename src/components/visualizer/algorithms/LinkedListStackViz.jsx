import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import VisualizerPanel, { useVisualizerTimer } from '../VisualizerPanel';

const OPERATION_CODE = {
  push: [
    'void push(int val) {',
    '  Node* new = malloc(sizeof(Node));',
    '  new->data = val;',
    '  new->next = top;',
    '  top = new;',
    '}'
  ],
  pop: [
    'void pop() {',
    '  if (top == NULL) return;',
    '  Node* ptr = top;',
    '  top = top->next;',
    '  free(ptr);',
    '}'
  ]
};

export default function LinkedListStackViz() {
  const [nodes, setNodes] = useState([{id: 1, v: 30}, {id: 2, v: 20}, {id: 3, v: 10}]);
  const [highlight, setHighlight] = useState(-1);
  const [operation, setOperation] = useState('push');
  const [status, setStatus] = useState('Ready.');
  const [activeLine, setActiveLine] = useState(-1);
  
  const stepRef = useRef({ done: false, subStep: 0 });

  function reset() {
    setNodes([{id: 1, v: 30}, {id: 2, v: 20}, {id: 3, v: 10}]);
    setHighlight(-1);
    stepRef.current = { done: false, subStep: 0 };
    setStatus('Ready.');
    setActiveLine(-1);
    pause();
  }

  const doStep = useCallback(() => {
    const s = stepRef.current;
    if (s.done) { pause(); return; }

    switch (operation) {
      case 'push':
        if (s.subStep === 0) {
          setActiveLine(1);
          setStatus('Allocating new node...');
          s.subStep = 1;
        } else if (s.subStep === 1) {
          setActiveLine(2);
          setStatus('Setting data...');
          s.subStep = 2;
        } else if (s.subStep === 2) {
          setActiveLine(3);
          setStatus('new->next = top');
          s.subStep = 3;
        } else {
          setActiveLine(4);
          const val = Math.floor(Math.random() * 90) + 10;
          setNodes([{ id: Date.now(), v: val }, ...nodes]);
          setStatus(`Pushed ${val} onto stack (at top).`);
          s.done = true;
        }
        break;

      case 'pop':
        if (s.subStep === 0) {
          setActiveLine(1);
          if (nodes.length === 0) { setStatus('Underflow!'); s.done = true; return; }
          s.subStep = 1;
        } else if (s.subStep === 1) {
          setActiveLine(2);
          setHighlight(0);
          setStatus('ptr = top');
          s.subStep = 2;
        } else if (s.subStep === 2) {
          setActiveLine(3);
          setStatus('top = top->next');
          s.subStep = 3;
        } else {
          setActiveLine(4);
          setNodes(nodes.slice(1));
          setHighlight(-1);
          setStatus('free(ptr). Node popped.');
          s.done = true;
        }
        break;

      default:
        s.done = true;
        pause();
    }
  }, [nodes, operation]);

  const { isPlaying, play, pause } = useVisualizerTimer(800, doStep);

  return (
    <VisualizerPanel
      title="Linked List Stack Visualizer"
      inputValue=""
      onPlay={play}
      onPause={pause}
      onStep={doStep}
      onReset={reset}
      isPlaying={isPlaying}
      status={status}
      codeLines={OPERATION_CODE[operation] || []}
      activeLineIdx={activeLine}
      extraControls={
        <select
          value={operation}
          onChange={(e) => { 
            setOperation(e.target.value); 
            stepRef.current = { done: false, subStep: 0 }; 
            setHighlight(-1);
          }}
          className="bg-bg-elevated border border-border-color rounded px-1.5 py-1 text-xs text-text-primary outline-none ml-2"
        >
          <option value="push">Push</option>
          <option value="pop">Pop</option>
        </select>
      }
    >
      <div className="flex flex-col items-center gap-2 py-10 overflow-y-auto max-h-[300px] w-full px-16 relative">
        {nodes.length === 0 && <div className="text-text-muted italic text-sm py-10">Stack is Empty</div>}
        <AnimatePresence mode="popLayout">
          {nodes.map((node, idx) => (
            <motion.div 
              key={node.id} 
              layout 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.5, x: 20 }}
              className="flex flex-col items-center"
            >
              <div 
                className={`flex border border-border-color rounded-lg overflow-hidden shadow-lg w-24 relative ${
                  idx === 0 ? 'ring-2 ring-accent-primary z-10' : ''
                } ${idx === highlight ? 'bg-accent-primary/20 scale-105' : 'bg-bg-surface'}`}
              >
                {idx === 0 && (
                   <div className="absolute -left-14 top-1/2 -translate-y-1/2 text-accent-primary font-bold text-[9px] tracking-widest animate-pulse whitespace-nowrap">
                      TOP →
                   </div>
                )}
                <div className="flex-1 px-3 py-2 text-center border-r border-border-color/30 font-code font-bold">
                   {node.v}
                </div>
                <div className="w-6 bg-bg-elevated/20 flex items-center justify-center">
                   <div className="w-1.5 h-1.5 rounded-full bg-text-muted/40" />
                </div>
              </div>
              {idx < nodes.length - 1 && (
                <div className="h-6 w-0.5 bg-accent-primary/30 relative">
                   <div className="absolute bottom-0 left-1/2 -translate-x-1/2 border-t-4 border-l-4 border-r-4 border-transparent border-t-accent-primary/50" />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        {nodes.length > 0 && <div className="text-[10px] text-text-muted font-bold mt-2 uppercase">Bottom (NULL)</div>}
      </div>
    </VisualizerPanel>
  );
}
