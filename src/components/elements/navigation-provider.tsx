'use client';

import { useEffect } from 'react';

export function NavigationProvider({
  children,
  currentPath,
}: {
  children: React.ReactNode;
  currentPath: string;
}) {
  useEffect(() => {
    // Reset transition state on initial load
    document.documentElement.classList.remove('page-transition');

    // Only apply view transitions if browser supports it
    if (document.startViewTransition) {
      // Remove transition class first to reset animations
      document.documentElement.classList.remove('page-transition');

      // Force browser to recalculate styles before adding the class back
      window.requestAnimationFrame(() => {
        document.documentElement.classList.add('page-transition');

        document.startViewTransition(() => {
          return Promise.resolve();
        });
      });
    }
  }, [currentPath]);

  return <>{children}</>;
}
