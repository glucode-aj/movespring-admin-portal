import React, { useState } from 'react';
import DashboardScreen from '../../(dashboard)/dashboard';
import { navigate } from '../../router';

type Tab = 'overview' | 'employees' | 'reports';
type Decision = 'APPROVE' | 'ADJUST' | 'REJECT';

export interface ActivityData {
  employeeName: string;
  activityType: string;
  metricValue: string;
  claimedPoints: string;
  reason: string;
  source: string;
}

export interface ReviewDecision {
  decision: Decision;
  /** Only set when decision is ADJUST. */
  adjustedPoints?: number;
  adminNotes: string;
  notifyUser: boolean;
}

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
const CSS = `
.md-root .md-act { display: flex; flex-direction: column; gap: 24px; }

/* Button reset (host-app safe) */
.md-root .md-act-btn {
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
.md-root .md-act-btn:focus { outline: none; }
.md-root .md-act-btn:focus-visible { outline: 2px solid #000000; outline-offset: 2px; }

.md-root .md-act-back { display: inline-flex; align-items: center; gap: 8px; align-self: flex-start; font-size: 13px; font-weight: 700; }
.md-root .md-act-back:hover span:last-child { text-decoration: underline; }

.md-root .md-act-card { display: flex; flex-direction: column; gap: 24px; width: 100%; max-width: 800px; margin: 0 auto; padding: 48px; background: #ffffff; border: 2px dashed #4f4f4f; }
.md-root .md-act-head { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 12px; }
.md-root .md-act-eyebrow { font-size: 13px; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase; }
.md-root .md-act-source { padding: 4px 12px; background: #D9D9D9; font-size: 12px; font-weight: 700; line-height: 1.5; }
.md-root .md-act-title { margin-bottom: 8px; font-family: inherit; font-size: 36px; line-height: 1.1; font-weight: 700; letter-spacing: -0.025em; color: #000000; text-align: left; }
.md-root .md-act-sub { font-family: inherit; font-size: 13px; font-weight: 400; line-height: 1.5; color: #525252; text-align: left; }

/* Flag rationale banner */
.md-root .md-act-flag { display: flex; align-items: flex-start; gap: 12px; padding: 16px; background: #D9D9D9; border: 2px dashed #4f4f4f; font-size: 13px; line-height: 1.5; }
.md-root .md-act-flag-icon { flex: none; font-size: 18px; line-height: 1.2; font-weight: 700; }
.md-root .md-act-flag strong { display: block; }

/* Metadata tiles */
.md-root .md-act-meta { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; padding: 12px; background: #D9D9D9; }
.md-root .md-act-meta-tile { min-width: 0; padding: 12px 14px; background: #ffffff; border: 2px dashed #4f4f4f; }
.md-root .md-act-meta-label { display: block; font-size: 10px; line-height: 1.4; letter-spacing: 0.05em; text-transform: uppercase; color: #525252; }
.md-root .md-act-meta-value { display: block; font-size: 13px; line-height: 1.4; font-weight: 700; color: #000000; overflow-wrap: anywhere; }

.md-root .md-act-form { display: flex; flex-direction: column; gap: 24px; }
.md-root .md-act-fieldset { min-width: 0; margin: 0; padding: 0; border: 0; }
.md-root .md-act-legend { display: block; margin-bottom: 12px; padding: 0; font-size: 13px; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase; }
.md-root .md-act-options { display: grid; grid-template-columns: 1fr; gap: 12px; }

/* Decision cards */
.md-root .md-act-opt {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 14px;
  background: #D9D9D9;
  border: 2px dashed #4f4f4f;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s, box-shadow 0.15s;
}
.md-root .md-act-opt:hover { background: #cfcfcf; }
.md-root .md-act-opt.md-selected { background: #ffffff; border-style: solid; border-color: #000000; box-shadow: 4px 4px 0 0 #000000; }
.md-root .md-act-opt:focus-within { outline: 2px solid #000000; outline-offset: 2px; }
.md-root .md-act-opt-top { display: flex; align-items: center; gap: 10px; }
.md-root .md-act-opt input { flex: none; width: 14px; height: 14px; margin: 0; accent-color: #000000; cursor: pointer; }
.md-root .md-act-opt-name { font-size: 13px; font-weight: 700; }
.md-root .md-act-opt-desc { padding-left: 24px; font-size: 11px; line-height: 1.4; color: #404040; }

.md-root .md-act-label { display: block; margin-bottom: 12px; font-size: 13px; font-weight: 700; line-height: 1.4; }

/* Gray field with inset dashed border (same as the other forms) */
.md-root .md-act-field { position: relative; padding: 10px 12px; background: #D9D9D9; transition: background 0.15s; }
.md-root .md-act-field:focus-within { background: #ffffff; }
.md-root .md-act-input {
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
.md-root .md-act-input::placeholder { color: #737373; }
.md-root .md-act-input:focus { border-style: solid; border-color: #000000; }
.md-root .md-act-input:user-invalid { border-color: #b3261e; }
.md-root .md-act-textarea { height: auto; min-height: 112px; padding: 14px 16px; line-height: 1.5; resize: vertical; }

.md-root .md-act-check { display: flex; align-items: center; gap: 12px; cursor: pointer; }
.md-root .md-act-check input { flex: none; width: 14px; height: 14px; accent-color: #000000; cursor: pointer; }
.md-root .md-act-check span { font-size: 12px; line-height: 1.4; color: #404040; }

/* Primary CTA (same look as the sign-in "Launch interface" button) */
.md-root .md-act-cta {
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
.md-root .md-act-cta:hover { background: #F3A15E; }
.md-root .md-act-cta:active { background: #E07D2C; transform: translate(4px, 4px); box-shadow: none; }
.md-root .md-act-cta:focus { outline: none; }
.md-root .md-act-cta:focus-visible { outline: 2px solid #000000; outline-offset: 4px; }

@media (min-width: 640px) {
  .md-root .md-act-meta { grid-template-columns: repeat(4, 1fr); }
  .md-root .md-act-options { grid-template-columns: repeat(3, 1fr); }
}
@media (max-width: 640px) {
  .md-root .md-act-card { padding: 24px 20px; }
  .md-root .md-act-title { font-size: 28px; }
}
`;

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
        <style>{CSS}</style>

        <button type="button" className="md-act-btn md-act-back" onClick={onBack ?? (() => navigate('/employee-details'))}>
          <span>←</span>
          <span>Back to Employee Profile</span>
        </button>

        <section className="md-act-card">
          <div className="md-act-head">
            <div className="md-act-eyebrow">03 / COMPLIANCE AUDIT</div>
            <span className="md-act-source">{activityData.source}</span>
          </div>

          <div>
            <h1 className="md-act-title">Review Flagged Activity</h1>
            <p className="md-act-sub">Audit unusual physical metrics or manual logs to ensure fair competition scoring.</p>
          </div>

          <div className="md-act-flag" role="note">
            <span className="md-act-flag-icon" aria-hidden="true">
              ⚠
            </span>
            <div>
              <strong>Flag Rationale:</strong>
              <span>{activityData.reason}</span>
            </div>
          </div>

          <div className="md-act-meta">
            {meta.map((m) => (
              <div key={m.label} className="md-act-meta-tile">
                <span className="md-act-meta-label">{m.label}</span>
                <span className="md-act-meta-value">{m.value}</span>
              </div>
            ))}
          </div>

          <form className="md-act-form" onSubmit={handleSubmit}>
            <fieldset className="md-act-fieldset">
              <legend className="md-act-legend">Action Decision *</legend>
              <div className="md-act-options">
                {DECISIONS.map((d) => (
                  <label key={d.value} className={`md-act-opt${decision === d.value ? ' md-selected' : ''}`}>
                    <span className="md-act-opt-top">
                      <input
                        type="radio"
                        name="decision"
                        value={d.value}
                        checked={decision === d.value}
                        onChange={() => setDecision(d.value)}
                      />
                      <span className="md-act-opt-name">{d.name}</span>
                    </span>
                    <span className="md-act-opt-desc">{d.desc}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            {decision === 'ADJUST' && (
              <div>
                <label htmlFor="adjustedPoints" className="md-act-label">
                  Adjusted Points to Award *
                </label>
                <div className="md-act-field">
                  <input
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
                <textarea
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
              <input type="checkbox" checked={notifyUser} onChange={(e) => setNotifyUser(e.target.checked)} />
              <span>Notify employee of review decision and updated challenge score</span>
            </label>

            <button type="submit" className="md-act-cta">
              <span>Confirm Review Decision</span>
              <ArrowIcon />
            </button>
          </form>
        </section>
      </div>
    </DashboardScreen>
  );
};

export default ActivityReviewForm;