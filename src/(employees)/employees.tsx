import React, { useEffect, useRef, useState } from 'react';
import DashboardScreen from '../(dashboard)/dashboard';
import EmployeeEmptyStateScreen from '../(employees)/employeeemptystate';
import { navigate } from '../router';

type Tab = 'overview' | 'employees' | 'reports';
type RoleFilter = 'Admins' | 'Employees' | 'All';

interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  team: string;
  points: string;
  steps: string;
}

interface Invitation {
  id: string;
  email: string;
  role: string;
  sent: string;
}

interface EmployeesScreenProps {
  /** Pass your real data. An empty `employees` and `pendingInvitations` shows the empty state. Omit both to use the sample data. */
  employees?: Employee[];
  pendingInvitations?: Invitation[];
  /** Optional override. By default the header tabs navigate via the shared router. */
  onNavigateTab?: (tab: Tab) => void;
  onSelectEmployee?: (id: string) => void;
  onAddEmployee?: () => void;
  adminName?: string;
}

/**
 * Employees page. It reuses DashboardScreen for the full-viewport layout,
 * header bar and tab navigation, and only adds the styles below.
 */
const CSS = `
.md-root .md-emp { display: flex; flex-direction: column; gap: 32px; }

.md-root .md-emp-bar { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 16px; }

/* Button reset (host-app safe) */
.md-root .md-emp-btn {
  appearance: none;
  margin: 0;
  padding: 0;
  border: 0;
  background: none;
  color: inherit;
  font: inherit;
  text-align: inherit;
  cursor: pointer;
}
.md-root .md-emp-btn:focus { outline: none; }
.md-root .md-emp-btn:focus-visible { outline: 2px solid #000000; outline-offset: 2px; }

.md-root .md-emp-add {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 16px 28px;
  background: #D9D9D9;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 700;
  line-height: 1;
  transition: background 0.15s, box-shadow 0.15s;
}
.md-root .md-emp-add:hover { background: #cfcfcf; box-shadow: inset 0 0 0 1px #000000; }
.md-root .md-emp-plus { font-size: 18px; line-height: 1; }

.md-root .md-emp-filter-wrap { position: relative; }
.md-root .md-emp-filter {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  min-width: 140px;
  padding: 16px 20px;
  background: #D9D9D9;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 700;
  line-height: 1;
  transition: background 0.15s, box-shadow 0.15s;
}
.md-root .md-emp-filter:hover { background: #cfcfcf; box-shadow: inset 0 0 0 1px #000000; }
.md-root .md-emp-caret { font-size: 12px; }

.md-root .md-emp-menu {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  z-index: 20;
  width: 176px;
  padding: 4px 0;
  background: #ffffff;
  border: 1px solid #000000;
  box-shadow: 4px 4px 0 0 #000000;
}
.md-root .md-emp-item { display: block; width: 100%; padding: 10px 16px; font-size: 12px; line-height: 1.2; }
.md-root .md-emp-item:hover { background: #f2f2f2; }
.md-root .md-emp-item.md-selected { background: #D9D9D9; font-weight: 700; }

/* Employee rows (reuse .md-sched-row / .md-sched-inner from the dashboard) */
.md-root .md-emp-list { display: flex; flex-direction: column; gap: 20px; }
.md-root .md-emp-row { cursor: pointer; transition: background 0.15s; }
.md-root .md-emp-row:hover { background: #cfcfcf; }
.md-root .md-emp-row:focus-visible { outline: 2px solid #000000; outline-offset: 2px; }
.md-root .md-emp-who { display: flex; align-items: center; gap: 16px; min-width: 0; }
.md-root .md-emp-avatar { flex: none; width: 40px; height: 40px; background: #000000; border-radius: 9999px; }
.md-root .md-emp-name { font-size: 14px; font-weight: 700; line-height: 1.3; }
.md-root .md-emp-meta { font-size: 12px; line-height: 1.3; color: #525252; }
.md-root .md-emp-stats { display: flex; align-items: center; gap: 24px; font-size: 12px; }
.md-root .md-emp-steps { color: #404040; }
.md-root .md-emp-points { font-weight: 700; }
.md-root .md-emp-arrow { font-size: 14px; font-weight: 700; }

/* Pending invitations */
.md-root .md-emp-pending { display: flex; flex-direction: column; gap: 16px; padding: 32px; background: #D9D9D9; border-radius: 24px; }
.md-root .md-emp-pending-title { font-size: 14px; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase; }
.md-root .md-emp-inv-list { display: flex; flex-direction: column; gap: 12px; }
.md-root .md-emp-inv {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 8px 16px;
  min-height: 56px;
  padding: 8px 24px;
  border: 2px dashed #4f4f4f;
  font-size: 13px;
}
.md-root .md-emp-inv-left, .md-root .md-emp-inv-right { display: flex; flex-wrap: wrap; align-items: center; gap: 4px 16px; }
.md-root .md-emp-resend {
  padding: 5px 12px;
  background: #ffffff;
  border: 1px solid #000000;
  font-size: 12px;
  font-weight: 700;
  line-height: 1.4;
  transition: background 0.15s, color 0.15s;
}
.md-root .md-emp-resend:hover { background: #000000; color: #ffffff; }

@media (max-width: 900px) {
  .md-root .md-emp-steps { display: none; }
  .md-root .md-emp-pending { padding: 20px; }
}
@media (max-width: 640px) {
  .md-root .md-emp-meta { display: none; }
}
`;

const ROLE_OPTIONS: RoleFilter[] = ['Admins', 'Employees', 'All'];

export const EmployeesScreen: React.FC<EmployeesScreenProps> = ({
  employees: employeesProp,
  pendingInvitations: invitationsProp,
  onNavigateTab,
  onSelectEmployee,
  onAddEmployee,
  adminName = 'Mandlakazi',
}) => {
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
  const employees: Employee[] = employeesProp ?? [
    { id: 'usr_01', firstName: 'Jack', lastName: 'Sparrow', email: 'jack@caribbean.com', team: 'Caribbean', points: '34,500 pts', steps: '89,400 steps' },
    { id: 'usr_02', firstName: 'Elizabeth', lastName: 'Swann', email: 'elizabeth@gov.com', team: 'Royal Navy', points: '29,200 pts', steps: '76,500 steps' },
    { id: 'usr_03', firstName: 'Will', lastName: 'Turner', email: 'will@blacksmith.com', team: 'Flying Dutchman', points: '31,000 pts', steps: '81,200 steps' },
  ];

  const pendingInvitations: Invitation[] = invitationsProp ?? [
    { id: 'inv_1', email: 'sarah.connor@glucode.com', role: 'Employee', sent: '2 days ago' },
    { id: 'inv_2', email: 'john.doe@glucode.com', role: 'Employee', sent: '4 days ago' },
    { id: 'inv_3', email: 'alex.vance@glucode.com', role: 'Employee', sent: '1 week ago' },
  ];

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
        <style>{CSS}</style>

        {/* Action & filter bar */}
        <div className="md-emp-bar">
          <button type="button" className="md-emp-btn md-emp-add" onClick={handleAdd}>
            <span className="md-emp-plus">+</span>
            <span>Add Employee</span>
          </button>

          <div className="md-emp-filter-wrap" ref={filterRef}>
            <button
              type="button"
              className="md-emp-btn md-emp-filter"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              aria-haspopup="listbox"
              aria-expanded={dropdownOpen}
            >
              <span>{roleFilter}</span>
              <span className="md-emp-caret">▾</span>
            </button>

            {dropdownOpen && (
              <div className="md-emp-menu" role="listbox">
                {ROLE_OPTIONS.map((role) => (
                  <button
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
                  </button>
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
              <div className="md-sched-inner">
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
              </div>
            </div>
          ))}
        </div>

        {/* Pending invitations */}
        <section className="md-emp-pending">
          <div className="md-emp-pending-title">Pending Invitations</div>
          <div className="md-emp-inv-list">
            {pendingInvitations.map((inv) => (
              <div key={inv.id} className="md-emp-inv">
                <div className="md-emp-inv-left">
                  <span className="md-sched-name">{inv.email}</span>
                  <span className="md-muted">[{inv.role}]</span>
                </div>
                <div className="md-emp-inv-right">
                  <span className="md-muted">Sent {inv.sent}</span>
                  <button
                    type="button"
                    className="md-emp-btn md-emp-resend"
                    onClick={() => alert(`Resent invitation to ${inv.email}`)}
                  >
                    Resend
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </DashboardScreen>
  );
};

export default EmployeesScreen;