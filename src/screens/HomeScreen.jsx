import { Trophy, ChevronRight } from 'lucide-react';
import Card from '../components/ui/Card';
import MetricTile from '../components/ui/MetricTile';
import Button from '../components/ui/Button';
import XPBar from '../components/gamification/XPBar';
import StreakBadge from '../components/gamification/StreakBadge';
import LeagueBadge from '../components/gamification/LeagueBadge';

export default function HomeScreen({ profile, sessions, prJustBroken, onStartWorkout, onOpenHistory }) {
  const today = new Date().toISOString().slice(0, 10);
  const todaysSessions = sessions.filter((s) => s.date === today);
  const todaysReps = todaysSessions.reduce((sum, s) => sum + s.totalReps, 0);
  const lastSession = sessions[0];

  return (
    <div className="flex flex-col gap-4 p-4 pb-28 max-w-lg mx-auto w-full">
      <div className="flex items-center justify-between">
        <LeagueBadge leagueId={profile.league} size="sm" />
        <h1 className="font-extrabold text-xl text-gray-900 dark:text-white">Pull-up Tracker</h1>
        <StreakBadge streak={profile.streak} />
      </div>

      <XPBar totalXP={profile.totalXP} level={profile.level} league={profile.league} />

      <div className="flex gap-3">
        <MetricTile label="Today's reps" value={todaysReps} accent="#58CC02" />
        <MetricTile label="Sessions today" value={todaysSessions.length} accent="#1CB0F6" />
      </div>

      {prJustBroken && (
        <div className="flex items-center gap-3 bg-brand-green/10 border border-brand-green/30 rounded-2xl px-4 py-3">
          <Trophy size={24} className="text-brand-green" />
          <p className="font-bold text-gray-800 dark:text-gray-100">
            You broke a personal record last session!
          </p>
        </div>
      )}

      <Button color="green" onClick={onStartWorkout} className="text-xl py-5">
        Start workout
      </Button>

      {lastSession && (
        <button onClick={onOpenHistory} className="text-left">
          <Card className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase">Last session</p>
              <p className="font-extrabold text-gray-900 dark:text-white">{lastSession.date}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {lastSession.totalReps} reps · top set {lastSession.topSets?.[0]?.reps ?? 0}
              </p>
            </div>
            <ChevronRight className="text-gray-400" />
          </Card>
        </button>
      )}
    </div>
  );
}
