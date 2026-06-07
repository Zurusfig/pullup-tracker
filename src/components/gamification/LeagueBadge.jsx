import { Shield } from 'lucide-react';
import { LEAGUES } from '../../lib/gamification';

export default function LeagueBadge({ leagueId, size = 'md' }) {
  const league = LEAGUES.find((l) => l.id === leagueId) || LEAGUES[0];
  const sizes = {
    sm: { box: 'w-8 h-8', icon: 16, text: 'text-xs' },
    md: { box: 'w-10 h-10', icon: 20, text: 'text-sm' },
    lg: { box: 'w-16 h-16', icon: 32, text: 'text-base' },
  };
  const s = sizes[size];
  return (
    <div className="flex items-center gap-2">
      <div
        className={`${s.box} rounded-full flex items-center justify-center shadow-sm`}
        style={{ backgroundColor: `${league.color}33`, border: `2px solid ${league.color}` }}
      >
        <Shield size={s.icon} color={league.color} fill={league.color} fillOpacity={0.3} />
      </div>
      <span className={`font-extrabold ${s.text}`} style={{ color: league.color }}>
        {league.name}
      </span>
    </div>
  );
}
