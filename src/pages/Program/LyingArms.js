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

var hitOn = "lower";
var reps = 0;

export default function ElbowCurl({
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
    if(sets == localStorage.getItem("sets")){
        document.getElementById("done-exercise").click()
        sets = 0
        return;
    }

    if(reps == localStorage.getItem("reps") && sets === Number(localStorage.getItem("sets")) - 1){
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

    // * Some Important points
    const leftShoulder = results.poseLandmarks[11];
    const rightShoulder = results.poseLandmarks[12];
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
            leftShoulder.x * canvasElement.width - leftWrist.x * canvasElement.width,
            2
        ) +
        Math.pow(
            leftShoulder.y * canvasElement.height - leftWrist.y * canvasElement.height,
            2
        )
    );

    // ! is starting point reached (buffer = 40deg)

    {

        canvasCtx.setLineDash([5, 5]);
        canvasCtx.beginPath();
        canvasCtx.arc(
            leftElbow.x * canvasElement.width,
            leftShoulder.y * canvasElement.height,
            distanceBetweenleftWristleftElbow,
            (1) * Math.PI,
            (-1/2) * Math.PI
        );
        canvasCtx.stroke();
        canvasCtx.setLineDash([0, 0]);

        let LPX = leftElbow.x * canvasElement.width - distanceBetweenleftWristleftElbow/2;
        let LPY = leftShoulder.y * canvasElement.height;
        let UPX = leftElbow.x * canvasElement.width;
        let UPY = leftShoulder.y * canvasElement.height - distanceBetweenleftWristleftElbow;

        canvasCtx.beginPath();
        canvasCtx.strokeStyle = hitOn === "lower" ? "#00ff00" : "#000000";
        canvasCtx.lineWidth = 2;
        canvasCtx.arc(LPX, LPY, 100, 2 * Math.PI, false);
        canvasCtx.stroke();

        if (
            distance(
                LPX,
                LPY,
                leftWrist.x * canvasElement.width,
                leftWrist.y * canvasElement.height
            ) < 100
        ) {
            if (hitOn === "lower") hitOn = "upper";
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
            if (hitOn === "upper") reps++;
            hitOn = "lower";
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
