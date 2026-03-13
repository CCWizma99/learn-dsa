import { CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useProgressStore from '../../store/useProgressStore';
import { useModules } from '../../hooks/useModules';

export default function ModuleFooter({ moduleId }) {
  const navigate = useNavigate();
  const modules = useModules();
  const { completedModules, markModuleComplete } = useProgressStore();

  const isCompleted = completedModules[moduleId];
  const currentIndex = modules.findIndex((m) => m.id === moduleId);
  
  const prevModule = currentIndex > 0 ? modules[currentIndex - 1] : null;
  const nextModule = currentIndex < modules.length - 1 ? modules[currentIndex + 1] : null;

  const handleComplete = () => {
    markModuleComplete(moduleId);
    if (nextModule) {
      navigate(`/learn/${nextModule.id}`);
      window.scrollTo(0, 0);
    } else {
      navigate('/');
    }
  };

  return (
    <div className="mt-20 pt-10 border-t border-border-color">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
        
        {/* Previous Module Link */}
        <div className="flex-1 w-full">
          {prevModule && (
            <button
              onClick={() => {
                navigate(`/learn/${prevModule.id}`);
                window.scrollTo(0, 0);
              }}
              className="flex items-center gap-2 text-sm text-text-muted hover:text-accent-primary transition-colors group"
            >
              <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
              <div className="text-left">
                <div className="text-[10px] uppercase tracking-wider mb-0.5 opacity-70">Previous Module</div>
                <div className="font-semibold">{prevModule.title}</div>
              </div>
            </button>
          )}
        </div>

        {/* Complete Button */}
        <div className="flex-1 w-full flex justify-center">
          <button
            onClick={handleComplete}
            disabled={isCompleted && !nextModule}
            className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold shadow-lg transition-all transform hover:scale-105
              ${isCompleted 
                ? 'bg-accent-green text-bg-base hover:bg-accent-green/90 shadow-[0_0_20px_var(--accent-green)]' 
                : 'bg-accent-primary text-white hover:bg-accent-glow shadow-[0_0_20px_var(--accent-primary)]'}`}
          >
            {isCompleted ? <CheckCircle size={18} /> : null}
            {isCompleted ? 'Marked as Complete' : 'Mark Complete & Continue'}
          </button>
        </div>

        {/* Next Module Link */}
        <div className="flex-1 w-full flex justify-end">
          {nextModule && (
            <button
              onClick={() => {
                navigate(`/learn/${nextModule.id}`);
                window.scrollTo(0, 0);
              }}
              className="flex items-center gap-2 text-sm text-text-muted hover:text-accent-primary transition-colors group text-right"
            >
              <div>
                <div className="text-[10px] uppercase tracking-wider mb-0.5 opacity-70">Next Module</div>
                <div className="font-semibold">{nextModule.title}</div>
              </div>
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
