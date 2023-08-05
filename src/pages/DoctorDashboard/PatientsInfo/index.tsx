import { useEffect, useState } from "react"
import axios from "axios"
import PatientCard from "./PatientCard"
import { CardActionArea } from "@mui/material"

export const PatientsInfo: React.FC = () => {

    const [patientDetails, setPatientDetails] = useState([])
    const [selectedTab, setSelectedTab] = useState(0);

    useEffect(() => {
        axios.get(selectedTab ? "/patient/" : "/active-patient/",
            {
                headers: {
                    'Authorization': `Token ${localStorage.getItem("aipd-doctor-access-token")}`
                },
            }).then((data: any) => {
                setPatientDetails(data.data)
                console.log(data.data)
                localStorage.setItem("doctor-id", data.data[0].doctor.id)
            });
    }, [selectedTab])

    return (
        <div className="pb-16">
            <div className="flex gap-x-2 mt-2 mb-4">
                <CardActionArea onClick={()=>setSelectedTab(0)}>
                    <div className={`flex-1 text-center rounded-full p-2 ${selectedTab === 0 ? 'bg-[#3EBDE0FF] text-white' : 'bg-gray-200'}`}>
                        Active
                    </div>
                </CardActionArea>
                <CardActionArea onClick={()=>setSelectedTab(1)}>
                    <div className={`flex-1 text-center rounded-full p-2 ${selectedTab === 1 ? 'bg-[#3EBDE0FF] text-white' : 'bg-gray-200'}`}>
                        All
                    </div>
                </CardActionArea>
            </div>
            {
                patientDetails.map((details, i) => {
                    return (
                        <PatientCard key={i} details={details} />
                    )
                })
            }
        </div>
    )
}