// export CAPACITOR_ANDROID_STUDIO_PATH="/snap/android-studio/current/android-studio/bin/studio.sh"
// ionic capacitor build android



// generalized for drawing a point on a canvas
export const drawPoint = (context, x, y, label) => {
  context.beginPath();
  context.arc(x, y, 2.5, 0, 2 * Math.PI, false);
  context.fillStyle = "#00cc00";
  context.fill();
  context.lineWidth = 2;
  context.strokeStyle = "white";
  context.stroke();
};

// generalzed for connection two points on canvas
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

// geneeralized to draw all the landmarks (which is itself an array of points)
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

export const drawLine = (color, from, to, canvasCtx) => {
  canvasCtx.strokeStyle = color;
  canvasCtx.lineWidth = 5;
  canvasCtx.beginPath();
  canvasCtx.moveTo(from[0], from[1]);
  canvasCtx.lineTo(to[0], to[1]);
  canvasCtx.stroke();
};

// generalized to find the distance between two points (note that the distance lies in the range of 0 to 1)
export function distance(x1, y1, x2, y2) {
  var dx = x2 - x1;
  var dy = y2 - y1;
  var dist = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
  return dist;
}