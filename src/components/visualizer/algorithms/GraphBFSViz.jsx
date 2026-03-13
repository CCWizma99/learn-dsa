import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import VisualizerPanel, { useVisualizerTimer } from '../VisualizerPanel';

// Default graph adjacency
const DEFAULT_EDGES = '0-1,0-2,1-3,1-4,2-5,3-6,4-5';
const NODE_COUNT = 7;

function parseGraph(edgesStr, nodeCount) {
  const adj = Array.from({ length: nodeCount }, () => []);
  edgesStr.split(',').forEach((e) => {
    const [a, b] = e.trim().split('-').map(Number);
    if (!isNaN(a) && !isNaN(b) && a < nodeCount && b < nodeCount) {
      if (!adj[a].includes(b)) adj[a].push(b);
      if (!adj[b].includes(a)) adj[b].push(a);
    }
  });
  return adj;
}

// Positions for nodes in a circle
function getNodePositions(count, cx = 250, cy = 180, r = 140) {
  return Array.from({ length: count }, (_, i) => {
    const angle = (2 * Math.PI * i) / count - Math.PI / 2;
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
  });
}

const PSEUDO_CODE = [
  'void bfs(int start_node) {',
  '  enqueue(start_node);',
  '  visited[start_node] = true;',
  '  while (!isEmpty(queue)) {',
  '    int u = dequeue();',
  '    for (int v : neighbors[u]) {',
  '      if (!visited[v]) {',
  '        visited[v] = true;',
  '        enqueue(v);',
  '      }',
  '    }',
  '  }',
  '}'
];

export default function GraphBFSViz() {
  const [input, setInput] = useState(DEFAULT_EDGES);
  const [nodeCount, setNodeCount] = useState(NODE_COUNT);
  const [startNode, setStartNode] = useState(0);
  const [visited, setVisited] = useState(new Set());
  const [inQueue, setInQueue] = useState(new Set());
  const [currentNode, setCurrentNode] = useState(null);
  const [bfsQueue, setBfsQueue] = useState([]);
  const [status, setStatus] = useState('Ready. Press Play.');
  const [activeLine, setActiveLine] = useState(-1);
  const stateRef = useRef({ queue: [], visited: new Set(), done: false, subStep: 'start' });

  const adj = useMemo(() => parseGraph(input, nodeCount), [input, nodeCount]);
  const positions = useMemo(() => getNodePositions(nodeCount), [nodeCount]);

  function reset() {
    setVisited(new Set());
    setInQueue(new Set());
    setCurrentNode(null);
    setBfsQueue([]);
    setActiveLine(-1);
    stateRef.current = { queue: [startNode], visited: new Set(), done: false, subStep: 'start' };
    setStatus(`BFS from node ${startNode}. Press Play.`);
    pause();
  }

  const doStep = useCallback(() => {
    const s = stateRef.current;
    if (s.done) { pause(); return; }

    if (s.subStep === 'start') {
      setActiveLine(1); // enqueue(start)
      s.subStep = 'loop';
      setStatus(`Starting BFS: adding node ${startNode} to queue.`);
      return;
    }

    if (s.queue.length === 0) {
      setActiveLine(3); // while (!isEmpty) -> false
      setStatus(`BFS complete. Visited: [${[...s.visited].join(', ')}]`);
      setCurrentNode(null);
      s.done = true;
      pause();
      return;
    }

    setActiveLine(3); // while (!isEmpty) -> true
    
    setTimeout(() => {
      setActiveLine(4); // int u = dequeue()
      const node = s.queue.shift();
      setCurrentNode(node);
      
      if (s.visited.has(node)) {
        setStatus(`Node ${node} already visited, skipping.`);
        return;
      }

      setActiveLine(6); // if (!visited[v])
      s.visited.add(node);
      setVisited(new Set(s.visited));

      // Add unvisited neighbors to queue
      const neighbors = adj[node] || [];
      const newInQueue = new Set();
      for (const nb of neighbors) {
        if (!s.visited.has(nb) && !s.queue.includes(nb)) {
          setActiveLine(8); // enqueue(v)
          s.queue.push(nb);
        }
        if (!s.visited.has(nb)) newInQueue.add(nb);
      }

      setInQueue(new Set(s.queue));
      setBfsQueue([...s.queue]);
      setStatus(`Visiting node ${node}. Neighbors added to queue.`);
    }, 100);

  }, [adj, startNode]);

  const { isPlaying, play, pause } = useVisualizerTimer(700, doStep);

  useEffect(() => { reset(); }, [input, startNode, nodeCount]);

  return (
    <VisualizerPanel
      title="Graph BFS"
      inputLabel="Edges"
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
        <div className="flex items-center gap-1 ml-2">
          <label className="text-[10px] text-text-muted">Start:</label>
          <input
            type="number"
            min="0"
            max={nodeCount - 1}
            value={startNode}
            onChange={(e) => setStartNode(Number(e.target.value))}
            className="w-10 bg-bg-elevated border border-border-color rounded px-1 py-1 text-xs text-text-primary outline-none"
          />
        </div>
      }
    >
      <svg width="500" height="360" viewBox="0 0 500 360" className="mx-auto drop-shadow-xl">
        {/* Edges */}
        {adj.map((neighbors, from) =>
          neighbors
            .filter((to) => to > from)
            .map((to) => (
              <line
                key={`${from}-${to}`}
                x1={positions[from].x}
                y1={positions[from].y}
                x2={positions[to].x}
                y2={positions[to].y}
                stroke="var(--border)"
                strokeWidth="3"
                className="opacity-40"
              />
            ))
        )}
        {/* Nodes */}
        {positions.map((pos, idx) => {
          let fill = 'var(--bg-elevated)';
          let stroke = 'var(--text-muted)';
          if (idx === currentNode) {
            fill = 'var(--accent-amber)';
            stroke = 'var(--accent-amber)';
          } else if (visited.has(idx)) {
            fill = 'var(--accent-green)';
            stroke = 'var(--accent-green)';
          } else if (inQueue.has(idx)) {
            fill = 'var(--accent-primary)';
            stroke = 'var(--accent-primary)';
          }
 
          return (
            <g key={idx} className="cursor-pointer transition-all duration-300">
              <circle
                cx={pos.x}
                cy={pos.y}
                r="24"
                fill={fill}
                stroke={stroke}
                strokeWidth="3"
                className="transition-all duration-300 shadow-lg"
              />
              <text
                x={pos.x}
                y={pos.y + 6}
                textAnchor="middle"
                fill={
                  visited.has(idx) || idx === currentNode || inQueue.has(idx)
                    ? 'var(--bg-base)'
                    : 'var(--text-primary)'
                }
                fontSize="14"
                fontWeight="bold"
                fontFamily="JetBrains Mono"
              >
                {idx}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Queue visualization */}
      <div className="mt-2 flex items-center gap-1 px-2">
        <span className="text-[9px] text-text-muted shrink-0">Queue:</span>
        {bfsQueue.length === 0 ? (
          <span className="text-[9px] text-text-muted italic">empty</span>
        ) : (
          bfsQueue.map((n, i) => (
            <span
              key={i}
              className="px-1.5 py-0.5 rounded text-[9px] font-code bg-accent-primary/10 text-accent-primary border border-accent-primary/20"
            >
              {n}
            </span>
          ))
        )}
      </div>

      {/* Legend */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-6 px-4 py-3 bg-bg-elevated/20 rounded-2xl border border-border-color/50">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full shadow-md" style={{ background: 'var(--bg-elevated)', border: '2px solid var(--text-muted)' }} />
          <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider">Unvisited</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full shadow-md" style={{ background: 'var(--accent-primary)' }} />
          <span className="text-[11px] font-bold text-text-primary uppercase tracking-wider">In Queue</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full shadow-md" style={{ background: 'var(--accent-amber)' }} />
          <span className="text-[11px] font-bold text-text-primary uppercase tracking-wider">Current</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full shadow-md" style={{ background: 'var(--accent-green)' }} />
          <span className="text-[11px] font-bold text-text-primary uppercase tracking-wider">Visited</span>
        </div>
      </div>
    </VisualizerPanel>
  );
}
