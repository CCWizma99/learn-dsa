import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import VisualizerPanel, { useVisualizerTimer } from '../VisualizerPanel';

const OPERATION_CODE = {
  forward: [
    'void traverse_forward(Node* head) {',
    '  Node* ptr = head;',
    '  while (ptr != NULL) {',
    '    // process ptr->data',
    '    ptr = ptr->next;',
    '  }',
    '}'
  ],
  backward: [
    'void traverse_backward(Node* tail) {',
    '  Node* ptr = tail;',
    '  while (ptr != NULL) {',
    '    // process ptr->data',
    '    ptr = ptr->prev;',
    '  }',
    '}'
  ],
  insert_beg: [
    'void insert_beg(int val) {',
    '  Node* new = (Node*)malloc(sizeof(Node));',
    '  new->data = val; new->prev = NULL;',
    '  new->next = start;',
    '  if (start != NULL) start->prev = new;',
    '  start = new;',
    '}'
  ],
  delete_node: [
    'void delete_node(int val) {',
    '  Node* ptr = start;',
    '  while (ptr->data != val) ptr = ptr->next;',
    '  ptr->prev->next = ptr->next;',
    '  if (ptr->next != NULL) ptr->next->prev = ptr->prev;',
    '  free(ptr);',
    '}'
  ]
};

export default function DoublyLinkedListViz() {
  const [nodes, setNodes] = useState([{id: 1, v: 10}, {id: 2, v: 20}, {id: 3, v: 30}]);
  const [highlight, setHighlight] = useState(-1);
  const [operation, setOperation] = useState('forward');
  const [status, setStatus] = useState('Ready.');
  const [activeLine, setActiveLine] = useState(-1);
  
  const stepRef = useRef({ idx: 0, done: false, subStep: 0 });

  function reset() {
    setNodes([{id: 1, v: 10}, {id: 2, v: 20}, {id: 3, v: 30}]);
    setHighlight(-1);
    stepRef.current = { idx: 0, done: false, subStep: 0 };
    setStatus('Doubly LL Reset.');
    setActiveLine(-1);
    pause();
  }

  const doStep = useCallback(() => {
    const s = stepRef.current;
    if (s.done) { pause(); return; }

    switch (operation) {
      case 'forward':
        if (s.subStep === 0) {
          setActiveLine(1);
          setHighlight(0);
          setStatus('ptr = head');
          s.subStep = 1;
        } else if (s.subStep === 1) {
          if (s.idx >= nodes.length) {
            setActiveLine(2);
            setHighlight(-1);
            setStatus('End of list.');
            s.done = true;
          } else {
            setActiveLine(3);
            setStatus(`At node ${nodes[s.idx].v}`);
            s.subStep = 2;
          }
        } else {
          setActiveLine(4);
          s.idx++;
          setHighlight(s.idx);
          s.subStep = 1;
        }
        break;

      case 'backward':
        if (s.subStep === 0) {
            setActiveLine(1);
            s.idx = nodes.length - 1;
            setHighlight(s.idx);
            setStatus('ptr = tail');
            s.subStep = 1;
          } else if (s.subStep === 1) {
            if (s.idx < 0) {
              setActiveLine(2);
              setHighlight(-1);
              setStatus('Reached start (NULL).');
              s.done = true;
            } else {
              setActiveLine(3);
              setStatus(`At node ${nodes[s.idx].v}`);
              s.subStep = 2;
            }
          } else {
            setActiveLine(4);
            s.idx--;
            setHighlight(s.idx);
            s.subStep = 1;
          }
          break;

      case 'insert_beg':
        if (s.subStep === 0) {
            setActiveLine(1);
            setStatus('Allocating node...');
            s.subStep = 1;
        } else if (s.subStep === 1) {
            setActiveLine(2);
            setStatus('new->prev = NULL');
            s.subStep = 2;
        } else if (s.subStep === 2) {
            setActiveLine(3);
            setStatus('new->next = start');
            s.subStep = 3;
        } else if (s.subStep === 3) {
            setActiveLine(4);
            setStatus('start->prev = new');
            s.subStep = 4;
        } else {
            setActiveLine(5);
            const val = Math.floor(Math.random() * 90) + 10;
            setNodes([{ id: Date.now(), v: val }, ...nodes]);
            setStatus(`Inserted ${val} at start.`);
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
      title="Doubly Linked List Visualizer"
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
            stepRef.current = { idx: 0, done: false, subStep: 0 }; 
            setHighlight(-1);
          }}
          className="bg-bg-elevated border border-border-color rounded px-1.5 py-1 text-xs text-text-primary outline-none ml-2"
        >
          <option value="forward">Forward Traverse</option>
          <option value="backward">Backward Traverse</option>
          <option value="insert_beg">Insert Beginning</option>
        </select>
      }
    >
      <div className="flex items-center gap-0 overflow-x-auto py-12 px-6 min-h-[160px] w-full items-start">
        <motion.div className="flex items-center shrink-0">
             <div className="px-3 py-1 bg-bg-surface border border-dashed border-border-color rounded text-[9px] text-text-muted italic">NULL</div>
             <div className="w-6 border-b border-border-color/30" />
        </motion.div>

        <AnimatePresence mode="popLayout">
          {nodes.map((node, idx) => (
            <motion.div key={node.id} layout className="flex items-center shrink-0">
              <div 
                className={`flex border border-border-color rounded-lg overflow-hidden shadow-lg transition-all duration-300 ${
                  idx === highlight ? 'ring-2 ring-accent-primary bg-accent-primary/10 -translate-y-1' : 'bg-bg-surface'
                }`}
              >
                <div className="px-2 py-2 bg-bg-elevated/20 border-r border-border-color/30 flex flex-col items-center">
                   <span className="text-[8px] text-text-muted uppercase font-bold">prev</span>
                   <div className="w-1 h-1 rounded-full bg-text-muted/40" />
                </div>
                <div className="px-4 py-2 flex flex-col items-center min-w-[50px]">
                   <span className="text-[10px] text-text-muted mb-0.5">data</span>
                   <span className="text-base font-bold font-code">{node.v}</span>
                </div>
                <div className="px-2 py-2 bg-bg-elevated/20 border-l border-border-color/30 flex flex-col items-center">
                   <span className="text-[8px] text-text-muted uppercase font-bold">next</span>
                   <div className="w-1 h-1 rounded-full bg-text-muted/40" />
                </div>
              </div>
              
              <div className="w-10 h-full flex flex-col items-center justify-center relative">
                 {/* Next Arrow */}
                 <svg width="40" height="10" className="shrink-0 overflow-visible">
                    <line x1="0" y1="5" x2="34" y2="5" stroke="var(--accent-primary)" strokeWidth="1.5" strokeOpacity="0.4" markerEnd="url(#arrowhead)" />
                 </svg>
                 {/* Prev Arrow */}
                 <svg width="40" height="10" className="shrink-0 overflow-visible mt-1">
                    <line x1="34" y1="5" x2="6" y2="5" stroke="var(--accent-amber)" strokeWidth="1.5" strokeOpacity="0.4" markerEnd="url(#arrowhead-prev)" />
                 </svg>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        <motion.div className="flex items-center shrink-0">
             <div className="w-6 border-b border-border-color/30" />
             <div className="px-3 py-1 bg-bg-surface border border-dashed border-border-color rounded text-[9px] text-text-muted italic">NULL</div>
        </motion.div>

        <svg className="hidden">
           <defs>
              <marker id="arrowhead" markerWidth="6" markerHeight="4" refX="5" refY="2" orient="auto">
                <polygon points="0 0, 6 2, 0 4" fill="var(--accent-primary)" opacity="0.6" />
              </marker>
              <marker id="arrowhead-prev" markerWidth="6" markerHeight="4" refX="5" refY="2" orient="auto">
                <polygon points="6 0, 0 2, 6 4" fill="var(--accent-amber)" opacity="0.6" />
              </marker>
           </defs>
        </svg>
      </div>
    </VisualizerPanel>
  );
}
