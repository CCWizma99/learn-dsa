import { NavLink } from 'react-router-dom';
import { PanelLeftClose, PanelLeft, GraduationCap, LayoutGrid } from 'lucide-react';
import useProgressStore from '../../store/useProgressStore';
import { useModules } from '../../hooks/useModules';

export default function Sidebar() {
  const modules = useModules();
  const {
    sidebarCollapsed,
    toggleSidebar,
    completedModules,
    getOverallProgress,
  } = useProgressStore();

  const overallProgress = getOverallProgress(modules);

  if (sidebarCollapsed) {
    return (
      <aside className="w-14 bg-bg-surface border-r border-border-color flex flex-col items-center py-4 shrink-0 transition-all">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg hover:bg-bg-elevated text-text-muted hover:text-text-primary transition-colors"
          aria-label="Expand sidebar"
        >
          <PanelLeft size={18} />
        </button>
        <div className="mt-6 flex flex-col gap-2 w-full px-2">
          {modules.map((mod) => {
            const isCompleted = completedModules[mod.id];
            return (
              <NavLink
                key={mod.id}
                to={`/learn/${mod.id}`}
                className={({ isActive }) =>
                  `w-full h-10 rounded-lg flex items-center justify-center transition-all relative group
                  ${isActive ? 'bg-accent-primary/10 text-accent-primary' : 'bg-transparent text-text-muted hover:bg-bg-elevated hover:text-text-primary'}`
                }
                title={mod.title}
              >
                <LayoutGrid size={16} />
                {isCompleted && (
                  <div className="absolute top-1 right-1 w-2 h-2 bg-accent-green rounded-full shadow-[0_0_8px_var(--accent-green)]" />
                )}
              </NavLink>
            );
          })}
        </div>
      </aside>
    );
  }

  return (
    <aside className="w-64 bg-bg-surface border-r border-border-color flex flex-col shrink-0 overflow-hidden transition-all">
      {/* Header */}
      <div className="p-4 border-b border-border-color flex items-center justify-between">
        <NavLink to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-accent-primary flex items-center justify-center">
            <GraduationCap size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-sm font-display font-semibold text-text-primary group-hover:text-accent-glow transition-colors">
              DSA Platform
            </h1>
            <p className="text-[10px] text-text-muted">Interactive Learning</p>
          </div>
        </NavLink>
        <button
          onClick={toggleSidebar}
          className="p-1.5 rounded-lg hover:bg-bg-elevated text-text-muted hover:text-text-primary transition-colors"
          aria-label="Collapse sidebar"
        >
          <PanelLeftClose size={16} />
        </button>
      </div>

      {/* Modules List */}
      <div className="px-4 py-3">
        <h2 className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Learning Modules</h2>
      </div>
      
      <nav className="flex-1 overflow-y-auto px-2 pb-4 space-y-1" aria-label="Modules">
        {modules.map((mod) => {
          const isCompleted = completedModules[mod.id];
          const progress = isCompleted ? 100 : 0;
          
          return (
            <NavLink
              key={mod.id}
              to={`/learn/${mod.id}`}
              className={({ isActive }) =>
                `flex flex-col gap-1.5 px-3 py-2.5 rounded-xl transition-all group border border-transparent
                ${isActive 
                  ? 'bg-accent-primary/5 border-accent-primary/20' 
                  : 'hover:bg-bg-elevated/50'}`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-semibold ${isActive ? 'text-accent-primary' : 'text-text-primary group-hover:text-accent-glow'}`}>
                      {mod.title}
                    </span>
                    {isCompleted && (
                      <span className="text-[10px] text-accent-green font-bold">✓</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1 bg-bg-base/50 rounded-full overflow-hidden border border-border-color">
                      <div
                        className={`h-full rounded-full transition-all duration-500
                          ${isCompleted ? 'bg-accent-green' : 'bg-accent-primary'}`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <span className="text-[9px] font-code text-text-muted">{isCompleted ? 'Done' : 'Not started'}</span>
                  </div>
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Overall Progress */}
      <div className="p-4 border-t border-border-color bg-bg-elevated/30">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-text-secondary">Course Completion</span>
          <span className="text-xs font-bold text-text-primary">{overallProgress}%</span>
        </div>
        <div className="h-2 bg-bg-base rounded-full overflow-hidden border border-border-color">
          <div
            className="h-full bg-gradient-to-r from-accent-primary to-accent-glow transition-all duration-700 relative"
            style={{ width: `${overallProgress}%` }}
          >
            <div className="absolute inset-0 bg-white/20" style={{ backgroundImage: 'linear-gradient(45deg,rgba(255,255,255,.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.15) 50%,rgba(255,255,255,.15) 75%,transparent 75%,transparent)' }} />
          </div>
        </div>
      </div>
    </aside>
  );
}
