import type { Decision, ActivityData, ReviewDecision } from '../../../domain/entities/portal';
export type { Decision, ActivityData, ReviewDecision } from '../../../domain/entities/portal';
import { Input, Textarea } from '../../ui/Input';
import { Button } from '../../ui/Button';
import { Card } from '../../ui/Card';
import React, { useState } from 'react';
import DashboardScreen from '../dashboard/dashboard';
import { navigate } from '../../../core/routing/router';

import type { Tab } from '../../../core/routing/router';

interface ActivityReviewFormProps {
  /** Optional overrides. By default Back and the header tabs navigate via the shared router. */
  onBack?: () => void;
  onNavigateTab?: (tab: Tab) => void;
  /** Called with the decision on submit. By default the form returns to the employee profile. */
  onSubmitSuccess?: (result: ReviewDecision) => void;
  activityData?: ActivityData;
  adminName?: string;
}

/**
 * Review Flagged Activity form. Reuses DashboardScreen for the full-viewport layout,
 * header bar and tab navigation, and only adds the styles below.
 */

const ArrowIcon: React.FC = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

const DEFAULT_ACTIVITY: ActivityData = {
  employeeName: 'Jack Sparrow',
  activityType: 'Steps Spike',
  metricValue: '42,000 steps',
  claimedPoints: '42,000 pts',
  reason: 'Recorded metric exceeded daily threshold (>40,000 steps)',
  source: 'MANUAL ENTRY',
};

const DECISIONS: { value: Decision; name: string; desc: string }[] = [
  { value: 'APPROVE', name: 'Approve', desc: 'Confirm valid activity and award full points.' },
  { value: 'ADJUST', name: 'Adjust Points', desc: 'Override points with verified benchmark.' },
  { value: 'REJECT', name: 'Reject', desc: 'Nullify entry; award 0 challenge points.' },
];

export const ActivityReviewForm: React.FC<ActivityReviewFormProps> = ({
  onBack,
  onNavigateTab,
  onSubmitSuccess,
  activityData = DEFAULT_ACTIVITY,
  adminName = 'Mandlakazi',
}) => {
  const [decision, setDecision] = useState<Decision>('APPROVE');
  const [adjustedPoints, setAdjustedPoints] = useState('15000');
  const [adminNotes, setAdminNotes] = useState('');
  const [notifyUser, setNotifyUser] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result: ReviewDecision = {
      decision,
      adjustedPoints: decision === 'ADJUST' ? Number(adjustedPoints) : undefined,
      adminNotes: adminNotes.trim(),
      notifyUser,
    };
    // Mock: replace with your real "log decision" call, then navigate on success.
    if (onSubmitSuccess) {
      onSubmitSuccess(result);
    } else {
      navigate('/employee-details');
    }
  };

  const meta: { label: string; value: string }[] = [
    { label: 'Employee', value: activityData.employeeName },
    { label: 'Activity', value: activityData.activityType },
    { label: 'Recorded', value: activityData.metricValue },
    { label: 'Claimed Points', value: activityData.claimedPoints },
  ];

  return (
    <DashboardScreen activeTab="employees" onNavigateTab={onNavigateTab} adminName={adminName}>
      <div className="md-act">

        <Button type="button" className="md-act-btn md-act-back" onClick={onBack ?? (() => navigate('/employee-details'))}>
          <span>←</span>
          <span>Back to Employee Profile</span>
        </Button>

        <Card as="section" variant="elevated" className="md-act-card">
          <div className="md-act-head">
            <div className="md-act-eyebrow">03 / COMPLIANCE AUDIT</div>
            <span className="md-act-source">{activityData.source}</span>
          </div>

          <div>
            <h1 className="md-act-title">Review Flagged Activity</h1>
            <p className="md-act-sub">Audit unusual physical metrics or manual logs to ensure fair competition scoring.</p>
          </div>

          <Card className="md-act-flag" role="note">
            <span className="md-act-flag-icon" aria-hidden="true">
              ⚠
            </span>
            <div>
              <strong>Flag Rationale:</strong>
              <span>{activityData.reason}</span>
            </div>
          </Card>

          <div className="md-act-meta">
            {meta.map((m) => (
              <Card key={m.label} className="md-act-meta-tile">
                <span className="md-act-meta-label">{m.label}</span>
                <span className="md-act-meta-value">{m.value}</span>
              </Card>
            ))}
          </div>

          <form className="md-act-form" onSubmit={handleSubmit}>
            <fieldset className="md-act-fieldset">
              <legend className="md-act-legend">Action Decision *</legend>
              <div className="md-act-options">
                {DECISIONS.map((d) => (
                  <Card as="label" variant="interactive" key={d.value} className={`md-act-opt${decision === d.value ? ' md-selected' : ''}`}>
                    <span className="md-act-opt-top">
                      <Input
                        type="radio"
                        name="decision"
                        value={d.value}
                        checked={decision === d.value}
                        onChange={() => setDecision(d.value)}
                      />
                      <span className="md-act-opt-name">{d.name}</span>
                    </span>
                    <span className="md-act-opt-desc">{d.desc}</span>
                  </Card>
                ))}
              </div>
            </fieldset>

            {decision === 'ADJUST' && (
              <div>
                <label htmlFor="adjustedPoints" className="md-act-label">
                  Adjusted Points to Award *
                </label>
                <div className="md-act-field">
                  <Input
                    id="adjustedPoints"
                    type="number"
                    min={0}
                    step={1}
                    className="md-act-input"
                    value={adjustedPoints}
                    onChange={(e) => setAdjustedPoints(e.target.value)}
                    placeholder="e.g. 15000"
                    required
                  />
                </div>
              </div>
            )}

            <div>
              <label htmlFor="adminNotes" className="md-act-label">
                Administrative Review Notes &amp; Justification (Logged to AuditLog) *
              </label>
              <div className="md-act-field">
                <Textarea
                  id="adminNotes"
                  rows={4}
                  className="md-act-input md-act-textarea"
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="e.g. Verified with participant: step tracker was carried during weekend marathon..."
                  required
                />
              </div>
            </div>

            <label className="md-act-check">
              <Input type="checkbox" checked={notifyUser} onChange={(e) => setNotifyUser(e.target.checked)} />
              <span>Notify employee of review decision and updated challenge score</span>
            </label>

            <Button variant="primary" type="submit" className="md-act-cta">
              <span>Confirm Review Decision</span>
              <ArrowIcon />
            </Button>
          </form>
        </Card>
      </div>
    </DashboardScreen>
  );
};

export default ActivityReviewForm;