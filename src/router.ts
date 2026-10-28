import { useEffect, useState } from 'react';

/**
 * Minimal router (no dependencies).
 *
 * The current route lives in memory and is mirrored to the URL hash
 * (#/signin, #/signup, #/dashboard, #/employees, #/reports) so refresh,
 * back/forward and direct links work.
 *
 * Navigation never depends on the URL actually changing: if the browser refuses
 * the update (sandboxed preview, another router owning the URL, ...) the screen
 * still switches.
 */
export type Route = '/signin' | '/signup' | '/dashboard' | '/employees' | '/employees-empty' | '/employee-details' | '/add-employee' | '/activity-review' | '/add-challenge' | '/reports';

export const ROUTES: Route[] = ['/signin', '/signup', '/dashboard', '/employees', '/employees-empty', '/employee-details', '/add-employee', '/activity-review', '/add-challenge', '/reports'];
export const DEFAULT_ROUTE: Route = '/signin';

export const readRoute = (): Route => {
  const path = window.location.hash.replace(/^#/, '');
  return (ROUTES as string[]).includes(path) ? (path as Route) : DEFAULT_ROUTE;
};

let current: Route | null = null;
const listeners = new Set<() => void>();

const getRoute = (): Route => {
  if (current === null) current = readRoute();
  return current;
};

const setCurrent = (next: Route): void => {
  if (current === next) return;
  current = next;
  listeners.forEach((notify) => notify());
};

/** Keep the in-memory route in sync when the URL changes (back/forward, typed URL, links). */
const syncFromUrl = (): void => setCurrent(readRoute());

if (typeof window !== 'undefined') {
  window.addEventListener('hashchange', syncFromUrl);
  window.addEventListener('popstate', syncFromUrl);
}

export const navigate = (to: Route): void => {
  setCurrent(to);
  try {
    if (window.location.hash !== `#${to}`) {
      window.history.pushState(null, '', `#${to}`);
    }
  } catch {
    // The URL can't be written in this context; the in-memory route above already switched the screen.
  }
};

export type Tab = 'overview' | 'employees' | 'reports';

const TAB_TO_ROUTE: Record<Tab, Route> = {
  overview: '/dashboard',
  employees: '/employees',
  reports: '/reports',
};

/** Navigate to the page behind a dashboard header tab. */
export const navigateTab = (tab: Tab): void => navigate(TAB_TO_ROUTE[tab]);

export const useRoute = (): Route => {
  const [route, setRoute] = useState<Route>(getRoute);

  useEffect(() => {
    const update = () => setRoute(getRoute());
    listeners.add(update);
    update(); // catch a navigation that happened between render and this effect
    return () => {
      listeners.delete(update);
    };
  }, []);

  return route;
};