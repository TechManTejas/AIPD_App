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

  function drawPoint(context, x, y, label) {
    if (label) {
      context.beginPath();
      context.arc(x, y, 5, 0, 2 * Math.PI, false);
      context.fillStyle = "green";
      context.fill();
      context.lineWidth = 5;
      context.strokeStyle = "#AAFF00";
      context.stroke();
    }
  }

  function connectPoint(canvasCtx, results, pointA, pointB) {
    canvasCtx.strokeStyle = "white";
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

  function onResults(results) {
    // console.log(results)
    // const video = webcamRef.current.video;
    if(!results){
      return;
    }
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

    if (results.poseLandmarks) {
      results.poseLandmarks.map((e, i) => {
        drawPoint(
          canvasCtx,
          e.x * canvasElement.width,
          e.y * canvasElement.height,
          i,
          "red",
          1
        );
      });

      connectPoint(canvasCtx, results, 12, 14);
      connectPoint(canvasCtx, results, 14, 16);
      connectPoint(canvasCtx, results, 12, 11);
      connectPoint(canvasCtx, results, 11, 13);
      connectPoint(canvasCtx, results, 15, 13);

      connectPoint(canvasCtx, results, 12, 24);
      connectPoint(canvasCtx, results, 11, 23);
      connectPoint(canvasCtx, results, 23, 24);
      connectPoint(canvasCtx, results, 26, 24);
      connectPoint(canvasCtx, results, 23, 25);
      connectPoint(canvasCtx, results, 26, 28);
      connectPoint(canvasCtx, results, 25, 27);

      connectPoint(canvasCtx, results, 22, 16);
      connectPoint(canvasCtx, results, 20, 16);
      connectPoint(canvasCtx, results, 18, 16);
      connectPoint(canvasCtx, results, 18, 20);

      connectPoint(canvasCtx, results, 21, 15);
      connectPoint(canvasCtx, results, 19, 15);
      connectPoint(canvasCtx, results, 17, 15);
      connectPoint(canvasCtx, results, 17, 19);

      connectPoint(canvasCtx, results, 10, 9);

      connectPoint(canvasCtx, results, 8, 6);
      connectPoint(canvasCtx, results, 5, 6);
      connectPoint(canvasCtx, results, 5, 4);
      connectPoint(canvasCtx, results, 0, 4);
      connectPoint(canvasCtx, results, 0, 1);
      connectPoint(canvasCtx, results, 2, 1);
      connectPoint(canvasCtx, results, 2, 3);
      connectPoint(canvasCtx, results, 7, 3);

      connectPoint(canvasCtx, results, 28, 32);
      connectPoint(canvasCtx, results, 30, 32);
      connectPoint(canvasCtx, results, 30, 28);
      connectPoint(canvasCtx, results, 27, 29);
      connectPoint(canvasCtx, results, 31, 29);
      connectPoint(canvasCtx, results, 31, 27);
    }

    
    const leftShoulder = results.poseLandmarks[11];
    const rightShoulder = results.poseLandmarks[12];
    const leftElbow = results.poseLandmarks[13];
    const rightElbow = results.poseLandmarks[14];
    const leftWrist = results.poseLandmarks[15];
    const rightWrist = results.poseLandmarks[16];

    var angleleft =
      Math.atan2(leftWrist.y - leftElbow.y, leftWrist.x - leftElbow.x) -
      Math.atan2(leftShoulder.y - leftElbow.y, leftShoulder.x - leftElbow.x);

    var angleright =
      Math.atan2(
        rightShoulder.y - rightElbow.y,
        rightShoulder.x - rightElbow.x
      ) - Math.atan2(rightWrist.y - rightElbow.y, rightWrist.x - rightElbow.x);
      
    angleleft = angleleft * (180 / Math.PI);
    if (angleleft > 180) {
      angleleft = 360 - angleleft;
    }
    if (angleleft < 0) {
      angleleft = 360 + angleleft;
    }

    angleright = angleright * (180 / Math.PI);
    if (angleright > 180) {
      angleright = 360 - angleright;
    }
    if (angleright < 0) {
      angleright = 360 + angleright;
    }

    canvasCtx.font = "30px Arial";
    canvasCtx.fillText("left Angle = "  +  angleleft, 10, 50);
    canvasCtx.fillText( "Right Angle = " + angleright, 10, 100);
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

    if (webcamRef.current !== "undefined" && webcamRef.current !== null) {
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
        <Webcam ref={webcamRef} className="hidden w-screen" />
        <canvas ref={canvasRef} className="w-screen" />
      </div>
    </center>
  );
}
export default CameraPoseDetect;
