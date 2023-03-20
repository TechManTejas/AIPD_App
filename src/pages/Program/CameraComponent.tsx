import { IonContent, IonPage } from "@ionic/react";
import { CardActionArea } from "@mui/material";
import { useRef, useEffect } from "react";
import { Link } from "react-router-dom";

export const PoseRendering: React.FC = () => {

  const videoRef = useRef()

  const pose = new Pose({
    locateFile: (file: any) => {
      console.log(file);
      return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
    },
  });

  pose.setOptions({
    modelComplexity: 1,
    smoothLandmarks: true,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5,
    selfieMode: true,
  });

  console.log(pose);

  pose.onResults((data: any) => {
    console.log(data);
  });

  useEffect(() => {
    const constraints = {
      audio: false,
      video: true
    };
  
    navigator.mediaDevices.getUserMedia(constraints)
      .then(stream => {
        // Set the stream as the source for the video element
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      })
      .catch(error => {
        console.error('Error accessing camera:', error);
      });
  }, []);

  setInterval(() => {
    pose.send({ image: videoRef.current});
  }, 1000)

  return (
    <IonPage>
      <IonContent fullscreen>
        <video ref = {videoRef} className="input_video"></video>
      </IonContent>
    </IonPage>
  );
};
