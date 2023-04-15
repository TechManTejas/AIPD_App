import { useEffect, useState } from "react";
import { IconButton, InputAdornment, TextField } from "@mui/material";
import GradientButton from "../../../components/GradientButton";
import DropdownInput from "../../../components/DropdownInput";
import axios from "axios";

export const CreatePatient: React.FC = () => {

    const [conditionDetails, setConditionDetails] = useState([])
    const [selectedCondition, setSelectedCondition] = useState({})
    const [username, setUsername] = useState("")
    const [firstname, setFirstname] = useState("")
    const [lastname, setLastname] = useState("")
    const [duration, setDuration] = useState(3)

    async function createNewPatient() {
        const url = "/patient/";
        const data = { user_data: { username: username }, condition_id: (selectedCondition as { id: number }).id };
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
                console.log(data);
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

`Dear ${firstname} ${lastname},

Dr Siddharth has suggested you to start your journey of home exercises for the condition of ${(selectedCondition as {name: string}).name}

To start, follow the below steps : 
1. Download the application from this link : https://play.google.com/store/apps/details?id=com.TechnopolisStudio.Electrica&hl=en_US&gl=US
2. Login using user ID and password : 
    1. Phone number: ${username}
    2. Program code: ${password}

We wish you all the best in your quick recovery and are always available to help you. 

To reach out to us, reply with “Hi” and someone from our team will reach out to you on this very chat. 

Regards,
Team Fittlyf`;

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