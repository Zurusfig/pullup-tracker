export const LEAGUES = [
  { id: 'bronze', name: 'Bronze', minXP: 0, color: '#CD7F32' },
  { id: 'silver', name: 'Silver', minXP: 500, color: '#C0C0C0' },
  { id: 'gold', name: 'Gold', minXP: 1500, color: '#FFC800' },
  { id: 'platinum', name: 'Platinum', minXP: 3000, color: '#1CB0F6' },
  { id: 'diamond', name: 'Diamond', minXP: 6000, color: '#9333EA' },
];

export function leagueForXP(xp) {
  return [...LEAGUES].reverse().find((l) => xp >= l.minXP) || LEAGUES[0];
}

export function nextLeagueForXP(xp) {
  const current = leagueForXP(xp);
  const idx = LEAGUES.findIndex((l) => l.id === current.id);
  return LEAGUES[idx + 1] || null;
}

export function levelForXP(xp) {
  return Math.floor(xp / 100) + 1;
}

export function xpForSession(session, prsBroken) {
  return session.totalReps + 25 + prsBroken.length * 50;
}

export const BADGES = [
  { id: 'first_rep', name: 'First pull-up', description: 'Count your first rep ever' },
  { id: 'rep_10', name: 'Getting started', description: 'Complete a set of 10+ reps' },
  { id: 'rep_50_day', name: 'Fifty in a day', description: '50 total reps in one day' },
  { id: 'rep_100_day', name: 'Century', description: '100 total reps in one day' },
  { id: 'rep_1000_total', name: 'Four digits', description: '1000 all-time reps' },
  { id: 'streak_3', name: 'On a roll', description: '3-day streak' },
  { id: 'streak_7', name: 'Week warrior', description: '7-day streak' },
  { id: 'streak_30', name: 'Iron will', description: '30-day streak' },
  { id: 'best_set_5', name: 'High five', description: 'Single set of 5+ reps' },
  { id: 'best_set_10', name: 'Double digits', description: 'Single set of 10+ reps' },
  { id: 'best_set_20', name: 'Beast mode', description: 'Single set of 20+ reps' },
  { id: 'sessions_10', name: 'Consistent', description: '10 total sessions' },
];

export function checkBadges(profile, session, todayTotal, totalSessions, allTimeReps) {
  const earned = [];
  const has = (id) => profile.badges?.includes(id);
  const topReps = session.topSets?.[0]?.reps ?? 0;

  if (!has('first_rep') && session.totalReps > 0) earned.push('first_rep');
  if (!has('rep_10') && topReps >= 10) earned.push('rep_10');
  if (!has('rep_50_day') && todayTotal >= 50) earned.push('rep_50_day');
  if (!has('rep_100_day') && todayTotal >= 100) earned.push('rep_100_day');
  if (!has('rep_1000_total') && allTimeReps >= 1000) earned.push('rep_1000_total');
  if (!has('streak_3') && profile.streak >= 3) earned.push('streak_3');
  if (!has('streak_7') && profile.streak >= 7) earned.push('streak_7');
  if (!has('streak_30') && profile.streak >= 30) earned.push('streak_30');
  if (!has('best_set_5') && topReps >= 5) earned.push('best_set_5');
  if (!has('best_set_10') && topReps >= 10) earned.push('best_set_10');
  if (!has('best_set_20') && topReps >= 20) earned.push('best_set_20');
  if (!has('sessions_10') && totalSessions >= 10) earned.push('sessions_10');

  return earned;
}

export function badgeById(id) {
  return BADGES.find((b) => b.id === id);
}

export function streakMilestone(streak) {
  return [3, 7, 14, 30].includes(streak) ? streak : null;
}

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function yesterdayStr() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

export function nextStreak(lastWorkout, currentStreak) {
  const today = todayStr();
  const yesterday = yesterdayStr();
  if (lastWorkout === today) return currentStreak;
  if (lastWorkout === yesterday) return currentStreak + 1;
  return 1;
}

export function streakOnOpen(lastWorkout, currentStreak) {
  if (!lastWorkout) return 0;
  const today = todayStr();
  const yesterday = yesterdayStr();
  if (lastWorkout === today || lastWorkout === yesterday) return currentStreak;
  return 0;
}
