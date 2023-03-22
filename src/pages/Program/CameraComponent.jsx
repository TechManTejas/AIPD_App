import { Pose } from "@mediapipe/pose";
import React, { useRef, useEffect } from "react";
import * as _Pose from "@mediapipe/pose";
import * as cam from "@mediapipe/camera_utils";
import Webcam from "react-webcam";


function CameraPoseDetect() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const connect = window.drawConnectors;
  var camera = null;

  function drawPoint(context, x, y, label, color, size) {
    if (color == null) {
      color = "#000";
    }
    if (size == null) {
      size = 5;
    }

    var radius = 0.5 * size;

    // to increase smoothing for numbers with decimal part
    var pointX = Math.round(x - radius);
    var pointY = Math.round(y - radius);

    context.beginPath();
    context.fillStyle = color;
    context.fillRect(pointX, pointY, size, size);
    context.fill();

    if (label) {
      var textX = Math.round(x);
      var textY = Math.round(pointY - 5);

      context.font = "Italic 14px Arial";
      context.fillStyle = color;
      context.textAlign = "center";
      context.fillText(label, textX, textY);
    }
  }

  function connectPoint(canvasCtx, results, pointA, pointB){
    canvasCtx.strokeStyle = 'white';
    canvasCtx.lineWidth = 5;
    canvasCtx.beginPath();
    canvasCtx.moveTo(results?.poseLandmarks[pointA]?.x * 640, results?.poseLandmarks[pointA]?.y * 480);
    canvasCtx.lineTo(results?.poseLandmarks[pointB]?.x * 640, results?.poseLandmarks[pointB]?.y * 480);
    canvasCtx.stroke();
  }

  function onResults(results) {
    // console.log(results)
    // const video = webcamRef.current.video;
    const videoWidth = webcamRef.current.video.videoWidth;
    const videoHeight = webcamRef.current.video.videoHeight;

    // Set canvas width
    canvasRef.current.width = videoWidth;
    canvasRef.current.height = videoHeight;

    const canvasElement = canvasRef.current;
    const canvasCtx = canvasElement.getContext("2d");
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    canvasCtx.drawImage(
      results.image,
      0,
      0,
      canvasElement.width,
      canvasElement.height
    );

    if (results.poseLandmarks)
      results.poseLandmarks.map((e, i) => {
        drawPoint(canvasCtx, e.x * 640, e.y * 480, i, "red", 1);
      });

    connectPoint(canvasCtx, results, 12, 14)
    connectPoint(canvasCtx, results, 14, 16)
    connectPoint(canvasCtx, results, 12, 11)
    connectPoint(canvasCtx, results, 11, 13)
    connectPoint(canvasCtx, results, 15, 13)
    
    connectPoint(canvasCtx, results, 12, 24)
    connectPoint(canvasCtx, results, 11, 23)
    connectPoint(canvasCtx, results, 23, 24)
    connectPoint(canvasCtx, results, 26, 24)
    connectPoint(canvasCtx, results, 23, 25)
    connectPoint(canvasCtx, results, 26, 28)
    connectPoint(canvasCtx, results, 25, 27)

    connectPoint(canvasCtx, results, 22, 16)
    connectPoint(canvasCtx, results, 20, 16)
    connectPoint(canvasCtx, results, 18, 16)
    connectPoint(canvasCtx, results, 18, 20)

    connectPoint(canvasCtx, results, 21, 15)
    connectPoint(canvasCtx, results, 19, 15)
    connectPoint(canvasCtx, results, 17, 15)
    connectPoint(canvasCtx, results, 17, 19)

    connectPoint(canvasCtx, results, 10, 9)

    connectPoint(canvasCtx, results, 8,6)
    connectPoint(canvasCtx, results, 5,6)
    connectPoint(canvasCtx, results, 5,4)
    connectPoint(canvasCtx, results, 0,4)
    connectPoint(canvasCtx, results, 0,1)
    connectPoint(canvasCtx, results, 2,1)
    connectPoint(canvasCtx, results, 2,3)
    connectPoint(canvasCtx, results, 7,3)

    connectPoint(canvasCtx, results, 28,32)
    connectPoint(canvasCtx, results, 30,32)
    connectPoint(canvasCtx, results, 30,28)
    connectPoint(canvasCtx, results, 27,29)
    connectPoint(canvasCtx, results, 31,29)
    connectPoint(canvasCtx, results, 31,27)

  }
  // setInterval(())
  useEffect(() => {
    const pose = new Pose({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
      },
    });

    pose.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      enableSegmentation: true,
      smoothSegmentation: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    pose.onResults(onResults);

    if (
      webcamRef.current !== "undefined" &&
      webcamRef.current !== null
    ) {
      camera = new cam.Camera(webcamRef.current.video, {
        onFrame: async () => {
          await pose.send({ image: webcamRef.current.video });
        },
      });
      camera.start();
    }
  }, []);
  return (
    <center>
      <div className="App">
        <Webcam ref={webcamRef} className="hidden"/>
        <canvas
          ref={canvasRef}
          className="output_canvas w-screen"
        ></canvas>
      </div>
    </center>
  );
}
export default CameraPoseDetect;
