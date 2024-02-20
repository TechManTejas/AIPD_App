import axios from "axios";
import { connectPoint, connectPointStencil, connectPointStencilPhysio, drawCircleOnCanvas, drawPointOnCanvas, drawPointOnCanvasPhysio } from "./PoseFunctions";

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

let checkCoordinates = [15, 13, 11, 12, 14, 16]
let poseData = []
let degree_of_strictness = 100

let frameNumber = 0;
let frameNumberPhysio = 0;

// Fetch the JSON data
fetch('output.json')
    .then(response => response.json())
    .then((jsonData) => {

        poseData = jsonData;

    }).then(() => {

    })
    .catch(error => console.error('Error fetching JSON:', error));

// Fetch the JSON data
axios.get(`${process.env.REACT_APP_API_BASEURL}/exercise/${localStorage.getItem("exerciseID")}/`, {
    params: {
        exercise_record_id: localStorage.getItem('review-exercise-record')
    },
    headers: {
        Authorization: `Token ${localStorage.getItem(
            "aipd-patient-access-token"
        )}`,
    },
})
    .then((response) => {

        console.log(response.data)
        var coordinated_link = response.data.coordinates_file
        checkCoordinates = [15, 13, 11, 12, 14, 16] || response.data.matching_points_data.points
        degree_of_strictness = response.data.degree_of_strictness

        fetch(coordinated_link)
            .then(response => response.json())
            .then((jsonData) => {

                console.log(jsonData)

                // poseData = jsonData;

            }).then(() => {

            })
            .catch(error => console.error('Error fetching JSON:', error));

    }).then(() => {

    })
    .catch(error => console.error('Error fetching JSON:', error));


export default function Exercise({
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

    const renderFramePhysio = async () => {
        const frameDelay = 1;

        if (!poseData || frameNumberPhysio >= poseData.length) {
            frameNumberPhysio = 0
            console.log("LOOPED")
        }

        const frame = poseData[frameNumberPhysio];

        connectingPointsStencil.map((e) => {
            connectPointStencilPhysio(canvasCtx, frame, e[0], e[1], canvasRef);
        });

        drawPointOnCanvasPhysio(
            frame.pose_landmarks,
            [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 25, 26, 27, 28, 29, 30, 31],
            canvasCtx,
            canvasElement
        );

        await new Promise(resolve => setTimeout(resolve, frameDelay)); 
        
        frameNumberPhysio += 1

        requestAnimationFrame(renderFramePhysio);
    };

    const startRendering = () => {
        requestAnimationFrame(renderFrame);
    };

    const startRenderingPhysio = () => {
        requestAnimationFrame(renderFramePhysio);
    };

    if (playInitVoice) {
        playInitVoice = false
        setloading(false)
        startRendering()
        startRenderingPhysio()
    }

    // Check if points are close
    if (poseData[frameNumber]) {
        if (isPointsClose(results.poseLandmarks, poseData[frameNumber].pose_landmarks, checkCoordinates, degree_of_strictness)) {
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

        drawCircleOnCanvas(
            results.poseLandmarks,
            checkCoordinates,
            canvasCtx,
            canvasElement
        );
    }
}

// /me stays with the clear majority, in the group of approx 7999991000 people not attending