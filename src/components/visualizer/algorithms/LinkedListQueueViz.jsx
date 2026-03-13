import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import VisualizerPanel, { useVisualizerTimer } from '../VisualizerPanel';

const OPERATION_CODE = {
  enqueue: [
    'void enqueue(int val) {',
    '  Node* new = malloc(sizeof(Node));',
    '  new->data = val; new->next = NULL;',
    '  if (rear == NULL) { front = rear = new; }',
    '  else { rear->next = new; rear = new; }',
    '}'
  ],
  dequeue: [
    'void dequeue() {',
    '  if (front == NULL) return;',
    '  Node* ptr = front;',
    '  front = front->next;',
    '  if (front == NULL) rear = NULL;',
    '  free(ptr);',
    '}'
  ]
};

export default function LinkedListQueueViz() {
  const [nodes, setNodes] = useState([{id: 1, v: 10}, {id: 2, v: 20}]);
  const [highlightFront, setHighlightFront] = useState(0);
  const [highlightRear, setHighlightRear] = useState(1);
  const [operation, setOperation] = useState('enqueue');
  const [status, setStatus] = useState('Ready.');
  const [activeLine, setActiveLine] = useState(-1);
  
  const stepRef = useRef({ done: false, subStep: 0 });

  function reset() {
    setNodes([{id: 1, v: 10}, {id: 2, v: 20}]);
    setHighlightFront(0);
    setHighlightRear(1);
    stepRef.current = { done: false, subStep: 0 };
    setStatus('Ready.');
    setActiveLine(-1);
    pause();
  }

  const doStep = useCallback(() => {
    const s = stepRef.current;
    if (s.done) { pause(); return; }

    switch (operation) {
      case 'enqueue':
        if (s.subStep === 0) {
          setActiveLine(1);
          setStatus('Allocating node...');
          s.subStep = 1;
        } else if (s.subStep === 1) {
          setActiveLine(3);
          setStatus('Setting data and next pointer...');
          s.subStep = 2;
        } else if (s.subStep === 2) {
          setActiveLine(5);
          setStatus('rear->next = new; rear = new;');
          s.subStep = 3;
        } else {
          setActiveLine(0);
          const val = Math.floor(Math.random() * 90) + 10;
          const newNodes = [...nodes, { id: Date.now(), v: val }];
          setNodes(newNodes);
          setHighlightRear(newNodes.length - 1);
          setStatus(`Enqueued ${val} at the rear.`);
          s.done = true;
        }
        break;

      case 'dequeue':
        if (s.subStep === 0) {
          setActiveLine(2);
          if (nodes.length === 0) { setStatus('Underflow!'); s.done = true; return; }
          setStatus('ptr = front');
          s.subStep = 1;
        } else if (s.subStep === 1) {
          setActiveLine(4);
          setStatus('front = front->next');
          s.subStep = 2;
        } else {
          setActiveLine(6);
          const newNodes = nodes.slice(1);
          setNodes(newNodes);
          setHighlightRear(newNodes.length - 1);
          if (newNodes.length === 0) setHighlightFront(-1);
          setStatus('free(ptr). Node dequeued from front.');
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
      title="Linked List Queue Visualizer"
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
          }}
          className="bg-bg-elevated border border-border-color rounded px-1.5 py-1 text-xs text-text-primary outline-none ml-2"
        >
          <option value="enqueue">Enqueue</option>
          <option value="dequeue">Dequeue</option>
        </select>
      }
    >
      <div className="flex items-center gap-0 overflow-x-auto py-16 px-12 min-h-[160px] w-full items-start justify-center relative">
        {nodes.length === 0 && <div className="text-text-muted italic text-sm py-10">Queue is Empty</div>}
        <AnimatePresence mode="popLayout">
          {nodes.map((node, idx) => (
            <motion.div key={node.id} layout className="flex items-center shrink-0">
              <div 
                className={`flex border border-border-color rounded-lg overflow-hidden shadow-lg transition-all duration-300 relative ${
                  idx === highlightFront || idx === highlightRear ? 'ring-2' : ''
                } ${idx === highlightFront ? 'ring-accent-primary bg-accent-primary/5 z-10' : ''} ${
                  idx === highlightRear ? 'ring-accent-amber z-10' : ''
                } bg-bg-surface`}
              >
                {idx === highlightFront && (
                  <div className="absolute -top-10 left-0 text-accent-primary font-bold text-[9px] uppercase tracking-widest whitespace-nowrap bg-bg-surface/80 px-1 rounded">
                    FRONT ↓
                  </div>
                )}
                {idx === highlightRear && (
                  <div className="absolute -bottom-10 right-0 text-accent-amber font-bold text-[9px] uppercase tracking-widest whitespace-nowrap bg-bg-surface/80 px-1 rounded">
                    REAR ↑
                  </div>
                )}
                <div className="px-4 py-2 flex flex-col items-center min-w-[50px]">
                   <span className="text-[10px] text-text-muted mb-0.5 font-code">[{idx}]</span>
                   <span className="text-base font-bold font-code">{node.v}</span>
                </div>
                <div className="px-3 py-2 bg-bg-elevated/20 border-l border-border-color/30 flex items-center">
                   <div className="w-1.5 h-1.5 rounded-full bg-text-muted/40" />
                </div>
              </div>
              
              {idx < nodes.length - 1 && (
                <div className="w-10 h-full flex items-center justify-center relative">
                   <svg width="40" height="20" className="shrink-0 overflow-visible">
                      <line x1="0" y1="10" x2="34" y2="10" stroke="var(--accent-primary)" strokeWidth="2" strokeOpacity="0.4" markerEnd="url(#arrowhead)" />
                   </svg>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        
        <svg className="hidden">
           <defs>
              <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
                <polygon points="0 0, 8 3, 0 6" fill="var(--accent-primary)" opacity="0.6" />
              </marker>
           </defs>
        </svg>
      </div>
    </VisualizerPanel>
  );
}
