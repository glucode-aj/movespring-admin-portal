import React from 'react';
import SignInScreen from './auth/sign-in';
import SignUpScreen from './auth/sign-up';
import DashboardScreen from './(dashboard)/dashboard';
import { navigate, useRoute, Route } from './router';
import { ReportScreen } from './(reports)/reports';

type Tab = 'overview' | 'employees' | 'reports';

const TAB_TO_ROUTE: Record<Tab, Route> = {
  overview: '/dashboard',
  employees: '/employees',
  reports: '/reports',
};

const navigateTab = (tab: Tab) => navigate(TAB_TO_ROUTE[tab]);

const ComingSoon: React.FC<{ title: string }> = ({ title }) => (
  <section className="md-card md-card-id">
    <h2 className="md-company">{title} page coming soon</h2>
  </section>
);

/** Renders whichever screen matches the current URL hash. */
export const AppRouter: React.FC = () => {
  const route = useRoute();

  switch (route) {
    case '/signup':
      return <SignUpScreen key={route} />;
    case '/dashboard':
      return <DashboardScreen key={route} activeTab="overview" onNavigateTab={navigateTab} />;
    case '/employees':
      return (
        <DashboardScreen key={route} activeTab="employees" onNavigateTab={navigateTab}>
          <ComingSoon title="Employees" />
        </DashboardScreen>
      );
    case '/reports':
      return (
        <DashboardScreen key={route} activeTab="reports" onNavigateTab={navigateTab}>
          <ReportScreen />
        </DashboardScreen>
      );
    case '/signin':
    default:
      return <SignInScreen key={route} />;
  }
};

export default AppRouter;