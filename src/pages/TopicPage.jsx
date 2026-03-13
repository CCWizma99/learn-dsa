import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Play } from 'lucide-react';
import { useTopic, useSlides } from '../hooks/useSlides';
import useProgressStore from '../store/useProgressStore';
import SlideCard from '../components/slides/SlideCard';

const TOPIC_VISUALIZERS = {
  Sorting: true,
  Arrays: true,
  'Linked Lists': true,
  Stacks: true,
  Queues: true,
  Trees: true,
  Graphs: true,
};

export default function TopicPage() {
  const { topicName } = useParams();
  const decoded = decodeURIComponent(topicName);
  const slides = useTopic(decoded);
  const { getTopicProgress } = useProgressStore();
  const { topicIndex } = useSlides();
  const slideIds = topicIndex[decoded] || [];
  const progress = getTopicProgress(slideIds);
  const hasVisualizer = TOPIC_VISUALIZERS[decoded];

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-display font-bold text-text-primary">{decoded}</h1>
            <p className="text-sm text-text-muted mt-1">
              {slides.length} slides · {progress}% complete
            </p>
          </div>
          {hasVisualizer && slides.length > 0 && (
            <Link
              to={`/lecture/${slides[0].lecture}/slide/${slides[0].id}`}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent-primary text-white text-sm font-medium hover:bg-accent-glow transition-colors"
            >
              <Play size={14} />
              Open Visualizer
            </Link>
          )}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {slides.map((slide, i) => (
          <motion.div
            key={slide.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.02 }}
          >
            <SlideCard slide={slide} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
