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