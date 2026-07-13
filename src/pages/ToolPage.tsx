import { Suspense, lazy, useMemo } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { getToolBySlug } from '../data/toolsData';

// Loader matching existing App.tsx pattern
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
  </div>
);

export function ToolPage() {
  const { toolSlug } = useParams<{ toolSlug: string }>();
  const tool = useMemo(() => getToolBySlug(toolSlug || ''), [toolSlug]);

  if (!tool || tool.isDisabled) {
    return <Navigate to="/tools" replace />;
  }

  // Dynamically import the tool component
  const ToolComponent = useMemo(
    () => lazy(() => tool.component()),
    [tool]
  );

  return (
    <Suspense fallback={<PageLoader />}>
      <ToolComponent />
    </Suspense>
  );
}
