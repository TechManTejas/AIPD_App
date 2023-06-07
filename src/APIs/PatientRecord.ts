import axios from "axios"
import { getDateWithFormat } from "../utils/DateTime"
import { ExerciseId } from "../utils/ExerciseUtils"


export const addExerciseDataToDatabase = async (videoURL: string) => {
    await axios.post("/exercise_record/", {
        date: getDateWithFormat(),
        exercise: ExerciseId(),
        patient: 43,
        video: videoURL
    }, {
        headers: {
            Authorization: `Token ${localStorage.getItem(
                "aipd-patient-access-token"
            )}`,
        }
    }).then(() => { console.log("Data Added to Database") }).catch((e) => console.error(e))
}