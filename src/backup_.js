import { Pose } from "@mediapipe/pose";
import { useRef, useEffect, useState } from "react";
import * as cam from "@mediapipe/camera_utils";
import Webcam from "react-webcam";
import {
    connectPoint,
    drawPointOnCanvas,
    connectingPoints,
    drawLine,
} from "./PoseFunctions";
import { CountDownComponent } from "./CountDownComponent";
import ElbowCurl from "./ElbowCurl";

// recording exercise directly from the video of the trainer (making references point)

function CameraPoseDetect() {
    // * Refs
    const webcamRef = useRef(null);
    const canvasRef = useRef(null);
    var camera = null;

    const [timer, settimer] = useState(true);
    const [timeD, settd] = useState(5);

    ElbowCurl({
        results: results,
        camera: camera,
        canvasRef: canvasRef,
        webcamRef: webcamRef,
        settimer: settimer,
    })

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

        pose.onResults(ElbowCurl);

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
