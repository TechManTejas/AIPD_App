import { useEffect, useState } from "react";
import axios from "axios";
import { OutlinedInput } from "@mui/material";
import GradientButton from "../../components/GradientButton";
import DropdownInput from "../../components/DropdownInput";

export const DoctorCreatePatient: React.FC = () => {

    const [conditionDetails, setConditionDetails] = useState([])
    const [selectedCondition, setSelectedCondition] = useState({})
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

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
        const message = `Hello User, thank you for choosing AIPD. Your exercise plan has been successfully setup by Dr. Siddharth, your login credentials for AIPD_App are:- \n username: ${username} \n password: ${password}`;
        window.open(`https://wa.me/${username}?text=${encodeURIComponent(message)}`);
    }

    return (
        <>
            <DropdownInput
                fullWidth={true}
                disabled={false}
                label={"label"}
                value={selectedCondition}
                setValue={setSelectedCondition}
                options={conditionDetails}
                optionLabel={"name"}
            />
            <div className='space-y-2 my-4'>
                <OutlinedInput fullWidth placeholder="Phonenumber"
                    value={username}
                    onChange={(e) => {
                        setUsername(e.target.value)
                    }}
                />
                {/* <OutlinedInput fullWidth placeholder="Password"
                    value={password}
                    onChange={(e) => {
                        setPassword(e.target.value)
                    }}
                /> */}
                <GradientButton
                    onClick={createNewPatient}
                    varient={"primary"}
                    isFullWidth={true}
                >
                    <div className="text-base">
                        Add Patient
                    </div>
                </GradientButton>
            </div>
            {/* <GradientButton onClick={notifyOnWhatsapp}
                varient={"success"}
                isFullWidth={true}>
                <img alt="Chat on WhatsApp" src="WhatsAppButtonGreenLarge.svg" />
                <div className="text-lg m-0.5">
                    SEND THE USER A NOTIFICATION
                </div>
            </GradientButton> */}
        </>
    )
}