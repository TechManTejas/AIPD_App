export const drawPoint = (context, x, y, label) => {
  context.beginPath();
  context.arc(x, y, 2.5, 0, 2 * Math.PI, false);
  context.fillStyle = "#00cc00";
  context.fill();
  context.lineWidth = 2;
  context.strokeStyle = "white";
  context.stroke();
};

export const drawPointPhysio = (context, x, y, label) => {
  context.beginPath();
  context.arc(x, y, 2.5, 0, 2 * Math.PI, false);
  context.fillStyle = "#cc0000";
  context.fill();
  context.lineWidth = 1;
  context.strokeStyle = "red";
  context.stroke();
};

export const drawCircle = (context, x, y, label) => {
  context.beginPath();
  context.arc(x, y, 25, 0, 2 * Math.PI, false);
  context.lineWidth = 2;
  context.strokeStyle = "white";
  context.stroke();
};

export function connectPoint(canvasCtx, results, pointA, pointB, canvasRef) {
  const gradient = canvasCtx.createLinearGradient(0, 0, canvasRef.current.width, canvasRef.current.height);
  gradient.addColorStop(0, "red");
  gradient.addColorStop(1, "blue");

  canvasCtx.strokeStyle = gradient;
  canvasCtx.lineWidth = 5;
  canvasCtx.lineCap = "round";
  canvasCtx.lineJoin = "bevel";

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

export function connectPointStencil(canvasCtx, results, pointA, pointB, canvasRef) {
  const gradient = canvasCtx.createLinearGradient(0, 0, canvasRef.current.width, canvasRef.current.height);
  gradient.addColorStop(0, "white");
  gradient.addColorStop(1, "white");

  canvasCtx.strokeStyle = gradient;
  canvasCtx.lineWidth = 5;
  canvasCtx.lineCap = "round";
  canvasCtx.lineJoin = "bevel";

  canvasCtx.beginPath();
  canvasCtx.moveTo(
    results?.pose_landmarks[pointA]?.x * canvasRef.current.width,
    results?.pose_landmarks[pointA]?.y * canvasRef.current.height
  );
  canvasCtx.lineTo(
    results?.pose_landmarks[pointB]?.x * canvasRef.current.width,
    results?.pose_landmarks[pointB]?.y * canvasRef.current.height
  );
  canvasCtx.stroke();
}

export function connectPointStencilPhysio(canvasCtx, results, pointA, pointB, canvasRef) {
  const gradient = canvasCtx.createLinearGradient(0, 0, canvasRef.current.width, canvasRef.current.height);
  gradient.addColorStop(0, "red");
  gradient.addColorStop(1, "red");

  canvasCtx.strokeStyle = gradient;
  canvasCtx.lineWidth = 5;
  canvasCtx.lineCap = "round";
  canvasCtx.lineJoin = "bevel";

  canvasCtx.beginPath();
  canvasCtx.moveTo(
    results?.pose_landmarks[pointA]?.x * canvasRef.current.width,
    results?.pose_landmarks[pointA]?.y * canvasRef.current.height
  );
  canvasCtx.lineTo(
    results?.pose_landmarks[pointB]?.x * canvasRef.current.width,
    results?.pose_landmarks[pointB]?.y * canvasRef.current.height
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
        i
      );
  });
};

export const drawCircleOnCanvas = (
  landmarks,
  allowedPoints,
  canvasCtx,
  canvasElement
) => {
  landmarks.map((e, i) => {
    if (allowedPoints.includes(i))
      drawCircle(
        canvasCtx,
        e.x * canvasElement.width,
        e.y * canvasElement.height,
        i
      );
  });
};

export const drawPointOnCanvasPhysio = (
  landmarks,
  allowedPoints,
  canvasCtx,
  canvasElement
) => {
  landmarks.map((e, i) => {
    if (allowedPoints.includes(i))
      drawPointPhysio(
        canvasCtx,
        e.x * canvasElement.width,
        e.y * canvasElement.height,
        i
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
