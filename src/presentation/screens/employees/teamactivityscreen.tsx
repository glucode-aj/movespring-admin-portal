import { usePortalRepository } from '../../PortalDataProvider';
export type { Teammate } from '../../../domain/entities/portal';
import { Button } from '../../ui/Button';
import { Card } from '../../ui/Card';
import React, { useState } from 'react';
import DashboardScreen from '../dashboard/dashboard';
import { navigate } from '../../../core/routing/router';

import type { Tab } from '../../../core/routing/router';

interface TeamActivityScreenProps {
  onBack?: () => void;
  onNavigateTab?: (tab: Tab) => void;
  onSelectTeammate?: (employeeId: string) => void;
  adminName?: string;
  teamName?: string;
}

export const TeamActivityScreen: React.FC<TeamActivityScreenProps> = ({
  onBack,
  onNavigateTab,
  onSelectTeammate,
  adminName = 'Mandlakazi',
  teamName = 'Caribbean',
}) => {
  const repository = usePortalRepository();

  const [hoveredBar, setHoveredBar] = useState<number | null>(null);
  const [activeTimeframe, setActiveTimeframe] = useState<'October 2026' | 'Past 7 Days'>('October 2026');

  // Built-in Mock Data
  const teamData = repository.teamProfile(teamName);

  return (
    <DashboardScreen activeTab="employees" onNavigateTab={onNavigateTab} adminName={adminName}>
      <div className="md-team">

        {/* Back Link */}
        <Button
          type="button"
          className="md-team-btn md-team-back"
          onClick={onBack ?? (() => navigate('/employee-details'))}
        >
          <span>←</span>
          <span>Back to Employee Profile (Jack Sparrow)</span>
        </Button>

        {/* Team Hero Header */}
        <Card as="section" variant="elevated" className="md-team-hero">
          <div className="md-team-hero-left">
            <div className="md-team-hero-avatar" aria-hidden="true">
              {teamData.name.charAt(0)}
            </div>
            <div>
              <span className="md-team-hero-sub">Team Profile & Activity</span>
              <h1 className="md-team-hero-title">Team {teamData.name}</h1>
              <p className="md-team-hero-desc">
                {teamData.challenge} • {teamData.memberCount} active members assigned
              </p>
            </div>
          </div>

          <div className="md-team-hero-badges">
            <span className="md-team-badge-dark">
              RANK #{teamData.rank} OF {teamData.totalTeams}
            </span>
            <span className="md-team-badge-gray">
              Scoring: {teamData.scoringMethod}
            </span>
          </div>
        </Card>

        {/* 4 Performance Metric Tiles */}
        <section className="md-team-metrics">
          <Card className="md-team-tile">
            <span className="md-team-tile-lbl">Team Ranking</span>
            <div className="md-team-tile-val">#{teamData.rank}</div>
            <span className="md-team-tile-sub">Leading division leaderboard</span>
          </Card>

          <Card className="md-team-tile">
            <span className="md-team-tile-lbl">Average / Member</span>
            <div className="md-team-tile-val">{teamData.averagePoints}</div>
            <span className="md-team-tile-sub">Fair challenge scoring</span>
          </Card>

          <Card className="md-team-tile">
            <span className="md-team-tile-lbl">Total Team Points</span>
            <div className="md-team-tile-val">{teamData.totalPoints}</div>
            <span className="md-team-tile-sub">Sum of all 8 members</span>
          </Card>

          <Card className="md-team-tile">
            <span className="md-team-tile-lbl">Goal Progress</span>
            <div className="md-team-tile-val md-team-tile-val-acc">{teamData.goalProgress}%</div>
            <span className="md-team-tile-sub">120,000 pts target</span>
          </Card>
        </section>

        {/* Split: Daily Activity Trend & Live Team Feed */}
        <section className="md-team-split">
          {/* Daily Activity Chart */}
          <Card variant="elevated" className="md-team-chart-card">
            <div className="md-team-chart-head">
              <div>
                <h2 className="md-team-h2">Team Daily Activity</h2>
                <p className="md-team-h2-sub">
                  Collective challenge points earned across all members
                </p>
              </div>

              <div className="md-team-pills">
                <Button
                  type="button"
                  className={`md-team-btn md-team-pill ${activeTimeframe === 'October 2026' ? 'md-active' : ''}`}
                  onClick={() => setActiveTimeframe('October 2026')}
                >
                  October 2026
                </Button>
                <Button
                  type="button"
                  className={`md-team-btn md-team-pill ${activeTimeframe === 'Past 7 Days' ? 'md-active' : ''}`}
                  onClick={() => setActiveTimeframe('Past 7 Days')}
                >
                  Past 7 Days
                </Button>
              </div>
            </div>

            <Card className="md-team-chart-box">
              <div className="md-team-bars">
                {teamData.chartBars.map((bar, idx) => (
                  <div
                    key={idx}
                    className="md-team-bar-wrap"
                    style={{ ['--h' as string]: `${bar.heightPct}%` }}
                    tabIndex={0}
                    role="button"
                    aria-label={`Day ${bar.day}: ${bar.points}`}
                    onMouseEnter={() => setHoveredBar(idx)}
                    onMouseLeave={() => setHoveredBar(null)}
                    onFocus={() => setHoveredBar(idx)}
                    onBlur={() => setHoveredBar(null)}
                  >
                    {hoveredBar === idx && (
                      <div className="md-team-tip">
                        Day {bar.day}: {bar.points}
                      </div>
                    )}
                    <div className="md-team-bar" style={{ height: `${bar.heightPct}%` }} />
                    <span className="md-team-bar-lbl">{bar.day}</span>
                  </div>
                ))}
              </div>

              <div className="md-team-axis" />

              <div className="md-team-chart-footer">
                <span>Peak Day: Day 06 (20,400 pts)</span>
                <span>Daily Team Average: 14,171 pts/day</span>
              </div>
            </Card>
          </Card>

          {/* Activity Log Feed */}
          <Card className="md-team-feed">
            <div className="md-team-feed-head">
              <h2 className="md-team-h2">Recent Team Log</h2>
              <span className="md-team-feed-live">Real-time sync</span>
            </div>

            <div className="md-team-feed-list">
              {teamData.recentLogs.map((log) => (
                <Card variant="interactive" borderWidth="thin" key={log.id} className="md-team-feed-row">
                  <div className="md-team-feed-main">
                    <span className="md-team-feed-dot">{log.name.charAt(0)}</span>
                    <div>
                      <div className="md-team-feed-name">{log.name}</div>
                      <div className="md-team-feed-act">{log.action}</div>
                      <div className="md-team-feed-time">{log.time}</div>
                    </div>
                  </div>
                  <span className="md-team-feed-pts">{log.points}</span>
                </Card>
              ))}
            </div>
          </Card>
        </section>

        {/* Teammates Roster */}
        <section className="md-team-roster">
          <div className="md-team-roster-head">
            <div>
              <h2 className="md-team-h2">
                Teammate Contributions ({teamData.teammates.length} Members)
              </h2>
              <p className="md-team-roster-sub">
                Individual points contributed to Team {teamData.name}'s average score
              </p>
            </div>
            <span className="md-team-roster-hint">Click member to view profile</span>
          </div>

          <div className="md-team-roster-list">
            {teamData.teammates.map((teammate, idx) => (
              <Button card
                key={teammate.id}
                type="button"
                className={`md-team-btn md-team-roster-row ${teammate.isCurrentEmployee ? 'md-current' : ''}`}
                onClick={() => (onSelectTeammate ? onSelectTeammate(teammate.id) : navigate('/employee-details'))}
              >
                <div className="md-team-roster-left">
                  <span className="md-team-roster-rank">#{idx + 1}</span>
                  <div className="md-team-roster-avatar" aria-hidden="true" />
                  <div>
                    <div className="md-team-roster-name-row">
                      <span className="md-team-roster-name">{teammate.name}</span>
                      {teammate.isCurrentEmployee && (
                        <span className="md-team-roster-curtag">Current</span>
                      )}
                    </div>
                    <span className="md-team-roster-meta">
                      {teammate.role} • {teammate.steps}
                    </span>
                  </div>
                </div>

                <div className="md-team-roster-right">
                  <span className="md-team-roster-pct">{teammate.pctOfTotal}% of team</span>
                  <span className="md-team-roster-pts">{teammate.points}</span>
                  <span className="md-team-roster-arr">→</span>
                </div>
              </Button>
            ))}
          </div>
        </section>
      </div>
    </DashboardScreen>
  );
};

export default TeamActivityScreen;
