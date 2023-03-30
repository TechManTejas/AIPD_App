import { Pose } from "@mediapipe/pose";
import React, { useRef, useEffect } from "react";
// import * as _Pose from "@mediapipe/pose";
import * as cam from "@mediapipe/camera_utils";
import Webcam from "react-webcam";
import { drawPoint, connectPoint } from "./PoseFunctions";

function CameraPoseDetect() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const connect = window.drawConnectors;
  var camera = null;

  function onResults(results) {
    // console.log(results)
    // const video = webcamRef.current.video;
    if (results.poseLandmarks == undefined) {
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

    const leftShoulder = results.poseLandmarks[11];
    const rightShoulder = results.poseLandmarks[12];
    const leftElbow = results.poseLandmarks[13];
    const rightElbow = results.poseLandmarks[14];
    const leftWrist = results.poseLandmarks[15];
    const rightWrist = results.poseLandmarks[16];

    const lefthip = results.poseLandmarks[23];
    const righthip = results.poseLandmarks[24];

    const predictLeftWrist = {
      x: 3 * leftShoulder.x - 2 * rightShoulder.x,
      y: 3 * leftShoulder.y - 2 * rightShoulder.y,
    };

    const predictRightWrist = {
      x: 3 * rightShoulder.x - 2 * leftShoulder.x,
      y: 3 * rightShoulder.y - 2 * leftShoulder.y,
    };

    const allowedPoints = [11, 12, 13, 14, 15, 16, 23, 24];

    if (results.poseLandmarks) {
      results.poseLandmarks.map((e, i) => {
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

      connectPoint(canvasCtx, results, 12, 14, canvasRef);
      connectPoint(canvasCtx, results, 14, 16, canvasRef);
      connectPoint(canvasCtx, results, 12, 11, canvasRef);
      connectPoint(canvasCtx, results, 11, 13, canvasRef);
      connectPoint(canvasCtx, results, 15, 13, canvasRef);

      connectPoint(canvasCtx, results, 12, 24, canvasRef);
      connectPoint(canvasCtx, results, 11, 23, canvasRef);
      connectPoint(canvasCtx, results, 23, 24, canvasRef);
      // connectPoint(canvasCtx, results, 26, 24);
      // connectPoint(canvasCtx, results, 23, 25);
      // connectPoint(canvasCtx, results, 26, 28);
      // connectPoint(canvasCtx, results, 25, 27);

      // connectPoint(canvasCtx, results, 22, 16);
      // connectPoint(canvasCtx, results, 20, 16);
      // connectPoint(canvasCtx, results, 18, 16);
      // connectPoint(canvasCtx, results, 18, 20);

      // connectPoint(canvasCtx, results, 21, 15);
      // connectPoint(canvasCtx, results, 19, 15);
      // connectPoint(canvasCtx, results, 17, 15);
      // connectPoint(canvasCtx, results, 17, 19);

      // connectPoint(canvasCtx, results, 10, 9);

      // connectPoint(canvasCtx, results, 8, 6);
      // connectPoint(canvasCtx, results, 5, 6);
      // connectPoint(canvasCtx, results, 5, 4);
      // connectPoint(canvasCtx, results, 0, 4);
      // connectPoint(canvasCtx, results, 0, 1);
      // connectPoint(canvasCtx, results, 2, 1);
      // connectPoint(canvasCtx, results, 2, 3);
      // connectPoint(canvasCtx, results, 7, 3);

      // connectPoint(canvasCtx, results, 28, 32);
      // connectPoint(canvasCtx, results, 30, 32);
      // connectPoint(canvasCtx, results, 30, 28);
      // connectPoint(canvasCtx, results, 27, 29);
      // connectPoint(canvasCtx, results, 31, 29);
      // connectPoint(canvasCtx, results, 31, 27);
    }

    var anglebetweenrslslw =
      Math.atan2(
        rightShoulder.y - leftShoulder.y,
        rightShoulder.x - leftShoulder.x
      ) -
      Math.atan2(leftWrist.y - leftShoulder.y, leftWrist.x - leftShoulder.x);

    anglebetweenrslslw *= 180 / Math.PI;

    if (anglebetweenrslslw < 0) {
      anglebetweenrslslw = 360 + anglebetweenrslslw;
    }

    var anglebetweenlsrsrw =
      Math.atan2(
        leftShoulder.y - rightShoulder.y,
        leftShoulder.x - rightShoulder.x
      ) -
      Math.atan2(
        rightWrist.y - rightShoulder.y,
        rightWrist.x - rightShoulder.x
      );

    anglebetweenlsrsrw *= 180 / Math.PI;

    if (anglebetweenlsrsrw < 0) {
      anglebetweenlsrsrw = 360 + anglebetweenlsrsrw;
    }

    var ifStartingPointReached = false;
    if (
      anglebetweenrslslw > 160 &&
      anglebetweenrslslw < 200 &&
      anglebetweenlsrsrw > 160 &&
      anglebetweenlsrsrw < 200
    ) {
      ifStartingPointReached = "Starting Point Reached";
    }

    if (anglebetweenlsrsrw > 160 && anglebetweenlsrsrw < 200) {
      canvasCtx.strokeStyle = "green";
      canvasCtx.lineWidth = 5;
      canvasCtx.beginPath();
      canvasCtx.moveTo(
        rightShoulder.x * canvasRef.current.width,
        rightShoulder.y * canvasRef.current.height
      );
      canvasCtx.lineTo(
        predictRightWrist.x * canvasRef.current.width,
        predictRightWrist.y * canvasRef.current.height
      );
      canvasCtx.stroke();
    } else {
      canvasCtx.strokeStyle = "white";
      canvasCtx.lineWidth = 5;
      canvasCtx.beginPath();
      canvasCtx.moveTo(
        rightShoulder.x * canvasRef.current.width,
        rightShoulder.y * canvasRef.current.height
      );
      canvasCtx.lineTo(
        predictRightWrist.x * canvasRef.current.width,
        predictRightWrist.y * canvasRef.current.height
      );
      canvasCtx.stroke();
    }

    if (anglebetweenrslslw > 160 && anglebetweenrslslw < 200) {
      canvasCtx.strokeStyle = "green";
      canvasCtx.lineWidth = 5;
      canvasCtx.beginPath();
      canvasCtx.moveTo(
        leftShoulder.x * canvasRef.current.width,
        leftShoulder.y * canvasRef.current.height
      );
      canvasCtx.lineTo(
        predictLeftWrist.x * canvasRef.current.width,
        predictLeftWrist.y * canvasRef.current.height
      );
      canvasCtx.stroke();
    } else {
      canvasCtx.strokeStyle = "white";
      canvasCtx.lineWidth = 5;
      canvasCtx.beginPath();
      canvasCtx.moveTo(
        leftShoulder.x * canvasRef.current.width,
        leftShoulder.y * canvasRef.current.height
      );
      canvasCtx.lineTo(
        predictLeftWrist.x * canvasRef.current.width,
        predictLeftWrist.y * canvasRef.current.height
      );
      canvasCtx.stroke();
    }

    // console.log(predictLeftWrist.y * canvasElement.height)

    var angleleft =
      Math.atan2(lefthip.y - leftShoulder.y, lefthip.x - leftShoulder.x) -
      Math.atan2(leftWrist.y - leftShoulder.y, leftWrist.x - leftShoulder.x);

    drawPoint(
      canvasCtx,
      predictLeftWrist.x * canvasElement.width,
      predictLeftWrist.y * canvasElement.height,
      0,
      "red",
      1
    );

    drawPoint(
      canvasCtx,
      predictRightWrist.x * canvasElement.width,
      predictRightWrist.y * canvasElement.height,
      0,
      "red",
      1
    );

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
    if (ifStartingPointReached) {
      canvasCtx.fillText("Starting point reached", 10, 50);
    }
    // canvasCtx.fillText(anglebetweenlsrsrw, 10, 100);
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
        <canvas ref={canvasRef} className="w-screen h-screen" />
      </div>
    </center>
  );
}
export default CameraPoseDetect;
