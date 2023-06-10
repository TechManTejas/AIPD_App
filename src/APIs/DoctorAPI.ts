import axios from "axios"
import { exerciseNames } from "../utils/ExerciseUtils";

const findKeyByValue = (value: string): number | undefined =>
  parseInt(Object.keys(exerciseNames).find((key : any) => exerciseNames[key] === value) || '');


export const addPatientExerciseInDB = ({ sets, reps, exercise }: { sets: number, reps: number, exercise : string }) => {
    axios.post("/patient_exercise/",
        {
            sets: sets,
            reps: reps,
            exercise: findKeyByValue(exercise)
        },
        {
            headers: {
                'Authorization': `Token ${localStorage.getItem("aipd-doctor-access-token")}`
            },
        }).then((data: any) => {

        });
}