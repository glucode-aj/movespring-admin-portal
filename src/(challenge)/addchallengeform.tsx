import React, { useState } from 'react';
import DashboardScreen from '../(dashboard)/dashboard';
import { navigate } from '../router';

type Tab = 'overview' | 'employees' | 'reports';
type ScoringMethod = 'AVERAGE_PER_MEMBER' | 'TOTAL_POINTS';

export interface NewChallenge {
  name: string;
  description: string;
  challengeType: string;
  scoringMethod: ScoringMethod;
  /** Only set for team challenge types. */
  teamCount?: number;
  registrationDeadline: string;
  startDate: string;
  endDate: string;
  stepsPointsRate: number;
}

interface AddChallengeFormProps {
  /** Optional overrides. By default Back and the header tabs navigate via the shared router. */
  onBack?: () => void;
  onNavigateTab?: (tab: Tab) => void;
  /** Called with the challenge settings on submit. By default the form returns to the dashboard. */
  onSubmitSuccess?: (challenge: NewChallenge) => void;
  adminName?: string;
}

/**
 * Create Challenge form. Reuses DashboardScreen for the full-viewport layout,
 * header bar and tab navigation, and only adds the styles below.
 */
const CSS = `
.md-root .md-chal { display: flex; flex-direction: column; gap: 24px; }

/* Button reset (host-app safe) */
.md-root .md-chal-btn {
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
.md-root .md-chal-btn:focus { outline: none; }
.md-root .md-chal-btn:focus-visible { outline: 2px solid #000000; outline-offset: 2px; }

.md-root .md-chal-back { display: inline-flex; align-items: center; gap: 8px; align-self: flex-start; font-size: 13px; font-weight: 700; }
.md-root .md-chal-back:hover span:last-child { text-decoration: underline; }

.md-root .md-chal-card { width: 100%; max-width: 900px; margin: 0 auto; padding: 48px; background: #ffffff; border: 2px dashed #4f4f4f; }
.md-root .md-chal-eyebrow { margin-bottom: 16px; font-size: 13px; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase; }
.md-root .md-chal-title { margin-bottom: 12px; font-family: inherit; font-size: 36px; line-height: 1.1; font-weight: 700; letter-spacing: -0.025em; color: #000000; text-align: left; }
.md-root .md-chal-sub { margin-bottom: 32px; font-family: inherit; font-size: 13px; font-weight: 400; line-height: 1.5; color: #525252; text-align: left; }

.md-root .md-chal-form { display: flex; flex-direction: column; gap: 24px; }
.md-root .md-chal-row2 { display: grid; grid-template-columns: 1fr; gap: 24px; }
.md-root .md-chal-row3 { display: grid; grid-template-columns: 1fr; gap: 24px; }
.md-root .md-chal-label { display: block; margin-bottom: 12px; font-size: 13px; font-weight: 700; line-height: 1.4; }

/* Gray field with inset dashed border (same as the other forms) */
.md-root .md-chal-field { position: relative; padding: 10px 12px; background: #D9D9D9; transition: background 0.15s; }
.md-root .md-chal-field:focus-within { background: #ffffff; }
.md-root .md-chal-input {
  appearance: none;
  display: block;
  width: 100%;
  height: 52px;
  padding: 0 16px;
  background: transparent;
  border: 2px dashed #525252;
  border-radius: 0;
  outline: none;
  font: inherit;
  font-size: 14px;
  color: #000000;
  transition: border-color 0.15s;
}
.md-root .md-chal-input::placeholder { color: #737373; }
.md-root .md-chal-input:focus { border-style: solid; border-color: #000000; }
.md-root .md-chal-input:user-invalid { border-color: #b3261e; }
.md-root .md-chal-textarea { height: auto; min-height: 104px; padding: 14px 16px; line-height: 1.5; resize: vertical; }
.md-root .md-chal-select { padding-right: 44px; cursor: pointer; }
.md-root .md-chal-select option { color: #000000; background: #ffffff; }
.md-root .md-chal-caret { position: absolute; top: 50%; right: 28px; transform: translateY(-50%); font-size: 12px; pointer-events: none; }
.md-root .md-chal-date { cursor: pointer; }

/* Scoring cards */
.md-root .md-chal-fieldset { min-width: 0; margin: 0; padding: 0; border: 0; }
.md-root .md-chal-legend { display: block; margin-bottom: 12px; padding: 0; font-size: 13px; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase; }
.md-root .md-chal-options { display: grid; grid-template-columns: 1fr; gap: 12px; }
.md-root .md-chal-opt {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 14px;
  background: #D9D9D9;
  border: 2px dashed #4f4f4f;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s, box-shadow 0.15s;
}
.md-root .md-chal-opt:hover { background: #cfcfcf; }
.md-root .md-chal-opt.md-selected { background: #ffffff; border-style: solid; border-color: #000000; box-shadow: 4px 4px 0 0 #000000; }
.md-root .md-chal-opt:focus-within { outline: 2px solid #000000; outline-offset: 2px; }
.md-root .md-chal-opt input { flex: none; width: 14px; height: 14px; margin: 3px 0 0; accent-color: #000000; cursor: pointer; }
.md-root .md-chal-opt-name { display: block; font-size: 13px; font-weight: 700; line-height: 1.4; }
.md-root .md-chal-opt-desc { display: block; font-size: 11px; line-height: 1.4; color: #404040; }

/* Points rules panel */
.md-root .md-chal-rules { display: flex; flex-direction: column; gap: 16px; padding: 20px; background: #D9D9D9; border: 2px dashed #4f4f4f; }
.md-root .md-chal-rules-title { font-size: 13px; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase; }
.md-root .md-chal-rule { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 12px; font-size: 13px; }
.md-root .md-chal-rate {
  appearance: none;
  width: 140px;
  height: 44px;
  padding: 0 14px;
  background: #ffffff;
  border: 2px dashed #525252;
  border-radius: 0;
  outline: none;
  font: inherit;
  font-size: 14px;
  font-weight: 700;
  text-align: right;
  color: #000000;
}
.md-root .md-chal-rate:focus { border-style: solid; border-color: #000000; }
.md-root .md-chal-rate:user-invalid { border-color: #b3261e; }

.md-root .md-chal-error { padding: 12px 16px; background: #D9D9D9; border: 2px dashed #b3261e; font-size: 13px; line-height: 1.4; font-weight: 700; color: #7a1a14; }

/* Primary CTA (same look as the sign-in "Launch interface" button) */
.md-root .md-chal-cta {
  appearance: none;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: calc(100% - 6px);
  margin: 8px 6px 6px 0;
  padding: 16px 24px;
  border: 0;
  border-radius: 0;
  background: #F09343;
  color: #ffffff;
  font: inherit;
  font-size: 13px;
  font-weight: 700;
  line-height: 1.5;
  box-shadow: 6px 6px 0 0 #000000;
  cursor: pointer;
  transition: background 0.15s, transform 0.1s, box-shadow 0.1s;
}
.md-root .md-chal-cta:hover { background: #F3A15E; }
.md-root .md-chal-cta:active { background: #E07D2C; transform: translate(4px, 4px); box-shadow: none; }
.md-root .md-chal-cta:focus { outline: none; }
.md-root .md-chal-cta:focus-visible { outline: 2px solid #000000; outline-offset: 4px; }

@media (min-width: 640px) {
  .md-root .md-chal-row2 { grid-template-columns: 1fr 1fr; }
  .md-root .md-chal-row3 { grid-template-columns: repeat(3, 1fr); }
  .md-root .md-chal-options { grid-template-columns: 1fr 1fr; }
}
@media (max-width: 640px) {
  .md-root .md-chal-card { padding: 24px 20px; }
  .md-root .md-chal-title { font-size: 28px; }
}
`;

const ArrowIcon: React.FC = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

const CHALLENGE_TYPES: { value: string; label: string }[] = [
  { value: 'TEAM', label: 'Team Challenge' },
  { value: 'INDIVIDUAL', label: 'Individual Challenge' },
  { value: 'PERSONAL_GOAL', label: 'Personal Goal Challenge' },
  { value: 'STREAK', label: 'Streak Challenge' },
  { value: 'TEAM_GOAL', label: 'Team Goal Challenge' },
  { value: 'HABIT', label: 'Habit Challenge' },
];

const SCORING: { value: ScoringMethod; name: string; desc: string }[] = [
  { value: 'AVERAGE_PER_MEMBER', name: 'Average per member', desc: 'Fair scoring across unequal team sizes.' },
  { value: 'TOTAL_POINTS', name: 'Total points', desc: 'Aggregate every member’s points.' },
];

export const AddChallengeForm: React.FC<AddChallengeFormProps> = ({
  onBack,
  onNavigateTab,
  onSubmitSuccess,
  adminName = 'Mandlakazi',
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [challengeType, setChallengeType] = useState('TEAM');
  const [scoringMethod, setScoringMethod] = useState<ScoringMethod>('AVERAGE_PER_MEMBER');
  const [teamCount, setTeamCount] = useState('4');
  const [registrationDeadline, setRegistrationDeadline] = useState('2026-11-01');
  const [startDate, setStartDate] = useState('2026-11-05');
  const [endDate, setEndDate] = useState('2026-12-05');
  const [stepsPointsRate, setStepsPointsRate] = useState('1000');
  const [error, setError] = useState('');

  const isTeamChallenge = challengeType === 'TEAM' || challengeType === 'TEAM_GOAL';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // ISO dates (yyyy-mm-dd) compare correctly as strings.
    if (registrationDeadline > startDate) {
      setError('Registration must close on or before the start date.');
      return;
    }
    if (endDate <= startDate) {
      setError('The end date must be after the start date.');
      return;
    }
    setError('');

    const challenge: NewChallenge = {
      name: name.trim(),
      description: description.trim(),
      challengeType,
      scoringMethod,
      teamCount: isTeamChallenge ? Number(teamCount) : undefined,
      registrationDeadline,
      startDate,
      endDate,
      stepsPointsRate: Number(stepsPointsRate),
    };
    // Mock: replace with your real "publish challenge" call, then navigate on success.
    if (onSubmitSuccess) {
      onSubmitSuccess(challenge);
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <DashboardScreen activeTab="overview" onNavigateTab={onNavigateTab} adminName={adminName}>
      <div className="md-chal">
        <style>{CSS}</style>

        <button type="button" className="md-chal-btn md-chal-back" onClick={onBack ?? (() => navigate('/dashboard'))}>
          <span>←</span>
          <span>Back to Portal</span>
        </button>

        <section className="md-chal-card">
          <div className="md-chal-eyebrow">02 / MANAGEMENT</div>
          <h1 className="md-chal-title">Create New Challenge</h1>
          <p className="md-chal-sub">Configure wellness challenge rules, schedule, team balancing, and scoring rates.</p>

          <form className="md-chal-form" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="md-chal-label">
                Challenge Name *
              </label>
              <div className="md-chal-field">
                <input
                  id="name"
                  type="text"
                  className="md-chal-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Spring Into Motion 2026"
                  autoComplete="off"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="description" className="md-chal-label">
                Description &amp; Objectives
              </label>
              <div className="md-chal-field">
                <textarea
                  id="description"
                  rows={3}
                  className="md-chal-input md-chal-textarea"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Encourage 30 minutes of daily activity across all departments..."
                />
              </div>
            </div>

            <div className="md-chal-row2">
              <div>
                <label htmlFor="challengeType" className="md-chal-label">
                  Challenge Type
                </label>
                <div className="md-chal-field">
                  <select
                    id="challengeType"
                    className="md-chal-input md-chal-select"
                    value={challengeType}
                    onChange={(e) => setChallengeType(e.target.value)}
                  >
                    {CHALLENGE_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                  <span className="md-chal-caret" aria-hidden="true">
                    ▾
                  </span>
                </div>
              </div>

              {isTeamChallenge && (
                <div>
                  <label htmlFor="teamCount" className="md-chal-label">
                    Target Team Count
                  </label>
                  <div className="md-chal-field">
                    <input
                      id="teamCount"
                      type="number"
                      min={2}
                      max={50}
                      step={1}
                      className="md-chal-input"
                      value={teamCount}
                      onChange={(e) => setTeamCount(e.target.value)}
                      required
                    />
                  </div>
                </div>
              )}
            </div>

            <fieldset className="md-chal-fieldset">
              <legend className="md-chal-legend">Team Scoring Approach</legend>
              <div className="md-chal-options">
                {SCORING.map((s) => (
                  <label key={s.value} className={`md-chal-opt${scoringMethod === s.value ? ' md-selected' : ''}`}>
                    <input
                      type="radio"
                      name="scoringMethod"
                      value={s.value}
                      checked={scoringMethod === s.value}
                      onChange={() => setScoringMethod(s.value)}
                    />
                    <span>
                      <span className="md-chal-opt-name">{s.name}</span>
                      <span className="md-chal-opt-desc">{s.desc}</span>
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            <div className="md-chal-row3">
              <div>
                <label htmlFor="registrationDeadline" className="md-chal-label">
                  Registration Deadline *
                </label>
                <div className="md-chal-field">
                  <input
                    id="registrationDeadline"
                    type="date"
                    className="md-chal-input md-chal-date"
                    value={registrationDeadline}
                    onChange={(e) => setRegistrationDeadline(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="startDate" className="md-chal-label">
                  Start Date *
                </label>
                <div className="md-chal-field">
                  <input
                    id="startDate"
                    type="date"
                    className="md-chal-input md-chal-date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="endDate" className="md-chal-label">
                  End Date *
                </label>
                <div className="md-chal-field">
                  <input
                    id="endDate"
                    type="date"
                    className="md-chal-input md-chal-date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="md-chal-rules">
              <div className="md-chal-rules-title">Activity Points</div>
              <div className="md-chal-rule">
                <label htmlFor="stepsPointsRate">Points per 1,000 steps:</label>
                <input
                  id="stepsPointsRate"
                  type="number"
                  min={0}
                  step={1}
                  className="md-chal-rate"
                  value={stepsPointsRate}
                  onChange={(e) => setStepsPointsRate(e.target.value)}
                  required
                />
              </div>
            </div>

            {error && (
              <div className="md-chal-error" role="alert">
                {error}
              </div>
            )}

            <button type="submit" className="md-chal-cta">
              <span>Publish Challenge</span>
              <ArrowIcon />
            </button>
          </form>
        </section>
      </div>
    </DashboardScreen>
  );
};

export default AddChallengeForm;