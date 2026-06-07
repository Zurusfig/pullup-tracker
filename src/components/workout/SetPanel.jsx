import { useEffect, useState } from 'react';
import Button from '../ui/Button';

function formatDuration(sec) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function SetPanel({ setNumber, repCount, startedAt, onEndSet }) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startedAt) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [startedAt]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="font-extrabold text-xl text-gray-900 dark:text-white">Set {setNumber}</p>
        <p className="font-bold text-gray-400 tabular-nums">{formatDuration(elapsed)}</p>
      </div>
      {repCount > 0 && (
        <Button color="green" onClick={onEndSet}>
          End set
        </Button>
      )}
    </div>
  );
}
