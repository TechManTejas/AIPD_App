import { connectPoint, drawPointOnCanvas } from "./PoseFunctions";
import playSound from "../../../utils/PlaySound"
import bell from "../../../sounds/bell.wav"
import rep from "../../../sounds/rep.mp3"
import pendulum_sideways from "../../../sounds/pendulum_sideways.wav"
import RecordRTC from 'recordrtc';

var globalStart = 0;
var globalStop = 0

var sets = 0;
var playInitVoice = true
var resume = true
var resumeAt;
var relaxTime = 5 * 1000

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

var start = 0;
var hitOn = 0;
var reps = 0;
var sets = 0;

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


export default function PendulumSideways({
    results: results,
    camera: camera,
    canvasRef: canvasRef,
    webcamRef: webcamRef,
    settimer: settimer,
    setShowCoutdown: setShowCoutdown,
    repref: repref,
    setref: setref,
    setloading: setloading,
    exerciseName: exerciseName
}) {

    if(globalStart === 0){
        startRecording(canvasRef)
        globalStart = 1
    }
    // ^ check if landmarks are detected
    if (results.poseLandmarks == undefined) return;

    if (playInitVoice) {
        playInitVoice = false
        playSound(pendulum_sideways)
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
        const leftShoulder = results.poseLandmarks[11];
        const rightShoulder = results.poseLandmarks[12];
        const leftElbow = results.poseLandmarks[13];
        const rightElbow = results.poseLandmarks[14];
        const leftWrist = results.poseLandmarks[15];
        const rightWrist = results.poseLandmarks[16];

        const left_hip = results.poseLandmarks[23];
        const right_hip = results.poseLandmarks[24];
        const left_knee = results.poseLandmarks[25];
        const right_knee = results.poseLandmarks[26];

        let circleRadius = distance3D(
            leftShoulder.x, leftShoulder.y, leftShoulder.z,
            rightShoulder.x, rightShoulder.y, rightShoulder.z
        ) * 300

        var anglebetweenrslslw =
            Math.atan2(
                leftWrist.y - leftShoulder.y,
                leftWrist.x - leftShoulder.x
            ) -
            Math.atan2(
                leftShoulder.y - left_hip.y,
                leftShoulder.x - left_hip.x
            );
        anglebetweenrslslw *= 180 / Math.PI;

        const distanceRightShoulderRightWrist = Math.sqrt(
            Math.pow(
                leftShoulder.x * canvasElement.width - leftWrist.x * canvasElement.width,
                2
            ) +
            Math.pow(
                leftShoulder.y * canvasElement.height - leftWrist.y * canvasElement.height,
                2
            )
        );

        if (start) {
            canvasCtx.setLineDash([5, 5]);
            canvasCtx.beginPath();
            canvasCtx.arc(
                (leftShoulder.x * canvasElement.width),
                (leftShoulder.y * canvasElement.height),
                (distanceRightShoulderRightWrist),
                (1 / 6) * Math.PI,
                (5 / 6) * Math.PI
            );
            canvasCtx.stroke();
            canvasCtx.setLineDash([0, 0]);
        }

        //center
        if (!start) {
            canvasCtx.beginPath();
            canvasCtx.strokeStyle = "#00FF00"
            canvasCtx.lineWidth = 2;
            canvasCtx.arc(
                left_knee.x * canvasElement.width,
                left_knee.y * canvasElement.height,
                circleRadius,
                2 * Math.PI, false
            );
            canvasCtx.fillText(hitOn, left_knee.x * canvasElement.width, left_knee.y * canvasElement.height);
            canvasCtx.stroke();
        }

        let WristX = leftWrist.x * canvasElement.width;
        let WristY = leftWrist.y * canvasElement.height;

        let LPX =
            leftShoulder.x * canvasElement.width -
            (distanceRightShoulderRightWrist) * Math.cos((30 * Math.PI) / 180);
        let LPY =
            leftShoulder.y * canvasElement.height +
            (distanceRightShoulderRightWrist) * Math.sin((30 * Math.PI) / 180);

        let RPX =
            leftShoulder.x * canvasElement.width +
            (distanceRightShoulderRightWrist) * Math.cos((30 * Math.PI) / 180);
        let RPY =
            leftShoulder.y * canvasElement.height +
            (distanceRightShoulderRightWrist) * Math.sin((30 * Math.PI) / 180);

        if (hitOn === 1) {
            canvasCtx.beginPath();
            canvasCtx.strokeStyle = "#00FF00";
            canvasCtx.lineWidth = 2;
            canvasCtx.arc(
                RPX,
                RPY,
                circleRadius,
                2 * Math.PI, false
            );
            canvasCtx.fillText(hitOn, RPX, RPY);
            canvasCtx.stroke();
        }

        if (hitOn === 2) {
            canvasCtx.beginPath();
            canvasCtx.strokeStyle = "#00FF00";
            canvasCtx.lineWidth = 2;
            canvasCtx.arc(
                LPX,
                LPY,
                circleRadius,
                2 * Math.PI, false
            );
            canvasCtx.fillText(hitOn, LPX, LPY);
            canvasCtx.stroke();
        }

        if (!start) {
            if (distance(
                left_knee.x * canvasElement.width,
                left_knee.y * canvasElement.height,
                WristX,
                WristY
            ) < circleRadius) {
                playSound(bell)
                start = 1
                hitOn = 1
            }
        }

        if (hitOn === 1) {
            if (distance(
                RPX,
                RPY,
                WristX,
                WristY
            ) < circleRadius) {
                playSound(rep)
                hitOn = 2
            } else if (anglebetweenrslslw < 150) {
                playSound(rep)
                hitOn = 2
            }
        }

        if (hitOn === 2) {
            if (distance(
                LPX,
                LPY,
                WristX,
                WristY
            ) < circleRadius) {
                playSound(rep)
                hitOn = 1
                reps++
            } else if (anglebetweenrslslw > 210) {
                playSound(rep)
                hitOn = 1
                reps++
            }
        }

        // console.log(hitOn)


        repref.current.innerHTML = `${reps} / ${localStorage.getItem("reps")}`;
        setref.current.innerHTML = `${sets} / ${localStorage.getItem("sets")}`;

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
                exerciseName.current = "Pendulum Straight Left"
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
