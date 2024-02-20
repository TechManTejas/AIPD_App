import { connectPoint, drawPointOnCanvas } from "./PoseFunctions";
import playSound from "../../../utils/PlaySound"
import bell from "../../../sounds/bell.wav"
import arms_lock from "../../../sounds/arms_lock.wav"
import rep from "../../../sounds/rep.mp3"
import RecordRTC from 'recordrtc';

var globalStart = 0;
var globalStop = 0

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

// Variable to track elapsed time
let elapsedSeconds = 0;
function startTimer() {
    reps += 1
    elapsedSeconds += 2;

    if (elapsedSeconds >= 10) {
        return;
    }
    setTimeout(startTimer, 2000);
}


var playInitVoice = true
var done = 0
var start = 0;
var red_touched = 0;
var green_touched = 1;
var reps = 0;
var sets = 0;
var message = 'Join the colored circle with same colors'
const pset = localStorage.getItem("sets")
const prep = localStorage.getItem("reps")

var resume = true
var resumeAt;
var relaxTime = 5 * 1000

let eltime = 0;
const IntervalForCountingTimesElapsed = () => {
    const interval = setInterval(() => {
        eltime++
        if (eltime % 2 === 0 && eltime > 0) {
            playSound(rep)
            reps++;
        }
        if (eltime === 0) {
            start = 0
            clearInterval(interval)
        }
    }, 1000)
}

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


export default function ArmsLock({
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
    exerciseName: exerciseName
}) {

    if (globalStart === 0) {
        startRecording(canvasRef)
        globalStart = 1
    }

    if (results.poseLandmarks == undefined || done) return;

    if (playInitVoice) {
        playInitVoice = false
        playSound(arms_lock)
        setloading(false)
    }

    message = eltime


    // * getting the video Width
    const videoWidth = webcamRef.current.video.videoWidth;
    const videoHeight = webcamRef.current.video.videoHeight;

    // * Set canvas width
    canvasRef.current.width = videoWidth;
    canvasRef.current.height = videoHeight;

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
        //     done = 1;
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
            relaxTime = 0 * 1000
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

        const leftShoulder = results.poseLandmarks[11];
        const rightShoulder = results.poseLandmarks[12];
        const leftElbow = results.poseLandmarks[13];
        const rightElbow = results.poseLandmarks[14];
        const leftWrist = results.poseLandmarks[15];
        const rightWrist = results.poseLandmarks[16];

        if (start === 0) {
            if (!red_touched) {
                canvasCtx.beginPath();
                canvasCtx.strokeStyle = "#00FF00"
                canvasCtx.lineWidth = 2;
                canvasCtx.arc(
                    (rightShoulder.x * canvasElement.width),
                    (rightShoulder.y * canvasElement.height),
                    50,
                    2 * Math.PI, false
                );
                canvasCtx.stroke();
                canvasCtx.beginPath();
                canvasCtx.strokeStyle = "#00FF00"
                canvasCtx.lineWidth = 2;
                canvasCtx.arc(
                    (leftWrist.x * canvasElement.width),
                    (leftWrist.y * canvasElement.height),
                    50,
                    2 * Math.PI, false
                );
                canvasCtx.stroke();
            }

            if (!green_touched) {
                canvasCtx.beginPath();
                canvasCtx.strokeStyle = "#00FF00"
                canvasCtx.lineWidth = 2;
                canvasCtx.arc(
                    (leftElbow.x * canvasElement.width),
                    (leftElbow.y * canvasElement.height),
                    50,
                    2 * Math.PI, false
                );
                canvasCtx.stroke();
                canvasCtx.beginPath();
                canvasCtx.strokeStyle = "#00FF00"
                canvasCtx.lineWidth = 2;
                canvasCtx.arc(
                    (rightWrist.x * canvasElement.width),
                    (rightWrist.y * canvasElement.height),
                    50,
                    2 * Math.PI, false
                );
                canvasCtx.stroke();
            }
        }

        if (start === 0) {
            if ((distance(
                leftWrist.x * canvasElement.width, leftWrist.y * canvasElement.height,
                rightShoulder.x * canvasElement.width, rightShoulder.y * canvasElement.height
            ) < 75)) {
                red_touched = 1
                green_touched = 0
            }

            if ((distance(
                leftElbow.x * canvasElement.width, leftElbow.y * canvasElement.height,
                rightWrist.x * canvasElement.width, rightWrist.y * canvasElement.height
            ) < 75)) {
                green_touched = 1
            }

            if (red_touched && green_touched) {
                playSound(bell)
                start = 1
                message = 'Push Back'
                IntervalForCountingTimesElapsed()
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
                window.location.href = "/"
            } else
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
