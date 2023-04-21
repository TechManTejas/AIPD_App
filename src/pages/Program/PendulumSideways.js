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

var hitOn = 1;
var reps = 0;
var sets = 0;

export default function PendulumSideways({
    results: results,
    camera: camera,
    canvasRef: canvasRef,
    webcamRef: webcamRef,
    settimer: settimer,
    repref: repref,
    setref: setref,
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

    canvasCtx.font = "30px Arial";

    // * Some Important points
    const leftShoulder = results.poseLandmarks[11];
    const rightShoulder = results.poseLandmarks[12];
    const leftElbow = results.poseLandmarks[13];
    const rightElbow = results.poseLandmarks[14];
    const leftWrist = results.poseLandmarks[15];
    const rightWrist = results.poseLandmarks[16];

    const right_hip = results.poseLandmarks[24];
    const right_knee = results.poseLandmarks[26];

    var anglebetweenrslslw =
        Math.atan2(
            rightWrist.y - rightShoulder.y,
            rightWrist.x - rightShoulder.x
        ) -
        Math.atan2(
            rightShoulder.y - right_hip.y,
            rightShoulder.x - right_hip.x
        );
    anglebetweenrslslw *= 180 / Math.PI;

    const distanceRightHipRightKnee = Math.sqrt(
        Math.pow(
            right_hip.x * canvasElement.width - right_knee.x * canvasElement.width,
            2
        ) +
        Math.pow(
            right_hip.y * canvasElement.height - right_knee.y * canvasElement.height,
            2
        )
    );

    canvasCtx.setLineDash([5, 5]);
    canvasCtx.beginPath();
    canvasCtx.arc(
        (right_hip.x * canvasElement.width + rightShoulder.x * canvasElement.width) / 2,
        (right_hip.y * canvasElement.height + rightShoulder.y * canvasElement.height) / 2,
        (distanceRightHipRightKnee * 1.25),
        (1 / 6) * Math.PI,
        (5 / 6) * Math.PI
    );

    canvasCtx.stroke();
    canvasCtx.setLineDash([0, 0]);


    //center
    if (hitOn === 1 || hitOn === 3 || hitOn === 5) {
        canvasCtx.beginPath();

        if (hitOn === 1) {
            canvasCtx.strokeStyle = "#FF0000"
        }else if (hitOn === 3) {
            canvasCtx.strokeStyle = "#0000FF"
        }else if (hitOn === 5) {
            canvasCtx.strokeStyle = "#008000"
        }

        canvasCtx.lineWidth = 2;

        canvasCtx.arc(
            right_knee.x * canvasElement.width,
            right_knee.y * canvasElement.height,
            60,
            2 * Math.PI, false
        );

        // canvasCtx.scale(-1, 1);
        // canvasCtx.translate(-canvasElement.width, 0);
        canvasCtx.fillText(hitOn, right_knee.x * canvasElement.width, right_knee.y * canvasElement.height);
        // canvasCtx.scale(-1, 1);
        // canvasCtx.translate(-canvasElement.width, 0);

        canvasCtx.stroke();
    }

    let WristX = rightWrist.x * canvasElement.width;
    let WristY = rightWrist.y * canvasElement.height;

    let LPX =
        right_hip.x * canvasElement.width -
        (distanceRightHipRightKnee * 1.25) * Math.cos((30 * Math.PI) / 180);
    let LPY =
        right_hip.y * canvasElement.height +
        (distanceRightHipRightKnee * 1.25) * Math.sin((30 * Math.PI) / 180);

    let RPX =
        right_hip.x * canvasElement.width +
        (distanceRightHipRightKnee * 1.25) * Math.cos((30 * Math.PI) / 180);
    let RPY =
        right_hip.y * canvasElement.height +
        (distanceRightHipRightKnee * 1.25) * Math.sin((30 * Math.PI) / 180);

    if (hitOn === 2) {
        canvasCtx.beginPath();
        canvasCtx.strokeStyle = "#800080";
        canvasCtx.lineWidth = 2;
        canvasCtx.arc(
            RPX,
            RPY,
            60,
            2 * Math.PI, false
        );

        // canvasCtx.scale(-1, 1);
        // canvasCtx.translate(-canvasElement.width, 0);
        canvasCtx.fillText(hitOn, RPX, RPY);
        // canvasCtx.scale(-1, 1);
        // canvasCtx.translate(-canvasElement.width, 0);

        canvasCtx.stroke();
    }

    if (hitOn === 4) {
        canvasCtx.beginPath();
        canvasCtx.strokeStyle = "#FFFF00";
        canvasCtx.lineWidth = 2;
        canvasCtx.arc(
            LPX,
            LPY,
            60,
            2 * Math.PI, false
        );

        // canvasCtx.scale(-1, 1);
        // canvasCtx.translate(-canvasElement.width, 0);
        canvasCtx.fillText(hitOn, LPX, LPY);
        // canvasCtx.scale(-1, 1);
        // canvasCtx.translate(-canvasElement.width, 0);

        canvasCtx.stroke();
    }

    if (hitOn === 1 || hitOn === 3 || hitOn === 5) {
        if (distance(
            right_knee.x * canvasElement.width,
            right_knee.y * canvasElement.height,
            WristX,
            WristY
        ) < 60) {
            hitOn++
            if (hitOn === 6) {
                hitOn = 1
                reps++
            }
        } else if (anglebetweenrslslw < 190 && anglebetweenrslslw > 170) {
            hitOn++
            if (hitOn === 6) {
                hitOn = 1
                reps++
            }
        }
    }

    if (hitOn === 2) {
        if (distance(
            RPX,
            RPY,
            WristX,
            WristY
        ) < 60) {
            hitOn++
        } else if (anglebetweenrslslw < 150) {
            hitOn++
        }
    }

    if (hitOn === 4) {
        if (distance(
            LPX,
            LPY,
            WristX,
            WristY
        ) < 60) {
            hitOn++
        } else if (anglebetweenrslslw > 210) {
            hitOn++
        }
    }


    repref.current.innerHTML = `Reps :- ${reps}`;
    setref.current.innerHTML = `Sets :- ${sets}`;

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
