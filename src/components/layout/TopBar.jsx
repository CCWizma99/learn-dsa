import { useLocation, Link } from 'react-router-dom';
import { Home, ChevronRight } from 'lucide-react';

export default function TopBar() {
  const location = useLocation();

  // Build breadcrumbs from path
  const pathParts = location.pathname.split('/').filter(Boolean);
  const breadcrumbs = [{ label: 'Home', path: '/' }];

  if (pathParts[0] === 'learn') {
    breadcrumbs.push({
      label: decodeURIComponent(pathParts[1]),
      path: location.pathname,
    });
  }

  return (
    <header className="h-12 bg-bg-surface border-b border-border-color flex items-center justify-between px-4 shrink-0 transition-all z-10 w-full relative">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1 text-sm" aria-label="Breadcrumb">
        {breadcrumbs.map((crumb, i) => (
          <span key={crumb.path} className="flex items-center gap-1">
            {i > 0 && <ChevronRight size={12} className="text-text-muted" />}
            {i === breadcrumbs.length - 1 ? (
              <span className="text-text-primary font-medium">{crumb.label}</span>
            ) : (
              <Link
                to={crumb.path}
                className="text-text-muted hover:text-text-primary transition-colors"
              >
                {i === 0 ? <Home size={14} /> : crumb.label}
              </Link>
            )}
          </span>
        ))}
      </nav>

      <div className="text-[10px] text-text-muted font-code tracking-widest uppercase">
        Continuous Learning Mode
      </div>
    </header>
  );
}
