import { usePortalRepository } from '../../PortalDataProvider';
import { NavBar } from '../../ui/NavBar';
import { Button } from '../../ui/Button';
import { Card } from '../../ui/Card';
import React from 'react';
import { navigate, navigateTab } from '../../../core/routing/router';

import type { Tab } from '../../../core/routing/router';

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

/** Shared dashboard shell; screen layouts live in presentation/styles. */

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
  const repository = usePortalRepository();

  // Built-in mock data matching the design
  const activeChallenge = repository.dashboard.activeChallenge;

  const scheduledChallenges = repository.dashboard.scheduledChallenges;

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
      
      <div className="md-shell">
        {/* Header bar */}
        <NavBar activeTab={activeTab} adminName={adminName} onNavigate={handleTab} brand={<Mark />} />

        <main className="md-main">
          {children ?? (
          <>
          {/* Top cards */}
          <div className="md-top">
            <Card as="section" variant="elevated" className="md-card md-card-id">
              <Mark />
              <h2 className="md-company">{companyName} Admin Portal</h2>
            </Card>

            <Card as="section" variant="elevated" className="md-card md-card-challenge">
              <div className="md-challenge-top">
                <div className="md-challenge-left">
                  <span className="md-chip">{activeChallenge.name}</span>
                  <div className="md-teams">
                    <div className="md-teams-title">Top Teams</div>
                    <div className="md-teams-list">
                      {activeChallenge.topTeams.map((team, idx) => (
                        <Card variant="interactive" key={team.id} className="md-team-row">
                          <span className="md-team-name">
                            #{idx + 1} {team.name}
                          </span>
                          <span className="md-team-pts">{team.points}</span>
                        </Card>
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
            </Card>
          </div>

          {/* Scheduled challenges */}
          <section className="md-sched">
            <div className="md-sched-head">
              <h2 className="md-sched-title">Scheduled Challenges</h2>
              <Button
                type="button"
                className="md-sched-add"
                onClick={onAddChallenge ?? (() => navigate('/add-challenge'))}
              >
                <span className="md-sched-add-plus" aria-hidden="true">+</span>
                <span>New Challenge</span>
              </Button>
            </div>
            <div className="md-sched-list">
              {scheduledChallenges.map((c) => (
                <div key={c.id} className="md-sched-row">
                  <Card className="md-sched-inner">
                    <div className="md-sched-left">
                      <span className="md-sched-name">{c.name}</span>
                      <span className="md-muted">[{c.type}]</span>
                    </div>
                    <div className="md-sched-right">
                      <span className="md-muted">Starts: {c.startDate}</span>
                      <span className="md-sched-name">{c.enrolled}</span>
                    </div>
                  </Card>
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