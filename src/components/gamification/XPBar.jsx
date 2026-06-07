import { motion } from 'framer-motion';
import LeagueBadge from './LeagueBadge';

export default function XPBar({ totalXP, level, league }) {
  const progress = totalXP % 100;
  return (
    <div className="bg-white dark:bg-surface-card rounded-2xl p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-sm font-bold text-gray-400">Level</p>
          <p className="text-3xl font-extrabold text-brand-purple">{level}</p>
        </div>
        <LeagueBadge leagueId={league} size="md" />
      </div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-brand-purple rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
      <p className="text-xs font-bold text-gray-400 mt-1.5 text-right">{progress} / 100 XP</p>
    </div>
  );
}
