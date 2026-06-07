import { Trophy } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

export default function SummaryScreen({ session, xpEarned, prsBroken, onDone }) {
  return (
    <div className="flex flex-col gap-4 p-4 pb-28 max-w-lg mx-auto w-full">
      <h1 className="font-extrabold text-2xl text-gray-900 dark:text-white text-center mt-2">
        Session complete
      </h1>

      <div className="flex gap-3">
        <Card className="flex-1 text-center">
          <p className="text-3xl font-extrabold text-brand-green">{session.totalReps}</p>
          <p className="text-xs font-bold text-gray-400">total reps</p>
        </Card>
        <Card className="flex-1 text-center">
          <p className="text-3xl font-extrabold text-brand-purple">+{xpEarned}</p>
          <p className="text-xs font-bold text-gray-400">XP earned</p>
        </Card>
        <Card className="flex-1 text-center">
          <p className="text-3xl font-extrabold text-brand-blue">{session.sets.length}</p>
          <p className="text-xs font-bold text-gray-400">sets</p>
        </Card>
      </div>

      {prsBroken.length > 0 && (
        <Card className="flex items-center gap-3 bg-brand-yellow/10">
          <Trophy size={24} className="text-brand-yellow" />
          <p className="font-bold text-gray-800 dark:text-gray-100 capitalize">
            New PRs: {prsBroken.join(', ')}
          </p>
        </Card>
      )}

      <div>
        <p className="font-extrabold text-gray-900 dark:text-white mb-2">Top sets</p>
        <div className="flex flex-col gap-2">
          {session.topSets.map((s) => (
            <Card key={s.setNumber} className="flex items-center justify-between">
              <p className="font-bold text-gray-700 dark:text-gray-200">Set {s.setNumber}</p>
              <p className="font-extrabold text-brand-green">{s.reps} reps</p>
              <p className="text-sm text-gray-400">{s.avgPaceSec.toFixed(1)}s/rep</p>
            </Card>
          ))}
        </div>
      </div>

      <Button color="green" onClick={onDone}>
        Done
      </Button>
    </div>
  );
}
