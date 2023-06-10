export const ExerciseId = () => {
    const exercise = localStorage.getItem("exercise")
    if (exercise === 'PendulumStraight') {
        return 11
    } else if (exercise === 'PendulumSideways') {
        return 10
    } else if (exercise === 'Butterfly') {
        return 7
    } else if (exercise === 'PendulumCircles') {
        return 9
    } else if (exercise === 'LyingArms') {
        return 8
    } else if (exercise === 'ArmsLock') {
        return 6
    }
}

interface ExerciseNames {
    [key: number]: string;
}

export const exerciseNames: ExerciseNames = {
    6: "ArmsLock",
    7: "Butterfly",
    8: "LyingArms",
    9: "PendulumCircles",
    10: "PendulumSideways",
    11: "PendulumStraight",
};

export const exerciseOriginalNames: ExerciseNames = {
    6: "Arms Lock",
    7: "Butterfly",
    8: "Lying Arms",
    9: "Pendulum Circles",
    10: "Pendulum Sideways",
    11: "Pendulum Straight",
};

