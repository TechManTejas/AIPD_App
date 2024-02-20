import PendulumCircles from "./Exercises/PendulumCircles";
import PendulumSideways from "./Exercises/PendulumSideways";
import PendulumStraight from "./Exercises/PendulumStraight";
import Butterfly from "./Exercises/Butterfly";
import LyingArms from "./Exercises/LyingArms";
import ArmsLock from "./Exercises/ArmsLock";
import PendulumCirclesLeft from "./Exercises/PendulumCirclesLeft";
import PendulumSidewaysLeft from "./Exercises/PendulumSidewaysLeft";
import PendulumStraightLeft from "./Exercises/PendulumStraightLeft";
import NextGenTracking from "./Exercises/NextGenTracking";
import Arthritis1 from "./Exercises/Arthritis1";
import Arthritis9 from "./Exercises/Arthritis9";
import Arthritis8 from "./Exercises/Arthritis8";
import Arthritis7 from "./Exercises/Arthritis7";
import Arthritis6 from "./Exercises/Arthritis6";
import Arthritis5 from "./Exercises/Arthritis5";
import Arthritis4 from "./Exercises/Arthritis4";
import Arthritis3 from "./Exercises/Arthritis3";
import Arthritis2 from "./Exercises/Arthritis2";
import Exercise from "./Exercises/Exercise";

export default function ExerciseManager({
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
    exerciseName: exerciseName,
    exerciseID: exerciseID,
    stencyl: stencyl
}) {

    if (exerciseName.current === "Pendulum Circles Right") {
        PendulumCircles({
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
            exerciseName: exerciseName,
            stencyl: stencyl
        })
    } else if (exerciseName.current === "Pendulum Sideways Right") {
        PendulumSideways({
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
            exerciseName: exerciseName,
            stencyl: stencyl
        })
    } else if (exerciseName.current === "Pendulum Straight Right") {
        PendulumStraight({
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
            exerciseName: exerciseName,
            stencyl: stencyl
        })
    } else if (exerciseName.current === "Butterfly") {
        Butterfly({
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
            exerciseName: exerciseName,
            stencyl: stencyl
        })
    } else if (exerciseName.current === "Lying Arms") {
        LyingArms({
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
            exerciseName: exerciseName,
            stencyl: stencyl
        })
    } else if (exerciseName.current === "Arms Lock") {
        ArmsLock({
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
            exerciseName: exerciseName,
            stencyl: stencyl
        })
    } else if (exerciseName.current === "Pendulum Circles Left") {
        PendulumCirclesLeft({
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
            exerciseName: exerciseName,
            stencyl: stencyl
        })
    } else if (exerciseName.current === "Pendulum Sideways Left") {
        PendulumSidewaysLeft({
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
            exerciseName: exerciseName,
            stencyl: stencyl
        })
    } else if (exerciseName.current === "Pendulum Straight Left") {
        PendulumStraightLeft({
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
            exerciseName: exerciseName,
            stencyl: stencyl
        })
    } else if (exerciseName.current === "NextGenTracking") {
        NextGenTracking({
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
            exerciseName: exerciseName,
            stencyl: stencyl
        })
    } else if (exerciseName.current === "Arthritis1") {
        Arthritis1({
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
            exerciseName: exerciseName,
            stencyl: stencyl
        })
    } else if (exerciseName.current === "Arthritis2") {
        Arthritis2({
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
            exerciseName: exerciseName,
            stencyl: stencyl
        })
    } else if (exerciseName.current === "Arthritis3") {
        Arthritis3({
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
            exerciseName: exerciseName,
            stencyl: stencyl
        })
    } else if (exerciseName.current === "Arthritis4") {
        Arthritis4({
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
            exerciseName: exerciseName,
            stencyl: stencyl
        })
    } else if (exerciseName.current === "Arthritis5") {
        Arthritis5({
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
            exerciseName: exerciseName,
            stencyl: stencyl
        })
    } else if (exerciseName.current === "Arthritis6") {
        Arthritis6({
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
            exerciseName: exerciseName,
            stencyl: stencyl
        })
    } else if (exerciseName.current === "Arthritis7") {
        Arthritis7({
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
            exerciseName: exerciseName,
            stencyl: stencyl
        })
    } else if (exerciseName.current === "Arthritis8") {
        Arthritis8({
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
            exerciseName: exerciseName,
            stencyl: stencyl
        })
    } else if (exerciseName.current === "Arthritis9") {
        Arthritis9({
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
            exerciseName: exerciseName,
            stencyl: stencyl
        })
    } else {
        Exercise({
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
            exerciseName: exerciseName,
            exerciseID: exerciseID,
            stencyl: stencyl
        })
    }
}
