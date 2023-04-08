import { Pose } from "@mediapipe/pose";
import React, { useRef, useEffect, useState } from "react";
// import * as _Pose from "@mediapipe/pose";
import * as cam from "@mediapipe/camera_utils";
import Webcam from "react-webcam";
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

    const elbow_curl = new Elbow_Curl(
      results.poseLandmarks,
      canvasElement,
      canvasCtx,
      results,
      canvasRef
    );

    const ElbowCurlModel = elbow_curl.AllTaskToDo(ifStartingPointReached, reps, hitOn)
    hitOn = ElbowCurlModel.hitOn
    ifStartingPointReached = ElbowCurlModel.ifStartingPointReached
    reps = ElbowCurlModel.reps

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
