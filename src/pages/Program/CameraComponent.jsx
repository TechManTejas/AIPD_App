import { Pose } from "@mediapipe/pose";
import React, { useRef, useEffect } from "react";
// import * as _Pose from "@mediapipe/pose";
import * as cam from "@mediapipe/camera_utils";
import Webcam from "react-webcam";
import {
  drawPoint,
  connectPoint,
  drawPointOnCanvas,
  connectingPoints,
  drawLine,
} from "./PoseFunctions";

function distance(x1, y1, x2, y2) {
  var dx = x2 - x1;
  var dy = y2 - y1;
  var dist = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
  return dist;
}

function CameraPoseDetect() {
  // * Refs
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  var camera = null;

  var ifStartingPointReached = true;
  var hitOn = 'lower'
  var reps = 0

  function onResults(results) {
    // ^ check if landmarks are detected
    if (results.poseLandmarks == undefined) 
      return;

    // * getting the video Width
    const videoWidth = webcamRef.current.video.videoWidth;
    const videoHeight = webcamRef.current.video.videoHeight;

    // * Set canvas width
    canvasRef.current.width = videoWidth;
    canvasRef.current.height = videoHeight;

    // * Canvas Initialize
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

    // * Some Important points
    const leftShoulder = results.poseLandmarks[11];
    const rightShoulder = results.poseLandmarks[12];
    const leftElbow = results.poseLandmarks[13];
    const rightElbow = results.poseLandmarks[14];
    const leftWrist = results.poseLandmarks[15];
    const rightWrist = results.poseLandmarks[16];

    const lefthip = results.poseLandmarks[23];
    const righthip = results.poseLandmarks[24];

    // * Predicted left Wrist
    // ! Used Section Formula
    const predictLeftWrist = {
      x: 2.5 * leftShoulder.x - 1.5 * rightShoulder.x,
      y: 2.5 * leftShoulder.y - 1.5 * rightShoulder.y,
    };

    // * Predicted Right Wrist
    // ! Used Section Formula
    const predictRightWrist = {
      x: 2.5 * rightShoulder.x - 1.5 * leftShoulder.x,
      y: 2.5 * rightShoulder.y - 1.5 * leftShoulder.y,
    };

    // ! Angle between right shoulder left shoulder and left wrist
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

    // ! Angle between left shoulder right shoulder and right wrist
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

    // * Angle made at left elbow
    var angleleft =
      Math.atan2(leftShoulder.y - leftElbow.y, leftShoulder.x - leftElbow.x) -
      Math.atan2(leftWrist.y - leftElbow.y, leftWrist.x - leftElbow.x);

    // * Angle made at right elbow
    var angleright =
      Math.atan2(rightWrist.y - rightElbow.y, rightWrist.x - rightElbow.x) -
      Math.atan2(rightShoulder.y - rightElbow.y, rightShoulder.x - rightElbow.x);

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

    const distanceBetweenleftWristleftElbow = Math.sqrt(
      Math.pow(
        leftElbow.x * canvasElement.width - leftWrist.x * canvasElement.width,
        2
      ) +
      Math.pow(
        leftElbow.y * canvasElement.height -
        leftWrist.y * canvasElement.height,
        2
      )
    );

    // ! is starting point reached (buffer = 40deg)

    if (
      (anglebetweenrslslw > 160 &&
        anglebetweenrslslw < 200 &&
        anglebetweenlsrsrw > 160 &&
        anglebetweenlsrsrw < 200 &&
        angleleft > 160 &&
        angleleft < 200 &&
        angleright > 160 &&
        angleright < 200) ||
      ifStartingPointReached != false
    ) {
      ifStartingPointReached = true;

      canvasCtx.setLineDash([5,5])
      canvasCtx.beginPath();
      canvasCtx.arc(
        leftElbow.x * canvasElement.width,
        leftShoulder.y * canvasElement.height,
        distanceBetweenleftWristleftElbow,
        (-2 / 3) * Math.PI,
        0
        );
        canvasCtx.stroke();
        canvasCtx.setLineDash([0,0])

      let LPX = (leftElbow.x * canvasElement.width) + (distanceBetweenleftWristleftElbow)
      let LPY = leftShoulder.y * canvasElement.height
      let UPX = (leftElbow.x * canvasElement.width) - (distanceBetweenleftWristleftElbow * Math.cos(60 * Math.PI / 180))
      let UPY = (leftShoulder.y * canvasElement.height) - (distanceBetweenleftWristleftElbow * Math.sin(60 * Math.PI / 180))

      canvasCtx.beginPath();
      canvasCtx.strokeStyle = hitOn === 'lower' ? '#00ff00' : '#000000';
      canvasCtx.lineWidth = 2;
      canvasCtx.arc(
        LPX,
        LPY,
        10, 2 * Math.PI, false
      );
      canvasCtx.stroke();

      if(distance(LPX, LPY, leftWrist.x * canvasElement.width, leftWrist.y * canvasElement.height) < 10){
        if (hitOn === 'lower')
          hitOn = 'upper'
      }

      canvasCtx.beginPath();
      canvasCtx.strokeStyle = hitOn === 'upper' ? '#00ff00' : '#000000';
      canvasCtx.lineWidth = 2;
      canvasCtx.arc(
        UPX,
        UPY,
        10, 2 * Math.PI, false
      );
      canvasCtx.stroke();

      if (distance(UPX, UPY, leftWrist.x * canvasElement.width, leftWrist.y * canvasElement.height) < 10) {
        if(hitOn === 'upper')
          reps++
        hitOn = 'lower'
      }

    }

    // ^ Change the color of the line
    if(!ifStartingPointReached){
      if (anglebetweenlsrsrw > 150 && anglebetweenlsrsrw < 210) {
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

      if (anglebetweenrslslw > 150 && anglebetweenrslslw < 210) {
        drawLine(
          "green",
          [
            leftShoulder.x * canvasRef.current.width,
            leftShoulder.y * canvasRef.current.height,
          ],
          [
            predictLeftWrist.x * canvasRef.current.width,
            predictLeftWrist.y * canvasRef.current.height,
          ],
          canvasCtx
        );
      } else {
        drawLine(
          "white",
          [
            leftShoulder.x * canvasRef.current.width,
            leftShoulder.y * canvasRef.current.height,
          ],
          [
            predictLeftWrist.x * canvasRef.current.width,
            predictLeftWrist.y * canvasRef.current.height,
          ],
          canvasCtx
        );
      }
    }
    

    // console.log(predictLeftWrist.y * canvasElement.height)

    canvasCtx.font = "30px Arial";
    if (ifStartingPointReached) {
      canvasCtx.fillText("Starting point reached", 10, 50);
      canvasCtx.fillText(`Reps:- ${reps}`, 10, 100);
    }
    // canvasCtx.fillText(anglebetweenlsrsrw, 10, 100);

    // ^ Points that needs to be shown in the canvas
    const allowedPoints = [11, 12, 13, 14, 15, 16, 23, 24];

    if (results.poseLandmarks) {
      connectingPoints.map((e) => {
        connectPoint(canvasCtx, results, e[0], e[1], canvasRef);
      });

      drawPointOnCanvas(
        results.poseLandmarks,
        allowedPoints,
        canvasCtx,
        canvasElement
      );
    }
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
