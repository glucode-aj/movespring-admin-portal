import React from 'react';
import DashboardScreen from '../(dashboard)/dashboard';

type Tab = 'overview' | 'employees' | 'reports';

interface EmployeeEmptyStateScreenProps {
  /** Optional override. By default the header tabs navigate via the shared router. */
  onNavigateTab?: (tab: Tab) => void;
  onInviteFirstEmployee?: () => void;
  adminName?: string;
}

/**
 * Empty state for the Employees page. Reuses DashboardScreen for the full-viewport
 * layout, header bar and tab navigation, and only adds the styles below.
 */
const CSS = `
.md-root .md-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 600px;
  padding: 24px;
  background: #ffffff;
  border: 2px dashed #4f4f4f;
}
.md-root .md-empty-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;
  width: 100%;
  max-width: 448px;
}
.md-root .md-empty-frame {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 320px;
  max-width: 100%;
  height: 256px;
  padding: 16px;
  background: #ffffff;
  border: 2px dashed #4f4f4f;
}
.md-root .md-empty-frame svg { width: 192px; height: 192px; color: #000000; }
.md-root .md-empty-note {
  padding: 14px 24px;
  background: #D9D9D9;
  text-align: center;
  font-size: 14px;
  line-height: 1.4;
  color: #000000;
}

/* Primary CTA (same look as the sign-in "Launch interface" button) */
.md-root .md-empty-cta {
  appearance: none;
  display: flex;
  align-items: center;
  gap: 24px;
  margin: 0 6px 6px 0;
  padding: 16px 28px;
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
.md-root .md-empty-cta:hover { background: #F3A15E; }
.md-root .md-empty-cta:active { background: #E07D2C; transform: translate(4px, 4px); box-shadow: none; }
.md-root .md-empty-cta:focus { outline: none; }
.md-root .md-empty-cta:focus-visible { outline: 2px solid #000000; outline-offset: 4px; }
.md-root .md-empty-cta svg { flex: none; }

@media (max-width: 900px) {
  .md-root .md-empty { min-height: 480px; padding: 16px; }
}
`;

/** Shrugging character illustration. */
const ShrugIllustration: React.FC = () => (
  <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Character shrugging">
    {/* Hair back */}
    <path d="M60 90C60 55 75 35 100 35C125 35 140 55 140 90C140 120 125 130 100 130C75 130 60 120 60 90Z" fill="black" />
    {/* Face */}
    <path d="M72 85C72 65 85 52 100 52C115 52 128 65 128 85C128 108 115 122 100 122C85 122 72 108 72 85Z" fill="white" />
    {/* Bangs */}
    <path d="M72 75C80 60 100 62 100 62C100 62 120 60 128 75C120 68 112 66 100 67C88 66 80 68 72 75Z" fill="black" />
    {/* Eyes */}
    <ellipse cx="88" cy="85" rx="5" ry="4" fill="black" />
    <ellipse cx="112" cy="85" rx="5" ry="4" fill="black" />
    <circle cx="89" cy="83" r="1.5" fill="white" />
    <circle cx="113" cy="83" r="1.5" fill="white" />
    {/* Eyebrows */}
    <path d="M82 78Q88 74 94 77" stroke="black" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M106 77Q112 74 118 78" stroke="black" strokeWidth="2.5" strokeLinecap="round" />
    {/* Mouth */}
    <path d="M93 105Q100 103 107 105" stroke="black" strokeWidth="2.5" strokeLinecap="round" />
    {/* Arms and palms */}
    <path d="M52 118Q65 116 75 125L77 155" stroke="black" strokeWidth="3" strokeLinecap="round" fill="none" />
    <path d="M148 118Q135 116 125 125L123 155" stroke="black" strokeWidth="3" strokeLinecap="round" fill="none" />
    <path d="M45 120C45 120 52 116 58 122C64 128 55 132 50 130" stroke="black" strokeWidth="3" strokeLinecap="round" fill="none" />
    <path d="M155 120C155 120 148 116 142 122C136 128 145 132 150 130" stroke="black" strokeWidth="3" strokeLinecap="round" fill="none" />
    {/* Legs */}
    <path d="M85 135V165" stroke="black" strokeWidth="3" />
    <path d="M115 135V165" stroke="black" strokeWidth="3" />
  </svg>
);

const ArrowIcon: React.FC = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

export const EmployeeEmptyStateScreen: React.FC<EmployeeEmptyStateScreenProps> = ({
  onNavigateTab,
  onInviteFirstEmployee,
  adminName = 'Mandlakazi',
}) => (
  <DashboardScreen activeTab="employees" onNavigateTab={onNavigateTab} adminName={adminName}>
    <section className="md-empty">
      <style>{CSS}</style>
      <div className="md-empty-inner">
        <div className="md-empty-frame">
          <ShrugIllustration />
        </div>

        <div className="md-empty-note">No employees added to this company yet</div>

        <button type="button" className="md-empty-cta" onClick={onInviteFirstEmployee}>
          <span>Invite First Employee</span>
          <ArrowIcon />
        </button>
      </div>
    </section>
  </DashboardScreen>
);

export default EmployeeEmptyStateScreen;