import type { ReactNode } from 'react';
import type { Tab } from '../../core/routing/router';
import { Button } from './Button';
export function NavBar({ activeTab, adminName, onNavigate, brand }: { activeTab: Tab; adminName: string; onNavigate: (tab: Tab) => void; brand: ReactNode }) {
  const tabs: { key: Tab; label: string }[] = [
    { key: 'overview', label: 'Overview' },
    { key: 'employees', label: 'Employees' },
    { key: 'reports', label: 'Reports' },
  ];

  return (
        <header className="md-header">
          <div className="md-header-left">
            <div className="md-logo-circle">
              {brand}
            </div>
            <nav className="md-nav" aria-label="Primary">
              {tabs.map((t) => (
                <Button
                  key={t.key}
                  type="button"
                  className={`md-btn md-tab${activeTab === t.key ? ' md-active' : ''}`}
                  aria-current={activeTab === t.key ? 'page' : undefined}
                  onClick={() => onNavigate(t.key)}
                >
                  {t.label}
                </Button>
              ))}
            </nav>
          </div>

          <div className="md-admin">
            <span className="md-avatar" aria-hidden="true" />
            <span>{adminName}</span>
          </div>
        </header>
  );
}
