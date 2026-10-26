import { useEffect, useState } from 'react';

/**
 * Minimal hash-based router (no dependencies).
 * URLs look like  yoursite.com/#/signin, #/signup, #/dashboard, #/employees, #/reports
 */
export type Route = '/signin' | '/signup' | '/dashboard' | '/employees' | '/reports';

export const ROUTES: Route[] = ['/signin', '/signup', '/dashboard', '/employees', '/reports'];
export const DEFAULT_ROUTE: Route = '/signin';

export const readRoute = (): Route => {
  const path = window.location.hash.replace(/^#/, '');
  return (ROUTES as string[]).includes(path) ? (path as Route) : DEFAULT_ROUTE;
};

export const navigate = (to: Route): void => {
  if (window.location.hash === `#${to}`) {
    // Same URL: no hashchange fires, so notify listeners manually.
    window.dispatchEvent(new HashChangeEvent('hashchange'));
  } else {
    window.location.hash = to;
  }
};

export const useRoute = (): Route => {
  const [route, setRoute] = useState<Route>(readRoute);

  useEffect(() => {
    const onHashChange = () => setRoute(readRoute());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  return route;
};