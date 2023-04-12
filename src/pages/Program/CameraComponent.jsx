import { Pose } from "@mediapipe/pose";
import { useRef, useEffect, useState } from "react";
import * as cam from "@mediapipe/camera_utils";
import Webcam from "react-webcam";
import { CountDownComponent } from "./CountDownComponent";
import ElbowCurl from "./ElbowCurl";
import NeckCurl from "./NeckCurl";

var ex = 0

function CameraPoseDetect() {
  // * Refs
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  var camera = null;

  const [timer, settimer] = useState(true);

  function onResults(results) {
    if (ex%2 == 1){
      NeckCurl({
        results: results,
        camera: camera,
        canvasRef: canvasRef,
        webcamRef: webcamRef,
        settimer: settimer,
      })
    }else{
      ElbowCurl({
        results: results,
        camera: camera,
        canvasRef: canvasRef,
        webcamRef: webcamRef,
        settimer: settimer,
      })
    }
  }

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
      ex++
      console.log(ex)
    }
  }, [timer]);

  return (
    <center>
      <div className="App">
        {timer ? (
          <>
            <Webcam ref={webcamRef} className="hidden w-screen" />
            <canvas ref={canvasRef} className="w-screen" />
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
