import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';

const REST_SECONDS = 90;
const RADIUS = 80;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function RestTimer({ lastSet, prBroken, xpEarned, onNextSet, onEndSession }) {
  const [secondsLeft, setSecondsLeft] = useState(REST_SECONDS);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const t = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [secondsLeft]);

  const progress = secondsLeft / REST_SECONDS;
  const offset = CIRCUMFERENCE * (1 - progress);

  return (
    <div className="flex flex-col gap-6 items-center">
      <Card className="w-full">
        <p className="font-extrabold text-lg text-gray-900 dark:text-white mb-2">
          Set {lastSet.setNumber} complete
        </p>
        <div className="flex gap-4">
          <div>
            <p className="text-2xl font-extrabold text-brand-green">{lastSet.reps}</p>
            <p className="text-xs font-bold text-gray-400">reps</p>
          </div>
          <div>
            <p className="text-2xl font-extrabold text-brand-blue">{lastSet.avgPaceSec.toFixed(1)}s</p>
            <p className="text-xs font-bold text-gray-400">avg pace</p>
          </div>
          <div>
            <p className="text-2xl font-extrabold text-brand-purple">+{xpEarned}</p>
            <p className="text-xs font-bold text-gray-400">XP</p>
          </div>
        </div>
        {prBroken && (
          <div className="mt-3 flex items-center gap-2 bg-brand-yellow/15 rounded-xl px-3 py-2">
            <Trophy size={18} className="text-brand-yellow" />
            <p className="font-bold text-sm text-gray-800 dark:text-gray-100">New personal record!</p>
          </div>
        )}
      </Card>

      <div className="relative w-48 h-48 flex items-center justify-center">
        <svg width="192" height="192" className="-rotate-90">
          <circle cx="96" cy="96" r={RADIUS} stroke="currentColor" className="text-gray-200 dark:text-gray-700" strokeWidth="12" fill="none" />
          <motion.circle
            cx="96"
            cy="96"
            r={RADIUS}
            stroke="#1CB0F6"
            strokeWidth="12"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1, ease: 'linear' }}
          />
        </svg>
        <div className="absolute flex flex-col items-center">
          <p className="text-4xl font-extrabold text-gray-900 dark:text-white tabular-nums">{secondsLeft}</p>
          <p className="text-xs font-bold text-gray-400 uppercase">rest</p>
        </div>
      </div>

      <div className="w-full flex flex-col gap-3">
        <Button color="green" onClick={onNextSet}>Next set</Button>
        <Button color="gray" onClick={onEndSession}>End session</Button>
      </div>
    </div>
  );
}
