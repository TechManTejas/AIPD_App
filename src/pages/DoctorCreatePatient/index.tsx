import { useEffect, useState } from "react";
import axios from "axios";
import { OutlinedInput } from "@mui/material";
import GradientButton from "../../components/GradientButton";
import { Select, MenuItem } from '@material-ui/core';
import DropdownInput from "../../components/DropdownInput";

export const DoctorCreatePatient: React.FC = () => {

    const [conditionDetails, setConditionDetails] = useState([])
    const [selectedCondition, setSelectedCondition] = useState({})
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    function createNewPatient() {
        const url = "http://127.0.0.1:8000/patient/";
        const data = { user_data: { username: username, password: password }, condition_id: (selectedCondition as { id: number }).id };
        console.log(data)
        axios.post(url, data, {
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

            });
    }

    useEffect(() => {
        axios.get("http://127.0.0.1:8000/condition/",
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
                <OutlinedInput fullWidth placeholder="Username"
                    value={username}
                    onChange={(e) => {
                        setUsername(e.target.value)
                    }}
                />
                <OutlinedInput fullWidth placeholder="Password"
                    value={password}
                    onChange={(e) => {
                        setPassword(e.target.value)
                    }}
                />
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
        </>
    )
}