import type { Role, NewEmployeeInvite } from '../../../domain/entities/portal';
export type { Role, NewEmployeeInvite } from '../../../domain/entities/portal';
import { Input, Select } from '../../ui/Input';
import { Button } from '../../ui/Button';
import { Card } from '../../ui/Card';
import React, { useState } from 'react';
import DashboardScreen from '../dashboard/dashboard';
import { navigate } from '../../../core/routing/router';

import type { Tab } from '../../../core/routing/router';

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

        <Button type="button" className="md-add-btn md-add-back" onClick={onBack ?? (() => navigate('/employees'))}>
          <span>←</span>
          <span>Back to Employees</span>
        </Button>

        <Card as="section" variant="elevated" className="md-add-card">
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
                  <Input
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
                  <Input
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
                <Input
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
                  <Select
                    id="role"
                    className="md-add-input md-add-select"
                    value={role}
                    onChange={(e) => setRole(e.target.value as Role)}
                  >
                    <option value="EMPLOYEE">Standard Employee</option>
                    <option value="ADMIN">Company Administrator</option>
                  </Select>
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
                  <Input
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
              <Input
                type="checkbox"
                checked={sendInviteEmail}
                onChange={(e) => setSendInviteEmail(e.target.checked)}
              />
              <span>Dispatch onboarding email immediately with activation link</span>
            </label>

            <Button variant="primary" type="submit" className="md-add-cta">
              <span>Send Invitation</span>
              <ArrowIcon />
            </Button>
          </form>
        </Card>
      </div>
    </DashboardScreen>
  );
};

export default AddEmployeeForm;