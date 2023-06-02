import { Pose } from "@mediapipe/pose";
import { useRef, useEffect, useState } from "react";
import * as cam from "@mediapipe/camera_utils";
import Webcam from "react-webcam";
import { CountDownComponent } from "./CountDownComponent";
import ElbowCurl from "./ElbowCurl";
import NeckCurl from "./NeckCurl";
import PendulumSideways from "./PendulumSideways";
import PendulumCircles from "./PendulumCircles";
import PendulumStraight from "./PendulumStraight";
import LyingArms from "./LyingArms";
import Butterfly from "./Butterfly";
import ArmsLock from "./ArmsLock";
import RecordRTC from 'recordrtc';

function CameraPoseDetect({ setloading, repref, setref, messageRef }) {
  // * Refs
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  let recorder;

  var camera = null;

  const [timer, settimer] = useState(true);
  const [screenshots, setScreenshots] = useState([]);
  const [stopInterval, setStopInterval] = useState(false);

  var exercise;

  const startRecording = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {

        recorder = RecordRTC(stream, {
          type: "video",
          mimeType: "video/webm",
          canvas: canvasRef.current,
          frameRate: 5,
          videoBitsPerSecond: 1000000,
        });

        recorder.startRecording();
      })
      .catch((error) => {
        console.error("Error accessing user media:", error);
      });
  };

  const stopRecording = () => {
    if (recorder) {
      recorder.stopRecording(() => {
        const blob = recorder.getBlob();
        const videoURL = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = videoURL;
        a.download = "recorded_video.webm";
        a.click();

        URL.revokeObjectURL(videoURL);
      });
    }
  };


  function onResults(results) {
    exercise({
      results: results,
      camera: camera,
      canvasRef: canvasRef,
      webcamRef: webcamRef,
      settimer: settimer,
      repref: repref,
      setref: setref,
      messageRef: messageRef
    })
  }

  useEffect(() => {
    exercise = localStorage.getItem("exercise");

    if (exercise === 'PendulumStraight') {
      exercise = PendulumStraight
    } else if (exercise === 'PendulumSideways') {
      exercise = PendulumSideways
    } else if (exercise === 'Butterfly') {
      exercise = Butterfly
    } else if (exercise === 'PendulumCircles') {
      exercise = PendulumCircles
    } else if (exercise === 'LyingArms') {
      exercise = LyingArms
    } else if (exercise === 'ArmsLock') {
      exercise = ArmsLock
    }

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

    pose.onResults(onResults)

    if (webcamRef.current !== "undefined" && webcamRef.current !== null) {
      camera = new cam.Camera(webcamRef.current.video, {
        onFrame: async () => {
          await pose.send({ image: webcamRef.current.video }).then(() => {
            setloading(false)
          });
        },
      });
      camera.start()
      // ex++
      // console.log(ex)
    }
  }, [timer]);

  // var size = 0
  // useEffect(() => {
  //   // Start capturing the screenshot every 3 seconds
  //   const interval = setInterval(() => {
  //     // Capture the screenshot with a specific quality (e.g., 0.8 for 80% quality)
  //     const image = canvasRef.current.toDataURL("image/png", 0.1);

  //     // Calculate the size of the screenshot in bytes
  //     const sizeInBytes = image.length;

  //     // Convert the size to megabytes (MB)
  //     const sizeInMB = sizeInBytes / (1024 * 1024);
  //     size += sizeInMB;
  //     console.log(size);

  //     // Store the screenshot in the state variable
  //     setScreenshots(prevScreenshots => [...prevScreenshots, image]);
  //   }, 100);

  //   // Stop the interval if stopInterval is true
  //   if (stopInterval) {
  //     clearInterval(interval);
  //   }

  //   // Clean up the interval when the component unmounts or when the timer state changes
  //   return () => clearInterval(interval);
  // }, [stopInterval]);

  return (
    <center>
      <div className="App">
        {timer ? (
          <>
            <Webcam ref={webcamRef} className="hidden w-screen" />
            <canvas ref={canvasRef} className=" -ml-[100px] w-[600px] h-screen" />
          </>
        ) : (
          <>
            <CountDownComponent settimer={settimer} />
          </>
        )}

        {/* Button to start recording */}
        <button onClick={startRecording}>Start Recording</button>

        {/* Button to stop recording */}
        <button onClick={stopRecording}>Stop Recording</button>

        {/* <div>
          <h2>Captured Screenshots:</h2>
          {screenshots.map((screenshot, index) => (
            <img key={index} src={screenshot} alt={`Screenshot ${index}`} />
          ))}
        </div> */}
      </div>
    </center>
  );

}
export default CameraPoseDetect;
