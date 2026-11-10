import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

type Preference = 'system' | 'light' | 'dark';
const ThemeContext = createContext<{ preference: Preference; setPreference: (value: Preference) => void }>({ preference: 'system', setPreference: () => {} });
function readPreference(): Preference {
  try { const value = localStorage.getItem('movespring-theme'); return value === 'light' || value === 'dark' ? value : 'system'; } catch { return 'system'; }
}
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [preference, setPreference] = useState<Preference>(readPreference);
  useEffect(() => {
    const media = matchMedia('(prefers-color-scheme: dark)');
    const apply = () => { document.documentElement.dataset.theme = preference === 'system' ? (media.matches ? 'dark' : 'light') : preference; };
    apply(); media.addEventListener('change', apply);
    try { localStorage.setItem('movespring-theme', preference); } catch { /* Storage can be disabled. */ }
    return () => media.removeEventListener('change', apply);
  }, [preference]);
  return <ThemeContext.Provider value={{ preference, setPreference }}>{children}</ThemeContext.Provider>;
}
export function ThemeToggle() {
  const { preference, setPreference } = useContext(ThemeContext);
  return <label className="ui-theme-toggle"><span className="ui-sr-only">Color theme</span><select aria-label="Color theme" value={preference} onChange={e => setPreference(e.target.value as Preference)}><option value="system">System</option><option value="light">Light</option><option value="dark">Dark</option></select></label>;
}
