import { connectPoint, drawPointOnCanvas } from "./PoseFunctions";
import playSound from "../../../utils/PlaySound"
import bell from "../../../sounds/bell.wav"
import butterfly from "../../../sounds/butterfly.wav"
import rep from "../../../sounds/rep.mp3"
import RecordRTC from 'recordrtc';

import PendulumCirclesStencyl1 from "../../../Images/Butterfly1.png"
import PendulumCirclesStencyl2 from "../../../Images/Butterfly2.png"

var globalStart = 0;
var globalStop = 0

var sets = 0;


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

function distance3D(x1, y1, z1, x2, y2, z2) {
    var dx = x2 - x1;
    var dy = y2 - y1;
    var dz = z2 - z1;
    var dist = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2) + Math.pow(dz, 2));
    return dist;
}
var playInitVoice = true
var sub_start = 0;
var start = 0;
var hitOn = 0;
var reps = 0;
var sets = 0;
var message = 'Bring your elbows to the circles'

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


export default function Butterfly({
    results: results,
    camera: camera,
    canvasRef: canvasRef,
    webcamRef: webcamRef,
    settimer: settimer,
    setShowCoutdown: setShowCoutdown,
    repref: repref,
    setref: setref,
    messageRef: messageRef,
    setloading: setloading,
    exerciseName: exerciseName,
    stencyl: stencyl
}) {

    if (globalStart === 0) {
        stencyl(PendulumCirclesStencyl1)
        startRecording(canvasRef)
        globalStart = 1
    }
    // ^ check if landmarks are detected
    if (results.poseLandmarks == undefined) return;

    if (playInitVoice) {
        playInitVoice = false
        playSound(butterfly)
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

        canvasCtx.font = "30px Arial";

        // * Some Important points
        const leftEar = results.poseLandmarks[7];
        const rightEar = results.poseLandmarks[8];
        const leftShoulder = results.poseLandmarks[11];
        const rightShoulder = results.poseLandmarks[12];
        const leftElbow = results.poseLandmarks[13];
        const rightElbow = results.poseLandmarks[14];
        const leftWrist = results.poseLandmarks[15];
        const rightWrist = results.poseLandmarks[16];

        const right_hip = results.poseLandmarks[24];
        const right_knee = results.poseLandmarks[26];

        let circleRadius = distance3D(
            leftShoulder.x, leftShoulder.y, leftShoulder.z,
            rightShoulder.x, rightShoulder.y, rightShoulder.z
        ) * 100

        var anglebetweenrelslsr =
            Math.atan2(
                leftElbow.y - leftShoulder.y,
                leftElbow.x - leftShoulder.x
            ) -
            Math.atan2(
                leftShoulder.y - rightShoulder.y,
                leftShoulder.x - rightShoulder.x
            );
        anglebetweenrelslsr *= 180 / Math.PI;

        // console.log('l', anglebetweenrelslsr)

        var anglebetweenrersrsl =
            Math.atan2(
                rightElbow.y - rightShoulder.y,
                rightElbow.x - rightShoulder.x
            ) -
            Math.atan2(
                rightShoulder.y - leftShoulder.y,
                rightShoulder.x - leftShoulder.x
            );
        anglebetweenrersrsl *= 180 / Math.PI;

        // console.log('r', anglebetweenrersrsl)

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
                    (canvasElement.width / 2) + (canvasElement.width * 0.15),
                    // 0.35 * 
                    (canvasElement.height / 2) - (canvasElement.height * 0.15),
                    60,
                    2 * Math.PI, false
                );
                canvasCtx.fillText(hitOn, right_knee.x * canvasElement.width, right_knee.y * canvasElement.height);
                canvasCtx.stroke();

                canvasCtx.beginPath();
                canvasCtx.strokeStyle = "#00FF00"
                canvasCtx.lineWidth = 2;
                canvasCtx.arc(
                    // 0.65 * 
                    (canvasElement.width / 2) - (canvasElement.width * 0.15),
                    // 0.35 * 
                    (canvasElement.height / 2) - (canvasElement.height * 0.15),
                    60,
                    2 * Math.PI, false
                );
                canvasCtx.fillText(hitOn, right_knee.x * canvasElement.width, right_knee.y * canvasElement.height);
                canvasCtx.stroke();
            } else if (sub_start === 1) {
                canvasCtx.beginPath();
                canvasCtx.strokeStyle = "#00FF00"
                canvasCtx.lineWidth = 2;
                canvasCtx.arc(
                    // 0.65 * 
                    (canvasElement.width / 2) + (canvasElement.width * 0.35),
                    // 0.35 * 
                    (canvasElement.height / 2) - (canvasElement.height * 0.15),
                    60,
                    2 * Math.PI, false
                );
                canvasCtx.fillText(hitOn, right_knee.x * canvasElement.width, right_knee.y * canvasElement.height);
                canvasCtx.stroke();

                canvasCtx.beginPath();
                canvasCtx.strokeStyle = "#00FF00"
                canvasCtx.lineWidth = 2;
                canvasCtx.arc(
                    // 0.65 * 
                    (canvasElement.width / 2) - (canvasElement.width * 0.35),
                    // 0.35 * 
                    (canvasElement.height / 2) - (canvasElement.height * 0.15),
                    60,
                    2 * Math.PI, false
                );
                canvasCtx.fillText(hitOn, right_knee.x * canvasElement.width, right_knee.y * canvasElement.height);
                canvasCtx.stroke();
            }
        }

        //reference point
        // if (!start) {
        //     canvasCtx.beginPath();
        //     canvasCtx.strokeStyle = "#00FF00"
        //     canvasCtx.lineWidth = 2;
        //     canvasCtx.arc(
        //         (rightShoulder.x * canvasElement.width),
        //         (rightEar.y * canvasElement.height),
        //         50,
        //         2 * Math.PI, false
        //     );
        //     canvasCtx.fillText(hitOn, right_knee.x * canvasElement.width, right_knee.y * canvasElement.height);
        //     canvasCtx.stroke();

        //     canvasCtx.beginPath();
        //     canvasCtx.strokeStyle = "#00FF00"
        //     canvasCtx.lineWidth = 2;
        //     canvasCtx.arc(
        //         (leftShoulder.x * canvasElement.width),
        //         (leftEar.y * canvasElement.height),
        //         50,
        //         2 * Math.PI, false
        //     );
        //     canvasCtx.fillText(hitOn, right_knee.x * canvasElement.width, right_knee.y * canvasElement.height);
        //     canvasCtx.stroke();
        // }

        // if (start === 0) {
        //     if
        //         (
        //         (
        //             distance(
        //                 leftElbow.x * canvasElement.width, leftElbow.y * canvasElement.height,
        //                 leftShoulder.x * canvasElement.width, leftEar.y * canvasElement.height
        //             ) < 100
        //         )
        //         &&
        //         (
        //             distance(
        //                 rightElbow.x * canvasElement.width, rightElbow.y * canvasElement.height,
        //                 rightShoulder.x * canvasElement.width, rightEar.y * canvasElement.height
        //             ) < 100
        //         )
        //     ) {
        //         playSound(bell)
        //         start = 1
        //         message = 'Push Back'
        //     }
        // }

        if (!start) {

            if (
                sub_start === 0 &&
                (
                    distance(
                        // 0.65 * 
                        (canvasElement.width / 2) + (canvasElement.width * 0.15),
                        // 0.35 * 
                        (canvasElement.height / 2) - (canvasElement.height * 0.15),
                        leftElbow.x * canvasElement.width,
                        leftElbow.y * canvasElement.height
                    ) < 60
                )
                &&
                (
                    distance(
                        // 0.65 * 
                        (canvasElement.width / 2) - (canvasElement.width * 0.15),
                        // 0.35 * 
                        (canvasElement.height / 2) - (canvasElement.height * 0.15),
                        rightElbow.x * canvasElement.width,
                        rightElbow.y * canvasElement.height
                    ) < 60
                )
            ) {
                playSound(bell)
                sub_start = 1
                stencyl(PendulumCirclesStencyl2)
                // start = 1
                // hitOn = 1
            }
            else if (
                sub_start === 1 &&
                (
                    distance(
                        // 0.65 * 
                        (canvasElement.width / 2) + (canvasElement.width * 0.35),
                        // 0.35 * 
                        (canvasElement.height / 2) - (canvasElement.height * 0.15),
                        leftElbow.x * canvasElement.width,
                        leftElbow.y * canvasElement.height
                    ) < 60
                )
                &&
                (
                    distance(
                        // 0.65 * 
                        (canvasElement.width / 2) - (canvasElement.width * 0.35),
                        // 0.35 * 
                        (canvasElement.height / 2) - (canvasElement.height * 0.15),
                        rightElbow.x * canvasElement.width,
                        rightElbow.y * canvasElement.height
                    ) < 60
                )
            ) {
                playSound(bell)
                start = 1
                hitOn = 1
                stencyl(null)
            }
        }

        if (start === 1) {

            let relationalDistance = distance(
                leftElbow.x * canvasElement.width, leftElbow.y * canvasElement.height,
                rightElbow.x * canvasElement.width, rightElbow.y * canvasElement.height
            )
                /
                distance(
                    leftShoulder.x * canvasElement.width, leftShoulder.y * canvasElement.height,
                    rightShoulder.x * canvasElement.width, rightShoulder.y * canvasElement.height
                )

            if (hitOn === 0) {
                if (relationalDistance > 2.1) {
                    playSound(rep)
                    hitOn = 1
                    message = 'Relax'
                }
            }

            if (hitOn === 1) {
                if (relationalDistance < 1.9) {
                    playSound(rep)
                    reps++
                    hitOn = 0
                    message = 'Push Back'
                }
            }
        }

        repref.current.innerHTML = `${reps} / ${localStorage.getItem("reps")}`;
        setref.current.innerHTML = `${sets} /  ${localStorage.getItem("sets")}`;
        // messageRef.current.innerHTML = `${message}`;

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
            if (globalStop) {
                Handle$NextDirectExercise()
                exerciseName.current = "Lying Arms"
            } else
                resume = true;
        } else {
            canvasCtx.scale(-1, 1);
            canvasCtx.translate(-canvasElement.width, 0);

            const timerText = `${Math.ceil(remainingTime / 1000)}`;
            canvasCtx.font = "120px Arial";
            canvasCtx.fillStyle = "#00FF00"; // Green color for the timer
            if (relaxTime === 10 * 1000)
                canvasCtx.fillText("Please Wait...", 0,
                    canvasElement.height / 4);
            canvasCtx.fillText(timerText, canvasElement.width / 2,
                canvasElement.height / 2); // Adjust the position as needed

            canvasCtx.scale(-1, 1);
            canvasCtx.translate(-canvasElement.width, 0);
        }
    }
}