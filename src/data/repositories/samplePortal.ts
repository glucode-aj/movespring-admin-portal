import type { Employee, Invitation, Participant, Teammate } from '../../domain/entities/portal';
/** Existing demo data, isolated from rendering. Screen props still take precedence. */
export const sampleActiveChallenge = {
    name: 'Challenge A',
    weeksRemaining: 3,
    progressPercentage: 80,
    topTeams: [
      { id: '1', name: 'Team Alpha', points: '12,400 pts/member' },
      { id: '2', name: 'Team Beta', points: '11,150 pts/member' },
      { id: '3', name: 'Team Gamma', points: '9,800 pts/member' },
    ],
  };

export const sampleScheduledChallenges = [
    { id: '1', name: 'Spring Into Motion 2026', startDate: 'Nov 01, 2026', enrolled: '45 enrolled', type: 'Team Challenge' },
    { id: '2', name: '10K Daily Habit Quest', startDate: 'Dec 01, 2026', enrolled: '68 enrolled', type: 'Habit Challenge' },
    { id: '3', name: 'New Year Step Marathon', startDate: 'Jan 05, 2027', enrolled: '82 enrolled', type: 'Goal Challenge' },
  ];

export const sampleEmployee = {
    name: 'Jack Sparrow',
    gender: 'Male',
    age: '35 years',
    height: '178cm',
    team: 'Caribbean',
    metrics: { period: 'October 2026', pointContribution: '14,250', hours: '24.5' },
    flaggedActivities: [
      { id: '1', title: 'Steps Spike', reason: 'Unusually high daily count (>40k)' },
      { id: '2', title: 'Manual Workout', reason: 'Manual 3hr workout entry' },
    ],
    chartBars: [
      { day: '01', heightPct: 65, value: '850 pts' },
      { day: '02', heightPct: 45, value: '600 pts' },
      { day: '03', heightPct: 30, value: '450 pts' },
      { day: '04', heightPct: 55, value: '780 pts' },
      { day: '05', heightPct: 25, value: '380 pts' },
      { day: '06', heightPct: 50, value: '720 pts' },
    ],
  };

export const sampleEmployees: Employee[] = [
    { id: 'usr_01', firstName: 'Jack', lastName: 'Sparrow', email: 'jack@caribbean.com', team: 'Caribbean', points: '34,500 pts', steps: '89,400 steps' },
    { id: 'usr_02', firstName: 'Elizabeth', lastName: 'Swann', email: 'elizabeth@gov.com', team: 'Royal Navy', points: '29,200 pts', steps: '76,500 steps' },
    { id: 'usr_03', firstName: 'Will', lastName: 'Turner', email: 'will@blacksmith.com', team: 'Flying Dutchman', points: '31,000 pts', steps: '81,200 steps' },
  ];

export const samplePendingInvitations: Invitation[] = [
    { id: 'inv_1', email: 'sarah.connor@glucode.com', role: 'Employee', sent: '2 days ago' },
    { id: 'inv_2', email: 'john.doe@glucode.com', role: 'Employee', sent: '4 days ago' },
    { id: 'inv_3', email: 'alex.vance@glucode.com', role: 'Employee', sent: '1 week ago' },
  ];

export const sampleTeamData = (teamName: string) => ({
    name: teamName,
    challenge: 'Challenge A',
    memberCount: 8,
    rank: 1,
    totalTeams: 12,
    scoringMethod: 'Average per member',
    averagePoints: '12,400 pts',
    totalPoints: '99,200 pts',
    goalProgress: 85,
    chartBars: [
      { day: '01', heightPct: 60, points: '14,200 pts' },
      { day: '02', heightPct: 45, points: '10,800 pts' },
      { day: '03', heightPct: 35, points: '8,400 pts' },
      { day: '04', heightPct: 75, points: '17,900 pts' },
      { day: '05', heightPct: 50, points: '12,100 pts' },
      { day: '06', heightPct: 85, points: '20,400 pts' },
      { day: '07', heightPct: 65, points: '15,400 pts' },
    ],
    recentLogs: [
      {
        id: 'log-1',
        name: 'Jack Sparrow',
        action: 'Logged 5.2 km Run',
        points: '+1,800 pts',
        time: '2 hours ago',
      },
      {
        id: 'log-2',
        name: 'Elizabeth Swann',
        action: 'Completed 10,000 Step Milestone',
        points: '+1,000 pts',
        time: '3 hours ago',
      },
      {
        id: 'log-3',
        name: 'Will Turner',
        action: 'Logged 45 min Vigorous Workout',
        points: '+2,250 pts',
        time: '5 hours ago',
      },
      {
        id: 'log-4',
        name: 'Hector Barbossa',
        action: 'Synced Apple Health (7,400 steps)',
        points: '+740 pts',
        time: '6 hours ago',
      },
    ],
    teammates: [
      {
        id: 'usr_01',
        name: 'Jack Sparrow',
        role: 'Captain / Admin',
        points: '34,500 pts',
        steps: '89,400 steps',
        pctOfTotal: 34.8,
        isCurrentEmployee: true,
      },
      {
        id: 'usr_02',
        name: 'Elizabeth Swann',
        role: 'Governor',
        points: '29,200 pts',
        steps: '76,500 steps',
        pctOfTotal: 29.4,
      },
      {
        id: 'usr_03',
        name: 'Will Turner',
        role: 'Blacksmith',
        points: '21,100 pts',
        steps: '54,200 steps',
        pctOfTotal: 21.3,
      },
      {
        id: 'usr_04',
        name: 'Hector Barbossa',
        role: 'First Mate',
        points: '14,400 pts',
        steps: '38,100 steps',
        pctOfTotal: 14.5,
      },
    ] as Teammate[],
  });

export const sampleCHALLENGES = ['Challenge A', 'Spring Into Motion', '10K Habit Quest'] as const;

export const sampleCHART_POINTS: Record<string, string> = {
  'Challenge A': '42,361 199,258 408,307 573,172 684,208 891,77 1142,281 1445,26',
  'Spring Into Motion': '42,330 250,300 430,250 640,260 860,170 1080,150 1260,90 1445,60',
  '10K Habit Quest': '42,345 220,320 400,290 600,230 820,240 1040,160 1240,120 1445,40',
};

export const samplePARTICIPANTS: Participant[] = [
  { id: 'p1', name: 'Jack Sparrow', points: '34,500 pts', team: 'Caribbean' },
  { id: 'p2', name: 'Will Turner', points: '31,000 pts', team: 'Flying Dutchman' },
  { id: 'p3', name: 'Elizabeth Swann', points: '29,200 pts', team: 'Royal Navy' },
];

/** Composition root chooses this demo implementation; screens depend only on the domain port. */
export const samplePortalRepository: import('../../domain/ports/PortalRepository').PortalRepository = {
  dashboard: { activeChallenge: sampleActiveChallenge, scheduledChallenges: sampleScheduledChallenges },
  employees: sampleEmployees,
  pendingInvitations: samplePendingInvitations,
  employeeProfile: sampleEmployee,
  teamProfile: sampleTeamData,
  reports: { challenges: sampleCHALLENGES, chartPoints: sampleCHART_POINTS, participants: samplePARTICIPANTS },
};
