import { Pose } from "@mediapipe/pose";
import { useRef, useEffect, useState } from "react";
import * as cam from "@mediapipe/camera_utils";
import Webcam from "react-webcam";
import { CountDownComponent } from "./CountDownComponent";
import PendulumSideways from "./PendulumSideways";
import PendulumCircles from "./PendulumCircles";
import PendulumStraight from "./PendulumStraight";
import LyingArms from "./LyingArms";
import Butterfly from "./Butterfly";
import ArmsLock from "./ArmsLock";
import RecordRTC from 'recordrtc';
import { uploadFile } from "../../APIs/storage";
import { message } from "antd";
import { Modal } from "antd";

function CameraPoseDetect({ loading, setloading, repref, setref, messageRef }) {
  // * Refs
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  let recorder;

  const [isModalOpen, setIsModalOpen] = useState(false);

  var camera = null;

  const [timer, settimer] = useState(true);

  var exercise;

  async function getPermissionStatus() {
    try {
      const videoPermissionStatus = await navigator.permissions.query({ name: 'camera' });
      const audioPermissionStatus = await navigator.permissions.query({ name: 'microphone' });
  
      message.info('Video permission status: ' + videoPermissionStatus.state.toString());
      message.info('Audio permission status: ' + audioPermissionStatus.state.toString());

      console.log('Video permission status:', videoPermissionStatus.state.toString());
      console.log('Audio permission status:', audioPermissionStatus.state.toString());
    } catch (error) {
      console.error('Error retrieving permission status:', error);
    }
  }
  
  getPermissionStatus();
  
  useEffect(() => {
    if (!loading) {
      startRecording();
      document.getElementById("done-exercise").addEventListener("click", () => {
        setIsModalOpen(true)
        stopRecordingAndUploadFileToFirebase()
      })
    }
  }, [loading])

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

  const stopRecordingAndUploadFileToFirebase = async () => {
    if (recorder) {
      await recorder.stopRecording(async () => {
        try {
          const blob = recorder.getBlob();
          const videoURL = URL.createObjectURL(blob);
          URL.revokeObjectURL(videoURL);
          console.log(blob)
          await uploadFile(blob).then(() => {
            setIsModalOpen(false)
            window.location.href = "/demo-video-logs"
          });
        } catch (error){
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
    }
  }, [timer]);

  return (
    <center>
      <div className="App">
        {timer ? (
          <>
            <Webcam id="webcam" ref={webcamRef} className="hidden w-screen" />
            <canvas ref={canvasRef} className=" -ml-[100px] w-[600px] h-screen" />
          </>
        ) : (
          <>
            <CountDownComponent settimer={settimer} />
          </>
        )}
      </div>
      <div>
        <Modal closable={false} title="" footer={null} open={isModalOpen}>
          <p>Adding Data to Database</p>
        </Modal>
      </div>
    </center>
  );

}
export default CameraPoseDetect;
