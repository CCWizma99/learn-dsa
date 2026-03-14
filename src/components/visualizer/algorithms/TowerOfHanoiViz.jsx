import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import VisualizerPanel, { useVisualizerTimer } from '../VisualizerPanel';

const PSEUDO_CODE = [
  'void solve(n, src, aux, dest) {',
  '  if (n == 1) {',
  '    move(src, dest);',
  '    return;',
  '  }',
  '  solve(n-1, src, dest, aux);',
  '  move(src, dest);',
  '  solve(n-1, aux, src, dest);',
  '}'
];

export default function TowerOfHanoiViz() {
  const [diskCount, setDiskCount] = useState(3);
  const [pegs, setPegs] = useState({
    A: [3, 2, 1],
    B: [],
    C: []
  });
  const [moves, setMoves] = useState([]);
  const [status, setStatus] = useState('Ready.');
  const [activeLine, setActiveLine] = useState(-1);
  const [isSolving, setIsSolving] = useState(false);
  
  const stepRef = useRef({ 
    moveIndex: 0, 
    generatedMoves: [], 
    done: false 
  });

  const doStep = useCallback(() => {
    const s = stepRef.current;
    if (s.done || s.moveIndex >= s.generatedMoves.length) {
      setStatus('Solved!');
      s.done = true;
      pause();
      return;
    }

    const { from, to, line } = s.generatedMoves[s.moveIndex];
    setActiveLine(line);
    
    setPegs(prev => {
      const newPegs = { ...prev };
      const disk = newPegs[from].pop();
      newPegs[to].push(disk);
      return newPegs;
    });

    setStatus(`Move disk from ${from} to ${to}`);
    setMoves(prev => [...prev, `${from} → ${to}`]);
    s.moveIndex++;
  }, [pegs]);

  const { isPlaying, play, pause } = useVisualizerTimer(1000, doStep);

  const reset = useCallback(() => {
    const disks = Array.from({ length: diskCount }, (_, i) => diskCount - i);
    setPegs({ A: disks, B: [], C: [] });
    setMoves([]);
    setStatus('Reset.');
    setActiveLine(-1);
    setIsSolving(false);
    stepRef.current = { moveIndex: 0, generatedMoves: [], done: false };
    pause();
  }, [diskCount, pause]);

  useEffect(() => {
    reset();
  }, [reset]);

  const generateMoves = (n, src, aux, dest, moveList) => {
    if (n === 1) {
      moveList.push({ n, from: src, to: dest, line: 2 });
      return;
    }
    generateMoves(n - 1, src, dest, aux, moveList);
    moveList.push({ n, from: src, to: dest, line: 11 });
    generateMoves(n - 1, aux, src, dest, moveList);
  };

  const startSolve = () => {
    const moveList = [];
    generateMoves(diskCount, 'A', 'B', 'C', moveList);
    stepRef.current.generatedMoves = moveList;
    stepRef.current.moveIndex = 0;
    stepRef.current.done = false;
    setIsSolving(true);
    play();
  };

  return (
    <VisualizerPanel
      title="Tower of Hanoi (Recursion)"
      inputValue={diskCount.toString()}
      onInputChange={(v) => {
        const n = parseInt(v);
        if (n >= 1 && n <= 7) setDiskCount(n);
      }}
      inputLabel="Disks (1-7)"
      onPlay={isSolving ? play : startSolve}
      onPause={pause}
      onStep={isSolving ? doStep : startSolve}
      onReset={reset}
      isPlaying={isPlaying}
      status={status}
      codeLines={PSEUDO_CODE}
      activeLineIdx={activeLine}
    >
      <div className="relative w-full h-[400px] bg-bg-base/30 rounded-lg overflow-hidden flex items-end justify-around pb-12 pt-8">
        {['A', 'B', 'C'].map((pegId) => (
          <div key={pegId} className="relative flex flex-col items-center group">
            {/* Peg Rod */}
            <div className="w-3 h-64 bg-bg-elevated/80 border-x border-t border-border-color rounded-t-full relative z-0 shadow-inner">
               <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent" />
            </div>
            {/* Peg Base */}
            <div className="w-32 h-4 bg-bg-elevated border border-border-color rounded-lg shadow-lg relative z-0">
               <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full text-[10px] font-bold text-accent-primary opacity-50 uppercase tracking-tighter">Peg {pegId}</div>
            </div>

            {/* Disks */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col-reverse items-center z-10">
              <AnimatePresence>
                {pegs[pegId].map((diskSize, idx) => (
                  <motion.div
                    key={`disk-${diskSize}`}
                    layoutId={`disk-${diskSize}`}
                    initial={{ y: -300, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    style={{
                      width: `${40 + diskSize * 20}px`,
                      height: '24px',
                      backgroundColor: `hsl(${220 + diskSize * 20}, 70%, 50%)`,
                    }}
                    className="rounded-full border border-white/20 shadow-lg flex items-center justify-center text-[10px] font-bold text-white mb-0.5 relative overflow-hidden ring-1 ring-black/10"
                  >
                    <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent" />
                    {diskSize}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        ))}

        {moves.length > 0 && (
          <div className="absolute top-4 left-4 max-h-[120px] overflow-y-auto bg-bg-surface/80 border border-border-color rounded p-2 custom-scrollbar">
            <div className="text-[10px] font-bold text-accent-primary uppercase mb-1 sticky top-0 bg-bg-surface/100 z-10">Move History</div>
            {moves.map((m, i) => (
              <div key={i} className="text-[10px] font-code text-text-muted border-b border-border-color/30 py-0.5">
                {i + 1}. {m}
              </div>
            ))}
          </div>
        )}
      </div>
    </VisualizerPanel>
  );
}
