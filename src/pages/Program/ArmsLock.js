import { connectPoint, drawPointOnCanvas } from "./PoseFunctions";


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



var done = 0
var start = 0;
var red_touched = 0;
var green_touched = 1;
var reps = 0;
var sets = 0;
var message = 'Join the colored circle with same colors'

let eltime = 0;
const IntervalForCountingTimesElapsed = () => {
    const interval = setInterval(() => {
        eltime++
        if (eltime % 2 === 0 && eltime > 0) {
            reps++;
        }
        if (eltime === 0) {
            start = 0
            clearInterval(interval)
        }
    }, 1000)
}

export default function ArmsLock({
    results: results,
    camera: camera,
    canvasRef: canvasRef,
    webcamRef: webcamRef,
    settimer: settimer,
    repref: repref,
    setref: setref,
    messageRef: messageRef,
}) {
    if (results.poseLandmarks == undefined || done) return; 

    if (sets == localStorage.getItem("sets")) {
        done = 1;
        document.getElementById("done-exercise").click()
        sets = 0
        return;
    }

    if (reps == localStorage.getItem("reps") && sets === Number(localStorage.getItem("sets")) - 1) {
        reps = 0
        sets++;
        return;
    }

    // console.log(reps, Number(localStorage.getItem("reps")))
    if (reps == localStorage.getItem("reps")) {
        reps = 0;
        eltime = -10;
        sets++;
        settimer(false);
        camera.stop();
        return;
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
            canvasCtx.strokeStyle = "#FF0000"
            canvasCtx.lineWidth = 2;
            canvasCtx.arc(
                (rightShoulder.x * canvasElement.width),
                (rightShoulder.y * canvasElement.height),
                50,
                2 * Math.PI, false
            );
            canvasCtx.stroke();
            canvasCtx.beginPath();
            canvasCtx.strokeStyle = "#FF0000"
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

        if(red_touched && green_touched){
            console.log("okay")
            start = 1   
            message = 'Push Back'
            IntervalForCountingTimesElapsed()
        }
    }

    // if (start === 1 && startedTimer === 1) {
    //     startedTimer = 0
    //     startTimer()
    // }

    repref.current.innerHTML = `Reps :- ${reps}`;
    setref.current.innerHTML = `Sets :- ${sets}`;
    messageRef.current.innerHTML = `${message}`;

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
}
