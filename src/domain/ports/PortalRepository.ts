import type { Employee, Invitation, Participant, Teammate } from '../entities/portal';

export interface PortalRepository {
  dashboard: {
    activeChallenge: { name: string; weeksRemaining: number; progressPercentage: number; topTeams: { id: string; name: string; points: string }[] };
    scheduledChallenges: { id: string; name: string; startDate: string; enrolled: string; type: string }[];
  };
  employees: Employee[];
  pendingInvitations: Invitation[];
  employeeProfile: {
    name: string; gender: string; age: string; height: string; team: string;
    metrics: { period: string; pointContribution: string; hours: string };
    flaggedActivities: { id: string; title: string; reason: string }[];
    chartBars: { day: string; heightPct: number; value: string }[];
  };
  teamProfile: (teamName: string) => {
    name: string; challenge: string; memberCount: number; rank: number; totalTeams: number;
    scoringMethod: string; averagePoints: string; totalPoints: string; goalProgress: number;
    chartBars: { day: string; heightPct: number; points: string }[];
    recentLogs: { id: string; name: string; action: string; points: string; time: string }[];
    teammates: Teammate[];
  };
  reports: { challenges: readonly string[]; chartPoints: Record<string, string>; participants: Participant[] };
}
