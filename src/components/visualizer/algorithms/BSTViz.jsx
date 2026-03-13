import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import VisualizerPanel, { useVisualizerTimer } from '../VisualizerPanel';

const PSEUDO_CODE = {
  search: [
    'searchElement(TREE, VAL) {',
    '  IF TREE->DATA == VAL OR TREE == NULL',
    '    Return TREE',
    '  ELSE',
    '    IF VAL < TREE->DATA',
    '      Return searchElement(TREE->LEFT, VAL)',
    '    ELSE',
    '      Return searchElement(TREE->RIGHT, VAL)',
    '}'
  ],
  insert: [
    'Insert(TREE, VAL) {',
    '  IF TREE == NULL',
    '    Allocate Node; TREE->DATA = VAL',
    '    TREE->LEFT = TREE->RIGHT = NULL',
    '  ELSE',
    '    IF VAL < TREE->DATA',
    '      Insert(TREE->LEFT, VAL)',
    '    ELSE',
    '      Insert(TREE->RIGHT, VAL)',
    '}'
  ],
  delete: [
    'Delete(TREE, VAL) {',
    '  IF TREE == NULL',
    '    Write "VAL not found"',
    '  ELSE IF VAL < TREE->DATA',
    '    Delete(TREE->LEFT, VAL)',
    '  ELSE IF VAL > TREE->DATA',
    '    Delete(TREE->RIGHT, VAL)',
    '  ELSE IF TREE->LEFT AND TREE->RIGHT',
    '    SET TEMP = findLargestNode(TREE->LEFT)',
    '    SET TREE->DATA = TEMP->DATA',
    '    Delete(TREE->LEFT, TEMP->DATA)',
    '  ELSE ... (Case 1 & 2 handled)',
    '}'
  ],
  preorder: [
    'PREORDER(TREE) {',
    '  IF TREE != NULL',
    '    Write TREE->DATA',
    '    PREORDER(TREE->LEFT)',
    '    PREORDER(TREE->RIGHT)',
    '  END IF',
    '}'
  ],
  inorder: [
    'INORDER(TREE) {',
    '  IF TREE != NULL',
    '    INORDER(TREE->LEFT)',
    '    Write TREE->DATA',
    '    INORDER(TREE->RIGHT)',
    '  END IF',
    '}'
  ],
  postorder: [
    'POSTORDER(TREE) {',
    '  IF TREE != NULL',
    '    POSTORDER(TREE->LEFT)',
    '    POSTORDER(TREE->RIGHT)',
    '    Write TREE->DATA',
    '  END IF',
    '}'
  ],
  levelorder: [
    'breadth-first-traversal {',
    '  put root node onto a queue',
    '  while queue is not empty',
    '    dequeue next node',
    '    visit node',
    '    enqueue left child node',
    '    enqueue right child node',
    '}'
  ],
  mirror: [
    'MirrorImage(TREE) {',
    '  IF TREE != NULL',
    '    MirrorImage(TREE->LEFT)',
    '    MirrorImage(TREE->RIGHT)',
    '    SET TEMP = TREE->LEFT',
    '    TREE->LEFT = TREE->RIGHT',
    '    TREE->RIGHT = TEMP',
    '  END IF',
    '}'
  ],
  min: [
    'findMin(TREE) {',
    '  IF TREE == NULL return NULL',
    '  ELSE IF TREE->LEFT == NULL return TREE',
    '  Return findMin(TREE->LEFT)',
    '}'
  ],
  max: [
    'findMax(TREE) {',
    '  IF TREE != NULL',
    '    WHILE TREE->RIGHT != NULL',
    '      TREE = TREE->RIGHT',
    '    Return TREE',
    '}'
  ]
};

// Tree Logic Functions
function createNode(val, id = Math.random()) {
  return { val, id, left: null, right: null };
}

function insertBST(root, val) {
  if (!root) return createNode(val);
  if (val < root.val) root.left = insertBST(root.left, val);
  else if (val > root.val) root.right = insertBST(root.right, val);
  return root;
}

function getPositions(node, x, y, dx, dy, positions = []) {
  if (!node) return positions;
  positions.push({ val: node.val, id: node.id, x, y });
  if (node.left) {
    positions.push({ type: 'edge', x1: x, y1: y, x2: x - dx, y2: y + dy, id: `e-${node.id}-l` });
    getPositions(node.left, x - dx, y + dy, dx * 0.5, dy, positions);
  }
  if (node.right) {
    positions.push({ type: 'edge', x1: x, y1: y, x2: x + dx, y2: y + dy, id: `e-${node.id}-r` });
    getPositions(node.right, x + dx, y + dy, dx * 0.5, dy, positions);
  }
  return positions;
}

export default function BSTViz() {
  const [tree, setTree] = useState(() => {
    let root = createNode(50, 'root');
    [30, 70, 20, 40, 60, 80].forEach(v => insertBST(root, v));
    return root;
  });
  
  const [operation, setOperation] = useState('inorder');
  const [targetVal, setTargetVal] = useState('');
  const [highlight, setHighlight] = useState(null);
  const [activeLine, setActiveLine] = useState(-1);
  const [status, setStatus] = useState('Ready.');
  const [visitOrder, setVisitOrder] = useState([]);
  
  const stepRef = useRef({ 
    queue: [], 
    subStep: 0, 
    currNode: null, 
    done: false,
    traversalResult: [] 
  });

  const positions = useMemo(() => getPositions(tree, 250, 40, 100, 70), [tree]);

  function reset() {
    setHighlight(null);
    setActiveLine(-1);
    setVisitOrder([]);
    stepRef.current = { queue: [], subStep: 0, currNode: null, done: false, traversalResult: [] };
    setStatus('Reset.');
    pause();
  }

  const doStep = useCallback(() => {
    const s = stepRef.current;
    if (s.done) { pause(); return; }

    const inorder = (node, result = []) => {
      if (!node) return result;
      inorder(node.left, result); result.push(node.val); inorder(node.right, result);
      return result;
    };
    const preorder = (node, result = []) => {
      if (!node) return result;
      result.push(node.val); preorder(node.left, result); preorder(node.right, result);
      return result;
    };
    const postorder = (node, result = []) => {
      if (!node) return result;
      postorder(node.left, result); postorder(node.right, result); result.push(node.val);
      return result;
    };
    const getLevelOrder = (root) => {
      if (!root) return [];
      const queue = [root], res = [];
      while(queue.length) {
        let n = queue.shift(); res.push(n.val);
        if(n.left) queue.push(n.left); if(n.right) queue.push(n.right);
      }
      return res;
    };

    switch (operation) {
      case 'inorder':
      case 'preorder':
      case 'postorder':
      case 'levelorder':
        if (s.traversalResult.length === 0) {
          if (operation === 'levelorder') s.traversalResult = getLevelOrder(tree);
          else s.traversalResult = operation === 'inorder' ? inorder(tree) : operation === 'preorder' ? preorder(tree) : postorder(tree);
          s.subStep = 1;
        }
        if (s.subStep >= s.traversalResult.length) {
          setStatus(`${operation.toUpperCase()} Complete!`); 
          s.done = true;
          setHighlight(null);
          setActiveLine(-1);
        } else {
          const v = s.traversalResult[s.subStep];
          setHighlight(v);
          setVisitOrder(prev => [...prev, v]);
          setStatus(`Visiting ${v}...`);
          s.subStep++;
          setActiveLine(operation === 'levelorder' ? 3 : 2); 
        }
        break;

      case 'search':
        if (!targetVal) { setStatus('Enter value to search!'); s.done = true; return; }
        if (s.subStep === 0) { s.currNode = tree; setHighlight(tree.val); setStatus('Searching from root...'); s.subStep = 1; setActiveLine(1); }
        else {
          const target = parseInt(targetVal);
          if (s.currNode.val === target) { setStatus(`Found ${target}!`); s.done = true; setActiveLine(2); }
          else if (target < s.currNode.val) {
            if (s.currNode.left) { s.currNode = s.currNode.left; setHighlight(s.currNode.val); setStatus(`Target ${target} < ${s.currNode.val}. Moving Left.`); setActiveLine(5); }
            else { setStatus(`${target} not found.`); s.done = true; setHighlight(null); }
          } else {
            if (s.currNode.right) { s.currNode = s.currNode.right; setHighlight(s.currNode.val); setStatus(`Target ${target} > ${s.currNode.val}. Moving Right.`); setActiveLine(7); }
            else { setStatus(`${target} not found.`); s.done = true; setHighlight(null); }
          }
        }
        break;

      case 'insert':
         if (!targetVal) { setStatus('Enter value to insert!'); s.done = true; return; }
         const val = parseInt(targetVal);
         setTree(prev => {
            const newTree = JSON.parse(JSON.stringify(prev));
            insertBST(newTree, val);
            return newTree;
         });
         setStatus(`Inserted ${val}.`);
         s.done = true;
         break;

      case 'mirror':
         const mirrorTree = (node) => {
            if (!node) return null;
            const left = mirrorTree(node.left);
            const right = mirrorTree(node.right);
            node.left = right;
            node.right = left;
            return node;
         };
         setTree(prev => mirrorTree(JSON.parse(JSON.stringify(prev))));
         setStatus('Tree Mirrored.');
         s.done = true;
         break;

      case 'delete':
         if (!targetVal) { setStatus('Enter value to delete!'); s.done = true; return; }
         const delVal = parseInt(targetVal);
         const deleteNodeHelper = (root, key) => {
            if (!root) return null;
            if (key < root.val) root.left = deleteNodeHelper(root.left, key);
            else if (key > root.val) root.right = deleteNodeHelper(root.right, key);
            else {
               if (!root.left) return root.right;
               if (!root.right) return root.left;
               let tempNode = root.left;
               while (tempNode.right) tempNode = tempNode.right;
               root.val = tempNode.val;
               root.left = deleteNodeHelper(root.left, tempNode.val);
            }
            return root;
         };
         setTree(prev => deleteNodeHelper(JSON.parse(JSON.stringify(prev)), delVal));
         setStatus(`Deleted ${delVal}.`);
         s.done = true;
         break;

      case 'min':
         if (s.subStep === 0) { s.currNode = tree; setHighlight(tree.val); setStatus('Finding Min (Go Left)...'); s.subStep = 1; setActiveLine(2); }
         else {
            if (s.currNode.left) { s.currNode = s.currNode.left; setHighlight(s.currNode.val); setStatus('Moving Left...'); setActiveLine(4); }
            else { setStatus(`Minimum is ${s.currNode.val}`); s.done = true; setActiveLine(3); }
         }
         break;

      case 'max':
         if (s.subStep === 0) { s.currNode = tree; setHighlight(tree.val); setStatus('Finding Max (Go Right)...'); s.subStep = 1; setActiveLine(2); }
         else {
            if (s.currNode.right) { s.currNode = s.currNode.right; setHighlight(s.currNode.val); setStatus('Moving Right...'); setActiveLine(3); }
            else { setStatus(`Maximum is ${s.currNode.val}`); s.done = true; setActiveLine(4); }
         }
         break;

      default:
        s.done = true;
        pause();
    }
  }, [tree, operation, targetVal]);

  const { isPlaying, play, pause } = useVisualizerTimer(800, doStep);

  return (
    <VisualizerPanel
      title="Binary Search Tree Visualizer"
      inputValue={targetVal}
      onInputChange={setTargetVal}
      inputLabel="Target (VAL)"
      onPlay={play}
      onPause={pause}
      onStep={doStep}
      onReset={reset}
      isPlaying={isPlaying}
      status={status}
      codeLines={PSEUDO_CODE[operation] || []}
      activeLineIdx={activeLine}
      extraControls={
        <select
          value={operation}
          onChange={(e) => { setOperation(e.target.value); reset(); }}
          className="bg-bg-elevated border border-border-color rounded px-1.5 py-1 text-xs text-text-primary outline-none ml-2"
        >
          <option value="inorder">In-order (LKR)</option>
          <option value="preorder">Pre-order (KLR)</option>
           <option value="postorder">Post-order (LRK)</option>
          <option value="levelorder">Level-order (BFS)</option>
          <option value="search">Search Element</option>
          <option value="insert">Insert Node</option>
          <option value="delete">Delete Node</option>
          <option value="mirror">Mirror Tree</option>
          <option value="min">Find Min</option>
          <option value="max">Find Max</option>
        </select>
      }
    >
      <div className="relative w-full h-[400px] bg-bg-base/30 rounded-lg overflow-hidden flex items-center justify-center p-4">
        <svg width="500" height="350" viewBox="0 0 500 350" className="drop-shadow-2xl overflow-visible">
          <AnimatePresence>
            {/* Edges */}
            {positions.filter(p => p.type === 'edge').map(e => (
              <motion.line
                key={e.id}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.3 }}
                exit={{ opacity: 0 }}
                x1={e.x1} y1={e.y1 + 15}
                x2={e.x2} y2={e.y2 - 15}
                stroke="var(--accent-primary)"
                strokeWidth="2"
              />
            ))}
            {/* Nodes */}
            {positions.filter(p => !p.type).map(n => (
              <motion.g
                key={n.id}
                layout
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className="cursor-pointer"
              >
                <circle
                  cx={n.x} cy={n.y} r="20"
                  fill={n.val === highlight ? 'var(--accent-amber)' : 'var(--bg-elevated)'}
                  stroke={n.val === highlight ? 'var(--accent-amber)' : 'var(--accent-primary)'}
                  strokeWidth="2"
                  className="transition-colors duration-300"
                />
                <text
                  x={n.x} y={n.y + 5}
                  textAnchor="middle"
                  fill={n.val === highlight ? 'var(--bg-base)' : 'var(--text-primary)'}
                  fontSize="12" fontWeight="bold" className="font-code pointer-events-none"
                >
                  {n.val}
                </text>
              </motion.g>
            ))}
          </AnimatePresence>
        </svg>
        
        {visitOrder.length > 0 && (
          <div className="absolute bottom-4 left-4 right-4 bg-bg-surface/50 border border-border-color p-2 rounded text-[10px] font-code flex gap-2 flex-wrap">
             <span className="text-accent-primary font-bold">VISIT:</span>
             {visitOrder.map((v, i) => (
                <span key={i} className="px-1.5 py-0.5 bg-accent-primary/20 rounded">{v}</span>
             ))}
          </div>
        )}
      </div>
    </VisualizerPanel>
  );
}
