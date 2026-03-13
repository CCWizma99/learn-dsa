import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import VisualizerPanel, { useVisualizerTimer } from '../VisualizerPanel';

// Simple BST node
function createNode(val) {
  return { val, left: null, right: null };
}

function insertBST(root, val) {
  if (!root) return createNode(val);
  if (val < root.val) root.left = insertBST(root.left, val);
  else if (val > root.val) root.right = insertBST(root.right, val);
  return root;
}

function buildBST(values) {
  let root = null;
  for (const v of values) root = insertBST(root, v);
  return root;
}

// Get positions for rendering
function getPositions(node, x, y, dx, positions = []) {
  if (!node) return positions;
  positions.push({ val: node.val, x, y });
  if (node.left) {
    positions.push({ type: 'edge', x1: x, y1: y, x2: x - dx, y2: y + 50 });
    getPositions(node.left, x - dx, y + 50, dx * 0.55, positions);
  }
  if (node.right) {
    positions.push({ type: 'edge', x1: x, y1: y, x2: x + dx, y2: y + 50 });
    getPositions(node.right, x + dx, y + 50, dx * 0.55, positions);
  }
  return positions;
}

// Traversal orders
function inorder(node, result = []) {
  if (!node) return result;
  inorder(node.left, result);
  result.push(node.val);
  inorder(node.right, result);
  return result;
}
function preorder(node, result = []) {
  if (!node) return result;
  result.push(node.val);
  preorder(node.left, result);
  preorder(node.right, result);
  return result;
}
function postorder(node, result = []) {
  if (!node) return result;
  postorder(node.left, result);
  postorder(node.right, result);
  result.push(node.val);
  return result;
}

export default function BSTViz() {
  const [input, setInput] = useState('50,30,70,20,40,60,80');
  const [traversal, setTraversal] = useState('inorder');
  const [highlighted, setHighlighted] = useState(new Set());
  const [current, setCurrent] = useState(null);
  const [status, setStatus] = useState('Ready.');
  const stepRef = useRef({ idx: 0, order: [], done: false });

  const values = useMemo(() => input.split(',').map(Number).filter((n) => !isNaN(n)), [input]);
  const root = useMemo(() => buildBST(values), [values]);
  const positions = useMemo(() => getPositions(root, 150, 20, 60), [root]);

  function reset() {
    setHighlighted(new Set());
    setCurrent(null);
    const order = traversal === 'inorder' ? inorder(root) : traversal === 'preorder' ? preorder(root) : postorder(root);
    stepRef.current = { idx: 0, order, done: false };
    setStatus(`${traversal} traversal ready. Press Play.`);
    pause();
  }

  const doStep = useCallback(() => {
    const s = stepRef.current;
    if (s.done || s.idx >= s.order.length) {
      setStatus(`${traversal} traversal complete: [${s.order.join(', ')}]`);
      setCurrent(null);
      s.done = true;
      pause();
      return;
    }

    const val = s.order[s.idx];
    setCurrent(val);
    setHighlighted((prev) => new Set([...prev, val]));
    setStatus(`${traversal}: visiting ${val} (step ${s.idx + 1}/${s.order.length})`);
    s.idx++;
  }, [traversal]);

  const { isPlaying, play, pause } = useVisualizerTimer(600, doStep);

  useEffect(() => { reset(); }, [input, traversal]);

  return (
    <VisualizerPanel
      title="Binary Search Tree"
      inputLabel="Values"
      inputValue={input}
      onInputChange={setInput}
      onPlay={play}
      onPause={pause}
      onStep={doStep}
      onReset={reset}
      isPlaying={isPlaying}
      status={status}
      extraControls={
        <select
          value={traversal}
          onChange={(e) => setTraversal(e.target.value)}
          className="bg-bg-elevated border border-border-color rounded px-1.5 py-1 text-xs text-text-primary outline-none ml-2"
        >
          <option value="inorder">In-order</option>
          <option value="preorder">Pre-order</option>
          <option value="postorder">Post-order</option>
        </select>
      }
    >
      <svg width="300" height="220" viewBox="0 0 300 220" className="mx-auto">
        {/* Edges */}
        {positions
          .filter((p) => p.type === 'edge')
          .map((e, i) => (
            <line
              key={`edge-${i}`}
              x1={e.x1}
              y1={e.y1 + 12}
              x2={e.x2}
              y2={e.y2 - 12}
              stroke="var(--border)"
              strokeWidth="1.5"
            />
          ))}
        {/* Nodes */}
        {positions
          .filter((p) => !p.type)
          .map((n, i) => (
            <g key={`node-${i}`}>
              <circle
                cx={n.x}
                cy={n.y}
                r="14"
                fill={
                  n.val === current
                    ? 'var(--accent-amber)'
                    : highlighted.has(n.val)
                    ? 'var(--accent-green)'
                    : 'var(--bg-elevated)'
                }
                stroke={
                  n.val === current
                    ? 'var(--accent-amber)'
                    : highlighted.has(n.val)
                    ? 'var(--accent-green)'
                    : 'var(--accent-primary)'
                }
                strokeWidth="2"
                className="transition-all duration-300"
              />
              <text
                x={n.x}
                y={n.y + 4}
                textAnchor="middle"
                fill={n.val === current || highlighted.has(n.val) ? 'var(--bg-base)' : 'var(--text-primary)'}
                fontSize="10"
                fontFamily="JetBrains Mono"
              >
                {n.val}
              </text>
            </g>
          ))}
      </svg>
    </VisualizerPanel>
  );
}
