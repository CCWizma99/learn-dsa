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
function getNodePositions(count, cx = 140, cy = 100, r = 70) {
  return Array.from({ length: count }, (_, i) => {
    const angle = (2 * Math.PI * i) / count - Math.PI / 2;
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
  });
}

export default function GraphBFSViz() {
  const [input, setInput] = useState(DEFAULT_EDGES);
  const [nodeCount, setNodeCount] = useState(NODE_COUNT);
  const [startNode, setStartNode] = useState(0);
  const [visited, setVisited] = useState(new Set());
  const [inQueue, setInQueue] = useState(new Set());
  const [currentNode, setCurrentNode] = useState(null);
  const [bfsQueue, setBfsQueue] = useState([]);
  const [status, setStatus] = useState('Ready. Press Play.');
  const stateRef = useRef({ queue: [], visited: new Set(), done: false });

  const adj = useMemo(() => parseGraph(input, nodeCount), [input, nodeCount]);
  const positions = useMemo(() => getNodePositions(nodeCount), [nodeCount]);

  function reset() {
    setVisited(new Set());
    setInQueue(new Set());
    setCurrentNode(null);
    setBfsQueue([]);
    stateRef.current = { queue: [startNode], visited: new Set(), done: false };
    setStatus(`BFS from node ${startNode}. Press Play.`);
    pause();
  }

  const doStep = useCallback(() => {
    const s = stateRef.current;
    if (s.done || s.queue.length === 0) {
      setStatus(`BFS complete. Visited: [${[...s.visited].join(', ')}]`);
      setCurrentNode(null);
      s.done = true;
      pause();
      return;
    }

    const node = s.queue.shift();

    if (s.visited.has(node)) {
      return;
    }

    s.visited.add(node);
    setCurrentNode(node);
    setVisited(new Set(s.visited));

    // Add unvisited neighbors to queue
    const neighbors = adj[node] || [];
    const newInQueue = new Set();
    for (const nb of neighbors) {
      if (!s.visited.has(nb) && !s.queue.includes(nb)) {
        s.queue.push(nb);
      }
      if (!s.visited.has(nb)) newInQueue.add(nb);
    }

    setInQueue(new Set(s.queue));
    setBfsQueue([...s.queue]);
    setStatus(`Visiting node ${node}. Queue: [${s.queue.join(', ')}]`);
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
      <svg width="280" height="200" viewBox="0 0 280 200" className="mx-auto">
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
                strokeWidth="1.5"
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
            <g key={idx}>
              <circle
                cx={pos.x}
                cy={pos.y}
                r="16"
                fill={fill}
                stroke={stroke}
                strokeWidth="2"
                className="transition-all duration-300"
              />
              <text
                x={pos.x}
                y={pos.y + 4}
                textAnchor="middle"
                fill={
                  visited.has(idx) || idx === currentNode || inQueue.has(idx)
                    ? 'var(--bg-base)'
                    : 'var(--text-primary)'
                }
                fontSize="11"
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
      <div className="mt-2 flex items-center gap-3 px-2">
        <div className="flex items-center gap-1">
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: 'var(--bg-elevated)' }} />
          <span className="text-[8px] text-text-muted">Unvisited</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: 'var(--accent-primary)' }} />
          <span className="text-[8px] text-text-muted">In Queue</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: 'var(--accent-amber)' }} />
          <span className="text-[8px] text-text-muted">Current</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: 'var(--accent-green)' }} />
          <span className="text-[8px] text-text-muted">Visited</span>
        </div>
      </div>
    </VisualizerPanel>
  );
}
