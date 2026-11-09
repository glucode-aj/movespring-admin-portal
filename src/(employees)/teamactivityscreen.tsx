import React, { useState } from 'react';
import DashboardScreen from '../(dashboard)/dashboard';
import { navigate } from '../router';

type Tab = 'overview' | 'employees' | 'reports';

interface Teammate {
  id: string;
  name: string;
  role: string;
  points: string;
  steps: string;
  pctOfTotal: number;
  isCurrentEmployee?: boolean;
}

interface TeamActivityScreenProps {
  onBack?: () => void;
  onNavigateTab?: (tab: Tab) => void;
  onSelectTeammate?: (employeeId: string) => void;
  adminName?: string;
  teamName?: string;
}

const CSS = `
.md-root .md-team { display: flex; flex-direction: column; gap: 32px; }

/* Reset */
.md-root .md-team-btn {
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
.md-root .md-team-btn:focus { outline: none; }
.md-root .md-team-btn:focus-visible { outline: 2px solid #000000; outline-offset: 2px; }

.md-root .md-team-back { display: inline-flex; align-items: center; gap: 8px; align-self: flex-start; font-size: 13px; font-weight: 700; }
.md-root .md-team-back:hover span:last-child { text-decoration: underline; }

/* Hero */
.md-root .md-team-hero {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding: 32px;
  background: #ffffff;
  border: 2px dashed #4f4f4f;
}
.md-root .md-team-hero-left { display: flex; align-items: center; gap: 20px; }
.md-root .md-team-hero-avatar {
  flex: none;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  background: #000000;
  color: #ffffff;
  border-radius: 9999px;
  font-size: 32px;
  font-weight: 700;
}
.md-root .md-team-hero-sub { font-size: 11px; letter-spacing: 0.05em; text-transform: uppercase; color: #666666; font-weight: 700; }
.md-root .md-team-hero-title { font-size: 28px; line-height: 1.2; font-weight: 700; color: #000000; letter-spacing: -0.01em; margin: 4px 0 2px; }
.md-root .md-team-hero-desc { font-size: 13px; color: #525252; }

.md-root .md-team-hero-badges { display: flex; flex-direction: column; align-items: flex-end; gap: 8px; }
.md-root .md-team-badge-dark { padding: 4px 12px; background: #000000; color: #ffffff; font-size: 11px; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase; }
.md-root .md-team-badge-gray { padding: 4px 12px; background: #D9D9D9; color: #000000; font-size: 11px; font-weight: 500; }

/* Metrics Grid */
.md-root .md-team-metrics { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
.md-root .md-team-tile {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 8px;
  min-height: 110px;
  padding: 16px;
  background: #ffffff;
  border: 2px dashed #4f4f4f;
}
.md-root .md-team-tile-lbl { font-size: 10px; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase; color: #666666; }
.md-root .md-team-tile-val { font-size: 32px; line-height: 1; font-weight: 700; color: #000000; }
.md-root .md-team-tile-val-acc { color: #F09343; }
.md-root .md-team-tile-sub { font-size: 11px; color: #666666; }

/* Split */
.md-root .md-team-split { display: grid; grid-template-columns: 1fr; gap: 24px; align-items: start; }
.md-root .md-team-chart-card { display: flex; flex-direction: column; gap: 24px; padding: 32px; background: #ffffff; border: 2px dashed #4f4f4f; }
.md-root .md-team-chart-head { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 16px; }
.md-root .md-team-h2 { font-size: 18px; font-weight: 700; color: #000000; }
.md-root .md-team-h2-sub { font-size: 12px; color: #666666; margin-top: 2px; }

.md-root .md-team-pills { display: inline-flex; border: 1px solid #000000; padding: 2px; background: #ffffff; font-size: 12px; }
.md-root .md-team-pill { padding: 4px 12px; font-weight: 500; transition: background 0.15s; }
.md-root .md-team-pill.md-active { background: #000000; color: #ffffff; font-weight: 700; }

.md-root .md-team-chart-box { display: flex; flex-direction: column; gap: 12px; padding: 24px 24px 16px; border: 2px dashed #4f4f4f; }
.md-root .md-team-bars { display: flex; align-items: flex-end; justify-content: space-between; height: 240px; padding: 40px 16px 0; }
.md-root .md-team-bar-wrap { position: relative; display: flex; flex-direction: column; align-items: center; justify-content: flex-end; flex: 1; max-width: 44px; height: 100%; cursor: pointer; }
.md-root .md-team-bar { width: 100%; background: #D9D9D9; transition: background 0.15s; }
.md-root .md-team-bar-wrap:hover .md-team-bar, .md-root .md-team-bar-wrap:focus .md-team-bar { background: #000000; }
.md-root .md-team-bar-lbl { font-size: 10px; color: #666666; margin-top: 8px; }
.md-root .md-team-tip {
  position: absolute;
  bottom: calc(var(--h) + 12px);
  z-index: 5;
  padding: 4px 8px;
  background: #000000;
  color: #ffffff;
  font-size: 11px;
  line-height: 1.4;
  white-space: nowrap;
  pointer-events: none;
}
.md-root .md-team-axis { border-top: 1px solid #000000; }
.md-root .md-team-chart-footer { display: flex; flex-wrap: wrap; justify-content: space-between; gap: 12px; font-size: 12px; color: #525252; padding-top: 4px; }

/* Activity Log */
.md-root .md-team-feed { display: flex; flex-direction: column; gap: 16px; padding: 24px; background: #ffffff; border: 2px dashed #4f4f4f; }
.md-root .md-team-feed-head { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
.md-root .md-team-feed-live { font-size: 11px; color: #666666; }
.md-root .md-team-feed-list { display: flex; flex-direction: column; gap: 12px; }
.md-root .md-team-feed-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  padding: 12px;
  background: #ffffff;
  border: 1px dashed #4f4f4f;
  font-size: 12px;
  transition: background 0.15s;
}
.md-root .md-team-feed-row:hover { background: #f7f7f7; }
.md-root .md-team-feed-main { display: flex; align-items: flex-start; gap: 12px; }
.md-root .md-team-feed-dot {
  flex: none;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  background: #000000;
  color: #ffffff;
  font-size: 10px;
  font-weight: 700;
  border-radius: 9999px;
  margin-top: 2px;
}
.md-root .md-team-feed-name { font-weight: 700; color: #000000; }
.md-root .md-team-feed-act { color: #333333; margin-top: 1px; }
.md-root .md-team-feed-time { font-size: 10px; color: #777777; margin-top: 2px; }
.md-root .md-team-feed-pts { font-weight: 700; color: #000000; white-space: nowrap; }

/* Roster */
.md-root .md-team-roster { display: flex; flex-direction: column; gap: 16px; padding: 28px; background: #D9D9D9; border-radius: 16px; }
.md-root .md-team-roster-head { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 8px; }
.md-root .md-team-roster-sub { font-size: 12px; color: #525252; margin-top: 2px; }
.md-root .md-team-roster-hint { font-size: 12px; color: #525252; }
.md-root .md-team-roster-list { display: flex; flex-direction: column; gap: 12px; }
.md-root .md-team-roster-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  width: 100%;
  height: 64px;
  padding: 0 24px;
  background: #D9D9D9;
  border: 2px dashed #4f4f4f;
  transition: background 0.15s;
}
.md-root .md-team-roster-row:hover { background: #cfcfcf; }
.md-root .md-team-roster-row.md-current { background: #ffffff; }
.md-root .md-team-roster-left { display: flex; align-items: center; gap: 16px; }
.md-root .md-team-roster-rank { width: 20px; font-weight: 700; font-size: 14px; text-align: center; }
.md-root .md-team-roster-avatar { flex: none; width: 40px; height: 40px; background: #000000; border-radius: 9999px; }
.md-root .md-team-roster-name-row { display: flex; align-items: center; gap: 8px; }
.md-root .md-team-roster-name { font-weight: 700; font-size: 14px; color: #000000; }
.md-root .md-team-roster-curtag { padding: 1px 6px; background: #F09343; color: #000000; font-size: 10px; font-weight: 700; }
.md-root .md-team-roster-meta { font-size: 12px; color: #525252; }
.md-root .md-team-roster-right { display: flex; align-items: center; gap: 24px; font-family: inherit; }
.md-root .md-team-roster-pct { font-size: 12px; color: #525252; }
.md-root .md-team-roster-pts { font-size: 14px; font-weight: 700; color: #000000; }
.md-root .md-team-roster-arr { font-size: 14px; font-weight: 700; }

@media (min-width: 640px) {
  .md-root .md-team-hero-badges { align-items: flex-end; }
}
@media (min-width: 1024px) {
  .md-root .md-team-metrics { grid-template-columns: repeat(4, 1fr); }
  .md-root .md-team-split { grid-template-columns: 7fr 5fr; }
}
@media (max-width: 640px) {
  .md-root .md-team-hero { padding: 20px; }
  .md-root .md-team-metrics { grid-template-columns: 1fr; }
  .md-root .md-team-chart-card { padding: 20px; }
  .md-root .md-team-roster { padding: 20px; }
  .md-root .md-team-roster-meta { display: none; }
  .md-root .md-team-roster-pct { display: none; }
}
`;

export const TeamActivityScreen: React.FC<TeamActivityScreenProps> = ({
  onBack,
  onNavigateTab,
  onSelectTeammate,
  adminName = 'Mandlakazi',
  teamName = 'Caribbean',
}) => {
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);
  const [activeTimeframe, setActiveTimeframe] = useState<'October 2026' | 'Past 7 Days'>('October 2026');

  // Built-in Mock Data
  const teamData = {
    name: teamName,
    challenge: 'Challenge A',
    memberCount: 8,
    rank: 1,
    totalTeams: 12,
    scoringMethod: 'Average per member',
    averagePoints: '12,400 pts',
    totalPoints: '99,200 pts',
    goalProgress: 85,
    chartBars: [
      { day: '01', heightPct: 60, points: '14,200 pts' },
      { day: '02', heightPct: 45, points: '10,800 pts' },
      { day: '03', heightPct: 35, points: '8,400 pts' },
      { day: '04', heightPct: 75, points: '17,900 pts' },
      { day: '05', heightPct: 50, points: '12,100 pts' },
      { day: '06', heightPct: 85, points: '20,400 pts' },
      { day: '07', heightPct: 65, points: '15,400 pts' },
    ],
    recentLogs: [
      {
        id: 'log-1',
        name: 'Jack Sparrow',
        action: 'Logged 5.2 km Run',
        points: '+1,800 pts',
        time: '2 hours ago',
      },
      {
        id: 'log-2',
        name: 'Elizabeth Swann',
        action: 'Completed 10,000 Step Milestone',
        points: '+1,000 pts',
        time: '3 hours ago',
      },
      {
        id: 'log-3',
        name: 'Will Turner',
        action: 'Logged 45 min Vigorous Workout',
        points: '+2,250 pts',
        time: '5 hours ago',
      },
      {
        id: 'log-4',
        name: 'Hector Barbossa',
        action: 'Synced Apple Health (7,400 steps)',
        points: '+740 pts',
        time: '6 hours ago',
      },
    ],
    teammates: [
      {
        id: 'usr_01',
        name: 'Jack Sparrow',
        role: 'Captain / Admin',
        points: '34,500 pts',
        steps: '89,400 steps',
        pctOfTotal: 34.8,
        isCurrentEmployee: true,
      },
      {
        id: 'usr_02',
        name: 'Elizabeth Swann',
        role: 'Governor',
        points: '29,200 pts',
        steps: '76,500 steps',
        pctOfTotal: 29.4,
      },
      {
        id: 'usr_03',
        name: 'Will Turner',
        role: 'Blacksmith',
        points: '21,100 pts',
        steps: '54,200 steps',
        pctOfTotal: 21.3,
      },
      {
        id: 'usr_04',
        name: 'Hector Barbossa',
        role: 'First Mate',
        points: '14,400 pts',
        steps: '38,100 steps',
        pctOfTotal: 14.5,
      },
    ] as Teammate[],
  };

  return (
    <DashboardScreen activeTab="employees" onNavigateTab={onNavigateTab} adminName={adminName}>
      <div className="md-team">
        <style>{CSS}</style>

        {/* Back Link */}
        <button
          type="button"
          className="md-team-btn md-team-back"
          onClick={onBack ?? (() => navigate('/employee-details'))}
        >
          <span>←</span>
          <span>Back to Employee Profile (Jack Sparrow)</span>
        </button>

        {/* Team Hero Header */}
        <section className="md-team-hero">
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
        </section>

        {/* 4 Performance Metric Tiles */}
        <section className="md-team-metrics">
          <div className="md-team-tile">
            <span className="md-team-tile-lbl">Team Ranking</span>
            <div className="md-team-tile-val">#{teamData.rank}</div>
            <span className="md-team-tile-sub">Leading division leaderboard</span>
          </div>

          <div className="md-team-tile">
            <span className="md-team-tile-lbl">Average / Member</span>
            <div className="md-team-tile-val">{teamData.averagePoints}</div>
            <span className="md-team-tile-sub">Fair challenge scoring</span>
          </div>

          <div className="md-team-tile">
            <span className="md-team-tile-lbl">Total Team Points</span>
            <div className="md-team-tile-val">{teamData.totalPoints}</div>
            <span className="md-team-tile-sub">Sum of all 8 members</span>
          </div>

          <div className="md-team-tile">
            <span className="md-team-tile-lbl">Goal Progress</span>
            <div className="md-team-tile-val md-team-tile-val-acc">{teamData.goalProgress}%</div>
            <span className="md-team-tile-sub">120,000 pts target</span>
          </div>
        </section>

        {/* Split: Daily Activity Trend & Live Team Feed */}
        <section className="md-team-split">
          {/* Daily Activity Chart */}
          <div className="md-team-chart-card">
            <div className="md-team-chart-head">
              <div>
                <h2 className="md-team-h2">Team Daily Activity</h2>
                <p className="md-team-h2-sub">
                  Collective challenge points earned across all members
                </p>
              </div>

              <div className="md-team-pills">
                <button
                  type="button"
                  className={`md-team-btn md-team-pill ${activeTimeframe === 'October 2026' ? 'md-active' : ''}`}
                  onClick={() => setActiveTimeframe('October 2026')}
                >
                  October 2026
                </button>
                <button
                  type="button"
                  className={`md-team-btn md-team-pill ${activeTimeframe === 'Past 7 Days' ? 'md-active' : ''}`}
                  onClick={() => setActiveTimeframe('Past 7 Days')}
                >
                  Past 7 Days
                </button>
              </div>
            </div>

            <div className="md-team-chart-box">
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
            </div>
          </div>

          {/* Activity Log Feed */}
          <div className="md-team-feed">
            <div className="md-team-feed-head">
              <h2 className="md-team-h2">Recent Team Log</h2>
              <span className="md-team-feed-live">Real-time sync</span>
            </div>

            <div className="md-team-feed-list">
              {teamData.recentLogs.map((log) => (
                <div key={log.id} className="md-team-feed-row">
                  <div className="md-team-feed-main">
                    <span className="md-team-feed-dot">{log.name.charAt(0)}</span>
                    <div>
                      <div className="md-team-feed-name">{log.name}</div>
                      <div className="md-team-feed-act">{log.action}</div>
                      <div className="md-team-feed-time">{log.time}</div>
                    </div>
                  </div>
                  <span className="md-team-feed-pts">{log.points}</span>
                </div>
              ))}
            </div>
          </div>
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
              <button
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
              </button>
            ))}
          </div>
        </section>
      </div>
    </DashboardScreen>
  );
};

export default TeamActivityScreen;
