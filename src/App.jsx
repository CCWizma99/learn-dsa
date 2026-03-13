import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import Layout from './components/layout/Layout';

const HomePage = lazy(() => import('./pages/HomePage'));
const TopicArticlePage = lazy(() => import('./pages/TopicArticlePage'));

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center h-screen bg-bg-base">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-2 border-accent-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-text-muted text-sm">Loading module...</p>
      </div>
    </div>
  );
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <HomePage />
          </Suspense>
        ),
      },
      {
        path: 'learn/:topicName',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <TopicArticlePage />
          </Suspense>
        ),
      },
      // Redirect legacy paths back to home
      { path: 'lecture/*', element: <Navigate to="/" replace /> },
      { path: 'topic/*', element: <Navigate to="/" replace /> },
      { path: 'quiz/*', element: <Navigate to="/" replace /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
