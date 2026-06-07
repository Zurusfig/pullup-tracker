import { useCallback, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertTriangle } from 'lucide-react';
import CameraFeed from '../components/camera/CameraFeed';
import Button from '../components/ui/Button';
import DebugLog from '../components/ui/DebugLog';
import { avgShoulderY } from '../lib/repAlgorithm';

function calibrationDebugLines(debug, step) {
  if (!debug) return ['waiting for camera…'];
  if (!debug.hasLandmarks) return ['tracking: NO PERSON DETECTED — step into frame'];
  if (step === 0) {
    if (debug.sampling) {
      return [
        `tracking: yes — sampling`,
        `shoulder_y: ${debug.y.toFixed(3)}`,
        `samples collected: ${debug.samples} / 30`,
      ];
    }
    return [`tracking: yes — in position, ready to sample`, `shoulder_y: ${debug.y.toFixed(3)}`];
  }
  if (debug.sampling) {
    return [
      `tracking: yes — sampling`,
      `shoulder_y: ${debug.y.toFixed(3)}   baseline_y: ${debug.baselineY.toFixed(3)}`,
      `lowest y seen: ${debug.minY === Infinity ? '—' : debug.minY.toFixed(3)}`,
      `rep phase: ${debug.repPhase}`,
    ];
  }
  return [`tracking: yes — in position, ready to sample`, `shoulder_y: ${debug.y.toFixed(3)}`];
}

const STEPS = [
  {
    title: 'Hang still from the bar',
    body: "Get into a dead hang with your arms fully extended. Hold still — we'll sample your resting position for 3 seconds.",
  },
  {
    title: 'Do one slow full rep',
    body: 'Perform a single, slow, full-range pull-up so we can find your highest point.',
  },
  {
    title: "You're calibrated!",
    body: "We've saved your range of motion. You're ready to start tracking real reps.",
  },
];

export default function CalibrationScreen({ onComplete }) {
  const [step, setStep] = useState(0);
  const [phase, setPhase] = useState('intro'); // intro | countdown | sampling | done
  const [countdown, setCountdown] = useState(3);
  const [result, setResult] = useState({ baseline_y: null, up_y: null });
  const [debug, setDebug] = useState(null);
  const [personDetected, setPersonDetected] = useState(false);

  const samplesRef = useRef([]);
  const minYRef = useRef(Infinity);
  const repPhaseRef = useRef('waiting'); // waiting | descending
  const frameCountRef = useRef(0);

  const handleLandmarksStep1 = useCallback((landmarks) => {
    const hasLandmarks = !!landmarks && landmarks.length > 0;
    setPersonDetected(hasLandmarks);

    frameCountRef.current += 1;
    const shouldLog = frameCountRef.current % 4 === 0;

    if (!hasLandmarks) {
      if (shouldLog) setDebug({ hasLandmarks: false });
      return;
    }
    const y = avgShoulderY(landmarks);
    if (y == null) return;

    if (phase !== 'sampling') {
      if (shouldLog) setDebug({ hasLandmarks: true, y, sampling: false });
      return;
    }

    samplesRef.current.push(y);
    if (shouldLog) setDebug({ hasLandmarks: true, y, samples: samplesRef.current.length, sampling: true });
    if (samplesRef.current.length >= 30) {
      const mean = samplesRef.current.reduce((a, b) => a + b, 0) / samplesRef.current.length;
      setResult((r) => ({ ...r, baseline_y: mean }));
      setPhase('done');
    }
  }, [phase]);

  const handleLandmarksStep2 = useCallback(
    (landmarks) => {
      const hasLandmarks = !!landmarks && landmarks.length > 0;
      setPersonDetected(hasLandmarks);

      frameCountRef.current += 1;
      const shouldLog = frameCountRef.current % 4 === 0;

      if (!hasLandmarks || result.baseline_y == null) {
        if (shouldLog) setDebug({ hasLandmarks });
        return;
      }
      const y = avgShoulderY(landmarks);
      if (y == null) return;

      if (phase !== 'sampling') {
        if (shouldLog) setDebug({ hasLandmarks: true, y, sampling: false });
        return;
      }

      minYRef.current = Math.min(minYRef.current, y);

      if (shouldLog) {
        setDebug({
          hasLandmarks: true,
          y,
          baselineY: result.baseline_y,
          minY: minYRef.current,
          repPhase: repPhaseRef.current,
          sampling: true,
        });
      }

      // Detect a full cycle: goes up (y decreases) then returns near baseline
      if (repPhaseRef.current === 'waiting' && y < result.baseline_y - 0.05) {
        repPhaseRef.current = 'descending';
      } else if (repPhaseRef.current === 'descending' && y > result.baseline_y - 0.02) {
        setResult((r) => ({ ...r, up_y: minYRef.current }));
        setPhase('done');
      }
    },
    [phase, result.baseline_y]
  );

  function startCountdown() {
    setPhase('countdown');
    setCountdown(3);
    setPersonDetected(false);
    const interval = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(interval);
          samplesRef.current = [];
          minYRef.current = Infinity;
          repPhaseRef.current = 'waiting';
          frameCountRef.current = 0;
          setDebug(null);
          setPhase('sampling');
          return 0;
        }
        return c - 1;
      });
    }, 1000);
  }

  function handleNext() {
    if (step === 0) {
      setStep(1);
      setPhase('intro');
    } else if (step === 1) {
      setStep(2);
      setPhase('done');
    } else {
      const baseline_y = result.baseline_y;
      const up_y = result.up_y;
      const range = baseline_y - up_y;
      onComplete({ baseline_y, up_y, range });
    }
  }

  const stepDef = STEPS[step];
  const showCamera = step === 0 || step === 1;
  const onLandmarks = step === 0 ? handleLandmarksStep1 : handleLandmarksStep2;

  return (
    <div className="flex flex-col gap-6 p-4 pb-28 max-w-lg mx-auto w-full min-h-screen">
      <div className="flex justify-center gap-2 pt-4">
        {STEPS.map((_, i) => (
          <div
            key={i}
            className={`w-3 h-3 rounded-full ${i <= step ? 'bg-brand-purple' : 'bg-gray-300 dark:bg-gray-700'}`}
          />
        ))}
      </div>

      <div className="text-center">
        <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">{stepDef.title}</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">{stepDef.body}</p>
      </div>

      {showCamera && (
        <div className="relative">
          <motion.div
            className="rounded-2xl"
            animate={
              personDetected
                ? {
                    boxShadow: [
                      '0 0 0px 0px rgba(88,204,2,0.55)',
                      '0 0 0px 8px rgba(88,204,2,0)',
                    ],
                  }
                : { boxShadow: '0 0 0px 3px rgba(255,75,75,0.45)' }
            }
            transition={
              personDetected
                ? { duration: 1.4, repeat: Infinity, ease: 'easeOut' }
                : { duration: 0.3 }
            }
          >
            <CameraFeed active onLandmarks={onLandmarks} />
          </motion.div>

          {phase === 'countdown' && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-2xl">
              <span className="text-white font-extrabold text-7xl">{countdown}</span>
            </div>
          )}

          <div className="absolute top-3 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
            {phase === 'sampling' && (
              <div className="bg-brand-blue text-white text-sm font-bold px-3 py-1 rounded-full">
                Sampling…
              </div>
            )}
            <AnimatePresence mode="wait">
              {personDetected ? (
                <motion.div
                  key="detected"
                  initial={{ opacity: 0, y: -8, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.9 }}
                  className="flex items-center gap-1.5 bg-brand-green text-white text-xs font-extrabold px-3 py-1.5 rounded-full shadow-md"
                >
                  <CheckCircle2 size={14} />
                  In position
                </motion.div>
              ) : (
                <motion.div
                  key="not-detected"
                  initial={{ opacity: 0, y: -8, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.9 }}
                  className="flex items-center gap-1.5 bg-brand-red text-white text-xs font-extrabold px-3 py-1.5 rounded-full shadow-md"
                >
                  <AlertTriangle size={14} />
                  Step into frame
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}

      {showCamera && <DebugLog lines={calibrationDebugLines(debug, step)} />}

      {step === 2 && (
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 14 }}
          className="flex flex-col items-center gap-3 py-8"
        >
          <CheckCircle2 size={72} className="text-brand-green" />
          <p className="font-bold text-gray-500 dark:text-gray-400">Range of motion saved</p>
        </motion.div>
      )}

      <div className="mt-auto flex flex-col gap-3">
        {(step === 0 || step === 1) && phase === 'intro' && (
          <>
            <p className="text-center text-sm font-bold text-gray-400">
              {personDetected
                ? "Looking good — you're in frame. Hit start when ready."
                : 'Step into frame and wait for the green "In position" badge.'}
            </p>
            <Button color="purple" onClick={startCountdown}>
              Start sampling
            </Button>
          </>
        )}
        {phase === 'done' && (
          <Button color="green" onClick={handleNext}>
            {step === 2 ? "Let's go!" : 'Continue'}
          </Button>
        )}
      </div>
    </div>
  );
}
