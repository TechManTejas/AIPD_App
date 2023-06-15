import { connectPoint, drawPointOnCanvas } from "./PoseFunctions";

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

var start = 0;
var hitOn = 0;
var reps = 0;
var sets = 0;
var message = 'Bring your elbows to the circles'

export default function Butterfly({
    results: results,
    camera: camera,
    canvasRef: canvasRef,
    webcamRef: webcamRef,
    settimer: settimer,
    repref: repref,
    setref: setref,
    messageRef: messageRef,
}) {
    // ^ check if landmarks are detected
    if (results.poseLandmarks == undefined) return;

    // console.log(sets, localStorage.getItem("sets"))
    if (sets == localStorage.getItem("sets")) {
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

    //reference point
    if (start === 0) {
        canvasCtx.beginPath();
        canvasCtx.strokeStyle = "#FF0000"
        canvasCtx.lineWidth = 2;
        canvasCtx.arc(
            (rightShoulder.x * canvasElement.width),
            (rightEar.y * canvasElement.height),
            50,
            2 * Math.PI, false
        );
        canvasCtx.fillText(hitOn, right_knee.x * canvasElement.width, right_knee.y * canvasElement.height);
        canvasCtx.stroke();

        canvasCtx.beginPath();
        canvasCtx.strokeStyle = "#FF0000"
        canvasCtx.lineWidth = 2;
        canvasCtx.arc(
            (leftShoulder.x * canvasElement.width),
            (leftEar.y * canvasElement.height),
            50,
            2 * Math.PI, false
        );
        canvasCtx.fillText(hitOn, right_knee.x * canvasElement.width, right_knee.y * canvasElement.height);
        canvasCtx.stroke();
    }



    if (start === 0) {
        if
            (
            (
                distance(
                    leftElbow.x * canvasElement.width, leftElbow.y * canvasElement.height,
                    leftShoulder.x * canvasElement.width, leftEar.y * canvasElement.height
                ) < 100
            )
            &&
            (
                distance(
                    rightElbow.x * canvasElement.width, rightElbow.y * canvasElement.height,
                    rightShoulder.x * canvasElement.width, rightEar.y * canvasElement.height
                ) < 100
            )
        ) {
            start = 1
            message = 'Push Back'
        }
    }

    if (start === 1) {
        if (hitOn === 0) {
            if (distance(
                leftElbow.x * canvasElement.width, leftElbow.y * canvasElement.height,
                rightElbow.x * canvasElement.width, rightElbow.y * canvasElement.height
            ) > 700) {
                hitOn = 1
                message = 'Relax'
            }
        }

        if (hitOn === 1) {
            if (distance(
                leftElbow.x * canvasElement.width, leftElbow.y * canvasElement.height,
                rightElbow.x * canvasElement.width, rightElbow.y * canvasElement.height
            ) < 500) {
                reps++
                hitOn = 0
                message = 'Push Back'
            }
        }
    }

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
