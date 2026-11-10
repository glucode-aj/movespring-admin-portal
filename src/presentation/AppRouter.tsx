import React from 'react';
import SignInScreen from './screens/auth/sign-in';
import SignUpScreen from './screens/auth/sign-up';
import DashboardScreen from './screens/dashboard/dashboard';
import EmployeesScreen from './screens/employees/employees';
import EmployeeEmptyStateScreen from './screens/employees/employeeemptystate';
import EmployeeDetailsScreen from './screens/employees/employeedetailsscreen';
import TeamActivityScreen from './screens/employees/teamactivityscreen';
import AddEmployeeForm from './screens/employees/addemployeescreen';
import ReportScreen from './screens/reports/reports';
import ActivityReviewForm from './screens/employees/activityreviewscreen';
import AddChallengeForm from './screens/challenges/addchallengeform';
import { useRoute } from '../core/routing/router';

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
    case '/add-challenge':
      return <AddChallengeForm key={route} />;
    case '/activity-review':
      return <ActivityReviewForm key={route} />;
    case '/employee-details':
      return <EmployeeDetailsScreen key={route} />;
    case '/team-activity':
      return <TeamActivityScreen key={route} />;
    case '/employees-empty':
      return <EmployeeEmptyStateScreen key={route} />;
    case '/reports':
      return <ReportScreen key={route} />;
    case '/signin':
    default:
      return <SignInScreen key={route} />;
  }
};

export default AppRouter;