import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Award, ArrowUp } from 'lucide-react';
import Button from '../ui/Button';
import { badgeById } from '../../lib/gamification';

const CONFETTI_COLORS = ['#58CC02', '#9333EA', '#1CB0F6', '#FF9600', '#FF4B4B', '#FFC800'];

function Confetti() {
  const particles = Array.from({ length: 24 }, (_, i) => {
    const angle = (i / 24) * Math.PI * 2;
    const distance = 120 + Math.random() * 140;
    return {
      id: i,
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance,
      color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
      rotate: Math.random() * 360,
      size: 8 + Math.random() * 8,
    };
  });

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ x: 0, y: 0, opacity: 1, rotate: 0, scale: 1 }}
          animate={{ x: p.x, y: p.y, opacity: 0, rotate: p.rotate, scale: 0.4 }}
          transition={{ duration: 1.4, ease: 'easeOut' }}
          className="absolute rounded-sm"
          style={{
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
          }}
        />
      ))}
    </div>
  );
}

function CountUp({ to, duration = 1.2 }) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let raf;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min((now - start) / (duration * 1000), 1);
      setValue(Math.round(t * to));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to, duration]);

  return <>{value}</>;
}

export default function CelebrationScreen({
  xpEarned = 0,
  prsBroken = [],
  badgesEarned = [],
  levelUp = null,
  leagueUp = null,
  onDismiss,
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-gradient-to-b from-brand-purple to-brand-blue flex flex-col items-center justify-center px-6 text-white overflow-hidden"
    >
      <Confetti />

      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 14 }}
        className="relative z-10 flex flex-col items-center text-center gap-6 max-w-sm w-full"
      >
        <p className="text-lg font-extrabold uppercase tracking-widest opacity-80">
          Session complete!
        </p>

        <div>
          <p className="text-sm font-bold opacity-70 mb-1">XP earned</p>
          <p className="text-6xl font-extrabold">
            +<CountUp to={xpEarned} />
          </p>
        </div>

        {levelUp && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-white/15 rounded-2xl px-6 py-3 flex items-center gap-3"
          >
            <ArrowUp size={28} />
            <p className="font-extrabold text-xl">
              Level {levelUp.from} <span className="opacity-60">→</span> {levelUp.to}
            </p>
          </motion.div>
        )}

        {leagueUp && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="bg-brand-yellow text-gray-900 rounded-2xl px-6 py-3 font-extrabold text-lg"
          >
            🎉 Promoted to {leagueUp.name} league!
          </motion.div>
        )}

        {prsBroken.length > 0 && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="bg-white/15 rounded-2xl px-5 py-3 w-full"
          >
            <div className="flex items-center gap-2 mb-1 justify-center">
              <Trophy size={20} className="text-brand-yellow" />
              <p className="font-extrabold">New personal record{prsBroken.length > 1 ? 's' : ''}!</p>
            </div>
            <p className="text-sm opacity-80 capitalize">{prsBroken.join(' · ')}</p>
          </motion.div>
        )}

        {badgesEarned.length > 0 && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="w-full flex flex-col gap-2"
          >
            {badgesEarned.map((id) => {
              const badge = badgeById(id);
              if (!badge) return null;
              return (
                <div
                  key={id}
                  className="bg-white/15 rounded-2xl px-4 py-2.5 flex items-center gap-3"
                >
                  <Award size={22} className="text-brand-yellow" />
                  <div className="text-left">
                    <p className="font-extrabold text-sm">{badge.name}</p>
                    <p className="text-xs opacity-70">{badge.description}</p>
                  </div>
                </div>
              );
            })}
          </motion.div>
        )}

        <Button color="green" onClick={onDismiss} className="mt-2">
          Keep going
        </Button>
      </motion.div>
    </motion.div>
  );
}
