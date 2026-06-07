export const STATES = {
  HANGING: 'HANGING',
  ASCENDING: 'ASCENDING',
  UP: 'UP',
  DESCENDING: 'DESCENDING',
};

export const MIN_REP_INTERVAL_MS = 600;
export const MIN_FRAMES_TO_TRANSITION = 3;
export const EMA_ALPHA = 0.3;

export function ema(raw, prev) {
  if (prev == null) return raw;
  return EMA_ALPHA * raw + (1 - EMA_ALPHA) * prev;
}

export function avgShoulderY(landmarks) {
  const left = landmarks[11];
  const right = landmarks[12];
  if (!left || !right) return null;
  return (left.y + right.y) / 2;
}

export function noseVisibility(landmarks) {
  const nose = landmarks[0];
  return nose?.visibility ?? 1;
}

export function shouldEnterAscending(smoothedY, baselineY, range) {
  return smoothedY < baselineY - 0.2 * range;
}

export function shouldEnterUp(smoothedY, upThreshold, visibility) {
  return smoothedY < upThreshold || visibility < 0.4;
}

export function shouldEnterDescending(history) {
  if (history.length < MIN_FRAMES_TO_TRANSITION) return false;
  const recent = history.slice(-MIN_FRAMES_TO_TRANSITION);
  for (let i = 1; i < recent.length; i++) {
    if (recent[i] <= recent[i - 1]) return false;
  }
  return true;
}

export function shouldEnterHanging(smoothedY, baselineY, range) {
  return smoothedY > baselineY - 0.08 * range;
}

export function upThresholdFor(baselineY, range) {
  return baselineY - 0.6 * range;
}
