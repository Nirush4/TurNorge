import { useEffect, useState, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';

const PAGE_TITLES: Record<string, string> = {
  '/': 'Home',
  '/planner': 'AI Trip Planner',
  '/explore': 'Explore Trails',
  '/toolkit': 'Allemannsretten Guide',
};

interface AccessibilityWrapperProps {
  children: ReactNode;
}

export function AccessibilityWrapper({ children }: AccessibilityWrapperProps) {
  const location = useLocation();
  const [announcement, setAnnouncement] = useState('NordicTrail AI loaded');

  useEffect(() => {
    const title = PAGE_TITLES[location.pathname] ?? 'Page';
    setAnnouncement(`${title} loaded`);
    document.title = `${title} · NordicTrail AI`;
  }, [location.pathname]);

  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {announcement}
      </div>
      {children}
    </>
  );
}
