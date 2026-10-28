import React, { useEffect, useRef, useState } from 'react';
import DashboardScreen from '../(dashboard)/dashboard';
import { navigate } from '../router';

type Tab = 'overview' | 'employees' | 'reports';

interface Participant {
  id: string;
  name: string;
  points: string;
  team: string;
}

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
const CSS = `
.md-root .md-rep { display: flex; flex-direction: column; gap: 36px; }

/* Button reset (host-app safe) */
.md-root .md-rep-btn {
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
.md-root .md-rep-btn:focus { outline: none; }
.md-root .md-rep-btn:focus-visible { outline: 2px solid #000000; outline-offset: 2px; }

.md-root .md-rep-bar { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 16px; }

/* Challenge dropdown */
.md-root .md-rep-select { position: relative; width: 410px; max-width: 100%; }
.md-root .md-rep-select-btn {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  width: 100%;
  height: 71px;
  padding: 0 36px 0 45px;
  background: #D9D9D9;
  border-radius: 12px;
  font-size: 24px;
  line-height: 1;
  transition: background 0.15s, box-shadow 0.15s;
}
.md-root .md-rep-select-btn:hover { background: #cfcfcf; box-shadow: inset 0 0 0 1px #000000; }
.md-root .md-rep-chev { flex: none; transition: transform 0.15s; }
.md-root .md-rep-select-btn[aria-expanded='true'] .md-rep-chev { transform: rotate(180deg); }
.md-root .md-rep-menu {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  z-index: 20;
  width: 100%;
  padding: 4px 0;
  background: #ffffff;
  border: 1px solid #000000;
  box-shadow: 4px 4px 0 0 #000000;
}
.md-root .md-rep-item { display: block; width: 100%; padding: 12px 24px; font-size: 14px; line-height: 1.2; }
.md-root .md-rep-item:hover { background: #f2f2f2; }
.md-root .md-rep-item.md-selected { background: #D9D9D9; font-weight: 700; }

.md-root .md-rep-export {
  padding: 12px 20px;
  background: #D9D9D9;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 700;
  line-height: 1;
  transition: background 0.15s, box-shadow 0.15s;
}
.md-root .md-rep-export:hover { background: #cfcfcf; box-shadow: inset 0 0 0 1px #000000; }

/* Chart */
.md-root .md-rep-chart { padding: 30px 35px; background: #D9D9D9; }
.md-root .md-rep-chart-inner { position: relative; height: 376px; border: 2px dashed #4f4f4f; }
.md-root .md-rep-chart svg { position: absolute; inset: 0; display: block; width: 100%; height: 100%; overflow: visible; }
.md-root .md-rep-line { fill: none; stroke: #ffffff; stroke-width: 1.5; stroke-linecap: round; stroke-linejoin: round; vector-effect: non-scaling-stroke; }

/* Participants */
.md-root .md-rep-people { display: flex; flex-direction: column; gap: 14px; padding: 22px 22px 30px; background: #D9D9D9; }
.md-root .md-rep-people-title { font-family: inherit; font-size: 18px; line-height: 1.4; font-weight: 700; color: #000000; text-align: left; }
.md-root .md-rep-people-list { display: flex; flex-direction: column; gap: 30px; }
.md-root .md-rep-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  width: 100%;
  min-height: 72px;
  padding: 8px 24px;
  border: 2px dashed #4f4f4f;
  font-size: 14px;
  transition: background 0.15s;
}
.md-root .md-rep-row:hover { background: #cfcfcf; }
.md-root .md-rep-who { display: flex; flex-wrap: wrap; align-items: center; gap: 4px 16px; min-width: 0; }
.md-root .md-rep-rank, .md-root .md-rep-name, .md-root .md-rep-pts { font-weight: 700; }
.md-root .md-rep-team { color: #404040; }
.md-root .md-rep-end { display: flex; align-items: center; gap: 16px; flex: none; }

@media (max-width: 900px) {
  .md-root .md-rep-chart { padding: 16px; }
  .md-root .md-rep-chart-inner { height: 260px; }
  .md-root .md-rep-select-btn { height: 56px; padding: 0 24px; font-size: 18px; }
  .md-root .md-rep-people { padding: 16px; }
  .md-root .md-rep-people-list { gap: 16px; }
  .md-root .md-rep-team { display: none; }
}
`;

const CHALLENGES = ['Challenge A', 'Spring Into Motion', '10K Habit Quest'] as const;

/**
 * Sample line data per challenge, in a 1500 x 375 box (origin top-left).
 * The first series matches the design.
 */
const CHART_POINTS: Record<string, string> = {
  'Challenge A': '42,361 199,258 408,307 573,172 684,208 891,77 1142,281 1445,26',
  'Spring Into Motion': '42,330 250,300 430,250 640,260 860,170 1080,150 1260,90 1445,60',
  '10K Habit Quest': '42,345 220,320 400,290 600,230 820,240 1040,160 1240,120 1445,40',
};

const PARTICIPANTS: Participant[] = [
  { id: 'p1', name: 'Jack Sparrow', points: '34,500 pts', team: 'Caribbean' },
  { id: 'p2', name: 'Will Turner', points: '31,000 pts', team: 'Flying Dutchman' },
  { id: 'p3', name: 'Elizabeth Swann', points: '29,200 pts', team: 'Royal Navy' },
];

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
        <style>{CSS}</style>

        {/* Challenge selector and export */}
        <div className="md-rep-bar">
          <div className="md-rep-select" ref={selectRef}>
            <button
              type="button"
              className="md-rep-btn md-rep-select-btn"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              aria-haspopup="listbox"
              aria-expanded={dropdownOpen}
            >
              <span>{selectedChallenge}</span>
              <ChevronDown />
            </button>

            {dropdownOpen && (
              <div className="md-rep-menu" role="listbox">
                {CHALLENGES.map((c) => (
                  <button
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
                  </button>
                ))}
              </div>
            )}
          </div>

          <button type="button" className="md-rep-btn md-rep-export" onClick={exportCsv}>
            Export CSV
          </button>
        </div>

        {/* Line chart */}
        <section className="md-rep-chart" aria-label={`${selectedChallenge} progress chart`}>
          <div className="md-rep-chart-inner">
            <svg viewBox="0 0 1500 375" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" role="img">
              <polyline className="md-rep-line" points={CHART_POINTS[selectedChallenge] ?? CHART_POINTS['Challenge A']} />
            </svg>
          </div>
        </section>

        {/* Participants */}
        <section className="md-rep-people">
          <h2 className="md-rep-people-title">Participants</h2>
          <div className="md-rep-people-list">
            {PARTICIPANTS.map((p, i) => (
              <button key={p.id} type="button" className="md-rep-btn md-rep-row" onClick={() => handleSelect(p.id)}>
                <span className="md-rep-who">
                  <span className="md-rep-rank">#{i + 1}</span>
                  <span className="md-rep-name">{p.name}</span>
                  <span className="md-rep-team">[{p.team}]</span>
                </span>
                <span className="md-rep-end">
                  <span className="md-rep-pts">{p.points}</span>
                  <span className="md-rep-pts">→</span>
                </span>
              </button>
            ))}
          </div>
        </section>
      </div>
    </DashboardScreen>
  );
};

export default ReportScreen;