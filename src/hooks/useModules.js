import { useMemo } from 'react';

// Central Registry of all static learning modules
export const MODULES = [
  {
    id: 'introduction',
    title: 'Introduction',
    icon: 'BookOpen',
    description: 'Learn the fundamentals of Data Structures and Algorithms',
  },
  {
    id: 'complexity',
    title: 'Complexity Analysis',
    icon: 'Activity',
    description: 'Evaluate the efficiency of algorithms using Big-O Notation',
  },
  {
    id: 'arrays',
    title: 'Arrays',
    icon: 'LayoutGrid',
    description: 'Linear collections of elements stored in contiguous memory',
    hasVisualizer: true,
  },
  {
    id: 'linked-lists',
    title: 'Linked Lists',
    icon: 'Link',
    description: 'Sequential elements linked via pointers instead of index',
    hasVisualizer: true,
  },
  {
    id: 'stacks',
    title: 'Stacks',
    icon: 'Layers',
    description: 'LIFO (Last-In-First-Out) data structures',
    hasVisualizer: true,
  },
  {
    id: 'queues',
    title: 'Queues',
    icon: 'ArrowRightLeft',
    description: 'FIFO (First-In-First-Out) data structures',
    hasVisualizer: true,
  },
  {
    id: 'trees',
    title: 'Trees',
    icon: 'GitBranch',
    description: 'Hierarchical node-based data structures',
    hasVisualizer: true,
  },
  {
    id: 'graphs',
    title: 'Graphs',
    icon: 'Share2',
    description: 'Non-linear networks of vertices and edges',
    hasVisualizer: true,
  },
  {
    id: 'sorting',
    title: 'Sorting',
    icon: 'ArrowUpDown',
    description: 'Algorithms to arrange elements in a specific order',
    hasVisualizer: true,
  },
];

export function useModules() {
  return useMemo(() => MODULES, []);
}

export function useModule(id) {
  return useMemo(() => MODULES.find((m) => m.id === id) || null, [id]);
}

// Map strings like "Linked Lists" to their new stable IDs
export function getModIdFromLegacyName(name) {
  const map = {
    'Introduction': 'introduction',
    'Arrays': 'arrays',
    'Linked Lists': 'linked-lists',
    'Stacks': 'stacks',
    'Queues': 'queues',
    'Trees': 'trees',
    'Graphs': 'graphs',
    'Sorting': 'sorting',
  };
  return map[name] || name.toLowerCase().replace(/\s+/g, '-');
}
