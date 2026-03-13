import { useState, useCallback, useRef, useEffect } from 'react';
import VisualizerPanel, { useVisualizerTimer } from '../VisualizerPanel';

export default function LinkedListViz() {
  const [input, setInput] = useState('10,20,30,40');
  const [nodes, setNodes] = useState([10, 20, 30, 40]);
  const [highlight, setHighlight] = useState(-1);
  const [operation, setOperation] = useState('traverse');
  const [status, setStatus] = useState('Ready.');
  const stepRef = useRef({ idx: 0, done: false });

  function reset() {
    const nums = input.split(',').map(Number).filter((n) => !isNaN(n));
    setNodes([...nums]);
    setHighlight(-1);
    stepRef.current = { idx: 0, done: false };
    setStatus(`Linked List: ${nums.join(' → ')} → null`);
    pause();
  }

  const doStep = useCallback(() => {
    const s = stepRef.current;
    if (s.done) { pause(); return; }

    if (operation === 'traverse') {
      if (s.idx >= nodes.length) {
        setHighlight(-1);
        setStatus('Traversal complete. Reached null.');
        s.done = true;
        pause();
        return;
      }
      setHighlight(s.idx);
      setStatus(`Visiting node[${s.idx}] = ${nodes[s.idx]}`);
      s.idx++;
    } else if (operation === 'insertHead') {
      const val = Math.floor(Math.random() * 90) + 10;
      setNodes((prev) => [val, ...prev]);
      setHighlight(0);
      setStatus(`Inserted ${val} at head.`);
      s.done = true;
      pause();
    } else if (operation === 'insertTail') {
      const val = Math.floor(Math.random() * 90) + 10;
      setNodes((prev) => [...prev, val]);
      setHighlight(nodes.length);
      setStatus(`Inserted ${val} at tail.`);
      s.done = true;
      pause();
    } else if (operation === 'deleteHead') {
      if (nodes.length === 0) { setStatus('List is empty.'); s.done = true; pause(); return; }
      const removed = nodes[0];
      setNodes((prev) => prev.slice(1));
      setHighlight(-1);
      setStatus(`Deleted head node (${removed}).`);
      s.done = true;
      pause();
    }
  }, [nodes, operation]);

  const { isPlaying, play, pause } = useVisualizerTimer(600, doStep);

  useEffect(() => { reset(); }, []);

  return (
    <VisualizerPanel
      title="Linked List"
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
          value={operation}
          onChange={(e) => { setOperation(e.target.value); stepRef.current = { idx: 0, done: false }; }}
          className="bg-bg-elevated border border-border-color rounded px-1.5 py-1 text-xs text-text-primary outline-none ml-2"
        >
          <option value="traverse">Traverse</option>
          <option value="insertHead">Insert Head</option>
          <option value="insertTail">Insert Tail</option>
          <option value="deleteHead">Delete Head</option>
        </select>
      }
    >
      <div className="flex items-center gap-0 overflow-x-auto py-4 px-2 min-h-[80px]">
        {nodes.map((val, idx) => (
          <div key={idx} className="flex items-center shrink-0">
            <div
              className={`flex items-center border rounded-lg transition-all duration-300 ${
                idx === highlight
                  ? 'border-accent-primary bg-accent-primary/10 shadow-glow'
                  : 'border-border-color bg-bg-elevated'
              }`}
            >
              <div className="px-3 py-2 border-r border-border-color">
                <span className="text-xs font-code text-text-primary">{val}</span>
              </div>
              <div className="px-2 py-2">
                <span className="text-[9px] text-text-muted">next</span>
              </div>
            </div>
            <svg width="24" height="12" className="shrink-0">
              <line x1="0" y1="6" x2="18" y2="6" stroke="var(--text-muted)" strokeWidth="1.5" />
              <polygon points="18,2 24,6 18,10" fill="var(--text-muted)" />
            </svg>
          </div>
        ))}
        <div className="px-2 py-1 rounded text-[10px] font-code text-text-muted bg-bg-base border border-border-color shrink-0">
          null
        </div>
      </div>
    </VisualizerPanel>
  );
}
