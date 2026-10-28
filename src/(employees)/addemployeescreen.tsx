import React, { useState } from 'react';
import DashboardScreen from '../(dashboard)/dashboard';
import { navigate } from '../router';

type Tab = 'overview' | 'employees' | 'reports';
type Role = 'EMPLOYEE' | 'ADMIN';

export interface NewEmployeeInvite {
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
  department: string;
  sendInviteEmail: boolean;
}

interface AddEmployeeFormProps {
  /** Optional overrides. By default Back and the header tabs navigate via the shared router. */
  onBack?: () => void;
  onNavigateTab?: (tab: Tab) => void;
  /** Called with the form values on submit. By default the form returns to the Employees page. */
  onSubmitSuccess?: (invite: NewEmployeeInvite) => void;
  adminName?: string;
}

/**
 * Invite Employee form. Reuses DashboardScreen for the full-viewport layout,
 * header bar and tab navigation, and only adds the styles below.
 */
const CSS = `
.md-root .md-add { display: flex; flex-direction: column; gap: 24px; }

/* Button reset (host-app safe) */
.md-root .md-add-btn {
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
.md-root .md-add-btn:focus { outline: none; }
.md-root .md-add-btn:focus-visible { outline: 2px solid #000000; outline-offset: 2px; }

.md-root .md-add-back { display: inline-flex; align-items: center; gap: 8px; align-self: flex-start; font-size: 13px; font-weight: 700; }
.md-root .md-add-back:hover span:last-child { text-decoration: underline; }

.md-root .md-add-card { width: 100%; max-width: 760px; margin: 0 auto; padding: 48px; background: #ffffff; border: 2px dashed #4f4f4f; }
.md-root .md-add-eyebrow { margin-bottom: 16px; font-size: 13px; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase; }
.md-root .md-add-title { margin-bottom: 12px; font-family: inherit; font-size: 36px; line-height: 1.1; font-weight: 700; letter-spacing: -0.025em; color: #000000; text-align: left; }
.md-root .md-add-sub { margin-bottom: 32px; font-family: inherit; font-size: 13px; font-weight: 400; line-height: 1.5; color: #525252; text-align: left; }

.md-root .md-add-form { display: flex; flex-direction: column; gap: 24px; }
.md-root .md-add-row { display: grid; grid-template-columns: 1fr; gap: 24px; }
.md-root .md-add-label { display: block; margin-bottom: 12px; font-size: 13px; font-weight: 700; }

/* Gray field with inset dashed border (same as sign-in / sign-up) */
.md-root .md-add-field { position: relative; padding: 10px 12px; background: #D9D9D9; transition: background 0.15s; }
.md-root .md-add-field:focus-within { background: #ffffff; }
.md-root .md-add-input {
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
.md-root .md-add-input::placeholder { color: #737373; }
.md-root .md-add-input:focus { border-style: solid; border-color: #000000; }
.md-root .md-add-input:user-invalid { border-color: #b3261e; }
.md-root .md-add-select { padding-right: 44px; cursor: pointer; }
.md-root .md-add-select option { color: #000000; background: #ffffff; }
.md-root .md-add-caret { position: absolute; top: 50%; right: 28px; transform: translateY(-50%); font-size: 12px; pointer-events: none; }

.md-root .md-add-check { display: flex; align-items: center; gap: 12px; cursor: pointer; }
.md-root .md-add-check input { flex: none; width: 14px; height: 14px; accent-color: #000000; cursor: pointer; }
.md-root .md-add-check span { font-size: 12px; line-height: 1.4; color: #404040; }

/* Primary CTA (same look as the sign-in "Launch interface" button) */
.md-root .md-add-cta {
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
.md-root .md-add-cta:hover { background: #F3A15E; }
.md-root .md-add-cta:active { background: #E07D2C; transform: translate(4px, 4px); box-shadow: none; }
.md-root .md-add-cta:focus { outline: none; }
.md-root .md-add-cta:focus-visible { outline: 2px solid #000000; outline-offset: 4px; }

@media (min-width: 640px) {
  .md-root .md-add-row { grid-template-columns: 1fr 1fr; }
}
@media (max-width: 640px) {
  .md-root .md-add-card { padding: 24px 20px; }
  .md-root .md-add-title { font-size: 28px; }
}
`;

const ArrowIcon: React.FC = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

export const AddEmployeeForm: React.FC<AddEmployeeFormProps> = ({
  onBack,
  onNavigateTab,
  onSubmitSuccess,
  adminName = 'Mandlakazi',
}) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<Role>('EMPLOYEE');
  const [department, setDepartment] = useState('');
  const [sendInviteEmail, setSendInviteEmail] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const invite: NewEmployeeInvite = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      role,
      department: department.trim(),
      sendInviteEmail,
    };
    // Mock: replace with your real "send invitation" call, then navigate on success.
    if (onSubmitSuccess) {
      onSubmitSuccess(invite);
    } else {
      navigate('/employees');
    }
  };

  return (
    <DashboardScreen activeTab="employees" onNavigateTab={onNavigateTab} adminName={adminName}>
      <div className="md-add">
        <style>{CSS}</style>

        <button type="button" className="md-add-btn md-add-back" onClick={onBack ?? (() => navigate('/employees'))}>
          <span>←</span>
          <span>Back to Employees</span>
        </button>

        <section className="md-add-card">
          <div className="md-add-eyebrow">02 / ONBOARDING</div>
          <h1 className="md-add-title">Invite Employee</h1>
          <p className="md-add-sub">
            Send an activation invitation to a new team member or appoint an additional company administrator.
          </p>

          <form className="md-add-form" onSubmit={handleSubmit}>
            <div className="md-add-row">
              <div>
                <label htmlFor="firstName" className="md-add-label">
                  First Name *
                </label>
                <div className="md-add-field">
                  <input
                    id="firstName"
                    type="text"
                    className="md-add-input"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Jack"
                    autoComplete="off"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="lastName" className="md-add-label">
                  Last Name *
                </label>
                <div className="md-add-field">
                  <input
                    id="lastName"
                    type="text"
                    className="md-add-input"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Sparrow"
                    autoComplete="off"
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="email" className="md-add-label">
                Corporate Email Address *
              </label>
              <div className="md-add-field">
                <input
                  id="email"
                  type="email"
                  className="md-add-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jack.sparrow@glucode.com"
                  autoComplete="off"
                  required
                />
              </div>
            </div>

            <div className="md-add-row">
              <div>
                <label htmlFor="role" className="md-add-label">
                  Platform Access Role
                </label>
                <div className="md-add-field">
                  <select
                    id="role"
                    className="md-add-input md-add-select"
                    value={role}
                    onChange={(e) => setRole(e.target.value as Role)}
                  >
                    <option value="EMPLOYEE">Standard Employee</option>
                    <option value="ADMIN">Company Administrator</option>
                  </select>
                  <span className="md-add-caret" aria-hidden="true">
                    ▾
                  </span>
                </div>
              </div>

              <div>
                <label htmlFor="department" className="md-add-label">
                  Department (Optional)
                </label>
                <div className="md-add-field">
                  <input
                    id="department"
                    type="text"
                    className="md-add-input"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="Navigation / Marine"
                    autoComplete="off"
                  />
                </div>
              </div>
            </div>

            <label className="md-add-check">
              <input
                type="checkbox"
                checked={sendInviteEmail}
                onChange={(e) => setSendInviteEmail(e.target.checked)}
              />
              <span>Dispatch onboarding email immediately with activation link</span>
            </label>

            <button type="submit" className="md-add-cta">
              <span>Send Invitation</span>
              <ArrowIcon />
            </button>
          </form>
        </section>
      </div>
    </DashboardScreen>
  );
};

export default AddEmployeeForm;