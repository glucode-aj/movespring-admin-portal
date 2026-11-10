import { usePortalRepository } from '../../PortalDataProvider';
import type { Participant } from '../../../domain/entities/portal';
export type { Participant } from '../../../domain/entities/portal';
import { Button } from '../../ui/Button';
import { Card } from '../../ui/Card';
import React, { useEffect, useRef, useState } from 'react';
import DashboardScreen from '../dashboard/dashboard';
import { navigate } from '../../../core/routing/router';

import type { Tab } from '../../../core/routing/router';

interface ReportScreenProps {
  /** Optional overrides. By default the header tabs and participant rows navigate via the shared router. */
  onNavigateTab?: (tab: Tab) => void;
  onSelectParticipant?: (id: string) => void;
  adminName?: string;
}

/**
 * Reports page. Reuses DashboardScreen for the full-viewport layout,
 * header bar and tab navigation, and only adds the styles below.
 */

/**
 * Sample line data per challenge, in a 1500 x 375 box (origin top-left).
 * The first series matches the design.
 */

const ChevronDown: React.FC = () => (
  <svg className="md-rep-chev" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 9l6 6 6-6" />
  </svg>
);

const csvCell = (v: string) => `"${v.replace(/"/g, '""')}"`;

export const ReportScreen: React.FC<ReportScreenProps> = ({
  onNavigateTab,
  onSelectParticipant,
  adminName = 'Mandlakazi',
}) => {
  const repository = usePortalRepository();
  const CHALLENGES = repository.reports.challenges;
  const CHART_POINTS: Record<string, string> = repository.reports.chartPoints;
  const PARTICIPANTS: Participant[] = repository.reports.participants;
  const [selectedChallenge, setSelectedChallenge] = useState<string>(CHALLENGES[0]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  // Close the dropdown on outside click or Escape
  useEffect(() => {
    if (!dropdownOpen) return;
    const onDown = (e: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(e.target as Node)) setDropdownOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setDropdownOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [dropdownOpen]);

  const handleSelect = (id: string) => (onSelectParticipant ? onSelectParticipant(id) : navigate('/employee-details'));

  const exportCsv = () => {
    const rows = [
      ['Rank', 'Name', 'Team', 'Points'],
      ...PARTICIPANTS.map((p, i) => [String(i + 1), p.name, p.team, p.points]),
    ];
    const csv = rows.map((r) => r.map(csvCell).join(',')).join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedChallenge.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-report.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <DashboardScreen activeTab="reports" onNavigateTab={onNavigateTab} adminName={adminName}>
      <div className="md-rep">

        {/* Challenge selector and export */}
        <div className="md-rep-bar">
          <div className="md-rep-select" ref={selectRef}>
            <Button
              type="button"
              className="md-rep-btn md-rep-select-btn"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              aria-haspopup="listbox"
              aria-expanded={dropdownOpen}
            >
              <span>{selectedChallenge}</span>
              <ChevronDown />
            </Button>

            {dropdownOpen && (
              <div className="md-rep-menu" role="listbox">
                {CHALLENGES.map((c) => (
                  <Button
                    key={c}
                    type="button"
                    role="option"
                    aria-selected={selectedChallenge === c}
                    className={`md-rep-btn md-rep-item${selectedChallenge === c ? ' md-selected' : ''}`}
                    onClick={() => {
                      setSelectedChallenge(c);
                      setDropdownOpen(false);
                    }}
                  >
                    {c}
                  </Button>
                ))}
              </div>
            )}
          </div>

          <Button type="button" className="md-rep-btn md-rep-export" onClick={exportCsv}>
            Export CSV
          </Button>
        </div>

        {/* Line chart */}
        <section className="md-rep-chart" aria-label={`${selectedChallenge} progress chart`}>
          <Card className="md-rep-chart-inner">
            <svg viewBox="0 0 1500 375" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" role="img">
              <polyline className="md-rep-line" points={CHART_POINTS[selectedChallenge] ?? CHART_POINTS['Challenge A']} />
            </svg>
          </Card>
        </section>

        {/* Participants */}
        <section className="md-rep-people">
          <h2 className="md-rep-people-title">Participants</h2>
          <div className="md-rep-people-list">
            {PARTICIPANTS.map((p, i) => (
              <Button card key={p.id} type="button" className="md-rep-btn md-rep-row" onClick={() => handleSelect(p.id)}>
                <span className="md-rep-who">
                  <span className="md-rep-rank">#{i + 1}</span>
                  <span className="md-rep-name">{p.name}</span>
                  <span className="md-rep-team">[{p.team}]</span>
                </span>
                <span className="md-rep-end">
                  <span className="md-rep-pts">{p.points}</span>
                  <span className="md-rep-pts">→</span>
                </span>
              </Button>
            ))}
          </div>
        </section>
      </div>
    </DashboardScreen>
  );
};

export default ReportScreen;