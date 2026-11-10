import { usePortalRepository } from '../../PortalDataProvider';
import type { Employee, Invitation } from '../../../domain/entities/portal';
export type { Employee, Invitation } from '../../../domain/entities/portal';
import { InviteFalconAnimation } from '../../animations/InviteFalconAnimation';
import { usePendingAction } from '../../animations/usePendingAction';
import { Button } from '../../ui/Button';
import { Card } from '../../ui/Card';
import React, { useEffect, useRef, useState } from 'react';
import DashboardScreen from '../dashboard/dashboard';
import EmployeeEmptyStateScreen from './employeeemptystate';
import { navigate } from '../../../core/routing/router';

import type { Tab } from '../../../core/routing/router';
type RoleFilter = 'Admins' | 'Employees' | 'All';

interface EmployeesScreenProps {
  /** Pass your real data. An empty `employees` and `pendingInvitations` shows the empty state. Omit both to use the sample data. */
  employees?: Employee[];
  pendingInvitations?: Invitation[];
  /** Optional override. By default the header tabs navigate via the shared router. */
  onNavigateTab?: (tab: Tab) => void;
  onSelectEmployee?: (id: string) => void;
  onAddEmployee?: () => void;
  adminName?: string;
  onResendInvitation?: (invitation: Invitation) => void | Promise<void>;
}

/**
 * Employees page. It reuses DashboardScreen for the full-viewport layout,
 * header bar and tab navigation, and only adds the styles below.
 */

const ROLE_OPTIONS: RoleFilter[] = ['Admins', 'Employees', 'All'];

export const EmployeesScreen: React.FC<EmployeesScreenProps> = ({
  employees: employeesProp,
  pendingInvitations: invitationsProp,
  onNavigateTab,
  onSelectEmployee,
  onAddEmployee,
  onResendInvitation,
  adminName = 'Mandlakazi',
}) => {
  const repository = usePortalRepository();

  const [recipient, setRecipient] = useState<Invitation | null>(null);
  const { pending, error: resendError, run } = usePendingAction();
  const handleResend = (invitation: Invitation) => {
    void run(async () => {
      if (onResendInvitation) await onResendInvitation(invitation);
      setRecipient(invitation);
    });
  };
  const [roleFilter, setRoleFilter] = useState<RoleFilter>('Admins');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  // Close the dropdown on outside click or Escape
  useEffect(() => {
    if (!dropdownOpen) return;
    const onDown = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
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

  // Built-in mock data
  const employees: Employee[] = employeesProp ?? repository.employees;

  const pendingInvitations: Invitation[] = invitationsProp ?? repository.pendingInvitations;

  // Open the details page by default; pass onSelectEmployee to override (e.g. to route by id).
  const handleSelect = (id: string) => (onSelectEmployee ? onSelectEmployee(id) : navigate('/employee-details'));

  // Open the add-employee form by default; pass onAddEmployee to override.
  const handleAdd = () => (onAddEmployee ? onAddEmployee() : navigate('/add-employee'));

  // Nothing to show yet: render the empty state (same header and tabs)
  if (employees.length === 0 && pendingInvitations.length === 0) {
    return (
      <EmployeeEmptyStateScreen
        onNavigateTab={onNavigateTab}
        onInviteFirstEmployee={handleAdd}
        adminName={adminName}
      />
    );
  }

  return (
    <DashboardScreen activeTab="employees" onNavigateTab={onNavigateTab} adminName={adminName}>
      <div className="md-emp">

        {/* Action & filter bar */}
        <div className="md-emp-bar">
          <Button type="button" className="md-emp-btn md-emp-add" onClick={handleAdd}>
            <span className="md-emp-plus">+</span>
            <span>Add Employee</span>
          </Button>

          <div className="md-emp-filter-wrap" ref={filterRef}>
            <Button
              type="button"
              className="md-emp-btn md-emp-filter"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              aria-haspopup="listbox"
              aria-expanded={dropdownOpen}
            >
              <span>{roleFilter}</span>
              <span className="md-emp-caret">▾</span>
            </Button>

            {dropdownOpen && (
              <div className="md-emp-menu" role="listbox">
                {ROLE_OPTIONS.map((role) => (
                  <Button
                    key={role}
                    type="button"
                    role="option"
                    aria-selected={roleFilter === role}
                    className={`md-emp-btn md-emp-item${roleFilter === role ? ' md-selected' : ''}`}
                    onClick={() => {
                      setRoleFilter(role);
                      setDropdownOpen(false);
                    }}
                  >
                    {role}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Employee rows */}
        <div className="md-emp-list">
          {employees.map((emp) => (
            <div
              key={emp.id}
              className="md-sched-row md-emp-row"
              role="button"
              tabIndex={0}
              onClick={() => handleSelect(emp.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleSelect(emp.id);
                }
              }}
            >
              <Card className="md-sched-inner">
                <div className="md-emp-who">
                  <span className="md-emp-avatar" aria-hidden="true" />
                  <div>
                    <div className="md-emp-name">
                      {emp.firstName} {emp.lastName}
                    </div>
                    <div className="md-emp-meta">
                      {emp.email} • Team: {emp.team}
                    </div>
                  </div>
                </div>

                <div className="md-emp-stats">
                  <span className="md-emp-steps">{emp.steps}</span>
                  <span className="md-emp-points">{emp.points}</span>
                  <span className="md-emp-arrow">→</span>
                </div>
              </Card>
            </div>
          ))}
        </div>

        {recipient && <InviteFalconAnimation senderName={adminName} recipientName={recipient.name || [recipient.firstName, recipient.lastName].filter(Boolean).join(' ') || recipient.email} onClose={() => setRecipient(null)} />}
        {resendError && <p role="alert" className="ui-animation-error">{resendError}</p>}
        {/* Pending invitations */}
        <section className="md-emp-pending">
          <div className="md-emp-pending-title">Pending Invitations</div>
          <div className="md-emp-inv-list">
            {pendingInvitations.map((inv) => (
              <Card key={inv.id} className="md-emp-inv">
                <div className="md-emp-inv-left">
                  <span className="md-sched-name">{inv.email}</span>
                  <span className="md-muted">[{inv.role}]</span>
                </div>
                <div className="md-emp-inv-right">
                  <span className="md-muted">Sent {inv.sent}</span>
                  <Button
                    type="button"
                    className="md-emp-btn md-emp-resend"
                    disabled={pending}
                    onClick={() => handleResend(inv)}
                  >
                    Resend
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </DashboardScreen>
  );
};

export default EmployeesScreen;