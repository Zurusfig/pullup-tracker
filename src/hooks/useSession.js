import { useCallback, useRef, useState } from 'react';

export function useSession() {
  const [sets, setSets] = useState([]);
  const startTimeRef = useRef(null);

  const startSession = useCallback(() => {
    startTimeRef.current = new Date().toISOString();
    setSets([]);
  }, []);

  const addSet = useCallback((reps, repTimestamps, durationSec) => {
    setSets((prev) => {
      const setNumber = prev.length + 1;
      const avgPaceSec =
        repTimestamps.length > 1
          ? (new Date(repTimestamps[repTimestamps.length - 1]) - new Date(repTimestamps[0])) /
            1000 /
            (repTimestamps.length - 1)
          : 0;
      return [...prev, { setNumber, reps, repTimestamps, durationSec, avgPaceSec }];
    });
  }, []);

  const buildSession = useCallback(() => {
    const totalReps = sets.reduce((sum, s) => sum + s.reps, 0);
    const topSets = [...sets].sort((a, b) => b.reps - a.reps).slice(0, 3);
    const now = new Date();
    return {
      id: `${now.getTime()}`,
      date: now.toISOString().slice(0, 10),
      startTime: startTimeRef.current,
      endTime: now.toISOString(),
      sets,
      totalReps,
      topSets,
    };
  }, [sets]);

  return { sets, startSession, addSet, buildSession };
}
