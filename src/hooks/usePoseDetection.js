import { useEffect, useRef, useState } from 'react';

const VISION_BUNDLE = 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/vision_bundle.mjs';
const WASM_BASE = 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm';
const MODEL_URL =
  'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task';

export function usePoseDetection({ videoRef, canvasRef, onLandmarks, active }) {
  const [status, setStatus] = useState('idle'); // idle | loading | ready | error | denied
  const [error, setError] = useState(null);
  const landmarkerRef = useRef(null);
  const rafRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    if (!active) return;
    let cancelled = false;

    async function init() {
      setStatus('loading');
      try {
        const { PoseLandmarker, FilesetResolver } = await import(/* @vite-ignore */ VISION_BUNDLE);
        const vision = await FilesetResolver.forVisionTasks(WASM_BASE);
        const landmarker = await PoseLandmarker.createFromOptions(vision, {
          baseOptions: { modelAssetPath: MODEL_URL, delegate: 'GPU' },
          runningMode: 'VIDEO',
          numPoses: 1,
          minPoseDetectionConfidence: 0.5,
          minPosePresenceConfidence: 0.5,
          minTrackingConfidence: 0.5,
        });
        if (cancelled) return;
        landmarkerRef.current = landmarker;

        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } },
        });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }

        setStatus('ready');
        loop();
      } catch (err) {
        if (cancelled) return;
        if (err?.name === 'NotAllowedError' || err?.name === 'PermissionDeniedError') {
          setStatus('denied');
        } else {
          setError(err?.message || 'Failed to start camera');
          setStatus('error');
        }
      }
    }

    function loop() {
      const video = videoRef.current;
      const landmarker = landmarkerRef.current;
      if (!video || !landmarker) return;

      if (video.readyState >= 2) {
        // Resizing a canvas clears it, so size it before drawing — and only
        // when the dimensions actually change, to avoid wiping every frame.
        const canvas = canvasRef.current;
        if (canvas && (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight)) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
        }

        const result = landmarker.detectForVideo(video, performance.now());
        const landmarks = result?.landmarks?.[0] || null;
        onLandmarks?.(landmarks);
      }
      rafRef.current = requestAnimationFrame(loop);
    }

    init();

    return () => {
      cancelled = true;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (streamRef.current) streamRef.current.getTracks().forEach((t) => t.stop());
      landmarkerRef.current?.close?.();
      landmarkerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  return { status, error };
}
