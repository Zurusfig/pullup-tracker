import { useCallback, useRef, useState } from 'react';
import {
  STATES,
  ema,
  avgShoulderY,
  noseVisibility,
  shouldEnterAscending,
  shouldEnterUp,
  shouldEnterDescending,
  shouldEnterHanging,
  upThresholdFor,
  MIN_REP_INTERVAL_MS,
  MIN_FRAMES_TO_TRANSITION,
} from '../lib/repAlgorithm';

export function useRepCounter({ calibration, onRep }) {
  const [repCount, setRepCount] = useState(0);
  const [poseState, setPoseState] = useState(STATES.HANGING);
  const [lostTracking, setLostTracking] = useState(false);
  const [debug, setDebug] = useState(null);

  const frameCountRef = useRef(0);
  const smoothedRef = useRef(null);
  const stateRef = useRef(STATES.HANGING);
  const candidateStateRef = useRef(null);
  const candidateCountRef = useRef(0);
  const historyRef = useRef([]);
  const lastRepTimeRef = useRef(0);
  const lostSinceRef = useRef(null);
  const repTimestampsRef = useRef([]);

  const reset = useCallback(() => {
    setRepCount(0);
    setPoseState(STATES.HANGING);
    smoothedRef.current = null;
    stateRef.current = STATES.HANGING;
    candidateStateRef.current = null;
    candidateCountRef.current = 0;
    historyRef.current = [];
    lastRepTimeRef.current = 0;
    lostSinceRef.current = null;
    repTimestampsRef.current = [];
    frameCountRef.current = 0;
    setLostTracking(false);
    setDebug(null);
  }, []);

  const transition = useCallback((next) => {
    if (candidateStateRef.current === next) {
      candidateCountRef.current += 1;
    } else {
      candidateStateRef.current = next;
      candidateCountRef.current = 1;
    }
    if (candidateCountRef.current >= MIN_FRAMES_TO_TRANSITION) {
      stateRef.current = next;
      setPoseState(next);
      candidateStateRef.current = null;
      candidateCountRef.current = 0;
    }
  }, []);

  const processLandmarks = useCallback(
    (landmarks) => {
      if (!calibration) return;
      const { baseline_y: baselineY, range } = calibration;
      const upThreshold = upThresholdFor(baselineY, range);

      frameCountRef.current += 1;
      const shouldLog = frameCountRef.current % 6 === 0;

      if (!landmarks || landmarks.length === 0) {
        if (lostSinceRef.current == null) lostSinceRef.current = performance.now();
        else if (performance.now() - lostSinceRef.current > 2000) setLostTracking(true);
        if (shouldLog) {
          setDebug({
            tracking: false,
            state: stateRef.current,
            baselineY,
            range,
          });
        }
        return;
      }
      lostSinceRef.current = null;
      setLostTracking(false);

      const rawY = avgShoulderY(landmarks);
      if (rawY == null) return;
      const smoothed = ema(rawY, smoothedRef.current);
      smoothedRef.current = smoothed;
      historyRef.current.push(smoothed);
      if (historyRef.current.length > 10) historyRef.current.shift();

      const visibility = noseVisibility(landmarks);
      const now = performance.now();
      const current = stateRef.current;

      if (shouldLog) {
        setDebug({
          tracking: true,
          state: current,
          rawY,
          smoothedY: smoothed,
          visibility,
          baselineY,
          upThreshold,
          range,
        });
      }

      switch (current) {
        case STATES.HANGING:
          if (shouldEnterAscending(smoothed, baselineY, range)) transition(STATES.ASCENDING);
          break;
        case STATES.ASCENDING:
          if (shouldEnterUp(smoothed, upThreshold, visibility)) transition(STATES.UP);
          break;
        case STATES.UP:
          if (shouldEnterDescending(historyRef.current)) transition(STATES.DESCENDING);
          break;
        case STATES.DESCENDING:
          if (shouldEnterHanging(smoothed, baselineY, range)) {
            if (now - lastRepTimeRef.current >= MIN_REP_INTERVAL_MS) {
              lastRepTimeRef.current = now;
              repTimestampsRef.current.push(new Date().toISOString());
              setRepCount((c) => {
                const next = c + 1;
                onRep?.(next);
                return next;
              });
            }
            transition(STATES.HANGING);
          }
          break;
        default:
          break;
      }
    },
    [calibration, onRep, transition]
  );

  return {
    repCount,
    poseState,
    lostTracking,
    debug,
    repTimestamps: repTimestampsRef,
    processLandmarks,
    reset,
  };
}
