/** ISO calendar dates compare lexicographically; messages preserve the existing form copy. */
export function validateChallengeSchedule(registrationDeadline: string, startDate: string, endDate: string): string {
  if (registrationDeadline > startDate) return 'Registration must close on or before the start date.';
  if (endDate <= startDate) return 'The end date must be after the start date.';
  return '';
}
