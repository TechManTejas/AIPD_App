import { connectPoint, drawPointOnCanvas } from "./PoseFunctions";
import playSound from "../../../utils/PlaySound"
import lying_arms from "../../../sounds/lying_arms.wav"
import bell from "../../../sounds/bell.wav"
import rep from "../../../sounds/rep.mp3"
import RecordRTC from 'recordrtc';

import PendulumCirclesStencyl1 from "../../../Images/LyingArms1.png"
import PendulumCirclesStencyl2 from "../../../Images/LyingArms2.png"

var globalStart = 0;
var globalStop = 0


var sets = 0;
var playInitVoice = true

const connectingPoints = [
    [12, 14],
    [14, 16],
    [12, 11],
    [11, 13],
    [15, 13],
    [12, 24],
    [11, 23],
    [23, 24],
];

function distance(x1, y1, x2, y2) {
    var dx = x2 - x1;
    var dy = y2 - y1;
    var dist = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
    return dist;
}

var start = 0;
var sub_start = 0;
var hitOn = "lower";
var reps = 0;
var resume = true
var resumeAt;
var relaxTime = 5 * 1000

let recorder;

const runInBackground = () => {
    recorder.stopRecording(async () => {
        const blob = recorder.getBlob();

        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.getRegistration()
                .then((registration) => {
                    if (registration && registration.active) {

                        const worker = registration.active;
                        worker.onmessage = function (event) {
                            if (event.data === 'done') {
                                console.log('Task is done');
                            }
                        };

                        worker.postMessage({
                            blob: blob, exercise: Number(localStorage.getItem("exerciseID")),
                            patient: localStorage.getItem("patient-ID"), authToken: localStorage.getItem(
                                "aipd-patient-access-token"
                            )
                        });
                        // window.location.href = "/"
                    } else {
                        console.error('Service worker is not registered or active.');
                    }
                })
                .catch((error) => {
                    console.error('Error accessing service worker registration:', error);
                });
        }
    });
};

const startRecording = (canvasRef) => {

    navigator.mediaDevices
        .getUserMedia({ video: true, audio: false })
        .then((stream) => {

            recorder = RecordRTC(stream, {
                type: "video",
                mimeType: "video/webm",
                canvas: canvasRef.current,
                frameRate: 3,
                videoBitsPerSecond: 1000,
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
    console.log("Preparing Next Exercise")
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
}


export default function ElbowCurl({
    results: results,
    camera: camera,
    canvasRef: canvasRef,
    webcamRef: webcamRef,
    settimer: settimer,
    setShowCoutdown: setShowCoutdown,
    repref: repref,
    setref: setref,
    setloading: setloading,
    exerciseName: exerciseName,
    stencyl: stencyl
}) {

    if(globalStart === 0){
        stencyl(PendulumCirclesStencyl1)
        startRecording(canvasRef)
        globalStart = 1
    }
    // ^ check if landmarks are detected
    if (results.poseLandmarks == undefined) return;

    if (playInitVoice) {
        playInitVoice = false
        playSound(lying_arms)
        setloading(false)
    }

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

    canvasCtx.scale(-1, 1);
    canvasCtx.translate(-canvasElement.width, 0);
    canvasCtx.drawImage(
        results.image,
        0,
        0,
        canvasElement.width,
        canvasElement.height
    );

    if (resume) {

        // if (sets == localStorage.getItem("sets")) {
        //     document.getElementById("done-exercise").click()
        //     sets = 0
        //     return;
        // }

        if (reps == localStorage.getItem("reps") && sets === Number(localStorage.getItem("sets")) - 1) {
            reps = 0
            sets++;
            runInBackground()
            // wait for 40 seconds
            resume = false
            relaxTime = 10 * 1000
            resumeAt = Date.now() + relaxTime
            globalStop = 1
            // setShowCoutdown(true)
        } else if (reps == localStorage.getItem("reps")) {
            reps = 0;
            sets++;
            resume = false
            console.log("PAUSE IT")
            resumeAt = Date.now() + relaxTime
            return;
        }

        // * Some Important points
        const nose = results.poseLandmarks[0];
        const leftShoulder = results.poseLandmarks[11];
        const rightShoulder = results.poseLandmarks[12];
        const rightHip = results.poseLandmarks[24];
        const leftElbow = results.poseLandmarks[13];
        const rightElbow = results.poseLandmarks[14];
        const leftWrist = results.poseLandmarks[15];
        const rightWrist = results.poseLandmarks[16];

        // ! Angle between right shoulder left shoulder and left wrist
        var anglebetweenrslslw =
            Math.atan2(
                rightShoulder.y - leftShoulder.y,
                rightShoulder.x - leftShoulder.x
            ) - Math.atan2(leftWrist.y - leftShoulder.y, leftWrist.x - leftShoulder.x);

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
            Math.atan2(rightWrist.y - rightShoulder.y, rightWrist.x - rightShoulder.x);

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
                leftShoulder.x * canvasElement.width - rightHip.x * canvasElement.width,
                2
            ) +
            Math.pow(
                leftShoulder.y * canvasElement.height - rightHip.y * canvasElement.height,
                2
            )
        );

        let WristX = rightWrist.x * canvasElement.width;
        let WristY = rightWrist.y * canvasElement.height;
        let HeadX = nose.x * canvasElement.width;
        let HeadY = nose.y * canvasElement.height;

        //center
        if (!start) {
            // canvasCtx.beginPath();
            // canvasCtx.strokeStyle = "#00FF00"
            // canvasCtx.lineWidth = 2;
            // canvasCtx.arc(
            //     right_knee.x * canvasElement.width,
            //     right_knee.y * canvasElement.height,
            //     circleRadius,
            //     2 * Math.PI, false
            // );
            // canvasCtx.fillText(hitOn, right_knee.x * canvasElement.width, right_knee.y * canvasElement.height);
            // canvasCtx.stroke();

            if (sub_start === 0) {
                canvasCtx.beginPath();
                canvasCtx.strokeStyle = "#00FF00"
                canvasCtx.lineWidth = 2;
                canvasCtx.arc(
                    // 0.65 * 
                    (canvasElement.width / 2) + (canvasElement.width * 0.0),
                    // 0.35 * 
                    (canvasElement.height / 2) - (canvasElement.height * 0.25),
                    60,
                    2 * Math.PI, false
                );
                
                canvasCtx.stroke();

                canvasCtx.beginPath();
                canvasCtx.strokeStyle = "#00FF00"
                canvasCtx.lineWidth = 2;
                canvasCtx.arc(
                    // 0.65 * 
                    (canvasElement.width / 2) + (canvasElement.width * 0.0),
                    // 0.35 * 
                    (canvasElement.height / 2) + (canvasElement.height * 0.0),
                    60,
                    2 * Math.PI, false
                );
                
                canvasCtx.stroke();
            } else if (sub_start === 1) {
                canvasCtx.beginPath();
                canvasCtx.strokeStyle = "#00FF00"
                canvasCtx.lineWidth = 2;
                canvasCtx.arc(
                    // 0.65 * 
                    (canvasElement.width / 2) + (canvasElement.width * 0.0),
                    // 0.35 * 
                    (canvasElement.height / 2) - (canvasElement.height * 0.1),
                    60,
                    2 * Math.PI, false
                );
                
                canvasCtx.stroke();

                canvasCtx.beginPath();
                canvasCtx.strokeStyle = "#00FF00"
                canvasCtx.lineWidth = 2;
                canvasCtx.arc(
                    // 0.65 * 
                    (canvasElement.width / 2) + (canvasElement.width * 0.0),
                    // 0.35 * 
                    (canvasElement.height / 2) - (canvasElement.height * 0.3),
                    60,
                    2 * Math.PI, false
                );
                
                canvasCtx.stroke();
            }
        }

        if (!start) {

            if (
                sub_start === 0 &&
                (distance(
                    // 0.65 * 
                    (canvasElement.width / 2) + (canvasElement.width * 0.0),
                    // 0.35 * 
                    (canvasElement.height / 2) + (canvasElement.height * 0.0),
                    WristX,
                    WristY
                ) < 60)
                &&
                (distance(
                    // 0.65 * 
                    (canvasElement.width / 2) + (canvasElement.width * 0.0),
                    // 0.35 * 
                    (canvasElement.height / 2) - (canvasElement.height * 0.25),
                    HeadX,
                    HeadY
                ) < 60)
            ) {
                playSound(bell)
                sub_start = 1
                stencyl(PendulumCirclesStencyl2)
                // start = 1
                // hitOn = 1
            }
            else if (
                sub_start === 1 &&
                (distance(
                    // 0.65 * 
                    (canvasElement.width / 2) + (canvasElement.width * 0.0),
                    // 0.35 * 
                    (canvasElement.height / 2) - (canvasElement.height * 0.3),
                    WristX,
                    WristY
                ) < 60)
                &&
                (distance(
                    // 0.65 * 
                    (canvasElement.width / 2) + (canvasElement.width * 0.0),
                    // 0.35 * 
                    (canvasElement.height / 2) - (canvasElement.height * 0.1),
                    HeadX,
                    HeadY
                ) < 60)
            ) {
                playSound(bell)
                start = 1
                hitOn = 1
                stencyl(null)
            }
        }

        if(start){
            let LPX = (leftShoulder.x * canvasElement.width + rightShoulder.x * canvasElement.width) / 2;
            let LPY = leftShoulder.y * canvasElement.height;
            let UPX = (leftShoulder.x * canvasElement.width + rightShoulder.x * canvasElement.width) / 2;
            let UPY = leftShoulder.y * canvasElement.height - distanceBetweenleftWristleftElbow;

            canvasCtx.setLineDash([5, 5]);
            canvasCtx.beginPath();
            canvasCtx.strokeStyle = hitOn === "lower" ? "#00ff00" : "#000000";
            canvasCtx.lineWidth = 2;
            canvasCtx.moveTo(LPX, LPY);
            canvasCtx.lineTo(UPX, UPY);
            canvasCtx.stroke();
            canvasCtx.setLineDash([0, 0]);

            canvasCtx.beginPath();
            canvasCtx.strokeStyle = hitOn === "lower" ? "#00ff00" : "#000000";
            canvasCtx.lineWidth = 2;
            canvasCtx.arc(LPX, LPY, 60, 2 * Math.PI, false);
            canvasCtx.stroke();

            if (
                distance(
                    LPX,
                    LPY,
                    leftWrist.x * canvasElement.width,
                    leftWrist.y * canvasElement.height
                ) < 60
            ) {
                if (hitOn === "lower") {
                    playSound(rep)
                    hitOn = "upper"
                };
            }

            canvasCtx.beginPath();
            canvasCtx.strokeStyle = hitOn === "upper" ? "#00ff00" : "#000000";
            canvasCtx.lineWidth = 2;
            canvasCtx.arc(UPX, UPY, 60, 2 * Math.PI, false);
            canvasCtx.stroke();

            if (
                distance(
                    UPX,
                    UPY,
                    leftWrist.x * canvasElement.width,
                    leftWrist.y * canvasElement.height
                ) < 60
            ) {
                if (hitOn === "upper") {
                    playSound(rep)
                    reps++
                };
                hitOn = "lower";
            }
        }

        repref.current.innerHTML = `${reps} / ${localStorage.getItem("reps")}`;
        setref.current.innerHTML = `${sets} /  ${localStorage.getItem("sets")}`;

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

    } else {

        const remainingTime = resumeAt - Date.now()

        if (remainingTime <= 0) {
            if(globalStop){
                Handle$NextDirectExercise()
                window.location.href = "/"
            }
            else
                resume = true;
        } else {
            canvasCtx.scale(-1, 1);
            canvasCtx.translate(-canvasElement.width, 0);

            const timerText = `${Math.ceil(remainingTime / 1000)}`;
            canvasCtx.font = "120px Arial";
            canvasCtx.fillStyle = "#00FF00"; // Green color for the timer
            if(relaxTime === 10 * 1000)
                canvasCtx.fillText("Please Wait...", 0,
                    canvasElement.height / 4);
            canvasCtx.fillText(timerText, canvasElement.width / 2,
                canvasElement.height / 2); // Adjust the position as needed

            canvasCtx.scale(-1, 1);
            canvasCtx.translate(-canvasElement.width, 0);
        }
    }
}
