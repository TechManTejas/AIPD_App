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

export default function PendulumStraight({
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

    // * Some Important points
    const leftShoulder = results.poseLandmarks[11];
    const rightShoulder = results.poseLandmarks[12];
    const leftElbow = results.poseLandmarks[13];
    const rightElbow = results.poseLandmarks[14];
    const leftWrist = results.poseLandmarks[15];
    const rightWrist = results.poseLandmarks[16];

    const right_hip = results.poseLandmarks[24];
    const right_knee = results.poseLandmarks[26];

    const distanceRightShoulderRightWrist = Math.sqrt(
        Math.pow(
            rightShoulder.x * canvasElement.width - rightWrist.x * canvasElement.width,
            2
        ) +
        Math.pow(
            rightShoulder.y * canvasElement.height - rightWrist.y * canvasElement.height,
            2
        )
    );

    canvasCtx.setLineDash([5, 5]);
    canvasCtx.beginPath();
    canvasCtx.arc(
        (rightShoulder.x * canvasElement.width ),
        (rightShoulder.y * canvasElement.height ),
        (distanceRightShoulderRightWrist),
        (1 / 6) * Math.PI,
        (5 / 6) * Math.PI
    );

    canvasCtx.stroke();
    canvasCtx.setLineDash([0, 0]);


    //center
    if (hitOn === 1 || hitOn === 3 || hitOn === 5) {
        canvasCtx.beginPath();
        canvasCtx.strokeStyle = "#ff0000"
        canvasCtx.lineWidth = 2;
        canvasCtx.arc(
            right_knee.x * canvasElement.width,
            right_knee.y * canvasElement.height,
            40,
            2 * Math.PI, false
        );
        canvasCtx.stroke();
    }

    let WristX = rightWrist.x * canvasElement.width;
    let WristY = rightWrist.y * canvasElement.height;

    let LPX =
        rightShoulder.x * canvasElement.width -
        (distanceRightShoulderRightWrist) * Math.cos((30 * Math.PI) / 180);
    let LPY =
        rightShoulder.y * canvasElement.height +
        (distanceRightShoulderRightWrist) * Math.sin((30 * Math.PI) / 180);

    let RPX =
        rightShoulder.x * canvasElement.width +
        (distanceRightShoulderRightWrist) * Math.cos((30 * Math.PI) / 180);
    let RPY =
        rightShoulder.y * canvasElement.height +
        (distanceRightShoulderRightWrist) * Math.sin((30 * Math.PI) / 180);

    if (hitOn === 2) {
        canvasCtx.beginPath();
        canvasCtx.strokeStyle = "#ff0000";
        canvasCtx.lineWidth = 2;
        canvasCtx.arc(
            RPX,
            RPY,
            40,
            2 * Math.PI, false
        );
        canvasCtx.stroke();
    }

    if (hitOn === 4) {
        canvasCtx.beginPath();
        canvasCtx.strokeStyle = "#ff0000";
        canvasCtx.lineWidth = 2;
        canvasCtx.arc(
            LPX,
            LPY,
            40,
            2 * Math.PI, false
        );
        canvasCtx.stroke();
    }

    // var anglerHipShoulderWrist =
    //     Math.atan2(
    //         rightShoulder.y - right_hip.y,
    //         rightShoulder.x - right_hip.x
    //     ) - Math.atan2(rightWrist.y - rightShoulder.y, rightWrist.x - rightShoulder.x);

    // anglerHipShoulderWrist *= 180 / Math.PI;
    // console.log(anglerHipShoulderWrist)

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
