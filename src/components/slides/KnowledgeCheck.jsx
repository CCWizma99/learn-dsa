import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, CheckCircle, XCircle } from 'lucide-react';
import useProgressStore from '../../store/useProgressStore';

export default function KnowledgeCheck({ quiz }) {
  const [revealed, setRevealed] = useState(false);
  const [assessed, setAssessed] = useState(null);
  const { saveQuizScore } = useProgressStore();

  const handleAssess = (correct) => {
    setAssessed(correct ? 'correct' : 'incorrect');
    // Save minimal progress (this assumes 1 question = 1 score update for simplicity)
    saveQuizScore(quiz.lecture, correct ? 1 : 0, 1);
  };

  return (
    <div className="bg-bg-surface border border-border-color rounded-2xl p-6 sm:p-8 my-8 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-accent-amber/10 text-accent-amber border border-accent-amber/20">
          Knowledge Check
        </span>
      </div>

      <div className="mb-6">
        <pre className="whitespace-pre-wrap font-body text-sm text-text-primary leading-relaxed">
          {quiz.question}
        </pre>
      </div>

      <AnimatePresence>
        {revealed && quiz.answer && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mb-6 overflow-hidden"
          >
            <div className="p-4 bg-bg-base border border-border-color rounded-lg">
              <h4 className="text-xs font-medium text-accent-green mb-2">Answer</h4>
              <pre className="whitespace-pre-wrap font-body text-sm text-text-secondary leading-relaxed">
                {quiz.answer}
              </pre>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!revealed ? (
        <button
          onClick={() => setRevealed(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-bg-elevated border border-border-color text-text-primary text-sm font-medium hover:bg-accent-primary/10 hover:border-accent-primary/30 transition-all"
        >
          <Eye size={16} className="text-accent-primary" /> Reveal Answer
        </button>
      ) : assessed ? (
        <div className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border
          ${assessed === 'correct' 
            ? 'bg-accent-green/10 text-accent-green border-accent-green/20' 
            : 'bg-accent-red/10 text-accent-red border-accent-red/20'}`}
        >
          {assessed === 'correct' ? <CheckCircle size={16} /> : <XCircle size={16} />}
          {assessed === 'correct' ? 'Great job!' : 'Needs review'}
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <p className="text-xs text-text-muted mr-2">Did you get it right?</p>
          <button
            onClick={() => handleAssess(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent-green/10 text-accent-green border border-accent-green/20 text-xs hover:bg-accent-green/20 transition-colors"
          >
            <CheckCircle size={14} /> Yes
          </button>
          <button
            onClick={() => handleAssess(false)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent-red/10 text-accent-red border border-accent-red/20 text-xs hover:bg-accent-red/20 transition-colors"
          >
            <XCircle size={14} /> No
          </button>
        </div>
      )}
    </div>
  );
}
