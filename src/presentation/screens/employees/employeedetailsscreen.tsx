import { usePortalRepository } from '../../PortalDataProvider';
import { Button } from '../../ui/Button';
import { Card } from '../../ui/Card';
import React, { useState } from 'react';
import DashboardScreen from '../dashboard/dashboard';
import { navigate } from '../../../core/routing/router';

import type { Tab } from '../../../core/routing/router';

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

export const EmployeeDetailsScreen: React.FC<EmployeeDetailsScreenProps> = ({
  onBack,
  onNavigateTab,
  onReviewActivity,
  onSeeAllFlagged,
  onOpenTeam,
  adminName = 'Mandlakazi',
}) => {
  const repository = usePortalRepository();

  const [hoveredBar, setHoveredBar] = useState<number | null>(null);

  // Built-in mock data
  const employee = repository.employeeProfile;

  const bio: { label: string; value: string }[] = [
    { label: 'Gender', value: employee.gender },
    { label: 'Age', value: employee.age },
    { label: 'Height', value: employee.height },
  ];

  return (
    <DashboardScreen activeTab="employees" onNavigateTab={onNavigateTab} adminName={adminName}>
      <div className="md-det">

        <Button type="button" className="md-det-btn md-det-back" onClick={onBack ?? (() => navigate('/employees'))}>
          <span>←</span>
          <span>Back to Employees</span>
        </Button>

        <div className="md-det-grid">
          {/* Left column: profile and flagged activity */}
          <div className="md-det-col">
            <Card as="section" variant="elevated" className="md-det-card md-det-profile">
              <div className="md-det-avatar" aria-hidden="true" />
              <h1 className="md-det-name">{employee.name}</h1>

              <div className="md-det-bio">
                {bio.map((b) => (
                  <Card key={b.label} className="md-det-tile">
                    <div className="md-det-tile-main">
                      <span className="md-det-dot" aria-hidden="true" />
                      <div>
                        <span className="md-det-tile-label">{b.label}</span>
                        <span className="md-det-tile-value">{b.value}</span>
                      </div>
                    </div>
                  </Card>
                ))}

                <Button card
                  type="button"
                  className="md-det-btn md-det-tile md-det-team"
                  onClick={() => (onOpenTeam ? onOpenTeam(employee.team) : navigate('/team-activity'))}
                >
                  <span className="md-det-tile-main">
                    <span className="md-det-dot" aria-hidden="true" />
                    <span>
                      <span className="md-det-tile-label">Team</span>
                      <span className="md-det-tile-value">{employee.team}</span>
                    </span>
                  </span>
                  <span className="md-det-chev">›</span>
                </Button>
              </div>
            </Card>

            <Card as="section" variant="elevated" className="md-det-card md-det-flag">
              <div className="md-det-flag-head">
                <h2 className="md-det-h2">Flagged Activity</h2>
                <Button type="button" className="md-det-btn md-det-link" onClick={onSeeAllFlagged}>
                  See all
                </Button>
              </div>

              <div className="md-det-flag-list">
                {employee.flaggedActivities.map((item) => (
                  <Button card
                    key={item.id}
                    type="button"
                    className="md-det-btn md-det-flag-row"
                    onClick={() => (onReviewActivity ? onReviewActivity(item.id) : navigate('/activity-review'))}
                  >
                    <span>
                      <span className="md-det-flag-title">{item.title}</span>
                      <span className="md-det-flag-reason">{item.reason}</span>
                    </span>
                    <span className="md-det-review">Review →</span>
                  </Button>
                ))}
              </div>
            </Card>
          </div>

          {/* Right column: activity */}
          <Card as="section" variant="elevated" className="md-det-card md-det-activity">
            <h2 className="md-det-title">Activity</h2>

            <div className="md-det-top">
              <Card className="md-det-box">
                <span className="md-det-box-title">{employee.metrics.period}</span>
                <span className="md-det-note">Historical monthly view.</span>
              </Card>

              <Card className="md-det-box">
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
              </Card>
            </div>

            <Card className="md-det-chart">
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
            </Card>
          </Card>
        </div>
      </div>
    </DashboardScreen>
  );
};

export default EmployeeDetailsScreen;