import { motion, AnimatePresence } from 'framer-motion';
import { Award } from 'lucide-react';
import { badgeById } from '../../lib/gamification';

export default function BadgeToast({ badgeIds = [], onDone }) {
  return (
    <div className="fixed bottom-24 left-0 right-0 z-50 flex flex-col items-center gap-2 px-4 pointer-events-none">
      <AnimatePresence>
        {badgeIds.map((id, i) => {
          const badge = badgeById(id);
          if (!badge) return null;
          return (
            <motion.div
              key={id}
              initial={{ y: 80, opacity: 0, scale: 0.8 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 40, opacity: 0, scale: 0.8 }}
              transition={{ delay: i * 0.15, type: 'spring', stiffness: 260, damping: 20 }}
              onAnimationComplete={() => {
                if (i === badgeIds.length - 1) {
                  setTimeout(() => onDone?.(), 3000);
                }
              }}
              className="bg-white dark:bg-surface-card rounded-2xl shadow-lg px-4 py-3 flex items-center gap-3 max-w-sm w-full border-2 border-brand-yellow"
            >
              <div className="w-12 h-12 rounded-full bg-brand-yellow/20 flex items-center justify-center shrink-0">
                <Award size={26} className="text-brand-yellow" fill="#FFC800" fillOpacity={0.3} />
              </div>
              <div>
                <p className="text-xs font-bold text-brand-yellow uppercase tracking-wide">
                  Badge unlocked
                </p>
                <p className="font-extrabold text-gray-900 dark:text-white">{badge.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{badge.description}</p>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
