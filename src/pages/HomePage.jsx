import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, TrendingUp, LayoutGrid, GraduationCap, ArrowRight, Layers, ArrowRightLeft, Link as LinkIcon, GitBranch, ArrowUpDown, Share2, FileText, CheckCircle } from 'lucide-react';
import { useModules } from '../hooks/useModules';
import useProgressStore from '../store/useProgressStore';

const ICON_MAP = {
  'introduction': BookOpen,
  'arrays': LayoutGrid,
  'linked-lists': LinkIcon,
  'stacks': Layers,
  'queues': ArrowRightLeft,
  'trees': GitBranch,
  'graphs': Share2,
  'sorting': ArrowUpDown,
};

function AnimatedCounter({ target, duration = 1500 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    const start = performance.now();
    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }, [target, duration]);

  return <span ref={ref}>{count}</span>;
}

function CompletionRing({ progress, size = 40 }) {
  const radius = (size - 4) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="var(--bg-elevated)"
        strokeWidth="3"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={progress === 100 ? "var(--accent-green)" : "var(--accent-primary)"}
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        className="transition-all duration-700"
      />
    </svg>
  );
}

export default function HomePage() {
  const modules = useModules();
  const { completedModules, getOverallProgress } = useProgressStore();

  const overallProgress = getOverallProgress(modules);
  const completedCount = Object.keys(completedModules).length;
  const interactiveCount = modules.filter(m => m.hasVisualizer).length;

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto h-full flex flex-col">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-12"
      >
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-xl bg-accent-primary flex items-center justify-center shadow-glow">
            <GraduationCap size={26} className="text-white" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-text-primary tracking-tight">
              Data Structures & Algorithms
            </h1>
            <p className="text-sm text-text-muted mt-1">Interactive Learning Platform</p>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
          {[
            { label: 'Total Modules', value: modules.length, icon: BookOpen },
            { label: 'Interactive Sandbox', value: interactiveCount, icon: GitBranch },
            { label: 'Modules Completed', value: completedCount, icon: CheckCircle },
            { label: 'Overall Progress', value: overallProgress, icon: TrendingUp },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              className="bg-bg-surface border border-border-color rounded-2xl p-5 flex items-center gap-4"
            >
              <div className="w-10 h-10 rounded-xl bg-accent-primary/10 flex items-center justify-center shrink-0">
                <stat.icon size={20} className="text-accent-primary" />
              </div>
              <div>
                <div className="text-2xl font-display font-bold text-text-primary">
                  <AnimatedCounter target={stat.value} />
                  {stat.label === 'Overall Progress' ? '%' : ''}
                </div>
                <div className="text-xs text-text-muted uppercase tracking-wider font-medium">{stat.label}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Main Content Area */}
      <div className="flex-1">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-display font-bold text-text-primary">
            Course Curriculum
          </h2>
          <div className="flex items-center gap-3 bg-bg-surface border border-border-color px-4 py-1.5 rounded-full">
            <span className="text-xs font-bold text-text-primary">Overall Progress</span>
            <div className="w-24 h-1.5 bg-bg-base rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-accent-primary to-accent-glow"
                style={{ width: `${overallProgress}%` }}
              />
            </div>
            <span className="text-xs font-code text-accent-primary">{overallProgress}%</span>
          </div>
        </div>

        {/* Module Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 pb-10">
          {modules.map((mod, i) => {
            const isCompleted = completedModules[mod.id];
            const progress = isCompleted ? 100 : 0;
            const Icon = ICON_MAP[mod.id] || FileText;

            return (
              <motion.div
                key={mod.id}
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.05 }}
              >
                <Link
                  to={`/learn/${mod.id}`}
                  className={`block h-full bg-bg-surface border rounded-2xl p-6 card-hover group relative overflow-hidden
                    ${isCompleted ? 'border-accent-green/30 bg-accent-green/5' : 'border-border-color'}`}
                >
                  {/* Background decoration */}
                  {isCompleted && (
                    <div className="absolute -top-10 -right-10 w-24 h-24 bg-accent-green/10 rounded-full blur-2xl" />
                  )}

                  <div className="flex items-start justify-between mb-4 relative z-10">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center
                      ${isCompleted ? 'bg-accent-green/20' : 'bg-bg-elevated'}`}>
                      <Icon size={24} className={isCompleted ? 'text-accent-green' : 'text-accent-primary'} />
                    </div>
                    <CompletionRing progress={progress} size={48} />
                  </div>
                  
                  <div className="relative z-10">
                    <h3 className="text-lg font-bold text-text-primary mb-1 group-hover:text-accent-glow transition-colors">
                      {mod.title}
                    </h3>
                    <p className="text-xs text-text-muted flex items-center gap-2">
                       {mod.hasVisualizer ? 'Interactive Sandbox' : 'Core Concepts'}
                      <span className="w-1 h-1 rounded-full bg-border-color" />
                      Read Module
                    </p>
                  </div>

                  <div className="mt-6 flex items-center justify-between relative z-10">
                    <span className={`text-xs font-semibold ${isCompleted ? 'text-accent-green' : 'text-accent-primary'}`}>
                      {isCompleted ? 'Completed Review' : 'Start Module'}
                    </span>
                    <ArrowRight size={16} className={`transition-transform group-hover:translate-x-1
                      ${isCompleted ? 'text-accent-green' : 'text-accent-primary'}`} />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
