import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Trash2 } from 'lucide-react';
import Card from '../components/ui/Card';

function SessionCard({ session, onDelete }) {
  const [expanded, setExpanded] = useState(false);
  const [confirming, setConfirming] = useState(false);

  return (
    <motion.div
      drag="x"
      dragConstraints={{ left: -120, right: 0 }}
      dragElastic={0.15}
      onDragEnd={(_, info) => {
        if (info.offset.x < -90) setConfirming(true);
      }}
      className="relative"
    >
      <div className="absolute inset-y-0 right-0 flex items-center pr-4 text-brand-red">
        <Trash2 size={22} />
      </div>
      <Card className="relative bg-white dark:bg-surface-card">
        <button onClick={() => setExpanded((e) => !e)} className="w-full flex items-center justify-between text-left">
          <div>
            <p className="font-extrabold text-gray-900 dark:text-white">{session.date}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{session.sets.length} sets</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="bg-brand-green/15 text-brand-green font-extrabold text-sm px-3 py-1 rounded-full">
              {session.totalReps} reps
            </span>
            <ChevronDown
              size={18}
              className={`text-gray-400 transition-transform ${expanded ? 'rotate-180' : ''}`}
            />
          </div>
        </button>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="pt-3 mt-3 border-t border-gray-100 dark:border-gray-700 flex flex-col gap-1.5">
                {session.sets.map((s) => (
                  <div key={s.setNumber} className="flex items-center justify-between text-sm">
                    <span className="font-bold text-gray-600 dark:text-gray-300">Set {s.setNumber}</span>
                    <span className="font-extrabold text-gray-900 dark:text-white">{s.reps} reps</span>
                    <span className="text-gray-400">{s.avgPaceSec.toFixed(1)}s/rep</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>

      {confirming && (
        <div className="absolute inset-0 bg-white/95 dark:bg-surface-card/95 rounded-2xl flex items-center justify-center gap-3 z-10">
          <p className="font-bold text-gray-700 dark:text-gray-200">Delete this session?</p>
          <button
            onClick={() => onDelete(session.id)}
            className="bg-brand-red text-white font-extrabold text-sm px-3 py-1.5 rounded-full"
          >
            Delete
          </button>
          <button
            onClick={() => setConfirming(false)}
            className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white font-extrabold text-sm px-3 py-1.5 rounded-full"
          >
            Cancel
          </button>
        </div>
      )}
    </motion.div>
  );
}

export default function HistoryScreen({ sessions, onDelete }) {
  const grouped = sessions.reduce((acc, s) => {
    (acc[s.date] = acc[s.date] || []).push(s);
    return acc;
  }, {});

  const dates = Object.keys(grouped).sort((a, b) => (a < b ? 1 : -1));

  return (
    <div className="flex flex-col gap-4 p-4 pb-28 max-w-lg mx-auto w-full">
      <h1 className="font-extrabold text-xl text-gray-900 dark:text-white">History</h1>
      {dates.length === 0 && (
        <p className="text-gray-400 text-center mt-12">No sessions yet — go train!</p>
      )}
      {dates.map((date) => (
        <div key={date} className="flex flex-col gap-2">
          <p className="text-sm font-extrabold text-gray-400 uppercase tracking-wide">{date}</p>
          {grouped[date].map((session) => (
            <SessionCard key={session.id} session={session} onDelete={onDelete} />
          ))}
        </div>
      ))}
    </div>
  );
}
