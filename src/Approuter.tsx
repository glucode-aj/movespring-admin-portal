import React from 'react';
import SignInScreen from './auth/sign-in';
import SignUpScreen from './auth/sign-up';
import DashboardScreen from './(dashboard)/dashboard';
import EmployeesScreen from './(employees)/employees';
import EmployeeEmptyStateScreen from './(employees)/employeeemptystate';
import EmployeeDetailsScreen from './(employees)/employeedetailsscreen';
import AddEmployeeForm from './(employees)/addemployeescreen';
import ActivityReviewForm from './(employees)/(activity)/activityreviewscreen';
import { useRoute } from './router';
import ReportScreen from './(reports)/reports';
import { navigate, Route } from './router';

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
/** Renders whichever screen matches the current URL hash. Each screen handles its own navigation. */
export const AppRouter: React.FC = () => {
  const route = useRoute();

  switch (route) {
    case '/signup':
      return <SignUpScreen key={route} />;
    case '/dashboard':
      return <DashboardScreen key={route} activeTab="overview" />;
    case '/employees':
      return <EmployeesScreen key={route} />;
    case '/add-employee':
      return <AddEmployeeForm key={route} />;
    case '/activity-review':
      return <ActivityReviewForm key={route} />;
    case '/employee-details':
      return <EmployeeDetailsScreen key={route} />;
    case '/employees-empty':
      return <EmployeeEmptyStateScreen key={route} />;
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