import axios from "axios"
import { getDateWithFormat } from "../utils/DateTime"


export const addExerciseDataToDatabase = async (videoURL: string) => {
    await axios.post("/exercise_record/", {
        date: getDateWithFormat(),
        exercise: Number(localStorage.getItem("exerciseID")),
        patient: localStorage.getItem("patient-ID"),
        video: videoURL
    }, {
        headers: {
            Authorization: `Token ${localStorage.getItem(
                "aipd-patient-access-token"
            )}`,
        }
    }).then(() => { console.log("Data Added to Database") }).catch((e) => console.error(e))
}
