import { connectPoint, connectPointStencil, drawPointOnCanvas } from "./PoseFunctions";

var globalStart = 0;

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

const connectingPointsStencil = [
    [8, 6],
    [6, 5],
    [5, 4],
    [4, 0],
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 7],
    [10, 9],
    [12, 11],
    [12, 14],
    [14, 16],
    [16, 22],
    [16, 18],
    [16, 20],
    [18, 20],
    [11, 13],
    [13, 15],
    [15, 21],
    [15, 17],
    [15, 19],
    [19, 17],
    [12, 24],
    [11, 23],
    [23, 24],
    [24, 26],
    [23, 25],
    [26, 28],
    [25, 27],
    [28, 32],
    [28, 30],
    [32, 30],
    [27, 31],
    [31, 29],
    [27, 29]
];

const checkCoordinates = [15, 13, 11, 12, 14, 16]

let poseData = []
let frameNumber = 0;

// Fetch the JSON data
fetch('output.json')
    .then(response => response.json())
    .then((jsonData) => {
        poseData = jsonData;
    }).then(() => {

    })
    .catch(error => console.error('Error fetching JSON:', error));

export default function PendulumCircles({
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

    if (globalStart === 0) {
        globalStart = 1
    }

    if (results.poseLandmarks === undefined) return;

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

    const calculateDistance = (point1, point2) => {
        return Math.sqrt((point1.x * canvasElement.width - point2.x * canvasElement.width) ** 2 + (point1.y * canvasElement.width - point2.y * canvasElement.width) ** 2);
    };

    const isPointsClose = (landmarks1, landmarks2, points, threshold) => {
        console.log(landmarks1[15].x, landmarks2[15].x)
        for (const pointIndex of points) {
            const distance = calculateDistance(landmarks1[pointIndex], landmarks2[pointIndex]);
            if (distance > threshold) {
                return false;
            }
        }
        return true;
    };

    const renderFrame = async () => {
        const frameDelay = 0;

        if (!poseData || frameNumber >= poseData.length) {
            console.log("STOPPED")
            return; // Stop rendering when all frames are processed
        }

        const frame = poseData[frameNumber];

        connectingPointsStencil.map((e) => {
            connectPointStencil(canvasCtx, frame, e[0], e[1], canvasRef);
        });

        drawPointOnCanvas(
            frame.pose_landmarks,
            [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 25, 26, 27, 28, 29, 30, 31],
            canvasCtx,
            canvasElement
        );

        await new Promise(resolve => setTimeout(resolve, frameDelay)); // Introduce a delay

        requestAnimationFrame(renderFrame);
    };

    const startRendering = () => {
        requestAnimationFrame(renderFrame);
    };

    if (playInitVoice) {
        playInitVoice = false
        setloading(false)
        startRendering()
    }

    // Check if points are close
    if (poseData[frameNumber]) {
        if (isPointsClose(results.poseLandmarks, poseData[frameNumber].pose_landmarks, checkCoordinates, 100)) {
            frameNumber += 1;
        }
    }

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
