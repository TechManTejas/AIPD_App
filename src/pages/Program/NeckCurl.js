import { connectPoint, drawLine, drawPointOnCanvas } from "./PoseFunctions";

const connectingPoints = [
    [8, 6],
    [6, 5],
    [5, 4],
    [4, 0],
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 7],
];

function distance(x1, y1, x2, y2) {
    var dx = x2 - x1;
    var dy = y2 - y1;
    var dist = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
    return dist;
}

var hitOn = 1;
var reps = 0;
var sets = 0;

export default function NeckCurl({
    results: results,
    camera: camera,
    canvasRef: canvasRef,
    webcamRef: webcamRef,
    settimer: settimer,
    repref : repref
}) {
    // ^ check if landmarks are detected
    if (results.poseLandmarks == undefined) return;

    // console.log(timer)
    if (reps === 3) {
        reps = 0;
        sets++;
        settimer(false);
        camera.stop();
        return;
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


    const leftEar = results.poseLandmarks[7];
    const rightEar = results.poseLandmarks[8];
    const leftEye = results.poseLandmarks[2];
    const rightEye = results.poseLandmarks[5];
    const nose = results.poseLandmarks[0];

    const noseX = nose.x * canvasElement.width
    const noseY = nose.y * canvasElement.height

    canvasCtx.beginPath();
    canvasCtx.strokeStyle = "#ffffff";
    canvasCtx.lineWidth = 2;
    canvasCtx.arc(noseX, noseY, 10, 2 * Math.PI, false);
    canvasCtx.stroke();

    if (hitOn === 1 || hitOn === 3 || hitOn === 5) {
        canvasCtx.beginPath();
        canvasCtx.strokeStyle = "#ff0000";
        canvasCtx.lineWidth = 2;
        canvasCtx.arc(
            canvasElement.width / 2,
            canvasElement.height / 2,
            10,
            2 * Math.PI,
            false
        );
        canvasCtx.stroke();
    }

    if (hitOn === 2) {
        canvasCtx.beginPath();
        canvasCtx.strokeStyle = "#ff0000";
        canvasCtx.lineWidth = 2;
        canvasCtx.arc(
            canvasElement.width / 2 + 130,
            canvasElement.height / 2 - 70,
            10,
            2 * Math.PI,
            false
        );
        canvasCtx.stroke();
    }

    if (hitOn === 4) {
        canvasCtx.beginPath();
        canvasCtx.strokeStyle = "#ff0000";
        canvasCtx.lineWidth = 2;
        canvasCtx.arc(
            canvasElement.width / 2 - 130,
            canvasElement.height / 2 - 70,
            10,
            2 * Math.PI,
            false
        );
        canvasCtx.stroke();
    }

    if (hitOn === 1 || hitOn === 3 || hitOn === 5) {
        if (distance(
            noseX,
            noseY,
            canvasElement.width / 2,
            canvasElement.height / 2
        ) < 10) {
            hitOn++
            if (hitOn === 6) {
                hitOn = 1
                reps++
            }
        }
    }

    if (hitOn === 2) {
        if (distance(
            noseX,
            noseY,
            canvasElement.width / 2 + 130,
            canvasElement.height / 2 - 70
        ) < 10) {
            hitOn++
        }
    }

    if (hitOn === 4) {
        if (distance(
            noseX,
            noseY,
            canvasElement.width / 2 - 130,
            canvasElement.height / 2 - 70
        ) < 10) {
            hitOn++
        }
    }

    // canvasCtx.font = "60px Arial";
    // canvasCtx.scale(-1, 1);
    // canvasCtx.translate(-canvasElement.width, 0);
    // canvasCtx.fillText(`Reps:- ${reps}`, 10, 50);
    // canvasCtx.scale(-1, 1);
    // canvasCtx.translate(-canvasElement.width, 0);

    repref.current.innerHTML = `Reps :- ${reps} <br> Sets :- ${sets}`

    // ^ Points that needs to be shown in the canvas
    const allowedPoints = [0, 1, 2, 3, 4, 5, 6, 7, 8];

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
