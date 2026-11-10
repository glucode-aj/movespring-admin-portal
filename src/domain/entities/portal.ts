export type ScoringMethod = 'AVERAGE_PER_MEMBER' | 'TOTAL_POINTS';

export interface NewChallenge {
  name: string;
  description: string;
  challengeType: string;
  scoringMethod: ScoringMethod;
  /** Only set for team challenge types. */
  teamCount?: number;
  registrationDeadline: string;
  startDate: string;
  endDate: string;
  stepsPointsRate: number;
}

export type Decision = 'APPROVE' | 'ADJUST' | 'REJECT';

export interface ActivityData {
  employeeName: string;
  activityType: string;
  metricValue: string;
  claimedPoints: string;
  reason: string;
  source: string;
}

export interface ReviewDecision {
  decision: Decision;
  /** Only set when decision is ADJUST. */
  adjustedPoints?: number;
  adminNotes: string;
  notifyUser: boolean;
}

export type Role = 'EMPLOYEE' | 'ADMIN';

export interface NewEmployeeInvite {
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
  department: string;
  sendInviteEmail: boolean;
}

export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  team: string;
  points: string;
  steps: string;
}

export interface Invitation {
  firstName?: string;
  lastName?: string;
  name?: string;
  id: string;
  email: string;
  role: string;
  sent: string;
}

export interface Teammate {
  id: string;
  name: string;
  role: string;
  points: string;
  steps: string;
  pctOfTotal: number;
  isCurrentEmployee?: boolean;
}

export interface Participant {
  id: string;
  name: string;
  points: string;
  team: string;
}
