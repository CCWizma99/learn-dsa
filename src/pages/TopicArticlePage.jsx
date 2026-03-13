import { useParams } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { AlignLeft, Play } from 'lucide-react';
import { useModule, getModIdFromLegacyName } from '../hooks/useModules';

const MODULE_COMPONENTS = {
  'introduction': lazy(() => import('../data/modules/Introduction')),
  'complexity': lazy(() => import('../data/modules/Complexity')),
  'arrays': lazy(() => import('../data/modules/Arrays')),
  'linked-lists': lazy(() => import('../data/modules/LinkedLists')),
  'stacks': lazy(() => import('../data/modules/Stacks')),
  'queues': lazy(() => import('../data/modules/Queues')),
  'trees': lazy(() => import('../data/modules/Trees')),
  'graphs': lazy(() => import('../data/modules/Graphs')),
  'sorting': lazy(() => import('../data/modules/Sorting')),
};

// Lazy load visualizers
const VISUALIZER_MAP = {
  'sorting': lazy(() => import('../components/visualizer/algorithms/BubbleSortViz')),
  'arrays': lazy(() => import('../components/visualizer/algorithms/BinarySearchViz')),
  'linked-lists': lazy(() => import('../components/visualizer/algorithms/LinkedListViz')),
  'stacks': lazy(() => import('../components/visualizer/algorithms/StackViz')),
  'queues': lazy(() => import('../components/visualizer/algorithms/QueueViz')),
  'trees': lazy(() => import('../components/visualizer/algorithms/BSTViz')),
  'graphs': lazy(() => import('../components/visualizer/algorithms/GraphBFSViz')),
};

export default function TopicArticlePage() {
  const { topicName } = useParams();
  const decoded = decodeURIComponent(topicName);
  const moduleId = getModIdFromLegacyName(decoded);
  const moduleMeta = useModule(moduleId);

  if (!moduleMeta) {
    return (
      <div className="flex items-center justify-center p-10 h-full">
        <p className="text-text-muted">Module not found or empty.</p>
      </div>
    );
  }

  const ContentComponent = MODULE_COMPONENTS[moduleId];
  const VisualizerComponent = moduleMeta.hasVisualizer ? VISUALIZER_MAP[moduleId] : null;

  return (
    <div className="flex h-full bg-bg-base overflow-hidden relative">
      <div className="flex-1 overflow-y-auto scroll-smooth">
        <div className="max-w-4xl mx-auto px-6 py-10 pb-32">
          
          {/* Header */}
          <div className="mb-12">
            <span className="px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest bg-accent-primary/10 text-accent-primary border border-accent-primary/20 mb-4 inline-block">
              Learning Module
            </span>
            <h1 className="text-4xl sm:text-5xl font-display font-bold text-text-primary tracking-tight mb-4">
              {moduleMeta.title}
            </h1>
            <p className="text-lg text-text-muted">
              {moduleMeta.description}
            </p>
          </div>

          {/* Interactive Visualizer Block (If applicable) */}
          {VisualizerComponent && (
            <div className="mb-16 border rounded-2xl bg-bg-surface border-border-color overflow-hidden shadow-lg" id="interactive-visualizer">
              <div className="bg-bg-elevated px-4 py-2 border-b border-border-color flex items-center gap-2">
                <Play size={14} className="text-accent-primary" />
                <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider">
                  Interactive Sandbox
                </h3>
              </div>
              <div className="p-1">
                <Suspense
                  fallback={
                    <div className="flex items-center justify-center h-64 bg-bg-base">
                      <div className="w-6 h-6 border-2 border-accent-primary border-t-transparent rounded-full animate-spin" />
                    </div>
                  }
                >
                  <VisualizerComponent />
                </Suspense>
              </div>
            </div>
          )}

          {/* Render the static React component content */}
          <div className="space-y-16">
            <Suspense fallback={
              <div className="flex items-center justify-center h-32">
                 <div className="w-8 h-8 border-2 border-accent-primary border-t-transparent rounded-full animate-spin" />
              </div>
            }>
              {ContentComponent && <ContentComponent />}
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
