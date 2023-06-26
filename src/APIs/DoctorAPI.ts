import axios from "axios"

export const post$patient_exercise = async ({ sets, reps, exercise }: { sets: number, reps: number, exercise: string }) => {
    const data = {
        sets: sets,
        reps: reps,
        exercise: exercise,
        patient: localStorage.getItem("patient-id")
    }
    console.log(data)
    await axios.post("/patient_exercise/",
        data,
        {
            headers: {
                'Authorization': `Token ${localStorage.getItem("aipd-doctor-access-token")}`
            },
        }).then((data: any) => {
            console.log("Added Data of " + exercise)
        }).catch(error => {
            console.log(error)
        })
}