import { RefreshCw, Moon, Sun } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import LeagueBadge from '../components/gamification/LeagueBadge';
import StreakBadge from '../components/gamification/StreakBadge';
import { LEAGUES } from '../lib/gamification';

export default function ProfileScreen({ profile, onRecalibrate, darkMode, onToggleDarkMode }) {
  return (
    <div className="flex flex-col gap-4 p-4 pb-28 max-w-lg mx-auto w-full">
      <h1 className="font-extrabold text-xl text-gray-900 dark:text-white">Profile</h1>

      <Card className="flex flex-col items-center gap-3 py-6">
        <LeagueBadge leagueId={profile.league} size="lg" />
        <div className="flex items-center gap-6">
          <div className="text-center">
            <p className="text-2xl font-extrabold text-brand-purple">{profile.level}</p>
            <p className="text-xs font-bold text-gray-400">level</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-extrabold text-gray-900 dark:text-white">{profile.totalXP}</p>
            <p className="text-xs font-bold text-gray-400">total XP</p>
          </div>
          <div className="text-center flex flex-col items-center">
            <StreakBadge streak={profile.streak} />
            <p className="text-xs font-bold text-gray-400 mt-1">streak</p>
          </div>
        </div>
      </Card>

      <Card>
        <p className="font-extrabold text-gray-900 dark:text-white mb-2">Personal records</p>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div>
            <p className="text-xl font-extrabold text-brand-green">{profile.prs.bestSet}</p>
            <p className="text-xs font-bold text-gray-400">best set</p>
          </div>
          <div>
            <p className="text-xl font-extrabold text-brand-blue">{profile.prs.bestDay}</p>
            <p className="text-xs font-bold text-gray-400">best day</p>
          </div>
          <div>
            <p className="text-xl font-extrabold text-brand-orange">{profile.prs.bestSession}</p>
            <p className="text-xs font-bold text-gray-400">best session</p>
          </div>
        </div>
      </Card>

      <Card>
        <p className="font-extrabold text-gray-900 dark:text-white mb-2">Leagues</p>
        <div className="flex flex-col gap-1.5">
          {LEAGUES.map((l) => (
            <div key={l.id} className="flex items-center justify-between text-sm">
              <span className="font-bold" style={{ color: l.color }}>
                {l.name}
              </span>
              <span className="text-gray-400">{l.minXP}+ XP</span>
            </div>
          ))}
        </div>
      </Card>

      <Button color="purple" onClick={onRecalibrate} className="flex items-center justify-center gap-2">
        <RefreshCw size={20} />
        Recalibrate camera
      </Button>

      <Button
        color="gray"
        onClick={onToggleDarkMode}
        className="flex items-center justify-center gap-2"
      >
        {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        {darkMode ? 'Light mode' : 'Dark mode'}
      </Button>
    </div>
  );
}
