import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import VisualizerPanel, { useVisualizerTimer } from '../VisualizerPanel';

const OPERATION_CODE = {
  traverse: [
    'void traverse(struct Node* head) {',
    '  struct Node* ptr = head;',
    '  while (ptr != NULL) {',
    '    // process ptr->data',
    '    ptr = ptr->next;',
    '  }',
    '}'
  ],
  search: [
    'Node* search(int val) {',
    '  Node* ptr = start;',
    '  while (ptr != NULL) {',
    '    if (ptr->data == val) return ptr;',
    '    ptr = ptr->next;',
    '  }',
    '  return NULL;',
    '}'
  ],
  insert_beg: [
    'void insert_beg(int val) {',
    '  Node* new = (Node*)malloc(sizeof(Node));',
    '  new->data = val;',
    '  new->next = start;',
    '  start = new;',
    '}'
  ],
  insert_end: [
    'void insert_end(int val) {',
    '  Node* new = (Node*)malloc(sizeof(Node));',
    '  new->data = val; new->next = NULL;',
    '  Node* ptr = start;',
    '  while (ptr->next != NULL) ptr = ptr->next;',
    '  ptr->next = new;',
    '}'
  ],
  insert_after: [
    'void insert_after(int val, int after) {',
    '  Node* ptr = start;',
    '  while (ptr->data != after) ptr = ptr->next;',
    '  Node* new = (Node*)malloc(sizeof(Node));',
    '  new->data = val; new->next = ptr->next;',
    '  ptr->next = new;',
    '}'
  ],
  insert_before: [
    'void insert_before(int val, int before) {',
    '  Node* ptr = start; Node* preptr = NULL;',
    '  while (ptr->data != before) {',
    '    preptr = ptr; ptr = ptr->next;',
    '  }',
    '  Node* new = (Node*)malloc(sizeof(Node));',
    '  new->data = val; new->next = ptr;',
    '  preptr->next = new;',
    '}'
  ],
  delete_beg: [
    'void delete_beg() {',
    '  Node* ptr = start;',
    '  start = start->next;',
    '  free(ptr);',
    '}'
  ],
  delete_end: [
    'void delete_end() {',
    '  Node* ptr = start; Node* preptr = NULL;',
    '  while (ptr->next != NULL) {',
    '    preptr = ptr; ptr = ptr->next;',
    '  }',
    '  preptr->next = NULL;',
    '  free(ptr);',
    '}'
  ],
  delete_node: [
    'void delete_node(int val) {',
    '  Node* ptr = start; Node* preptr = NULL;',
    '  while (ptr->data != val) {',
    '    preptr = ptr; ptr = ptr->next;',
    '  }',
    '  preptr->next = ptr->next;',
    '  free(ptr);',
    '}'
  ],
  delete_after: [
    'void delete_after(int val) {',
    '  Node* preptr = start;',
    '  while (preptr->data != val) preptr = preptr->next;',
    '  Node* ptr = preptr->next;',
    '  preptr->next = ptr->next;',
    '  free(ptr);',
    '}'
  ]
};

export default function LinkedListViz() {
  const [input, setInput] = useState('10,20,30,40');
  const [nodes, setNodes] = useState([]); // [{id, value}]
  const [highlight, setHighlight] = useState(-1);
  const [preptrHighlight, setPreptrHighlight] = useState(-1);
  const [operation, setOperation] = useState('traverse');
  const [status, setStatus] = useState('Ready.');
  const [activeLine, setActiveLine] = useState(-1);
  const [searchValue, setSearchValue] = useState('30');
  
  const stepRef = useRef({ idx: 0, preIdx: -1, done: false, subStep: 0 });

  function reset() {
    const nums = input.split(',').map(Number).filter((n) => !isNaN(n));
    setNodes(nums.map((v, i) => ({ id: i, value: v })));
    setHighlight(-1);
    setPreptrHighlight(-1);
    stepRef.current = { idx: 0, preIdx: -1, done: false, subStep: 0 };
    setStatus('Linked List Reset.');
    setActiveLine(-1);
    pause();
  }

  const doStep = useCallback(() => {
    const s = stepRef.current;
    if (s.done) { pause(); return; }

    const currentNodes = [...nodes];

    switch (operation) {
      case 'traverse':
        if (s.subStep === 0) {
          setActiveLine(1); // ptr = head
          setHighlight(0);
          setStatus('ptr = start');
          s.subStep = 1;
        } else if (s.subStep === 1) {
          if (s.idx >= nodes.length) {
            setActiveLine(2); // while(ptr != NULL) -> false
            setHighlight(-1);
            setStatus('ptr is NULL. Traversal complete.');
            s.done = true;
          } else {
            setActiveLine(3); // process ptr->data
            setStatus(`Processing data: ${nodes[s.idx].value}`);
            s.subStep = 2;
          }
        } else {
          setActiveLine(4); // ptr = ptr->next
          s.idx++;
          setHighlight(s.idx);
          setStatus('ptr = ptr->next');
          s.subStep = 1;
        }
        break;

      case 'search':
        const target = parseInt(searchValue);
        if (s.subStep === 0) {
          setActiveLine(1);
          setHighlight(0);
          setStatus('ptr = start');
          s.subStep = 1;
        } else if (s.subStep === 1) {
          if (s.idx >= nodes.length) {
            setActiveLine(2);
            setStatus('Value not found. return NULL');
            setHighlight(-1);
            s.done = true;
          } else {
            setActiveLine(3);
            if (nodes[s.idx].value === target) {
              setStatus(`Found! ${target} at index ${s.idx}`);
              s.done = true;
            } else {
              setStatus(`${nodes[s.idx].value} != ${target}`);
              s.subStep = 2;
            }
          }
        } else {
          setActiveLine(4);
          s.idx++;
          setHighlight(s.idx);
          s.subStep = 1;
        }
        break;

      case 'insert_beg':
        if (s.subStep === 0) {
          setActiveLine(1);
          setStatus('Allocating memory for new node...');
          s.subStep = 1;
        } else if (s.subStep === 1) {
          setActiveLine(2);
          setStatus('Setting new->data = val');
          s.subStep = 2;
        } else if (s.subStep === 2) {
          setActiveLine(3);
          setStatus('Setting new->next = start');
          s.subStep = 3;
        } else {
          setActiveLine(4);
          const val = Math.floor(Math.random() * 90) + 10;
          setNodes([{ id: Date.now(), value: val }, ...nodes]);
          setStatus(`Inserted ${val} at the beginning.`);
          s.done = true;
        }
        break;

      case 'insert_end':
        if (s.subStep === 0) {
          setActiveLine(1);
          setStatus('Allocating new node...');
          s.subStep = 1;
        } else if (s.subStep === 1) {
          setActiveLine(4);
          setHighlight(0);
          setStatus('ptr = start');
          s.subStep = 2;
        } else if (s.subStep === 2) {
          if (s.idx < nodes.length - 1) {
            setActiveLine(5);
            s.idx++;
            setHighlight(s.idx);
            setStatus('ptr = ptr->next');
          } else {
            setActiveLine(6);
            const val = Math.floor(Math.random() * 90) + 10;
            setNodes([...nodes, { id: Date.now(), value: val }]);
            setStatus(`Inserted ${val} at the end.`);
            s.done = true;
          }
        }
        break;

      case 'delete_beg':
        if (s.subStep === 0) {
          setActiveLine(1);
          setHighlight(0);
          setStatus('ptr = start');
          s.subStep = 1;
        } else if (s.subStep === 1) {
          setActiveLine(2);
          setStatus('start = start->next');
          s.subStep = 2;
        } else {
          setActiveLine(3);
          const val = nodes[0].value;
          setNodes(nodes.slice(1));
          setHighlight(-1);
          setStatus(`Deleted head node (${val}).`);
          s.done = true;
        }
        break;

      case 'insert_after':
        const afterVal = parseInt(searchValue);
        if (s.subStep === 0) {
          setActiveLine(1);
          setHighlight(0);
          setStatus('ptr = start');
          s.subStep = 1;
        } else if (s.subStep === 1) {
          if (s.idx >= nodes.length) {
            setStatus('Value not found.');
            s.done = true;
          } else {
            setActiveLine(2); // while(ptr->data != after)
            if (nodes[s.idx].value === afterVal) {
              s.subStep = 2;
              setStatus(`Found ${afterVal}!`);
            } else {
              s.idx++;
              setHighlight(s.idx);
            }
          }
        } else if (s.subStep === 2) {
          setActiveLine(3); // Node* new = ...
          setStatus('Allocating new node...');
          s.subStep = 3;
        } else if (s.subStep === 3) {
          setActiveLine(4); // new->data = val
          s.subStep = 4;
        } else if (s.subStep === 4) {
          setActiveLine(5); // new->next = ptr->next
          s.subStep = 5;
        } else {
          setActiveLine(6); // ptr->next = new
          const val = Math.floor(Math.random() * 90) + 10;
          const newNodes = [...nodes];
          newNodes.splice(s.idx + 1, 0, { id: Date.now(), value: val });
          setNodes(newNodes);
          setStatus(`Inserted ${val} after ${afterVal}.`);
          s.done = true;
        }
        break;

      case 'insert_before':
        const beforeVal = parseInt(searchValue);
        if (s.subStep === 0) {
          setActiveLine(1);
          setHighlight(0);
          setPreptrHighlight(-1);
          setStatus('ptr = start; preptr = NULL');
          s.subStep = 1;
        } else if (s.subStep === 1) {
          if (s.idx >= nodes.length) {
            setStatus('Value not found.');
            s.done = true;
          } else {
            setActiveLine(2);
            if (nodes[s.idx].value === beforeVal) {
              s.subStep = 3;
              setStatus(`Found ${beforeVal}!`);
            } else {
              s.subStep = 2;
            }
          }
        } else if (s.subStep === 2) {
          setActiveLine(3);
          s.preIdx = s.idx;
          s.idx++;
          setHighlight(s.idx);
          setPreptrHighlight(s.preIdx);
          setStatus('preptr = ptr; ptr = ptr->next');
          s.subStep = 1;
        } else if (s.subStep === 3) {
          setActiveLine(5); // Node* new = ...
          s.subStep = 4;
        } else if (s.subStep === 4) {
          setActiveLine(6); // new->data = val...
          s.subStep = 5;
        } else {
          setActiveLine(7); // preptr->next = new
          const val = Math.floor(Math.random() * 90) + 10;
          const newNodes = [...nodes];
          newNodes.splice(s.idx, 0, { id: Date.now(), value: val });
          setNodes(newNodes);
          setStatus(`Inserted ${val} before ${beforeVal}.`);
          s.done = true;
        }
        break;

      case 'delete_node':
        const delVal = parseInt(searchValue);
        if (s.subStep === 0) {
          setActiveLine(1);
          setHighlight(0);
          setStatus('ptr = start; preptr = NULL');
          s.subStep = 1;
        } else if (s.subStep === 1) {
          if (s.idx >= nodes.length) {
            setStatus('Value not found.');
            s.done = true;
          } else {
            setActiveLine(2);
            if (nodes[s.idx].value === delVal) {
              s.subStep = 3;
              setStatus(`Found ${delVal} to delete!`);
            } else {
              s.subStep = 2;
            }
          }
        } else if (s.subStep === 2) {
          setActiveLine(3);
          s.preIdx = s.idx;
          s.idx++;
          setHighlight(s.idx);
          setPreptrHighlight(s.preIdx);
          setStatus('preptr = ptr; ptr = ptr->next');
          s.subStep = 1;
        } else {
          setActiveLine(4); // preptr->next = ptr->next
          setNodes(nodes.filter((_, i) => i !== s.idx));
          setStatus(`Deleted node with value ${delVal}. free(ptr)`);
          s.done = true;
        }
        break;

      case 'delete_after':
        const afterDelVal = parseInt(searchValue);
        if (s.subStep === 0) {
          setActiveLine(1);
          setHighlight(0);
          setStatus('preptr = start');
          s.subStep = 1;
        } else if (s.subStep === 1) {
          if (s.idx >= nodes.length) {
            setStatus('Value not found.');
            s.done = true;
          } else {
            setActiveLine(2);
            if (nodes[s.idx].value === afterDelVal) {
              if (s.idx === nodes.length - 1) {
                setStatus('No node exists after this value.');
                s.done = true;
              } else {
                s.subStep = 2;
                setStatus(`Found ${afterDelVal}!`);
              }
            } else {
              s.idx++;
              setHighlight(s.idx);
            }
          }
        } else if (s.subStep === 2) {
          setActiveLine(3); // ptr = preptr->next
          s.preIdx = s.idx;
          s.idx++;
          setPreptrHighlight(s.preIdx);
          setHighlight(s.idx);
          setStatus('ptr = preptr->next');
          s.subStep = 3;
        } else if (s.subStep === 3) {
          setActiveLine(4); // preptr->next = ptr->next
          setStatus('preptr->next = ptr->next');
          s.subStep = 4;
        } else {
          setActiveLine(5);
          setNodes(nodes.filter((_, i) => i !== s.idx));
          setHighlight(-1);
          setStatus('free(ptr). Node after deleted.');
          s.done = true;
        }
        break;

      default:
        setStatus('Operation logic active.');
        s.done = true;
        pause();
    }
  }, [nodes, operation, searchValue]);

  const { isPlaying, play, pause } = useVisualizerTimer(700, doStep);

  useEffect(() => { reset(); }, []);

  return (
    <VisualizerPanel
      title="Singly Linked List Visualizer"
      inputLabel="Initial Values"
      inputValue={input}
      onInputChange={setInput}
      onPlay={play}
      onPause={pause}
      onStep={doStep}
      onReset={reset}
      isPlaying={isPlaying}
      status={status}
      codeLines={OPERATION_CODE[operation] || []}
      activeLineIdx={activeLine}
      extraControls={
        <div className="flex items-center gap-2 ml-2">
          <select
            value={operation}
            onChange={(e) => { 
              setOperation(e.target.value); 
              stepRef.current = { idx: 0, preIdx: -1, done: false, subStep: 0 }; 
              setHighlight(-1);
              setPreptrHighlight(-1);
            }}
            className="bg-bg-elevated border border-border-color rounded px-1.5 py-1 text-xs text-text-primary outline-none"
          >
            <option value="traverse">Traverse</option>
            <option value="search">Search</option>
            <option value="insert_beg">Insert Beginning</option>
            <option value="insert_end">Insert End</option>
            <option value="insert_after">Insert After</option>
            <option value="insert_before">Insert Before</option>
            <option value="delete_beg">Delete Beginning</option>
            <option value="delete_end">Delete End</option>
            <option value="delete_node">Delete Node</option>
            <option value="delete_after">Delete After</option>
          </select>
          {(operation === 'search' || operation.includes('_after') || operation.includes('_before') || operation === 'delete_node') && (
             <div className="flex items-center gap-1">
               <span className="text-[10px] text-text-muted">Target:</span>
               <input 
                 type="text" 
                 value={searchValue} 
                 onChange={(e) => setSearchValue(e.target.value)}
                 className="w-10 bg-bg-surface border border-border-color rounded px-1 py-1 text-xs text-text-primary outline-none"
                 placeholder="Val"
               />
             </div>
          )}
        </div>
      }
    >
      <div className="flex items-center gap-0 overflow-x-auto py-12 px-6 min-h-[160px] w-full items-start">
        <AnimatePresence mode="popLayout">
          {nodes.map((node, idx) => (
            <motion.div 
              key={node.id} 
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="flex items-center shrink-0"
            >
              <div
                className={`flex items-center border border-border-color rounded-lg transition-all duration-300 shadow-lg ${
                  idx === highlight
                    ? 'ring-2 ring-accent-primary bg-accent-primary/10 -translate-y-1'
                    : idx === preptrHighlight
                    ? 'ring-2 ring-accent-amber bg-accent-amber/5 -translate-y-1'
                    : 'bg-bg-surface'
                }`}
              >
                <div className="flex flex-col">
                   <div className="px-4 py-2 border-r border-border-color/50 flex flex-col items-center">
                      <span className="text-[10px] text-text-muted mb-0.5 font-semibold uppercase tracking-widest leading-none">data</span>
                      <span className="text-base font-bold font-code text-text-primary">{node.value}</span>
                   </div>
                   {idx === highlight && (
                     <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-accent-primary text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-glow animate-bounce">
                        PTR
                     </div>
                   )}
                   {idx === preptrHighlight && (
                     <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-accent-amber text-black text-[9px] font-bold px-1.5 py-0.5 rounded shadow-glow">
                        PREPTR
                     </div>
                   )}
                </div>
                <div className="px-3 py-2 bg-bg-elevated/30 flex flex-col items-center justify-center">
                  <span className="text-[9px] font-bold text-text-muted uppercase tracking-tighter mb-0.5">next</span>
                  <div className="w-1.5 h-1.5 rounded-full bg-text-muted/50" />
                </div>
              </div>
              
              <div className="w-10 h-full flex items-center justify-center relative">
                <svg width="40" height="20" className="shrink-0 overflow-visible">
                  <defs>
                    <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
                      <polygon points="0 0, 8 3, 0 6" fill="var(--accent-primary)" opacity="0.6" />
                    </marker>
                  </defs>
                  <motion.line 
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    x1="0" y1="10" x2="34" y2="10" 
                    stroke="var(--accent-primary)" 
                    strokeWidth="2" 
                    strokeOpacity="0.4"
                    markerEnd="url(#arrowhead)" 
                  />
                </svg>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <motion.div 
          layout
          className="px-4 py-2 rounded-lg text-xs font-bold font-code text-text-muted bg-bg-surface border border-dashed border-border-color shrink-0 shadow flex flex-col items-center"
        >
          <span className="text-[9px] opacity-50 mb-0.5 uppercase">Null</span>
          /
        </motion.div>
      </div>
    </VisualizerPanel>
  );
}
