import { useEffect, useState } from "react"
import axios from "axios"

export const PatientsInfo: React.FC = () => {

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
        <div className="pb-16">
            {
                patientDetails.map((details) => {
                    return (
                        <div className="border shadow-xl rounded m-1 p-2 mb-4 bg-slate-50">
                            <div className="flex justify-between">
                                <div className="text-2xl font-bold text-green-600 bg-green-50">
                                    {(details as { user: { first_name: string } }).user.first_name} 
                                    &nbsp;
                                    {(details as { user: { last_name: string } }).user.last_name}
                                </div>
                                <div className="text-base">
                                    {(details as { start_date: string }).start_date}
                                    &nbsp; - &nbsp;
                                    {(details as { end_date: string }).end_date}
                                </div>
                            </div>
                            <div className="text-lg font-semibold bg-green-50 rounded">
                                {(details as { user: { username: string } }).user.username}
                            </div>
                            <div className="text-lg font-semibold text-red-500 bg-red-50 rounded">
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
        </div>
    )
}