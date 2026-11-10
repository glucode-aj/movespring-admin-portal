import { validateChallengeSchedule } from '../../../domain/use-cases/validateChallengeSchedule';
import type { ScoringMethod, NewChallenge } from '../../../domain/entities/portal';
export type { ScoringMethod, NewChallenge } from '../../../domain/entities/portal';
import { useChallengeFeedback } from '../../animations/FeedbackProvider';
import { usePendingAction } from '../../animations/usePendingAction';
import { Input, Textarea, Select } from '../../ui/Input';
import { Button } from '../../ui/Button';
import { Card } from '../../ui/Card';
import React, { useState } from 'react';
import DashboardScreen from '../dashboard/dashboard';
import { navigate } from '../../../core/routing/router';

import type { Tab } from '../../../core/routing/router';

interface AddChallengeFormProps {
  /** Optional overrides. By default Back and the header tabs navigate via the shared router. */
  onBack?: () => void;
  onNavigateTab?: (tab: Tab) => void;
  /** Called with the challenge settings on submit. By default the form returns to the dashboard. */
  onSubmitSuccess?: (challenge: NewChallenge) => void | Promise<void>;
  adminName?: string;
}

/**
 * Create Challenge form. Reuses DashboardScreen for the full-viewport layout,
 * header bar and tab navigation, and only adds the styles below.
 */

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
  const { pending, error: publishError, run } = usePendingAction();
  const showSuccess = useChallengeFeedback();

  const isTeamChallenge = challengeType === 'TEAM' || challengeType === 'TEAM_GOAL';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const scheduleError = validateChallengeSchedule(registrationDeadline, startDate, endDate);
    setError(scheduleError);
    if (scheduleError) return;

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
    void run(async () => {
      if (onSubmitSuccess) await onSubmitSuccess(challenge);
      else navigate('/dashboard');
      showSuccess();
    });
  };

  return (
    <DashboardScreen activeTab="overview" onNavigateTab={onNavigateTab} adminName={adminName}>
      <div className="md-chal">

        <Button type="button" className="md-chal-btn md-chal-back" onClick={onBack ?? (() => navigate('/dashboard'))}>
          <span>←</span>
          <span>Back to Portal</span>
        </Button>

        <Card as="section" variant="elevated" className="md-chal-card">
          <div className="md-chal-eyebrow">02 / MANAGEMENT</div>
          <h1 className="md-chal-title">Create New Challenge</h1>
          <p className="md-chal-sub">Configure wellness challenge rules, schedule, team balancing, and scoring rates.</p>

          <form className="md-chal-form" onSubmit={handleSubmit} aria-busy={pending}>
            <div>
              <label htmlFor="name" className="md-chal-label">
                Challenge Name *
              </label>
              <div className="md-chal-field">
                <Input
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
                <Textarea
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
                  <Select
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
                  </Select>
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
                    <Input
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
                  <Card as="label" variant="interactive" key={s.value} className={`md-chal-opt${scoringMethod === s.value ? ' md-selected' : ''}`}>
                    <Input
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
                  </Card>
                ))}
              </div>
            </fieldset>

            <div className="md-chal-row3">
              <div>
                <label htmlFor="registrationDeadline" className="md-chal-label">
                  Registration Deadline *
                </label>
                <div className="md-chal-field">
                  <Input
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
                  <Input
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
                  <Input
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

            <Card className="md-chal-rules">
              <div className="md-chal-rules-title">Activity Points</div>
              <div className="md-chal-rule">
                <label htmlFor="stepsPointsRate">Points per 1,000 steps:</label>
                <Input
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
            </Card>

            {(error || publishError) && (
              <Card className="md-chal-error" role="alert">
                {error || publishError}
              </Card>
            )}

            <Button variant="primary" type="submit" disabled={pending} className="md-chal-cta">
              <span>Publish Challenge</span>
              <ArrowIcon />
            </Button>
          </form>
        </Card>
      </div>
    </DashboardScreen>
  );
};

export default AddChallengeForm;