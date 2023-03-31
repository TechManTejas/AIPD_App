// export CAPACITOR_ANDROID_STUDIO_PATH="/snap/android-studio/current/android-studio/bin/studio.sh"
// ionic capacitor build android

export const connectingPoints = [
  [12, 14],
  [14, 16],
  [12, 11],
  [11, 13],
  [15, 13],
  [12, 24],
  [11, 23],
  [23, 24],
];

export const drawPoint = (context, x, y, label) => {
  context.beginPath();
  context.arc(x, y, 5, 0, 2 * Math.PI, false);
  context.fillStyle = "green";
  context.fill();
  context.lineWidth = 5;
  context.strokeStyle = "#00ff00";
  context.stroke();
};

export function connectPoint(canvasCtx, results, pointA, pointB, canvasRef) {
  canvasCtx.strokeStyle = "blue";
  canvasCtx.lineWidth = 5;
  canvasCtx.beginPath();
  canvasCtx.moveTo(
    results?.poseLandmarks[pointA]?.x * canvasRef.current.width,
    results?.poseLandmarks[pointA]?.y * canvasRef.current.height
  );
  canvasCtx.lineTo(
    results?.poseLandmarks[pointB]?.x * canvasRef.current.width,
    results?.poseLandmarks[pointB]?.y * canvasRef.current.height
  );
  canvasCtx.stroke();
}

export const drawPointOnCanvas = (
  landmarks,
  allowedPoints,
  canvasCtx,
  canvasElement
) => {
  landmarks.map((e, i) => {
    if (allowedPoints.includes(i))
      drawPoint(
        canvasCtx,
        e.x * canvasElement.width,
        e.y * canvasElement.height,
        i,
        "red",
        1
      );
  });
};

export const drawLine = (color, from, to, canvasCtx) => {
  canvasCtx.strokeStyle = color;
  canvasCtx.lineWidth = 5;
  canvasCtx.beginPath();
  canvasCtx.moveTo(from[0], from[1]);
  canvasCtx.lineTo(to[0], to[1]);
  canvasCtx.stroke();
};
