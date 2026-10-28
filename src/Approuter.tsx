import React from 'react';
import SignInScreen from './auth/sign-in';
import SignUpScreen from './auth/sign-up';
import DashboardScreen from './(dashboard)/dashboard';
import EmployeesScreen from './(employees)/employees';
import EmployeeEmptyStateScreen from './(employees)/employeeemptystate';
import EmployeeDetailsScreen from './(employees)/employeedetailsscreen';
import AddEmployeeForm from './(employees)/addemployeescreen';
import ReportScreen from './(reports)/reports';
import ActivityReviewForm from './(employees)/(activity)/activityreviewscreen';
import AddChallengeForm from './(challenge)/addchallengeform';
import { useRoute } from './router';

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