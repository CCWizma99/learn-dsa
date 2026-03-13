import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useProgressStore = create(
  persist(
    (set, get) => ({
      // Map of moduleId -> boolean
      completedModules: {},
      
      // Inline visualizer understood blocks
      understoodBlocks: {},
      
      // Quiz scores
      quizScores: {},
      
      // Navigation state
      sidebarCollapsed: false,

      // Actions
      markModuleComplete: (moduleId) =>
        set((state) => ({
          completedModules: { ...state.completedModules, [moduleId]: true },
        })),

      markBlockUnderstood: (blockId) =>
        set((state) => ({
          understoodBlocks: { ...state.understoodBlocks, [blockId]: true },
        })),

      saveQuizScore: (moduleId, score, total) =>
        set((state) => ({
          quizScores: {
            ...state.quizScores,
            [moduleId]: { score, total, date: Date.now() },
          },
        })),

      toggleSidebar: () =>
        set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

      resetProgress: () =>
        set({
          completedModules: {},
          understoodBlocks: {},
          quizScores: {},
        }),

      // Computed helpers
      getOverallProgress: (modulesArray) => {
        const { completedModules } = get();
        if (!modulesArray || modulesArray.length === 0) return 0;
        
        let completedCount = 0;
        for (const mod of modulesArray) {
          if (completedModules[mod.id]) {
            completedCount++;
          }
        }
        return Math.round((completedCount / modulesArray.length) * 100);
      },
    }),
    {
      name: 'dsa-progress-static', // New key to reset stale slide state
    }
  )
);

export default useProgressStore;
