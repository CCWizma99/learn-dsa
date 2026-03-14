import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Grid3X3, List, Layers, Plus, Trash2 } from 'lucide-react';

const INITIAL_NODES = [0, 1, 2, 3];
const INITIAL_EDGES = [
  { from: 0, to: 1 },
  { from: 0, to: 2 },
  { from: 1, to: 3 },
  { from: 2, to: 3 }
];

export default function GraphRepresentationViz() {
  const [nodes, setNodes] = useState(INITIAL_NODES);
  const [edges, setEdges] = useState(INITIAL_EDGES);
  const [activeTab, setActiveTab] = useState('matrix'); // 'matrix', 'list', 'incidence'

  // Positions for small square layout
  const positions = {
    0: { x: 50, y: 50 },
    1: { x: 150, y: 50 },
    2: { x: 50, y: 150 },
    3: { x: 150, y: 150 }
  };

  const adjMatrix = useMemo(() => {
    const size = nodes.length;
    const matrix = Array.from({ length: size }, () => Array(size).fill(0));
    edges.forEach(e => {
      matrix[e.from][e.to] = 1;
      matrix[e.to][e.from] = 1; // Undirected
    });
    return matrix;
  }, [nodes, edges]);

  const adjList = useMemo(() => {
    const list = {};
    nodes.forEach(n => list[n] = []);
    edges.forEach(e => {
      list[e.from].push(e.to);
      list[e.to].push(e.from);
    });
    return list;
  }, [nodes, edges]);

  const incidenceMatrix = useMemo(() => {
    const v = nodes.length;
    const eCount = edges.length;
    const matrix = Array.from({ length: v }, () => Array(eCount).fill(0));
    edges.forEach((edge, idx) => {
      matrix[edge.from][idx] = 1;
      matrix[edge.to][idx] = 1;
    });
    return matrix;
  }, [nodes, edges]);

  return (
    <div className="bg-bg-elevated/30 border border-border-color rounded-2xl p-6 overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Left: Interactive Graph Drawing */}
        <div>
          <div className="text-[10px] font-bold text-accent-primary uppercase tracking-widest mb-4">Graph Topology</div>
          <div className="relative bg-bg-base/40 border border-border-color/40 rounded-xl h-[240px] flex items-center justify-center overflow-hidden">
            <svg width="200" height="200" viewBox="0 0 200 200">
              {/* Edges */}
              {edges.map((e, i) => (
                <motion.line
                  key={`edge-${i}`}
                  x1={positions[e.from].x}
                  y1={positions[e.from].y}
                  x2={positions[e.to].x}
                  y2={positions[e.to].y}
                  stroke="var(--accent-primary)"
                  strokeWidth="2"
                  strokeDasharray="4 2"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                />
              ))}
              {/* Nodes */}
              {nodes.map(n => (
                <g key={`node-${n}`}>
                  <circle
                    cx={positions[n].x}
                    cy={positions[n].y}
                    r="15"
                    fill="var(--bg-elevated)"
                    stroke="var(--accent-primary)"
                    strokeWidth="2"
                  />
                  <text
                    x={positions[n].x}
                    y={positions[n].y + 5}
                    textAnchor="middle"
                    fill="var(--text-primary)"
                    fontSize="12"
                    fontWeight="bold"
                    className="select-none"
                  >
                    V{n}
                  </text>
                </g>
              ))}
            </svg>
          </div>
          <div className="mt-4 p-3 bg-bg-base/20 rounded-lg border border-border-color/30">
            <p className="text-[10px] text-text-muted italic leading-relaxed">
              * This is a simple 4-node undirected graph. Observe how the representations below update based on these connections.
            </p>
          </div>
        </div>

        {/* Right: Representations Tabs */}
        <div>
          <div className="flex items-center gap-2 mb-4 bg-bg-base/40 p-1 rounded-lg w-fit border border-border-color/30">
            {[
              { id: 'matrix', icon: Grid3X3, label: 'Matrix' },
              { id: 'list', icon: List, label: 'List' },
              { id: 'incidence', icon: Layers, label: 'Incidence' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-[10px] font-bold transition-all ${activeTab === tab.id ? 'bg-accent-primary text-white' : 'text-text-muted hover:text-text-primary'}`}
              >
                <tab.icon size={14} /> {tab.label}
              </button>
            ))}
          </div>

          <div className="min-h-[220px]">
            <AnimatePresence mode="wait">
              {activeTab === 'matrix' && (
                <motion.div
                  key="matrix"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="bg-bg-base/30 rounded-xl p-4 border border-border-color/20 overflow-x-auto"
                >
                  <table className="w-full text-center border-collapse">
                    <thead>
                      <tr>
                        <th className="p-1 text-[10px] text-accent-primary"></th>
                        {nodes.map(n => <th key={n} className="p-1 text-[10px] font-mono text-text-muted">V{n}</th>)}
                      </tr>
                    </thead>
                    <tbody>
                      {adjMatrix.map((row, i) => (
                        <tr key={i}>
                          <td className="p-1 text-[10px] font-mono text-text-muted text-right pr-2">V{i}</td>
                          {row.map((val, j) => (
                            <td key={j} className="p-1">
                              <div className={`w-6 h-6 rounded flex items-center justify-center text-[10px] font-mono transition-colors ${val === 1 ? 'bg-accent-primary/20 text-accent-primary border border-accent-primary/50' : 'bg-bg-elevated/20 text-text-muted/40 border border-border-color/20'}`}>
                                {val}
                              </div>
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="mt-4 text-[9px] font-code text-text-muted px-1">
                    Space Complexity: O(V²)
                  </div>
                </motion.div>
              )}

              {activeTab === 'list' && (
                <motion.div
                  key="list"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="bg-bg-base/30 rounded-xl p-4 border border-border-color/20"
                >
                  <div className="space-y-2">
                    {nodes.map(n => (
                      <div key={n} className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded bg-bg-elevated border border-border-color/40 flex items-center justify-center text-[10px] font-mono text-accent-primary">
                          V{n}
                        </div>
                        <div className="flex-1 flex items-center gap-1 overflow-x-auto py-1">
                          <div className="text-text-muted text-[10px] mr-1">→</div>
                          {adjList[n].length === 0 ? (
                            <span className="text-[10px] text-text-muted/30 italic">NULL</span>
                          ) : (
                            adjList[n].map((neighbor, idx) => (
                              <div key={idx} className="flex items-center">
                                <span className="px-2 py-0.5 rounded bg-accent-primary/10 text-accent-primary border border-accent-primary/30 text-[9px] font-mono">
                                  {neighbor}
                                </span>
                                {idx < adjList[n].length - 1 && <span className="text-text-muted mx-0.5">•</span>}
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 text-[9px] font-code text-text-muted px-1">
                    Space Complexity: O(V + E)
                  </div>
                </motion.div>
              )}

              {activeTab === 'incidence' && (
                <motion.div
                  key="incidence"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="bg-bg-base/30 rounded-xl p-4 border border-border-color/20 overflow-x-auto"
                >
                  <table className="w-full text-center border-collapse">
                    <thead>
                      <tr>
                        <th className="p-1 text-[10px] text-accent-primary"></th>
                        {edges.map((_, i) => <th key={i} className="p-1 text-[10px] font-mono text-text-muted italic">e{i}</th>)}
                      </tr>
                    </thead>
                    <tbody>
                      {nodes.map((n, i) => (
                        <tr key={i}>
                          <td className="p-1 text-[10px] font-mono text-text-muted text-right pr-2">V{i}</td>
                          {incidenceMatrix[i].map((val, j) => (
                            <td key={j} className="p-1">
                              <div className={`w-6 h-6 rounded flex items-center justify-center text-[10px] font-mono transition-colors ${val === 1 ? 'bg-accent-primary/20 text-accent-primary border border-accent-primary/50' : 'bg-bg-elevated/20 text-text-muted/40 border border-border-color/20'}`}>
                                {val}
                              </div>
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="mt-4 text-[9px] font-code text-text-muted px-1">
                    Space Complexity: O(V × E)
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
