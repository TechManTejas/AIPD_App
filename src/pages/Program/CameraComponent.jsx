import { Pose } from "@mediapipe/pose";
import { useRef, useEffect, useState } from "react";
import * as cam from "@mediapipe/camera_utils";
import Webcam from "react-webcam";
import { CountDownComponent } from "./CountDownComponent";
import PendulumSideways from "./PendulumSideways";
import PendulumCircles from "./PendulumCircles";
import PendulumStraight from "./PendulumStraight";
import PendulumSidewaysLeft from "./PendulumSidewaysLeft";
import PendulumCirclesLeft from "./PendulumCirclesLeft";
import PendulumStraightLeft from "./PendulumStraightLeft";
import LyingArms from "./LyingArms";
import Butterfly from "./Butterfly";
import ArmsLock from "./ArmsLock";
import RecordRTC from 'recordrtc';
import { uploadFile } from "../../APIs/storage";
import playSound from "../../utils/PlaySound";
import CountdownTimer from "./CountdownTimer";
import { Link } from "react-router-dom";
import successSound from "../../sounds/excellent_work.wav";


function CameraPoseDetect({ showCoutdown, setShowCoutdown, loading, setloading, repref, setref, messageRef }) {
  // * Refs
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const StateRef = useRef(0);
  let recorder;

  const [isModalOpen, setIsModalOpen] = useState(false);

  var camera = null;

  const [timer, settimer] = useState(true);

  var exercise;



  useEffect(() => {
    if (!loading) {
      startRecording();
      document.getElementById("done-exercise").addEventListener("click", () => {
        playSound(successSound)
        setIsModalOpen(true)
        stopRecordingAndUploadFileToFirebase()
        setIsModalOpen(false)
        setShowCoutdown(false)
      })
    }
  }, [loading])

  const startRecording = () => {

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: false })
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


  function findEntryByExercise(data, exercise) {
    const entry = data.find((entry) => entry.exercise === exercise);
    return entry || null;
  }

  const Handle$NextDirectExercise = () => {

    localStorage.setItem("Allexerciseid", (Number(localStorage.getItem("Allexerciseid")) + 1).toString());
    const exerciseDetails = JSON.parse(localStorage.getItem("exerciseDetails"));
    const individualSetReps = JSON.parse(localStorage.getItem("individualSetReps"));

    if (Number(localStorage.getItem("Allexerciseid")) === exerciseDetails.length) {
      window.location.href = "/"
      return;
    }

    console.log(exerciseDetails)

    const entry = findEntryByExercise(individualSetReps, Number(exerciseDetails[Number(localStorage.getItem("Allexerciseid") || "0")].id))


    localStorage.setItem(
      "sets",
      entry ? entry.sets.toString() : "",
    );
    localStorage.setItem(
      "reps",
      entry ? entry.reps.toString() : "",
    );

    localStorage.setItem(
      "exerciseID",
      exerciseDetails[Number(localStorage.getItem("Allexerciseid") || "0")].id.toString()
    );

    localStorage.setItem(
      "exercise",
      exerciseDetails[Number(localStorage.getItem("Allexerciseid") || "0")].name
    );

    window.location.href = "/camera-rendering"
  }

  useEffect(() => {
    // console.log("StateRef.value", StateRef.value)
    if (showCoutdown && StateRef.current === 1) {
      Handle$NextDirectExercise()
    }
  }, [showCoutdown])

  const stopRecordingAndUploadFileToFirebase = async () => {
    if (recorder) {
      recorder.stopRecording(async () => {
        try {
          const blob = recorder.getBlob();
          const videoURL = URL.createObjectURL(blob);
          URL.revokeObjectURL(videoURL);
          console.log(blob)
          uploadFile(blob).then(async () => {
            // setIsModalOpen(false)
            if (localStorage.getItem("allexercise") === "1") {
              StateRef.current = 1;
              // setShowCoutdown(false)
            }
            else window.location.href = "/demo-video-logs"
          });
        } catch (error) {
          console.log("--------------------------------> ", error)
        }
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
      messageRef: messageRef,
    })
  }

  useEffect(() => {
    exercise = localStorage.getItem("exercise");
    if (exercise === 'Pendulum Straight Right') {
      exercise = PendulumStraight
    }
    else if (exercise === 'Pendulum Sideways Right') {
      exercise = PendulumSideways
    }
    else if (exercise === 'Pendulum Circles Right') {
      exercise = PendulumCircles
    }
    else if (exercise === 'Pendulum Straight Left') {
      exercise = PendulumStraightLeft
    }
    else if (exercise === 'Pendulum Sideways Left') {
      exercise = PendulumSidewaysLeft
    }
    else if (exercise === 'Pendulum Circles Left') {
      exercise = PendulumCirclesLeft
    }
    else if (exercise === 'Butterfly') {
      exercise = Butterfly
    }
    else if (exercise === 'Lying Arms') {
      exercise = LyingArms
    }
    else if (exercise === 'Arms Lock') {
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
    playSound(ArmsLock)
    if (webcamRef.current !== "undefined" && webcamRef.current !== null) {
      camera = new cam.Camera(webcamRef.current.video, {
        onFrame: async () => {
          await pose.send({ image: webcamRef.current.video }).then(() => {
            setloading(false)
          });
        },
      });
      camera.start()
    }
  }, [timer]);

  return (
    <center>
      <div className="App">
        {timer && showCoutdown ? (
          <>
            <Webcam id="webcam" ref={webcamRef} className="hidden w-screen" />
            <canvas ref={canvasRef} className=" -ml-[100px] w-[600px] h-screen" />
          </>
        ) : (
          <>
            {!timer && <CountDownComponent settimer={settimer} />}
          </>
        )}
      </div>
      <div>
        <div className={` ${isModalOpen ? "" : "hidden"} bg-white absolute top-0 z-10 h-screen w-screen grid place-items-center`}>
          <p>Great Job 👏🏻👏🏻</p>
        </div>
      </div>
      {
        !showCoutdown && <div className="w-screen h-screen absolute z-50 top-0 ledft-0  flex flex-col justify-center items-center">
          <button onClick={() => setShowCoutdown(true)} className="m-3 px-8 py-2 bg-green-500">Next</button>
          <CountdownTimer seconds={5}
            size={200}
            strokeBgColor="white"
            strokeColor="black"
            strokeWidth={12}
            setCountDown={setShowCoutdown}
          />
          <Link to="/" className="m-3 px-8 py-2 bg-green-500" >Home</Link>
        </div>

      }
    </center>
  );

}
export default CameraPoseDetect;