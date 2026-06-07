import { Flame } from 'lucide-react';
import { motion } from 'framer-motion';

export default function StreakBadge({ streak }) {
  const active = streak > 0;
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="flex items-center gap-1 bg-orange-50 dark:bg-surface-card rounded-full px-3 py-1.5"
    >
      <Flame
        size={20}
        className={active ? 'text-brand-orange' : 'text-gray-300'}
        fill={active ? '#FF9600' : 'none'}
      />
      <span className={`font-extrabold text-lg ${active ? 'text-brand-orange' : 'text-gray-400'}`}>
        {streak}
      </span>
    </motion.div>
  );
}
