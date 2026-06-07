const CONNECTIONS = [
  [11, 12],
  [11, 13],
  [13, 15],
  [12, 14],
  [14, 16],
  [11, 23],
  [12, 24],
  [23, 24],
  [23, 25],
  [25, 27],
  [24, 26],
  [26, 28],
];

export function drawSkeleton(ctx, landmarks, width, height) {
  if (!landmarks?.length) return;
  ctx.clearRect(0, 0, width, height);

  ctx.strokeStyle = '#58CC02';
  ctx.lineWidth = 3;
  CONNECTIONS.forEach(([a, b]) => {
    const pa = landmarks[a];
    const pb = landmarks[b];
    if (!pa || !pb) return;
    ctx.beginPath();
    ctx.moveTo(pa.x * width, pa.y * height);
    ctx.lineTo(pb.x * width, pb.y * height);
    ctx.stroke();
  });

  ctx.fillStyle = '#1CB0F6';
  landmarks.forEach((lm) => {
    ctx.beginPath();
    ctx.arc(lm.x * width, lm.y * height, 5, 0, Math.PI * 2);
    ctx.fill();
  });
}
