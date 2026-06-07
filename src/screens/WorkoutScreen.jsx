import { useEffect, useRef, useState } from 'react';
import { AlertTriangle, CameraOff } from 'lucide-react';
import CameraFeed from '../components/camera/CameraFeed';
import RepCounter from '../components/workout/RepCounter';
import SetPanel from '../components/workout/SetPanel';
import StreakBadge from '../components/gamification/StreakBadge';
import Button from '../components/ui/Button';
import { useRepCounter } from '../hooks/useRepCounter';

export default function WorkoutScreen({ calibration, setNumber, streak, onSetComplete }) {
  const [cameraStatus, setCameraStatus] = useState('loading');
  const startedAtRef = useRef(Date.now());
  const [startedAt] = useState(() => Date.now());

  const { repCount, lostTracking, repTimestamps, processLandmarks, reset } = useRepCounter({
    calibration,
  });

  useEffect(() => {
    reset();
    startedAtRef.current = Date.now();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setNumber]);

  function handleEndSet() {
    const durationSec = Math.round((Date.now() - startedAtRef.current) / 1000);
    onSetComplete({ reps: repCount, repTimestamps: [...repTimestamps.current], durationSec });
  }

  if (cameraStatus === 'denied') {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-6 pb-28 text-center max-w-lg mx-auto min-h-screen">
        <CameraOff size={56} className="text-brand-red" />
        <h1 className="font-extrabold text-xl text-gray-900 dark:text-white">Camera access needed</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Pull-up Tracker needs your camera to count reps. Enable it in your browser settings:
        </p>
        <ol className="text-left text-sm text-gray-500 dark:text-gray-400 list-decimal list-inside space-y-1">
          <li>Open your browser's site settings for this page</li>
          <li>Find "Camera" permissions</li>
          <li>Set it to "Allow"</li>
          <li>Reload this page</li>
        </ol>
        <Button color="green" onClick={() => window.location.reload()}>
          Reload page
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-4 pb-28 max-w-lg mx-auto w-full">
      <div className="flex items-center justify-between">
        <h1 className="font-extrabold text-xl text-gray-900 dark:text-white">Set {setNumber}</h1>
        <StreakBadge streak={streak} />
      </div>

      <div className="relative">
        <CameraFeed active onLandmarks={processLandmarks} onStatusChange={setCameraStatus} />
        {lostTracking && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-2xl">
            <div className="flex items-center gap-2 bg-brand-red text-white font-bold px-4 py-2 rounded-full">
              <AlertTriangle size={18} />
              Step into frame
            </div>
          </div>
        )}
      </div>

      <RepCounter count={repCount} />

      <SetPanel setNumber={setNumber} repCount={repCount} startedAt={startedAt} onEndSet={handleEndSet} />
    </div>
  );
}
