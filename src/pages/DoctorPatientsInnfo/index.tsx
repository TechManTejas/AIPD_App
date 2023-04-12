import { useEffect, useState } from "react"
import axios from "axios"

export const DoctorPatientsInfo: React.FC = () => {

    const [patientDetails, setPatientDetails] = useState([])

    useEffect(() => {
        axios.get("/patient/",
            {
                headers: {
                    'Authorization': `Token ${localStorage.getItem("aipd-doctor-access-token")}`
                },
            }).then((data: any) => {
                setPatientDetails(data.data)
                console.log(data.data)
            });
    }, [])


    return (
        <>
            {
                patientDetails.map((details) => {
                    return (
                        <div className="border m-1 p-2 border-gray-900 mb-4 bg-slate-50">
                            <div className="text-2xl font-bold text-green-600 bg-green-50">
                                {(details as { user: { username: string } }).user.username}
                            </div>
                            <div className="text-lg font-semibold text-red-500 bg-red-50">
                                {(details as { condition: { name: string } }).condition.name}
                            </div>
                            {(details as { condition: { exercises: [] } }).condition.exercises.map((exercise: { name: string }) => {
                                return (
                                    <div>
                                        {exercise.name}
                                    </div>
                                );
                            })}

                        </div>
                    )
                })
            }
        </>
    )
}