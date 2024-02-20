import { useEffect, useState } from "react";
import { IconButton, InputAdornment, TextField } from "@mui/material";
import GradientButton from "../../../components/GradientButton";
import DropdownInput from "../../../components/DropdownInput";
import axios from "axios";
import { ExerciseCard } from "./ExerciseCard";

export const CreatePatient: React.FC = () => {

    const [conditionDetails, setConditionDetails] = useState([])
    const [selectedCondition, setSelectedCondition] = useState<{ name: string, id: number, exercises: { name: string }[] }>({ name: "", id: -1, exercises: [] })
    const [username, setUsername] = useState("")
    const [firstname, setFirstname] = useState("")
    const [lastname, setLastname] = useState("")
    const [duration, setDuration] = useState(3)
    const [individualExercise, setIndividualEx] = useState(0)


    async function createNewPatient() {
        const url = "/patient/";

        const data = {
            user_data: {
                username: username,
                first_name: firstname,
                last_name: lastname
            },
            condition_id: (selectedCondition as { id: number }).id,
            duration: duration
        };

        console.log(data)

        await axios.post(url, data, {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                'Authorization': `Token ${localStorage.getItem("aipd-doctor-access-token")}`
            },
        }).catch(function (error: any) {
            console.log(error);
        })
            .then((data: any) => {
                localStorage.setItem("patient-id", data.data.patient_id)
                setIndividualEx(individualExercise+1)
                notifyOnWhatsapp(data.data.code)
            });
    }

    useEffect(() => {
        axios.get("/condition/",
            {
                headers: {
                    'Authorization': `Token ${localStorage.getItem("aipd-doctor-access-token")}`
                },
            }).then((data: any) => {
                console.log(data.data)
                setSelectedCondition(data.data[0])
                setConditionDetails(data.data)
            });
    }, [])

    function notifyOnWhatsapp(password: string) {
        const message =
            `
        Hi ${firstname},
        Physiotherapist has suggested you to start home exercises for ${(selectedCondition as { name: string }).name}

        To start, follow the below steps : 
        1. Download the app : https://play.google.com/store/apps/details?id=com.technopolis.aipd

        2. Login Details: 
            1. Phone number: ${username}
            2. Password: ${password}

        We wish you all the best in your quick recovery.

        Regards,
        Team Fittlyf
        `

        window.open(`https://wa.me/${username}?text=${encodeURIComponent(message)}`);
    }

    return (
        <div className="pb-16">
            <div>
                <DropdownInput
                    fullWidth={true}
                    disabled={false}
                    label={"Condition"}
                    value={selectedCondition}
                    setValue={setSelectedCondition}
                    options={conditionDetails}
                    optionLabel={"name"}
                />
            </div>
            <div className='space-y-4 my-4'>
                <div className='space-y-4'>
                    <div>
                        <TextField fullWidth label="Phonenumber"
                            value={username}
                            onChange={(e) => {
                                setUsername(e.target.value)
                            }}
                        />
                    </div>
                    <div className="flex space-x-2">
                        <TextField fullWidth label="First Name"
                            value={firstname}
                            onChange={(e) => {
                                setFirstname(e.target.value)
                            }}
                        />
                        <TextField fullWidth label="Last Name"
                            value={lastname}
                            onChange={(e) => {
                                setLastname(e.target.value)
                            }}
                        />
                    </div>
                    <div className="flex space-x-2">
                        <TextField fullWidth label="Duration (months)"
                            type="number"
                            value={duration}
                            onChange={(e) => {
                                setDuration(parseInt(e.target.value))
                            }}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <>
                                            <IconButton onClick={() => { setDuration(duration + 1) }}>
                                                +
                                            </IconButton>
                                            <IconButton onClick={() => { setDuration(duration - 1) }}>
                                                -
                                            </IconButton>
                                        </>
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </div>
                    {
                        selectedCondition.exercises.map((e : any) => {
                            return (
                                <ExerciseCard exerciseid = {e.id} exercise={e.name} individualExercise={individualExercise} />
                            )
                        })
                    }


                </div>
                <GradientButton
                    onClick={createNewPatient}
                    varient={"primary"}
                    isFullWidth={true}
                >
                    <div className="text-base">
                        Create Patient
                    </div>
                </GradientButton>
            </div>
        </div>
    )
}