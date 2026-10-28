import React from 'react';
import { navigate, navigateTab } from '../router';

type Tab = 'overview' | 'employees' | 'reports';

interface DashboardScreenProps {
  onNavigateTab?: (tab: Tab) => void;
  onOpenReports?: () => void;
  /** Optional override. By default the "New Challenge" button opens the add-challenge form. */
  onAddChallenge?: () => void;
  activeTab?: Tab;
  adminName?: string;
  companyName?: string;
  /** Replaces the default Overview content (used for the Employees / Reports pages). */
  children?: React.ReactNode;
}

/**
 * Self-contained styles: no Tailwind or global CSS required.
 * Every rule is scoped under .md-root and the root is fixed to the viewport,
 * so centered / max-width parents (#root, body flex, etc.) can't squash it.
 */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;700&display=swap');

.md-root, .md-root * { box-sizing: border-box; }
.md-root * { margin: 0; }

.md-root {
  position: fixed;
  inset: 0;
  z-index: 10;
  overflow-x: hidden;
  overflow-y: auto;
  background: #ffffff;
  color: #000000;
  color-scheme: light;
  text-align: left;
  font-family: 'IBM Plex Mono', ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 16px;
  line-height: 1.5;
  font-weight: 400;
  letter-spacing: normal;
  -webkit-font-smoothing: antialiased;
  user-select: none;
}
.md-root .md-shell {
  width: 100%;
  min-height: 100%;
  display: flex;
  flex-direction: column;
  padding: 32px 33px 64px;
}

/* Neutralise host-app button styles */
.md-root .md-btn {
  appearance: none;
  padding: 0;
  border: 0;
  border-radius: 0;
  background: none;
  color: inherit;
  font: inherit;
  text-align: inherit;
  cursor: pointer;
}
.md-root .md-btn:hover { border: 0; }
.md-root .md-btn:focus { outline: none; }
.md-root .md-btn:focus-visible { outline: 2px solid #000000; outline-offset: 2px; }

/* Header bar */
.md-root .md-header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  min-height: 108px;
  padding: 21px 59px 21px 37px;
  background: #D9D9D9;
  border-radius: 9999px;
}
.md-root .md-header-left { display: flex; flex-wrap: wrap; align-items: center; gap: 25px; min-width: 0; }
.md-root .md-logo-circle {
  flex: none;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 66px;
  height: 66px;
  background: #ffffff;
  border-radius: 9999px;
}
.md-root .md-logo-circle svg { height: 38px; width: auto; color: #000000; }

.md-root .md-nav {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 60px;
  padding: 0 24px;
  background: #EFEDED;
  border: 1px solid #2b2b2b;
  border-radius: 9999px;
}
.md-root .md-tab {
  height: 49px;
  padding: 0 32px;
  border-radius: 9999px;
  font-size: 18px;
  line-height: 1;
  color: #000000;
  white-space: nowrap;
  transition: opacity 0.15s;
}
.md-root .md-tab.md-active { background: #D9D9D9; cursor: default; }
.md-root .md-tab:not(.md-active):hover { opacity: 0.65; }

.md-root .md-admin {
  display: flex;
  align-items: center;
  gap: 15px;
  height: 61px;
  padding: 0 36px 0 16px;
  background: #EFEDED;
  border: 1px solid #2b2b2b;
  border-radius: 9999px;
  font-size: 18px;
  white-space: nowrap;
}
.md-root .md-avatar { flex: none; width: 47px; height: 47px; background: #000000; border-radius: 9999px; }

/* Main content */
.md-root .md-main { display: flex; flex-direction: column; gap: 61px; padding: 44px 58px 0; }
.md-root .md-top { display: grid; grid-template-columns: 457fr 956fr; gap: 35px; align-items: stretch; }
.md-root .md-card { min-height: 390px; background: #ffffff; border: 2px dashed #4f4f4f; }

/* Company card */
.md-root .md-card-id { display: flex; align-items: center; justify-content: center; gap: 36px; padding: 32px; }
.md-root .md-card-id svg { flex: none; height: 113px; width: auto; color: #000000; }
.md-root .md-company { font-family: inherit; font-size: 18px; font-weight: 400; line-height: 1.4; color: #000000; text-align: left; }

/* Challenge card */
.md-root .md-card-challenge {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 34px;
  padding: 27px 37px 32px 32px;
}
.md-root .md-challenge-top { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: flex-start; gap: 24px; }
.md-root .md-challenge-left { flex: 1 1 280px; max-width: 433px; min-width: 0; }
.md-root .md-chip {
  display: inline-block;
  margin: 8px 0 25px 3px;
  padding: 3px 10px;
  background: #D9D9D9;
  border-radius: 6px;
  font-size: 14px;
  line-height: 20px;
}
.md-root .md-teams { padding: 8px 11px 28px 9px; background: #D9D9D9; border-radius: 24px; }
.md-root .md-teams-title { margin-bottom: 2px; padding-left: 1px; font-size: 13.5px; line-height: 20px; font-weight: 700; }
.md-root .md-teams-list { display: flex; flex-direction: column; gap: 14px; }
.md-root .md-team-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  height: 51px;
  padding: 0 14px;
  border: 2px dashed #4f4f4f;
  font-size: 12px;
}
.md-root .md-team-name { font-weight: 700; }
.md-root .md-team-pts { color: #404040; }

.md-root .md-weeks {
  flex: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 189px;
  height: 168px;
  padding-top: 24px;
  background: #D9D9D9;
  text-align: center;
}
.md-root .md-weeks-num { margin-bottom: 8px; font-size: 72px; line-height: 1; font-weight: 700; }
.md-root .md-weeks-label { font-size: 13.5px; line-height: 20px; }

.md-root .md-progress { display: flex; align-items: center; gap: 14px; padding-left: 8px; }
.md-root .md-bar { flex: 1; display: flex; gap: 6px; height: 4px; min-width: 0; }
.md-root .md-bar-done { height: 4px; background: #000000; border-radius: 9999px; }
.md-root .md-bar-rest { position: relative; height: 4px; background: #F09343; border-radius: 9999px; }
.md-root .md-bar-rest::after {
  content: '';
  position: absolute;
  top: 50%;
  right: -2px;
  width: 5px;
  height: 5px;
  margin-top: -2.5px;
  background: #000000;
  border-radius: 9999px;
}
.md-root .md-pct { font-size: 13px; line-height: 1; }

/* Scheduled challenges */
.md-root .md-sched { display: flex; flex-direction: column; gap: 20px; }
.md-root .md-sched-title {
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 476px;
  height: 76px;
  padding: 0 26px;
  background: #D9D9D9;
  border-radius: 8px;
  font-family: inherit;
  font-size: 27px;
  line-height: 1.2;
  font-weight: 700;
  color: #000000;
  text-align: left;
}
.md-root .md-sched-head { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 16px; }
.md-root .md-sched-head .md-sched-title { flex: 0 1 476px; width: auto; }
.md-root .md-sched-add {
  appearance: none;
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0;
  padding: 16px 28px;
  border: 0;
  border-radius: 6px;
  background: #D9D9D9;
  color: #000000;
  font: inherit;
  font-size: 14px;
  font-weight: 700;
  line-height: 1;
  cursor: pointer;
  transition: background 0.15s, box-shadow 0.15s;
}
.md-root .md-sched-add:hover { background: #cfcfcf; box-shadow: inset 0 0 0 1px #000000; }
.md-root .md-sched-add:focus { outline: none; }
.md-root .md-sched-add:focus-visible { outline: 2px solid #000000; outline-offset: 2px; }
.md-root .md-sched-add-plus { font-size: 18px; line-height: 1; }
.md-root .md-sched-list { display: flex; flex-direction: column; gap: 20px; }
.md-root .md-sched-row { padding: 16px 15px; background: #D9D9D9; }
.md-root .md-sched-inner {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 8px 24px;
  min-height: 68px;
  padding: 8px 24px;
  border: 2px dashed #4f4f4f;
  font-size: 14px;
}
.md-root .md-sched-left, .md-root .md-sched-right { display: flex; flex-wrap: wrap; align-items: center; gap: 4px 16px; }
.md-root .md-sched-name { font-weight: 700; }
.md-root .md-muted { color: #404040; }

@media (max-width: 900px) {
  .md-root .md-shell { padding: 16px 16px 48px; }
  .md-root .md-header { padding: 16px 20px; border-radius: 40px; }
  .md-root .md-nav { padding: 0 8px; gap: 0; }
  .md-root .md-tab { padding: 0 16px; font-size: 15px; }
  .md-root .md-admin { padding: 0 20px 0 12px; font-size: 15px; }
  .md-root .md-main { padding: 32px 0 0; gap: 40px; }
  .md-root .md-top { grid-template-columns: 1fr; gap: 24px; }
  .md-root .md-card-challenge { padding: 24px 20px; }
}
`;

/** Approximation of the brand mark. Swap for the exported Figma SVG for pixel accuracy. */
const Mark: React.FC = () => (
  <svg viewBox="0 0 99 151" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M97.1 19.6A55 55 0 1 0 73.8 106.7L63.9 79.4A26 26 0 1 1 74.9 38.3Z" />
    <path d="M53 117A62 62 0 0 0 99 99V105A46 46 0 0 1 53 151Z" />
  </svg>
);

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  onNavigateTab,
  onOpenReports,
  onAddChallenge,
  activeTab = 'overview',
  adminName = 'Mandlakazi',
  companyName = 'Glucode',
  children,
}) => {
  // Built-in mock data matching the design
  const activeChallenge = {
    name: 'Challenge A',
    weeksRemaining: 3,
    progressPercentage: 80,
    topTeams: [
      { id: '1', name: 'Team Alpha', points: '12,400 pts/member' },
      { id: '2', name: 'Team Beta', points: '11,150 pts/member' },
      { id: '3', name: 'Team Gamma', points: '9,800 pts/member' },
    ],
  };

  const scheduledChallenges = [
    { id: '1', name: 'Spring Into Motion 2026', startDate: 'Nov 01, 2026', enrolled: '45 enrolled', type: 'Team Challenge' },
    { id: '2', name: '10K Daily Habit Quest', startDate: 'Dec 01, 2026', enrolled: '68 enrolled', type: 'Habit Challenge' },
    { id: '3', name: 'New Year Step Marathon', startDate: 'Jan 05, 2027', enrolled: '82 enrolled', type: 'Goal Challenge' },
  ];

  const tabs: { key: Tab; label: string }[] = [
    { key: 'overview', label: 'Overview' },
    { key: 'employees', label: 'Employees' },
    { key: 'reports', label: 'Reports' },
  ];

  const handleTab = (tab: Tab) => {
    if (tab === 'reports' && onOpenReports) {
      onOpenReports();
    } else {
      (onNavigateTab ?? navigateTab)(tab);
    }
  };

  const pct = Math.max(0, Math.min(100, activeChallenge.progressPercentage));

  return (
    <div className="md-root">
      <style>{CSS}</style>
      <div className="md-shell">
        {/* Header bar */}
        <header className="md-header">
          <div className="md-header-left">
            <div className="md-logo-circle">
              <Mark />
            </div>
            <nav className="md-nav" aria-label="Primary">
              {tabs.map((t) => (
                <button
                  key={t.key}
                  type="button"
                  className={`md-btn md-tab${activeTab === t.key ? ' md-active' : ''}`}
                  onClick={() => handleTab(t.key)}
                >
                  {t.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="md-admin">
            <span className="md-avatar" aria-hidden="true" />
            <span>{adminName}</span>
          </div>
        </header>

        <main className="md-main">
          {children ?? (
          <>
          {/* Top cards */}
          <div className="md-top">
            <section className="md-card md-card-id">
              <Mark />
              <h2 className="md-company">{companyName} Admin Portal</h2>
            </section>

            <section className="md-card md-card-challenge">
              <div className="md-challenge-top">
                <div className="md-challenge-left">
                  <span className="md-chip">{activeChallenge.name}</span>
                  <div className="md-teams">
                    <div className="md-teams-title">Top Teams</div>
                    <div className="md-teams-list">
                      {activeChallenge.topTeams.map((team, idx) => (
                        <div key={team.id} className="md-team-row">
                          <span className="md-team-name">
                            #{idx + 1} {team.name}
                          </span>
                          <span className="md-team-pts">{team.points}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="md-weeks">
                  <span className="md-weeks-num">{activeChallenge.weeksRemaining}</span>
                  <span className="md-weeks-label">weeks remaining</span>
                </div>
              </div>

              <div className="md-progress">
                <div className="md-bar" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct}>
                  <div className="md-bar-done" style={{ flex: `${pct} 1 0` }} />
                  <div className="md-bar-rest" style={{ flex: `${100 - pct} 1 0` }} />
                </div>
                <span className="md-pct">{pct}%</span>
              </div>
            </section>
          </div>

          {/* Scheduled challenges */}
          <section className="md-sched">
            <div className="md-sched-head">
              <h2 className="md-sched-title">Scheduled Challenges</h2>
              <button
                type="button"
                className="md-sched-add"
                onClick={onAddChallenge ?? (() => navigate('/add-challenge'))}
              >
                <span className="md-sched-add-plus" aria-hidden="true">+</span>
                <span>New Challenge</span>
              </button>
            </div>
            <div className="md-sched-list">
              {scheduledChallenges.map((c) => (
                <div key={c.id} className="md-sched-row">
                  <div className="md-sched-inner">
                    <div className="md-sched-left">
                      <span className="md-sched-name">{c.name}</span>
                      <span className="md-muted">[{c.type}]</span>
                    </div>
                    <div className="md-sched-right">
                      <span className="md-muted">Starts: {c.startDate}</span>
                      <span className="md-sched-name">{c.enrolled}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
          </>
          )}
        </main>
      </div>
    </div>
  );
};

export default DashboardScreen;