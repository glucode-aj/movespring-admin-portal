import React, { useState } from 'react';

interface EmployeesScreenProps {
  onNavigateTab?: (tab: 'overview' | 'employees' | 'reports') => void;
  onSelectEmployee?: (id: string) => void;
  onAddEmployee?: () => void;
  adminName?: string;
}

export const EmployeesScreen: React.FC<EmployeesScreenProps> = ({
  onNavigateTab,
  onSelectEmployee,
  onAddEmployee,
  adminName = 'Mandlakazi',
}) => {
  const [roleFilter, setRoleFilter] = useState<'Admins' | 'Employees' | 'All'>('Admins');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Built-in Mock Data matching the design screenshots
  const employees = [
    {
      id: 'usr_01',
      firstName: 'Jack',
      lastName: 'Sparrow',
      email: 'jack@caribbean.com',
      team: 'Caribbean',
      points: '34,500 pts',
      steps: '89,400 steps',
    },
    {
      id: 'usr_02',
      firstName: 'Elizabeth',
      lastName: 'Swann',
      email: 'elizabeth@gov.com',
      team: 'Royal Navy',
      points: '29,200 pts',
      steps: '76,500 steps',
    },
    {
      id: 'usr_03',
      firstName: 'Will',
      lastName: 'Turner',
      email: 'will@blacksmith.com',
      team: 'Flying Dutchman',
      points: '31,000 pts',
      steps: '81,200 steps',
    },
  ];

  const pendingInvitations = [
    { id: 'inv_1', email: 'sarah.connor@glucode.com', role: 'Employee', sent: '2 days ago' },
    { id: 'inv_2', email: 'john.doe@glucode.com', role: 'Employee', sent: '4 days ago' },
    { id: 'inv_3', email: 'alex.vance@glucode.com', role: 'Employee', sent: '1 week ago' },
  ];

  return (
    <div className="min-h-screen w-full bg-white font-mono p-4 sm:p-6 md:p-8 flex flex-col gap-8 antialiased select-none text-black">
      {/* 1. Global Header Navigation Pill Bar */}
      <header className="w-full bg-[#D9D9D9] rounded-full p-2.5 sm:p-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white flex items-center justify-center border border-black shadow-sm">
            <svg className="w-6 h-6 text-black" viewBox="0 0 100 100" fill="currentColor">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M50 15C30.67 15 15 30.67 15 50C15 69.33 30.67 85 50 85C56.63 85 62.84 83.16 68.12 79.98L58.5 65.5C55.93 67.09 52.93 68 50 68C40.06 68 32 59.94 32 50C32 40.06 40.06 32 50 32C59.94 32 68 40.06 68 50H85C85 30.67 69.33 15 50 15Z"
              />
            </svg>
          </div>

          <nav className="inline-flex items-center rounded-full border border-black bg-[#D9D9D9] p-1">
            <button
              type="button"
              onClick={() => onNavigateTab && onNavigateTab('overview')}
              className="rounded-full px-4 sm:px-6 py-1.5 text-xs sm:text-sm font-medium text-black hover:opacity-75 transition-opacity"
            >
              Overview
            </button>
            <button
              type="button"
              onClick={() => onNavigateTab && onNavigateTab('employees')}
              className="rounded-full bg-white border border-black px-4 sm:px-6 py-1.5 text-xs sm:text-sm font-bold text-black shadow-sm"
            >
              Employees
            </button>
            <button
              type="button"
              onClick={() => onNavigateTab && onNavigateTab('reports')}
              className="rounded-full px-4 sm:px-6 py-1.5 text-xs sm:text-sm font-medium text-black hover:opacity-75 transition-opacity"
            >
              Reports
            </button>
          </nav>
        </div>

        <div className="flex items-center gap-3 bg-white border border-black rounded-full px-4 py-1.5 shadow-sm">
          <div className="w-6 h-6 rounded-full bg-black flex items-center justify-center text-white text-[10px] font-bold">
            {adminName.charAt(0)}
          </div>
          <span className="text-xs sm:text-sm font-bold text-black hidden sm:inline">
            {adminName}
          </span>
        </div>
      </header>

      {/* 2. Action & Filter Bar */}
      <div className="flex items-center justify-between w-full">
        {/* Left Action Button */}
        <button
          type="button"
          onClick={onAddEmployee}
          className="bg-[#D9D9D9] hover:bg-neutral-300 text-black px-6 py-2.5 rounded-sm font-bold text-xs sm:text-sm flex items-center gap-2 border border-transparent hover:border-black transition-all cursor-pointer"
        >
          <span className="text-base font-bold">+</span>
          <span>Add Employee</span>
        </button>

        {/* Right Role Filter Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center justify-between gap-3 bg-[#D9D9D9] hover:bg-neutral-300 rounded-xl px-5 py-2.5 text-xs sm:text-sm font-bold text-black border border-transparent hover:border-black transition-all cursor-pointer"
          >
            <span>{roleFilter}</span>
            <span className="text-xs">▾</span>
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-44 bg-white border border-black shadow-[4px_4px_0px_0px_#000000] z-20 py-1">
              {(['Admins', 'Employees', 'All'] as const).map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => {
                    setRoleFilter(role);
                    setDropdownOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-xs font-mono transition-colors ${
                    roleFilter === role ? 'font-bold bg-[#D9D9D9]' : 'hover:bg-neutral-100'
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Content: Active Employee Cards */}
      <main className="flex flex-col gap-8">
        {/* Active Employee Rows */}
        <div className="flex flex-col gap-4">
          {employees.map((emp) => (
            <div
              key={emp.id}
              onClick={() => onSelectEmployee && onSelectEmployee(emp.id)}
              className="w-full bg-[#D9D9D9] p-2 rounded-sm cursor-pointer hover:bg-neutral-300 transition-colors"
              role="button"
              tabIndex={0}
            >
              <div className="w-full h-16 border border-dashed border-black flex items-center justify-between px-4 sm:px-6">
                {/* Left: Solid Black Circular Avatar & Identity */}
                <div className="flex items-center gap-4">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black flex-shrink-0" />
                  <div className="flex flex-col">
                    <span className="font-bold text-sm text-black">
                      {emp.firstName} {emp.lastName}
                    </span>
                    <span className="text-xs text-neutral-600 hidden sm:inline">
                      {emp.email} • Team: {emp.team}
                    </span>
                  </div>
                </div>

                {/* Right: Metrics / Link Arrow */}
                <div className="flex items-center gap-4 sm:gap-6 text-xs font-mono">
                  <span className="hidden md:inline text-neutral-700">
                    {emp.steps}
                  </span>
                  <span className="font-bold text-black">
                    {emp.points}
                  </span>
                  <span className="text-black font-bold text-sm">→</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pending Invitations Section */}
        <section className="w-full bg-[#D9D9D9] rounded-2xl p-6 sm:p-8 flex flex-col gap-4">
          <div className="text-sm font-bold text-black uppercase tracking-wider">
            Pending Invitations
          </div>

          <div className="flex flex-col gap-3">
            {pendingInvitations.map((inv) => (
              <div
                key={inv.id}
                className="w-full h-14 border border-dashed border-black flex items-center justify-between px-4 sm:px-6 text-xs sm:text-sm bg-[#D9D9D9]"
              >
                <div className="flex items-center gap-3">
                  <span className="font-bold text-black">{inv.email}</span>
                  <span className="text-neutral-600 text-xs hidden md:inline">[{inv.role}]</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-neutral-600 text-xs">Sent {inv.sent}</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      alert(`Resent invitation to ${inv.email}`);
                    }}
                    className="px-3 py-1 bg-white border border-black text-xs font-bold hover:bg-black hover:text-white transition-colors cursor-pointer"
                  >
                    Resend
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default EmployeesScreen;