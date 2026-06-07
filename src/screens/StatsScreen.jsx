import { Download, Lock, Award } from 'lucide-react';
import Card from '../components/ui/Card';
import MetricTile from '../components/ui/MetricTile';
import Button from '../components/ui/Button';
import ProgressChart from '../components/charts/ProgressChart';
import { BADGES, LEAGUES, leagueForXP, nextLeagueForXP } from '../lib/gamification';

export default function StatsScreen({ profile, sessions }) {
  const allTimeReps = sessions.reduce((sum, s) => sum + s.totalReps, 0);
  const league = leagueForXP(profile.totalXP);
  const next = nextLeagueForXP(profile.totalXP);

  const last30 = (() => {
    const days = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().slice(0, 10);
      const reps = sessions
        .filter((s) => s.date === dateStr)
        .reduce((sum, s) => sum + s.totalReps, 0);
      days.push({ date: dateStr, reps });
    }
    return days;
  })();

  function exportData() {
    const blob = new Blob([JSON.stringify({ profile, sessions }, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pullup-tracker-data.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="flex flex-col gap-4 p-4 pb-28 max-w-lg mx-auto w-full">
      <h1 className="font-extrabold text-xl text-gray-900 dark:text-white">Stats</h1>

      <Card>
        <div className="flex items-center justify-between mb-2">
          <p className="font-extrabold" style={{ color: league.color }}>
            {league.name} League
          </p>
          {next && (
            <p className="text-xs font-bold text-gray-400">
              {next.minXP - profile.totalXP} XP to {next.name}
            </p>
          )}
        </div>
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full"
            style={{
              width: next
                ? `${Math.min(100, ((profile.totalXP - league.minXP) / (next.minXP - league.minXP)) * 100)}%`
                : '100%',
              backgroundColor: league.color,
            }}
          />
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-3">
        <MetricTile label="All-time reps" value={allTimeReps} accent="#58CC02" />
        <MetricTile label="Best set" value={profile.prs.bestSet} accent="#1CB0F6" />
        <MetricTile label="Best day" value={profile.prs.bestDay} accent="#FF9600" />
        <MetricTile label="Total sessions" value={sessions.length} accent="#9333EA" />
      </div>

      <Card>
        <p className="font-extrabold text-gray-900 dark:text-white mb-2">Last 30 days</p>
        <ProgressChart data={last30} />
      </Card>

      <div>
        <p className="font-extrabold text-gray-900 dark:text-white mb-2">Badges</p>
        <div className="grid grid-cols-3 gap-3">
          {BADGES.map((badge) => {
            const earned = profile.badges?.includes(badge.id);
            return (
              <div
                key={badge.id}
                className={`rounded-2xl p-3 flex flex-col items-center text-center gap-1 ${
                  earned
                    ? 'bg-brand-yellow/15 border border-brand-yellow/40'
                    : 'bg-gray-100 dark:bg-gray-800 grayscale opacity-60'
                }`}
              >
                {earned ? (
                  <Award size={24} className="text-brand-yellow" />
                ) : (
                  <Lock size={24} className="text-gray-400" />
                )}
                <p className="text-xs font-extrabold text-gray-700 dark:text-gray-200">{badge.name}</p>
              </div>
            );
          })}
        </div>
      </div>

      <Button color="gray" onClick={exportData} className="flex items-center justify-center gap-2">
        <Download size={20} />
        Export data (JSON)
      </Button>
    </div>
  );
}
