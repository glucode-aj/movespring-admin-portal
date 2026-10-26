import React, { useState } from 'react';
import DashboardScreen from '../(dashboard)/dashboard';
import { navigate } from '../router';

type Tab = 'overview' | 'employees' | 'reports';

interface EmployeeDetailsScreenProps {
  /** Optional overrides. By default Back and the header tabs navigate via the shared router. */
  onBack?: () => void;
  onNavigateTab?: (tab: Tab) => void;
  onReviewActivity?: (activityId: string) => void;
  onSeeAllFlagged?: () => void;
  onOpenTeam?: (team: string) => void;
  adminName?: string;
}

/**
 * Employee details page. Reuses DashboardScreen for the full-viewport layout,
 * header bar and tab navigation, and only adds the styles below.
 */
const CSS = `
.md-root .md-det { display: flex; flex-direction: column; gap: 32px; }

/* Button reset (host-app safe) */
.md-root .md-det-btn {
  appearance: none;
  margin: 0;
  padding: 0;
  border: 0;
  border-radius: 0;
  background: none;
  color: inherit;
  font: inherit;
  text-align: inherit;
  cursor: pointer;
}
.md-root .md-det-btn:focus { outline: none; }
.md-root .md-det-btn:focus-visible { outline: 2px solid #000000; outline-offset: 2px; }

.md-root .md-det-back { display: inline-flex; align-items: center; gap: 8px; align-self: flex-start; font-size: 13px; font-weight: 700; }
.md-root .md-det-back:hover span:last-child { text-decoration: underline; }

.md-root .md-det-grid { display: grid; grid-template-columns: 1fr; gap: 32px; align-items: start; }
.md-root .md-det-col { display: flex; flex-direction: column; gap: 24px; min-width: 0; }

.md-root .md-det-card { background: #ffffff; border: 2px dashed #4f4f4f; padding: 32px; }
.md-root .md-det-profile { display: flex; flex-direction: column; align-items: center; }
.md-root .md-det-avatar { width: 128px; height: 128px; margin-bottom: 16px; background: #000000; border-radius: 9999px; }
.md-root .md-det-name { margin-bottom: 24px; font-family: inherit; font-size: 24px; line-height: 1.2; font-weight: 700; letter-spacing: -0.01em; text-align: center; color: #000000; }

.md-root .md-det-bio { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; width: 100%; }
.md-root .md-det-tile {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  min-width: 0;
  padding: 12px;
  background: #D9D9D9;
  border: 2px dashed #4f4f4f;
}
.md-root .md-det-tile-main { display: flex; align-items: center; gap: 12px; min-width: 0; }
.md-root .md-det-dot { flex: none; width: 24px; height: 24px; background: #000000; border-radius: 9999px; }
.md-root .md-det-tile-label { display: block; font-size: 10px; line-height: 1.4; letter-spacing: 0.05em; text-transform: uppercase; color: #525252; }
.md-root .md-det-tile-value { display: block; font-size: 14px; line-height: 1.4; font-weight: 700; color: #000000; overflow-wrap: anywhere; }
.md-root .md-det-team { width: 100%; transition: background 0.15s; }
.md-root .md-det-team:hover { background: #cfcfcf; }
.md-root .md-det-chev { font-size: 16px; font-weight: 700; transition: transform 0.15s; }
.md-root .md-det-team:hover .md-det-chev { transform: translateX(4px); }

.md-root .md-det-flag { display: flex; flex-direction: column; gap: 16px; padding: 24px; }
.md-root .md-det-flag-head { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
.md-root .md-det-h2 { font-family: inherit; font-size: 14px; line-height: 1.4; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase; color: #000000; text-align: left; }
.md-root .md-det-link { font-size: 12px; color: #525252; text-decoration: underline; }
.md-root .md-det-link:hover { color: #000000; }
.md-root .md-det-flag-list { display: flex; flex-direction: column; gap: 12px; }
.md-root .md-det-flag-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  width: 100%;
  padding: 12px 16px;
  background: #D9D9D9;
  border: 2px dashed #4f4f4f;
  transition: background 0.15s;
}
.md-root .md-det-flag-row:hover { background: #cfcfcf; }
.md-root .md-det-flag-title { display: block; font-size: 13px; line-height: 1.4; font-weight: 700; color: #000000; }
.md-root .md-det-flag-reason { display: block; font-size: 11px; line-height: 1.4; color: #404040; }
.md-root .md-det-review { flex: none; font-size: 12px; font-weight: 700; white-space: nowrap; }

/* Activity */
.md-root .md-det-activity { display: flex; flex-direction: column; gap: 24px; min-width: 0; }
.md-root .md-det-title { font-family: inherit; font-size: 20px; line-height: 1.2; font-weight: 700; letter-spacing: -0.01em; color: #000000; text-align: left; }
.md-root .md-det-top { display: grid; grid-template-columns: 1fr; gap: 24px; }
.md-root .md-det-box {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 12px;
  min-height: 140px;
  padding: 16px;
  background: #D9D9D9;
  border: 2px dashed #4f4f4f;
}
.md-root .md-det-box-title { font-size: 12px; line-height: 1.4; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase; }
.md-root .md-det-note { font-size: 11px; line-height: 1.4; color: #525252; }
.md-root .md-det-metrics { display: flex; flex-direction: column; gap: 6px; font-size: 12px; }
.md-root .md-det-metric { display: flex; justify-content: space-between; gap: 12px; }
.md-root .md-det-metric span:first-child { color: #404040; }
.md-root .md-det-metric span:last-child { font-weight: 700; }

.md-root .md-det-chart { display: flex; flex-direction: column; gap: 8px; padding: 24px; background: #ffffff; border: 2px dashed #4f4f4f; }
.md-root .md-det-bars { display: flex; align-items: flex-end; justify-content: space-between; height: 288px; padding: 40px 32px 0; }
.md-root .md-det-bar-wrap { position: relative; display: flex; flex-direction: column; align-items: center; justify-content: flex-end; flex: 1; max-width: 40px; height: 100%; cursor: pointer; }
.md-root .md-det-bar { width: 100%; background: #D9D9D9; transition: background 0.15s; }
.md-root .md-det-bar-wrap:hover .md-det-bar, .md-root .md-det-bar-wrap:focus .md-det-bar { background: #000000; }
.md-root .md-det-bar-wrap:focus { outline: none; }
.md-root .md-det-tip {
  position: absolute;
  bottom: calc(var(--h) + 8px);
  z-index: 5;
  padding: 4px 8px;
  background: #000000;
  color: #ffffff;
  font-size: 11px;
  line-height: 1.4;
  white-space: nowrap;
  pointer-events: none;
}
.md-root .md-det-axis { border-top: 1px solid #000000; }
.md-root .md-det-days { display: flex; justify-content: space-between; padding: 0 32px; }
.md-root .md-det-day { flex: 1; max-width: 40px; text-align: center; font-size: 11px; color: #525252; }

@media (min-width: 640px) {
  .md-root .md-det-top { grid-template-columns: 1fr 1fr; }
}
@media (min-width: 1024px) {
  .md-root .md-det-grid { grid-template-columns: 5fr 7fr; }
}
@media (max-width: 640px) {
  .md-root .md-det-card { padding: 20px; }
  .md-root .md-det-bio { grid-template-columns: 1fr; }
  .md-root .md-det-bars { padding: 40px 8px 0; }
  .md-root .md-det-days { padding: 0 8px; }
}
`;

export const EmployeeDetailsScreen: React.FC<EmployeeDetailsScreenProps> = ({
  onBack,
  onNavigateTab,
  onReviewActivity,
  onSeeAllFlagged,
  onOpenTeam,
  adminName = 'Mandlakazi',
}) => {
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);

  // Built-in mock data
  const employee = {
    name: 'Jack Sparrow',
    gender: 'Male',
    age: '35 years',
    height: '178cm',
    team: 'Caribbean',
    metrics: { period: 'October 2026', pointContribution: '14,250', hours: '24.5' },
    flaggedActivities: [
      { id: '1', title: 'Steps Spike', reason: 'Unusually high daily count (>40k)' },
      { id: '2', title: 'Manual Workout', reason: 'Manual 3hr workout entry' },
    ],
    chartBars: [
      { day: '01', heightPct: 65, value: '850 pts' },
      { day: '02', heightPct: 45, value: '600 pts' },
      { day: '03', heightPct: 30, value: '450 pts' },
      { day: '04', heightPct: 55, value: '780 pts' },
      { day: '05', heightPct: 25, value: '380 pts' },
      { day: '06', heightPct: 50, value: '720 pts' },
    ],
  };

  const bio: { label: string; value: string }[] = [
    { label: 'Gender', value: employee.gender },
    { label: 'Age', value: employee.age },
    { label: 'Height', value: employee.height },
  ];

  return (
    <DashboardScreen activeTab="employees" onNavigateTab={onNavigateTab} adminName={adminName}>
      <div className="md-det">
        <style>{CSS}</style>

        <button type="button" className="md-det-btn md-det-back" onClick={onBack ?? (() => navigate('/employees'))}>
          <span>←</span>
          <span>Back to Employees</span>
        </button>

        <div className="md-det-grid">
          {/* Left column: profile and flagged activity */}
          <div className="md-det-col">
            <section className="md-det-card md-det-profile">
              <div className="md-det-avatar" aria-hidden="true" />
              <h1 className="md-det-name">{employee.name}</h1>

              <div className="md-det-bio">
                {bio.map((b) => (
                  <div key={b.label} className="md-det-tile">
                    <div className="md-det-tile-main">
                      <span className="md-det-dot" aria-hidden="true" />
                      <div>
                        <span className="md-det-tile-label">{b.label}</span>
                        <span className="md-det-tile-value">{b.value}</span>
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  className="md-det-btn md-det-tile md-det-team"
                  onClick={() => onOpenTeam?.(employee.team)}
                >
                  <span className="md-det-tile-main">
                    <span className="md-det-dot" aria-hidden="true" />
                    <span>
                      <span className="md-det-tile-label">Team</span>
                      <span className="md-det-tile-value">{employee.team}</span>
                    </span>
                  </span>
                  <span className="md-det-chev">›</span>
                </button>
              </div>
            </section>

            <section className="md-det-card md-det-flag">
              <div className="md-det-flag-head">
                <h2 className="md-det-h2">Flagged Activity</h2>
                <button type="button" className="md-det-btn md-det-link" onClick={onSeeAllFlagged}>
                  See all
                </button>
              </div>

              <div className="md-det-flag-list">
                {employee.flaggedActivities.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className="md-det-btn md-det-flag-row"
                    onClick={() => onReviewActivity?.(item.id)}
                  >
                    <span>
                      <span className="md-det-flag-title">{item.title}</span>
                      <span className="md-det-flag-reason">{item.reason}</span>
                    </span>
                    <span className="md-det-review">Review →</span>
                  </button>
                ))}
              </div>
            </section>
          </div>

          {/* Right column: activity */}
          <section className="md-det-card md-det-activity">
            <h2 className="md-det-title">Activity</h2>

            <div className="md-det-top">
              <div className="md-det-box">
                <span className="md-det-box-title">{employee.metrics.period}</span>
                <span className="md-det-note">Historical monthly view.</span>
              </div>

              <div className="md-det-box">
                <span className="md-det-box-title">Metrics</span>
                <div className="md-det-metrics">
                  <div className="md-det-metric">
                    <span>Point Contribution:</span>
                    <span>{employee.metrics.pointContribution}</span>
                  </div>
                  <div className="md-det-metric">
                    <span>Hours:</span>
                    <span>{employee.metrics.hours}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="md-det-chart">
              <div className="md-det-bars">
                {employee.chartBars.map((bar, idx) => (
                  <div
                    key={bar.day}
                    className="md-det-bar-wrap"
                    tabIndex={0}
                    aria-label={`Day ${bar.day}: ${bar.value}`}
                    onMouseEnter={() => setHoveredBar(idx)}
                    onMouseLeave={() => setHoveredBar(null)}
                    onFocus={() => setHoveredBar(idx)}
                    onBlur={() => setHoveredBar(null)}
                    style={{ '--h': `${bar.heightPct}%` } as React.CSSProperties}
                  >
                    {hoveredBar === idx && <div className="md-det-tip">{bar.value}</div>}
                    <div className="md-det-bar" style={{ height: `${bar.heightPct}%` }} />
                  </div>
                ))}
              </div>
              <div className="md-det-axis" />
              <div className="md-det-days">
                {employee.chartBars.map((bar) => (
                  <span key={bar.day} className="md-det-day">
                    {bar.day}
                  </span>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
    </DashboardScreen>
  );
};

export default EmployeeDetailsScreen;