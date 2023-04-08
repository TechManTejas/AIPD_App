import { Pose } from "@mediapipe/pose";
import React, { useRef, useEffect, useState } from "react";
// import * as _Pose from "@mediapipe/pose";
import * as cam from "@mediapipe/camera_utils";
import Webcam from "react-webcam";
import {
  drawPoint,
  connectPoint,
  drawPointOnCanvas,
  connectingPoints,
  drawLine,
  distance
} from "./PoseFunctions";
import { Elbow_Curl } from "./Elbow_Curl";
import { CountDownComponent } from "./CountDownComponent";

function CameraPoseDetect() {

  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  var camera = null;

  const [timer, settimer] = useState(true);

  var ifStartingPointReached = false;
  var hitOn = "lower";
  var reps = 0;



  function onResults(results) {
    // ^ check if landmarks are detected
    if (results.poseLandmarks == undefined) return;

    // the number of reps are hard coded which is different for each exercise
    if (reps === 3) {
      reps = 0;
      settimer(false);
      camera.stop();
      return;
    }

    // * getting the video Width  | Generalized
    const videoWidth = webcamRef.current.video.videoWidth;
    const videoHeight = webcamRef.current.video.videoHeight;

    // * Set canvas width | Generalized
    canvasRef.current.width = videoWidth;
    canvasRef.current.height = videoHeight;

    // * Canvas Initialize | Generalized
    const canvasElement = canvasRef.current;
    const canvasCtx = canvasElement.getContext("2d");
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);

    canvasCtx.scale(-1, 1);
    canvasCtx.translate(-canvasElement.width, 0);
    canvasCtx.drawImage(
      results.image,
      0,
      0,
      canvasElement.width,
      canvasElement.height
    );

    const elbow_curl = new Elbow_Curl(results.poseLandmarks, canvasElement, canvasCtx)
    const anglebetweenrslslw = elbow_curl.getanglebetweenrslslw();
    const anglebetweenlsrsrw = elbow_curl.getanglebetweenlsrsrw();
    const angleleft = elbow_curl.getangleleft()
    const angleright = elbow_curl.getangleright()

    // ! is starting point reached (buffer = 40deg)

    if (elbow_curl.findifstartingPointIsReached(ifStartingPointReached)) {
      ifStartingPointReached = true;
      elbow_curl.addanarc();
      const [LPX, LPY, UPX, UPY] = elbow_curl.getSpecificPoints();

      canvasCtx.beginPath();
      canvasCtx.strokeStyle = hitOn === "lower" ? "#00ff00" : "#000000";
      canvasCtx.lineWidth = 2;
      canvasCtx.arc(LPX, LPY, 10, 2 * Math.PI, false);
      canvasCtx.stroke();

      if (
        elbow_curl.changeHitOnCondition1()
      ) {
        if (hitOn === "lower") hitOn = "upper";
      }

      canvasCtx.beginPath();
      canvasCtx.strokeStyle = hitOn === "upper" ? "#00ff00" : "#000000";
      canvasCtx.lineWidth = 2;
      canvasCtx.arc(UPX, UPY, 10, 2 * Math.PI, false);
      canvasCtx.stroke();

      if (
        elbow_curl.changeHitOnCondition2()
      ) {
        if (hitOn === "upper") reps++;
        hitOn = "lower";
      }
    }

    // ^ Change the color of the line
    if (!ifStartingPointReached) {
      if (anglebetweenlsrsrw > 150 && anglebetweenlsrsrw < 210) {
        elbow_curl.drawreflinewithcolor1("green", canvasRef)
      } else {
        elbow_curl.drawreflinewithcolor1("white", canvasRef)
      }

      if (anglebetweenrslslw > 150 && anglebetweenrslslw < 210) {
        elbow_curl.drawreflinewithcolor2("green", canvasRef)
      } else {
        elbow_curl.drawreflinewithcolor2("white", canvasRef)
      }
    }

    canvasCtx.font = "30px Arial";
    if (ifStartingPointReached) {
      canvasCtx.scale(-1, 1);
      canvasCtx.translate(-canvasElement.width, 0);
      canvasCtx.fillText("Starting point reached", 10, 50);
      canvasCtx.fillText(`Reps:- ${reps}`, 10, 100);
      canvasCtx.scale(-1, 1);
      canvasCtx.translate(-canvasElement.width, 0);
    }

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

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
        if (webcamRef.current) {
          webcamRef.current.video.srcObject = stream;
        }
      } catch (error) {
        console.error("Failed to acquire camera feed:", error);
      }
    };
    startCamera();

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
  }, [timer]);

  return (
    <center>
      <div className="App">
        {timer ? (
          <>
            <Webcam ref={webcamRef} className="hidden w-screen" />
            <canvas ref={canvasRef} className="w-screen h-screen" />
          </>
        ) : (
          <>
            <CountDownComponent settimer={settimer} />
          </>
        )}
      </div>
    </center>
  );
}
export default CameraPoseDetect;
