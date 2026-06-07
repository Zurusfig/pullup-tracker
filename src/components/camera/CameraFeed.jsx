import { useEffect, useRef } from 'react';
import { usePoseDetection } from '../../hooks/usePoseDetection';
import { drawSkeleton } from './SkeletonOverlay';

export default function CameraFeed({ active, onLandmarks, showSkeleton = true, onStatusChange }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const { status, error } = usePoseDetection({
    videoRef,
    canvasRef,
    active,
    onLandmarks: (landmarks) => {
      onLandmarks?.(landmarks);
      if (showSkeleton && canvasRef.current) {
        const ctx = canvasRef.current.getContext('2d');
        drawSkeleton(ctx, landmarks, canvasRef.current.width, canvasRef.current.height);
      }
    },
  });

  useEffect(() => {
    onStatusChange?.(status, error);
  }, [status, error, onStatusChange]);

  return (
    <div className="relative w-full aspect-[4/3] bg-gray-900 rounded-2xl overflow-hidden">
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover scale-x-[-1]"
        playsInline
        muted
      />
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full object-cover scale-x-[-1] pointer-events-none"
      />
      {status === 'loading' && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white font-bold">
          Starting camera…
        </div>
      )}
    </div>
  );
}
