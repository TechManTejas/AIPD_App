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
