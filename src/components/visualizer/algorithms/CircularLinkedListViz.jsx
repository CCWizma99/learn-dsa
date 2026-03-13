import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import VisualizerPanel, { useVisualizerTimer } from '../VisualizerPanel';

const OPERATION_CODE = {
  traverse: [
    'void traverse_circular(Node* start) {',
    '  Node* ptr = start;',
    '  do {',
    '    // process ptr->data',
    '    ptr = ptr->next;',
    '  } while (ptr != start);',
    '}'
  ],
  insert_beg: [
    'void insert_beg(int val) {',
    '  Node* new = malloc(sizeof(Node));',
    '  Node* temp = start;',
    '  while (temp->next != start) temp = temp->next;',
    '  new->data = val; new->next = start;',
    '  temp->next = new; start = new;',
    '}'
  ]
};

export default function CircularLinkedListViz() {
  const [nodes, setNodes] = useState([{id: 1, v: 10}, {id: 2, v: 20}, {id: 3, v: 30}]);
  const [highlight, setHighlight] = useState(-1);
  const [operation, setOperation] = useState('traverse');
  const [status, setStatus] = useState('Ready.');
  const [activeLine, setActiveLine] = useState(-1);
  
  const stepRef = useRef({ idx: 0, done: false, subStep: 0, loopCount: 0 });

  function reset() {
    setNodes([{id: 1, v: 10}, {id: 2, v: 20}, {id: 3, v: 30}]);
    setHighlight(-1);
    stepRef.current = { idx: 0, done: false, subStep: 0, loopCount: 0 };
    setStatus('Circular LL Reset.');
    setActiveLine(-1);
    pause();
  }

  const doStep = useCallback(() => {
    const s = stepRef.current;
    if (s.done) { pause(); return; }

    switch (operation) {
      case 'traverse':
        if (s.subStep === 0) {
          setActiveLine(1);
          setHighlight(0);
          setStatus('ptr = start');
          s.subStep = 1;
        } else if (s.subStep === 1) {
            setActiveLine(3);
            setStatus(`Processing node ${nodes[s.idx].v}`);
            s.subStep = 2;
        } else if (s.subStep === 2) {
          setActiveLine(4);
          s.idx = (s.idx + 1) % nodes.length;
          setHighlight(s.idx);
          setStatus('ptr = ptr->next');
          s.subStep = 3;
        } else {
           setActiveLine(5);
           if (s.idx === 0) {
               s.loopCount++;
               if (s.loopCount >= 2) {
                   setStatus('Traversed twice. Circular loop confirmed.');
                   s.done = true;
               } else {
                   setStatus('ptr reached start. Beginning next loop...');
                   s.subStep = 1;
               }
           } else {
               s.subStep = 1;
           }
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
      title="Circular Linked List Visualizer"
      inputValue=""
      onPlay={play}
      onPause={pause}
      onStep={doStep}
      onReset={reset}
      isPlaying={isPlaying}
      status={status}
      codeLines={OPERATION_CODE[operation] || []}
      activeLineIdx={activeLine}
    >
      <div className="flex items-center gap-0 overflow-x-auto py-12 px-6 min-h-[160px] w-full items-start justify-center">
        <AnimatePresence mode="popLayout">
          {nodes.map((node, idx) => (
            <motion.div key={node.id} layout className="flex items-center shrink-0">
              <div 
                className={`flex border border-border-color rounded-lg overflow-hidden shadow-lg transition-all duration-300 ${
                  idx === highlight ? 'ring-2 ring-accent-primary bg-accent-primary/10 -translate-y-1' : 'bg-bg-surface'
                }`}
              >
                <div className="px-4 py-2 flex flex-col items-center min-w-[50px]">
                   <span className="text-[10px] text-text-muted mb-0.5">data</span>
                   <span className="text-base font-bold font-code">{node.v}</span>
                </div>
                <div className="px-3 py-2 bg-bg-elevated/20 border-l border-border-color/30 flex flex-col items-center justify-center">
                   <span className="text-[9px] font-bold text-text-muted">next</span>
                   <div className="w-1.5 h-1.5 rounded-full bg-text-muted/40" />
                </div>
              </div>
              
              <div className="w-10 h-full flex items-center justify-center relative">
                 <svg width="40" height="20" className="shrink-0 overflow-visible">
                    <line x1="0" y1="10" x2="34" y2="10" stroke="var(--accent-primary)" strokeWidth="2" strokeOpacity="0.4" markerEnd="url(#arrowhead)" />
                 </svg>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {/* The Circular Link */}
        <div className="absolute top-[80px] left-1/2 -translate-x-1/2 w-[80%] h-12 border-b-2 border-l-2 border-r-2 border-accent-primary/30 rounded-b-3xl pointer-events-none">
           <div className="absolute top-0 right-[-10px] w-4 h-4 text-accent-primary/40">
             <svg width="20" height="20" viewBox="0 0 20 20">
                <path d="M 0 0 L 10 0" stroke="currentColor" fill="none" strokeWidth="2" />
             </svg>
           </div>
           <div className="absolute bottom-[-10px] left-1/2 -translate-x-1/2 bg-bg-surface px-2 text-[8px] font-bold text-accent-primary/60 uppercase tracking-widest">
              Circular Connect (Tail → Head)
           </div>
        </div>

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
